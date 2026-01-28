'use server';

import auth from "@/app/lib/auth";

export default async function SignUp(name: string, email: string, password: string, username: string, displayUser?: string, image?: File) {
    return auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            image: image ? URL.createObjectURL(image) : undefined,
            rememberMe: true,
            username,
            displayUsername: displayUser,
            callbackURL: "/"
        }
    })
}