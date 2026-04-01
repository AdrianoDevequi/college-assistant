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
import { Plus, Filter } from "lucide-react";
import prisma from "@/lib/prisma";

async function getStudents(level?: string) {
    try {
        return await prisma.user.findMany({
            where: {
                role: "STUDENT",
                ...(level ? { studentProfile: { level: level as any } } : {}),
            },
            include: {
                studentProfile: true,
                _count: { select: { assignedTasks: true } },
            },
        });
    } catch (e) {
        return [];
    }
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ level?: string }>;
}) {
    const { level } = await searchParams;
    const students = await getStudents(level);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alunos</h2>
                    {level && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                            <Filter size={13} />
                            Filtrando por nível <strong>{level}</strong> — {students.length} aluno(s)
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {level && (
                        <Link href="/admin/students">
                            <Button variant="outline" size="sm">Limpar filtro</Button>
                        </Link>
                    )}
                    <Link href="/admin/students/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Aluno
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Level filter pills */}
            <div className="flex gap-2 flex-wrap">
                <Link href="/admin/students">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border transition ${!level ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"}`}>
                        Todos
                    </span>
                </Link>
                {LEVELS.map((l) => (
                    <Link key={l} href={`/admin/students?level=${l}`}>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border transition ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"}`}>
                            {l}
                        </span>
                    </Link>
                ))}
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
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    {level ? `Nenhum aluno com nível ${level}.` : "Nenhum aluno encontrado."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student: any) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                            {student.studentProfile?.level || "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell>{student.studentProfile?.interestArea || "N/A"}</TableCell>
                                    <TableCell>{student.studentProfile?.phone || "N/A"}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/students/${student.id}/edit#tasks`}>
                                            <Button variant="secondary" size="sm">
                                                Tarefas ({student._count?.assignedTasks || 0})
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
