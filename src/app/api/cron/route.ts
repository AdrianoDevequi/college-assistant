import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateTaskContent } from "@/app/actions/ai";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export const maxDuration = 300; // 5 min timeout

// Secured by CRON_SECRET — Vercel sets this automatically when using Vercel Cron
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all active automations due to run
    const dueAutomations = await prisma.taskAutomation.findMany({
        where: {
            active: true,
            nextRun: { lte: now },
        },
    });

    if (dueAutomations.length === 0) {
        return NextResponse.json({ message: "No automations due.", ran: 0 });
    }

    const results = [];

    for (const automation of dueAutomations) {
        try {
            // 1. Generate task via Gemini
            const generatedContent = await generateTaskContent(automation.theme, automation.level);

            // 2. Create task record
            const task = await prisma.task.create({
                data: {
                    theme: automation.theme,
                    targetLevel: automation.level,
                    content: JSON.stringify(generatedContent),
                },
            });

            // 3. Find eligible students
            const students = await prisma.user.findMany({
                where: {
                    role: "STUDENT",
                    studentProfile: { level: automation.level },
                },
                include: { studentProfile: true },
            });

            // 4. Assign to students
            if (students.length > 0) {
                await prisma.studentTask.createMany({
                    data: students.map((s) => ({
                        studentId: s.id,
                        taskId: task.id,
                        status: "PENDING",
                    })),
                });

                // 5. WhatsApp notifications
                for (const student of students) {
                    if (student.studentProfile?.phone) {
                        const msg = `📚 *Nova Tarefa de Inglês!*\n\nTema: ${task.theme}\nNível: ${task.targetLevel}\n\nAcesse o portal para praticar!`;
                        await sendWhatsAppMessage(student.studentProfile.phone, msg).catch(() => {});
                    }
                }
            }

            // 6. Schedule next run (+7 days)
            const nextRun = new Date(automation.nextRun);
            nextRun.setDate(nextRun.getDate() + 7);

            await prisma.taskAutomation.update({
                where: { id: automation.id },
                data: { nextRun },
            });

            results.push({ id: automation.id, theme: automation.theme, studentsAssigned: students.length, status: "ok" });
        } catch (err: any) {
            console.error(`[CRON] Failed for automation ${automation.id}:`, err.message);
            results.push({ id: automation.id, theme: automation.theme, status: "error", error: err.message });
        }
    }

    console.log(`[CRON] Ran ${results.length} automation(s) at ${now.toISOString()}`);
    return NextResponse.json({ ran: results.length, results });
}
