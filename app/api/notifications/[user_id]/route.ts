// pages/api/notifications/[user_id].js
import { NextRequest, NextResponse } from 'next/server';
const db = require('@/db');

interface Params {
    params: {
        user_id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET notifications threadId:', connection.threadId);

    try {
        const { user_id } = params;
        const [notifications] = await connection.execute(`
            SELECT n.id, n.sender_id, n.type, n.message, n.status, n.created_at, n.match_id, n.team_name,
                u.name AS sender_name, u.image AS sender_image 
            FROM 
                notifications n
            LEFT JOIN 
                users u 
            ON 
                n.sender_id = u.user_id 
            WHERE 
                n.user_id = ? 
            ORDER BY 
                n.created_at DESC
        `, [user_id]);
        
        if(notifications){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true, notifications }), { status: 200 });
        } else {
            throw new Error('No notifications')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in GET notifications threadId:', connection.threadId);
        connection.release();
    }
}

export async function DELETE(req: NextRequest, { params }: Params, res: NextResponse) {
    const { user_id } = params;

    const connection = await db.getConnection();
    console.log('USING connection in DELETE notifications threadId:', connection.threadId);

    try {
        const [deleteNotifications] = await connection.execute('DELETE FROM notifications WHERE user_id = ?', [user_id]);
        
        if(deleteNotifications.affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        }
        throw new Error('No notifications')

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in DELETE notifications threadId:', connection.threadId);
        connection.release();
    }
}
