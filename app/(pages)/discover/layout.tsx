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
    <div className='flex mx-4 space-x-4'>
      <div className='w-[30%] pt-4'>
        <div className='sticky top-[68px]'>
          <SideBarFilter active_page={activePage}/>
        </div>
      </div>
      <main className='h-full w-[70%] pt-4'>
        <div className='sticky top-[68px]'>
          <DiscoverNavbar active_page={activePage}/>
        </div>
        {children} 
      </main>
    </div>
  )
}

export default PagesLayout