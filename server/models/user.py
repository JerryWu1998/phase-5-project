from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt
from sqlalchemy.orm import validates

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    
    sent_messages = db.relationship('Chat', back_populates='sender', foreign_keys='Chat.sender_id')
    received_messages = db.relationship('Chat', back_populates='receiver', foreign_keys='Chat.receiver_id')

    # Define relationships
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
        if len(new_password_string) < 6 or len(new_password_string) > 16:
            raise ValueError('Password should be between 6 to 16 characters long.')
        
        plain_byte_obj = new_password_string.encode('utf-8')
        encrypted_hash_object = bcrypt.generate_password_hash(plain_byte_obj)
        hash_object_as_string = encrypted_hash_object.decode('utf-8')
        self._password_hash = hash_object_as_string

    def authenticate(self, some_string):
        return bcrypt.check_password_hash(self.password_hash, some_string.encode('utf-8'))
    
    @validates('username')
    def validate_username(self, key, username):
        if not isinstance(username, str):
            raise ValueError('Username should be a string.')
        if len(username) < 5 or len(username) > 16:
            raise ValueError('Username should be between 5 to 16 characters long.')
        return username

    def __repr__(self):
        return f'<User {self.id} {self.username}>'
