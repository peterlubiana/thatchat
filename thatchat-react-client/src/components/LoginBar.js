import React from 'react';
import './LoginBar.css';

function LoginBar() {
  return (
    <div className="LoginBar">
      <nav id="menu"> 
      <div id="myarea">
        <h2 id="txtwall" data-bind="text: wallText"></h2>
       
      </div>
      
      <span id="getNameArea">
        <label for="name"> Name: </label>
        <input autocomplete="off" id="userNameInput" name="name" placeholder="Your name"/>
        <input id="pushUserName" className="smoothButton" type="button" value="Get Username"/>
      </span>
      
      <span id="joinRoomArea">
        <label for="joinroom">Join room: </label>
        <input autocomplete="off" id="joinSpecificInput" type="input" name="joinroom" placeholder="Roomname"/>
        <input id="joinSpecificButton" className="smoothButton" type="button" value="Join room."/>
        <input id="joinRandomButton" className="smoothButton" type="button" value="Join Random room"/>
      </span> 
      <span id="menuButton" className="nonSelectable"> = </span>
    </nav>
    </div>
  );
}

export default LoginBar;
