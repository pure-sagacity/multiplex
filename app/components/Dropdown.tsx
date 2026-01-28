"use client";

import { useRef, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import SignOut from "../actions/auth/SignOut";

interface DropdownProps {
    ButtonComponent: React.ComponentType<any>;
    buttonComponentProps?: Record<string, any>;
    children: React.ReactNode;
}

export default function Dropdown({ ButtonComponent, buttonComponentProps, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer focus:outline-none"
            >
                <ButtonComponent {...buttonComponentProps} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2 border border-gray-200">
                    <ul className="space-y-1">
                        {children}
                        <li>
                            <button
                                onClick={() => SignOut()}
                                className="w-full text-left px-4 py-2 text-red-500 font-bold hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}