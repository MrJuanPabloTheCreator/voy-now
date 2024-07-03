"use client"

import { Bell, CircleCheckBig, CircleUserRound, ExternalLink, Trash2 } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserButtonProps {
    user: User | undefined;
}

interface Notifications {
    id: string;
    message: string;
    sender_id: string
    sender_image: string;
    sender_name: string;
    type: string;
    status: string;
    match_id: string | null;
    team_name: string | null;
}

const NotificationsButton = ({ user }: UserButtonProps) => {
    const [unreadNotifications, setUnreadNotifications] = useState<boolean>(false)
    const [activateModal, setActivateModal] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<Notifications[]>([])

    const router = useRouter();

    //Acept request
    const handleFriendRequest = async ({ answer, sender_id,notification_id }: { answer: string; sender_id: string; notification_id: string }) => {
        try {
            const answerNotification = await fetch('/api/friends',{
                method: 'PATCH',
                body: JSON.stringify({
                    answer: answer,
                    notification_id: notification_id,
                    user_1: user?.id,
                    user_2: sender_id
                })
            })
            const { success, error } = await answerNotification.json();
            if(success){
                toast.success(`${answer}, ' succesfully!'`)
            } else {
                throw new Error(error);
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    const handleGetNotifications = async () => {
        try {
            const notificationsResponse = await fetch(`/api/notifications/${user?.id}`)
            const {success, error, notifications} = await notificationsResponse.json();
            if(success){
                console.log('Notifications', notifications)
                const hasUnreadNotifications:boolean = notifications.some((item: Notifications) => item.status === 'unread');
                setUnreadNotifications(hasUnreadNotifications)
                setNotifications(notifications)
            } else {
                throw new Error(error)
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    const handleClearNotifications:MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        if(notifications.length === 0) return toast.error('No notifications to clear')

        try {
            const deleteNotifications = await fetch(`/api/notifications/${user?.id}`,{
                method: 'DELETE'
            })
            const { success, error } = await deleteNotifications.json();
            if(success){
                toast.success('Notifications cleared successfully!')
                setNotifications([])
            } else {
                throw new Error(error);
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        console.log('Mounted, User:', user)
        handleGetNotifications();
    },[])

    return (
        <div className="relative">
            <button 
                onClick={() => setActivateModal(!activateModal)}
                className={`hover:bg-white/10 ${activateModal && 'bg-white/10'}  text-zlgray hover:cursor-pointer p-2 rounded-full relative`}
            >   
                {unreadNotifications && (
                    <span className="absolute bg-red-600 rounded-full p-1 top-2 right-2"/>
                )}
                <Bell size={24}/>
            </button>
            {activateModal && (
                <div className="absolute top-full bg-zdark border-2 border-white/10 p-2 right-0 w-80 rounded-md overflow-hidden shadow-lg z-50">
                    <header className="w-full border-b-2 border-zdgreen pb-1">
                        <h2 className="font-bold text-xl text-zdgreen">Notifications</h2>
                    </header>
                    {notifications.length > 0 ? 
                        (
                            <div>
                                {notifications.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-1 hover:cursor-pointer hover:bg-white/10">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => router.push(`/myteams/users/${item.sender_id}`)}
                                                className="w-8 h-8 rounded-full hover:cursor-pointer relative overflow-hidden"
                                            >
                                                {item.sender_image ? 
                                                    (
                                                        <Image src={item.sender_image} alt="Sender Photo" fill/>
                                                    ):(
                                                        <CircleUserRound size={32} className='text-zlgray'/>
                                                    )
                                                }
                                            </button>
                                            <span className="text-left text-sm text-white/40">
                                                <p 
                                                    onClick={() => router.push(`/myteams/users/${item.sender_id}`)}
                                                    className="font-semibold text-md text-white hover:underline hover:cursor-pointer"
                                                >
                                                    {item.sender_name}
                                                </p>
                                                {item.message} {item.team_name}
                                            </span>
                                        </div>
                                        {item.type === 'friend_request' ? (
                                            <div className="flex">
                                                <button
                                                    onClick={() => handleFriendRequest({answer: 'accepted', sender_id: item.sender_id, notification_id: item.id})}
                                                    className="p-1 rounded-full text-zlgray hover:bg-white/20 hover:text-zdgreen"
                                                >                          
                                                    <CircleCheckBig size={20}/>
                                                </button>
                                                <button
                                                    onClick={() => handleFriendRequest({answer: 'rejected', sender_id: item.sender_id, notification_id: item.id})}
                                                    className=" p-1 rounded-full text-zlgray hover:bg-white/20 hover:text-red-700"
                                                >
                                                    <Trash2 size={20}/>
                                                </button>
                                            </div>
                                        ): item.type === 'match_invitation' ? (
                                            <button 
                                                onClick={() => router.push(`/myteams/matches/${item.match_id}`)}
                                                className="p-1 rounded-full text-zlgray hover:bg-white/20 hover:text-white/40"
                                            >
                                                <ExternalLink size={20}/>
                                            </button>
                                        ): item.type === 'team_invitation' && (
                                            <button 
                                                onClick={() => router.push(`/myteams/teams/${item.team_name}`)}
                                                className="p-1 rounded-full text-zlgray hover:bg-white/20 hover:text-white/40"
                                            >
                                                <ExternalLink size={20}/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ):(
                            <h2 className="text-white/40 py-2">No Notifications</h2>
                        )
                    }
                    <div className="flex w-full justify-between pt-2 border-t-2 border-white/10 space-x-1">
                        <button className="bg-zwteen text-white/40 py-1 px-2 text-sm rounded-full hover:bg-white/20 hover:text-zdgreen">See All</button>
                        <button 
                            onClick={handleClearNotifications}
                            className="bg-zwteen text-white/40 py-1 px-2 text-sm rounded-full hover:bg-white/20 hover:text-zdgreen"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationsButton;