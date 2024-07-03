"use server"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import crypto from "crypto"

const s3 = new S3Client({
    region: process.env.BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    },
})

const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm"
]

const maxFileSize = 1024 * 1024 * 10

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

export async function getSignedURL(type: string, size: number, checksum: string){
    if(!acceptedTypes.includes(type)){
        return {failure: "Invalid file type"}
    }

    if(size > maxFileSize){
        return {failure: "File too large"}
    }

    const fileName = generateFileName();
    console.log("Actions Running ->", fileName)

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: fileName,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        // Metadata: {
        //     userId: sessionStorage.user.id
        // }
    })

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60,
    })
    
    return {succes: {url: signedURL, name: fileName}}
}