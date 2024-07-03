"use client"

import { CircleUserRound, ShieldHalf } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Team {
    name: string;
    logo_url: string;
}

interface Match {
    match_id: string;
    date: Date;
    location_id: string;
}

const MyTeamSidebar = () => {
    const { data: session } = useSession();
    const [teams, setTeams] = useState<Team[]>([])
    const [matches, setMatches] = useState<Match[]>([])

    const route = useRouter();

    const handleGetUserData = async () => {
        try {
            if(session?.user){
                const getUserInfo = await fetch(`/api/myteams/${session?.user.id}`);
                const { success, teams, matches, error } = await getUserInfo.json();
                if (success) {
                    if(teams.length > 0){
                        setTeams(teams)
                    }
                    if(matches.length > 0){
                        setMatches(matches)
                    }
                } else {
                    throw new Error('Error fetching data');
                }
            } else {
                throw new Error('No user id')
            }
        } catch (error) {
            // toast.error(`${error}`);
        }
    }

    useEffect(() => {
        handleGetUserData();
    },[session?.user])

    return (
        <div className="p-4 space-y-2 bg-black">
            <div className="border-b-2 border-white/10">
                <h1 className="text-lg text-white/40 font-semibold">My Profile</h1>
                <button className="flex space-x-1 p-2 hover:bg-white/10 w-full" onClick={() => route.push(`/myteams/users/${session?.user?.id}`)}>
                    {session?.user?.image ? (
                        <Image src={session.user.image} width={24} height={24} alt='User Photo' className="object-cover rounded-full overflow-hidden"/>
                    ):(
                        <CircleUserRound size={24} className='text-zdgray rounded-full overflow-hidden'/>
                    )}   
                    <h2 className="text-white font-semibold">{session?.user?.name}</h2>
                </button>
            </div>
            <div className="border-b-2 border-white/10">
                <h2 className="text-lg text-white/40 font-semibold">My Teams</h2>
                <div>
                    {teams.length > 0 ? (
                        teams.map((team, index) => (
                            <button key={index} className="flex space-x-1 p-2 hover:bg-white/10 w-full" onClick={() => route.push(`/myteams/teams/${team.name}`)}>
                                {team.logo_url ? (
                                    <Image src={team.logo_url} width={24} height={24} alt="Team Logo" className="object-cover rounded-full overflow-hidden"/>
                                ):(
                                    <ShieldHalf size={24} className="text-zdgray rounded-full overflow-hidden"/>
                                )}
                                <h2 className="text-white font-semibold">{team.name}</h2>
                            </button>
                        ))
                    ):(
                        <>Search Teams</>
                    )}
                </div>
            </div>
            <div className="border-b-2 border-white/10">
                <h2 className="text-lg text-white/40 font-semibold">Upcoming Matches</h2>
                <div>
                    {matches.length > 0 ? (
                        matches.map((match, index) => (
                            <button key={index}>
                                {match.location_id}
                            </button> 
                        ))              
                    ):(
                        <>Search Matches</>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyTeamSidebar;