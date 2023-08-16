from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db

class Chat(db.Model, SerializerMixin):
    __tablename__ = 'chats'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    sender = db.relationship('User', back_populates='sent_messages', foreign_keys=[sender_id])
    receiver = db.relationship('User', back_populates='received_messages', foreign_keys=[receiver_id])

    serialize_rules = ('-sender.sent_messages', '-receiver.received_messages')

    def __repr__(self):
        return f'<Chat {self.id} from User {self.sender_id} to User {self.receiver_id}>'



