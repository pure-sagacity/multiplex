import Link from "next/link";
import { Pencil } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-white shadow-sm fixed top-0 left-0 right-0 z-50 px-6 py-3">
            <div className="text-lg font-semibold text-gray-900">Multiplex</div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                <Link href="/boards" className="hover:text-gray-900">
                    Boards
                </Link>
                <Link href="/shared" className="hover:text-gray-900">
                    Shared with Me
                </Link>
                <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-800"
                >
                    <Pencil className="h-4 w-4" />
                    Create
                </Link>
            </div>
        </nav>
    );
}