
var s;
var name;
var currentRoom;

$(document).ready(function(){

    s = connectSocketIO();

    console.log("doc ready");
    
    $("#txtpusher").on("keyup",function(e){
	var $txtp = $(this);
	var msg = $txtp.val(); 

	if(e.which == 13){
	    if(msg.indexOf("https://www.youtube.com/watch?v=") == 0 || msg.indexOf("http://www.youtube.com/watch?v=") == 0 ){
		s.emit("youtubeEmbed",{"url":msg,
				       "room":WC.wallName()});
	    }
	    
	    if(app.isImageURL(msg)){
		s.emit("imageEmbed",{"url":msg,
				       "room":WC.wallName()});
	    }
	    
	    msg = "";
	}
	
	// Prevents user form pushing insanely long strings to server..
	if(msg.length>= app.getMaxMessageLength())
	    msg = msg.substr(msg.length-app.getMaxMessageLength());
	
	WC.wallText(msg);
	
	s.emit('msg',{"msg":msg,"room":WC.wallName()});
    });

    util.disableDroppingOnHtml();
    
    /*IMAGEUPLOAD BY DROPPING FUNCTIONALITY*/
    $(document).on("drop",function(e){
	e.stopPropagation();
	e.preventDefault();
	var files = e.originalEvent.dataTransfer.files;
	
	//alert("file was dropped! "+files);
	app.uploadFileToServer(files,this);
    });
    
    
    $("#menu").on("keypress","input",function(e){
	if (e.which == 13){
	    if(e.currentTarget.id == "userNameInput")
		$("#pushUserName").click();
	    else if(e.currentTarget.id == "joinSpecificInput")
		$("#joinSpecificButton").click();
	}
    });

    $("#joinRandomButton").on("click",function(){
	var nameFromInputBox = $("#userNameInput").val();
	if(name || nameFromInputBox)
	    s.emit("getRandomRoom",{"name":nameFromInputBox});
    });
    
    $("#pushUserName").on("click",function(){
	var nameFromInputBox = $("#userNameInput").val();
	if(name || nameFromInputBox)
	    s.emit("login",{"name":nameFromInputBox});
	else
	    alert("You need to select a username!");
    });

    
    $("#playfield").on("click","x",function(e){
		$db = $(this).parent();
		if($db.attr("id") != "boxforYou" && !$db.hasClass("imageBox")){
		    $db.fadeOut("slow",function(){
			$db.remove();
		    });
		   
		    if($db.attr("id"))
			rm.removeClientFromRoom(rm.getClientNameFromId($db.attr("id")));
		}
	
    });
    
    $("#playfield").on("click","audio",function(e){
	e.stopPropagation();
    });


    $("#playfield").on("click",".imageBox",function(e){
	e.stopPropagation();
    });
    

    $("#menuButton").on("click",function(e){
	e.stopPropagation();
	$("#joinRoomArea, #getNameArea").slideToggle(300);
	var $m = $("#menu");

	if($m.css("background") != "none")
	    $m.css({"background":"#fefefe"});
	else
	    $m.css({"background":"none"});
	   
    });
    
    $(window).on("focus",function(){
	app.focused = true;
	document.title = "ThatChat";
    });
    
    $(window).on("blur",function(){
	app.focused = false;
    });
    
    $("#joinSpecificButton").on("click",function(){
	var roomFromInputBox = $("#joinSpecificInput").val();
	if(currentRoom || roomFromInputBox)
	    s.emit("getSpecificRoom",{"roomname":roomFromInputBox});else
		alert("You need to supply a room to join!");
    });
    
    
});

