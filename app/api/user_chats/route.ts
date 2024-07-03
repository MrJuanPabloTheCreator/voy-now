import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET user_chats threadId:', connection.threadId);
    
    try {
        await connection.beginTransaction();
        // const [teamsResult] = await connection.execute(`SELECT * from teams;`)

        await connection.commit();
        return new NextResponse(JSON.stringify(''));
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);

    } finally {
        console.log('RELEASING connection in GET user_chats threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST user_chats threadId:', connection.threadId);

    try {
        await connection.beginTransaction();
        
        const newChatData = await req.json();
        const { user1_id, user2_id }: { user1_id: string; user2_id: string} = newChatData;
        
        const [checkIfExist] = await connection.execute(
            'SELECT * FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?);',
            [user1_id, user2_id, user2_id, user1_id]
        );

        if(checkIfExist.length === 0){
            const [new1to1Query] = await connection.execute(
                `INSERT INTO chats (user1_id, user2_id) VALUES (?, ?);`,
                [user1_id, user2_id]
            );

            if (new1to1Query.affectedRows > 0) {
                await connection.commit();
                return new NextResponse(JSON.stringify({ success: true, chat_id: new1to1Query.insertId}), { status: 200 });
            } else {
                throw new Error('Failed to insert into chats.');
            }
        } else {
            throw new Error('Chat already exists')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST user_chats threadId:', connection.threadId);
        connection.release();
    }
}