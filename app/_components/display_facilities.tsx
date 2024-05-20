"use client"

import { useEffect, useState } from "react";

interface Facility {
    facility_id: number | null;
    facility_name: string;
    facility_description: string;
    facility_image_url: string;
}

export default function DisplayFacilities(){
    const [facilitiesFeed, setFacilitiesFeed] = useState<Array<Facility>>([])

    async function handleGetData(){
        const facilitiesGetRequest = await fetch('/api/facilities', {
            method: 'GET',
        })
        const facilitiesApiResponse = await facilitiesGetRequest.json();
        console.log("HandleGetData:", facilitiesApiResponse);
        setFacilitiesFeed(facilitiesApiResponse)
    };

    useEffect(() => {
        console.log("Use Effect...")
        handleGetData()
    }, [])

    return (
        <div className="grid grid-cols-4 gap-2 w-3/5 items-center rounded-lg">
            {facilitiesFeed.map((item) => (
                <div key={item.facility_id} className="flex flex-col items-start bg-white p-4 rounded-lg h-full shadow-md hover:cursor-pointer hover:shadow-xl">
                    <img
                        src={item.facility_image_url}
                        alt={item.facility_name}
                        className="object-cover w-full h-36 rounded-lg"
                    />
                    <h3 className="text-lg font-semibold">{item.facility_name}</h3>
                    <label>{item.facility_description}</label>
                </div>
            ))}
        </div>
    )
}