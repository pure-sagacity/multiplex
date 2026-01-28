'use client';

import { Toast, ToastContainer } from '@/app/components/Toast';
import { useState } from 'react';
import Login from '@/app/actions/auth/Login';
import Link from 'next/link';

export default function LoginPage() {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'error' }>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const createToast = (message: string, type: 'info' | 'success' | 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const handleLogin = async (formData: FormData) => {
        setLoading(true);
        const email = formData.get('email');
        const password = formData.get('password');

        await Login(email as string, password as string)
            .then((res) => {
                if (res.redirect && res.url) {
                    if (typeof window !== 'undefined') {
                        window.location.href = res.url;
                    }
                }
            })
            .catch((error) => {
                createToast(error.message || 'Login failed', 'error');
            });

        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b">
                    <Link
                        href="/login"
                        className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg px-8 py-10 shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                    <p className="text-gray-500 mb-8">Enter your email below to login to your account</p>

                    <form className="space-y-6" action={handleLogin}>
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
                                placeholder="password"
                                name="password"
                                required
                                className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition duration-200"
                        >
                            {loading ? <span className="loading loading-spinner loading-md"></span> : "Login"}
                        </button>
                    </form>
                </div>
            </div>

            {toasts.length > 0 && (
                <ToastContainer>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={3000}
                            onDismiss={() => removeToast(toast.id)}
                        />
                    ))}
                </ToastContainer>
            )}
        </main>
    );
}