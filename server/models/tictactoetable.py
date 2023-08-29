from sqlalchemy_serializer import SerializerMixin
from config import db


class TicTacToeTable(db.Model, SerializerMixin):
    __tablename__ = "tictactoetables"

    id = db.Column(db.Integer, primary_key=True)
    player_x_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    player_o_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    player_x = db.relationship("User", foreign_keys=[player_x_id])
    player_o = db.relationship("User", foreign_keys=[player_o_id])
    games = db.relationship("TicTacToe", back_populates="table")

    serialize_rules = (
        "-player_x.sent_messages",
        "-player_x.received_messages",
        "-player_o.sent_messages",
        "-player_o.received_messages",
        "-games",
    )

    def __repr__(self):
        return f"<TicTacToeTable {self.id} Player X: {self.player_x_id} Player O: {self.player_o_id}>"
