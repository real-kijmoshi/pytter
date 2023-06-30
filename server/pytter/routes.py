from pytter import app, db, bcrypt
from flask import request
from flask_cors import CORS
from pytter.models import User, Tweet, Like
import re


EMAIL_REGEX = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


@app.route("/ping")
def ping():
    return "pong"

@app.route("/whoami")
def whoami():
    return {
        "username": "John Doe",
        "display_name": "john.doe@email.com",
        "avatar": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
    }


@app.route("/register", methods=["POST"])
def register():
    data = dict(request.json)
    if len(data["username"]) < 3 or len(data["username"]) > 20:
        return {"message": "Username must be between 3 and 20 characters long"}, 400
    if len(data["password"]) < 5 or len(data["password"]) > 20:
        return {"message": "Password must be between 5 and 20 characters long"}, 400
    if not re.match(EMAIL_REGEX, data["email"]):
        return {"message": "Invalid email"}, 400
    if User.query.filter_by(username=data["username"]).first():
        return {"message": "Username already taken"}, 400
    if User.query.filter_by(email=data["email"]).first():
        return {"message": "Email already taken"}, 400
    
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(username=data["username"], email=data["email"], password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    return {"message": "User created successfully"}, 201


@app.route("/login", methods=["POST"])
def login():
    data = dict(request.json)
    user = User.query.filter_by(username=data["username"]).first()
    if not user:
        return {"message": "Invalid username or password"}, 400
    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return {"message": "Invalid username or password"}, 400
    
    return {"message": "Login successful"}, 200