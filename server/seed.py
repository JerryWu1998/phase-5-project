#!/usr/bin/env python3

# Standard library imports
from random import choice as rc, sample

# Local imports
from app import app, db
from models import User, Chat

def seed_database():
    """A function to seed the database."""
    
    # Deleting previous entries
    db.session.query(Chat).delete()
    db.session.query(User).delete()

    # Generating users
    users = []
    for i in range(1, 11):  # Create 10 users
        user = User(username=f'user{i}')
        user.password_hash = 'password'  # Use setter method to hash the password
        users.append(user)
        db.session.add(user)
    db.session.commit()

    # Custom chat messages
    messages = [
        'Hey, how are you?',
        'Did you complete the task?',
        'This looks great!',
        'Check out my new profile picture.',
        'The event starts at 8 PM.',
        'I just signed up!',
        'Has anyone tried the new game?',
        'What are your weekend plans?',
        'The new update is awesome!',
        'I need some assistance with my project.',
        'Are you attending the seminar?',
        'I loved the recent movie you recommended!',
        'The food at that place was amazing!',
        'We should catch up sometime.',
        'Have you seen the recent updates?',
        'The game was intense!',
        'I found the book you were looking for.',
        'The design looks great.',
        'I have shared the document with you.',
        'I am working on the presentation.',
        'Did you find the solution?',
        'Let’s meet for lunch tomorrow.',
        'The meeting has been rescheduled.',
        'I won’t be available today.',
        'I am looking forward to the trip.',
        'Can you share the pictures?',
        'I have a doubt regarding the task.',
        'The code is working fine now.',
        'Are you coming to the party?',
        'The webinar was insightful!',
        'Can you please call me?',
        'I will be late today.',
        'The concert was amazing!',
        'I got the tickets for the show.',
        'I loved your recent post.',
        'Let’s collaborate on this project.',
        'The tutorial was helpful.',
        'I have sent you the invite.',
        'I received your parcel.',
        'The weather is pleasant today.',
        'Let’s plan a trip soon.',
        'Your feedback was valuable.',
        'I have updated the application.',
        'Let’s play the game tonight.',
        'Can you review my work?',
        'I have attached the file.',
        'Your artwork is impressive!',
        'I am taking a break for a few days.',
        'Let’s watch the game together.',
        'Can you please help me with this?'
    ]

    # Generating chat messages
    for content in sample(messages, 50):  # Sample 50 chat messages without replacement
        sender, receiver = sample(users, 2)  # Pick two random users without replacement
        
        chat = Chat(sender_id=sender.id, receiver_id=receiver.id, message_content=content)
        db.session.add(chat)
    db.session.commit()

    print("Seeding completed!")

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        seed_database()
