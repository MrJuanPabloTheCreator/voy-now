"use client"

import { CircleUserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_image: string;
  post_created_at: string;
  media_url: string;
  description: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [postsFeed, setPostsFeed] = useState<Post[]>([]);

  const router = useRouter();

  const handleGetUsersPosts = async () => {
    const getPosts = await fetch('/api/posts')
    const { success, posts, error } = await getPosts.json();
    if(success){
      setPostsFeed(posts)
    } else {
      throw new Error(error)
    }
  }

  useEffect(() => {
    handleGetUsersPosts();
  }, [])
  
  return (
    <main className="w-4/5">
      {postsFeed.length > 0 && postsFeed.map((item, index) => (
        <div key={index} className="pb-10 w-full border-b-2 border-white/10">
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-1">
              {item.user_image ? (
                <Image 
                  src={item.user_image} width={32} height={32} alt='User Photo'
                  onClick={() => router.push(`/users/${item.user_id}`)} 
                  className="object-cover rounded-full overflow-hidden hover:cursor-pointer"/>
              ):(
                <CircleUserRound 
                  size={32} 
                  onClick={() => router.push(`/users/${item.user_id}`)}
                  className='text-zlgray rounded-full'/>
              )} 
              <h2 
                className="font-semibold text-white/100 hover:cursor-pointer hover:underline"
                onClick={() => router.push(`/users/${item.user_id}`)}
              >
                {item.user_name}
              </h2>
            </div>
            <h3 className="text-white">{item.description}</h3>
          </div>
          {item.media_url && 
            <div className="relative w-full min-h-[500px]">
              <Image src={item.media_url} alt="Post Image" fill className="object-cover"/>
            </div>
          }        
        </div>
      ))}
    </main>
  );
}
