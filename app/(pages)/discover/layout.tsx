"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';

import SideBarFilter from './_components/side_bar_filter';
import DiscoverNavbar from './_components/navbar';

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {
  const [activePage, setActivePage] = useState('');
  const pathname = usePathname();

  useEffect(() => {
      const fixedPath = pathname.split('/')
      console.log(fixedPath)
      if(fixedPath.length == 3){
          setActivePage(`/${fixedPath[1]}/${fixedPath[2]}`)
      } else {
          setActivePage(`/${fixedPath[1]}`)
      }
  }, [pathname])

  return (
    <div className='flex mx-5 space-x-2'>
      <div className='w-[30%] space-y-2'>
        <DiscoverNavbar active_page={activePage}/>
        <SideBarFilter active_page={activePage}/>
      </div>
      <main className='h-full w-[70%]'>
        {children} 
      </main>
    </div>
  )
}

export default PagesLayout