"use server"

import { signIn } from "@/auth";

export const GoogleLogin = async () => {
    try {
        await signIn("google");
    } catch (error) {  
        throw error;
    }
}