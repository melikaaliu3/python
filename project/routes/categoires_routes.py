from flask import Blueprint, jsonify

category_bp = Blueprint("categories", __name__)

@category_bp.route("/categories", methods=["GET"])
def get_categories():
    return jsonify({"message": "List of categories"})