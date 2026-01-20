
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const lastTask = await prisma.studentTask.findFirst({
        orderBy: { sentAt: 'desc' },
        include: { task: true }
    });

    console.log("Last Task ID:", lastTask?.id);
    console.log("Status:", lastTask?.status);
    console.log("Answers (Raw):", lastTask?.answers);

    if (lastTask?.answers) {
        try {
            console.log("Answers (Parsed):", JSON.parse(lastTask.answers));
        } catch (e) {
            console.log("Error parsing answers JSON");
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
