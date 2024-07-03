"use client"

import { CircleUserRound, LogOut } from "lucide-react";
import { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserButtonProps {
    user: User | undefined;
}

export default function UserButton({ user }: UserButtonProps) {
    const [activateModal, setActivateModal] = useState<boolean>(false)

    const router = useRouter();

    useEffect(() => {

    },[user])

    return (
        <div className="flex items-center relative">
            {user !== undefined ? (
                <button 
                    className="w-8 h-8 relative" 
                    onClick={() => setActivateModal(!activateModal)}
                >
                    {user?.image != null ?
                        (
                            <Image src={user?.image} alt="profile photo" fill className="rounded-full overflow-hidden"/>
                        ):(
                            <CircleUserRound size={32} className='text-zlgray'/>
                        )
                    }
                </button>
            ) : (
                <button
                    onClick={() => signIn()}
                    className="py-1 px-2 rounded-lg "
                >
                    <CircleUserRound size={32} className='text-zlgray'/>
                </button>
            )}
            {activateModal && (
                <div 
                    className="flex flex-col w-60 space-y-[2px] border-2 border-white/10 absolute top-full bg-zdark right-0 rounded-md overflow-hidden" 
                >
                    <button 
                        onClick={() => router.push(`/myteams/users/${user?.id}`)}
                        className="flex items-center space-x-1 px-2 py-2 hover:bg-white/10"
                    >
                        <div className="h-8 w-8 relative">
                            {user?.image != null ?
                                (
                                    <Image src={user?.image} alt="profile photo" fill className="rounded-full overflow-hidden"/>
                                ):(
                                    <CircleUserRound size={32} className='text-zlgray'/>
                                )
                            }
                        </div>
                        <div className="flex flex-col items-start space-y-[-4px]">
                            <h2 className="text-white">Profile</h2>
                            <h3 className="text-sm text-white/40">{user?.name}</h3>
                        </div>
                    </button>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/home' })}
                        className="flex items-center space-x-1 px-2 py-3 hover:bg-white/10"
                    >   
                        <LogOut size={24} className="text-zlgray"/>
                        <h2 className="text-sm text-white">Sign Out</h2>
                    </button>
                </div>
            )}
        </div>
    )
}