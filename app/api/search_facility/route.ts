import { NextResponse } from "next/server";
const db = require('@/db')

export async function GET (req: Request) {
    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const field_size = searchParams.get('field_size');
    const grass_type = searchParams.get('grass_type');

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // console.log("Here Get", lat, lng)
        let query = `
            SELECT 
                f.facility_id, 
                f.facility_name, 
                f.facility_description, 
                f.facility_image_url, 
                f.city, 
                f.region, 
                f.address, 
                f.postal_code
        `;
        
        const queryParams = [];
        let hasLocation = false;
        
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lng)) {
                return NextResponse.json({ message: 'Invalid latitude or longitude' }, { status: 400 });
            }

            query += `, ST_Distance_Sphere(f.geom, ST_GeomFromText(CONCAT('POINT(', ${lat}, ' ', ${lng}, ')'), 4326)) AS distance`;
            queryParams.push(lat, lng);
            hasLocation = true;
        } else {
            query += `, 0 AS distance`;
        }

        query += ` FROM facilities f`;

        const whereClauses = [];
        
        if (field_size || grass_type) {
            query += ` JOIN fields fi ON f.facility_id = fi.facility_id`;

            const whereClauses = [];

            if (field_size) {
                whereClauses.push(`fi.size = '${field_size}'`);
                queryParams.push(field_size);
            }       
            if (grass_type) {
                whereClauses.push(`fi.field_type = '${grass_type}'`);
                queryParams.push(grass_type);
            }
            if (whereClauses.length > 0) {
                query += ` WHERE ` + whereClauses.join(' AND ');
            }
        }

        query += `
            GROUP BY 
                f.facility_id, 
                f.facility_name, 
                f.facility_description, 
                f.facility_image_url, 
                f.city, 
                f.region, 
                f.address, 
                f.postal_code
        `;

        if (hasLocation) {
            query += ` ORDER BY distance`;
        }

        query += ` LIMIT 20`;

        console.log(query)
        const [facilitySearchResult] = await db.query(query)
        await connection.commit();

        console.log("\api\closest_facility\[id]\route.ts - Transaction completed successfully 123");
        return NextResponse.json(facilitySearchResult);
    } catch (error) {
        await connection.rollback();
        console.error("\api\closest_facility\[id]\route.ts - Transaction failed:", error);
    } finally {
        connection.release();
    }
}