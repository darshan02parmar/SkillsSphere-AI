export function initClassroomSockets(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific room
    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      
      // Store user info in socket instance to easily retrieve later
      socket.data = { roomId, user };

      console.log(`User ${user.name} (${socket.id}) joined room ${roomId}`);

      // Notify others in the room that a new user joined
      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        user
      });

      // Get all clients currently in the room
      const clients = io.sockets.adapter.rooms.get(roomId);
      const participants = [];
      if (clients) {
        for (const clientId of clients) {
          const clientSocket = io.sockets.sockets.get(clientId);
          if (clientSocket && clientSocket.data.user) {
            participants.push({
              socketId: clientId,
              user: clientSocket.data.user
            });
          }
        }
      }

      // Send the current participants list to the person who just joined
      socket.emit("room-participants", participants);
    });

    // Chat Message
    socket.on("chat-message", ({ roomId, message }) => {
      socket.to(roomId).emit("chat-message", {
        sender: socket.data.user,
        message,
        timestamp: new Date().toISOString()
      });
    });

    // Toggle Hand Raise
    socket.on("toggle-hand-raise", ({ roomId, isRaised }) => {
      // Broadcast hand raise status to others
      socket.to(roomId).emit("hand-raise-toggled", {
        socketId: socket.id,
        isRaised
      });
    });

    // WebRTC Signaling Events
    socket.on("webrtc-offer", ({ targetSocketId, offer, callerUser }) => {
      socket.to(targetSocketId).emit("webrtc-offer", {
        callerSocketId: socket.id,
        callerUser,
        offer
      });
    });

    socket.on("webrtc-answer", ({ targetSocketId, answer }) => {
      socket.to(targetSocketId).emit("webrtc-answer", {
        answererSocketId: socket.id,
        answer
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.data && socket.data.roomId) {
        const { roomId, user } = socket.data;
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
          user
        });
      }
    });
  });
}
