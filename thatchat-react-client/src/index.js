import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from "./store"


/*
		Importing Actions ( Signals to send to The Redux Store.)
*/
import {
	setCurrentRoom,
	setOwnName,
	sendMessageToRoom,
	recieveNewMessage
} from "./actions"



/*

	For HELP regarding how to structure the React.js project please read here
	---> https://redux.js.org/basics/usage-with-react  <---
	This piece of documentation explains hot to handle different scenarios
	for Presentational Components as well as for Containter Components.
	as described by Dan Abramov here -> https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
	- Peter R. L.

*/


/*
	Testing.
*/

console.log(store.getState())

store.dispatch(setOwnName("Kjell"));
store.dispatch(setCurrentRoom("Verdensrommet"));
store.dispatch(sendMessageToRoom("Hey! This is the first message."));
store.dispatch(recieveNewMessage("Hey! We just recieved a message! ^^ From the test system."));


console.log(store.getState())






ReactDOM.render(
  <React.StrictMode>
   <Provider store={store}>
    <App banana={2}/>
   </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
