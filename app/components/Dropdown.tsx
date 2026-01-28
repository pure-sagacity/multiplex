"use client";

import { LogOut } from "lucide-react";
import SignOut from "../actions/auth/SignOut";

interface DropdownProps {
    ButtonComponent: React.ComponentType<any>;
    children: React.ReactNode;
}

export default function Dropdown({ ButtonComponent, children }: DropdownProps) {
    return (
        <details className="dropdown">
            <summary className="btn m-1">
                <ButtonComponent />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {children}
                <li onClick={() => SignOut()} className="text-red-500 font-bold">
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Logout
                </li>
            </ul>
        </details>
    );
}