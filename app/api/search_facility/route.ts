import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

export async function GET (req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET search_facility threadId:', connection.threadId);

    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const field_size = searchParams.get('field_size');
    const grass_type = searchParams.get('grass_type');
    const ratio = searchParams.get('grass_type');

    try {
        await connection.beginTransaction();

        let query = `
            SELECT 
                f.facility_id, 
                f.facility_name, 
                f.facility_description, 
                f.facility_image_url, 
                f.city, 
                f.region, 
                f.address, 
                f.postal_code,
                f.geom
        `;
        
        const queryParams = [];
        let hasLocation = false;
        
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Invalid latitude and longitude')
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
                f.postal_code,
                f.geom
        `;

        if (hasLocation) {
            query += ` ORDER BY distance`;
        }

        query += ` LIMIT 20`;
        const [facilitySearchResult] = await connection.execute(query)

        await connection.commit();
        return NextResponse.json(facilitySearchResult);

    } catch (error) {
        await connection.rollback();

    } finally {
        console.log('RELEASING connection in GET search_facility threadId:', connection.threadId);
        connection.release();
    }
}