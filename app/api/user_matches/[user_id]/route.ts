import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        user_id: string;
    };
}

interface Match {
    match_id: string;
    date: string;
    location_id: string;
    match_info: string;
    private: boolean;
    size: string;
    created_at: string;
    updated_at: string;
    team1_color: string | null;
    team2_color: string | null;
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET user_mathes threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const { user_id } = params;
        const [matchesQuery] = await connection.execute(
            `SELECT 
                m.match_id,
                m.date,
                m.location_id,
                m.match_info,
                m.private,
                m.size,
                m.created_at,
                m.updated_at,
                m.team1_color,
                m.team2_color
            FROM 
                matches m
            JOIN 
                user_matches um ON m.match_id = um.match_id
            WHERE 
                um.user_id = ?
            ORDER BY 
                m.date ASC`
            ,[user_id]
        );

            // WHERE 
            //         um.user_id = ?
            //         AND m.date > NOW()
    
        if (matchesQuery.length > 0) {
    
            const matchIds = matchesQuery.map((match: Match) => match.match_id);

            const placeholders = matchIds.map(() => '?').join(',');

            const [usersQuery] = await connection.execute(
                `SELECT 
                    um.match_id,
                    u.user_id,
                    u.name,
                    u.image,
                    um.role,
                    um.team
                FROM 
                    user_matches um
                JOIN 
                    users u ON um.user_id = u.user_id
                WHERE 
                    um.match_id IN (${placeholders})
                ORDER BY 
                    um.match_id, um.team, u.name`,
                matchIds
            );

            await connection.commit();
            return new NextResponse(JSON.stringify({success: true, matchesInfo: matchesQuery, matchesUsers: usersQuery}), { status: 200 });
        } else {
            await connection.commit();
            return new NextResponse(JSON.stringify({success: true, matchesInfo: [], matchesUsers: []}), { status: 200 });
        }

    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in GET user_matches threadId:', connection.threadId);
        connection.release();
    }
}