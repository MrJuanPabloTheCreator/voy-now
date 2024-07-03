import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

interface User {
    user_id: string;
    name: string;
    image: string;
    role: string;
}

interface Team {
    name: string;
    selectedPlayers: User[]
    imageURL: string | null;
}

export async function GET(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in GET teams threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const [teamsResult] = await connection.execute(`SELECT * from teams;`)

        await connection.commit();
        return new NextResponse(JSON.stringify(teamsResult));

    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);

    } finally {
        console.log('RELEASING connection in GET teams threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST teams threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const formData = await req.json();
        const { newTeam, teamLogoUrl, }: { newTeam: Team; teamLogoUrl: string | null} = formData;

        const [newTeamQuery] = await connection.execute(
            `INSERT INTO teams (name, logo_url) VALUES (?, ?);`,
            [newTeam.name, teamLogoUrl]
        );

        const { affectedRows} = newTeamQuery;

        // Add Team Invitation Notifications!!!!!
        if (affectedRows > 0) {
            const usersTeamValues: [string, string, string, string | null][] = [];
            const usersNotificationValues: [string, string, string, string, string][] = [];
            
            newTeam.selectedPlayers.forEach((user: User, index) => {
                if(index === 0){
                    usersTeamValues.push([user.user_id, newTeam.name, user.role, 'confirmed'])
                } else {
                    usersTeamValues.push([user.user_id, newTeam.name, user.role, null])
                    // Creator shouldnt recieve the notification
                    // usersNotificationValues.push([user.user_id, newTeam.selectedPlayers[0].user_id, 'team_invitation', 'has invited you to join', newTeam.name])
                }
                usersNotificationValues.push([user.user_id, newTeam.selectedPlayers[0].user_id, 'team_invitation', 'has invited you to join', newTeam.name])
            })

            const insertUserTeamRelation = 'INSERT INTO user_teams (user_id, team_name, role, status) VALUES ?';
            const [newUserTeamRelation] = await connection.execute(insertUserTeamRelation, [usersTeamValues]);

            if(newUserTeamRelation.affectedRows > 0){

                const insertUserNotificationRelation = 'INSERT INTO notifications (user_id, sender_id, type, message, team_name) VALUES ?';
                const [newUserNotifcationRelation] = await connection.execute(insertUserNotificationRelation, [usersNotificationValues]);

                if(newUserNotifcationRelation.affectedRows > 0){
                    await connection.commit();
                    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
                } else {
                    throw new Error('Failed to insert into notifications')
                }
            } else {
                throw new Error('Failed to insert user team relationship')
            }
        } else {
            throw new Error('Failed to insert into teams.');
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST teams threadId:', connection.threadId);
        connection.release();
    }
}