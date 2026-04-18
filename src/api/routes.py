from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Habit
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 1. RUTA DE PRUEBA (SOLO UNA)
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Conectado al Servidor Exitosamente"}), 200

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

# 4. RUTA DE HÁBITOS
@api.route('/habits', methods=['POST'])
def handle_create_habit():
    body = request.get_json()
    if not body or 'name' not in body:
        return jsonify({"msg": "El nombre del hábito es obligatorio"}), 400
    
    new_habit = Habit(
        name=body['name'],
        description=body.get('description', ""),
        is_active=True
    )
    try:
        db.session.add(new_habit)
        db.session.commit()
        return jsonify(new_habit.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear hábito", "error": str(e)}), 500

#Cambios realizados por Alfredo NOTAS IMPORTMATE: dejo esto para saber que cambios realice en el código, ya que es importante para el seguimiento de los cambios y para que Miguel Antento pueda revisar los cambios realizados.
#realice estos cambios ya que no estaba corriendo el servidor debido a un error en la consola relacionado con una variable no definida. He corregido el código para asegurar de que el servidor funcione correctamente.
#Cambios que realice:
#Eliminé return jsonify response_body, 200: Esta línea estaba después de un return previo y usaba una variable que no estaba definida, lo que causaba el error en la consola.
#En las Importaciones: Uní User y Habit en una sola línea para que el código sea más legible y limpio.
#Miguel Antento con este cambio revisalo Seguridad en Hábitos: Agregué un pequeño chequeo para que si envían un hábito sin nombre, el servidor no se rompa y devuelva un mensaje de error.


@api.route('/habits', methods=['GET'])
def get_all_habits():
    all_habits = Habit.query.all()
    results = list(map(lambda x: x.serialize(), all_habits))
    return jsonify(results), 200
