import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { CheckCircle2, AlertTriangle, Zap, BarChart3, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PLAN_LIMITS: Record<string, number> = {
    FREE: 20,
    PRO: 200,
    PREMIUM: 1000,
};

const PLAN_LABELS: Record<string, string> = {
    FREE: "Gratuito",
    PRO: "Pro",
    PREMIUM: "Premium",
};

export default async function UsagePage() {
    const session = await getServerSession(authOptions);
    const plan = session?.user?.plan ?? "FREE";
    const limit = PLAN_LIMITS[plan];

    const totalTasks = await prisma.task.count();
    const used = Math.min(totalTasks, limit);
    const remaining = Math.max(limit - used, 0);
    const percentage = Math.round((used / limit) * 100);

    const recentTasks = await prisma.task.findMany({
        orderBy: { generatedAt: "desc" },
        take: 5,
        select: { id: true, theme: true, targetLevel: true, generatedAt: true },
    });

    const byLevel = await prisma.task.groupBy({
        by: ["targetLevel"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
    });

    const statusColor =
        percentage >= 90 ? "text-red-600" :
        percentage >= 70 ? "text-yellow-600" :
        "text-green-600";

    const barColor =
        percentage >= 90 ? "bg-red-500" :
        percentage >= 70 ? "bg-yellow-500" :
        "bg-blue-500";

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Consumo de Tarefas</h1>
                <p className="text-gray-500">Acompanhe seu uso no plano <span className="font-semibold text-blue-600">{PLAN_LABELS[plan]}</span>.</p>
            </div>

            {/* Main usage card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        <span className="font-semibold text-gray-800">Uso do Plano</span>
                    </div>
                    <span className={`text-2xl font-extrabold ${statusColor}`}>
                        {percentage}%
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-6">
                    <span>{used} tarefas usadas</span>
                    <span>{limit} tarefas no plano</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-blue-600">{used}</p>
                        <p className="text-xs text-gray-500 mt-1">Utilizadas</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-green-600">{remaining}</p>
                        <p className="text-xs text-gray-500 mt-1">Restantes</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-gray-700">{limit}</p>
                        <p className="text-xs text-gray-500 mt-1">Limite do Plano</p>
                    </div>
                </div>

                {/* Alerts */}
                {percentage >= 90 && (
                    <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                        <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-700">Limite quase atingido</p>
                            <p className="text-xs text-red-500 mt-0.5">Você usou {percentage}% do seu plano. Faça upgrade para continuar criando tarefas.</p>
                        </div>
                    </div>
                )}
                {percentage >= 70 && percentage < 90 && (
                    <div className="mt-5 flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-700">Atenção ao consumo</p>
                            <p className="text-xs text-yellow-600 mt-0.5">Você já utilizou {percentage}% do seu plano. Considere fazer upgrade em breve.</p>
                        </div>
                    </div>
                )}
                {percentage < 70 && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 size={16} />
                        <span>Consumo saudável — você ainda tem bastante espaço.</span>
                    </div>
                )}
            </div>

            {/* Usage by level */}
            {byLevel.length > 0 && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <BookOpen size={18} className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Tarefas por Nível CEFR</h2>
                    </div>
                    <div className="space-y-3">
                        {byLevel.map((item) => {
                            const levelPct = Math.round((item._count.id / used) * 100);
                            return (
                                <div key={item.targetLevel}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{item.targetLevel}</span>
                                        <span className="text-gray-400">{item._count.id} tarefas ({levelPct}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="h-2 rounded-full bg-blue-400" style={{ width: `${levelPct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent tasks */}
            {recentTasks.length > 0 && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock size={18} className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Tarefas Recentes</h2>
                    </div>
                    <div className="space-y-3">
                        {recentTasks.map((t) => (
                            <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{t.theme}</p>
                                    <p className="text-xs text-gray-400">Nível {t.targetLevel}</p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {new Date(t.generatedAt).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upgrade CTA */}
            {plan !== "PREMIUM" && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between">
                    <div>
                        <p className="font-bold text-lg">Precisa de mais tarefas?</p>
                        <p className="text-blue-100 text-sm mt-1">
                            {plan === "FREE" ? "Upgrade para Pro e gere até 200 tarefas." : "Upgrade para Premium e gere até 1.000 tarefas."}
                        </p>
                    </div>
                    <Link href="/admin/plans">
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold gap-2 shrink-0">
                            <Zap size={15} />
                            Fazer Upgrade
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
