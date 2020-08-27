import React from 'react';
import './StatusPanel.css';
import { connect } from 'react-redux';


class StatusPanel extends React.Component {





  componentDidMount(){
 
  }

 

  render(){
    return (
      <div className="StatusPanel">
     		<img src="AppLogo.png" alt="The logo of the Chat Application" />
      	<h4> Server status </h4>
        <h5> Current Room : {this.props.store.currentRoomName}</h5>
        <h5> Current Username : {this.props.store.userDisplayName}</h5>
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
const mapStateToProps = state => ({
	store : state.AppData
})

// Connect this Component with the Redux store we created.
export default connect(mapStateToProps)(StatusPanel);
