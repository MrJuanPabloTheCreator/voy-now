"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface DiscoverNavbarProps {
    active_page: string;
}

const DiscoverNavbar = ({ active_page }: DiscoverNavbarProps) => {
    const [activePage, setActivePage] = useState('');

    useEffect(() => {
        setActivePage(active_page)
    }, [active_page])
    
    const isLinkActive = (href: string) => activePage === href;

    return (
        <div className="flex justify-center pt-2">
            <div className="grid grid-cols-3 bg-white font-semibold text-md overflow-hidden shadow-md rounded-lg w-full">
                <Link href={"/discover"} passHref>
                    <p className={`flex justify-center py-2 items-center ${isLinkActive("/discover") || isLinkActive("/discover/result")  ? "bg-light_purple text-white" : "text-black hover:bg-slate-100"}`}>
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
