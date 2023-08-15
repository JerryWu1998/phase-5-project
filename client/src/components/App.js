import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import Home from './Home'; 
import UserContext from '../context/UserContext.js';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    fetch('/check_session')
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
      })
      .catch(error => {
        console.error("Error checking login status:", error);
      });
  };

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Router>
        <div className="App">
          <Navbar />

          <Switch>
            <Route path="/login">
              {!loggedIn && <Login />}
            </Route>
            <Route path="/signup">
              {!loggedIn && <Signup />}
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
