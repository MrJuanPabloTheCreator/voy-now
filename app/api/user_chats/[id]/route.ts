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

        const [user1to1ChatsResult] = await connection.execute(
            `SELECT c.chat_id, 
                c.last_interacted,
                u.user_id,
                u.name,
                u.image
            FROM chats c
            JOIN users u ON (u.user_id = c.user1_id OR u.user_id = c.user2_id)
            WHERE (c.user1_id = ? OR c.user2_id = ?)
            AND u.user_id <> ?
            ORDER BY c.last_interacted DESC`, 
            [params.id, params.id, params.id]
        )
         
        const [userGroupChatsResult] = await connection.execute(
            `SELECT gc.group_chat_id, gc.name, gc.last_interacted
            FROM group_chats gc 
            JOIN group_chat_members gcm ON gc.group_chat_id = gcm.group_chat_id 
            WHERE gcm.user_id = ?
            ORDER BY gc.last_interacted DESC`,
            [params.id]
        )

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, userChats: user1to1ChatsResult, groupChats: userGroupChatsResult}), { status: 200 });
    
    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });
        
    } finally {
        console.log('RELEASING connection in GET chats/id threadId:', connection.threadId);
        connection.release();
    }
}