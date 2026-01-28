'use server';

import auth from "@/app/lib/auth"

export default async function Login(email: string, password: string) {
    return auth.api.signInEmail({
        body: {
            email,
            password
        }
    })
}