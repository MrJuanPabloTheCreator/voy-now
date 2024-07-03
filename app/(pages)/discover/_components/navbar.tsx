"use client"

import { Map } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DiscoverNavbarProps {
    active_page: string;
}

const DiscoverNavbar = ({ active_page }: DiscoverNavbarProps) => {
    const [activePage, setActivePage] = useState('');
    const [viewMap, setViewMap] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const map_view = searchParams.get("map_view");
    // if(map_view === 'true'){
    //     setViewMap(true);
    // }

    const isLinkActive = (href: string):boolean => activePage === href;

    const handleMapButton = () => {
        setViewMap(!viewMap);
    }

    useEffect(() => {
        setActivePage(active_page)
    }, [active_page])

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (viewMap) {
            if (params.get("map_view") !== "true") {
                params.set("map_view", "true");
                router.push(`/discover?${params.toString()}`);
            }
        } else {
            if (params.has("map_view")) {
                params.delete("map_view");
                router.push(`/discover?${params.toString()}`);
            }
        }
    },[viewMap, searchParams])

    return (
        <div className="w-full h-fit flex justify-center relative">   
            <button 
                onClick={handleMapButton}
                className={`absolute top-0 left-0 h-full px-2 rounded-md transition-colors duration-500 font-semibold ${viewMap ? 'bg-zdgreen text-zdark':'bg-zwteen text-zdgray hover:text-zdgreen'}`}>
                <Map size={24}/>
            </button>
            <div className="grid grid-cols-3 bg-zwteen font-semibold text-sm overflow-hidden rounded-full w-1/2 relative z-10">
                <div className={`absolute rounded-full flex items-center z-10 justify-center top-0 left-0 bg-zdgreen w-1/3 h-full transform transition-transform duration-500 ease-in-out text-white ${isLinkActive("/discover/teams")  ? "translate-x-[100%]" : isLinkActive("/discover/people")  ?  "translate-x-[200%]" : "translate-x-0"}`}/>
                <Link href={"/discover"} passHref className={`flex justify-center py-2 items-center z-20 transition-colors duration-500 rounded-full ${isLinkActive("/discover")  ? " text-zdark" : "text-zdgreen hover:bg-white/10"}`}>
                    Soccer Fields
                </Link>
                <Link href={"/discover/teams"} passHref className={`flex justify-center py-2 items-center z-20 transition-colors duration-500 rounded-full ${isLinkActive("/discover/teams") ? " text-zdark" : isLinkActive("/discover/people") ? "text-zdgreen": "text-zdgreen hover:bg-white/10"}`}>
                    Matches
                </Link>
                <Link href={"/discover/people"} passHref className={`flex justify-center py-2 items-center z-20 transition-colors duration-500 rounded-full ${isLinkActive("/discover/people") ? " text-zdark" : "text-zdgreen hover:bg-white/10"}`}>
                    Players
                </Link>
            </div>
        </div>
    );
};

export default DiscoverNavbar;
