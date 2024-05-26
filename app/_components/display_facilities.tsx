"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function DisplayFacilities(){
    const [searchResultData, setSearchResultData] = useState<Array<Facility>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    async function handleSearchDefaultData(){
        try {
          setLoading(true);
          const getResponse = await fetch(`/api/facilities`);
          const data = await getResponse.json();
    
          if(data.length > 0){
            // console.log(data)
            setSearchResultData(data);
            // setDataFound(true);
          } else {
            setSearchResultData([])
            // setDataFound(false)
          }
    
        } catch (err) {
          setSearchResultData([]);
          // setDataFound(false);
          console.error(err);
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        console.log("Use Effect...")
        handleSearchDefaultData();
    }, [])

    return (
        <div className="grid grid-cols-4 gap-4 w-full">
            {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                    <div key={i}>
                    <div className="skeleton w-full h-64 rounded-xl" />
                    <div className="flex flex-col w-full py-2 space-y-2">
                        <h2 className="skeleton py-2 w-2/3"/>
                        <h3 className="skeleton py-2 w-1/3"/>
                    </div>
                    </div>
                ))
            ) : (
                searchResultData.map((item) => (
                    <div key={item.facility_id} className="flex flex-col items-start rounded-lg h-full">
                        <img
                            src={item.facility_image_url}
                            alt={item.facility_name}
                            className="object-cover w-full h-64 rounded-xl hover:cursor-pointer"
                            onClick={() => router.push(`/home/result?facility_id=${item.facility_id}`)}
                        />
                        <div className="flex flex-col w-full py-2">
                            <h2 className="w-fit text-md font-semibold hover:cursor-pointer hover:underline">{item.facility_name}</h2>
                            <h3 className="w-fit text-sm font-semibold text-slate-500">{item.address} - {`${(item.distance / 1609.34).toFixed(1)}mi`}</h3>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}