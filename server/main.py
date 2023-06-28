from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)

@app.route("/ping", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def ping():
    return "Pong!"

@app.route("/whoami", methods=["POST"])
@cross_origin(origin='http://localhost:3000',headers=['Authorization'])
def helloWorld():
    #later we will get the user from the token and return it here but for now we will just return a dummy user object because we don't have a token yet and we don't have a user object yet either so we will just return a dummy user object for now and later we will get the user from the token and return it here  :)
    return {
        "username": "John Doe2",
        "displayName": "John Doe",
        "avatar": "https://avatars.githubusercontent.com/u/2868?s=460&u=8a2a5d4b2e4d4b0e9b9b0b9b0b9b0b9b0b9b0b9b&v=4"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)