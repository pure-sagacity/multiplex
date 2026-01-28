"use server";
import db from "@/app/lib/drizzle";
import { board } from "@/app/lib/schema";
import { getSession } from "@/app/actions/auth/GetSession";

export default async function CreateBoard(formData: FormData) {
    const title = formData.get("title") as string;
    const visibility = formData.get("visibility") as "public" | "private";
    const editorsRaw = formData.getAll("editors");
    const editors = Array.isArray(editorsRaw) ? editorsRaw : [];
    const session = await getSession();
    const is_public = visibility === "public";
    if (!session) {
        throw new Error("User must be logged in to create a board.");
    }
    const author_id = session.user.id;
    const newBoard = await db
        .insert(board)
        .values({
            authorID: author_id,
            title,
            isPublic: is_public,
            editors: editors as string[],
            createdAt: new Date(),
            data: JSON.stringify({}),
        })
        .returning();
    return newBoard[0];
}