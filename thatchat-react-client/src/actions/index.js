

/*

	Actions are Signals that are sent to 
	the Redux datastore so signal the user did something
	that needs a change to the store.

	An Action has:

	#1 a type
	#2 Data passed to it.


	You can say the Action is the WHAT happened  :) 


*/





/*
 * action types
 */
export const ActionType = {
	SET_CURRENT_ROOM : 'SET_CURRENT_ROOM',
	SET_APP_BACKGROUND : 'SET_APP_BACKGROUND',
	SET_OWN_NAME : 'SET_OWN_NAME',
	SEND_MESSAGE_TO_ROOM : 'SEND_MESSAGE_TO_ROOM',
	RECIEVE_NEW_MESSAGE : 'RECIEVE_NEW_MESSAGE'
}


/*
 * other constants
 */

/*export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}*/

/*
 * action creators
 */

export function setCurrentRoom(roomName) {
  return { type: ActionType.SET_CURRENT_ROOM, roomName }
}


export function setOwnName(newName) {
  return { type: ActionType.SET_OWN_NAME, newName }
}

export function setAppBackground(newBg) {
  return { type: ActionType.SET_APP_BACKGROUND, newBg }
}


export function sendMessageToRoom(text) {
  return { type: ActionType.SEND_MESSAGE_TO_ROOM, text }
}

export function recieveNewMessage(text) {
  return { type: ActionType.RECIEVE_NEW_MESSAGE, text }
}

