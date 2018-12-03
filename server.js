#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var express = require( 'express' );
var app = express(),
    server = require( 'http' ).createServer(app),
    io = require( 'socket.io' ).listen(server),
    port = 7777,
    url  = 'http://localhost:' + port + '/';

// To handle uplaods
app.use(express.bodyParser({uploadDir:'uploads'}));

var fs = require("fs");
var path = require("path");

/* We can access nodejitsu enviroment variables from process.env */
/* Note: the SUBDOMAIN variable will always be defined for a nodejitsu app */
if(process.env.SUBDOMAIN){
  url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/main.js', function (req, res) {
  res.sendfile(__dirname + '/main.js');
});

app.get('/main.css', function (req, res) {
  res.sendfile(__dirname + '/main.css');
});

app.get('/logo.png',function(req,res){
    res.sendfile(__dirname +'/logo.png');
});


app.get('/downloadicon.png',function(req,res){
    res.sendfile(__dirname +'/downloadicon.png');
});

app.get('/getImg',function(req,res){
    console.log(req.query.src);
    res.sendfile(req.query.src);
});

app.get('/file', function(req, res, next){
    var file = req.query.src;
    res.download(req.query.src);
})


app.post('/imageUpload',function(req,res){
    
    var body = '';
    var ext = app.getExtension(req.files.file.name);
    console.log(req);    

    // get the temporary location of the file
    var tmp_path = req.files.file.path+ext;
    // set where the file should actually exists - 
    //in this case it is in the "images" directory
    res.end('File uploaded to: ' + tmp_path + ' - ' + req.files.file.size + ' bytes');
    
    fs.rename(req.files.file.path,
	      tmp_path,function(){
		  
		  var usrname = req.body.user;
		  // Send the src for the file to client
		  if(cm.clientExists(usrname)){
		      console.log("The user: "+usrname+" exists! Sending img back to user!");
		      var socket = cm.getClientSocket(usrname);
		      
		      // BROADCAST IMAGE To room
		      rm.broadCastToRoom(socket,{"imgsrc":tmp_path,
						 "type":"img",
						 "filetype":ext,
						 "room":cm.getClientRoom(usrname)});
		  }else{
		      console.log("Client "+req.body.user+" does not exist!");
		  }
		  
		  // Delete the image after a certain number of seconds.
		  // Should maybe be called after everyone has recieved the img.
		  app.deleteUploadedImage(tmp_path);
		  
		  
		  
	      });
});


var cm = function(){
    clients = {};
    sockets = {};
    this.addClient = function(socket,username){
	
	// Trim all whitespace
	var username = username.replace(/[^a-zA-Z0-9\-\s]/g,'').replace(/ /g,"");
	
	if(!clients[username] && username.length <= app.getMaxNameLength() && username.length>0){
	    //if(socket.userAdded){
		cm.removeClient(socket,socket.name);
	    //}
	    //socket.userAdded = true;
	    socket.name = username;
	    if(socket.currentRoom !== "")
		socket.currentRoom = "";
	    clients[username] = username;
	    sockets[username] = socket;
	    socket.emit("usernameGiven",{"msg":"Your username is now: "+username,
					 "username":username});
					 
	}else{
	    socket.emit("usernameTaken",{"msg":"That username is already in use or too long! Max length is 16 characters."});
	}
	
///	console.log("Number of clients connected : "+this.getClientCount());
    };

    
    this.getClientCount = function(){
	return Object.keys(clients).length;
    }
    
    this.getClientRoom = function(name){
	return sockets[name].currentRoom;
    }
    
    this.getClient = function(name){
	return clients[name];
    }
    
    this.clientExists = function(name){
	if(name)
	    return clients[name];
	return false
    }
    
    this.getClientSocket = function(username){
	return sockets[username];
    }
    
    this.removeClient = function(socket,username){
//	if(socket.userAdded){
	delete clients[username];
	delete sockets[username];
//	console.log("client was removed. Clients left: "
//			+this.getClientCount());
//	}
    };
    
    return this;
}();


