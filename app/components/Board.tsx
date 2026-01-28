import GetUser from "../actions/Users/GetUser";
import GetBoard from "../actions/Boards/GetBoard";
import ReactMarkdown from "react-markdown";
import User from "./User";
import Link from "next/link";

interface Props {
    boardId: string;
}

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

const MAX_PREVIEW_LINES = 3;

export default async function Board({ boardId }: Props) {
    let boardData = await GetBoard(boardId);

    if (!boardData) {
        return (
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                <p className="text-center text-gray-500">Board not found.</p>
            </div>
        );
    }

    const { title, isPublic, createdAt, editors, data, } = boardData;
    let editorObjects: User[] = [];

    for (const editorId of editors) {
        let user = await GetUser(editorId, "id");
        if (user && user.displayUsername) {
            editorObjects.push(user);
        }
    }

    return (
        <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            {/* Markdown Preview Section */}
            <Link href={`/board/${boardId}`} className="block mb-4 pb-4 border-b border-gray-200">
                <div
                    className="prose prose-sm max-h-30 overflow-hidden line-clamp-3 p-3 bg-gray-50 rounded-md text-sm leading-relaxed text-black cursor-pointer"
                    style={{ lineClamp: MAX_PREVIEW_LINES }}
                >
                    <ReactMarkdown>
                        {data.slice(0, 300) + (data.length > 300 ? "…" : "")}
                    </ReactMarkdown>
                </div>
            </Link>

            {/* Info Section */}
            <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                    <Link href={`/board/${boardId}`} className="font-medium text-gray-900 hover:underline">
                        {title}
                    </Link>
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
                        <div className="flex flex-row flex-wrap gap-1">
                            {editorObjects.splice(0, 3).map((user, index) => (
                                <User key={index} user={user} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
