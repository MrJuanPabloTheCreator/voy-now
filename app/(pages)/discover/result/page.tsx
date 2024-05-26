"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SkeletonCard from "../_components/skeleton_card";

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
  const [searchResultData, setSearchResultData] = useState<Array<Facility>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
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
  }, [searchParams]);

  return (
    <main className="flex flex-col mt-2">
      <div className="grid grid-cols-3 gap-4 w-full">
        {loading ? (
          Array.from({ length: 10 }).map(() => (
            <SkeletonCard/>
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
    </main>
  );
}

export default Results;