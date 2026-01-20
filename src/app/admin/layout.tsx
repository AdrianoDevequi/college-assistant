import Link from "next/link";
import { User, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/api/auth/signin");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">College Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/students"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <User size={20} />
                        <span>Alunos</span>
                    </Link>
                    <Link
                        href="/admin/tasks"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <BookOpen size={20} />
                        <span>Tarefas</span>
                    </Link>

                    <div className="pt-8 text-red-500 hover:text-red-700">
                        <Link href="/api/auth/signout" className="flex items-center space-x-3 p-2">
                            <LogOut size={20} />
                            <span>Sair</span>
                        </Link>
                    </div>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}
