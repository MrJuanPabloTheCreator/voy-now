"use client"

import { CircleUserRound, MessageCircle, Plus } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useChat } from "./chatContext";
import toast from "react-hot-toast";

interface UserButtonProps {
    user: User | undefined;
}

interface UserSearch {
    user_id: string | undefined;
    name: string | undefined | null;
    image: string | undefined | null;
    role: string | null;
}

interface UserChat {
    chat_id: number;
    user_id: string;
    name: string;
    image: string;
    last_interacted: string;
}
  
interface GroupChat {
    group_chat_id: number;
    name: string;
    last_interacted: string;
}
  
type CombinedChat = 
  | (UserChat & { type: 'oneToOne' })
  | (GroupChat & { type: 'group' });

const ChatButton = ({ user }: UserButtonProps) => {
    const { activeChat, setActiveChat } = useChat();
    const [chats, setChats] = useState<CombinedChat[]>()
    const [newChatInput, setNewChatInput] = useState<boolean>(false)
    const [chatsModal, setChatsModal] = useState<boolean>(false)
    const [userSearch, setUserSearch] = useState<UserSearch[]>([]);

    const handleStartNewChat = async(e: React.MouseEvent<HTMLButtonElement>, userSelected: UserSearch) => {
        e.preventDefault();

        try{
            const createChatResponse = await fetch('/api/user_chats', {
                method: 'POST',
                body: JSON.stringify({
                    user1_id: user?.id,
                    user2_id: userSelected.user_id
                })
            })
            const {success, chat_id, error} = await createChatResponse.json();
            if(success){
                toast.success('Chat created succesfully!')
                setActiveChat(chat_id)
                setChatsModal(false)
            } else {
                throw new Error(error)
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    const handleGoToChat = async(e: React.MouseEvent<HTMLButtonElement>, chatSelected: string) => {
        e.preventDefault();

        setActiveChat(chatSelected)
        setChatsModal(false)
    }

    const handleGetUserChats = async () => {
        try {
            const userChatsResponse = await fetch(`/api/user_chats/${user?.id}`);
            const { success, userChats, groupChats, error } = await userChatsResponse.json();
            if(success){
                const combinedChats = [
                    ...userChats.map((chat: UserChat) => ({
                      ...chat,
                      type: 'oneToOne' as const
                    })),
                    ...groupChats.map((chat: GroupChat) => ({
                      ...chat,
                      type: 'group' as const
                    }))
                ];
      
                combinedChats.sort((a, b) => new Date(b.last_interacted).getTime() - new Date(a.last_interacted).getTime());
      
                setChats(combinedChats);
            } else{
                throw new Error(error)
            }
        } catch(error: any){

        }
    }

    const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const keyword = e.target.value;
    
        if(keyword.length > 1){
            const getListOfUsers = await fetch(`/api/search_users?key=${keyword}`)
            const usersSearch = await getListOfUsers.json();

            setUserSearch(usersSearch)
        } else {
          setUserSearch([])
        } 
    }
    
    useEffect(() => {
        handleGetUserChats();
    }, [])
    
    return (
        <div className="relative">
            <button 
                onClick={() => setChatsModal(!chatsModal)}
                className={`hover:bg-white/10 ${chatsModal && 'bg-white/10'}  text-zlgray hover:cursor-pointer p-2 rounded-full`}
            >  
                <MessageCircle size={24}/>
            </button>
            {chatsModal && (
                <div className="absolute top-full bg-zdark border-2 border-white/10 p-2 right-0 w-80 rounded-md shadow-lg z-50">
                    <header className="w-full border-b-2 border-zdgreen pb-1 relative">
                        <h2 className="font-bold text-xl text-zdgreen">Chats</h2>
                        <button 
                            onClick={() => setNewChatInput(!newChatInput)}
                            className={`absolute text-zdgray hover:bg-white/10 ${newChatInput && 'bg-white/10'} top-[-4px] right-[-4px] p-1 rounded-full`}
                        >
                            <Plus size={24}/>
                        </button>
                    </header>
                    {newChatInput && (
                        <div className="py-1 space-y-1 relative">
                            <h2 className="text-white font-semibold text-sm">New Chat</h2>
                            <input type='text' className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none w-full' onChange={handleUserSearch}/>
                            {userSearch.length > 0 && 
                                    <div className='absolute top-full flex flex-col w-full max-h-64 overflow-y-auto overflow-hidden border-white/10 rounded-md border-x-2 border-t-2'>
                                        {userSearch.map((item, index) => 
                                            <button 
                                                key={index} 
                                                className='flex items-center w-full justify-between border-b-2 border-white/10 bg-zdark px-2 py-2 hover:bg-zdgray'
                                                onClick={(e) => handleStartNewChat(e, item)}
                                            >
                                                <div className='flex items-start space-x-1'>
                                                    {item.image ? (
                                                        <Image src={item.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                                    ):( 
                                                        <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                                                    )}
                                                    <p className="text-sm text-white">{item.name}</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                }
                        </div>
                    )}
                    <div className="border-b-2 border-white/10">
                        {chats && chats?.length > 0 && 
                            chats?.map((chat, index) => (
                                <div key={index}>
                                    {chat.type === 'oneToOne' ? (
                                        <button className="flex items-center space-x-1 w-full py-2 hover:bg-white/10" onClick={(e) => handleGoToChat(e, String(chat.chat_id))}>
                                            {chat.image ? (
                                                <Image src={chat.image} alt="User Image" width={32} height={2} className="rounded-full"/>
                                            ):( 
                                                <CircleUserRound size={32} className="text-zdgray rounded-full"/>
                                            )}
                                            <p className="text-sm font-bold text-white">{chat.name}</p>
                                        </button>
                                    ):(
                                        <button className="flex items-center space-x-1 w-full py-2 hover:bg-white/10">
                                            <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                                            <p>Group Chat: {chat.name}</p>
                                        </button>                               
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatButton;