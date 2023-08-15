#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Local imports
from app import app, db
from models import User, Chat

def seed_database():
    """A function to seed the database."""
    # Deleting previous entries
    db.session.query(Chat).delete()
    db.session.query(User).delete()

    # Custom user data
    usernames = [
        'admin', 'SkyGreen', 'GoldenRay', 'CrimsonKnight',
        'SilveryMoon', 'MagentaStar', 'AzureDream', 'BronzeSun',
        'LilacBreeze', 'EmeraldShade'
    ]
    
    passwords = [
        '123456', 'SkyG@2022', 'G0ld3nR@y', 'Kn1ght#4321',
        'Moon$9876', 'Star!7654', 'Dream%6543', 'Sun&5432',
        'Breeze*4321', 'Shade(3210)'
    ]

    # Generating users
    users = []
    for i in range(10):  # Let's create 10 users
        user = User(username=usernames[i], password_hash=passwords[i])
        users.append(user)
        db.session.add(user)
    db.session.commit()

    # Custom chat messages
    messages = [
        'Hey, how are you?', 'Did you complete the task?', 'This looks great!', 
        'Check out my new profile picture.', 'The event starts at 8 PM.', 
        'Can you share the document?', 'The sky looks beautiful today.', 
        'The game last night was amazing!', 'How was your weekend?', 
        'Any plans for the evening?', 'Let’s hang out tomorrow.', 'Did you watch the movie?', 
        'The music album you suggested is fantastic!', 'Is anyone up for a walk in the park?', 
        'The project deadline is coming up.', 'How’s the weather at your end?', 
        'Let’s catch up soon!', 'I got a new pet!', 'That was a fun session.', 'I will be offline for a few hours.'
    ]

    # Generating chat messages
    for _ in range(50):  # Let's create 50 chat messages
        user_id = rc(users).id
        content = rc(messages)
        chat = Chat(user_id=user_id, message_content=content)
        db.session.add(chat)
    db.session.commit()

    print("Seeding completed!")

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        seed_database()
