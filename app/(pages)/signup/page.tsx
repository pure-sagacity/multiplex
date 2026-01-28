'use server';

import Link from 'next/link';

export default async function SignupPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b">
                    <Link
                        href="/login"
                        className="px-4 py-2 font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg px-8 py-10 shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
                    <p className="text-gray-500 mb-8">Enter your information to create an account</p>

                    <form className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-900">First name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Max"
                                    name="firstName"
                                    required
                                    className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-900">Last name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Robinson"
                                    name="lastName"
                                    required
                                    className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="m@example.com"
                                name="email"
                                required
                                className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                required
                                className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                required
                                className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        {/* Profile Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Profile Image (optional)</span>
                            </label>
                            <label className="form-control w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="profileImage"
                                    className="file-input file-input-bordered w-full bg-gray-50 border-gray-300 text-gray-900"
                                />
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition duration-200 mt-6"
                        >
                            Create an account
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}