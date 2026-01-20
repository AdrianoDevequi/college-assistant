
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { name, email, password, phone, level, interestArea } = data;

        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
                studentProfile: {
                    create: {
                        phone,
                        level,
                        interestArea,
                    },
                },
            },
        });

        return NextResponse.json(user);
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const { id, name, email, password, phone, level, interestArea } = data;

        const updateData: any = {
            name,
            email,
            studentProfile: {
                update: {
                    phone,
                    level,
                    interestArea,
                },
            },
        };

        if (password && password.trim() !== "") {
            updateData.password = await hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(user);
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
