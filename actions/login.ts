"use server"

import { signIn } from "@/auth";

interface LoginProps {
    email: string;
    password: string;
}

export const login = async (userForm: LoginProps) => {
    await signIn("credentials", {
        email: userForm.email,
        password: userForm.password,
        redirect: true,
    });
}