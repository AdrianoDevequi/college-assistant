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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        // Combine DDI and Phone
        const ddi = data.ddi as string;
        const rawPhone = data.phone as string;
        // Remove formatting from phone (keep only numbers)
        const cleanPhone = rawPhone.replace(/\D/g, "");

        data.phone = `${ddi}${cleanPhone}`;

        try {
            const res = await fetch("/api/students", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                router.push("/admin/students");
                router.refresh();
            } else {
                alert("Erro ao criar aluno");
            }
        } catch (e) {
            alert("Algo deu errado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastrar Novo Aluno</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                            <div className="flex gap-2">
                                <Select name="ddi" defaultValue="55">
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
                                <Input id="phone" name="phone" required placeholder="11999999999" className="flex-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="level">Nível de Inglês</Label>
                                <Select name="level" defaultValue="A1">
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
                                <Input id="interestArea" name="interestArea" placeholder="ex: Agronomia" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha Inicial</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Criando..." : "Criar Aluno"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
