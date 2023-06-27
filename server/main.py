from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)

@app.route("/whoami", methods=["POST"])
@cross_origin(origin='http://localhost:3000',headers=['Authorization'])
def helloWorld():
    return {
        "username": "John Doe2",
        "displayName": "John Doe",
        "avatar": "https://avatars.githubusercontent.com/u/2868?s=460&u=8a2a5d4b2e4d4b0e9b9b0b9b0b9b0b9b0b9b0b9b&v=4"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)