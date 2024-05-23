"use client"

import DisplayFacilities from "@/app/_components/display_facilities";
import { useSearchParams } from "next/navigation";
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

const Results = () => {
  const [closestsFacilities, setClosestsFacilities] = useState<Array<Facility>>([])

  const searchParams = useSearchParams()
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  async function handleGetClosest(latitude: string | null, longitude: string | null){
    try {
      if (latitude && longitude) {
        const response = await fetch(`/api/closest_facility?latitude=${latitude}&longitude=${longitude}`);
        const data = await response.json();
        console.log(data)
        setClosestsFacilities(data[0] || []);
      }
    } catch (err) {
      setClosestsFacilities([]);
      console.error(err);
    }
  }

  useEffect(() => {
    if (latitude && longitude) {
      handleGetClosest(latitude, longitude);
    } else setClosestsFacilities([])
  }, [searchParams]);
  

  return (
    <main className="flex mt-2">
      {closestsFacilities.length !== 0 ?
        <div className="grid grid-cols-3 gap-2 w-full rounded-lg">
          {closestsFacilities.map((item) => (
            <div key={item.facility_id} className="flex flex-col items-start bg-white p-4 rounded-lg h-full shadow-md hover:cursor-pointer hover:shadow-xl">
              <img
                src={item.facility_image_url}
                alt={item.facility_name}
                className="object-cover w-full h-48 rounded-lg"
              />
              <h3 className="text-xl font-semibold">{item.facility_name}</h3>
                {/* <label className="text-sm font-semibold">{`${Math.round(item.distance / 1000)}Km/${Math.round(item.distance / 1609.34)}Miles`}</label> */}
              <div className="flex items-center justify-between w-full">
                <label>{item.address}</label>
                <label className="text-sm font-semibold">{`${(item.distance / 1609.34).toFixed(1)}mi`}</label>
              </div>
              <label>{item.facility_description}</label>
            </div>
          ))}
        </div> : <DisplayFacilities />
    }
    </main>
  );
}

export default Results;