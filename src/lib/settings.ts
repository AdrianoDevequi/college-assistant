import prisma from "@/lib/prisma";

export const SETTINGS_KEYS = {
    GEMINI_API_KEY: "GEMINI_API_KEY",
    EVOLUTION_API_URL: "EVOLUTION_API_URL",
    EVOLUTION_API_KEY: "EVOLUTION_API_KEY",
    EVOLUTION_INSTANCE_NAME: "EVOLUTION_INSTANCE_NAME",
};

export async function getSetting(key: string): Promise<string | undefined> {
    try {
        // 1. Try DB
        // @ts-expect-error - SystemSettings might not be generated yet
        const setting = await prisma.systemSettings.findUnique({
            where: { key },
        });
        if (setting?.value) return setting.value;
    } catch (e) {
        // Fallback or DB error (migration not run)
        console.warn(`[Settings] Failed to fetch key ${key} from DB`, e);
    }

    // 2. Fallback to Env
    return process.env[key];
}

export async function setSetting(key: string, value: string) {
    // @ts-expect-error - Prisma client type mismatch
    return prisma.systemSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
}
