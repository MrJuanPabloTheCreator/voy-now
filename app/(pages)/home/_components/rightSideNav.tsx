"use client"

import { CircleUserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    team1_users: MatchUser[] | [];
    team2_users: MatchUser[] | [];
  }
  
interface MatchUser {
    match_id: string
    user_id: string;
    name: string;
    email: string;
    image: string;
    role: 'player' | 'captain' | 'admin';
    team: '1' | '2';
}

const RightSideNav = () => {
    const { data: session } = useSession();
    const [matches, setMatches] = useState<Match[]>([])

    const handleUpcomingGames = async () => {
        const getUserMatches = await fetch(`/api/user_matches/${session?.user?.id}`)
        const { success, matchesInfo, matchesUsers, error } = await getUserMatches.json();
        if(success){
          matchesInfo.forEach((match: Match, index: number) => {
            let team_1_users:MatchUser[] = []
            let team_2_users:MatchUser[] = []
            matchesUsers.forEach((user: MatchUser) => user.match_id === match.match_id && (
              user.team === '1' ? (team_1_users.push(user)): user.team === '2' && (team_2_users.push(user))
            ));
            matchesInfo[index] = {...matchesInfo[index], team1_users: team_1_users}
            matchesInfo[index] = {...matchesInfo[index], team2_users: team_2_users}
          })
          setMatches(matchesInfo);
        } else {
            toast.error(error)
        }
    }

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

    useEffect(() => {
        handleUpcomingGames();
    }, [])

    return (
        <div className="space-y-4">
            {matches.map((m, i) => 
                <div key={m.match_id}>
                    <div 
                        className="flex flex-col w-full items-center relative"
                        style={{ backgroundImage: `url('/field_2.jpeg')`, backgroundSize: 'cover' }}
                    >
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/20"/>
                        <div className="flex flex-col w-full items-center px-2 py-4 z-20">
                            {/* <h2>{m.match_id}</h2> */}
                            <h2 className="text-white font-semibold text-lg">Club Cordillera</h2>
                            <div className="flex w-full space-x-2 items-center">
                                <div className="flex w-full p-2 space-x-1">
                                {m.team1_users.map((u) => 
                                    <div key={u.user_id}>
                                    {u.image ? (
                                        <Image src={u.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                    ):( 
                                        <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                                    )}
                                    </div>
                                )}
                                </div>
                                <span className="font-bold text-lg text-zdgreen">VS</span>
                                <div className="flex w-full p-2 space-x-2">
                                {m.team2_users.map((u) => 
                                    <div key={u.user_id}>
                                    {u.image ? (
                                        <Image src={u.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                    ):( 
                                        <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                                    )}
                                    </div>
                                )}
                                </div>
                            </div>
                            <span className="text-sm text-white">{m && formatDate(m.date)}</span>
                        </div> 
                    </div>
                    {/* <div className="flex w-full space-x-1 bg-zdark pt-1">
                        <button className="w-full p-2 text-sm text-zdgreen bg-zdark border-2 border-white/10 hover:bg-white/10 rounded-md">Request to join</button>
                        <button className="w-full p-2 text-sm text-zdgreen bg-zdark border-2 border-white/10 hover:bg-white/10 rounded-md">Go to game</button>
                    </div> */}
                </div>
            )}
        </div>
    )
}

export default RightSideNav