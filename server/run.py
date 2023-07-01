from pytter import app, db
import pytter.routes
from pytter.models import User, Tweet, Like


app.app_context().push()
db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)