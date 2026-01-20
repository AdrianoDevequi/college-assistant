import prisma from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StudentListModal from "./StudentListModal";

export const dynamic = 'force-dynamic';

export default async function TaskHistoryPage() {
    const tasks = await prisma.task.findMany({
        orderBy: {
            generatedAt: "desc",
        },
        include: {
            assignments: {
                include: {
                    student: {
                        include: {
                            studentProfile: true
                        }
                    }
                }
            }
        },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Tarefas</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Tarefas Geradas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tema</TableHead>
                                <TableHead>Nível Alvo</TableHead>
                                <TableHead>Enviada para</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhuma tarefa gerada ainda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            {format(new Date(task.generatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell className="font-medium">{task.theme}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {task.targetLevel}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <StudentListModal assignments={task.assignments as any} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Future: Add View Details button */}
                                            <span className="text-xs text-gray-400">Ver Detalhes (Em breve)</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
