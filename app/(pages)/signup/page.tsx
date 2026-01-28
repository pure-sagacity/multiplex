'use client';

import SignUp from '@/app/actions/auth/SignUp';
import { Toast, ToastContainer } from '@/app/components/Toast';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: undefined as File | undefined,
        username: '',
        displayUsername: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [DisplayNameManuallyEdited, setDisplayNameManuallyEdited] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'error' }>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const createToast = (message: string, type: 'info' | 'success' | 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'username') {
            setFormData((prev) => ({
                ...prev,
                username: value,
                // Update displayUsername only if it hasn't been manually edited
                displayUsername: DisplayNameManuallyEdited ? prev.displayUsername : value,
            }));
        } else if (name === 'displayUsername') {
            setFormData((prev) => ({ ...prev, displayUsername: value }));
            setDisplayNameManuallyEdited(true);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStage1 = () => {
        if (!formData.name.trim()) {
            createToast('Please enter your name.', "error");
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            createToast('Please enter a valid email address', "error");
            return false;
        }
        return true;
    };

    const validateStage2 = () => {
        if (formData.password.length < 8) {
            createToast('Password must be at least 8 characters long', "error");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            createToast('Passwords do not match', "error");
            return false;
        }
        return true;
    };

    const validateStage3 = () => {
        if (!formData.username.trim()) {
            createToast('Please enter a username', "error");
            return false;
        }
        if (formData.username.length < 3) {
            createToast('Username must be at least 3 characters long', "error");
            return false;
        }
        if (!formData.displayUsername.trim()) {
            createToast('Please enter a display name', "error");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (stage === 1 && validateStage1()) {
            setStage(2);
        } else if (stage === 2 && validateStage2()) {
            setStage(3);
        }
    };

    const handlePrevious = () => {
        setStage((prev) => Math.max(1, prev - 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStage3()) return;

        setLoading(true);

        const { name, email, password, username, displayUsername, profileImage } = formData;

        await SignUp(name, email, password, username, displayUsername, profileImage)
            .then(() => {
                if (typeof window !== 'undefined') {
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                createToast(error.message || 'Sign Up failed', 'error');
            });

        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <Link
                        href="/login"
                        className="px-4 py-2 font-semibold text-gray-500 hover:text-gray-700 transition"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 font-semibold text-accent-600 border-b-2 border-accent-600"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl px-8 py-10 shadow-lg border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600 mb-6">Step {stage} of 3</p>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full ${stage >= 1 ? 'bg-accent-600' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${stage >= 2 ? 'bg-accent-600' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${stage >= 3 ? 'bg-accent-600' : 'bg-gray-200'}`} />
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Stage 1: Name + Email */}
                        {stage === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleNext();
                                            }
                                        }}
                                        className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Stage 2: Password + Confirmation */}
                        {stage === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">Minimum 8 characters</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Confirm Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleNext();
                                            }
                                        }}
                                        className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Stage 3: Profile Picture + Username + Display Name */}
                        {stage === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Profile Picture (Optional)</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview && (
                                            <div className="avatar">
                                                <div className="w-20 h-20 rounded-full ring ring-accent-200 ring-offset-2">
                                                    <img src={imagePreview} alt="Preview" />
                                                </div>
                                            </div>
                                        )}
                                        <label className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="file-input file-input-bordered w-full bg-accent-50 border-accent-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Username</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full bg-accent-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">Unique identifier for login</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-900">Display Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        name="displayUsername"
                                        value={formData.displayUsername}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full bg-accent-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">How others will see your name</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 pt-4">
                            {stage > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="btn btn-outline flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                                >
                                    Previous
                                </button>
                            )}
                            {stage < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn flex-1 bg-accent-700 hover:bg-accent-800 text-white border-none"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn flex-1 bg-accent-600 hover:bg-accent-700 text-white border-none"
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-accent-600 hover:text-accent-700 font-semibold">
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    );
}