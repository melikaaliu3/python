from flask import Blueprint, jsonify

receipt_bp = Blueprint("receipts", __name__)

@receipt_bp.route("/receipts", methods=["GET"])
def get_receipts():
    return jsonify({"message": "List of receipts"})