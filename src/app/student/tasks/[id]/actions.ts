"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeTaskAction(assignmentId: string, answers: Record<number, string>) {
    // In a real app, we would save the answers to the DB here.
    // For now, we just mark as completed.

    try {
        console.log("Saving answers:", answers);

        await prisma.studentTask.update({
            where: { id: assignmentId },
            data: {
                status: "COMPLETED",
                answers: JSON.stringify(answers),
                completedAt: new Date()
            }
        });

        revalidatePath("/student/tasks");
        revalidatePath(`/student/tasks/${assignmentId}`);

        return { success: true };
    } catch (e) {
        console.log("Server Action Error:", e);
        throw e; // Re-throw to be caught by client
    }
}
