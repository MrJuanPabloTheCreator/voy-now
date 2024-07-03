import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET teams/id threadId:', connection.threadId);
    
    try {
        await connection.beginTransaction();

        const [teamResult] = await connection.execute('SELECT * from teams WHERE name = ?;', [params.id])

        if(teamResult.length > 0){
            const [teamMembersResult] = await connection.execute(`
                SELECT 
                    users.user_id, 
                    users.name, 
                    users.image,
                    user_teams.role 
                FROM 
                    users
                INNER JOIN 
                    user_teams ON users.user_id = user_teams.user_id
                WHERE 
                    user_teams.team_name = ? AND user_teams.status = 'confirmed';`
            ,[params.id])

            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true, teamInfo: teamResult[0], teamMembers: teamMembersResult}), { status: 200 });
        } else {
            throw new Error('No team found')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in GET teams/id threadId:', connection.threadId);
        connection.release();
    }
}