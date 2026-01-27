import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-white shadow-sm fixed top-0 left-0 right-0 z-50 px-6 py-3">
            <Link href="/" className="text-lg font-semibold text-gray-900 text-center flex items-center gap-2">
                <Image src="/logo.png" alt="Multiplex Logo" width={30} height={30} className="inline-block mr-2" />
                Multiplex
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                <Link href="/boards" className="hover:text-gray-900 hover:font-bold transition-all">
                    Boards
                </Link>
                <Link href="/shared" className="hover:text-gray-900 hover:font-bold transition-all">
                    Shared with Me
                </Link>
                <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 hover:font-bold transition-all"
                >
                    <Pencil className="h-4 w-4" />
                    Create
                </Link>
            </div>
        </nav>
    );
}