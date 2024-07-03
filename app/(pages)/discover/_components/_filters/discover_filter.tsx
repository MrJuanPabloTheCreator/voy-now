"use client"

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, MouseEventHandler, useEffect, useState } from "react"
import PlaceAutocomplete from '@/app/_components/google_places_autocomplete';

const time_options = [
    { value: '8', label: '8:00' },
    { value: '9', label: '9:00' },
    { value: '10', label: '10:00' },
    { value: '11', label: '11:00' },
    { value: '12', label: '12:00' },
    { value: '13', label: '13:00' },
    { value: '14', label: '14:00' },
    { value: '15', label: '15:00' },
    { value: '16', label: '16:00' },
    { value: '17', label: '17:00' },
    { value: '18', label: '18:00' },
    { value: '19', label: '19:00' },
    { value: '20', label: '20:00' },
    { value: '21', label: '21:00' },
    { value: '22', label: '22:00' },
    { value: '23', label: '23:00' },
];

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
    selectedPlace: google.maps.places.PlaceResult | null;
    current_location: boolean;
    size: string;
    grass_type: string;
    ratio: number;
}
  

const DiscoverFilter = () => {
    const searchParamsUrl = new URLSearchParams(window.location.search);
    const latitude = searchParamsUrl.get("latitude");
    const longitude = searchParamsUrl.get("longitude");
    const view_map = searchParamsUrl.get("map_view");

    const [searchParams, setSearchParams] = useState<string>('/discover/result?')
    const [filter, setFilter] = useState<FilterProps>({
        selectedPlace: null,
        current_location: Boolean(latitude && longitude),
        size: '',
        grass_type: '',
        ratio: 10,
    })

    const router = useRouter();

    const handleSelectPlace = (e: google.maps.places.PlaceResult) => {
        setFilter({...filter, selectedPlace: e, current_location: false});
    }

    const handleToggleCurrentLocation = () => {
        setFilter((prevFilter) => ({ ...prevFilter, current_location: !filter.current_location, selectedPlace: null }))
    }

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
        await router.push(searchParams);
    }

    async function updateSearchParams() {
        let params = '/discover?';

        if(filter.selectedPlace){
            params += `id=${filter.selectedPlace.place_id}&`;
        }
        if(filter.size){
            params += `field_size=${filter.size}&`;
        }    
        if(filter.grass_type){
            params += `grass_type=${filter.grass_type}&`;
        }
        if(filter.ratio && filter.current_location){
            params += `ratio=${filter.ratio}&`;
        }
        if(filter.current_location){
            const coords = await handleGetClosest()
            if (coords) {
                params += `latitude=${coords.latitude}&longitude=${coords.longitude}&`;
            }
        }  
        if(view_map){
            params += `map_view=true&`;
        }
        setSearchParams(params.slice(0, -1));
    }

    useEffect(() => {
        updateSearchParams();
    }, [filter]);
    
    
    return (
        <div className="rounded-lg py-0 space-y-4">
            <h2 className="text-2xl font-bold text-white pb-1">Search as you like!</h2>
            <PlaceAutocomplete country="cl" onPlaceSelect={handleSelectPlace} />
            <label className='flex flex-col'>
                <h3 className="font-semibold text-white">Size</h3>
                <select 
                    value={filter.size} 
                    onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, size: String(e.target.value) }))} 
                    className="rounded-md w-full border-2 text-white/40 border-white/10 py-2 bg-zdark outline-none"
                >
                    <option value="" className='text-white/40'>All</option>
                    {size_options.map((option) => (
                        <option key={option.value} value={option.value} className='text-white/40'>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col">
                <h3 className="font-semibold text-white">Grass</h3>
                <select 
                    value={filter.grass_type} 
                    onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, grass_type: String(e.target.value) }))} 
                    className="rounded-md w-full border-2 text-white/40 border-white/10 py-2 bg-zdark outline-none"
                >
                    <option value="" className='text-white/40'>All</option>
                    {grass_options.map((option) => (
                        <option key={option.value} value={option.value} className='text-white/40'>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col">
                <h3 className="font-semibold text-white">Location</h3>
                <div className="flex py-2 items-center w-full border-2 border-white/10 px-2 justify-between rounded-lg">
                    <label className="text-md font-semibold text-white/40">Current Location</label>
                    <button 
                        onClick={handleToggleCurrentLocation}
                        className={`p-1 flex h-fit w-12 rounded-full border-2 border-white/10 transition-colors duration-300 ${filter.current_location === true ? 'bg-zwteen':''}`}>
                        <div className={`rounded-full p-2 transform transition-transform duration-300 bg-zdgreen ${filter.current_location === true ? 'translate-x-5':''}`}></div>
                    </button>
                </div>
            </label>
            {filter.current_location && 
                <label className="flex flex-col">
                    <h3 className="font-semibold text-white/40">Ratio</h3>
                    <div className="flex justify-between">
                        <input
                            type="range"
                            id="ratio-slider"
                            min={0}
                            max={100}
                            step={1}
                            value={filter.ratio}
                            onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, ratio: Number(e.target.value) }))}
                            className="w-[85%] bg-black"
                                // [&::-webkit-slider-thumb]:w-[15px]
                                // [&::-webkit-slider-thumb]:h-[15px]
                                // [&::-webkit-slider-thumb]:appearance-none
                                // [&::-webkit-slider-thumb]:bg-blue-950
                                // [&::-webkit-slider-thumb]:rounded-full
                        />
                        <span className="font-semibold text-white/40">{filter.ratio}mi</span>
                    </div>
                </label>
            }
            <button onClick={() => handleSearch()} className="bg-zwteen text-zdgreen font-semibold py-2 rounded-lg w-full hover:bg-white/20">
                Search
            </button>
        </div>
    )
} 

export default DiscoverFilter;