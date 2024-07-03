import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET chats/id threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const [chatUsersResult] = await connection.execute(
            `SELECT 
                u.user_id, 
                u.name, 
                u.image
            FROM 
                users u
            JOIN 
                chats c ON (u.user_id = c.user1_id OR u.user_id = c.user2_id)
            WHERE 
                c.chat_id = ?;
            `, 
            [params.id]
        )
         
        const [chatMessagesResult] = await connection.execute(
            `SELECT 
                m.id, 
                m.sender_id, 
                m.message, 
                m.created_at
            FROM 
                messages m
            WHERE 
                m.chat_id = ?
            ORDER BY 
                m.created_at ASC;`,
            [params.id]
        )

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, chatUsers: chatUsersResult, chatMessages: chatMessagesResult}), { status: 200 });
    
    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });
        
    } finally {
        console.log('RELEASING connection in GET chats/id threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in POST chats threadId:', connection.threadId);

    try {
        await connection.beginTransaction();
        
        const chat_id = params.id;
        const { sender_id, message, created_at }: { sender_id: string; message: string; created_at: string;} = await req.json();
        // console.log('api: ',chat_id, sender_id, message, created_at)
        const [newMessageQuery] = await connection.execute(
            'INSERT INTO messages (chat_id, sender_id, message, created_at) VALUES (?, ?, ?, ?);',
            [chat_id, sender_id, message, created_at]
        );

        if(newMessageQuery.affectedRows > 0){      
            connection.commit();  
            return new NextResponse(JSON.stringify({ success: true, insertId: newMessageQuery.insertId}), { status: 200 });
        } else {
            throw new Error('Error inserting message')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST chats threadId:', connection.threadId);
        connection.release();
    }
}