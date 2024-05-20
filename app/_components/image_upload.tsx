"use client"

import { useState } from "react";
import { GrAttachment } from "react-icons/gr";

import { getSignedURL } from "@/server/actions";

interface Facility {
    name: string;
    description: string;
}

export default function ImageUpload(){
    const [facility, setFacility] = useState<Facility>({
        name: '',
        description: '',
    })

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
                console.log("Running...", name)

                console.log('URL from actions:', url)
        
                const s3ImageUpload = await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                })

                console.log(s3ImageUpload)

                console.log("facility state:", facility, "Image URL:", image_url)
                const facilitiesPostRequest = await fetch('/api/facilities', {
                    method: 'POST',
                    body: JSON.stringify({facility, image_url})
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

    return (
        <div className="flex flex-col">
            <form className="flex flex-col items-center space-y-2 p-4 bg-white/40 rounded-lg" onSubmit={handleSubmit}>
                <label className='flex space-x-2 w-full'>
                    <h3>Name:</h3>
                    <input 
                        type="text" 
                        value={facility.name} 
                        onChange={e => setFacility({...facility, name: e.target.value})}
                        className='rounded-lg w-1/2'
                    />
                </label>
                <label className='flex space-x-2 w-full'>
                    <h3>Description:</h3>
                    <input 
                        type="text" 
                        value={facility.description} 
                        onChange={e => setFacility({...facility, description: e.target.value})} 
                        className='rounded-lg w-1/2'
                    />
                </label>
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