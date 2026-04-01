"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, Info, X, ArrowRight } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastAction {
    label: string;
    href: string;
}

interface Toast {
    id: number;
    type: ToastType;
    message: string;
    action?: ToastAction;
}

interface ToastContextValue {
    success: (msg: string, action?: ToastAction) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
    success: <CheckCircle2 size={18} className="text-green-500 shrink-0" />,
    error: <XCircle size={18} className="text-red-500 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-yellow-500 shrink-0" />,
    info: <Info size={18} className="text-blue-500 shrink-0" />,
};

const STYLES = {
    success: "border-green-200 bg-white",
    error: "border-red-200 bg-white",
    warning: "border-yellow-200 bg-white",
    info: "border-blue-200 bg-white",
};

const BAR_COLORS = {
    success: "bg-green-400",
    error: "bg-red-400",
    warning: "bg-yellow-400",
    info: "bg-blue-400",
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((type: ToastType, message: string, action?: ToastAction) => {
        const id = ++counter;
        setToasts((prev) => [...prev, { id, type, message, action }]);
        setTimeout(() => dismiss(id), 6000);
    }, [dismiss]);

    const value: ToastContextValue = {
        success: (msg, action) => push("success", msg, action),
        error: (msg) => push("error", msg),
        warning: (msg) => push("warning", msg),
        info: (msg) => push("info", msg),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-start gap-3 border rounded-xl shadow-lg px-4 py-3 pr-3 animate-in slide-in-from-bottom-4 fade-in duration-300 ${STYLES[t.type]}`}
                    >
                        <div className="mt-0.5">{ICONS[t.type]}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-snug">{t.message}</p>
                            {t.action && (
                                <Link
                                    href={t.action.href}
                                    onClick={() => dismiss(t.id)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5"
                                >
                                    {t.action.label} <ArrowRight size={11} />
                                </Link>
                            )}
                        </div>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="text-gray-400 hover:text-gray-600 transition mt-0.5 shrink-0"
                        >
                            <X size={15} />
                        </button>
                        {/* Progress bar */}
                        <div className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${BAR_COLORS[t.type]} animate-shrink`} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}
