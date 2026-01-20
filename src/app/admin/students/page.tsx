

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

import prisma from "@/lib/prisma";

async function getStudents() {
    try {
        return await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                studentProfile: true,
                _count: {
                    select: { assignedTasks: true }
                }
            },
        });
    } catch (e) {
        return [];
    }
}

export default async function StudentsPage() {
    const students = await getStudents();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Alunos</h2>
                <Link href="/admin/students/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Aluno
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nível</TableHead>
                            <TableHead>Interesse</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Nenhum aluno encontrado.</TableCell>
                            </TableRow>
                        ) : (
                            students.map((student: any) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.studentProfile?.level || "N/A"}</TableCell>
                                    <TableCell>{student.studentProfile?.interestArea || "N/A"}</TableCell>
                                    <TableCell>{student.studentProfile?.phone || "N/A"}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/students/${student.id}/edit#tasks`}>
                                            <Button variant="secondary" size="sm">
                                                Tarefas Atribuídas ({student._count?.assignedTasks || 0})
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/students/${student.id}/edit`}>
                                            <Button variant="outline" size="sm">Editar</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
