"use client"

import DisplayFacilities from "@/app/_components/display_facilities";
import { getGeolocation } from "@/app/utils/getUserGeolocation";
import { useState } from "react";

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

export default function Home() {
  const [closestsFacilities, setClosestsFacilities] = useState<Array<Facility>>([])

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
    <main className="flex mx-5 mt-2 justify-center">
      <div className="w-[90%]">
        <DisplayFacilities />
      </div>
    </main>
  );
}
