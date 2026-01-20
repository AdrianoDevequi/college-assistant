import { getSetting, SETTINGS_KEYS } from "@/lib/settings";

export async function sendWhatsAppMessage(phone: string, message: string) {
    const EVOLUTION_API_URL = await getSetting(SETTINGS_KEYS.EVOLUTION_API_URL);
    const EVOLUTION_API_KEY = await getSetting(SETTINGS_KEYS.EVOLUTION_API_KEY);
    const INSTANCE_NAME = await getSetting(SETTINGS_KEYS.EVOLUTION_INSTANCE_NAME) || "college_assistant";

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.warn("Evolution API credentials not set (DB or Env). Skipping message send.");
        return;
    }

    // 1. Format Phone Number (Add 55 if missing)
    let formattedPhone = phone.replace(/\D/g, ""); // Remove non-digits
    if (formattedPhone.length === 10 || formattedPhone.length === 11) {
        console.log(`[WhatsApp] Auto-formatting phone: ${formattedPhone} -> 55${formattedPhone}`);
        formattedPhone = "55" + formattedPhone;
    }

    try {
        const url = `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`;
        const payload = {
            number: formattedPhone, // Use formatted number
            options: {
                delay: 1200,
                presence: "composing",
                linkPreview: false,
            },
            text: message,
            textMessage: {
                text: message,
            },
        };

        console.log(`[WhatsApp] Sending to ${url}`);
        // console.log(`[WhatsApp] Payload:`, JSON.stringify(payload, null, 2));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": EVOLUTION_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[WhatsApp] Failed to send. Status: ${response.status}. Response: ${errorText}`);
            // Do not throw, just log.
            return null;
        }

        const data = await response.json();
        console.log(`[WhatsApp] Message sent successfully to ${formattedPhone}`);
        return data;

    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        // Don't crash the entire flow if messaging fails
        return null;
    }
}
