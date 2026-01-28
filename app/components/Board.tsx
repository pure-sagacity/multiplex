import { board } from "@/app/lib/schema";
import { eq } from "drizzle-orm";
import db from "@/app/lib/drizzle";
import ReactMarkdown from "react-markdown";

interface Props {
    boardId: string;
}

const MAX_PREVIEW_LINES = 3;

export default async function Board({ boardId }: Props) {
    const boardData = await db
        .select()
        .from(board)
        .where(eq(board.boardId, boardId))
        .limit(1);

    if (boardData.length === 0) {
        return <div>Board not found</div>;
    }

    const { title, isPublic, createdAt, editors, data, } = boardData[0];

    return (
        <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            {/* Markdown Preview Section */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <div
                    className="prose prose-sm max-h-30 overflow-hidden line-clamp-3 p-3 bg-gray-50 rounded-md text-sm leading-relaxed"
                    style={{ lineClamp: MAX_PREVIEW_LINES }}
                >
                    <ReactMarkdown>
                        {data.slice(0, 300) + (data.length > 300 ? "…" : "")}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{title}</span>
                    <span className={isPublic ? "px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs" : "px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs"}>
                        {isPublic ? "Public" : "Private"}
                    </span>
                </div>
                <div className="flex items-center text-xs gap-2">
                    <span>Created:</span>
                    <span className="font-mono text-gray-600">{createdAt.toLocaleDateString()}</span>
                </div>
                {editors.length > 0 && (
                    <div className="flex items-center text-xs gap-1">
                        <span>Editors:</span>
                        <span className="font-mono text-gray-600">{editors.slice(0, 2).join(", ")}{editors.length > 2 ? ` +${editors.length - 2}` : ""}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