/* Room Manager */
var rm = function(){
    this.rooms = {};
    this.MAXCLIENTS = 10;
    
    this.createNewRoom = function(roomname,socket){
	if(!rooms[roomname]){
	    var r = new Room(roomname,socket);
	    return this.rooms[roomname] = r;
	}else
	    return false;
    }

    this.getRoom = function(roomname){
	return rooms[roomname];
    }

    this.getRoomCount = function(){
	return Object.keys(this.rooms).length;
    }
    
    this.broadCastToRoom = function(socket,data){
	
//	console.log("Broadcasting to room: "+data.room);
//	console.log("Broadcasting msg    : "+data.msg);
//	console.log("Broadcast type      : "+data.type);
//	console.log("From user           : "+socket.name);
	var roomto = data.room;
	var msg = data.msg;
	if(rm.getRoom(roomto))
	    var clients = this.rooms[roomto].clients;
	var t = data.type;
	
	// If these variables are set to a decent value.
	if(roomto && clients && t && this.getRoom(roomto)){
	    if(t === "message"){
		for(c in clients){
		    if(socket.name != clients[c].name)
			clients[c].emit("broadcast",{"name":socket.name,				 "msg":msg});
	    }
		
/*	    console.log("Message from user: "+socket.name+" was broadcast to room "
	    +"roomto");*/
	    }else if(t === "dc"){
		
		for(c in clients){
		    if(socket.name != clients[c].name)
			clients[c].emit("userLeftRoom",{"msg":msg,
							"name":socket.name});
		}
	    }else if(t === "img"){
		
		for(c in clients){
		    clients[c].emit("imageUploaded",{"imgsrc":data.imgsrc,
						     "filetype":data.filetype});
		}
		
	    }else if(t == "youtubeEmbed"){
		for(c in clients){
		    clients[c].emit("youtubeEmbed",{"url":data.url,"delete_time_in_milliseconds":app.UPLOAD_DELETE_TIME*1000});
		}
	    }else if(t == "imageEmbed"){
		for(c in clients){
		    clients[c].emit("imageEmbed",{"url":data.url,"delete_time_in_milliseconds":app.UPLOAD_DELETE_TIME*1000});
		}
	    }
	}
    }
    
    this.deleteRoom = function(){
	
    }
    
    this.getRandomRoom = function(socket,name){
	
	//	console.log("user: "+socket.name+" tried to get a random room.");
	if(!socket.name)
	    return undefined;
	
	// Basicly if the rooms datastructure is empty.
	// create a new room.
	if(!Object.keys(this.rooms).length){
	var r = this.createNewRoom(name,socket); 
	    r.addUser(socket);
	    return r;
	}
	
	for(r in this.rooms){
	    if(this.rooms[r].clients.length < this.MAXCLIENTS){
		this.addClientToRoom(socket,room);
		return this.rooms[r];
	    }
	}
	return undefined;
    };
    
    
    // Tries to get or creates a new room for the user to connect to.
    this.getSpecificRoom = function(socket,roomname){
//	console.log("Specific room requested: "+roomname);
	
	var r = rm.getRoom(roomname);
	if(!r)
	    return rm.createNewRoom(roomname,socket);
	else
	    return r;
    };

    this.addClientToRoom = function(socket, room){
	this.rooms[room].addUser(socket);
//	console.log("Room : "+room+" has now"+this.rooms[room].getSize()+"  users.");
    };

    this.listRooms = function(){
	console.log("Rooms: ");
	for(r in rooms){
	    rooms[r].logInfo();
	    console.log("");
	}
    }
    
    this.clearRooms = function(){
	console.log("Clearing rooms: ");
	var deadnodes = [];
	for(r in this.rooms){
	    if(this.rooms[r].getSize() === 0)
		deadnodes.push(this.rooms[r].name);
	}
	
	console.log("Dead rooms: "+deadnodes.length);
	for(var i = 0;i<deadnodes.length;i++){
	    console.log(deadnodes[i]);
	    delete this.rooms[deadnodes[i]];
	}
	
    };
    
    this.roomExists = function(name){
	return rooms[name];
    }
    
    
    // Deletes rooms and displays some statistics..
    setInterval(function(){
	
	console.log("  --  STATUSREPORT --");
	console.log("Total number of clients: "+cm.getClientCount());
	console.log("Total number of rooms: "+rm.getRoomCount());
	rm.listRooms();
	rm.clearRooms();
    },10000);
    
    return this;
}();



