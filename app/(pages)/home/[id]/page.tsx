"use client"

import { useSearchParams } from "next/navigation";

const FacilityPage = () => {
    const searchParams = useSearchParams()
    const facility_id = searchParams.get("facility_id");

    return(
        <div>
            {facility_id}
        </div>
    )
}

export default FacilityPage;