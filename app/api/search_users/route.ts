import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

export async function GET (req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET search_users threadId:', connection.threadId);

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('key');

    try {
        await connection.beginTransaction();

        const [usersResult] = await connection.execute(`SELECT user_id, name, image FROM users
        WHERE name LIKE CONCAT('%', '${keyword}', '%');`)
        
        await connection.commit();
        console.log(usersResult)
        console.log("Transaction completed successfully");
        return new NextResponse(JSON.stringify(usersResult));
        
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);

    } finally {
        console.log('RELEASING connection in GET search_users threadId:', connection.threadId);
        connection.release();
    }
}