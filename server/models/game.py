from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db

class Game(db.Model, SerializerMixin):
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    player1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    player2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_status = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    moves = db.relationship('Move', backref='game')
    chats = db.relationship('Chat', backref='game')

    serialize_rules = ('-moves.game', '-chats.game', '-player1.games_as_player1', '-player2.games_as_player2')

    def __repr__(self):
        return f'<Game {self.id} between {self.player1.username} and {self.player2.username}>'
