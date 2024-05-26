"use client"

import { useEffect, useState } from "react";
import { GrAttachment } from "react-icons/gr";

import { getSignedURL } from "@/server/actions";
import FieldsDetails from "./fields_details";

interface Facility {
    name: string;
    description: string;
    city: string;
    region: string;
    address: string;
    postal_code?: number;
    longitude?: number;
    latitude?: number;
}

interface Field {
    field_number: number;
    size: string;
    field_type: string;
}

export default function FacilityForm(){
    const [facility, setFacility] = useState<Facility>({
        name: '',
        description: '',
        city: '',
        region: '',
        address: '',
        postal_code: undefined,
        longitude: undefined,
        latitude: undefined
    })
    const [numberOfFields, setNumberOfFields] = useState<number>(0);
    const [fields, setFields] = useState<Field[]>([]);

    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string>()

    const computeSHA256 = async (file: File) => {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
        return hashHex
    }
    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFile(file)

        if(fileUrl){
            URL.revokeObjectURL(fileUrl)
        }

        if(file) {
            const url = URL.createObjectURL(file)
            setFileUrl(url)
        } else {
            setFileUrl(undefined)
        }
    };
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            console.error("No file selected");
            return;
        }
      
        try {
            const checksum = await computeSHA256(file)
            const signedUrlResult = await getSignedURL(file.type, file.size, checksum)
            console.log("Signed URL result:", signedUrlResult);
            if (signedUrlResult.succes) {
                const url = signedUrlResult.succes.url
                const name = signedUrlResult.succes.name
                const image_url = `https://voy-now-bucket.s3.amazonaws.com/${name}`
                
                // S3 Bucket Image Upload
                const s3ImageUpload = await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                })
                console.log(s3ImageUpload)

                //Form Submission
                const facilitiesPostRequest = await fetch('/api/facilities', {
                    method: 'POST',
                    body: JSON.stringify({facility, image_url, fields})
                })
                const requestResponse = await facilitiesPostRequest.json();
                console.log(requestResponse)
        
            } else {
                throw new Error(signedUrlResult.failure)
            }
        } catch {
            console.log("Not running")
        } finally {
            // setLoading(false)
        }
    };

    useEffect(() => {
      console.log('State of fields:', fields)
    }, [fields])
    

    return (
        <div className="flex items-center justify-center p-10 bg-white shadow-lg rounded-lg w-2/5 mb-10">
            <form className="flex flex-col items-center space-y-5 font-semibold w-full" onSubmit={handleSubmit}>
                <label className='flex flex-col w-full'>
                    <h3>Facility Name</h3>
                    <input 
                        type="text" 
                        value={facility.name} 
                        onChange={e => setFacility({...facility, name: e.target.value})}
                        className='rounded-md w-full border-2'
                    />
                </label>
                <label className='flex flex-col w-full'>
                    <h3>Description</h3>
                    <input 
                        type="text" 
                        value={facility.description} 
                        onChange={e => setFacility({...facility, description: e.target.value})} 
                        className='rounded-md w-full border-2'
                    />
                </label>
                <label className='flex flex-col w-full'>
                    <h3>Address</h3>
                    <input 
                        type="text" 
                        value={facility.address} 
                        onChange={e => setFacility({...facility, address: e.target.value})} 
                        className='rounded-md w-full border-2'
                    />
                </label>
                <div className="flex w-full space-x-2">
                    <label className='flex flex-col w-[50%]'>
                        <h3>City</h3>
                        <input 
                            type="text" 
                            value={facility.city} 
                            onChange={e => setFacility({...facility, city: e.target.value})} 
                            className='rounded-md w-full border-2'
                        />
                    </label>
                    <label className='flex flex-col w-[20%]'>
                        <h3>Region</h3>
                        <input 
                            type="text" 
                            value={facility.region} 
                            onChange={e => setFacility({...facility, region: e.target.value})} 
                            className='rounded-md w-full border-2'
                        />
                    </label>
                    <label className='flex flex-col w-[30%]'>
                        <h3>Zipode</h3>
                        <input 
                            type="number" 
                            value={facility.postal_code} 
                            onChange={e => setFacility({...facility, postal_code: Number(e.target.value)})} 
                            className='rounded-md w-full border-2'
                        />
                    </label>
                </div>
                <div className="flex w-full space-x-2">
                    <label className='flex flex-col w-[50%]'>
                        <h3>Longitude</h3>
                        <input 
                            type="number" 
                            value={facility.longitude} 
                            onChange={e => setFacility({...facility, longitude: Number(e.target.value)})} 
                            className='rounded-md w-full border-2'
                        />
                    </label>
                    <label className='flex flex-col w-[50%]'>
                        <h3>Latitude</h3>
                        <input 
                            type="number" 
                            value={facility.latitude} 
                            onChange={e => setFacility({...facility, latitude: Number(e.target.value)})} 
                            className='rounded-md w-full border-2'
                        />
                    </label>
                </div>
                <label className='flex flex-col w-full'>
                    <h3>Number of Fields:</h3>
                    <input 
                        type="number" 
                        value={numberOfFields || ''} 
                        onChange={e => setNumberOfFields(Number(e.target.value))} 
                        className='rounded-md w-[50%] border-2'
                        min={1}
                        max={100}
                    />
                </label>
                {numberOfFields > 0 && 
                    <FieldsDetails number_of_fields={numberOfFields} setFields={setFields}/>
                }
                <label className="flex space-x-2 w-full">
                    <p>Attach Images</p>
                    <GrAttachment
                        className="w-5 h-5 hover:cursor-pointer transform-gpu active:scale-75 transition-all text-neutral-500"
                        title="Attach media"
                    />
                    <input
                        className="bg-transparent flex-1 border-none outline-none hidden"
                        name="media"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                        onChange={handleFileChange}
                    />
                </label>
                {fileUrl && file && (
                    <div className="flex justify-center">
                        <img
                            className="h-2/3 w-2/3 rounded-lg"
                            src={fileUrl}
                            alt={file.name}
                        />
                    </div>
                )}
                <button type="submit" className="bg-green-400 text-white font-semibold py-1 px-5 rounded-lg">
                    Submit
                </button>
            </form>
        </div>
    )
}