import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from api.utils import APIException, generate_sitemap
from api.models import db, User, Category, PasswordResetToken, Item
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import timedelta, datetime
import secrets

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de CORS
CORS(app,)

# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://") if db_url else "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
jwt = JWTManager(app)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

# Configuración de migraciones
Migrate(app, db, compare_type=True)
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

    if not username or not email or not password:
        return jsonify({"success": False, "message": "Todos los campos son requeridos."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "El nombre de usuario ya está en uso."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "El correo electrónico ya está registrado."}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Enviar correo de confirmación
    html = f"""
    <html>
    <head>
        <style>
            .email-container {{
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .email-header {{
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
                font-size: 24px;
            }}
            .email-body {{
                background-color: white;
                padding: 20px;
                margin: 10px 0;
                border-radius: 5px;
            }}
            .email-footer {{
                text-align: center;
                font-size: 12px;
                color: #aaa;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Confirmación de Registro
            </div>
            <div class="email-body">
                <h1>Hola {username},</h1>
                <p>Tu cuenta ha sido creada con éxito. ¡Bienvenido a nuestra plataforma!</p>
            </div>
            <div class="email-footer">
                <p>Este correo fue generado automáticamente, por favor no respondas.</p>
            </div>
        </div>
    </body>
    </html>
    """
    msg = Message('Confirmación de Registro', recipients=[email], html=html)
    mail.send(msg)

    return jsonify({"success": True, "message": "Usuario registrado con éxito. Se ha enviado un correo de confirmación."}), 201

# Endpoint de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Todos los campos son requeridos."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"success": False, "message": "Correo electrónico o contraseña incorrectos."}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"success": True, "access_token": access_token}), 200

# Endpoint para solicitar restablecimiento de contraseña
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"success": False, "message": "El correo electrónico es requerido."}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"success": False, "message": "No se encontró un usuario con ese correo electrónico."}), 404

    # Generar un token para el restablecimiento de contraseña
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    reset_token = PasswordResetToken(
        token=token, 
        user_id=user.id, 
        expiration=expires_at
    )
    db.session.add(reset_token)
    db.session.commit()

    # Crear el diseño HTML para el correo de restablecimiento de contraseña
    html = f"""
    <html>
    <head>
        <style>
            .email-container {{
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .email-header {{
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
                font-size: 24px;
            }}
            .email-body {{
                background-color: white;
                padding: 20px;
                margin: 10px 0;
                border-radius: 5px;
            }}
            .reset-link {{
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }}
            .email-footer {{
                text-align: center;
                font-size: 12px;
                color: #aaa;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Restablecimiento de Contraseña
            </div>
            <div class="email-body">
                <p>Hola {user.username},</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Puedes hacerlo haciendo clic en el siguiente enlace:</p>
                <p><a href="{os.getenv('FRONTEND_URL')}reset-password/{token}" class="reset-link">Restablecer Contraseña</a></p>
                <p>Si no solicitaste un restablecimiento de contraseña, simplemente ignora este correo.</p>
            </div>
            <div class="email-footer">
                <p>Este correo fue generado automáticamente, por favor no respondas.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Enviar el correo
    msg = Message('Restablecimiento de Contraseña', recipients=[email], html=html)
    mail.send(msg)

    return jsonify({"success": True, "message": "Correo de restablecimiento de contraseña enviado."}), 200

# Endpoint para restablecer contraseña
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"success": False, "message": "El token y la nueva contraseña son requeridos."}), 400

    reset_token = PasswordResetToken.query.filter_by(token=token).first()

    if not reset_token or reset_token.expiration < datetime.utcnow():
        return jsonify({"success": False, "message": "Token inválido o expirado."}), 400

    user = User.query.get(reset_token.user_id)
    if not user:
        return jsonify({"success": False, "message": "Usuario no encontrado."}), 404

    user.password = generate_password_hash(new_password)
    db.session.commit()

    # Eliminar el token después de su uso
    db.session.delete(reset_token)
    db.session.commit()

    return jsonify({"success": True, "message": "Contraseña restablecida con éxito."}), 200

# Endpoints para categorías
@app.route('/api/categories', methods=['POST'])
@jwt_required()
def add_category():
    data = request.get_json()
    if not data or 'name' not in data or 'user_id' not in data:
        return jsonify({"msg": "Name and user_id are required"}), 400
    try:
        new_category = Category(name=data['name'], user_id=data['user_id'])
        db.session.add(new_category)
        db.session.commit()
        return jsonify(new_category.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para obtener todas las categorías
@app.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.serialize() for category in categories]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para eliminar categoría
@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"msg": "Category not found"}), 404
        db.session.delete(category)
        db.session.commit()
        return jsonify({"msg": "Category deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para agregar ítem
@app.route('/api/items', methods=['POST'])
@jwt_required()
def add_item():
    data = request.get_json()
    if not data or 'name' not in data or 'price' not in data or 'category_id' not in data or 'user_id' not in data:
        return jsonify({"msg": "Name, price, category_id, and user_id are required"}), 400
    try:
        new_item = Item(name=data['name'], price=data['price'], category_id=data['category_id'], user_id=data['user_id'])
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para obtener todos los ítems
@app.route('/api/items', methods=['GET'])
@jwt_required()
def get_items():
    try:
        items = Item.query.all()
        return jsonify([item.serialize() for item in items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para eliminar ítem
@app.route('/api/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    try:
        item = Item.query.get(item_id)
        if not item:
            return jsonify({"msg": "Item not found"}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": "Item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3001)), debug=ENV == "development")
