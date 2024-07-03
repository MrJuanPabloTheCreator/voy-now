import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Facility {
    name: string;
    description: string;
    city: string;
    region: string;
    address: string;
    postalCode: number;
    latitude: number;
    longitude: number;
}

interface Field {
    field_number: number;
    size: string;
    field_type: string;
}

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET facilities threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const [facilitiesResult] = await connection.execute(`SELECT * from facilities`)

        await connection.commit();
        return new NextResponse(JSON.stringify(facilitiesResult));

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({error: error.message}), { status: 500 })

    } finally {
        console.log('RELEASING connection in GET facilities threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST facilities threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const formData = await req.json();
        const { facility, image_url, fields }: { facility: Facility; image_url: string; fields: Field[] } = formData;
        const [newFacilityQuery] = await connection.execute(`
            INSERT INTO facilities (facility_name, facility_description, facility_image_url, city, region, address, postal_code, geom) 
            VALUES (
                '${facility.name}', 
                '${facility.description}', 
                '${image_url}', '${facility.city}', 
                '${facility.region}', '${facility.address}', 
                '${facility.postalCode}', 
                ST_GeomFromText(CONCAT('POINT(', ${facility.latitude}, ' ', ${facility.longitude}, ')'), 4326)
            );
        `);

        if (newFacilityQuery.affectedRows > 0) {
            const values = fields.map(field => `(${newFacilityQuery.insertId}, ${field.field_number}, '${field.size}', '${field.field_type}')`).join(", ");

            const insertFieldsQuery = `
                INSERT INTO fields (facility_id, field_number, size, field_type) 
                VALUES ${values};
            `;
            const [newFieldsQuery] = await connection.execute(insertFieldsQuery);

            await connection.commit();
            return new NextResponse(JSON.stringify(newFacilityQuery, newFieldsQuery));

        } else {
            throw new Error('Failed to insert the facility.');
        }
        
    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }),{ status: 500 })

    } finally {
        console.log('RELEASING connection in POST facilities threadId:', connection.threadId);
        connection.release();
    }
}