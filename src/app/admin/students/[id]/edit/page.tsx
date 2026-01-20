import prisma from "@/lib/prisma";
import EditStudentForm from "./form";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await prisma.user.findUnique({
        where: { id },
        include: {
            studentProfile: true,
            assignedTasks: {
                include: { task: true },
                orderBy: { sentAt: 'desc' }
            }
        },
    });

    if (!student) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Editar Aluno</h1>
                <p className="text-gray-500">Gerencie os dados e visualize o progresso do aluno.</p>
            </div>

            <EditStudentForm student={student} />

            <div id="tasks" className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Tarefas Atribuídas</h2>

                <div className="rounded-md border bg-white">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tema</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nível</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Enviado em</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Concluído em</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {student.assignedTasks.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td colSpan={5} className="p-4 align-middle text-center">Nenhuma tarefa atribuída ainda.</td>
                                    </tr>
                                ) : (
                                    student.assignedTasks.map((assignment: any) => (
                                        <tr key={assignment.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{assignment.task.theme}</td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {assignment.task.targetLevel}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(assignment.sentAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {assignment.status === "COMPLETED" ? (
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-100 text-green-800">
                                                        Concluída
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
                                                        Pendente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {assignment.completedAt ? new Date(assignment.completedAt).toLocaleDateString('pt-BR') : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
