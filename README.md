# College Assistant 🎓🤖

An AI-powered personalized English learning assistant designed for college students. This system allows administrators to generate tailored English exercises based on student proficiency levels (CEFR A1-C2) and specific academic themes (e.g., Agronomy, Business, Law), and automatically assigns them to students with WhatsApp notifications.

## 🚀 Features

### 👨‍🏫 Admin Dashboard
*   **Student Management**: Register and manage students, tracking their English level (A1-C2) and contact information.
*   **AI Task Generator**: Powered by **Google Gemini**, creating infinite personalized content.
    *   Select **Theme** (e.g., "Sustainable Agriculture", "Contract Law").
    *   Select **Level** (A1, A2, B1, B2, C1, C2).
    *   Review and edit generated content before publishing.
*   **Automatic Distribution**: Assigns tasks to all students matching the selected level.

### 🎓 Student Portal
*   **Personalized Feed**: Students see only tasks assigned to them.
*   **Interactive Learning**: Read texts and answer questions directly on the platform.
*   **Progress Tracking**: Mark tasks as completed and review correct answers.

### 📱 Integrations
*   **Google Gemini AI**: Generates contextually relevant reading passages and quizzes.
*   **Evolution API (WhatsApp)**: Sends instant notifications to students when a new task is available, including a direct link to the exercise.

## 🛠 Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
*   **Database**: MariaDB / MySQL (via [Prisma ORM](https://www.prisma.io/))
*   **Auth**: NextAuth.js (Credentials)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AdrianoDevequi/college-assistant.git
    cd college-assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Database
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

    # NextAuth
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"

    # Google Gemini AI
    GEMINI_API_KEY="your-gemini-api-key"

    # Evolution API (WhatsApp)
    EVOLUTION_API_URL="https://your-evolution-api.com"
    EVOLUTION_API_KEY="your-evolution-api-key"
    EVOLUTION_INSTANCE_NAME="college_assistant"
    ```

4.  **Setup Database**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

    *Tip: You can seed the database with an initial Admin user by running `npx tsx prisma/seed.ts` (Check `prisma/seed.ts` for default credentials).*

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

This project was built to demonstrate the power of Agentic AI in education tech. Feel free to submit Pull Requests!
