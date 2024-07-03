import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET myteams threadId:', connection.threadId);
    
    try {
        await connection.beginTransaction();

        const userId = params.id;
        const [userTeamsQuery] = await connection.execute(`
            SELECT 
                t.name,
                t.logo_url
            FROM 
                teams t
            JOIN 
                user_teams ut ON t.name = ut.team_name
            WHERE 
                ut.user_id = ? ;`, 
            [userId]
        );

        const [userMatchesQuery] = await connection.execute(`
            SELECT 
                m.match_id,
                m.date,
                m.location_id
            FROM 
                matches m
            JOIN 
                user_matches um ON m.match_id = um.match_id
            WHERE 
                um.user_id = ?;`, 
            [userId]
        );

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, teams: userTeamsQuery, matches: userMatchesQuery}), { status: 200 });
    
    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });
    
    } finally {
        console.log('RELEASING connection in GET myteams threadId:', connection.threadId);
        connection.release();
    }
}