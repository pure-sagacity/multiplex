'use server';

import auth from "@/app/lib/auth";
import { uploadProfilePicture } from "../images/Upload";

export default async function SignUp(name: string, email: string, password: string, username: string, displayUser?: string, image?: File) {
    let imageUrl: string | undefined = undefined;
    if (image) {
        const upload = await uploadProfilePicture(image);
        imageUrl = upload?.publicUrl;
    }

    return auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            image: imageUrl,
            rememberMe: true,
            username,
            displayUsername: displayUser,
        }
    })
}