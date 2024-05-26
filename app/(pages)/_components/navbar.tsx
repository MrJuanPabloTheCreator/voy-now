"use client"

import { Home, LayoutGrid, PlusSquare, Search, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const Navbar = () => {
    const [activePage, setActivePage] = useState('')
    const pathname = usePathname();

    useEffect(() => {
        const fixedPath = pathname.split('/')
        setActivePage(`/${fixedPath[1]}`)
    }, [pathname])
    
    const isLinkActive = (href: string) => activePage === href;

    return (
        <div className="flex items-center justify-between bg-white px-5 py-1 sticky top-0 z-20 w-full">
            <img src="Asset 6.png" className="w-10 h-10 rounded-full"/>
            <div className="relative flex font-bold text-md space-x-2">
                <Link href={"/home"} className="flex justify-center py-2 items-center px-10 hover:bg-slate-200 text-slate-500 rounded-md">
                    <Home size={28}/>
                    {isLinkActive("/home") ? <label className="absolute py-[2px] px-7 bg-light_purple bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={"/discover"} className="flex justify-center py-2 items-center px-10 hover:bg-slate-200 text-slate-500 rounded-md">
                    <Search size={28} />
                    {isLinkActive("/discover") ? <label className="absolute py-[2px] px-7 bg-light_purple bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={"/leagues"} className="flex justify-center py-2 items-center px-10 hover:bg-slate-200 text-slate-500 rounded-md">
                    <Shield size={28}/>
                    {isLinkActive("/leagues") ? <label className="absolute py-[2px] px-7 bg-light_purple bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
                <Link href={"/create"} className="flex justify-center py-2 items-center px-10 hover:bg-slate-200 text-slate-500 rounded-md">
                    <PlusSquare size={28}/>
                    {isLinkActive("/create") ? <label className="absolute py-[2px] px-7 bg-light_purple bottom-[-4px] z-50 rounded-lg"/> : ''}
                </Link>
            </div>
            <img src="/profile.jpeg" className="w-10 h-10 rounded-full"/>
        </div>
    )
}

export default Navbar