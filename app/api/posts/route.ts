import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET posts threadId:', connection.threadId);

    try {
        await connection.beginTransaction();
        const [usersPosts] = await connection.execute(`SELECT 
                posts.id,
                posts.user_id,
                users.name AS user_name,
                users.image AS user_image,
                posts.description,
                posts.media_url,
                posts.created_at AS post_created_at
            FROM 
                posts
            JOIN 
                users ON posts.user_id = users.user_id;`
        )

        if(usersPosts.length > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({success: true, posts: usersPosts}));
        } else {
            throw new Error('No post found')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({success: false, error: error.message}));

    } finally {
        console.log('RELEASING connection in GET posts threadId:', connection.threadId);
        // const [processList] = await connection.execute('SHOW PROCESSLIST');
        // console.log('Current MySQL Process List:', processList);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST posts threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const formData = await req.json();
        const {user_id, description, media_url} = formData;

        const [newPostQuery] = await connection.execute('INSERT INTO posts (user_id, description, media_url) VALUES ( ?, ?, ? )',
            [user_id, description, media_url]
        );

        if(newPostQuery.affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 201 })
        } else {
            throw new Error('Error inserting posts')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST posts threadId:', connection.threadId);
        connection.release();
    }
}