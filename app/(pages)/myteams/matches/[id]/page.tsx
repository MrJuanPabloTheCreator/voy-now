"use client"

import { CircleUserRound } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface Match {
    match_id: string;
    date: string;
    location_id: string;
    match_info: string;
    private: boolean;
    size: string;
    created_at: string;
    updated_at: string;
    team1_color: string | null;
    team2_color: string | null;
}

interface MatchUsers {
    user_id: string;
    name: string;
    email: string;
    image: string;
    role: 'player' | 'captain' | 'admin';
    team: '1' | '2';
    user_match_created_at: string;
    user_match_updated_at: string;
}

const MatchPage = () => {
    const [matchUsers, setMatchUsers] = useState<MatchUsers[]>([])
    const [match, setMatch] = useState<Match>()
    const { data: session } = useSession();
    const [countdown, setCountdown] = useState('');
    const [loading, setLoading] = useState(false)

    const params = useParams();
    const matchId = params.id;

    const fetchMatchInfo = async () => {
        setLoading(true);
        try {
            if (matchId && session?.user) {

                const getUserInfo = await fetch(`/api/matches/${matchId}`);
                const { success, matchInfo, usersInfo, error } = await getUserInfo.json();
                if (success) {
                    setMatch(matchInfo);
                    setMatchUsers(usersInfo);
                } else {
                    toast.error(`${error}`);
                }
            } else {
                throw new Error("Failed to get user session");
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        return date.toLocaleDateString('en-US', options);
    };

    const calculateCountdown = (dateString: string) => {
        const matchDate = new Date(dateString);
        const now = new Date();

        const difference = matchDate.getTime() - now.getTime();

        if (difference <= 0) {
            setCountdown('The match has started!');
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    useEffect(() => {
        if (match?.date) {
            const interval = setInterval(() => {
                calculateCountdown(match.date);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [match?.date]);

    useEffect(() => {
      fetchMatchInfo();
    }, [matchId])

    return (
        <div className={`w-full h-full flex items-center justify-center bg-[url('/field_2.jpeg')] bg-cover z- relative`}>
            <div className="absolute inset-0 backdrop-blur-lg bg-black/20"></div>
            <div className='flex flex-col p-10 items-center justify-center space-y-2 bg-black/70 rounded-lg z-20'>
                <div className='flex flex-col items-center'>
                    <h1 className='text-lg font-bold text-white'>Club Cordillera</h1>
                    <span className='text-lg text-white'>{countdown}</span>
                    <span className='text-lg text-white'>{match && formatDate(match.date)}</span>
                </div>
                <div className='flex w-3/5 justify-between'>
                    <h2 className='text-white font-bold text-xl flex'>Team 1</h2>
                    {/* <span style={{backgroundColor: match?.team1_color || 'FFFF'}} className='h-3 w-3 rounded-full'/> */}
                    <span className='font-bold text-3xl text-zdgreen'>VS</span>
                    <h2 className='text-white font-bold text-xl'>Team 2</h2>
                </div>
                <div className='flex space-x-4'>
                    <div className='p-4 grid grid-cols-2 h-fit border-2 border-white/40 rounded-md'>
                        {matchUsers.map((item, index) => item.team === '1' && (
                            <div key={index} className="flex items-center space-x-1 py-2 w-48">
                                {item.image ? (
                                    <Image src={item.image} alt="User Image" width={28} height={28} className="rounded-full"/>
                                ):( 
                                    <CircleUserRound size={28} className="text-zlgray rounded-full"/>
                                )}
                                <h3 className='font-semibold truncate text-white'>{item.name}</h3>
                            </div>
                        ))}
                        {Array.from({ length: Number(match?.size) }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-1 py-2 w-48">
                                <CircleUserRound size={28} className="text-zlgray rounded-full"/>
                                <p className="text-sm text-white/40">Empty Spot</p>
                            </div>
                        ))}
                    </div>
                    <div className='p-4 grid grid-cols-2 h-fit border-2 border-white/40 rounded-md'>
                        {matchUsers.map((item, index) => item.team === '2' && (
                            <div key={index} className="flex items-center space-x-1 py-2 w-48">
                                {item.image ? (
                                    <Image src={item.image} alt="User Image" width={28} height={28} className="rounded-full"/>
                                ):( 
                                    <CircleUserRound size={28} className="text-zlgray rounded-full"/>
                                )}
                                <h3 className='font-semibold text-white'>{item.name}</h3>
                            </div>
                        ))}
                        {Array.from({ length: Number(match?.size) }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-1 py-2 w-48">
                                <CircleUserRound size={28} className="text-zlgray rounded-full"/>
                                <p className="text-sm text-white/40">Empty Spot</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchPage;