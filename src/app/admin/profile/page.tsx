"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name ?? "");
    const [email, setEmail] = useState(session?.user?.email ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "As senhas não coincidem." });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage({ type: "error", text: data.error ?? "Erro ao salvar." });
            } else {
                await update({ name: data.name, email: data.email });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Meu Perfil</h1>
            <p className="text-gray-500 mb-8">Atualize seus dados de acesso.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados pessoais */}
                <div className="bg-white border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Dados Pessoais</h2>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                    </div>
                </div>

                {/* Alterar senha */}
                <div className="bg-white border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound size={18} className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Alterar Senha</h2>
                    </div>
                    <p className="text-xs text-gray-400">Deixe em branco para manter a senha atual.</p>
                    <div className="space-y-1">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                </div>

                {message && (
                    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </form>
        </div>
    );
}
