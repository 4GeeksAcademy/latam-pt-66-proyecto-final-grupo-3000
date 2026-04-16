"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.models import db, Habit 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route('/habits', methods=['POST'])
def handle_create_habit():
    body = request.get_json()
    
    new_habit = Habit(
        name=body['name'],
        description=body.get('description', ""), 
        is_active=True
    )
    db.session.add(new_habit)
    db.session.commit()
   
    return jsonify(new_habit.serialize()), 201

 