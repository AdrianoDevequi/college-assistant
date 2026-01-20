"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { completeTaskAction } from "./actions"; // We'll move the server action here or create a new one

export default function TaskQuestions({ content, assignmentId, initialStatus, initialAnswers, rawAnswers }: { content: any, assignmentId: string, initialStatus: string, initialAnswers?: any, rawAnswers?: string | null }) {

    // Fallback: If initialAnswers is missing, try to parse rawAnswers
    const parsedAnswers = initialAnswers || (rawAnswers ? JSON.parse(rawAnswers) : {});

    // Normalize initial answers to string keys
    const normalizedAnswers = parsedAnswers ? Object.keys(parsedAnswers).reduce((acc: any, key) => {
        acc[String(key)] = parsedAnswers[key];
        return acc;
    }, {}) : {};

    const [answers, setAnswers] = useState<Record<string, string>>(normalizedAnswers);
    const [submitting, setSubmitting] = useState(false);

    const handleSelect = (questionIndex: number, option: string) => {
        if (initialStatus === "COMPLETED") return;
        setAnswers(prev => ({ ...prev, [String(questionIndex)]: option }));
    };

    const isFormValid = content.questions?.length > 0 &&
        content.questions.every((_: any, i: number) => answers[String(i)]);

    const handleSubmit = async () => {
        if (!isFormValid) {
            alert("Por favor, responda todas as perguntas antes de enviar.");
            return;
        }

        setSubmitting(true);
        try {
            await completeTaskAction(assignmentId, answers);
            // Redirect via client router or hard navigation
            window.location.href = "/student/tasks";
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar respostas.");
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Questões</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {content.questions?.map((q: any, i: number) => (
                        <div key={i} className="p-4 border rounded bg-white">
                            <p className="font-semibold mb-4 text-lg">{i + 1}. {q.question}</p>

                            <RadioGroup
                                value={answers[String(i)]}
                                onValueChange={(val) => handleSelect(i, val)}
                                disabled={initialStatus === "COMPLETED"}
                            >
                                {q.options?.map((opt: string, j: number) => (
                                    <div key={j} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                                        <RadioGroupItem value={opt} id={`q${i}-opt${j}`} />
                                        <Label htmlFor={`q${i}-opt${j}`} className="flex-1 cursor-pointer font-normal text-base">
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            {initialStatus === "COMPLETED" && (
                                <div className="mt-4 space-y-2">
                                    {(() => {
                                        const userAnswer = answers[String(i)];
                                        const isCorrect = userAnswer === q.answer;
                                        const boxClass = isCorrect
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200";

                                        return (
                                            <div className={`p-3 rounded border ${boxClass}`}>
                                                <strong>Sua Resposta:</strong> {userAnswer || <span className="font-bold">Não respondida</span>}
                                            </div>
                                        );
                                    })()}

                                    <div className="p-3 bg-blue-50 text-blue-800 rounded border border-blue-200">
                                        <strong>Gabarito:</strong> {q.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {initialStatus !== "COMPLETED" && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        size="lg"
                        className={`bg-green-600 hover:bg-green-700 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={submitting || !isFormValid}
                    >
                        {submitting ? "Enviando..." : "Enviar Respostas e Concluir"}
                    </Button>
                </div>
            )}
        </div>
    );
}
