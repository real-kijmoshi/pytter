from pytter import app, db, bcrypt
from flask import request
from flask_cors import CORS
from pytter.models import User, Tweet, Like
from functools import wraps
import datetime
import jwt
import re


EMAIL_REGEX = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

### AUTHENTICATION ###

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        data = dict(request.json)
        if "token" in data.keys():
            token = data["token"]
        if not token:
            return {"message": "Token is missing"}, 401
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data["user_id"]).first()
        except Exception as e:
            print(e)
            return {"message": "Token is invalid"}, 401
        return f(current_user, *args, **kwargs)
    return decorated


@app.route("/register", methods=["POST"])
def register():
    data = dict(request.json)
    if not "username" in data.keys() or not "email" in data.keys() or not "password" in data.keys():
        return {"message": "Missing data"}, 400
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

    print(f"registered \"{data['username']}\" | \"{data['email']}\", password: \"{data['password']}\"")
    
    return {"message": "User created successfully"}, 201


@app.route("/login", methods=["POST"])
def login():
    data = dict(request.json)
    if not "username" in data.keys() or not "password" in data.keys():
        return {"message": "Missing data"}, 400
    user = User.query.filter_by(username=data["username"]).first()
    if not user:
        return {"message": "Invalid username or password"}, 400
    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return {"message": "Invalid username or password"}, 400
    
    token = jwt.encode({"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, app.config["SECRET_KEY"])
    return {"token": token}, 200


### TEST FUNCTIONS ###

@app.route("/ping")
def ping():
    return "pong"


@app.route("/whoami")
@token_required
def whoami(current_user):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "profile_picture": current_user.profile_picture,
        "display_name": current_user.display_name,
        "account_created": current_user.account_created
    }


### TWEETS ###

@app.route("/tweet", methods=["POST"])
@token_required
def tweet(current_user):
    data = dict(request.json)
    if not "content" in data.keys():
        return {"message": "Missing data"}, 400
    if len(data["content"]) < 1 or len(data["content"]) > 300:
        return {"message": "Tweet must be between 1 and 300 characters long"}, 400
    tweet = Tweet(content=data["content"], user_id=current_user.id)
    db.session.add(tweet)
    db.session.commit()
    return {"message": "Tweet sent successfully"}, 201


@app.route("/tweets", methods=["GET"])
def tweets():
    data = dict(request.json)
    if not "user_id" in data.keys():
        return {"message": "Missing data"}, 400
    tweets = Tweet.query.filter_by(user_id=data["user_id"]).all()
    if not tweets:
        return {"message": "No tweets found"}, 400
    return {"tweets": [{"id": tweet.id, "content": tweet.content, "user_id": tweet.user_id, "created": tweet.created} for tweet in tweets]}, 200


### LIKES ###

@app.route("/like", methods=["POST"])
@token_required
def like(current_user):
    data = dict(request.json)
    if not "tweet_id" in data.keys():
        return {"message": "Missing data"}, 400
    tweet = Tweet.query.filter_by(id=data["tweet_id"]).first()
    if not tweet:
        return {"message": "Invalid tweet id"}, 400
    like = Like.query.filter_by(user_id=current_user.id, tweet_id=data["tweet_id"]).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return {"message": "Tweet unliked successfully"}, 200
    like = Like(user_id=current_user.id, tweet_id=data["tweet_id"])
    db.session.add(like)
    db.session.commit()
    return {"message": "Tweet liked successfully"}, 201
    

@app.route("/likes", methods=["GET"])
def likes():
    data = dict(request.json)
    if not "user_id" in data.keys():
        return {"message": "Missing data"}, 400
    likes = Like.query.filter_by(user_id=data["user_id"]).all()
    if not likes:
        return {"message": "No likes found"}, 400
    return {"likes": [{"id": like.id, "user_id": like.user_id, "tweet_id": like.tweet_id} for like in likes]}, 200