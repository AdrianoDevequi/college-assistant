
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const prisma = new PrismaClient();

async function getAssignment(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const assignment = await prisma.studentTask.findUnique({
        where: { id },
        include: {
            task: true,
            student: true
        },
    });

    if (!assignment) return null;
    if (assignment.student.email !== session.user.email) return null; // Security check

    return assignment;
}

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
    // Await params correctly for Next 15+ (although we initialized 14+, good practice)
    const { id } = await params;
    const assignment = await getAssignment(id);

    if (!assignment) {
        notFound();
    }

    const content = JSON.parse(assignment.task.content);

    async function completeTask() {
        "use server";
        await prisma.studentTask.update({
            where: { id },
            data: {
                status: "COMPLETED",
                completedAt: new Date()
            }
        });
        redirect("/student/tasks");
    }

    return (
        <div className="space-y-6">
            <Link href="/student/tasks" className="flex items-center text-gray-500 hover:text-gray-800">
                <ArrowLeft size={16} className="mr-2" /> Back to Tasks
            </Link>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <Badge variant={assignment.status === "COMPLETED" ? "secondary" : "default"}>
                    {assignment.status}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{content.introduction}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reading / Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none text-gray-800 bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                        {content.content}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {content.questions?.map((q: any, i: number) => (
                        <div key={i} className="p-4 border rounded bg-white">
                            <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {q.options?.map((opt: string, j: number) => (
                                    <li key={j} className="text-gray-600">{opt}</li>
                                ))}
                            </ul>
                            {assignment.status === "COMPLETED" && (
                                <div className="mt-3 text-green-600 text-sm font-medium">
                                    Answer: {q.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {assignment.status !== "COMPLETED" && (
                <form action={completeTask} className="flex justify-end">
                    <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
                        Mark as Completed
                    </Button>
                </form>
            )}
        </div>
    );
}
