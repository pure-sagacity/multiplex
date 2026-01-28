import { User, Mail, Calendar, Shield, Ban, Clock, AtSign, CheckCircle, XCircle } from 'lucide-react';
import { getSession } from '@/app/actions/auth/GetSession';
import GetUser from '@/app/actions/Users/GetUser';

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

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = await params;
    const request: User | null = await GetUser(userId, "username");
    const session = await getSession();

    const isYou = session?.user.id === request?.id;

    console.log("User logged in?", session);

    console.log("Is you?", isYou);

    if (!request) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">User Not Found</h1>
                    <p className="text-slate-600">The user you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    const { id, name, email, emailVerified, image, createdAt, updatedAt, role, banned, banReason, banExpires, username, displayUsername } = request;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex items-start gap-6">
                        {/* Profile Image */}
                        <div className="shrink-0">
                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-24 h-24 rounded-full border-4 border-blue-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="grow">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-800">{name}</h1>
                                {role && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                                        {role}
                                    </span>
                                )}
                            </div>

                            {displayUsername && (
                                <div className="flex items-center gap-2 text-slate-600 mb-3">
                                    <AtSign className="w-4 h-4" />
                                    <span className="font-medium">{displayUsername}</span>
                                    {username && username !== displayUsername && (
                                        <span className="text-slate-400 text-sm">({username})</span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="w-4 h-4" />
                                <span>{email}</span>
                                {emailVerified ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                {banned && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <Ban className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Account Banned</h3>
                                {banReason && (
                                    <p className="text-red-700 mb-2">
                                        <span className="font-medium">Reason:</span> {banReason}
                                    </p>
                                )}
                                {banExpires && (
                                    <p className="text-red-600 text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Expires: {formatDate(banExpires)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Account Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-500">User ID</label>
                                <p className="text-slate-800 font-mono text-sm mt-1">{id}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-500">Email Status</label>
                                <p className="text-slate-800 mt-1">
                                    {emailVerified ? (
                                        <span className="inline-flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-amber-600">
                                            <XCircle className="w-4 h-4" />
                                            Not Verified
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-500">Account Status</label>
                                <p className="text-slate-800 mt-1">
                                    {banned ? (
                                        <span className="inline-flex items-center gap-2 text-red-600">
                                            <Ban className="w-4 h-4" />
                                            Banned
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Active
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Timeline
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-500">Created At</label>
                                <p className="text-slate-800 mt-1">{formatDate(createdAt)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-500">Last Updated</label>
                                <p className="text-slate-800 mt-1">{formatDate(updatedAt)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-500">Account Age</label>
                                <p className="text-slate-800 mt-1">
                                    {Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))} days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {session && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            {isYou && (
                                <>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                                        Change Password
                                    </button>
                                </>
                            )}
                            {session?.user.role === "admin" && !isYou && (
                                <>
                                    {!banned && (
                                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                                            Ban User
                                        </button>
                                    )}
                                    {banned && (
                                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                            Unban User
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}