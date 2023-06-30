from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import secrets


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pytter.db'
app.config['SECRET_KEY'] = secrets.token_hex(16)
print(f"SECRET_KEY: \"{app.config['SECRET_KEY']}\"")
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)