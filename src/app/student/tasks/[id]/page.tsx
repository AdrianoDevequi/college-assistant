

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TaskQuestions from "./TaskQuestions";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    if (assignment) {
        console.log("Assignment Keys:", Object.keys(assignment));
        console.log("Answers Field:", assignment.answers);
    }

    if (!assignment) return null;
    if (assignment.student.email !== session.user.email) return null; // Security check

    return assignment;
}

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const assignment = await getAssignment(id);

    if (!assignment) {
        notFound();
    }

    const content = JSON.parse(assignment.task.content);
    const savedAnswers = assignment.answers ? JSON.parse(assignment.answers) : {};

    console.log("PAGE DEBUG:", {
        id: assignment.id,
        hasAnswersField: !!assignment.answers,
        answersLength: assignment.answers?.length,
        savedAnswersKeys: Object.keys(savedAnswers)
    });

    return (
        <div className="space-y-6">
            <Link href="/student/tasks" className="flex items-center text-gray-500 hover:text-gray-800">
                <ArrowLeft size={16} className="mr-2" /> Voltar para Tarefas
            </Link>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <Badge variant={assignment.status === "COMPLETED" ? "secondary" : "default"}>
                    {assignment.status === "COMPLETED" ? "Concluída" : "Pendente"}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Introdução</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{content.introduction}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Leitura / Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none text-gray-800 bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                        {content.content}
                    </div>
                </CardContent>
            </Card>

            <TaskQuestions
                content={content}
                assignmentId={assignment.id}
                initialStatus={assignment.status}
                initialAnswers={savedAnswers}
                rawAnswers={assignment.answers}
            />
        </div>
    );
}
