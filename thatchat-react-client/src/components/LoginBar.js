import React from 'react';
import { connect } from 'react-redux';
import './LoginBar.css';
import StatusPanel from './StatusPanel.js';

import {
  setCurrentRoom,
  setOwnName,
} from "../actions"





class LoginBar extends React.Component {

  constructor(props){
    super(props)

    this.state = { 
      formUsername : "",
      formRoomname : ""
    }
  }


  handleNameInputChange(e){
    this.setState({formUsername:e.target.value})
  }

  handleRoomInputChange(e){
    this.setState({formRoomname:e.target.value})
  }


  handleNewNameClick(e){
    this.props.dispatch(setOwnName(this.state.formUsername));
  }

  handleNewRoomClick(e){
    this.props.dispatch(setCurrentRoom(this.state.formRoomname));
  }

render(){

  if(this.props.store.connecteToRoom == false){
    return null;
  }

  return (
    <div className="LoginBar">
      <StatusPanel />
      <nav id="menu"> 
      <div id="myarea">
        <h2 id="txtwall" data-bind="text: wallText"></h2>   
      </div>
      
      <span id="getNameArea">
        <label for="name"> Name: </label>
        <input autocomplete="off" onChange={this.handleNameInputChange.bind(this)} id="userNameInput" name="name" placeholder="Your name"/>
        <input id="pushUserName"  onClick={this.handleNewNameClick.bind(this)} className="smoothButton" type="button" value="Get Username"/>
      </span>
      
      <span id="joinRoomArea">
        <label for="joinroom">Join room: </label>
        <input autocomplete="off" id="joinSpecificInput" onChange={this.handleRoomInputChange.bind(this)} type="input" name="joinroom" placeholder="Roomname"/>
        <input id="joinSpecificButton" onClick={this.handleNewRoomClick.bind(this)} className="smoothButton" type="button" value="Join room."/>
        {/* <input id="joinRandomButton" className="smoothButton" type="button" value="Join Random room"/> */}
      </span> 
      

    </nav>
    </div>
    );
  }
}


/*
  Define which parts of the Redux store we need
  for this specific Component.

  The object returned from this call will 
  become the props of the component. 
*/

const mapStateToProps = state =>({
  store:state.AppData
})

// Connect this Component with the Redux store we created.
// Argument to first function is null if you dont need any data from the ReduxStore.
export default connect(mapStateToProps)(LoginBar);
