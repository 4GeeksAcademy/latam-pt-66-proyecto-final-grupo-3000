from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.models import db, Habit
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 1. RUTA DE PRUEBA (SOLO UNA)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Servidor funcionando"}), 200

# 2. RUTA DE LOGIN (ALFREDO)


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400

    email = body.get("email")
    password = body.get("password")
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({"msg": "Credenciales incorrectas"}), 401
    return jsonify({"msg": "Login exitoso", "user_id": user.id}), 200

# 3. RUTA DE REGISTRO (TUYA)


@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password obligatorios"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(email=email, password=password, is_active=True)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error de servidor", "error": str(e)}), 500


@api.route('/habits', methods=['GET'])
def get_all_habits():
    all_habits = Habit.query.all()
    results = list(map(lambda x: x.serialize(), all_habits))
    return jsonify(results), 200
