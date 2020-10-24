"use strict"

// Import section for our plugins
const express = require('express');
const socket  = require('socket.io');


// Make the server
var app = express();
// Listen on an ip and port number
var server = app.listen(8081, ()=>{
    console.log("Server listening on address localhost:8081");
});


// See something on the screen
app.use(express.static('../client'));

// Setup our sockets
var io = socket(server);
var rooms = [];
io.on('connection', (socket)=>{
    console.log("We've got a new connection who's id is: " + socket.id);

    // Client wants the rooms
    socket.on('get-rooms-request', ()=>{
        // Okay, here are all the rooms
        socket.emit('get-rooms-request', rooms);
    });

    // Client wants to join a specific room
    socket.on('join-room', (room)=>{
        // join the room
        socket.join(room);

        // Create a join message
        var message = "Player has joined the room";

        // Send that to everyone in the room
        io.sockets.in(room).emit('joined', message);
    });

    // Client wants to create a room
    socket.on('create-room', (room)=>{
        // If room is unique
        if(!rooms.includes(room)){
            // create the room
            rooms.push(room);
            io.sockets.emit('get-rooms-request', rooms);
        }
    });


    // Make a chat application within the room

    // Chat Event
    socket.on('chat', (data)=>{
        // Data will contain the room identifier
        io.sockets.in(data.room).emit('chat', data);
    });

    // Typing Event
    socket.on('typing', (data)=>{
        // send it to everyone in the room
        socket.broadcast.to(data.room).emit('typing', data);
    });
});