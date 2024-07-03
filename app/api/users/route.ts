import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
var bcrypt = require('bcryptjs');
const db = require('@/db')

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET users threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const [usersResult] = await connection.execute(`SELECT user_id, name from users`)

        await connection.commit();
        return new NextResponse(JSON.stringify(usersResult));

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false,  error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in GET users threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST users threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const formData = await req.json();
        const {name, email, password, provider, image} = formData;

        const userId = uuidv4();
        let query = '';
        let values = [];

        if (provider === 'google') {
            query = `
                INSERT INTO users (user_id, name, email, provider, image) 
                VALUES (?, ?, ?, ?, ?)`;
            values = [userId, name, email, provider, image];
        } else if (provider === 'credentials') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `
                INSERT INTO users (user_id, name, email, password, provider) 
                VALUES (?, ?, ?, ?, ?)`;
            values = [userId, name, email, hashedPassword, provider];
        } else {
            throw new Error('Invalid provider');
        }

        const [newUserQuery] = await connection.execute(query, values);
        const { affectedRows } = newUserQuery;
        if( affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true, userId }), { status: 201 })
        } else {
            throw new Error('Error Creating User');
        }

    } catch (error: any) {
        await connection.rollback();
        if((error as any).code === 'ER_DUP_ENTRY'){
            return new NextResponse(JSON.stringify({ success: false, error: 'Email is already used' }), { status: 400 });
        }
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST users threadId:', connection.threadId);
        connection.release();
    }
}