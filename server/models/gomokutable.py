from sqlalchemy_serializer import SerializerMixin
from config import db


class GomokuTable(db.Model, SerializerMixin):
    __tablename__ = "gomokutables"

    id = db.Column(db.Integer, primary_key=True)
    player_black_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    player_white_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    player_black = db.relationship("User", foreign_keys=[player_black_id])
    player_white = db.relationship("User", foreign_keys=[player_white_id])
    games = db.relationship("Gomoku", back_populates="table")

    serialize_rules = (
        "-player_black",
        "-player_white",
        "-games",
    )

    def __repr__(self):
        return f"<GomokuTable {self.id} Player Black: {self.player_black_id} Player White: {self.player_white_id}>"