/*Room 'Class' */
function Room(name,socket){
    this.name = name;
    this.clients = {};
    this.clientCount = -1;
    
    this.addUser = function(socket){
	this.clientCount++;
	this.clients[socket.name] = socket;
	this.logInfo();
    }

    this.getName = function(){
	return this.name;
    }

    this.logInfo = function(){
	console.log("NAME    : "+this.name);
	console.log("CLIENTS : "+this.getSize()+"\n");
	for(c in this.clients){
	    console.log("name :"+this.clients[c].name);
	}

    }
    
    this.getSize = function(){
	return this.clientCount;
    }
    
    this.isFull = function(){
	return this.clientCount == rm.MAXCLIENTS;
    }

    this.removeUser = function(socket){	
	delete this.clients[socket.name];
	this.clientCount--;
    }
    
    this.addUser(socket);
}

    
    var app = function(){

    this.MAX_MSG_LENGTH = 200;
    this.MAX_NAME_LENGTH = 16;
    this.MAX_ROOMNAME_LENGTH = 16;
    this.UPLOAD_DELETE_TIME = 60; // seconds.
    
    this.trimMessageLength = function(msg){
	if(msg.length >= this.MAX_MSG_LENGTH)
	    return msg = msg.substr(msg.length-this.MAX_MSG_LENGTH);
	return msg;
    };
    
    this.getExtension = function(filename){
	var ext = path.extname(filename||'').split('.');
	return "."+ext[ext.length - 1];
    }
    
    // This function deletes images that users have uploaded after
    // A certain amount of seconds supplied bu the UPLOAD_DELETE_TIME variable.
    this.deleteUploadedImage = function(imgsource){
	setTimeout(function(){
	    fs.unlink(imgsource);
	},this.UPLOAD_DELETE_TIME*1000);
    
    }
    
    this.trimBadChars = function(str){
	return str.replace(/[^a-zA-Z0-9\-\s]/g,'').replace(/ /g,"");
    };
    
    this.getMaxNameLength = function(){
	return this.MAX_NAME_LENGTH;
    }
    
    this.getMaxRoomNameLength = function(){
	return this.MAX_ROOMNAME_LENGTH;
    }
    
    // Returns a trimmed roomname, with no special chars and just 16 chars in length.
    this.trimRoomName = function(roomname){
	if(roomname.length >= this.MAX_ROOMNAME_LENGTH)
	    roomname = roomname.substr(roomname.length-this.MAX_ROOMNAME_LENGTH);
	return roomname.replace(/[^a-zA-Z0-9\-\s]/g,'').replace(/ /g,"");
    };
    
    return this;
    
}();
    
    
    
//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {
    
    // Emit a message to send it to the client.
    socket.emit('ping', { msg: 'You are connected!' });
    
    // Print messages from the client.
    socket.on('pong', function (data) {
	console.log(data.msg);
    });
    
    socket.on("youtubeEmbed",function(data){
	rm.broadCastToRoom(socket,{"url":data.url,
				   "room":data.room,
				   "type":"youtubeEmbed"});
	
    });
    
    socket.on("imageEmbed",function(data){
	rm.broadCastToRoom(socket,{"url":data.url,
				   "room":data.room,
				   "type":"imageEmbed"});
    });
	
    socket.on('userExists',function(data){
	if(cm.clientExists(data.username)){
	    socket.emit("userExists",{"exists":"true",
					  "username":data.username});
	}else{
	    socket.emit("userExists",{"exists":"false",
					  "username":data.username});
	}
    });
    
    socket.on('msg',function(data){
	//console.log("Message sent to room: "+data.room+" message: "+data.msg);
	
	// Shortens the texts..
	data.msg = app.trimMessageLength(data.msg);
	rm.broadCastToRoom(socket,{"msg":data.msg,
				   "room":data.room,
				   "type":"message"});

	
    });
    
    socket.on('login',function(data){
	cm.addClient(socket,data.name);
    });


    socket.on('getSpecificRoom',function(data){
	var r;
	data.roomname = app.trimRoomName(data.roomname);
	if(socket.name)
	    r = rm.getSpecificRoom(socket,data.roomname);
	else
	    socket.emit("needUserName",{"msg":"You need a username"});

	// Add user to new room and remove from old..
	if(r && !r.isFull()){
	    r.addUser(socket);

	    if(socket.currentRoom)
		rm.getRoom(socket.currentRoom).removeUser(socket.name);


//	    console.log("User: "+socket.name+" got connected to "+data.roomname
//          +" people in this room now: "+r.getSize());
	    socket.currentRoom = data.roomname;
	    socket.emit("specificRoomFound",{"msg":"You are now in room "+data.roomname+". Have fun!",
					     "roomname":data.roomname});
	    
	}else{
	    socket.emit("specificRoomFull",{"msg":"The room '"+data.name+"'' is full."});
	}
	

    });
    
    socket.on('getRandomRoom',function(data){
	console.log("User: "+data.name+" requsted a random room.");
	var room;
	if(socket.name)
	    room = rm.getRandomRoom(socket,socket.name);
	
	if(room){

	    if(socket.currentRoom)
		rm.getRoom(socket.currentRoom).removeUser(socket.name);

	    socket.currentRoom = data.roomname;
	    
	    console.log("User: "+data.name+" got a connected to "+room.name);
	    socket.emit("userConnectedToRoom",{"room":room.name});
	}else{
	    console.log("User: "+data.name+" failed to connected to a room!");
	    socket.emit("userConnectedToRoomFailed",{"room":"undefined"});
	}
    });
    
    socket.on('disconnect',function(data){
	// Remove client from clientlist
	cm.removeClient(socket,socket.name);
	
	// Remove client from room.
	if(socket.currentRoom){
	    var r = rm.getRoom(socket.currentRoom);
	    if(r && socket){
	    r.removeUser(socket);
	    
		rm.broadCastToRoom(socket,{"type":"dc",
					   "msg":"User "+socket.name+" disconnected",
					   "room":r.name});
	    }
	}

    });
});