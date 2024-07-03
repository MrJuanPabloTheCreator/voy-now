import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST credentials threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const email = await req.json();
        const [getUserByEmail] = await connection.execute(`SELECT * FROM users WHERE email = '${email}'`);

        if (getUserByEmail.length === 0) {
            throw new Error(JSON.stringify({ success: false, error: 'User not found', status: 404 }))
        }
        
        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, existingUser: getUserByEmail[0] }));

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: error.status | 500 });
        
    } finally {
        console.log('RELEASING connection in POST credentials threadId:', connection.threadId);
        connection.release();
    }
}

