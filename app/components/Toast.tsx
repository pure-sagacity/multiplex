'use client';

import { ReactElement, useEffect } from "react";

export interface ToastProps {
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    duration?: number; // in milliseconds
    onDismiss?: () => void;
}

function Toast({ message, type, duration = 3000, onDismiss }: ToastProps) {
    useEffect(() => {
        if (duration && onDismiss) {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onDismiss]);

    return (
        <div className={`alert alert-${type} cursor-pointer`} role="alert" onClick={onDismiss}>
            <span>{message}</span>
        </div>
    )
}

export interface ToastContainerProps {
    children: ReactElement<ToastProps> | ReactElement<ToastProps>[];
}

function ToastContainer({ children }: ToastContainerProps) {
    return (
        <div className="toast toast-top toast-end">
            {children}
        </div>
    )
}

export { Toast, ToastContainer };