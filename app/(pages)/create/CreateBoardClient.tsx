"use client";

import { useState, useRef, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Toast, ToastContainer } from '@/app/components/Toast';


interface EditorSuggestion {
    id: string;
    email: string;
    displayName: string;
}

interface SelectedEditor {
    id: string;
    email: string;
    displayName: string;
}

interface CreateBoardClientProps {
    users: Array<{
        id: string;
        email: string;
        displayUsername?: string | null;
        username?: string | null;
    }>;
    createBoardAction: (formData: FormData) => Promise<any>;
}

export default function CreateBoardClient({ users, createBoardAction }: CreateBoardClientProps) {
    const [formData, setFormData] = useState({
        title: '',
        visibility: 'public' as 'public' | 'private',
    });
    const [selectedEditors, setSelectedEditors] = useState<SelectedEditor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<EditorSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'error' }>>([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // ...existing code...
    // Handle title input change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, title: e.target.value }));
    };

    // Handle visibility toggle
    const handleVisibilityChange = (value: 'public' | 'private') => {
        setFormData((prev) => ({ ...prev, visibility: value }));
    };

    // Handle search input change with autocomplete
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter users based on query (email or display name)
        const filtered = users
            .filter(
                (user) =>
                    !selectedEditors.find((selected) => selected.id === user.id) &&
                    (user.email.toLowerCase().includes(query.toLowerCase()) ||
                        (user.displayUsername || user.username || user.email).toLowerCase().includes(query.toLowerCase()))
            )
            .map((user) => ({
                id: user.id,
                email: user.email,
                displayName: user.displayUsername || user.username || user.email,
            }));

        setSuggestions(filtered);
        setShowSuggestions(true);
    };

    // Handle input focus to show all available users
    const handleSearchFocus = () => {
        const available = users.filter(
            (user) => !selectedEditors.find((selected) => selected.id === user.id)
        );
        setSuggestions(available.map((user) => ({
            id: user.id,
            email: user.email,
            displayName: user.displayUsername || user.username || user.email,
        })));
        setShowSuggestions(true);
    };

    // Handle suggestion click
    const handleSuggestionClick = (user: EditorSuggestion) => {
        setSelectedEditors((prev) => [...prev, user]);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Handle removing selected editor
    const handleRemoveEditor = (editorId: string) => {
        setSelectedEditors((prev) => prev.filter((editor) => editor.id !== editorId));
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Create toast notification
    const createToast = (message: string, type: 'info' | 'success' | 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    // Remove toast notification
    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            createToast('Please enter a board title', 'error');
            return;
        }
        setLoading(true);
        try {
            const form = e.currentTarget;
            const data = new FormData(form);
            selectedEditors.forEach((editor) => data.append('editors', editor.id));
            const result = await createBoardAction(data);
            createToast('Board created successfully!', 'success');
            setFormData({ title: '', visibility: 'public' });
            setSelectedEditors([]);
            setSearchQuery('');
            if (result && result.id) {
                redirect(`/board/${result.id}`);
            }
        } catch (error) {
            createToast(error instanceof Error ? error.message : 'Failed to create board', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Create New Board</h1>
                    <p className="text-gray-600 mt-2">Set up a new whiteboard and invite editors</p>
                </div>

                {/* Toast Container */}
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

                {/* Form Card */}
                <div className="bg-white rounded-xl px-8 py-10 shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Board Title</span>
                            </label>
                            <input
                                type="text"
                                placeholder="My awesome project"
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                            />
                            <label className="label">
                                <span className="label-text-alt text-gray-500">Give your board a descriptive name</span>
                            </label>
                        </div>

                        {/* Visibility Toggle */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Visibility</span>
                            </label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={formData.visibility === 'public'}
                                        onChange={() => handleVisibilityChange('public')}
                                        className="radio radio-accent"
                                    />
                                    <span className="text-gray-700 font-medium">Public</span>
                                    <span className="text-gray-500 text-sm">Anyone can view</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={formData.visibility === 'private'}
                                        onChange={() => handleVisibilityChange('private')}
                                        className="radio radio-accent"
                                    />
                                    <span className="text-gray-700 font-medium">Private</span>
                                    <span className="text-gray-500 text-sm">Only editors can view</span>
                                </label>
                            </div>
                        </div>

                        {/* Editors Search */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-900">Add Editors</span>
                            </label>
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by email or name..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    className="input input-bordered w-full bg-gray-50 border-accent-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                />

                                {/* Autocomplete Suggestions */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div
                                        ref={suggestionsRef}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-accent-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                    >
                                        {suggestions.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleSuggestionClick(user)}
                                                className="w-full text-left px-4 py-3 hover:bg-accent-50 transition flex flex-col border-b border-gray-100 last:border-b-0"
                                            >
                                                <span className="font-medium text-gray-900">{user.displayName}</span>
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No suggestions message */}
                                {showSuggestions && searchQuery && suggestions.length === 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-accent-200 rounded-lg shadow-lg z-10 px-4 py-3">
                                        <p className="text-gray-500 text-sm">No users found</p>
                                    </div>
                                )}
                            </div>
                            <label className="label">
                                <span className="label-text-alt mt-2 text-gray-500">
                                    {`${selectedEditors.length} editor${selectedEditors.length === 1 ? '' : 's'} added`}
                                </span>
                            </label>
                        </div>

                        {/* Selected Editors */}
                        {selectedEditors.length > 0 && (
                            <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
                                <div className="flex flex-wrap gap-2">
                                    {selectedEditors.map((editor) => (
                                        <div
                                            key={editor.id}
                                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-accent-200 shadow-sm"
                                        >
                                            <span className="text-sm text-gray-900 font-medium">{editor.displayName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEditor(editor.id)}
                                                className="text-gray-400 hover:text-gray-600 transition ml-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn flex-1 bg-accent-600 hover:bg-accent-700 text-white border-none disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Board'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}