"use client"

import { useEffect, useState } from "react";
import UserCard from "./usercard";

const Feed = () => {
  const [usersData, setUsersData] = useState<Array<{ user_id: number, username: string, age: number }>>([]);

  const makeGetCall = async () => {
    const response = await fetch('/api/users', {
      method: 'GET'
    })
    const newData = await response.json();
    setUsersData(newData);
  }

  useEffect(() => {
    makeGetCall();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-2 mt-5">
        {usersData.map((item) => (
          <UserCard key={item.user_id} username={item.username} age={item.age}/>
        ))}
    </div>
  )
}
  
export default Feed;