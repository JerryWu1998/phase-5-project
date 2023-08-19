from sqlalchemy_serializer import SerializerMixin
from config import db

class TicTacToeStep(db.Model, SerializerMixin):
    __tablename__ = 'tictactoesteps'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('tictactoes.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    step_position = db.Column(db.Integer, nullable=False)

    game = db.relationship('TicTacToe', back_populates='steps')
    player = db.relationship('User', back_populates='game_steps')

    serialize_rules = ('-game.player_x',
                       '-game.player_o',
                       '-game.current_player',
                       '-game.steps',

                       '-player.game_steps',
                       '-player.sent_messages',
                       '-player.received_messages',
                       )
    
    def __repr__(self):
        return f'<TicTacToeStep {self.id} for Game {self.game_id}>'
