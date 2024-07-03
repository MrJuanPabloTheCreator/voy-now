
"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface User {
  user_id: string;
  name: string;
}

const PeoplePage = () => {
  const [peopleFeed, setPeopleFeed] = useState<User[]>([])

  const router = useRouter();

  const handleGetPageInfo = async () => {
    const getUsers = await fetch('/api/users');
    const usersResponse = await getUsers.json();
    setPeopleFeed(usersResponse)
  }

  useEffect(() => {
    handleGetPageInfo()
  }, [])
  
  return (
    <div className='flex items-center'>
      <div className='grid grid-cols-3 gap-1'>
        {peopleFeed && peopleFeed.map((item) => 
          <button 
            key={item.user_id} 
            className='p-2 bg-slate-200 rounded-md hover:cursor-pointer' 
            onClick={() => router.push(`/users/${item.user_id}`)}
          >
            <h2>{item.name}</h2>
          </button>
        )}
      </div>
    </div>
  )
}

export default PeoplePage;

// "use client"

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import PostCard from "./_components/postCard";

// interface Post {
//   id: string;
//   user_id: string;
//   description: string;
//   media_url: string;
//   created_at: string;
// }

// const People = () => {
//   const [loading, setLoading] = useState<boolean>(false)
//   const [searchResultData, setSearchResultData] = useState<Post[]>([])
//   const searchParams = useSearchParams();

//   async function handleSearchData(){
//     try {
//       setLoading(true);

//       const getResponse = await fetch(`/api/posts`);
//       const data = await getResponse.json();
//       setSearchResultData(data);

//     } catch (err) {
//       setSearchResultData([]);
//       console.error(err);

//     } finally {
//       setLoading(false);    
//     }
//   }

//   useEffect(() => {
//     handleSearchData();
//   }, [searchParams]);

//   return (
//     <div className="w-full grid grid-cols-2 gap-4">
//       {searchResultData && searchResultData.map((item, index) => 
//         <PostCard item={item} key={index}/>
//         <div></div>
//       )}
//     </div>
//   )
// }
  
// export default People