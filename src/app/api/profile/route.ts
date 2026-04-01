import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data: Record<string, string> = {};

    if (name) data.name = name;
    if (email && email !== user.email) {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return NextResponse.json({ error: "E-mail já em uso" }, { status: 400 });
        data.email = email;
    }

    if (newPassword) {
        if (!currentPassword) return NextResponse.json({ error: "Informe a senha atual" }, { status: 400 });
        const valid = await compare(currentPassword, user.password);
        if (!valid) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
        data.password = await hash(newPassword, 12);
    }

    const updated = await prisma.user.update({ where: { id: session.user.id }, data });

    return NextResponse.json({ success: true, name: updated.name, email: updated.email });
}
