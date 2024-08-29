from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    
    # Relaciones
    categories = db.relationship('Category', backref='user', lazy=True, cascade='all, delete-orphan')
    items = db.relationship('Item', backref='user', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            # No incluir la contraseña por razones de seguridad
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    
    # Relación con User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relación con Item
    items = db.relationship('Item', backref='category', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id
        }

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)  # Cambiado de 'amount' a 'price'
    
    # Relación con Category
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    
    # Relación con User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Item {self.name} in Category {self.category.name}>'

    def serialize(self):
        category_name = self.category.name if self.category else 'Unknown'
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category': category_name,
            'user_id': self.user_id
        }

class Crypto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f'<Crypto {self.name} ({self.symbol})>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol
        }

class PasswordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    token = db.Column(db.String(255), nullable=False, unique=True)
    expiration = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = db.relationship('User', backref=db.backref('reset_tokens', lazy=True, cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<PasswordResetToken {self.token} for User {self.user_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expiration': self.expiration.isoformat(),
            'created_at': self.created_at.isoformat()
        }
