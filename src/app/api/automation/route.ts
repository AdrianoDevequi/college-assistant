import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const automations = await prisma.taskAutomation.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(automations);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { theme, level, dayOfWeek = 1, timeOfDay = "09:00" } = body;

        // Calculate initial nextRun based on dayOfWeek and timeOfDay
        const now = new Date();
        let nextRun = new Date();

        // Parse time
        const [hour, minute] = timeOfDay.split(':').map(Number);
        nextRun.setHours(hour, minute, 0, 0);

        // Calculate day difference
        // JS Date: 0=Sunday, 1=Monday...
        const currentDay = now.getDay();
        const dayDiff = Number(dayOfWeek) - currentDay;

        // If dayDiff is positive, it's later this week
        // If dayDiff is negative, it's next week (add 7)
        // If dayDiff is 0, check time. If time passed, add 7.

        let daysToAdd = dayDiff;
        if (dayDiff < 0) {
            daysToAdd += 7;
        } else if (dayDiff === 0) {
            if (now > nextRun) {
                daysToAdd += 7;
            }
        }

        nextRun.setDate(now.getDate() + daysToAdd);

        const automation = await prisma.taskAutomation.create({
            data: {
                theme,
                level,
                dayOfWeek: Number(dayOfWeek),
                timeOfDay,
                nextRun,
            }
        });

        return NextResponse.json(automation);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.taskAutomation.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
