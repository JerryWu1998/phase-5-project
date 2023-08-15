from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db

class Chat(db.Model, SerializerMixin):
    __tablename__ = 'chats'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='chats')

    serialize_rules = ('-user.chats',)

    def __repr__(self):
        return f'<Chat {self.id} by User {self.user_id}>'


