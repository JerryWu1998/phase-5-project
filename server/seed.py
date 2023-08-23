#!/usr/bin/env python3

# Standard library imports
from random import choice as rc, sample

# Local imports
from app import app, db
from models import User, Chat, TicTacToe, TicTacToeStep, TicTacToeTable

def seed_database():
    """A function to seed the database."""
    
    # Deleting previous entries
    db.session.query(TicTacToeTable).delete()
    db.session.query(TicTacToeStep).delete()
    db.session.query(TicTacToe).delete()
    db.session.query(Chat).delete()
    db.session.query(User).delete()

    # Generating users
    users = []
    for i in range(1, 4): 
        user = User(username=f'user{i}')
        user.password_hash = 'password' 
        users.append(user)
        db.session.add(user)
    db.session.commit()

    # Custom chat messages
    messages = [
        'Hey, how are you?',
        'Let us play.',
        'Hello!',
        'Check this out.',
        'Today at 8pm.'
    ]

    # Generating chat messages
    for content in messages:  
        sender, receiver = sample(users, 2) 
        chat = Chat(sender_id=sender.id, receiver_id=receiver.id, message_content=content)
        db.session.add(chat)
    db.session.commit()

    # Generating TicTacToe games
    games = []
    for i in range(2): 
        game = TicTacToe(player_x_id=users[i].id, player_o_id=users[(i+1)%3].id, current_player_id=users[i].id, game_status="completed")
        games.append(game)
        db.session.add(game)
    db.session.commit()

    # Generating TicTacToe tables 
    for i in range(5): 
        table = TicTacToeTable()
        table.games.append(games[i % 2])  
        db.session.add(table)
    db.session.commit()

    print("Seeding completed!")
    

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        seed_database()
