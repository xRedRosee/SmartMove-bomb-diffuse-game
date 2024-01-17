const express = require("express");
const http = require("http").Server(express);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const rooms = {};

io.on("connection", (socket) => {
  console.log("A client is connected");

  socket.on("user-join-room", (data) => {
    let user = new User(socket.id, data.username, data.roomNumber);

    rooms[data.roomNumber] = rooms[data.roomNumber] || [];
    rooms[data.roomNumber].push(user);

    io.sockets.emit("update-user-room", {
      connectedUsers: rooms,
    });
  });

  socket.on("userReady-from-client", (data) => {
    const selectedUser = rooms[data.roomNumber].find(
      (user) => user.id === data.userId
    );
    if (selectedUser) {
      selectedUser.isReady = data.isReady;

      socket.broadcast.emit("userReady-from-server", {
        userId: data.userId,
        isReady: data.isReady,
        roomNumber: data.roomNumber,
      });
    }
  });

  socket.on("start-game-from-client", (data) => {
    const everyoneIsReady = rooms[data.roomNumber].every(
      (user) => user.isReady
    );
    if (everyoneIsReady) {
      io.sockets.emit("start-game-from-server", {
        roomNumber: data.roomNumber,
      });
    }
  });

  socket.on("someone-did-a-task-from-client", (data) => {
    var selectedUser = rooms[data.roomNumber].find((x) => x.id == data.userId);
    if (selectedUser) {
      selectedUser.inventory[data.newItem] =
        (selectedUser.inventory[data.newItem] || 0) + data.quantity;
    }
    io.sockets.emit("someone-did-a-task-from-server", {
      roomNumber: data.roomNumber,
      userId: data.userId,
      smartMoveId: data.smartMoveId,
      inventory: selectedUser.inventory,
    });
  });

  socket.on("someone-won-from-client", (data) => {
    // Delete the room
    delete rooms[data.roomNumber];
    socket.broadcast.emit("someone-won-from-server", {
      roomNumber: data.roomNumber,
      username: data.username,
    });
  });
  socket.on("bomb-exploded", (data) => {
    // Delete the room
    delete rooms[data.roomNumber];
  });

  socket.on("disconnect", () => {
    console.log("A client has disconnected");
 
    // Find the user in all the rooms
    for (const roomNumber in rooms) {
      const index = rooms[roomNumber].findIndex(
        (user) => user.id === socket.id
      );
      if (index !== -1) {
        // Remove the user from the list
        rooms[roomNumber].splice(index, 1);
        io.sockets.emit("update-user-room", {
          connectedUsers: rooms,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

class User {
  constructor(id, username, roomNumber) {
    this.id = id;
    this.inventory = {};
    this.username = username;
    this.isReady = false;
    this.roomNumber = roomNumber;
  }
}
