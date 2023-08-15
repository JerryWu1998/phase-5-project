import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext.js';

function Home() {
    const { loggedIn } = useContext(UserContext);

    return (
        <div className="home-container">
            <h1>Welcome to Chess&Chat!</h1>
            
            {!loggedIn && (
                <div className="auth-reminder">
                    <p>To enjoy all the features, please <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link>!</p>
                </div>
            )}
        </div>
    );
}

export default Home;
