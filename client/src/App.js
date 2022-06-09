import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUp from './components/Signup'
import Logout from './components/Logout'
import Index from "./components/Index";
import io from "socket.io-client";
import { serverUri } from "./config";

import './App.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css';

function App() {
  const [socket, setSocket] = React.useState(null);

  const token = localStorage.getItem("chat-app-token");
  const setupSocket = () => {

    if (token && !socket) {
      const newSocket = io(serverUri, {
        query: {
          token: token,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        console.info("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        console.info("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={ '/' }>
              Chat App
            </Link>
            {
              !token ?
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to={ '/login' }>
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={ '/register' }>
                        Sign up
                      </Link>
                    </li>
                  </ul>
                </div>
                :
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to={ '/log-out' }>
                        Logout
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={ '/dashboard' }>
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
            }

          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={ <Index /> } />
              <Route path="/dashboard" element={ <Dashboard socket={ socket } /> } />
              <Route path="/login" element={ <Login setupSocket={ setupSocket } /> } />
              <Route path="/register" element={ <SignUp setupSocket={ setupSocket } /> } />
              <Route path="/log-out" element={ <Logout /> } />
              <Route path="/chat/:id" element={ <Chat socket={ socket } /> } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}
export default App