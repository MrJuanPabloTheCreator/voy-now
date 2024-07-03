import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        id_1: string;
        id_2: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET users/id/id threadId:', connection.threadId);

    const { id_1, id_2 } = params;

    try {
        await connection.beginTransaction();

        const [userInfo] = await connection.execute('SELECT user_id, name, email, image, created_at FROM users WHERE user_id = ?', [id_1])

        const [user_id_1, user_id_2] = [id_1, id_2].sort();
        const [relationship] = await connection.execute(`
            SELECT 
                status
            FROM 
                friendships
            WHERE 
                user_id_1 = ? AND user_id_2 = ? ;
        `, [user_id_1, user_id_2]);

        const [userFriends] = await connection.execute(`
            SELECT u.user_id, u.name, u.image
            FROM users u
            JOIN friendships f ON (u.user_id = f.user_id_1 OR u.user_id = f.user_id_2)
            WHERE (f.user_id_1 = ? OR f.user_id_2 = ?)
              AND u.user_id != ?
              AND f.status = 'accepted'
        `, [id_1, id_1, id_1]);

        const [userPosts] = await connection.execute(`
            SELECT 
                posts.id,
                posts.description,
                posts.media_url,
                posts.created_at
            FROM 
                posts
            JOIN 
                users ON posts.user_id = users.user_id
            WHERE users.user_id = ?;`
        ,[id_1])

        if(userInfo.length > 0){
            const user_data = {
                ...userInfo[0],
                friendship_status: relationship.length > 0 ? relationship[0].status : null,
                friends: userFriends,
                posts: userPosts
            }

            await connection.commit();
            return new NextResponse(JSON.stringify({success: true, userData: user_data}), { status: 200 });
        } else {
            await connection.rollback();
            return NextResponse.json({ success: false, error: 'No User Found' }, { status: 404 });
        }

    } catch (error) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });

    } finally {
        console.log('RELEASING connection in GET users/id/id threadId:', connection.threadId);
        connection.release();
    }
}