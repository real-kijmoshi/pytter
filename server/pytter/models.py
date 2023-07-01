from datetime import datetime
from pytter import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    profile_picture = db.Column(db.String(40), nullable=False, default='default.jpg')
    display_name = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    tweets = db.relationship('Tweet', backref='author', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)
    account_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"User({self.id}, '{self.username}', '{self.email}', '{self.profile_picture}', '{self.account_created}')"
    

class Tweet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    likes = db.relationship('Like', backref='tweet', lazy=True)

    def __repr__(self):
        return f"Tweet('{self.content}', '{self.date_posted}')"
    

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tweet_id = db.Column(db.Integer, db.ForeignKey('tweet.id'), nullable=False)

    def __repr__(self):
        return f"Like('{self.user_id}', '{self.tweet_id}')"
    