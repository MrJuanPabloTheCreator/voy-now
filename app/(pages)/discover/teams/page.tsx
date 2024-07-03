"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface Team {
  team_id: number;
  name: string;
  image_url: string;
}

const TeamsPage = () => {
  const [teamsInfo, setTeamsInfo] = useState<Team[]>([])
  
  const handleGetPageData = async () => {
    try {
      const getTeamsData = await fetch(`/api/teams`);
      const teamsData = await getTeamsData.json();
      setTeamsInfo(teamsData);
    } catch (err) { 
      console.log('Error fetching data:', err)
    }
  } 

  useEffect(() => {
    handleGetPageData();
  }, [])
  
  return (
    <div>
      {teamsInfo && teamsInfo.map((item, index) => (
        <Link key={index} href={`/discover/teams/${item.team_id}`}>
          <h2 className="font-semibold">{item.name}</h2>
        </Link>
      ))}
    </div>
  )
}
  
export default TeamsPage;