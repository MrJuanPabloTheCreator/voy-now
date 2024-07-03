// "use client"

// import { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';

// const useSocket = (roomId, userId) => {
//   const socket = useRef(null);
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.current = io()
        
//     //     ("http://localhost:3000",{
//     //     path: '/api/socket',
//     // });

//     socket.current.emit('joinRoom', { room: roomId, user: userId });

//     // Handle incoming messages
//     socket.current.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.current.emit('leaveRoom', { room: roomId, user: userId });
//       socket.current.disconnect();
//     };
//   }, [roomId, userId]);

//     const sendMessage = (text) => {
//         if (socket.current && roomId && userId) {
//             console.log(roomId, userId, text)
//             socket.current.emit('sendMessage', { roomId, userId, text });
//         }
//     };

//     return { messages, sendMessage };
// };

// export default useSocket;
