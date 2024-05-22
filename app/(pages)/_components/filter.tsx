"use client"

import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { useRouter } from "next/navigation";
import { useState } from "react"

interface Facility {
    facility_id: number;
    facility_name: string;
    facility_description: string;
    facility_image_url: string;
    city: string;
    region: string;
    address: string;
    postal_code: number | null;
    distance: number;
}

export default function Filter(){
    const [closestsFacilities, setClosestsFacilities] = useState<Array<Facility>>([])
    const router = useRouter();

    async function handleGetClosest(){
        try {
            const position = await getGeolocation();
            
            const getClosestsFacilities = await fetch(`/api/closest_facility?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
            const closestsFacilities = await getClosestsFacilities.json()
            setClosestsFacilities(closestsFacilities[0])
        } catch (err) {
            // setLocation(null);
        }
    }
    
    return (
        <div className="fixed top-[76px] left-48 p-24 bg-white shadow-lg rounded-lg">
            <h2>Get Closest Facilities</h2>
            <button onClick={() => handleGetClosest()} className="bg-slate-300 p-2 rounded-lg">Get Closest</button>
            {closestsFacilities.map((item, index) => (
                <div key={item.facility_id}>
                    {index + 1}. {item.facility_name}
                </div>
            ))}
        </div>
    )
}