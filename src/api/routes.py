from flask import request, jsonify, Blueprint
from api.models import db, User, Habit
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Conectado al Servidor Exitosamente"}), 200


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400

    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"msg": "Login exitoso", "token": token, "user_id": user.id}), 200


@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(email=email, password=generate_password_hash(password), is_active=True)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error de servidor", "error": str(e)}), 500


@api.route('/habitos', methods=['GET'])
@jwt_required()
def handle_get_habitos():
    user_id = int(get_jwt_identity())
    habitos = Habit.query.filter_by(user_id=user_id).all()
    return jsonify([h.serialize() for h in habitos]), 200


@api.route('/habitos', methods=['POST'])
@jwt_required()
def handle_create_habito():
    body = request.get_json()
    if not body or not body.get("name"):
        return jsonify({"msg": "El nombre del hábito es obligatorio"}), 400

    user_id = int(get_jwt_identity())
    new_habit = Habit(
        name=body["name"],
        description=body.get("description", ""),
        is_active=True,
        user_id=user_id
    )
    db.session.add(new_habit)
    db.session.commit()
    return jsonify(new_habit.serialize()), 201
