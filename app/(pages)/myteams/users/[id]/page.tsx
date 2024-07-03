"use client"

// import currentUser from '@/lib/user';
import { CircleUserRound, Ellipsis, Handshake, MessageCircle, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const navbarOptions = [
    'All',
    'Posts',
    'Teams',
    'Matches'
]

interface Post {
    id: string;
    description: string;
    media_url: string;
    created_at: string;
}

interface Friend {
    user_id: string;
    name: string;
    image: string;
}

interface UserProfile {
    user_id: string;
    name: string;
    email: string;
    image: string;
    created_at: string;
    friendship_status: string | null;
    friends: Friend[];
    posts: Post[];
}

const UserPage = () => {
    const [manageFriendship, setManageFriendship] = useState<boolean>(false);
    const [activeOption, setActiveOption] = useState<string>('All')
    const [loading, setLoading] = useState<boolean>(true)
    const { data: session } = useSession();
    const [userData, setUserData] = useState<UserProfile>({
        user_id: '',
        name: '',
        email: '',
        image: '',
        created_at: '',
        friendship_status: null,
        friends: [],
        posts: []
    })

    const params = useParams();
    const userId = params.id;

    const handleFriendRequest = async () => {
        try {
            const friendReqResponse = await fetch('/api/friends',{
                method: 'POST',
                body: JSON.stringify({
                    user_1: session?.user?.id,
                    user_2: userId
                })
            })
            
            const { success, error } = await friendReqResponse.json();
            if(success){
                toast.success('Request Sent!')
                setUserData({...userData, friendship_status: 'pending'})
            } else {
                throw new Error(error)
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    const fetchSessionAndData = async () => {
        setLoading(true);
        try {
            if (session?.user?.id === userId) {
                const getUserOwnInfo = await fetch(`/api/users/${userId}`)
                const { success, userData, error } = await getUserOwnInfo.json();
                if(success){
                    setUserData(userData)
                } else {
                    throw new Error(error)
                }
            } else {
                const getUserInfo = await fetch(`/api/users/${userId}/${session?.user?.id}`);
                const { success, userData, error } = await getUserInfo.json();
                if (success) {
                    setUserData(userData);
                } else {
                    throw new Error(error);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionAndData()
    }, [userId]);

    if(loading) return (<div>Loading...</div>)

    // if(userSession === userData.user_id) return 

    return (
        <div className='flex w-full h-full justify-center items-center relative bg-black/20'>
            {/* <div className="absolute inset-0 backdrop-blur-lg bg-black/20 z-10"></div>
            <Image src={'/field_2.jpeg'} fill alt='background Image' className='object-cover'/> */}
            <div className='flex flex-col w-2/3 space-y-10 bg-zdark p-10 rounded-md z-20'>
                <div className='bottom-0 w-full flex justify-between items-center'>
                    <div className='flex items-center space-x-4'>
                        <div className='w-24 h-24 relative rounded-full overflow-hidden'>
                            {userData.image ? (
                                <Image src={userData.image} fill alt='User Photo'/>
                            ):(
                                <CircleUserRound size={96} className='text-slate-600'/>
                            )}                 
                        </div>
                        <div className='flex flex-col items-start'>
                            <h2 className='text-2xl font-bold text-white'>{userData.name}</h2>
                            {/* <h3>{userData.email}</h3> */}
                        </div>
                    </div>
                    <div className=''>
                        <h1 className='text-white font-semibold'>Friends</h1>
                        <div className='flex'>
                            {userData.friends.length > 0 && userData.friends.map((friend, index) => 
                                <div key={index}>
                                    {friend.image ? 
                                        (
                                            <Image src={friend.image} width={24} height={24} alt='Friends Photo' className='rounded-full'/> 
                                        ):(
                                            <CircleUserRound size={24} className='text-zlgray'/>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex space-x-2'>
                        <div>
                            {session?.user?.id === userData.user_id ? (
                                <button className='p-2 text-white/40 font-semibold border-2 border-white/10 rounded-md text-sm'>Edit Profile</button>
                            ):(userData.friendship_status === null ? 
                                (
                                    <button 
                                        onClick={handleFriendRequest}
                                        className='flex items-center space-x-1 p-2 bg-white/10 text-zdgreen font-semibold rounded-md text-sm'
                                    >
                                        <span>Add Friend</span>
                                        <Plus size={20}/>
                                    </button>
                                ): userData.friendship_status == 'pending' ? (
                                    <button 
                                        className='p-2 bg-white/10 text-zdgreen font-semibold rounded-md text-sm'
                                    >
                                        Pending...
                                    </button>
                                ): (
                                    <div className='relative'>
                                        <button
                                            className='flex items-center space-x-1 py-[10px] px-2 bg-white/10 text-zdgreen font-semibold rounded-md text-sm'
                                            onClick={() => setManageFriendship(!manageFriendship)}
                                        >
                                            <span>Friends</span>
                                            <Handshake size={20} />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                        <button className='p-2 text-zdgreen border-2 border-white/10 rounded-md'>
                            <MessageCircle size={20} />
                        </button>
                        <button className='p-2 text-zdgreen border-2 border-white/10 rounded-md'>
                            <Ellipsis size={20} />
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-4 gap-2 px-2 w-2/3 justify-between'>
                    {navbarOptions.map((option, i) => (
                        <button 
                            key={i} 
                            className={`py-1 font-semibold ${activeOption === option ? 'border-zdgreen border-b-2 text-zdgreen':'text-white'}`}
                            onClick={() => setActiveOption(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className='grid grid-cols-2 space-x-1'>
                    {userData.posts.length > 0 && userData.posts.map((post, index) => (
                        <div key={index} className="w-full">
                            {post.media_url && 
                                <div className="relative w-full min-h-[280px]">
                                    <Image src={post.media_url} alt="Post Image" fill className="object-cover"/>
                                </div>
                            }          
                            <h3 className="text-white/40 p-2">{post.description}</h3>         
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserPage;