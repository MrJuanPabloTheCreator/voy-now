"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';

import SideBarFilter from './_components/side_bar_filter';
import DiscoverNavbar from './_components/navbar';

const DiscoverLayout = ({
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
    <div className='flex min-h-screen space-x-4 px-4'>
        <div className='w-[30%] border-r-2 border-white/10'>
            <div className='sticky top-[68px] pr-4'>
                <SideBarFilter active_page={activePage}/>
            </div>
        </div>
        <main className='w-[70%]'>
            <div className='sticky top-[68px] px-4 z-20'>
                <DiscoverNavbar active_page={activePage}/>
            </div> 
            <div className='pt-8'>
                {children}
            </div>
        </main>
    </div>
  )
}

export default DiscoverLayout;