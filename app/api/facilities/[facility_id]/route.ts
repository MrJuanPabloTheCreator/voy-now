import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

export async function GET(req: NextRequest, { params }: { params: { facility_id: string } }) {
  const connection = await db.getConnection();
  console.log('USING connection in GET facilities/id threadId:', connection.threadId);

  const { facility_id } = params;

  try {
    if (!facility_id) {
      throw new Error('Facility id required')
    }
    
    await connection.beginTransaction();

    const [facilityDbResult] = await connection.execute(`SELECT * from facilities WHERE facility_id = ${facility_id}`);

    await connection.commit();
    return new NextResponse(JSON.stringify(facilityDbResult));

  } catch (error) {
    await connection.rollback();
    return new NextResponse(JSON.stringify({ error: "Failed to fetch facility" }), { status: 500 });

  } finally {
    console.log('RELEASING connection in GET facilities/id threadId:', connection.threadId);
    connection.release();
  }
}
