# College Assistant 🎓🤖

Um assistente pessoal de aprendizado de inglês impulsionado por IA, projetado para estudantes universitários. Este sistema permite que administradores gerem exercícios de inglês personalizados com base no nível de proficiência dos alunos (CEFR A1-C2) e temas acadêmicos específicos (ex: Agronomia, Direito, Negócios), atribuindo-os automaticamente aos alunos com notificações via WhatsApp.

## 🚀 Funcionalidades

### 👨‍🏫 Painel Administrativo
*   **Gestão de Alunos**: Cadastre e gerencie alunos, rastreando seu nível de inglês (A1-C2) e informações de contato.
*   **Gerador de Tarefas com IA**: Impulsionado pelo **Google Gemini**, criando conteúdo personalizado infinito.
    *   Selecione o **Tema** (ex: "Agricultura Sustentável", "Direito Contratual").
    *   Selecione o **Nível** (A1, A2, B1, B2, C1, C2).
    *   Revise e edite o conteúdo gerado antes de publicar.
*   **Distribuição Automática**: Atribui tarefas a todos os alunos que correspondem ao nível selecionado.

### 🎓 Portal do Aluno
*   **Feed Personalizado**: Os alunos veem apenas as tarefas atribuídas a eles.
*   **Aprendizado Interativo**: Leia textos e responda a perguntas diretamente na plataforma.
*   **Acompanhamento de Progresso**: Marque tarefas como concluídas e revise as respostas corretas.

### 📱 Integrações
*   **Google Gemini AI**: Gera textos de leitura e questionários contextualmente relevantes.
*   **Evolution API (WhatsApp)**: Envia notificações instantâneas aos alunos quando uma nova tarefa está disponível, incluindo um link direto para o exercício.

## 🛠 Tecnologias Utilizadas

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
*   **Banco de Dados**: MariaDB / MySQL (via [Prisma ORM](https://www.prisma.io/))
*   **Autenticação**: NextAuth.js (Credentials)

## 📦 Instalação e Configuração

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/AdrianoDevequi/college-assistant.git
    cd college-assistant
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente**
    Crie um arquivo `.env` no diretório raiz:
    ```env
    # Database
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

    # NextAuth
    NEXTAUTH_SECRET="sua-chave-secreta"
    NEXTAUTH_URL="http://localhost:3000"

    # Google Gemini AI
    GEMINI_API_KEY="sua-chave-api-gemini"

    # Evolution API (WhatsApp)
    EVOLUTION_API_URL="https://sua-evolution-api.com"
    EVOLUTION_API_KEY="sua-chave-api-evolution"
    EVOLUTION_INSTANCE_NAME="college_assistant"
    ```

4.  **Configurar Banco de Dados**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

    *Dica: Você pode popular o banco de dados com um usuário Admin inicial acessando `http://localhost:3000/api/setup` após iniciar o servidor.*

5.  **Rodar Servidor de Desenvolvimento**
    ```bash
    npm run dev
    ```

## 🤝 Contribuição

Este projeto foi construído para demonstrar o poder da IA Agêntica na tecnologia educacional. Sinta-se à vontade para enviar Pull Requests!
