
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "college_assistant";

export async function sendWhatsAppMessage(phone: string, message: string) {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.warn("Evolution API credentials not set. Skipping message send.");
        console.log(`[MOCK SEND] To: ${phone}, Msg: ${message}`);
        return;
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": EVOLUTION_API_KEY,
            },
            body: JSON.stringify({
                number: phone,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: false,
                },
                textMessage: {
                    text: message,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Evolution API Error:", errorText);
            throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        // Don't crash the entire flow if messaging fails, but log it
    }
}
