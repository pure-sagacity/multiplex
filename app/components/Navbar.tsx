import { Pencil, KeyRound } from "lucide-react";
import { getSession } from "../actions/auth/GetSession";
import Link from "next/link";
import Image from "next/image";
import Dropdown from "./Dropdown";
import AvatarButton from "./AvatarButton";

const DEFAULT_PROFILE_IMAGE = "https://onlcvwoumznbkbugtqas.supabase.co/storage/v1/object/public/profile_pics/default_profile.png";

export default async function Navbar() {
    const session = await getSession();

    const hasSession = session ? true : false;
    const avatarImage = session?.user.image || DEFAULT_PROFILE_IMAGE;

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
                {hasSession && (
                    <Dropdown ButtonComponent={AvatarButton} buttonComponentProps={{ imageSrc: avatarImage }}>
                        <li>
                            <Link href={`/user/${session?.user.username}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Settings</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Help</a>
                        </li>
                    </Dropdown>
                )}
            </div>
        </nav >
    );
}