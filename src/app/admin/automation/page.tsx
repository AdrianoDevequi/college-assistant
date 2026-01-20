"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Play, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AutomationPage() {
    const [automations, setAutomations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    const [newAuto, setNewAuto] = useState({
        theme: "",
        level: "A1",
        dayOfWeek: "1",
        timeOfDay: "09:00",
        active: true
    });

    useEffect(() => {
        fetchAutomations();
    }, []);

    const fetchAutomations = async () => {
        const res = await fetch("/api/automation");
        if (res.ok) {
            const data = await res.json();
            setAutomations(data);
        }
    };

    const handleCreate = async () => {
        if (!newAuto.theme) return;
        setCreating(true);
        try {
            await fetch("/api/automation", {
                method: "POST",
                body: JSON.stringify(newAuto),
                headers: { "Content-Type": "application/json" }
            });
            setNewAuto({ theme: "", level: "A1", dayOfWeek: "1", timeOfDay: "09:00", active: true });
            fetchAutomations();
        } catch (e) {
            alert("Erro ao criar automação");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta automação?")) return;
        await fetch(`/api/automation?id=${id}`, { method: "DELETE" });
        fetchAutomations();
    };

    const handleRunNow = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/automation/run", {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Sucesso! Tarefa gerada: ${data.task.theme}`);
                fetchAutomations(); // Update nextRun
            } else {
                alert("Erro ao rodar automação: " + data.error);
            }
        } catch (e) {
            alert("Erro ao executar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Automação de Tarefas</h1>
            <p className="text-gray-500">
                Configure o sistema para gerar e enviar tarefas automaticamente toda semana.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Create Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Nova Regra</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tema / Tópico</label>
                            <Input
                                placeholder="ex: Business English"
                                value={newAuto.theme}
                                onChange={(e) => setNewAuto({ ...newAuto, theme: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nível Alvo</label>
                            <Select
                                value={newAuto.level}
                                onValueChange={(v) => setNewAuto({ ...newAuto, level: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A1", "A2", "B1", "B2", "C1", "C2"].map(l => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dia da Semana</label>
                                <Select
                                    value={String(newAuto.dayOfWeek)}
                                    onValueChange={(v) => setNewAuto({ ...newAuto, dayOfWeek: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Segunda</SelectItem>
                                        <SelectItem value="2">Terça</SelectItem>
                                        <SelectItem value="3">Quarta</SelectItem>
                                        <SelectItem value="4">Quinta</SelectItem>
                                        <SelectItem value="5">Sexta</SelectItem>
                                        <SelectItem value="6">Sábado</SelectItem>
                                        <SelectItem value="0">Domingo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Horário</label>
                                <Input
                                    type="time"
                                    min="08:00"
                                    max="18:00"
                                    value={newAuto.timeOfDay}
                                    onChange={(e) => setNewAuto({ ...newAuto, timeOfDay: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleCreate} disabled={creating || !newAuto.theme}>
                            {creating ? "Criando..." : "Adicionar Automação"}
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Regras Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tema</TableHead>
                                    <TableHead>Nível</TableHead>
                                    <TableHead>Próxima Execução</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {automations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            Nenhuma automação configurada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    automations.map((auto) => (
                                        <TableRow key={auto.id}>
                                            <TableCell className="font-medium">{auto.theme}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{auto.level}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <CalendarClock className="h-4 w-4 text-gray-500" />
                                                    {new Date(auto.nextRun).toLocaleDateString('pt-BR')} às {auto.timeOfDay}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={loading}
                                                    onClick={() => handleRunNow(auto.id)}
                                                    title="Rodar agora (teste)"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(auto.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
