"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Assignment {
    id: string;
    status: string;
    student: {
        name: string | null;
        email: string | null;
        studentProfile: {
            phone: string | null
        } | null
    };
    sentAt: Date;
    completedAt: Date | null;
}

export default function StudentListModal({ assignments }: { assignments: Assignment[] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto font-normal underline">
                    {assignments.length} alunos
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lista de Alunos - {assignments.length} Enviados</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Concluído em</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">{assignment.student.name || "N/A"}</TableCell>
                                    <TableCell>{assignment.student.email}</TableCell>
                                    <TableCell>{assignment.student.studentProfile?.phone || "-"}</TableCell>
                                    <TableCell>
                                        {assignment.status === "COMPLETED" ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Concluída</Badge>
                                        ) : (
                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pendente</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {assignment.completedAt
                                            ? new Date(assignment.completedAt).toLocaleDateString("pt-BR")
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
