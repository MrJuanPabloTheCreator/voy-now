import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// const app = next({ dev, hostname, port });
const app = next({});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    },
    // path: '/api/socket',
  });

  io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room
    socket.on('joinRoom', ({ chat_id, sender_id }) => {
      socket.join(chat_id);
      console.log(`User ${sender_id} joined room ${chat_id}`);
      socket.to(chat_id).emit('message', { sender_id: 'system', message: `${sender_id} has joined the room` });
    });

    // Handle messages
    socket.on('sendMessage', async ({ chat_id, sender_id, message }) => {
      const createdAt = new Date().toISOString()
      io.to(chat_id).emit('message', { id: null, sender_id, message, created_at: createdAt });

      try {
        const newMessageResponse = await fetch(`https://partydo.vercel.app/api/chats/${chat_id}`, {
        // const newMessageResponse = await fetch(`http://localhost:3000/api/chats/${chat_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender_id: sender_id,
            message: message,
            created_at: createdAt
          })
        });
        const { success, insertId, error } = await newMessageResponse.json();
        if(success){
          console.log('message successful', insertId)
        } else {
          throw new Error(error)
        }

      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });

    // Leave room
    socket.on('leaveRoom', ({ chat_id, sender_id }) => {
      socket.leave(chat_id);
      console.log(`User ${sender_id} left room ${chat_id}`);
      socket.to(chat_id).emit('message', { sender_id: 'system', message: `${sender_id} has left the room` });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
