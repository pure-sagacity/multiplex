'use client';
import { ReactElement, useEffect } from "react";

export interface ToastProps {
    message: string;
    type: 'info' | 'success' | 'error';
    duration?: number; // in milliseconds
    onDismiss?: () => void;
}

export function Toast({ message, type, duration = 3000, onDismiss }: ToastProps) {
    useEffect(() => {
        if (duration && onDismiss) {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onDismiss]);

    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>
        </div>
    )
}

export interface ToastContainerProps {
    children: ReactElement<ToastProps> | ReactElement<ToastProps>[];
}

export function ToastContainer({ children }: ToastContainerProps) {
    return (
        <div className="toast toast-top toast-end">
            {children}
        </div>
    )
}