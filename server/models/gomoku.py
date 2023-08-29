from sqlalchemy_serializer import SerializerMixin
from config import db


class Gomoku(db.Model, SerializerMixin):
    __tablename__ = "gomokus"

    id = db.Column(db.Integer, primary_key=True)
    player_black_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    player_white_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    current_player_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    game_status = db.Column(db.String, default="in_progress")
    winner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    table_id = db.Column(db.Integer, db.ForeignKey("gomokutables.id"), nullable=True)

    player_black = db.relationship("User", foreign_keys=[player_black_id])
    player_white = db.relationship("User", foreign_keys=[player_white_id])
    current_player = db.relationship("User", foreign_keys=[current_player_id])
    steps = db.relationship("GomokuStep", back_populates="game")
    table = db.relationship("GomokuTable", back_populates="games")

    serialize_rules = (
        "-player_black.sent_messages",
        "-player_black.received_messages",
        "-player_white.sent_messages",
        "-player_white.received_messages",
        "-current_player.sent_messages",
        "-current_player.received_messages",
        "-steps.game",
        "-steps.player",
        "-table",
    )

    def __repr__(self):
        return f"<Gomoku Game {self.id}>"
