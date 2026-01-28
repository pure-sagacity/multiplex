import { user } from "@/app/lib/schema";
import Link from "next/link";

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

type UserProps = {
    user: User;
};

export default function User({ user }: UserProps) {
    // Get initials from name for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="group relative inline-block">
            {/* Display name - what shows by default */}
            <Link href={`/user/${user.username}`} className="cursor-pointer hover:underline">
                {user.displayUsername || user.name}
            </Link>

            {/* Dropdown content - shows on hover */}
            <div
                className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-80 rounded-box bg-white text-black p-4 shadow-xl opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
            >
                <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="w-16 rounded-full bg-blue-600">
                            {user.image ? (
                                <img src={user.image} alt={user.name} />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                                    {getInitials(user.name)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User info */}
                    <div className="flex flex-col gap-1.5">
                        {/* Display name */}
                        <h3 className="text-xl font-bold text-black">{user.name}</h3>

                        {/* Username */}
                        {user.username && (
                            <p className="text-sm text-gray-400">@{user.username}</p>
                        )}

                        <div className="divider my-0 border-gray-700"></div>

                        {/* Role */}
                        {user.role && (
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase text-gray-600">Role</p>
                                <p className="text-sm capitalize text-black">{user.role}</p>
                            </div>
                        )}

                        {/* Member since */}
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-gray-600">
                                Member Since
                            </p>
                            <p className="text-sm text-black">
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
