'use server';

import db from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import { board } from "@/app/lib/schema";
import auth from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function SaveBoardContent(boardId: string, content: string) {
    try {
        // Get the current session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get the board to check permissions
        const boardData = await db
            .select()
            .from(board)
            .where(eq(board.boardId, boardId))
            .limit(1);

        if (boardData.length === 0) {
            return { success: false, error: 'Board not found' };
        }

        const currentBoard = boardData[0];

        // Check if user is the author or in the editors array
        const isAuthor = currentBoard.authorID === session.user.id;
        const isEditor = (currentBoard.editors || []).includes(session.user.id);

        if (!isAuthor && !isEditor) {
            return { success: false, error: 'You do not have permission to edit this board' };
        }

        // Update the board data
        await db
            .update(board)
            .set({ data: content })
            .where(eq(board.boardId, boardId));

        return { success: true, message: 'Board saved successfully' };
    } catch (error) {
        console.error('Error saving board:', error);
        return { success: false, error: 'Failed to save board content' };
    }
}
