import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import Home from './Home'; 
import Profile from './Profile'; 
import UserContext from '../context/UserContext.js';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [showTGame, setShowTGame] = useState(false);
  const [showGGame, setShowGGame] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    fetch('/check_session')
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        if (data.loggedIn) {
          setCurrentUser(data.user); 
        }
      })
      .catch(error => {
        console.error("Error checking login status:", error);
      });
  };

  const bgImageUrl = "https://wallpapercave.com/wp/wp9067458.jpg";

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, currentUser, setCurrentUser, showTGame, setShowTGame, showGGame, setShowGGame }}>
      <Router>
        <div className="App" style={{ 
          backgroundImage: `url(${bgImageUrl})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',  
          backgroundRepeat: 'repeat',     
          minHeight: '100vh'
        }}>
          <Navbar />

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/profile"> 
              <Profile />
            </Route>
            <Route exact path="/"> 
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
