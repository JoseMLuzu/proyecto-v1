from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
import os
from datetime import timedelta

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
jwt = JWTManager(app)

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Añadir el administrador
setup_admin(app)

# Añadir los comandos de administración
setup_commands(app)

# Añadir todos los endpoints de la API con un prefijo "api"
app.register_blueprint(api, url_prefix='/api')

# Manejar/serializar errores como un objeto JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Servir cualquier otro archivo como archivo estático
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Endpoint de registro
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not email or not password or not confirm_password:
        return jsonify({"success": False, "message": "Todos los campos son requeridos."}), 400

    if password != confirm_password:
        return jsonify({"success": False, "message": "Las contraseñas no coinciden."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "El nombre de usuario ya está en uso."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "El correo electrónico ya está registrado."}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True}), 201

# Endpoint de inicio de sesión
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Todos los campos son requeridos."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"success": False, "message": "Credenciales inválidas."}), 400

    access_token = create_access_token(
        identity=user.id, 
        expires_delta=timedelta(days=30)
    )

    return jsonify({"success": True, "access_token": access_token}), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
