from pytter import app, db, bcrypt
from flask import request
from flask_cors import CORS
from pytter.models import User, Tweet, Like
from sqlalchemy.orm import joinedload
from functools import wraps
import datetime
import jwt
import re


EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


def get_avatar_url(username):
    return f"https://ui-avatars.com/api/?name={username}&background=1d9bf0&color=fff&size=64"


### AUTHENTICATION ###

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer":
            return {"message": "Missing token"}, 401
        token = parts[1]
        if not token:
            return {"message": "Missing token"}, 401
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data["user_id"]).first()
        except Exception as e:
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
        "avatar": get_avatar_url(current_user.username),
        "display_name": current_user.display_name or current_user.username,
        "account_created": current_user.account_created.isoformat() if current_user.account_created else None
    }


### TWEETS ###

@app.route("/tweet", methods=["POST"])
@token_required
def tweet(current_user):
    data = dict(request.json)
    if not "content" in data.keys():
        return {"message": "Missing data"}, 400
    if len(data["content"]) < 1 or len(data["content"]) > 280:
        return {"message": "Tweet must be between 1 and 280 characters long"}, 400
    new_tweet = Tweet(content=data["content"], user_id=current_user.id)
    db.session.add(new_tweet)
    db.session.commit()
    return {"message": "Tweet sent successfully"}, 201


@app.route("/tweets", methods=["GET"])
def tweets():
    user_id = request.args.get("user_id")
    if not user_id:
        return {"message": "Missing user_id"}, 400
    user_tweets = Tweet.query.filter_by(user_id=user_id).order_by(Tweet.date_posted.desc()).all()
    return {"tweets": [{"id": t.id, "content": t.content, "user_id": t.user_id, "date_posted": t.date_posted.isoformat()} for t in user_tweets]}, 200


@app.route("/feed", methods=["GET"])
def feed():
    feed_tweets = Tweet.query.options(joinedload(Tweet.author)).order_by(Tweet.date_posted.desc()).limit(50).all()
    result = []
    for t in feed_tweets:
        author = t.author
        result.append({
            "id": t.id,
            "content": t.content,
            "date_posted": t.date_posted.isoformat(),
            "like_count": len(t.likes),
            "author": {
                "username": author.username,
                "display_name": author.display_name or author.username,
                "avatar": get_avatar_url(author.username),
            },
        })
    return {"tweets": result}, 200


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
    existing_like = Like.query.filter_by(user_id=current_user.id, tweet_id=data["tweet_id"]).first()
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return {"message": "Tweet unliked successfully"}, 200
    new_like = Like(user_id=current_user.id, tweet_id=data["tweet_id"])
    db.session.add(new_like)
    db.session.commit()
    return {"message": "Tweet liked successfully"}, 201


@app.route("/likes", methods=["GET"])
def likes():
    user_id = request.args.get("user_id")
    if not user_id:
        return {"message": "Missing user_id"}, 400
    user_likes = Like.query.filter_by(user_id=user_id).all()
    return {"likes": [{"id": l.id, "user_id": l.user_id, "tweet_id": l.tweet_id} for l in user_likes]}, 200