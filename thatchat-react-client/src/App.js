import React from 'react';
import logo from './logo.svg';


/*
    
    Components in the App.

*/
import LoginBar from './components/LoginBar.js';
import UserInputArea from './components/UserInputArea.js';
import Room from './components/Room.js';
import Footer from './components/Footer.js';
import ServerStatusPanel from './components/ServerStatusPanel.js';



import './App.css';




function App() {
  return (
    <div className="App">
      <header className="noClass">

        <ServerStatusPanel />
        <Room />
        <LoginBar />
        <UserInputArea />
        <Footer />

      </header>
    </div>
  );
}

export default App;
