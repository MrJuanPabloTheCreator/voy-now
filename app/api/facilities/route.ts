import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [facilitiesResult] = await db.query(`SELECT * from facilities`)

        await connection.commit();

        console.log("Transaction completed successfully");
        return new NextResponse(JSON.stringify(facilitiesResult));
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
    } finally {
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const formData = await req.json();
        const { facility, image_url } = formData;
        const [newFacilityQuery] = await db.query(`INSERT INTO facilities (facility_name, facility_description, facility_image_url)
        VALUES ('${facility.name}', '${facility.description}', '${image_url}');`);

        await connection.commit();

        console.log("Transaction completed successfully");
        return new NextResponse(JSON.stringify(newFacilityQuery));
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
    } finally {
        connection.release();
    }
}