import React from 'react'
import DiscoverNavbar from './_components/navbar';
import Filter from './_components/filter';

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {
  return (
    <div className='flex mx-5 space-x-2'>
      <div className='w-[30%] space-y-2'>
        <DiscoverNavbar/>
        <Filter/>
      </div>
      <main className='h-full w-[70%]'>
        {children} 
      </main>
    </div>
  )
}

export default PagesLayout