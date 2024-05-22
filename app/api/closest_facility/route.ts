import { NextResponse } from "next/server";
const db = require('@/db')

export async function GET (req: Request) {
    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');

    if (!latitude || !longitude) {
        return NextResponse.json({ message: 'Latitude and longitude are required' }, { status: 400 });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json({ message: 'Invalid latitude or longitude' }, { status: 400 });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        console.log("Here Get", lat, lng)
        const closestFacilityResult = await db.query(`
            SELECT 
                facility_id, 
                facility_name, 
                facility_description, 
                facility_image_url, 
                city, 
                region, 
                address, 
                postal_code, 
                ST_Distance_Sphere(geom, ST_GeomFromText(CONCAT('POINT(', ${lat}, ' ', ${lng}, ')'), 4326)) AS distance
            FROM 
                facilities
            ORDER BY 
                distance
            LIMIT 5;
        `);

        await connection.commit();

        console.log("\api\closest_facility\[id]\route.ts - Transaction completed successfully");
        return NextResponse.json(closestFacilityResult);
    } catch (error) {
        await connection.rollback();
        console.error("\api\closest_facility\[id]\route.ts - Transaction failed:", error);
    } finally {
        connection.release();
    }
}