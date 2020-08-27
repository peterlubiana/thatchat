

/*
	
	Remember that Reducers are simply event handlers responding 
	to dispatched 'Actions' the Users creates. 

	The action variable in a Reducer is simply -What- the user wanted to do and some data.
	- Its like a tiny Http-response to the Redux Store.

	Reducers return an obect of data that should be changed in the apps state.


  REMEMBER:
    - All Reducers must return a fresh new object / state.
    - All reducers must be pure. No Ajax / no async, no randomgen etc.
    - All Reducers must reduce a state
    - All Nested updates in the state must be cloned - no updating of references.
          From The Semi-holy Redux Documentation: Just remember to never assign to anything inside the state unless you clone it first.

*/


/*

  LOADING DATA AND LIBRARIES

*/

import { InitialState } from "../../config"

// This loads the Types we use in our system ^^ Like JOIN_ROOM etc.
import { ActionType } from "../../actions";

// This library is used to handle immutable objects better.
const Immutable = require('immutable');


const AppData = (state = InitialState, action) => {
  switch (action.type) {
    
    case ActionType.SET_APPLICATION_BACKGROUND:
         return Object.assign({}, state, {
        appBackground: action.newBg
      })

    case ActionType.SET_OWN_NAME:

     return Object.assign({}, state, {
        userDisplayName: action.newName
      })
    



    case ActionType.SET_CURRENT_ROOM:

      return Object.assign({}, state, {
        currentRoomName: action.roomName
      })




    case ActionType.SEND_MESSAGE_TO_ROOM:

      return Object.assign({}, state, {
          lastSentMessage: action.text
        })

        




    case ActionType.RECIEVE_NEW_MESSAGE:

     return Object.assign({}, state, {
        lastRecievedMessage: action.text
      })

    default:
      return state
  }

}

export default AppData