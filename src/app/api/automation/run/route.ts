import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateTaskContent } from "@/app/actions/ai";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export const maxDuration = 60; // Allow 1 minute timeout for AI generation

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        // If ID is provided, run specific automation (Manual Trigger)
        // If not, run all pending (Cron logic) - logic mostly same

        const automation = await prisma.taskAutomation.findUnique({
            where: { id }
        });

        if (!automation) {
            return NextResponse.json({ error: "Automation not found" }, { status: 404 });
        }

        // 1. Generate Task Content using AI
        const generatedContent = await generateTaskContent(automation.theme, automation.level);

        // 2. Create Task Record
        const task = await prisma.task.create({
            data: {
                theme: automation.theme,
                targetLevel: automation.level,
                content: JSON.stringify(generatedContent),
            }
        });

        // 3. Find Eligible Students
        const students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                studentProfile: {
                    level: automation.level
                }
            },
            include: {
                studentProfile: true
            }
        });

        // 4. Assign Task to Students
        if (students.length > 0) {
            await prisma.studentTask.createMany({
                data: students.map(student => ({
                    studentId: student.id,
                    taskId: task.id,
                    status: "PENDING"
                }))
            });

            // Trigger WhatsApp (Async, don't wait for all)
            for (const student of students) {
                if (student.studentProfile?.phone) {
                    const message = `📚 *Nova Tarefa de Inglês!* \n\nTema: ${task.theme}\nNível: ${task.targetLevel}\n\nAcesse o portal para praticar!`;
                    await sendWhatsAppMessage(student.studentProfile.phone, message);
                }
            }
        }

        // 5. Update Next Run (Add 7 days)
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 7);

        await prisma.taskAutomation.update({
            where: { id: automation.id },
            data: { nextRun: nextDate }
        });

        // Optional: Trigger WhatsApp notifications here (omitted for now to keep simple)

        return NextResponse.json({ success: true, task, studentsAssigned: students.length });

    } catch (e: any) {
        console.error("Automation Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
