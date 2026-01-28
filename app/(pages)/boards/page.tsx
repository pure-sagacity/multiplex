import { eq, or, sql } from "drizzle-orm";
import { board } from "@/app/lib/schema";
import { getSession } from "@/app/actions/auth/GetSession";
import db from "@/app/lib/drizzle";
import Board from "@/app/components/Board";

export default async function BoardsPage() {
    const session = await getSession();
    const userId = session?.user?.id;

    let boards;

    if (session) {
        // Signed Folks
        boards = await db
            .select()
            .from(board)
            .where(
                or(
                    eq(board.isPublic, true),
                    ...(userId ? [eq(board.authorID, userId)] : []),
                    ...(userId ? [sql`${board.editors}::text[] @> ARRAY[${userId}]`] : [])
                )
            )
    } else {
        // Just people who came across the site | No Session
        boards = await db
            .select()
            .from(board)
            .where(eq(board.isPublic, true));
    }

    return (
        <main className="bg-white min-h-screen p-4">
            <div className="grid grid-cols-1 gap-4">
                {boards.length > 0 ? (
                    <>
                        {boards.map((b) => (
                            <Board key={b.boardId} boardId={b.boardId} />
                        ))}
                    </>
                ) : (
                    <p className="text-center text-gray-500">No boards available. Please try again later.</p>
                )}
            </div>
        </main>
    );
}