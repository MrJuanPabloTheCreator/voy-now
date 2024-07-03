import React from 'react'
import MyTeamSidebar from './_components/myteam_sidebar';

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {
  return (
    <div className='flex h-full w-full'>
      <div className='w-[20%]'>
        <MyTeamSidebar/>
      </div>
      <main className='w-[80%]'>
          {children} 
      </main>
    </div>
  )
}

export default PagesLayout