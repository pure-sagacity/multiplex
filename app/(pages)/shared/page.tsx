import { Users } from 'lucide-react';
import { board } from '@/app/lib/schema';
import { sql } from 'drizzle-orm';
import { getSession } from '@/app/actions/auth/GetSession';
import { redirect } from 'next/navigation';
import db from '@/app/lib/drizzle';
import Board from '@/app/components/Board';

interface BoardType {
    boardId: string;
    authorID: string;
    title: string;
    isPublic: boolean;
    createdAt: Date;
    editors: string[];
    data: string;
}

// Main SharedWithMe Component
export default async function SharedWithMePage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;

    const boards = await db
        .select()
        .from(board)
        .where(sql`${board.editors}::text[] @> ARRAY[${userId}]`);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared with Me</h1>
                    <p className="text-gray-600">Boards that others have shared with you</p>
                </div>

                {/* Boards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map(board => (
                        <Board key={board.boardId} boardId={board.boardId} />
                    ))}
                </div>

                {/* Empty State */}
                {boards.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Users size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No boards found
                        </h3>
                        <p className="text-gray-600">
                            You don't have editor access to any shared boards yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};