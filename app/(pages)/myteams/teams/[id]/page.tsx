"use client"

import { ChevronDown, CircleUserRound, ShieldHalf } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TeamMember {
    user_id: string;
    name: string;
    image: string;
    role: 'player' |'captain' | 'coach' | 'admin';
}

interface Team {
    name: string;
    logo_url: string;
    created_at: string;
    team_members: TeamMember[]
}

const TeamPage = () => {
    const [teamInfo, setTeamInfo] = useState<Team>({
        name: '',
        logo_url: '',
        created_at: '',
        team_members: []
    })

    const params = useParams();
    const team_name = params.id;

    const handleGetTeamInfo = async () => {
        try {
            const teamInfoResponse = await fetch(`/api/teams/${team_name}`);
            const { success, teamInfo, teamMembers, error} = await teamInfoResponse.json();
            if(success){
                setTeamInfo(teamInfo)

                if(teamMembers.length > 0){
                    setTeamInfo({...teamInfo, team_members: teamMembers})
                }
            } else {
                throw new Error(error)
            }
        } catch(error: any){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        handleGetTeamInfo();
    },[team_name])

    return (
        <div className="w-full h-full flex justify-center relative pt-10">
            <Image src={'/field_2.jpeg'} alt="background image" fill className="object-cover"/>
            {/* <div className="absolute inset-0 backdrop-blur-md bg-black/20 z-10"/> */}
            <div className="h-full w-2/3 flex flex-col p-10 space-y-6 border-2 border-white/10 bg-zdark z-20">
                <div className="flex items-center justify-between border-b-2 border-white/10 pb-6">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center relative bg-white/10 h-28 w-28 rounded-full overflow-hidden">
                            {teamInfo.logo_url ? (
                                <Image 
                                    src={teamInfo.logo_url} alt="Team Profile Photo" 
                                    fill className="object-cover"/>
                            ):(
                                <ShieldHalf size={96} className="text-zdgray"/>
                            )}   
                        </div>      
                        <h1 className="text-white font-semibold text-4xl">{teamInfo.name}</h1>
                    </div>
                    <button 

                        className="flex items-center space-x-1 py-1 px-2 bg-white/10 text-zdgreen font-semibold rounded-md"
                    >
                        <span>Actions</span>
                        <ChevronDown size={20} className="text-white/40"/>
                    </button>
                </div>
                <div className=" w-full">
                    <div className="w-[300px] flex flex-col items-center">
                        <h2 className="text-zdgreen text-xl font-semibold">Players</h2>
                        <div className="flex flex-col border-x-2 border-t-2 border-white/10 w-full">
                            {teamInfo.team_members && teamInfo.team_members.map((user, index) => (
                                <button key={user.user_id} className="flex space-x-1 items-center w-full py-2 px-1 hover:bg-white/10 border-b-2 border-white/10">
                                    <span className="text-white font-bold text-white/40">{index + 1}.</span>
                                    {user.image ? (
                                        <Image src={user.image} alt="User Image" width={28} height={28} className="rounded-full"/>
                                    ):( 
                                        <CircleUserRound size={28} className="text-zlgray rounded-full"/>
                                    )}
                                    <h3 className="text-white">{user.name}</h3>
                                    <span className="pl-10 text-white/10">{user.role}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamPage;