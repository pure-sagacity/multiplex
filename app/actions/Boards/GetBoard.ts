import db from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import { board } from "@/app/lib/schema";

export default async function GetBoard(boardId: string) {
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