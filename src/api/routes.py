from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Habitos, HabitoRegistro, Categoria
import datetime
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Conectado al Servidor Exitosamente"}), 200

@api.route('/login', methods=['POST'])
def handle_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({"msg": "Email o contraseña incorrectas"}), 401

# 3. RUTA DE REGISTRO (TUYA)
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()

    # Validaciones básicas
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400
    if 'email' not in body or 'password' not in body:
        return jsonify({"msg": "Email y password requeridos"}), 400

    # Evitar duplicados
    user_exists = User.query.filter_by(email=body['email']).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Crear y Guardar
    new_user = User(
        email=body['email'],
        password=body['password'],
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit() # <--- Aquí se guarda físicamente en el archivo .db
        return jsonify({"msg": "Usuario creado correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar"}), 500

@api.route('/habitos/<int:habito_id>/registros', methods=['GET'])
@jwt_required()
def obtener_registros(habito_id):
    user_id = get_jwt_identity()
    habito = Habito.query.filter_by(id=habito_id, user_id=user_id).first()
    if not habito:
        return jsonify({"msg": "Hábito no encontrado"}), 404
    registros = HabitoRegistro.query.filter_by(habito_id=habito_id).all()
    return jsonify([r.serialize() for r in registros]), 200

@api.route('/perfil', methods=['GET'])
@jwt_required()
def get_perfil():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.serialize()), 200

@api.route('/perfil', methods=['PUT'])
@jwt_required()
def editar_perfil():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    user.nombre = request.json.get("nombre", user.nombre)
    user.apellido = request.json.get("apellido", user.apellido)
    nueva_password = request.json.get("password", None)
    if nueva_password:
        user.password = nueva_password
    db.session.commit()
    return jsonify(user.serialize()), 200
