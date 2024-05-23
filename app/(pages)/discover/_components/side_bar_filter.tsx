"use client"

import { useEffect, useState } from "react";
import DiscoverFilter from "./_filters/discover_filter";
import TournamentsFilter from "./_filters/touranaments_filter";
import PeopleFilter from "./_filters/people_filter";

interface SideBarFilterProps {
    active_page: string;
  }
  
const SideBarFilter: React.FC<SideBarFilterProps> = ({ active_page }) => {
    const [activePage, setActivePage] = useState('');

    useEffect(() => {
        console.log('active page passed:',active_page)
        setActivePage(active_page)
    }, [active_page])
    
    const isLinkActive = (href: string) => activePage === href;

    return (
        <div className="w-full">
            {isLinkActive('/discover/result') || isLinkActive('/discover') ? (
                    <DiscoverFilter/>
            ) : isLinkActive('/discover/people') ? (
                    <PeopleFilter/>
            ) : isLinkActive('/discover/tournaments') ? (
                    <TournamentsFilter/>
            ) : null}
        </div>
    );
};

export default SideBarFilter;