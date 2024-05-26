"use client"

import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const size_options = [
    { value: 'baby', label: 'Baby (5 vs 5)' },
    { value: 'medium', label: 'Seven (7 vs 7)' },
    { value: 'big', label: 'Big (9 vs 9)' },
    { value: 'full', label: 'Full (11 vs 11)' },
];

const grass_options = [
    { value: 'natural', label: 'Natural' },
    { value: 'sintetic', label: 'Sintetic' },
];

interface FilterProps {
    current_location: boolean;
    size: string;
    grass_type: string;
}

export default function DiscoverFilter(){
    const searchParamsUrl = new URLSearchParams(window.location.search);
    const latitude = searchParamsUrl.get("latitude");
    const longitude = searchParamsUrl.get("longitude");

    const [searchParams, setSearchParams] = useState<string>('/discover/result?')
    const [filter, setFilter] = useState<FilterProps>({
        current_location: Boolean(latitude && longitude),
        size: '',
        grass_type: ''
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

    async function updateSearchParams() {
        let params = '/discover/result?';

        if(filter.current_location){
            const coords = await handleGetClosest()
            if (coords) {
                params += `latitude=${coords.latitude}&longitude=${coords.longitude}&`;
            }
        }  
        if(filter.size){
            params += `field_size=${filter.size}&`;
        }    
        if(filter.grass_type){
            params += `grass_type=${filter.grass_type}&`;
        }
        setSearchParams(params.slice(0, -1));
    }

    useEffect(() => {
        updateSearchParams();
    }, [filter]);
    
    return (
        <div className="bg-white w-full h-fit rounded-lg p-2 space-y-4">
            <h2 className="text-2xl font-semibold">Search as you like!</h2>
            <label className="flex items-center bg-slate-200 w-full rounded-full overflow-hidden space-x-2">
                <Search size={28} className="pl-2"/>
                <input className="w-full py-2 bg-slate-200 outline-none"/>
            </label>
            <label className='flex flex-col'>
                <h3 className="font-semibold">Date</h3>
                <div className="flex py-2 w-full justify-between border-2 rounded-lg font-semibold px-2">
                    <button>
                        <ChevronLeft className="text-light_purple"/>
                    </button>
                    Thursday, 23
                    <button>
                        <ChevronRight className="text-light_purple"/>
                    </button>
                </div>
            </label>
            <label className='flex flex-col'>
                <h3 className="font-semibold">Size</h3>
                <select 
                    value={filter.size} 
                    onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, size: String(e.target.value) }))} 
                    className="rounded-md w-full border-2 py-2"
                >
                    <option value="">Select Size</option>
                    {size_options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col">
                <h3 className="font-semibold">Grass</h3>
                <select 
                    value={filter.grass_type} 
                    onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, grass_type: String(e.target.value) }))} 
                    className="rounded-md w-full border-2 py-2"
                >
                    <option value="">Select grass type</option>
                    {grass_options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col">
                <h3 className="font-semibold">Location</h3>
                <div className="flex py-2 items-center w-full border-2 px-2 justify-between rounded-lg">
                    <label className="text-md font-semibold">Current Location</label>
                    <button 
                        onClick={() => setFilter((prevFilter) => ({ ...prevFilter, current_location: !filter.current_location }))}
                        className={`p-1 flex h-fit w-12 rounded-full transition-colors duration-300 border-2 ${filter.current_location === true ? 'bg-light_purple':''}`}>
                        <div className={`rounded-full p-2 transform transition-transform duration-300 bg-light_green ${filter.current_location === true ? 'translate-x-5':''}`}></div>
                    </button>
                </div>
            </label>
            <button onClick={() => handleSearch()} className="bg-light_green text-white font-semibold py-2 rounded-lg w-full hover:bg-green-400">
                Search
            </button>
        </div>
    )
}