import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
const db = require('@/db')

interface User {
    user_id: string; 
    name: string, 
    image: string, 
    role: string
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST matches threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const match_id = uuidv4();
        const matchFormData = await req.json();
        const { start_date, location, size, team_1, team_2, privateMatch, text } = matchFormData;

        const [newMatchQuery] = await connection.execute(
            'INSERT INTO matches (match_id, date, location_id, match_info, private, size, team1_color, team2_color) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )',
            [match_id, start_date, location.place_id, text, privateMatch, size, team_1.color, team_2.color]
        );


        if(newMatchQuery.affectedRows > 0){
            const userMatchesValues: [string, string, number,  string][] = [];
            const userNotificationsValues: [string, string, string, string, string][] = []


            team_1.invited_users.forEach((user: User) => {
                userMatchesValues.push([user.user_id, match_id, 1, user.role || 'player']);
                userNotificationsValues.push([user.user_id, team_1.invited_users[0].user_id, 'match_invitation', 'has invited you to a match.', match_id]);
            });

            team_2.invited_users.forEach((user: User) => {
                userMatchesValues.push([user.user_id, match_id, 2, user.role || 'player']);
                userNotificationsValues.push([user.user_id, team_1.invited_users[0].user_id, 'match_invitation', 'has invited you to a match.', match_id]);
            });
            
            const userMatchesQuery = ('INSERT INTO user_matches (user_id, match_id, team, role) VALUES ?');
            const [usersMatchQuery] = await connection.query(userMatchesQuery, [userMatchesValues]);
            if(usersMatchQuery.affectedRows > 0){
                const notificationsQuery = ('INSERT INTO notifications (user_id, sender_id, type, message, match_id) VALUES ?');
                const [usersNotificationsQuery] = await connection.query(notificationsQuery, [userNotificationsValues])
                if(usersNotificationsQuery.affectedRows > 0){
                    await connection.commit();
                    return new NextResponse(JSON.stringify({ success: true }), { status: 201 })
                }
                throw new Error('Notifications Error')
            }
            throw new Error('Users Matches Error')
        }
        throw new Error('Match Error');

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    } finally {
        console.log('RELEASING connection in POST matches threadId:', connection.threadId);
        connection.release();
    }
}