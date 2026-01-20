
import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();

async function getStudents() {
    try {
        return await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: { studentProfile: true },
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
                <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                <Link href="/admin/students/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No students found.</TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.studentProfile?.level || "N/A"}</TableCell>
                                    <TableCell>{student.studentProfile?.interestArea || "N/A"}</TableCell>
                                    <TableCell>{student.studentProfile?.phone || "N/A"}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
