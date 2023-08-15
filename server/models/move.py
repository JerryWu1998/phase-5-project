from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db

class Move(db.Model, SerializerMixin):
    __tablename__ = 'moves'
    
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    move_data = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    serialize_rules = ('-game.moves', '-player.games_as_player1', '-player.games_as_player2', '-player.moves')

    def __repr__(self):
        return f'<Move {self.id} in Game {self.game_id} by User {self.user_id}>'
