import db from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import { board } from "@/app/lib/schema";

interface Board {
    boardId: string;
    authorID: string;
    title: string;
    isPublic: boolean;
    createdAt: Date;
    editors: string[];
    data: string;
}

export default async function GetBoard(boardId: string): Promise<Board | null> {
    const boardData = await db
        .select()
        .from(board)
        .where(
            eq(board.boardId, boardId)
        )
        .limit(1);

    if (boardData.length === 0) {
        return null;
    }

    return boardData[0];
};