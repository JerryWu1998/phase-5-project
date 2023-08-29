from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt
from sqlalchemy.orm import validates


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    # Chat relationship
    sent_messages = db.relationship(
        "Chat", back_populates="sender", foreign_keys="Chat.sender_id"
    )
    received_messages = db.relationship(
        "Chat", back_populates="receiver", foreign_keys="Chat.receiver_id"
    )

    # Tictactoe relationship
    tic_tac_toe_as_x = db.relationship(
        "TicTacToe", foreign_keys="TicTacToe.player_x_id", back_populates="player_x"
    )
    tic_tac_toe_as_o = db.relationship(
        "TicTacToe", foreign_keys="TicTacToe.player_o_id", back_populates="player_o"
    )
    tic_tac_toe_as_current = db.relationship(
        "TicTacToe",
        foreign_keys="TicTacToe.current_player_id",
        back_populates="current_player",
    )
    tables_as_x = db.relationship(
        "TicTacToeTable",
        foreign_keys="TicTacToeTable.player_x_id",
        back_populates="player_x",
    )
    tables_as_o = db.relationship(
        "TicTacToeTable",
        foreign_keys="TicTacToeTable.player_o_id",
        back_populates="player_o",
    )

    # Gomoku relationship
    gomoku_as_black = db.relationship(
        "Gomoku", foreign_keys="Gomoku.player_black_id", back_populates="player_black"
    )
    gomoku_as_white = db.relationship(
        "Gomoku", foreign_keys="Gomoku.player_white_id", back_populates="player_white"
    )
    gomoku_as_current = db.relationship(
        "Gomoku",
        foreign_keys="Gomoku.current_player_id",
        back_populates="current_player",
    )
    gomoku_tables_as_black = db.relationship(
        "GomokuTable",
        foreign_keys="GomokuTable.player_black_id",
        back_populates="player_black",
    )
    gomoku_tables_as_white = db.relationship(
        "GomokuTable",
        foreign_keys="GomokuTable.player_white_id",
        back_populates="player_white",
    )

    serialize_rules = (
        "-sent_messages.sender",
        "-sent_messages.receiver",
        "-received_messages.sender",
        "-received_messages.receiver",
        "-_password_hash",

        "-tic_tac_toe_as_x",
        "-tic_tac_toe_as_o",
        "-tic_tac_toe_as_current",
        "-tables_as_x",
        "-tables_as_o",

        "-gomoku_as_black",
        "-gomoku_as_white",
        "-gomoku_as_current",
        "-gomoku_tables_as_black",
        "-gomoku_tables_as_white",
    )

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, new_password_string):
        if len(new_password_string) < 6 or len(new_password_string) > 16:
            raise ValueError("Password should be between 6 to 16 characters long.")

        plain_byte_obj = new_password_string.encode("utf-8")
        encrypted_hash_object = bcrypt.generate_password_hash(plain_byte_obj)
        hash_object_as_string = encrypted_hash_object.decode("utf-8")
        self._password_hash = hash_object_as_string

    def authenticate(self, some_string):
        return bcrypt.check_password_hash(
            self.password_hash, some_string.encode("utf-8")
        )

    @validates("username")
    def validate_username(self, key, username):
        if not isinstance(username, str):
            raise ValueError("Username should be a string.")
        if len(username) < 5 or len(username) > 16:
            raise ValueError("Username should be between 5 to 16 characters long.")
        return username

    def __repr__(self):
        return f"<User {self.id} {self.username}>"
