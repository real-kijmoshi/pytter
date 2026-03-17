from pytter import app, db
import pytter.routes
import os


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes')
    app.run(debug=debug, port=int(os.environ.get('PORT', 5000)))