"use client"

import Navbar from './_components/navbar';
import { ChatProvider } from './_components/chatContext';
import Chat from './_components/chatModal';

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

  return (
    <div className='h-full w-full flex flex-col items-center justify-center relative'>
      <ChatProvider>
        <div className='fixed top-0 left-0 right-0 z-30 flex justify-center bg-zdark border-b-2 border-white/10'>
          <Navbar/>
        </div>
        <main className='h-full w-full min-h-screen max-w-[1920px] pt-[52px]'>
          {children}
          <div className='fixed bottom-0 right-10 z-20'>
            <Chat/>
          </div>
        </main>
      </ChatProvider>
    </div>
  )
}

export default PagesLayout