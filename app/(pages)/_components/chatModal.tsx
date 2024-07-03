import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { ChevronRight, CircleUserRound, X } from 'lucide-react';
import io, { Socket } from 'socket.io-client';

import { useChat } from './chatContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ChatUser {
    user_id: string;
    name: string;
    image: string;
}

interface Message {
    id: string | null;
    sender_id: string;
    sender_name: string;
    sender_image: string | null;
    message: string;
    created_at: string;
}

const Chat = () => {
    const { activeChat, setActiveChat } = useChat();
    const { data: session } = useSession();
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [users, setUsers] = useState<ChatUser[]>([])
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const router = useRouter();

    const getChatData = async () => {
        try {
            const chatInfoResponse = await fetch(`/api/chats/${activeChat}`)
            const { success, chatUsers, chatMessages, error } = await chatInfoResponse.json();
            if(success){
                setUsers(chatUsers)
                let prevMessages: Message[] = [];
                chatMessages.forEach((message: { id: string, chat_id: string, sender_id: string, message: string, created_at: string }) => {
                    let senderName: string = '';
                    let senderImage: string | null = null;
                    users.forEach((user) => {
                        if(user.user_id === message.sender_id){
                            senderName = user.name
                            senderImage = user.image
                        }
                    })
                    prevMessages.push({id: message.id, sender_id: message.sender_id, message: message.message, created_at: message.created_at, sender_name: senderName, sender_image: senderImage});
                })
                setMessages(prevMessages);
            } else {
                throw new Error(error)
            }
        } catch(error: any){
            console.log(error.message)
        }
    }

    useEffect(() => {
        getChatData();

        socketRef.current = io();

        // Join the active chat room
        if (session?.user?.id && activeChat !== null) {
            socketRef.current.emit('joinRoom', { chat_id: activeChat, sender_id: session.user.id });
        }

        // Handle incoming messages
        socketRef.current.on('message', (message: Message) => {
            let senderName: string, senderImage: string | null;
            users.forEach((user) => {
                if(user.user_id === message.sender_id){
                    senderName = user.name
                    senderImage = user.image
                }
            })
            setMessages((prevMessages) => [...prevMessages, {...message, sender_name: senderName, sender_image: senderImage, }]);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                if (session?.user?.id && activeChat !== null) {
                    socketRef.current.emit('leaveRoom', { chat_id: activeChat, sender_id: session.user.id });
                }
                socketRef.current.disconnect();
            }
        };
    }, [activeChat, session?.user?.id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (socketRef.current && session?.user?.id && activeChat !== null) {
            socketRef.current.emit('sendMessage', { chat_id: activeChat, sender_id: session.user.id, message: input });
            setInput('');
        }
    };


    return (
        <div>
            {activeChat !== null && (
                <div className='p-2 flex flex-col w-96 bg-zdark border-2 border-white/10 rounded-t-md'>       
                    <header className='flex items-center justify-between pt-1 pb-3 border-b-2 border-white/10 text-white'>
                        <span className='flex space-x-1'>
                            {users.length > 0 && users[0].user_id !== session?.user?.id && users[0]?.image ? (
                                <Image 
                                    src={users[0].image} alt="User Image" 
                                    width={24} height={24} 
                                    className="rounded-full"
                                    onClick={() => router.push(`/myteams/users/${users[0].user_id !== session?.user?.id ? users[0]?.user_id : users[1]?.user_id}`)}
                                />
                            ):( 
                                <CircleUserRound 
                                    size={24} 
                                    className="text-zdgray rounded-full"
                                    onClick={() => router.push(`/myteams/users/${users[0].user_id !== session?.user?.id ? users[0]?.user_id : users[1]?.user_id}`)}
                                />
                            )}
                            <h1 
                                onClick={() => router.push(`/myteams/users/${users[0].user_id !== session?.user?.id ? users[0]?.user_id : users[1]?.user_id}`)}
                                className='hover:underline hover:cursor-pointer'
                            >
                                {users.length > 0 && users[0].user_id !== session?.user?.id ? users[0]?.name : users[1]?.name}
                            </h1>
                        </span>
                        <button onClick={() => setActiveChat(null)} className="text-zdgray hover:text-red-600">
                            <X size={24}/>
                        </button>
                    </header>
                    <div className='h-[330px] overflow-y-auto space-y-1 pt-1'>
                        {messages.map((msg: Message, index) => (
                            <div key={index} className={`w-full flex text-white pr-2 ${msg.sender_id === session?.user?.id ? 'justify-end':'justify-start'}`}>
                                <div className={`flex items-end text-wrap bg-white/10 p-2 space-x-2 ${msg.sender_id === session?.user?.id ? 'rounded-l-xl rounded-tr-xl':'rounded-r-xl rounded-tl-xl'}`}>
                                    <p className='text-sm py-1 break-words max-w-[180px]'>{msg.message}</p>
                                    <span className='text-[10px] text-white/40'>
                                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className='flex space-x-2 h-fit pt-1'>
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} className='border-2 h-9 max-h-14 overflow-y-auto resize-none border-white/10 w-full bg-zdark text-white outline-none p-1 rounded-md'/>
                        <button 
                            disabled={input.length < 1}
                            onClick={handleSendMessage}
                            className='p-1 bg-white/10 text-zdgreen rounded-md'
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat;