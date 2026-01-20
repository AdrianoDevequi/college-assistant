const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Generate hashed password
    const password = await hash("admin123", 12);

    // Upsert Admin User
    const user = await prisma.user.upsert({
        where: { email: "admin@college.com" },
        update: {},
        create: {
            email: "admin@college.com",
            name: "Admin User",
            password,
            role: "ADMIN", // Using string directly as we are in JS
        },
    });
    console.log({ user });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
