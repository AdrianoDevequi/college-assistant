"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function EditStudentForm({ student }: { student: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Split phone into DDI and number if possible (simple heuristic)
    // Assuming format 5511999999999
    let initialDDI = "55";
    let initialPhone = student.studentProfile?.phone || "";

    // Check common DDIs
    if (initialPhone.startsWith("55")) { initialDDI = "55"; initialPhone = initialPhone.substring(2); }
    else if (initialPhone.startsWith("1")) { initialDDI = "1"; initialPhone = initialPhone.substring(1); }
    else if (initialPhone.startsWith("351")) { initialDDI = "351"; initialPhone = initialPhone.substring(3); }
    else if (initialPhone.startsWith("54")) { initialDDI = "54"; initialPhone = initialPhone.substring(2); }
    else if (initialPhone.startsWith("44")) { initialDDI = "44"; initialPhone = initialPhone.substring(2); }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        const ddi = data.ddi as string;
        const rawPhone = data.phone as string;
        const cleanPhone = rawPhone.replace(/\D/g, "");

        const payload = {
            id: student.id,
            name: data.name,
            email: data.email,
            phone: `${ddi}${cleanPhone}`,
            level: data.level,
            interestArea: data.interestArea,
            // Password is optional validation in backend
            password: data.password ? data.password : undefined,
        };

        try {
            const res = await fetch("/api/students", {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                router.push("/admin/students");
                router.refresh();
            } else {
                alert("Erro ao atualizar aluno");
                console.error(await res.text());
            }
        } catch (e) {
            alert("Algo deu errado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" name="name" defaultValue={student.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={student.email} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                        <div className="flex gap-2">
                            <Select name="ddi" defaultValue={initialDDI}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="DDI" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="55">🇧🇷 +55</SelectItem>
                                    <SelectItem value="1">🇺🇸 +1</SelectItem>
                                    <SelectItem value="351">🇵🇹 +351</SelectItem>
                                    <SelectItem value="54">🇦🇷 +54</SelectItem>
                                    <SelectItem value="44">🇬🇧 +44</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input id="phone" name="phone" required defaultValue={initialPhone} className="flex-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Nível de Inglês</Label>
                            <Select name="level" defaultValue={student.studentProfile?.level || "A1"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o nível" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interestArea">Interesse / Tema</Label>
                            <Input id="interestArea" name="interestArea" defaultValue={student.studentProfile?.interestArea} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha (opcional)</Label>
                        <Input id="password" name="password" type="password" placeholder="Deixe em branco para manter a atual" />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
