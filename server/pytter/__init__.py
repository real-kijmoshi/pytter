from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import secrets


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///pytter.db')

_secret_key = os.environ.get('SECRET_KEY')
if not _secret_key:
    _secret_key = secrets.token_hex(32)
    import warnings
    warnings.warn(
        "SECRET_KEY is not set. A random key has been generated, but all sessions "
        "will be invalidated on restart. Set the SECRET_KEY environment variable "
        "for production use.",
        stacklevel=2,
    )
app.config['SECRET_KEY'] = _secret_key

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

_cors_origins = os.environ.get('CORS_ORIGINS', '*')
CORS(app, origins=_cors_origins.split(',') if _cors_origins != '*' else '*')

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[],
    storage_uri=os.environ.get('RATELIMIT_STORAGE_URI', 'memory://'),
)