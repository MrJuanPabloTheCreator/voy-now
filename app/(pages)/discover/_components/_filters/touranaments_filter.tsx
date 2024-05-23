"use client"

import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function TournamentsFilter(){
    const [typeOfFieldDropDown, setTypeOfFieldDropDown] = useState<boolean>(false)

    const router = useRouter();

    async function handleGetClosest(){
        try {
            const position = await getGeolocation();
            await router.push(`/discover/result?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
        } catch (err) {
            // setLocation(null);
        }
    }
    
    return (
        <div className="bg-white w-full h-fit rounded-lg p-2 space-y-2">
            <h2 className="text-2xl font-semibold">Search Tournaments you like!</h2>
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
            <button onClick={() => handleGetClosest()} className="border-2 border-light_green text-light_green font-semibold py-2 rounded-lg w-full hover:bg-slate-100">Get Closest Locations</button>
        </div>
    )
}