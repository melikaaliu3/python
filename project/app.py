from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes.category_routes import category_bp
from routes.receipt_routes import receipt_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

app.register_blueprint(category_bp)
app.register_blueprint(receipt_bp)

if __name__ == "__main__":
    app.run(debug=True)