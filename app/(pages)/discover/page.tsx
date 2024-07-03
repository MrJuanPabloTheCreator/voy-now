"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import GoogleMapComp from "@/app/_components/google_map";
import SkeletonCard from "./_components/skeleton_card";
import { OctagonX } from "lucide-react";

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
  geom: {
    x: number;
    y: number;
  }
}

const DiscoverPage = () => {
  const [mapView, setMapView] = useState(false);
  const [searchResultData, setSearchResultData] = useState<Array<Facility>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const map_view = searchParams.get("map_view");
  const ratio = searchParams.get("ratio");
  const userLocation = {
    x: Number(searchParams.get("longitude")),
    y: Number(searchParams.get("latitude"))
  }

  const queryParams = searchParams.toString();

  async function handleSearchData(){
    try {
      setLoading(true);
      let getResponse;

      if(searchParams.size > 0){
        getResponse = await fetch(`/api/search_facility?${queryParams}`);
      } else {
        getResponse = await fetch(`/api/facilities`);
      }
      const data = await getResponse.json();
      setSearchResultData(data);

    } catch (err) {
      setSearchResultData([]);
      console.error(err);

    } finally {
      setLoading(false);    
    }
  }

  useEffect(() => {
    handleSearchData();
    if(map_view){
      setMapView(true);
    } else {
      setMapView(false);
    }
  }, [searchParams]);

  return (
    <main className="w-full h-full relative">
      { mapView ? (<GoogleMapComp userLocation={userLocation} facilities={searchResultData}/>):(
        (loading ? 
          (
            <div className="grid grid-cols-3 gap-4 w-full">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index}/>
              ))}
            </div>
          ) : searchResultData && searchResultData.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 w-full">
              {searchResultData.map((item) => (
                <div key={item.facility_id} className="flex flex-col items-start h-full">
                  <img
                    src={item.facility_image_url}
                    alt={item.facility_name}
                    className="object-cover w-full h-64 hover:cursor-pointer rounded-md overflow-hidden"
                    onClick={() => router.push(`/home/result?facility_id=${item.facility_id}`)}
                  />
                  <div className="flex flex-col w-full px-2 pt-2 pb-5">
                    <h2 className="w-fit text-md font-bold text-white hover:cursor-pointer hover:underline">{item.facility_name}</h2>
                    <h3 className="w-fit text-sm font-semibold text-white/40">{item.address} - {`${(item.distance / 1609.34).toFixed(1)}mi`}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center'>
              <OctagonX size={36}/>
              <p className='text-xl font-semibold'>No results</p>
            </div>
          )
        )
      )}
    </main>
  );
}

export default DiscoverPage;