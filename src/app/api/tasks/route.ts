
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { theme, level, content } = data; // content is stringified JSON

        // 1. Create the Master Task
        const task = await prisma.task.create({
            data: {
                theme,
                targetLevel: level,
                content,
            },
        });

        // 2. Find matching students
        // Matches if student has same level AND (optionally) matching interest area if implemented strict
        // For now, let's match primarily by Level to ensure distribution works
        const students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                studentProfile: {
                    level: level,
                },
            },
            include: {
                studentProfile: true,
            },
        });

        // 3. Assign Task & Send Notification
        const assignments = await Promise.all(
            students.map(async (student) => {
                // Create Assignment
                const assignment = await prisma.studentTask.create({
                    data: {
                        studentId: student.id,
                        taskId: task.id,
                    },
                });

                // Send WhatsApp
                if (student.studentProfile?.phone) {
                    const studentName = student.name?.split(" ")[0] || "Aluno";
                    const taskLink = `${process.env.NEXTAUTH_URL}/student/tasks/${assignment.id}`;
                    const message = `Olá ${studentName}! 🎓\nNova tarefa de Inglês disponível: *${theme}*\nNível: ${level}\n\nAcesse aqui: ${taskLink}`;

                    await sendWhatsAppMessage(student.studentProfile.phone, message);
                }

                return assignment;
            })
        );

        return NextResponse.json({
            success: true,
            task,
            assignedCount: assignments.length
        });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
