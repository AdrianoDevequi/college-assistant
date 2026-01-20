import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        orderBy: { sentAt: 'desc' }
    });
}

export default async function StudentTasksPage() {
    const assignments = await getMyTasks();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>

            <div className="grid gap-4">
                {assignments.length === 0 ? (
                    <p className="text-gray-500">No tasks assigned yet.</p>
                ) : (
                    assignments.map((assignment) => (
                        <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{assignment.task.theme}</CardTitle>
                                    <Badge variant={assignment.status === "COMPLETED" ? "secondary" : "default"}>
                                        {assignment.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 text-sm">Level: {assignment.task.targetLevel}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Assigned: {new Date(assignment.sentAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/student/tasks/${assignment.id}`} className="w-full">
                                    <Button className="w-full">
                                        {assignment.status === "COMPLETED" ? "Review Task" : "Start Task"}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
