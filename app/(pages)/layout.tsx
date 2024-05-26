import React from 'react'
import Navbar from './_components/navbar';

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {
  return (
    <div className='relative'>
      <Navbar/>
      <main className='h-full'>
        {children} 
      </main>
    </div>
  )
}

export default PagesLayout