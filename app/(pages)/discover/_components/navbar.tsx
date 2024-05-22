"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DiscoverNavbar = () => {
    const [activePage, setActivePage] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        setActivePage(pathname)
    }, [pathname])
    
    const isLinkActive = (href: string) => activePage === href;

    return (
        <div className="flex justify-center pt-2">
            <div className="grid grid-cols-3 bg-white font-semibold text-md overflow-hidden shadow-md rounded-lg w-full">
                <Link href={"/discover"} passHref>
                    <p className={`flex justify-center py-2 items-center ${isLinkActive("/discover") ? "bg-light_purple text-white" : "text-black hover:bg-slate-100"}`}>
                        Soccer Fields
                    </p>
                </Link>
                <Link href={"/discover/tournaments"} passHref>
                    <p className={`flex justify-center py-2 items-center border-x-2 ${isLinkActive("/discover/tournaments") ? "bg-light_purple text-white" : "text-black hover:bg-slate-100"}`}>
                        Tournaments
                    </p>
                </Link>
                <Link href={"/discover/people"} passHref>
                    <p className={`flex justify-center py-2 items-center ${isLinkActive("/discover/people") ? "bg-light_purple text-white" : "text-black hover:bg-slate-100"}`}>
                        People
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default DiscoverNavbar;
