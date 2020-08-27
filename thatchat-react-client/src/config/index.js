

/*
    This Object is put here so we more easily
    can know what is in the state we are manipulating.
*/


export const InitialState = {
    userBoxColors : ["lightred","lightblue",
      "lightgreen","lightorange","lightyellow",
      "lightgreen","lightblue"],
    
    connectedToRoom : false,

    // Info / Contraints about the messages client side.
    MAX_MSG_LENGTH : 200,
    MAX_ROOM_LENGTH : 16,

    focused : true,
    notifying : false,


    // Info About User.
    userDisplayName : "no name",

    // Info About Current Room.
    currentRoomName: "",
    peopleInCurrentRoom: [],
    lastRecievedMessage: "",
    lastSentMessage:"",

    // Styling Info.
    appBackground:"red"

}