var app = function(){

    this.colors = ["lightred","lightblue",
		   "lightgreen","lightorange","lightyellow",
		   "lightgreen","lightblue"];
    
    this.MAX_MSG_LENGTH = 200;
    this.MAX_ROOM_LENGTH = 16;

    this.focused = true;
    this.notifying = false;
    
    this.setNotificationOnTitle = function(name){
	if(!this.focused){
	    var notTxtPre = "(1) ThatChat ";
	    var notTxtPost = " said something";
	    
	    var not = notTxtPre+name+notTxtPost;
	    if(document.title == not)
		document.title = notTxtPre;
	    else
		document.title = not;

	    setTimeout(function(){
		this.setNotificationOnTitle(name);
	    },1000);
	}else{
	    this.notifying = false;
	}

    }
    
    this.isImageURL = function(url){
	return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
    
    this.createYoutubeBox = function(url){
	var id = this.getYoutubeIdFromLink(url);
	if(id){
	    var embed = '<iframe width="320" height="240" src="//www.youtube.com/embed/' 
		+ id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
	    
	    $("<div class='dombox youtubeBox'><x></x> "+embed+"</div>").insertAfter("#boxforYou").hide().slideToggle(300);
	}

    }
    


    this.createImageBox = function(url){
	if(url){
	    var imgelem = "<img src='"+url+"' alt='justanimage'/>";
	    return $("<div class='dombox imageBox'><x></x>"+imgelem+"</div>").appendTo("#playfield").hide().slideToggle(300);
	}
    }

    this.getYoutubeIdFromLink = function(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match&&match[7].length==11){
            return match[7];
	}
        return false;
    }
    
    this.uploadFileToServer = function(files,element){
	for (var i = 0; i < files.length; i++) 
	{
            var fd = new FormData();
            fd.append('file', files[i]);
	    fd.append('user',WC.userName());
	    
	    $.ajax({
		"url":"/imageUpload",
		"method":"POST",
		"data":fd,
		"contentType":false,
		"processData": false,
		"cache": false,
		"success":function(e){
		    //alert("File was uploaded to server.");
		},
		
		"error":function(e){
		    //console.dir(e);
		    alert("Fileupload failed to reach server!");
		}
		
	    });
	}
    }
    
    this.getAwesomeColor = function(){
	var r = Math.round(Math.random()*colors.length);
	return colors[r];
    }
    this.getMaxMessageLength = function(){
	return this.MAX_MSG_LENGTH;
    }
    
    this.removeUserFromPlayfield = function(user){
	$("#playfield").find("#boxfor"+user).fadeOut("slow",function(){
            $(this).remove();
        });
    };
    
    // Checks if a certain user exists at any given moment..
    setInterval(function(){
	var clis = rm.clientsConnected;
	for(c in clis)
	    s.emit("userExists",{"username":clis[c]});
    },5000);
    
    this.showRoomUI = function(){
	$("#main").hide();
	$("#myarea").show();
    }
    
    this.refreshDraggableDomBox = function(){
	$(".dombox").draggable();
    }
    
    this.createDomBox = function(clientname){
	$dbx = $("<div class='dombox' id='boxfor"+
				clientname+"'> </div>");
	var xHtml = "";
	if(clientname != "You") xHtml = "<x></x>";
	$dbx.html(xHtml+"<h3 class='domboxname'>"+clientname+"</h3>"+
		     "<p class='domboxmsg'> </p>");
	return $dbx.css({background:app.getAwesomeColor()});
    }
    
    return this;
}();

