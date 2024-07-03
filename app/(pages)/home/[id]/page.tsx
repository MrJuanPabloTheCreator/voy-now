"use client"

import GoogleMapComponent from "@/app/_components/google_maps";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Facility {
  facility_id: number;
  facility_name: string;
  facility_description: string | null;
  facility_image_url: string;
  city: string | null;
  region: string | null;
  address: string | null;
  postal_code: number | null;
  geom: {
    x: number;
    y: number;
  }
}

const FacilityPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchFacilityData, setSearchFacilityData] = useState<Facility | null>(null);

  const searchParams = useSearchParams();
  const facility_id = searchParams.get("facility_id");

  async function handleSearchData(){
    try {      
      const getResponse = await fetch(`/api/facilities/${facility_id}`);
      const data = await getResponse.json();
      setSearchFacilityData(data[0]);

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);    
    }
  }

  useEffect(() => {
    if(facility_id){
      handleSearchData();
    }
  }, [searchParams])
      

  return(
      <div className="flex flex-col w-full items-center">
        {searchFacilityData &&
          <div className="flex w-full justify-center py-4 bg-white mt-5 space-x-5">
            <img src={searchFacilityData.facility_image_url} alt="Facility URL" className="h-60 w-96 object-cover rounded-xl"/>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold">{searchFacilityData.facility_name}</h1>
              <h2 className="text-lg font-semibold">{searchFacilityData.city}, Region {searchFacilityData.region}</h2>
              <p>{searchFacilityData.address}</p>
            </div>
            {searchFacilityData?.geom && (
              <GoogleMapComponent geom={searchFacilityData.geom}/>
            )}
          </div>      
        }
      </div>
  )
}

export default FacilityPage;