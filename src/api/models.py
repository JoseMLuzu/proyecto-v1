from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            # Do not include password for security reasons
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)


    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id
        }

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    category = db.relationship('Category', backref=db.backref('items', lazy=True))

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

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol
        }

