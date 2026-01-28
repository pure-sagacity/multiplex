import db from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import { user } from "@/app/lib/schema";

interface User {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string | null,
    createdAt: Date,
    updatedAt: Date,
    role: string | null,
    banned: boolean | null,
    banReason: string | null,
    banExpires: Date | null,
    username: string | null,
    displayUsername: string | null,
}

export default async function GetUser(userId: string, type: "id" | "username" = "username"): Promise<User | null> {
    const userData = await db
        .select()
        .from(user)
        .where(type === "id" ? eq(user.id, userId) : eq(user.username, userId))
        .limit(1);

    console.log(await db.select().from(user));
    console.log("Fetched user data:", userData);

    if (userData.length === 0) {
        return null;
    }

    return userData[0];
}