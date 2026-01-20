import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSetting, SETTINGS_KEYS } from "@/lib/settings";
import { updateSettings } from "@/app/actions/settings";

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const geminiKey = await getSetting(SETTINGS_KEYS.GEMINI_API_KEY);
    const evoUrl = await getSetting(SETTINGS_KEYS.EVOLUTION_API_URL);
    const evoKey = await getSetting(SETTINGS_KEYS.EVOLUTION_API_KEY);
    const evoInstance = await getSetting(SETTINGS_KEYS.EVOLUTION_INSTANCE_NAME);
    const success = searchParams?.success === "true";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Sucesso!</strong>
                    <span className="block sm:inline"> Configurações salvas com sucesso.</span>
                </div>
            )}

            <form action={updateSettings}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inteligência Artificial (Gemini)</CardTitle>
                            <CardDescription>
                                Configuração da API do Google Gemini para geração de conteúdo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="GEMINI_API_KEY">API Key</Label>
                                <Input
                                    id="GEMINI_API_KEY"
                                    name="GEMINI_API_KEY"
                                    type="password"
                                    placeholder="AIza..."
                                    defaultValue={geminiKey}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notificações (WhatsApp)</CardTitle>
                            <CardDescription>
                                Configuração da Evolution API para envio de mensagens via WhatsApp.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="EVOLUTION_API_URL">URL da API</Label>
                                <Input
                                    id="EVOLUTION_API_URL"
                                    name="EVOLUTION_API_URL"
                                    placeholder="https://api.evolution..."
                                    defaultValue={evoUrl}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="EVOLUTION_API_KEY">API Key (Global)</Label>
                                <Input
                                    id="EVOLUTION_API_KEY"
                                    name="EVOLUTION_API_KEY"
                                    type="password"
                                    defaultValue={evoKey}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="EVOLUTION_INSTANCE_NAME">Nome da Instância</Label>
                                <Input
                                    id="EVOLUTION_INSTANCE_NAME"
                                    name="EVOLUTION_INSTANCE_NAME"
                                    placeholder="college_assistant"
                                    defaultValue={evoInstance}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit">Salvar Configurações</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
