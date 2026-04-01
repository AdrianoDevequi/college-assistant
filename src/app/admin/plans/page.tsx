import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PLANS = [
    {
        key: "FREE",
        name: "Gratuito",
        price: "R$0",
        period: "para sempre",
        color: "border-gray-200",
        badgeColor: "bg-gray-100 text-gray-600",
        features: ["Até 20 tarefas criadas", "Níveis A1–C2", "Portal do aluno", "Feedback automático"],
        cta: null,
    },
    {
        key: "PRO",
        name: "Pro",
        price: "R$100",
        period: "por mês",
        color: "border-blue-500",
        badgeColor: "bg-blue-100 text-blue-700",
        features: ["Até 200 tarefas criadas", "Tudo do Gratuito", "Automação de tarefas", "Notificações WhatsApp", "Histórico completo", "Suporte prioritário"],
        cta: "Assinar Pro",
    },
    {
        key: "PREMIUM",
        name: "Premium",
        price: "R$300",
        period: "por mês",
        color: "border-yellow-400",
        badgeColor: "bg-yellow-100 text-yellow-700",
        features: ["Até 1.000 tarefas criadas", "Tudo do Pro", "Múltiplos professores", "API de integração", "Relatórios avançados", "Suporte dedicado"],
        cta: "Assinar Premium",
    },
];

export default async function PlansPage() {
    const session = await getServerSession(authOptions);
    const currentPlan = session?.user?.plan ?? "FREE";

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Planos & Assinatura</h1>
            <p className="text-gray-500 mb-8">
                Você está no plano{" "}
                <span className="font-semibold text-blue-600">
                    {PLANS.find((p) => p.key === currentPlan)?.name}
                </span>
                . Faça upgrade para desbloquear mais recursos.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                    const isActive = plan.key === currentPlan;
                    return (
                        <div
                            key={plan.key}
                            className={`flex flex-col p-6 rounded-2xl border-2 ${isActive ? plan.color + " shadow-lg" : "border-gray-200"} bg-white`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                                {isActive && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${plan.badgeColor}`}>
                                        Plano atual
                                    </span>
                                )}
                            </div>
                            <p className="text-4xl font-extrabold text-gray-900 mb-1">{plan.price}</p>
                            <p className="text-sm text-gray-400 mb-6">{plan.period}</p>

                            <ul className="space-y-2 mb-8 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {isActive ? (
                                <Button disabled variant="outline" className="w-full">
                                    Plano Atual
                                </Button>
                            ) : plan.cta ? (
                                <Button className="w-full gap-2">
                                    <Zap size={15} />
                                    {plan.cta}
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full" disabled>
                                    Plano Base
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 mt-8 text-center">
                Para gerenciar ou cancelar sua assinatura, entre em contato com o suporte.
            </p>
        </div>
    );
}
