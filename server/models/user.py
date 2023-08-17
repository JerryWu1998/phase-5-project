from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    
    sent_messages = db.relationship('Chat', back_populates='sender', foreign_keys='Chat.sender_id')
    received_messages = db.relationship('Chat', back_populates='receiver', foreign_keys='Chat.receiver_id')

    # Define relationships to TicTacToe models
    tic_tac_toe_as_x = db.relationship('TicTacToe', foreign_keys='TicTacToe.player_x_id', back_populates='player_x')
    tic_tac_toe_as_o = db.relationship('TicTacToe', foreign_keys='TicTacToe.player_o_id', back_populates='player_o')
    tic_tac_toe_as_current = db.relationship('TicTacToe', foreign_keys='TicTacToe.current_player_id', back_populates='current_player')
    game_steps = db.relationship('TicTacToeStep', back_populates='player')
    tables_as_x = db.relationship('TicTacToeTable', foreign_keys='TicTacToeTable.player_x_id', back_populates='player_x')
    tables_as_o = db.relationship('TicTacToeTable', foreign_keys='TicTacToeTable.player_o_id', back_populates='player_o')

    serialize_rules = ('-sent_messages.sender', 
                       '-sent_messages.receiver',
                       '-received_messages.sender', 
                       '-received_messages.receiver',
                       '-_password_hash', 
                       '-tic_tac_toe_as_x', 
                       '-tic_tac_toe_as_o',
                       '-tic_tac_toe_as_current', 
                       '-game_steps.player',
                       '-game_steps.game',
                       '-tables_as_x',
                       '-tables_as_o')

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, new_password_string):
        plain_byte_obj = new_password_string.encode('utf-8')
        encrypted_hash_object = bcrypt.generate_password_hash(plain_byte_obj)
        hash_object_as_string = encrypted_hash_object.decode('utf-8')
        self._password_hash = hash_object_as_string

    def authenticate(self, some_string):
        return bcrypt.check_password_hash(self.password_hash, some_string.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.id} {self.username}>'
