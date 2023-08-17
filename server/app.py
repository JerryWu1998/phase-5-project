#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from config import app, db, api, socketio
from models import User, Chat, TicTacToe, TicTacToeStep, TicTacToeTable

@app.route("/")
def index():
    return "<h1>Phase 5 Project Server</h1>"

# User Resource
class Users(Resource):
    """Resource for managing users."""

    def get(self):
        """Fetch all users."""
        return make_response([u.to_dict() for u in User.query.all()], 200)

    def post(self):
        """Add a new user."""
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
            db.session.rollback()
            return make_response({"error": f"Failed to add user: {str(e)}"}, 400)

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

        socketio.emit('broadcast_message', new_chat.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Error while sending message: {str(e)}")


@app.route("/check_session")
def check_session():
    if 'user_id' in session:
        user = User.query.filter_by(id=session['user_id']).first()
        if user:
            return make_response({"loggedIn": True, "user": user.to_dict()})
    return make_response({"loggedIn": False})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return make_response({'error': 'User not found'}, 404)

    if user.authenticate(password): 
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)
    else:
        return make_response({'error': 'Incorrect password'}, 401)

@app.route('/logout', methods=['DELETE'])
def logout():
    if 'user_id' in session:
        session.pop('user_id')
    return make_response({'message': 'Logged out successfully'}, 204)


# TicTacToe Resource
class TicTacToeGames(Resource):
    def get(self):
        return make_response([g.to_dict() for g in TicTacToe.query.all()])

    def post(self):
        data = request.get_json()
        try:
            new_game = TicTacToe(
                player_x_id=data['player_x_id'],
                player_o_id=data['player_o_id'],
                current_player_id=data['current_player_id']
            )
            db.session.add(new_game)
            db.session.commit()
            return make_response(new_game.to_dict(), 201)
        except Exception as e:
            return make_response({"error": "Error while creating game: " + str(e)}, 400)

class TicTacToeGameById(Resource):
    def get(self, id):
        game = TicTacToe.query.filter_by(id=id).first()
        if not game:
            return make_response({"message": "Game not found"}, 404)
        return make_response(game.to_dict())

api.add_resource(TicTacToeGames, '/tictactoes')
api.add_resource(TicTacToeGameById, '/tictactoes/<int:id>')


# TicTacToeStep Resource
class TicTacToeSteps(Resource):
    def get(self):
        return make_response([s.to_dict() for s in TicTacToeStep.query.all()])

    def post(self):
        data = request.get_json()
        try:
            new_step = TicTacToeStep(
                game_id=data['game_id'],
                player_id=data['player_id'],
                step_position=data['step_position']
            )
            db.session.add(new_step)
            db.session.commit()
            
            steps_of_current_player = [s.step_position for s in TicTacToeStep.query.filter_by(game_id=data['game_id'], player_id=data['player_id']).all()]
            if check_winner(steps_of_current_player):
                return make_response({"winner": data['player_id']})
            socketio.emit('broadcast_step', new_step.to_dict())
            socketio.emit('update_game', {'game_id': new_step.game_id})

            return make_response(new_step.to_dict(), 201)
        except Exception as e:
            return make_response({"error": "Error while making a step: " + str(e)}, 400)

def check_winner(steps_of_current_player):
    winning_combinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ]

    for combination in winning_combinations:
        if all(step in steps_of_current_player for step in combination):
            return True
    return False

api.add_resource(TicTacToeSteps, '/tictactoesteps')

# TicTacToeTable Resource
class TicTacToeTables(Resource):
    def get(self):
        return make_response([t.to_dict() for t in TicTacToeTable.query.all()])

    def post(self):
        data = request.get_json()
        try:
            new_table = TicTacToeTable(
                player_x_id=data['player_x_id'],
                player_o_id=data['player_o_id']
            )
            db.session.add(new_table)
            db.session.commit()
            return make_response(new_table.to_dict(), 201)
        except Exception as e:
            return make_response({"error": "Error while creating table: " + str(e)}, 400)

class TicTacToeTableById(Resource):
    def get(self, id):
        table = TicTacToeTable.query.filter_by(id=id).first()
        if not table:
            return make_response({"message": "Table not found"}, 404)
        return make_response(table.to_dict())

api.add_resource(TicTacToeTables, '/tictactoetables')
api.add_resource(TicTacToeTableById, '/tictactoetables/<int:id>')

@socketio.on('join_table')
def handle_join_table(data):
    table_id = data['table_id']
    position = data['position']
    user_id = data['user_id']

    table = TicTacToeTable.query.filter_by(id=table_id).first()
    if not table:
        # 返回错误消息
        socketio.emit('join_table_error', {'message': 'Table not found.'})
        return

    if position == "player_x_id":
        if table.player_x_id == user_id:
            # 如果用户再次点击相同的座位，则设置为null
            table.player_x_id = None
        elif not table.player_x_id:
            table.player_x_id = user_id
        else:
            socketio.emit('join_table_error', {'message': 'Position X already taken.'})
            return

    elif position == "player_o_id":
        if table.player_o_id == user_id:
            # 如果用户再次点击相同的座位，则设置为null
            table.player_o_id = None
        elif not table.player_o_id:
            table.player_o_id = user_id
        else:
            socketio.emit('join_table_error', {'message': 'Position O already taken.'})
            return

    db.session.commit()

    socketio.emit('update_table', table.to_dict())


if __name__ == "__main__":
    socketio.run(app, port=5555, debug=True)
