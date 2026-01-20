"use client";

import { useState } from "react";
import { generateTaskContent } from "@/app/actions/ai";
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function TaskGeneratorPage() {
    const [loading, setLoading] = useState(false);
    const [generatedTask, setGeneratedTask] = useState<any>(null); // Ideally typed
    const [formData, setFormData] = useState({
        theme: "",
        level: "A2",
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateTaskContent(formData.theme, formData.level);
            setGeneratedTask(result);
        } catch (error) {
            alert("Erro ao gerar tarefa. Verifique se a API Key está configurada.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndDistribute = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                body: JSON.stringify({
                    theme: formData.theme,
                    level: formData.level,
                    content: JSON.stringify(generatedTask),
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                alert("Tarefa salva e distribuída para os alunos compatíveis!");
                setGeneratedTask(null);
            } else {
                alert("Falha ao salvar e distribuir.");
            }
        } catch (e) {
            alert("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Gerar Nova Tarefa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tema / Tópico</Label>
                        <Input
                            placeholder="ex: Agronomia, Direito Empresarial"
                            value={formData.theme}
                            onChange={(e) =>
                                setFormData({ ...formData, theme: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Nível Alvo</Label>
                        <Select
                            value={formData.level}
                            onValueChange={(val) => setFormData({ ...formData, level: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                                    <SelectItem key={l} value={l}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        className="w-full"
                        disabled={loading || !formData.theme}
                    >
                        {loading ? "Processando..." : "Gerar com IA"}
                    </Button>
                </CardContent>
            </Card>

            {generatedTask && (
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Prévia: {generatedTask.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto space-y-4">
                        <p className="text-gray-600 italic">
                            {generatedTask.introduction}
                        </p>
                        <div className="prose bg-gray-50 p-4 rounded-md">
                            {generatedTask.content}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Prévia das Questões:</h4>
                            <ul className="list-disc pl-5">
                                {generatedTask.questions?.map((q: any, i: number) => (
                                    <li key={i}>{q.question}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSaveAndDistribute} disabled={loading}>
                            Salvar e Distribuir para Alunos {formData.level}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