function connectSocketIO(){
    // Connect to socket.io
    var socket = io.connect();
    
    // React to a received message
    socket.on('ping', function (data) {
	
        document.getElementById("msg").innerHTML = data.msg;
	$("#msg").fadeIn(3000);
	
        // Send a message back to the server
        socket.emit('pong', {
            msg: "The web browser also knows socket.io."
        });
    });

    socket.on("youtubeEmbed",function(data){
	
	if(data.url)
	    app.createYoutubeBox(data.url);
	
    });
    
    socket.on("imageEmbed",function(data){
		if(data.url){
            var $imgbox = app.createImageBox(data.url);
            
            // Delete image from client after 55 seconds.
            setTimeout(function(){
				$imgbox.remove();
    		},data.delete_time_in_milliseconds-(5*1000));
    	}
    });
    
    socket.on("imageUploaded",function(data){
	
	var imgsrc = "/getImg?src="+data.imgsrc;
	if(data.filetype != ".jpg" &&
	   data.filetype != ".gif" && 
	   data.filetype != ".png" && 
	   data.filetype != ".jpeg")
	    imgsrc = "/downloadicon.png"
	
	// Image upload also applies to Audio so these few lines are support for that. Notice how the img variable is unset
	// If it was an audio file that was uploaded.
	var audio = "";
	var img   = "<img class='domboximg' src='"+imgsrc+"'/>";
	if(data.filetype == ".mp3"){
	    audio = "<audio src='/file?src="+data.imgsrc+"' controls autoplay> </audio>"; imgsrc="getImg?src=soundicon.png"
	    img = "";
	}

	$imgbox = $("<div class='dombox'> "+audio+img+"<a href='/file?src="+data.imgsrc+"' download> Download <span>"+data.imgsrc+"</span></a></div>");

	$imgbox.appendTo("#playfield");

	// Delete image from client after 55 seconds.
	setTimeout(function(){
		$imgbox.remove();
    },data.delete_time_in_milliseconds-(5*1000));

	});
    
    socket.on('userConnectedToRoom',function(data){
	console.log(data);
	app.showRoomUI();
	currentRoom = data.room;
	WC.wallName(currentRoom);
    });
    
    socket.on("usernameTaken",function(data){
	alert(data.msg);
    });
    

    socket.on("usernameGiven",function(data){
	WC.userName(data.username);
	if($("#boxforYou").length == 0){
	    $mybox = app.createDomBox("You");
	    $mybox.find(".domboxmsg").attr({"data-bind":"text: wallText"});
	    $mybox.hide();
	    $("#playfield").html($mybox);
	    $mybox.slideToggle("fast");	
	    $(".dombox").css({"background":app.getAwesomeColor()});
	    ko.applyBindings(WC,$mybox[0]);
	}
    });

    socket.on("specificRoomFound",function(data){
		alert(data.msg);
		app.showRoomUI();
		currentRoom = data.roomname;
		
		$("#joinRoomArea, #getNameArea").slideToggle(300);
		WC.wallName(currentRoom);
    });

    socket.on("userLeftRoom",function(data){
		//alert("User Left Room");
		rm.removeClientFromRoom(data.name);
		app.removeUserFromPlayfield(data.name);
		$("#playfield").find("#boxfor"+data.name).fadeOut("slow",function(){
		    $(this).remove();
		});
    });
    
    socket.on("broadcast",function(data){
	var clientname = data.name;
	
	// If the user who sent the message does not
	// have a box in the dom make one.
	var $dombox;
	if(!rm.hasClient(clientname)){
	    rm.addClientToRoom(clientname);
	    $dombox = app.createDomBox(clientname);
	    $dombox.appendTo("#playfield");
	    $dombox.hide().slideToggle("fast");
	}else{
	    $dombox = $("#boxfor"+clientname);
	}
	
	
	
	
	var $msgbx = $dombox.find(".domboxmsg");
	    
	if($msgbx.html() != data.msg){
	    $msgbx.html(data.msg);
	    if(!app.focused && !app.notifying){
		app.setNotificationOnTitle(data.name);
		app.notifying = true;
            }
	}
	
	
	//console.log("Message recieved: "+data.msg);	
    });
    

    socket.on("specificRoomFull",function(data){
	alert(data.msg);
    });
    
    socket.on("disconnect",function(data){
	location.reload();
    });
    
    socket.on("userExists",function(data){
	if(data.exists == "true")
	    return;
	else
	    app.removeUserFromPlayfield(data.username);
    });

    socket.on("needUserName",function(data){
	alert(data.msg);
    });

    return socket;
}





/*

	ROOM manager.
*/

var rm = function(){

    this.clientsConnected = {};
    
    this.addClientToRoom = function(client){
	this.clientsConnected[client] = client;
	console.log("Client connected To room "+name);
    }

    this.getClientNameFromId = function(id){
	return id.replace("boxfor","");
    }
    
    this.hasClient = function(client){
	if(this.clientsConnected[client])
	    return true
	return false;
    }
    
    this.removeClientFromRoom = function(client){
	delete this.clientsConnected[client];
	console.log("Client disconnected from room");
    }
    
    return this;
}();


function WallController(){
    var self = this;

    self.wallName = ko.observable("<no room atm>");
    self.userName = ko.observable("<no name atm>");
    self.wallText = ko.observable("");
    self.wallcount = 100;
    
};


var WC = new WallController;
ko.applyBindings(WC);






var util = function(){
    
    this.disableDroppingOnHtml = function(){
		$("html").on("dragover", function(event) {
		    event.preventDefault();  
		    event.stopPropagation();
		});

		$("html").on("dragleave", function(event) {
		    event.preventDefault();  
		    event.stopPropagation();
		});

		$("html").on("drop", function(event) {
		    event.preventDefault();  
		    //event.stopPropagation();
		});
	};
    
    
    return this;
}();