"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskListProps {
    assignments: any[];
}

export default function TaskList({ assignments }: TaskListProps) {
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("PENDING");

    const filteredAssignments = assignments.filter(a => {
        if (filter === "ALL") return true;
        return a.status === filter;
    });

    // Sort: Pending first, then by date logic usually handled by DB, but here we can re-sort if needed.
    // The parent already passes them sorted by date.

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setFilter("PENDING")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "PENDING"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    Pendentes
                </button>
                <button
                    onClick={() => setFilter("COMPLETED")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "COMPLETED"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    Concluídas
                </button>
                <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "ALL"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    Todas
                </button>
            </div>

            <div className="grid gap-4">
                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">
                            {filter === "PENDING" ? "Você não tem tarefas pendentes! 🎉" :
                                filter === "COMPLETED" ? "Nenhuma tarefa concluída ainda." :
                                    "Nenhuma tarefa encontrada."}
                        </p>
                    </div>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{assignment.task.theme}</CardTitle>
                                    <Badge variant={assignment.status === "COMPLETED" ? "secondary" : "default"}>
                                        {assignment.status === "COMPLETED" ? "Concluída" : "Pendente"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 text-sm">Nível: {assignment.task.targetLevel}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {assignment.status === "COMPLETED"
                                        ? `Concluída em: ${new Date(assignment.completedAt!).toLocaleString("pt-BR")}`
                                        : `Atribuída em: ${new Date(assignment.sentAt).toLocaleString("pt-BR")}`
                                    }
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/student/tasks/${assignment.id}`} className="w-full">
                                    <Button className="w-full" variant={assignment.status === "COMPLETED" ? "outline" : "default"}>
                                        {assignment.status === "COMPLETED" ? "Revisar Tarefa" : "Iniciar Tarefa"}
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
