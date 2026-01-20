import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {

    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard");

    } else if (session.user.role === "STUDENT") {
      redirect("/student/tasks");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <BookOpen />
          <span>CollegeAssistant</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/auth/signin">
            <Button>Começar Agora</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Aprendizado de Inglês Personalizado <br />
          <span className="text-blue-600">Potencializado por IA</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Melhorando as habilidades de inglês para estudantes universitários através de temas adaptados ao seu curso.
          De Agronomia a Direito, receba exercícios que importam para sua carreira.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button size="lg" className="px-8">
              Para Alunos
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline" className="px-8">
              Para Professores
            </Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 p-12 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Conteúdo Sob Medida</h3>
          <p className="text-gray-600">
            Exercícios gerados especificamente para seu nível CEFR e área acadêmica.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-green-100 rounded-full mb-4 text-green-600">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Prática Infinita</h3>
          <p className="text-gray-600">
            Nunca fique sem material. Nossa IA cria novas leituras e tarefas gramaticais instantaneamente.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-purple-100 rounded-full mb-4 text-purple-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Feedback Instantâneo</h3>
          <p className="text-gray-600">
            Complete tarefas online e receba notificações via WhatsApp para nunca perder uma lição.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t">
        <p>&copy; {new Date().getFullYear()} College Assistant. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
