import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getStats() {
    // In a real scenario, these would connect to the DB. 
    // Wrapping in try/catch to avoid crash if DB not reachable
    try {
        const studentCount = await prisma.user.count({ where: { role: "STUDENT" } });
        const taskCount = await prisma.task.count();
        const pendingAssignments = await prisma.studentTask.count({ where: { status: "PENDING" } });
        return { studentCount, taskCount, pendingAssignments };
    } catch (e) {
        console.error("DB Error", e);
        return { studentCount: 0, taskCount: 0, pendingAssignments: 0 };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studentCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.taskCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
