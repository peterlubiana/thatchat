

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

  This Reducer Is basically framework waiting to be used. At a later point should the application need 
  restructuring or if we add new fatures / a new set of actions.

*/


// This loads the Types we use in our system ^^ Like JOIN_ROOM etc.
import { ActionType } from "../../actions";

/*
    This Object is put here so we more easily
    can know what is in the state we are manipulating.
*/
import { InitialAppState } from "../../config";




// This library is used to handle immutable objects better.
const Immutable = require('immutable');




const ReserveReducer = (state = InitialAppState, action) => {

}

export default ReserveReducer