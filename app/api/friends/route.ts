import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET friends threadId:', connection.threadId);
    
    try {
        await connection.beginTransaction();
        const [usersPosts] = await connection.execute(`SELECT * from friends were user session id = friends with;`)

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: false, usersPosts: usersPosts }), { status: 200 });

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });
        
    } finally {
        console.log('RELEASING connection in GET friends threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST friends threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const formData = await req.json();
        const { user_1, user_2 } = formData;

        const [user_id_1, user_id_2] = [user_1, user_2].sort();
        const [friendRequestQuery] = await connection.execute(
            'INSERT INTO friendships (user_id_1, user_id_2) VALUES (?, ?)',
            [user_id_1, user_id_2]
        );

        if (friendRequestQuery.affectedRows) {
            // Create a notification for the user who is receiving the friend request
            const notificationMessage = ` wants to be your friend.`;
            const [notificationQuery] = await connection.execute(
                'INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, ?, ?)',
                [user_2, user_1, 'friend_request', notificationMessage]
            );

            if (notificationQuery.affectedRows) {
                await connection.commit();
        
                return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
            } else {
                await connection.rollback();
                return new NextResponse(JSON.stringify({ success: false, error: 'Failed to create notification' }), { status: 500 });
            }

        } else {
            await connection.rollback();
            return new NextResponse(JSON.stringify({ success: false, error: 'No affected rows' }), { status: 500 });
        }

    } catch (error) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST friends threadId:', connection.threadId);
        connection.release();
    }
}

export async function PATCH(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in PATCH friends threadId:', connection.threadId);

    try {
        const formData = await req.json();
        const { answer, notification_id ,user_1, user_2 } = formData;

        const [user_id_1, user_id_2] = [user_1, user_2].sort();
        const [updateFriendshipQuery] = await connection.execute(
            'UPDATE friendships SET status = ? WHERE user_id_1 = ? AND user_id_2 = ? AND status = ?',
            [answer, user_id_1, user_id_2, 'pending']
        );

        if (updateFriendshipQuery.affectedRows > 0) {

            const [updateNotificationsQuery] = await connection.execute(
                'DELETE FROM notifications WHERE id = ?',
                [notification_id]
            );
            if(updateNotificationsQuery.affectedRows > 0){
                await connection.commit();
                return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
            } else {
                throw new Error('Error updating notifications')
            }
        } else {
            throw new Error('Error updating friendship')
        }
    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in PATCH friends threadId:', connection.threadId);
        connection.release();
    }
}