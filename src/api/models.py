from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# Instancia de SQLAlchemy para manejar la base de datos
db = SQLAlchemy()

class User(db.Model):
    # Definición del modelo User, que representa una tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)  # Columna de identificación, clave primaria
    username = db.Column(db.String(50), unique=True, nullable=False)  # Nombre de usuario único y obligatorio
    email = db.Column(db.String(120), unique=True, nullable=False)  # Correo electrónico único y obligatorio
    password = db.Column(db.String(200), nullable=False)  # Contraseña, obligatoria
    
    # Relaciones con otros modelos
    categories = db.relationship('Category', backref='user', lazy=True, cascade='all, delete-orphan')
    items = db.relationship('Item', backref='user', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        # Representación en cadena de caracteres del modelo User
        return f'<User {self.username}>'

    def to_dict(self):
        # Método para convertir el modelo User a un diccionario
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }

class Category(db.Model):
    # Definición del modelo Category, que representa una tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)  # Columna de identificación, clave primaria
    name = db.Column(db.String(120), nullable=False)  # Nombre de la categoría, obligatorio
    
    # Relación con el modelo User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Clave foránea a User
    
    # Relación con el modelo Item
    items = db.relationship('Item', backref='category', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        # Representación en cadena de caracteres del modelo Category
        return f'<Category {self.name}>'

    def serialize(self):
        # Método para convertir el modelo Category a un diccionario
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id
        }

class Item(db.Model):
    # Definición del modelo Item, que representa una tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)  # Columna de identificación, clave primaria
    name = db.Column(db.String(120), nullable=False)  # Nombre del ítem, obligatorio
    price = db.Column(db.Float, nullable=False)  # Precio del ítem, obligatorio
    
    # Claves foráneas para las relaciones
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  # Clave foránea a Category
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Clave foránea a User

    def __repr__(self):
        # Representación en cadena de caracteres del modelo Item
        return f'<Item {self.name} in Category {self.category.name}>'

    def serialize(self):
        # Método para convertir el modelo Item a un diccionario
        category_name = self.category.name if self.category else 'Unknown'
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category': category_name,
            'user_id': self.user_id
        }

class Crypto(db.Model):
    # Definición del modelo Crypto, que representa una tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)  # Columna de identificación, clave primaria
    name = db.Column(db.String(120), nullable=False)  # Nombre de la criptomoneda, obligatorio
    symbol = db.Column(db.String(10), nullable=False)  # Símbolo de la criptomoneda, obligatorio

    def __repr__(self):
        # Representación en cadena de caracteres del modelo Crypto
        return f'<Crypto {self.name} ({self.symbol})>'

    def serialize(self):
        # Método para convertir el modelo Crypto a un diccionario
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol
        }

class PasswordResetToken(db.Model):
    # Definición del modelo PasswordResetToken, que representa una tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)  # Columna de identificación, clave primaria
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)  # Clave foránea a User
    token = db.Column(db.String(255), nullable=False, unique=True)  # Token de reseteo de contraseña, único y obligatorio
    expiration = db.Column(db.DateTime, nullable=False)  # Fecha de expiración del token, obligatoria
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)  # Fecha de creación del token, obligatoria

    user = db.relationship('User', backref=db.backref('reset_tokens', lazy=True, cascade='all, delete-orphan'))

    def __repr__(self):
        # Representación en cadena de caracteres del modelo PasswordResetToken
        return f'<PasswordResetToken {self.token} for User {self.user_id}>'

    def serialize(self):
        # Método para convertir el modelo PasswordResetToken a un diccionario
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expiration': self.expiration.isoformat(),
            'created_at': self.created_at.isoformat()
        }
