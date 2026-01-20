
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET(req: Request) {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: "admin@college.com" },
        });

        if (existingAdmin) {
            return NextResponse.json({ message: "Admin user already exists." });
        }

        const password = await hash("admin123", 12);

        const user = await prisma.user.create({
            data: {
                email: "admin@college.com",
                name: "Admin User",
                password,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            message: "Admin user created successfully!",
            user: { email: user.email, role: user.role }
        });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
