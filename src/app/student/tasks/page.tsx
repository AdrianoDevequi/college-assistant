import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import TaskList from "./TaskList";

const prisma = new PrismaClient();

async function getMyTasks() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) return [];

    return await prisma.studentTask.findMany({
        where: { studentId: user.id },
        include: { task: true },
        orderBy: [
            { completedAt: 'desc' },
            { sentAt: 'desc' }
        ]
    });
}

export default async function StudentTasksPage() {
    const assignments = await getMyTasks();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h1>

            <TaskList assignments={assignments} />
        </div>
    );
}
