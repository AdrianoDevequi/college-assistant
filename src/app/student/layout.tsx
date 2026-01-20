import Link from "next/link";
import { BookOpen, LogOut, CheckCircle } from "lucide-react";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <header className="fixed top-0 left-0 right-0 h-16 bg-blue-600 text-white flex items-center justify-between px-6 shadow-md z-10">
                <div className="text-xl font-bold flex items-center gap-2">
                    <BookOpen />
                    College Student
                </div>
                <Link href="/api/auth/signout" className="flex items-center gap-2 text-blue-100 hover:text-white">
                    <LogOut size={18} />
                    Sign Out
                </Link>
            </header>
            <main className="flex-1 pt-20 px-4 pb-8 max-w-4xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
