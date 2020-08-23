import React from 'react';
import './StatusPanel.css';
import { connect } from 'react-redux';


function StatusPanel(props) {

  console.log("Status panel props:")	
  console.log(props)

  return (
    <div className="StatusPanel">
   		<img src="AppLogo.png" alt="The logo of the Chat Application" />
    	<h4> Server status </h4>
        <h5> Current Room : {props.roomName}</h5>
        <h5> Current Username : {props.userName}</h5>
    </div>
  );
}


/*
	Define which parts of the Redux store we need
	for this specific Component.

	The object returned from this call will 
	become the props of the component. 
*/
const mapStateToProps = state => ({
	userName : state.userName,
	roomName : state.roomName
})

// Connect this Component with the Redux store we created.
export default connect(mapStateToProps)(StatusPanel);
