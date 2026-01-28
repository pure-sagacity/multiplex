'use server';

import auth from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function SignOut() {
    return auth.api.signOut({
        headers: await headers()
    });
}