from sqlalchemy_serializer import SerializerMixin
from config import db
from .tictactoe import TicTacToe

class TicTacToeTable(db.Model, SerializerMixin):
    __tablename__ = 'tictactoetables'

    id = db.Column(db.Integer, primary_key=True)
    player_x_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    player_o_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    player_x = db.relationship('User', foreign_keys=[player_x_id])
    player_o = db.relationship('User', foreign_keys=[player_o_id])
    games = db.relationship('TicTacToe', back_populates='table', foreign_keys=[TicTacToe.table_id])

    def start_game(self):
        if self.player_x and self.player_o:
            game = TicTacToe(player_x_id=self.player_x_id, player_o_id=self.player_o_id, current_player_id=self.player_x_id, table_id=self.id)
            db.session.add(game)
            db.session.commit()

    serialize_rules = ('-player_x', 
                       '-player_o', 
                       '-games.table',)

    def __repr__(self):
        return f'<TicTacToeTable {self.id} Player X: {self.player_x_id} Player O: {self.player_o_id}>'
