import React from 'react';
import {Component} from 'react';
import { connect } from 'react-redux';

/*
    
    Components in the App.

*/
import LoginBar from './components/LoginBar.js';
import UserInputArea from './components/UserInputArea.js';
import Room from './components/Room.js';
import Footer from './components/Footer.js';
import StatusPanel from './components/StatusPanel.js';


import './App.css';






class App extends Component {


  constructor(props){
     super(props);
     console.log("app props")
     console.log(props)
  }

  getRandomColor(){
     var colors = ['red', 'green', 'blue', 'orange', 'yellow'];
     return colors[Math.floor(Math.random() * colors.length)];
  }
  
  componentDidMount(){
    
    /*


    */

  }

  render(){
    
    return(<div className="App" style={{background:this.getRandomColor()}} >
      <header className="noClass">

        <StatusPanel />
        <Room />
        <LoginBar />
        <UserInputArea />
        <Footer />

      </header>
    </div>);
  }

  
}



/*
  Define which parts of the Redux store we need
  for this specific Component.

  The object returned from this call will 
  become the props of the component. 
*/

const mapStateToProps = state =>({
  chocolate:state
})

// Connect this Component with the Redux store we created.
// Argument to first function is null if you dont need any data from the ReduxStore.
export default connect(mapStateToProps)(App);
