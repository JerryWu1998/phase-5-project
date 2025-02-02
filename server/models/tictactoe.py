from sqlalchemy_serializer import SerializerMixin
from config import db


class TicTacToe(db.Model, SerializerMixin):
    __tablename__ = "tictactoes"

    id = db.Column(db.Integer, primary_key=True)
    player_x_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    player_o_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    current_player_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    game_status = db.Column(db.String, default="in_progress")
    winner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    table_id = db.Column(db.Integer, db.ForeignKey("tictactoetables.id"), nullable=True)

    player_x = db.relationship("User", foreign_keys=[player_x_id])
    player_o = db.relationship("User", foreign_keys=[player_o_id])
    current_player = db.relationship("User", foreign_keys=[current_player_id])
    steps = db.relationship("TicTacToeStep", back_populates="game")
    table = db.relationship("TicTacToeTable", foreign_keys=[table_id], back_populates="games")

    def __repr__(self):
        return f"<TicTacToe Game {self.id}>"

    serialize_rules = (
        "-player_x.sent_messages",
        "-player_x.received_messages",
        "-player_o.sent_messages",
        "-player_o.received_messages",
        "-current_player.sent_messages",
        "-current_player.received_messages",
        "-steps.game",
        "-steps.player",
        "-table",
    )

    def __repr__(self):
        return f"<TicTacToe Game {self.id}>"
