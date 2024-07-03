"use client"

import React, { useEffect, useState } from 'react'
import RightSideNav from './_components/rightSideNav';

const HomeLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

    return (
        <div className='flex min-h-screen space-x-4 px-4'>
            <div className='w-[25%]'>
                <div className='sticky top-[68px]'>
                    {/* <div className=' bg-zdark rounded-md min-h-screen'></div> */}
                </div>
            </div>
            <main className='w-[50%] flex items-center justify-center pt-4 border-r-2 border-white/10'>
                {children}
            </main>
            <div className='w-[25%]'>
                <div className='sticky top-[68px]'>
                    <RightSideNav/>
                </div>
            </div>
        </div>
    )
}

export default HomeLayout