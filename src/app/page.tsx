import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Brain,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    if (session.user.role === "ADMIN") redirect("/admin/dashboard");
    else if (session.user.role === "STUDENT") redirect("/student/tasks");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b bg-white/90 backdrop-blur">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <BookOpen />
          <span>Language Assistant</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#funcionalidades" className="hover:text-blue-600 transition">Funcionalidades</a>
          <a href="#como-funciona" className="hover:text-blue-600 transition">Como Funciona</a>
          <a href="#planos" className="hover:text-blue-600 transition">Planos</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        </nav>
        <div className="flex gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/auth/signin">
            <Button>Começar Grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-blue-50 to-white">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full mb-6">
          🚀 Inteligência Artificial a serviço do seu aprendizado
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          Aprenda Inglês do Jeito <br />
          <span className="text-blue-600">Certo para Sua Carreira</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Exercícios de inglês gerados por IA, adaptados ao seu nível CEFR e à sua área acadêmica.
          De Agronomia a Direito — conteúdo que faz sentido para você.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="px-10 text-base">
              Começar Grátis
            </Button>
          </Link>
          <Link href="#planos">
            <Button size="lg" variant="outline" className="px-10 text-base">
              Ver Planos
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-5">Sem cartão de crédito • Plano gratuito para sempre</p>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { value: "A1–C2", label: "Todos os Níveis CEFR" },
            { value: "20+", label: "Áreas Acadêmicas" },
            { value: "100%", label: "Conteúdo com IA" },
            { value: "WhatsApp", label: "Notificações Instantâneas" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-blue-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tudo que você precisa para ensinar inglês</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Uma plataforma completa para professores criarem e distribuírem exercícios personalizados com IA.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain size={28} />,
              color: "blue",
              title: "IA com Gemini",
              desc: "Textos e questionários gerados automaticamente pelo Google Gemini, contextualizados para cada tema e nível acadêmico.",
            },
            {
              icon: <GraduationCap size={28} />,
              color: "green",
              title: "Conteúdo Sob Medida",
              desc: "Exercícios específicos por nível CEFR (A1–C2) e área acadêmica: Agronomia, Direito, Negócios, Medicina e muito mais.",
            },
            {
              icon: <MessageCircle size={28} />,
              color: "purple",
              title: "Notificações WhatsApp",
              desc: "Alunos recebem alertas no WhatsApp assim que uma nova tarefa é atribuída, com link direto para o exercício.",
            },
            {
              icon: <Zap size={28} />,
              color: "yellow",
              title: "Distribuição Automática",
              desc: "Distribua tarefas para todos os alunos de um nível com um clique. Automação via cron job disponível nos planos pagos.",
            },
            {
              icon: <Users size={28} />,
              color: "pink",
              title: "Gestão de Alunos",
              desc: "Cadastre alunos, defina seus níveis e acompanhe o progresso de cada um em um painel centralizado.",
            },
            {
              icon: <BarChart3 size={28} />,
              color: "indigo",
              title: "Histórico e Relatórios",
              desc: "Acompanhe quais tarefas foram concluídas, respostas enviadas e o desempenho geral da turma.",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
              <div className={`p-3 bg-${f.color}-100 rounded-xl mb-4 text-${f.color}-600 w-fit`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-blue-50 px-6">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
          <p className="text-gray-500">Em 3 passos simples, seus alunos já estão praticando inglês.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Crie a Tarefa", desc: "Escolha o tema e o nível CEFR. A IA gera um texto e perguntas em segundos." },
            { step: "2", title: "Distribua", desc: "Publique para todos os alunos do nível automaticamente ou selecione manualmente." },
            { step: "3", title: "Acompanhe", desc: "Alunos respondem na plataforma. Você vê o progresso em tempo real no painel." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
          <p className="text-gray-500">Comece grátis e escale conforme sua necessidade.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="flex flex-col p-8 border rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Gratuito</h3>
            <p className="text-gray-400 text-sm mb-6">Para começar a explorar</p>
            <p className="text-5xl font-extrabold text-gray-900 mb-1">R$0</p>
            <p className="text-gray-400 text-sm mb-8">para sempre</p>
            <ul className="space-y-3 mb-10 flex-1">
              {["Até 20 tarefas criadas", "Níveis A1–C2", "Portal do aluno", "Feedback automático"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" /> {i}
                </li>
              ))}
            </ul>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">Começar Grátis</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="flex flex-col p-8 border-2 border-blue-600 rounded-2xl shadow-lg relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              MAIS POPULAR
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
            <p className="text-gray-400 text-sm mb-6">Para professores ativos</p>
            <p className="text-5xl font-extrabold text-gray-900 mb-1">R$100</p>
            <p className="text-gray-400 text-sm mb-8">por mês</p>
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "Até 200 tarefas criadas",
                "Tudo do plano Gratuito",
                "Automação de tarefas",
                "Notificações WhatsApp",
                "Histórico completo",
                "Suporte prioritário",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" /> {i}
                </li>
              ))}
            </ul>
            <Link href="/auth/signin">
              <Button className="w-full">Assinar Pro</Button>
            </Link>
          </div>

          {/* Premium */}
          <div className="flex flex-col p-8 border rounded-2xl shadow-sm bg-gray-900 text-white">
            <h3 className="text-xl font-bold mb-1">Premium</h3>
            <p className="text-gray-400 text-sm mb-6">Para instituições e escolas</p>
            <p className="text-5xl font-extrabold mb-1">R$300</p>
            <p className="text-gray-400 text-sm mb-8">por mês</p>
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "Até 1.000 tarefas criadas",
                "Tudo do plano Pro",
                "Múltiplos professores",
                "API de integração",
                "Relatórios avançados",
                "Suporte dedicado",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> {i}
                </li>
              ))}
            </ul>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full text-gray-900 bg-white hover:bg-gray-100 border-white">
                Assinar Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-14">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {
                q: "Preciso ter conhecimento técnico para usar?",
                a: "Não. A plataforma foi pensada para professores. Basta escolher o tema e o nível — a IA cuida do resto.",
              },
              {
                q: "Os exercícios são gerados em tempo real?",
                a: "Sim. Cada tarefa é gerada pelo Google Gemini no momento da criação, garantindo conteúdo único e atualizado.",
              },
              {
                q: "O limite de tarefas é por mês ou no total?",
                a: "O limite é sobre o total de tarefas já criadas na plataforma. No plano Ilimitado não há restrições.",
              },
              {
                q: "Como funciona o WhatsApp?",
                a: "Integramos com a Evolution API. Ao publicar uma tarefa, os alunos recebem uma mensagem automática com o link direto.",
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim. Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento pelo painel.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white border rounded-xl p-6 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Pronto para transformar suas aulas?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Comece gratuitamente hoje. Sem cartão de crédito. Configure em menos de 5 minutos.
        </p>
        <Link href="/auth/signin">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 text-base font-bold">
            Criar Conta Grátis
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 border-t text-sm">
        <p>&copy; {new Date().getFullYear()} Language Assistant. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
