import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

export async function GET(req: NextRequest, { params }: { params: { facility_id: string } }) {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  const { facility_id } = params;

  if (!facility_id) {
    return new NextResponse(JSON.stringify({ error: "Facility ID is required" }), { status: 400 });
  }

  try {
    const [facilityDbResult] = await connection.query(`SELECT * from facilities WHERE facility_id = ${facility_id}`);

    await connection.commit();
    console.log("Transaction completed successfully");

    return new NextResponse(JSON.stringify(facilityDbResult));
  } catch (error) {
    await connection.rollback();
    console.error("Transaction failed:", error);

    return new NextResponse(JSON.stringify({ error: "Failed to fetch facility" }), { status: 500 });
  } finally {
    connection.release();
  }
}
