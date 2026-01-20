"use server";

import { setSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSettings(formData: FormData) {
    const geminiKey = formData.get("GEMINI_API_KEY") as string;
    const evoUrl = formData.get("EVOLUTION_API_URL") as string;
    const evoKey = formData.get("EVOLUTION_API_KEY") as string;
    const evoInstance = formData.get("EVOLUTION_INSTANCE_NAME") as string;

    await setSetting("GEMINI_API_KEY", geminiKey || "");
    await setSetting("EVOLUTION_API_URL", evoUrl || "");
    await setSetting("EVOLUTION_API_KEY", evoKey || "");
    await setSetting("EVOLUTION_INSTANCE_NAME", evoInstance || "");

    revalidatePath("/admin/settings");
    redirect("/admin/settings?success=true");
}
