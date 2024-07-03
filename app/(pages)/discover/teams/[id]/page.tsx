"use client"

import { useEffect, useState } from "react";

interface Team {
    team_id: number;
    name: string;
    image_url: string;
}
  

const TeamPage = ({ params }: { params: { id: string } }) => {
    const [pageData, setPageData] = useState<Team>()
  
    const handleGetPageData = async () => {
        const getTeamInfo = await fetch(`/api/teams/${params.id}`)
        const teamInfo = await getTeamInfo.json();
        console.log(teamInfo)
        setPageData(teamInfo[0]);
    }

    useEffect(() => {
        handleGetPageData()
    }, [params.id])
    
    return (
        <div>
            {pageData && 
                <div>
                    <h1 className="font-semibold text-2xl">{pageData.name}</h1>
                </div>
            }
        </div>
    )
}
  
export default TeamPage;