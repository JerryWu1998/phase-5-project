#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from config import app, db, api, socketio
from models import User, Chat

@app.route("/")
def index():
    return "<h1>Phase 5 Project Server</h1>"

# User Resource
class Users(Resource):
    def get(self):
        return make_response([u.to_dict() for u in User.query.all()])

    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return make_response({"error": "Username already exists. Please choose another."}, 400)
        try:
            new_user = User(username=data['username'], password_hash=data['password'])
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            return make_response({"error": [str(e)]}, 400)

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message": "User not found"}, 404)
        return make_response(user.to_dict())

    def patch(self, id):
        data = request.get_json()
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message": "User not found"}, 404)
        for key in data:
            setattr(user, key, data[key])
        db.session.commit()
        return make_response(user.to_dict())

api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')

# Chat Resource
class Chats(Resource):
    def get(self):
        return make_response([c.to_dict() for c in Chat.query.all()])

    def post(self):
        data = request.get_json()
        try:
            new_chat = Chat(sender_id=data['sender_id'], receiver_id=data['receiver_id'], message_content=data['message_content'])
            db.session.add(new_chat)
            db.session.commit()
            return make_response(new_chat.to_dict(), 201)
        except Exception as e:
            return make_response({"error": "Error while creating chat: " + str(e)}, 400)

class ChatById(Resource):
    def get(self, id):
        chat = Chat.query.filter_by(id=id).first()
        if not chat:
            return make_response({"message": "Chat not found"}, 404)
        return make_response(chat.to_dict())

    def patch(self, id):
        data = request.get_json()
        chat = Chat.query.filter_by(id=id).first()
        if not chat:
            return make_response({"message": "Chat not found"}, 404)
        for key in data:
            setattr(chat, key, data[key])
        db.session.commit()
        return make_response(chat.to_dict())

api.add_resource(Chats, '/chats')
api.add_resource(ChatById, '/chats/<int:id>')

# WebSocket route for live chat
@socketio.on('send_message')
def handle_message(data):
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    message_content = data['message_content']

    try:
        new_chat = Chat(sender_id=sender_id, receiver_id=receiver_id, message_content=message_content)
        db.session.add(new_chat)
        db.session.commit()

        # Broadcast the message to all connected clients
        socketio.emit('broadcast_message', new_chat.to_dict())
    except Exception as e:
        print(f"Error while sending message: {str(e)}")


@app.route("/check_session")
def check_session():
    # Check if user_id exists in session
    if 'user_id' in session:
        user = User.query.filter_by(id=session['user_id']).first()
        if user:
            # Return the user's information if logged in
            return make_response({"loggedIn": True, "user": user.to_dict()})
    # Return that the user is not logged in
    return make_response({"loggedIn": False})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if user exists
    user = User.query.filter_by(username=username).first()
    if not user:
        return make_response({'error': 'User not found'}, 404)

    # Authenticate the user
    if user.authenticate(password):  # Ensure your User model has this method
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)
    else:
        return make_response({'error': 'Incorrect password'}, 401)

@app.route('/logout', methods=['DELETE'])
def logout():
    if 'user_id' in session:
        session.pop('user_id')
    return make_response({'message': 'Logged out successfully'}, 204)



if __name__ == "__main__":
    socketio.run(app, port=5555, debug=True)
