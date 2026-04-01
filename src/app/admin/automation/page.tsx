"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Play, CalendarClock, RefreshCw, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AutomationPage() {
    const toast = useToast();
    const [automations, setAutomations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [cronRunning, setCronRunning] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [newAuto, setNewAuto] = useState({
        theme: "", level: "A1", dayOfWeek: "1", timeOfDay: "09:00", active: true,
    });

    useEffect(() => { fetchAutomations(); }, []);

    const fetchAutomations = async () => {
        const res = await fetch("/api/automation");
        if (res.ok) setAutomations(await res.json());
    };

    const handleCreate = async () => {
        if (!newAuto.theme) return;
        setCreating(true);
        try {
            const res = await fetch("/api/automation", {
                method: "POST",
                body: JSON.stringify(newAuto),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                toast.success("Automação criada com sucesso!");
                setNewAuto({ theme: "", level: "A1", dayOfWeek: "1", timeOfDay: "09:00", active: true });
                fetchAutomations();
            } else {
                toast.error("Erro ao criar automação");
            }
        } catch {
            toast.error("Erro ao criar automação");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/automation?id=${id}`, { method: "DELETE" });
        setConfirmDeleteId(null);
        toast.info("Automação removida.");
        fetchAutomations();
    };

    const handleRunNow = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/automation/run", {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Tarefa gerada: ${data.task.theme} — ${data.studentsAssigned} aluno(s) notificado(s)`);
                fetchAutomations();
            } else {
                toast.error("Erro ao rodar automação: " + data.error);
            }
        } catch {
            toast.error("Erro ao executar");
        } finally {
            setLoading(false);
        }
    };

    const handleRunCron = async () => {
        setCronRunning(true);
        try {
            const res = await fetch("/api/cron");
            const data = await res.json();
            if (res.ok) {
                if (data.ran === 0) {
                    toast.info("Nenhuma automação vencida no momento.");
                } else {
                    toast.success(`Cron executado: ${data.ran} automação(ões) processada(s).`);
                    fetchAutomations();
                }
            } else {
                toast.error("Erro ao executar cron.");
            }
        } catch {
            toast.error("Erro ao executar cron.");
        } finally {
            setCronRunning(false);
        }
    };

    const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Automação de Tarefas</h1>
                    <p className="text-gray-500 mt-1">Configure regras para gerar e distribuir tarefas automaticamente.</p>
                </div>
                <Button variant="outline" onClick={handleRunCron} disabled={cronRunning} className="gap-2 shrink-0">
                    <RefreshCw size={15} className={cronRunning ? "animate-spin" : ""} />
                    {cronRunning ? "Processando..." : "Rodar Cron Agora"}
                </Button>
            </div>

            {/* Cron info banner */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                <CalendarClock size={16} className="mt-0.5 shrink-0" />
                <div>
                    <strong>Como funciona o cron:</strong> Em produção (Vercel), o endpoint <code className="bg-blue-100 px-1 rounded">/api/cron</code> é chamado automaticamente a cada hora. Ele verifica quais automações estão vencidas e executa cada uma, gerando tarefas via IA e notificando os alunos.
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Create Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader><CardTitle>Nova Regra</CardTitle></CardHeader>
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
                            <Select value={newAuto.level} onValueChange={(v) => setNewAuto({ ...newAuto, level: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["A1", "A2", "B1", "B2", "C1", "C2"].map(l => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dia</label>
                                <Select value={String(newAuto.dayOfWeek)} onValueChange={(v) => setNewAuto({ ...newAuto, dayOfWeek: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <CardHeader><CardTitle>Regras Ativas</CardTitle></CardHeader>
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
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                                            Nenhuma automação configurada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    automations.map((auto) => {
                                        const isOverdue = new Date(auto.nextRun) <= new Date();
                                        return (
                                            <TableRow key={auto.id}>
                                                <TableCell className="font-medium">{auto.theme}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{auto.level}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarClock className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
                                                        <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                                                            {DAYS[auto.dayOfWeek]}s às {auto.timeOfDay}
                                                        </span>
                                                        {isOverdue && (
                                                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                                                vencida
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5 ml-6">
                                                        {new Date(auto.nextRun).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {confirmDeleteId === auto.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                <AlertTriangle size={12} className="text-yellow-500" /> Confirmar?
                                                            </span>
                                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(auto.id)}>Sim</Button>
                                                            <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(null)}>Não</Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button size="sm" variant="outline" disabled={loading} onClick={() => handleRunNow(auto.id)} title="Executar agora">
                                                                <Play className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="destructive" onClick={() => setConfirmDeleteId(auto.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
