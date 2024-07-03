import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        match_id: string;
        user_id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET matches/id/userid threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const { match_id, user_id } = params;
        const [matchInfoQuery] = await connection.execute(`
            SELECT 
                m.match_id,
                m.date,
                m.location_id,
                m.match_info,
                m.private,
                m.size,
                m.created_at AS match_created_at,
                m.updated_at AS match_updated_at,
                m.team1_color,
                m.team2_color
            FROM 
                matches m
            WHERE 
                m.match_id = ?;
            `, [match_id]
        );

        const [usersMatchQuery] = await connection.execute(`
            SELECT 
                u.user_id,
                u.name,
                u.email,
                u.image,
                um.role,
                um.team,
                um.created_at AS user_match_created_at,
                um.updated_at AS user_match_updated_at
            FROM 
                user_matches um
            JOIN 
                users u ON um.user_id = u.user_id
            WHERE 
                um.match_id = ?
            `, [match_id]
        );

        if(matchInfoQuery.length > 0 && usersMatchQuery){
            await connection.commit();
            return new NextResponse(JSON.stringify({success: true, matchInfo: matchInfoQuery[0], usersInfo: usersMatchQuery}), { status: 200 });
        }
        throw new Error('User not found')

    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in GET matches/id/userid threadId:', connection.threadId);
        connection.release();
    }
}