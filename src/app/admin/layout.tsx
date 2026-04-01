import Link from "next/link";
import { BookOpen, LayoutDashboard, Settings, History, Repeat, User, BarChart3 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";

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
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-600" />
                    <h1 className="text-lg font-bold text-gray-800">Language Assistant</h1>
                </div>
                <nav className="p-4 space-y-1 flex-1">
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
                    <Link
                        href="/admin/tasks/history"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <History size={20} />
                        <span>Histórico</span>
                    </Link>
                    <Link
                        href="/admin/automation"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <Repeat size={20} />
                        <span>Automação</span>
                    </Link>
                    <Link
                        href="/admin/usage"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <BarChart3 size={20} />
                        <span>Consumo</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <Settings size={20} />
                        <span>Configurações</span>
                    </Link>
                </nav>

                {/* User menu at bottom */}
                <div className="p-4 border-t">
                    <UserMenu
                        name={session.user.name}
                        email={session.user.email}
                        plan={session.user.plan ?? "FREE"}
                    />
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}
