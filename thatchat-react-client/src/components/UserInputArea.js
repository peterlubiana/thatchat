import React from 'react';
import './UserInputArea.css';
import { connect } from 'react-redux';

class UserInputArea extends React.Component {


	



	render(){

	  if (this.props.store.connectedToRoom){

	 	 return (
			<div className="UserInputArea">
		     <input type="textarea" autocomplete="off" placeholder="Write something!" id="txtpusher" data-bind="value: wallText, valueUpdate: 'keyup'"/>    
			</div>
		);

	 } else {
			return (null);
		}
	  
	}	
}


const mapStateToProps = state =>({
	store : state.AppData
})

export default connect(mapStateToProps)(UserInputArea);
