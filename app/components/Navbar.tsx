import Link from "next/link";
import Image from "next/image";
import auth from "../lib/auth";
import { Pencil, KeyRound } from "lucide-react";
import { headers } from "next/headers";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const hasSession = session ? true : false;

    return (
        <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
            <Link href="/" className="text-lg font-semibold text-gray-900 text-center flex items-center gap-2">
                <Image src="/logo.png" alt="Multiplex Logo" width={30} height={30} className="inline-block mr-2" />
                Multiplex
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                <Link href="/boards" className="hover:text-gray-900 hover:font-bold transition-all">
                    Boards
                </Link>
                {hasSession && (
                    <Link href="/shared" className="hover:text-gray-900 hover:font-bold transition-all">
                        Shared with Me
                    </Link>
                )}
                {hasSession ? (
                    (
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 rounded-md bg-accent-800 px-3 py-2 text-white hover:bg-accent-900 hover:font-bold transition-all"
                        >
                            <Pencil className="h-4 w-4" />
                            Create
                        </Link>
                    )
                ) : (
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-md bg-accent-800 px-3 py-2 text-white hover:bg-accent-900 hover:font-bold transition-all"
                    >
                        <KeyRound className="h-4 w-4" />
                        Login
                    </Link>
                )}
                {hasSession && session?.user.image && (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={session?.user.image} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </nav >
    );
}