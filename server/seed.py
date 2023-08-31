#!/usr/bin/env python3

# Standard library imports
from random import choice as rc, sample

# Local imports
from app import app, db
from models import (
    User,
    Chat,
    TicTacToe,
    TicTacToeStep,
    TicTacToeTable,
    Gomoku,
    GomokuStep,
    GomokuTable,
)


def seed_database():
    """A function to seed the database."""

    db.session.query(TicTacToeTable).delete()
    db.session.query(TicTacToeStep).delete()
    db.session.query(TicTacToe).delete()
    db.session.query(Chat).delete()
    db.session.query(User).delete()
    db.session.query(Gomoku).delete()
    db.session.query(GomokuStep).delete()
    db.session.query(GomokuTable).delete()

    # User
    usernames_passwords = [
        ("admin", "123456"),
        ("Yu1234", "password"),
        ("Alice", "wonderland"),
        ("Bob123", "builder"),
        ("Charlie", "chocolate"),
        ("David", "goliath"),
        ("Eve123", "paradise"),
        ("Frank", "sinatra"),
        ("Grace", "hopper"),
        ("Helen", "trojan"),
    ]

    # Generating users
    users = []
    for username, password in usernames_passwords:
        user = User(username=username)
        user.password_hash = password 
        users.append(user)
        db.session.add(user)
    db.session.commit()

    # Messages
    game_messages = [
        "Are you up for a game of TicTacToe?",
        "I finally beat level 8!",
        "Gomoku is so hard.",
        "Who's up for a game?",
        "I think I've figured out your strategy.",
        "Have you tried the new game mode?",
        "I can't believe I lost again!",
        "Best two out of three?",
        "I've been practicing all day.",
        "Let's have a rematch.",
        "Any tips for a newbie?",
        "GG, well played.",
        "I got the new game skin!",
        "That was a close one.",
        "I need better teammates.",
        "I think this game is rigged.",
        "I keep getting the worst luck.",
        "Ready to lose?",
        "You're going down this time!",
        "Game night this Friday.",
        "Who's your favorite character?",
        "I'm stuck on this level.",
        "You won't beat me this time.",
        "How do you get past level 5?",
        "I've almost unlocked all achievements.",
    ]

    # Generating chat messages
    for content in game_messages:
        sender, receiver = sample(users, 2)
        chat = Chat(sender_id=sender.id, receiver_id=receiver.id, message_content=content)
        db.session.add(chat)
    db.session.commit()


    # Generating TicTacToe tables
    tic_tac_toe_tables = []
    for i in range(3): 
        table = TicTacToeTable()
        db.session.add(table)
        tic_tac_toe_tables.append(table)
    db.session.commit()

    # Generating TicTacToe games
    games = []
    for i in range(10):  
        game = TicTacToe(
            player_x_id=users[i % len(users)].id,
            player_o_id=users[(i + 1) % len(users)].id,
            current_player_id=users[i % len(users)].id,
            game_status="completed",
            winner_id=users[i % len(users)].id,
            table_id=tic_tac_toe_tables[i % 3].id,
        )
        games.append(game)
        db.session.add(game)
    db.session.commit()

    # Generating Gomoku tables
    gomoku_tables = []
    for i in range(3): 
        gomoku_table = GomokuTable()
        db.session.add(gomoku_table)
        gomoku_tables.append(gomoku_table)
    db.session.commit()

    # Generating Gomoku games
    gomoku_games = []
    for i in range(10):  
        gomoku_game = Gomoku(
            player_black_id=users[i % len(users)].id,
            player_white_id=users[(i + 1) % len(users)].id,
            current_player_id=users[i % len(users)].id,
            game_status="completed",
            winner_id=users[i % len(users)].id,
            table_id=gomoku_tables[i % 3].id,
        )
        gomoku_games.append(gomoku_game)
        db.session.add(gomoku_game)
    db.session.commit()


    print("Seeding completed!")


if __name__ == "__main__":
    with app.app_context():
        print("Starting seed...")
        seed_database()
