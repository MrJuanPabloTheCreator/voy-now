"use client"

import { Home, PlusSquare, Search, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import UserButton from "./userButton"
import NotificationsButton from "./notificationsButton"
import { getSession } from "next-auth/react"
import ChatButton from "./chatButton"
import { Session } from "next-auth"

const Navbar = () => {
    const [session, setSession] = useState<Session | null>(null)
    const [activePage, setActivePage] = useState('')
    const pathname = usePathname();

    useEffect(() => {
        const fixedPath = pathname.split('/')
        setActivePage(`/${fixedPath[1]}`)
    }, [pathname])

    const handleGetSession = async () => {
        const updatedSession = await getSession();
        setSession(updatedSession)
        console.log(updatedSession)
    }

    useEffect(() => {
        handleGetSession();     
    }, []);

    const isLinkActive = (href: string) => activePage === href;

    if(session === null) return <div>Loading...</div>

    return (
        <div className="flex items-center justify-center py-1 w-full max-w-[1920px] relative">
            {/* <img src="Asset 6.png" className="w-10 h-10 rounded-full"/> */}
            <div className="flex items-center absolute left-0 pl-5">
                <h1 className="text-3xl flex font-extrabold text-zdgreen items-center">Party</h1>
                <p className="text-white/40 text-3xl font-extrabold">-</p>
                <h1 className="text-3xl flex font-extrabold text-white/40 items-center">Do</h1>
            </div>
            <div className="relative flex font-bold text-md space-x-2">
                <Link href={"/home"} className="flex justify-center py-2 items-center px-10 hover:bg-white/10 text-zlgray rounded-md">
                    <Home size={28}/>
                    {isLinkActive("/home") ? <label className="absolute py-[2px] px-7 bg-zdgreen bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={"/discover"} className="flex justify-center py-2 items-center px-10 hover:bg-white/10 text-zlgray rounded-md">
                    <Search size={28} />
                    {isLinkActive("/discover") ? <label className="absolute py-[2px] px-7 bg-zdgreen bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={`/myteams/users/${session?.user?.id}`} className="flex justify-center py-2 items-center px-10 hover:bg-white/10 text-zlgray rounded-md">
                    <Shield size={28}/>
                    {isLinkActive('/myteams') ? <label className="absolute py-[2px] px-7 bg-zdgreen bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={"/create"} className="flex justify-center py-2 items-center px-10 hover:bg-white/10 text-zlgray rounded-md">
                    <PlusSquare size={28}/>
                    {isLinkActive("/create") ? <label className="absolute py-[2px] px-7 bg-zdgreen bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
            </div>
            <div className="flex items-center space-x-2 absolute right-0 pr-5">
                <ChatButton user={session?.user}/>
                <NotificationsButton user={session?.user}/>
                <UserButton user={session?.user}/>
            </div>
        </div>
    )
}

export default Navbar