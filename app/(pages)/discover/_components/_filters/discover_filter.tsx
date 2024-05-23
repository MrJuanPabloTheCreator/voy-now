"use client"

import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

interface FilterProps {
    current_location: boolean;
    size: string;
}   

export default function DiscoverFilter(){
    const searchParamsUrl = new URLSearchParams(window.location.search);
    const latitude = searchParamsUrl.get("latitude");
    const longitude = searchParamsUrl.get("longitude");

    const [searchParams, setSearchParams] = useState<string>('/discover/result?')
    const [filter, setFilter] = useState<FilterProps>({
        current_location: Boolean(latitude && longitude),
        size: 'all',
    })

    const router = useRouter();

    async function handleGetClosest() {
        try {
            const position = await getGeolocation();
            return { latitude: position.coords.latitude, longitude: position.coords.longitude };
        } catch (err) {
            return null;
        }
    }

    async function handleSearch() {
        console.log(filter.current_location) 
        console.log(searchParams)    
        await router.push(searchParams);
    }

    useEffect(() => {
        async function updateSearchParams() {
            let params = '/discover/result?';

            if(filter.current_location){
                const coords = await handleGetClosest()
                if (coords) {
                    params += `latitude=${coords.latitude}&longitude=${coords.longitude}&`;
                }
            }
            
            setSearchParams(params.slice(0, -1));
        }

        updateSearchParams();
    }, [filter]);
    
    return (
        <div className="bg-white w-full h-fit rounded-lg p-2 space-y-2">
            <h2 className="text-2xl font-semibold">Search as you like!</h2>
            <label className="flex items-center bg-slate-200 w-full rounded-full overflow-hidden space-x-2">
                <Search size={28} className="pl-2"/>
                <input className="w-full py-2 bg-slate-200 outline-none"/>
            </label>
            <select id="fieldSize" name="fieldSize" className="w-full py-2 border-2 border-light_purple text-light_purple rounded-lg outline-none font-semibold">
                <option value="baby5v5">Baby Soccer - 5 v 5</option>
                <option value="medium7v7">Medium - 7 v 7</option>
                <option value="big9">Big 9 - 9</option>
                <option value="fullField9v9">Full Field - 9 v 9</option>
            </select>
            <div className="flex py-2 items-center w-full border-2 px-2 justify-between rounded-lg">
                <label className="text-md font-semibold">Current Location</label>
                <button 
                    onClick={() => setFilter((prevFilter) => ({ ...prevFilter, current_location: !filter.current_location }))}
                    className={`p-1 flex h-fit w-10 rounded-full transition-colors duration-300 ${filter.current_location === true ? 'bg-light_purple':'bg-slate-300'}`}>
                    <div className={`rounded-full p-2 transform transition-transform duration-300 ${filter.current_location === true ? 'bg-light_green translate-x-4':'bg-light_green'}`}></div>
                </button>
            </div>
            <button onClick={() => handleSearch()} className="bg-light_green text-white font-semibold py-2 rounded-lg w-full hover:bg-green-400">
                Search
            </button>
        </div>
    )
}