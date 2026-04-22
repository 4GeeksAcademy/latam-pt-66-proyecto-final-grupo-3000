from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Habito, HabitoRegistro, Categoria
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

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id, "nombre": user.nombre}), 200

@api.route('/registro', methods=['POST'])
def handle_registro():
    nombre = request.json.get("nombre", None)
    apellido = request.json.get("apellido", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not nombre or not apellido or not email or not password:
        return jsonify({"msg": "Todos los campos son requeridos"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(nombre=nombre, apellido=apellido, email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"token": access_token, "user_id": new_user.id, "nombre": new_user.nombre}), 201

# Compatibilidad con clientes antiguos que siguen usando /signup.
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "Cuerpo vacío"}), 400

    nombre = body.get("nombre", "")
    apellido = body.get("apellido", "")
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password requeridos"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password=password,
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({"token": access_token, "user_id": new_user.id, "nombre": new_user.nombre}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar"}), 500

@api.route('/categorias', methods=['GET'])
@jwt_required()
def listar_categorias():
    user_id = get_jwt_identity()
    cats = Categoria.query.filter_by(user_id=user_id).all()
    return jsonify([c.serialize() for c in cats]), 200

@api.route('/categorias', methods=['POST'])
@jwt_required()
def crear_categoria():
    user_id = get_jwt_identity()
    nombre = request.json.get("nombre", None)
    color = request.json.get("color", "primary")
    if not nombre:
        return jsonify({"msg": "El nombre es requerido"}), 400
    cat = Categoria(nombre=nombre, color=color, user_id=user_id)
    db.session.add(cat)
    db.session.commit()
    return jsonify(cat.serialize()), 201

@api.route('/categorias/<int:cat_id>', methods=['PUT'])
@jwt_required()
def editar_categoria(cat_id):
    user_id = get_jwt_identity()
    cat = Categoria.query.filter_by(id=cat_id, user_id=user_id).first()
    if not cat:
        return jsonify({"msg": "Categoría no encontrada"}), 404
    cat.nombre = request.json.get("nombre", cat.nombre)
    cat.color = request.json.get("color", cat.color)
    db.session.commit()
    return jsonify(cat.serialize()), 200

@api.route('/habitos', methods=['POST'])
@jwt_required()
def crear_habito():
    user_id = get_jwt_identity()
    nombre = request.json.get("nombre", None)
    descripcion = request.json.get("descripcion", "")
    categoria_id = request.json.get("categoria_id", None)

    if not nombre:
        return jsonify({"msg": "El nombre del hábito es requerido"}), 400

    habito = Habito(nombre=nombre, descripcion=descripcion, is_active=True, user_id=user_id, categoria_id=categoria_id)
    db.session.add(habito)
    db.session.commit()

    return jsonify(habito.serialize()), 201

@api.route('/habitos', methods=['GET'])
@jwt_required()
def listar_habitos():
    user_id = get_jwt_identity()
    habitos = Habito.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([h.serialize() for h in habitos]), 200

@api.route('/habitos/<int:habito_id>', methods=['PUT'])
@jwt_required()
def editar_habito(habito_id):
    user_id = get_jwt_identity()
    habito = Habito.query.filter_by(id=habito_id, user_id=user_id).first()
    if not habito:
        return jsonify({"msg": "Hábito no encontrado"}), 404
    habito.nombre = request.json.get("nombre", habito.nombre)
    habito.descripcion = request.json.get("descripcion", habito.descripcion)
    habito.categoria_id = request.json.get("categoria_id", habito.categoria_id)
    db.session.commit()
    return jsonify(habito.serialize()), 200

@api.route('/habitos/<int:habito_id>', methods=['DELETE'])
@jwt_required()
def eliminar_habito(habito_id):
    user_id = get_jwt_identity()
    habito = Habito.query.filter_by(id=habito_id, user_id=user_id).first()
    if not habito:
        return jsonify({"msg": "Hábito no encontrado"}), 404

    habito.is_active = False
    db.session.commit()
    return jsonify({"msg": "Hábito eliminado"}), 200

@api.route('/habitos/<int:habito_id>/registro', methods=['POST'])
@jwt_required()
def marcar_habito(habito_id):
    user_id = get_jwt_identity()
    habito = Habito.query.filter_by(id=habito_id, user_id=user_id).first()
    if not habito:
        return jsonify({"msg": "Hábito no encontrado"}), 404
    fecha_str = request.json.get("fecha", None)
    if fecha_str:
        fecha = datetime.date.fromisoformat(fecha_str)
    else:
        fecha = datetime.date.today()
    existente = HabitoRegistro.query.filter_by(habito_id=habito_id, fecha=fecha).first()
    if existente:
        db.session.delete(existente)
        db.session.commit()
        return jsonify({"msg": "Registro eliminado", "fecha": fecha.isoformat(), "completado": False}), 200
    registro = HabitoRegistro(habito_id=habito_id, fecha=fecha, completado=True)
    db.session.add(registro)
    db.session.commit()
    return jsonify(registro.serialize()), 201

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
