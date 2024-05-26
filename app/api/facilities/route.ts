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
        const { facility, image_url, fields }: { facility: Facility; image_url: string; fields: Field[] } = formData;
        const [newFacilityQuery] = await db.query(`
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

        const { affectedRows, insertId} = newFacilityQuery;
        console.log('Inserted Id:', insertId, 'Affected Rows:', affectedRows)

        if (affectedRows > 0) {
            const values = fields.map(field => `(${insertId}, ${field.field_number}, '${field.size}', '${field.field_type}')`).join(", ");

            const insertFieldsQuery = `
                INSERT INTO fields (facility_id, field_number, size, field_type) 
                VALUES ${values};
            `;
            const [newFieldsQuery] = await db.query(insertFieldsQuery);

            console.log(newFieldsQuery)

            await connection.commit();
            
            console.log("Transaction completed successfully");
            return new NextResponse(JSON.stringify(newFacilityQuery, newFieldsQuery));
        } else {
            throw new Error('Failed to insert the facility.');
        }
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
    } finally {
        connection.release();
    }
}