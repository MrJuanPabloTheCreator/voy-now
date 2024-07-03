import Image from 'next/image';
import React from 'react'

interface Post {
    id: string;
    user_id: string;
    description: string;
    media_url: string;
    created_at: string;
}

interface PostCardProps {
    item: Post;
    key: number;
}



const PostCard:React.FC<PostCardProps> = ({ item, key }) => {
  return (
    <div className='flex flex-col p-2 rounded-lg bg-white h-[200px]'>
        <div className='w-full relative h-full'>
            <Image alt='Post Image' src={item.media_url} fill className='object-cover'/>
        </div>
        <div>
            <h2>{item.description}</h2>
        </div>
    </div>
  )
}

export default PostCard