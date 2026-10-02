import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LoginSearch = { app?: "cuida" | "vigia" };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    app: search.app === "vigia" ? "vigia" : "cuida",
  }),
  component: Login,
});

const CUIDA_URL = import.meta.env.VITE_CUIDA_URL ?? "http://localhost:8081";
const VIGIA_URL = import.meta.env.VITE_VIGIA_URL ?? "http://localhost:8082";
// A autenticação sempre acontece contra a API do Cuida — é a única fonte de
// identidade/cadastro compartilhada pelos dois sistemas.
const CUIDA_API_URL = import.meta.env.VITE_CUIDA_API_URL ?? "http://localhost:3333/api";

const destinos = {
  cuida: { label: "Cuida — Medicamentos", url: CUIDA_URL },
  vigia: { label: "Vigia — Transporte em saúde", url: VIGIA_URL },
};

function Login() {
  const { app = "cuida" } = useSearch({ from: "/login" });
  const navigate = useNavigate();
  const destino = destinos[app];

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${CUIDA_API_URL}/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, password }),
      });
      if (!res.ok) throw new Error("Credenciais inválidas");
      const data = await res.json();

      // Login único, sem JWT: id/nome do Cuida são encaminhados via redirect
      // completo de página para o app de destino escolhido.
      const params = new URLSearchParams({
        id: String(data.id ?? ""),
        nome: data.nome ?? "",
      });
      window.location.href = `${destino.url}/auth/callback?${params.toString()}`;
    } catch {
      setError("CPF ou senha inválidos.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-soft to-background px-4">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
        >
          <ArrowLeft className="size-4" /> Voltar ao início
        </Link>

        <Card className="border-border shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Heart className="size-6" />
            </div>
            <CardTitle className="text-brand-deep">Acesso do cidadão</CardTitle>
            <CardDescription>
              Login único da Secretaria — você será encaminhado para{" "}
              <strong>{destino.label}</strong> depois de entrar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="cpf" className="text-sm font-medium text-foreground">
                  CPF
                </label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
                  required
                  className="border border-input"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-input"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full rounded-full">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Primeira vez aqui?{" "}
              <a
                href={`${CUIDA_URL}/clientes/cadastroClientes`}
                className="font-semibold text-primary hover:underline"
              >
                Cadastre-se
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
