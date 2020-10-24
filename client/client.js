var socket = io.connect('http://129.21.149.70:8081');

var getRoomsButton = document.getElementById('get-room');
var toPutRooms     = document.getElementById('rooms-div');
var createRooms    = document.getElementById('create-room');
var createRoomInput= document.getElementById('make-rooms');
var output         = document.getElementById('output');
var sendMessage    = document.getElementById('send');
var messageBox     = document.getElementById('message');
var handle         = document.getElementById('handle');
var currentRoom    = document.getElementById('current-room');
var feedback       = document.getElementById('feedback');


// Button Listeners
// getRoomsButton.addEventListener('click', ()=>{
//     socket.emit('get-rooms-request');
// });

createRooms.addEventListener('click', ()=>{
    socket.emit('create-room', createRoomInput.value);
});

sendMessage.addEventListener('click', ()=>{
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        room: currentRoom.textContent
    });
    message.value = '';
});


// When the user is typing a message
messageBox.addEventListener('keypress',()=>{
    socket.emit('typing', {
        sig: handle.value,
        room: currentRoom.textContent
    });
});

// Listener for socket responses
socket.on('get-rooms-request', (rooms)=>{
    toPutRooms.innerHTML = "";
    rooms.forEach(element => {
        toPutRooms.innerHTML += "<p> Room Name: " + element + "</p><button onclick='joinRoom(this.id)' id='" + element + "'>Join Room</buttons>";
    });
});

socket.on('joined', (message)=>{
    output.innerHTML += "<p>" + message + "</p>";
});

socket.on('chat', (data)=>{
    feedback.innerHTML = "";
    output.innerHTML += '<p><strong> ' + data.handle + ':</strong> ' + data.message + '</p>';
});

socket.on('typing', (data)=>{
    feedback.innerHTML = "<p><em> " + data.sig + " is typing a message...</em></p>";
});


// Helper Methods
function joinRoom(id){
    // Set an invisible ( visible ) signifier of which room we are in
    document.getElementById('current-room').innerHTML = id;

    // send a join room request to the server
    socket.emit('join-room', id);
}