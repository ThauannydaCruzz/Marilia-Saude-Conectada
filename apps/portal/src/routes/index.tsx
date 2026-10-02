import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ambulance,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Hospital,
  Pill,
  Search,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Secretaria Municipal da Saúde de Marília" },
      {
        name: "description",
        content:
          "Portal da Secretaria Municipal da Saúde de Marília: encontre medicamentos nas unidades (Cuida) e agende transporte em saúde (Vigia).",
      },
      { property: "og:title", content: "Secretaria Municipal da Saúde de Marília" },
      {
        property: "og:description",
        content:
          "Serviços digitais de saúde de Marília: busca de medicamentos por unidade e agendamento de ambulâncias por prioridade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portal,
});

// Login único: os cards levam para a tela de login do próprio portal,
// que autentica contra o Cuida e encaminha para o app escolhido.
const servicos = [
  {
    icon: Pill,
    title: "Cuida — Medicamentos",
    text: "Localize medicamentos disponíveis em cada unidade e farmácia municipal.",
    app: "cuida" as const,
    cta: "Encontrar medicamentos",
    accent: "bg-brand-soft text-brand-deep",
  },
  {
    icon: Ambulance,
    title: "Vigia — Transporte em saúde",
    text: "Solicite e acompanhe o agendamento de ambulâncias conforme a prioridade clínica.",
    app: "vigia" as const,
    cta: "Agendar transporte",
    accent: "bg-success-soft text-accent-foreground",
  },
];

const informacoes = [
  {
    icon: Hospital,
    title: "Unidades de saúde",
    text: "UBS, USF, UPA e Farmácia Municipal com endereços, telefones e horários de atendimento.",
  },
  {
    icon: Syringe,
    title: "Vacinação",
    text: "Calendário vacinal e campanhas sazonais realizadas nas unidades do município.",
  },
  {
    icon: ClipboardList,
    title: "Cartão SUS e cadastro",
    text: "Mantenha seus dados atualizados para agilizar atendimentos e retirada de medicamentos.",
  },
  {
    icon: CalendarClock,
    title: "Atendimento",
    text: "Segunda a sexta, das 7h às 17h nas unidades básicas. UPA Zona Norte 24 horas.",
  },
];

function Portal() {
  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />

      <main>
        <section className="border-b border-border bg-gradient-to-b from-brand-soft to-background">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium text-brand-deep shadow-sm">
                <ShieldCheck className="size-4 text-primary" /> Serviços digitais oficiais
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight text-brand-deep md:text-5xl">
                Saúde de Marília, mais perto de você
              </h1>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Encontre seus medicamentos nas unidades da cidade e agende o transporte em saúde
                em um só lugar.
              </p>

              <div className="mt-7 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-background p-2 shadow-sm">
                <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
                <Input
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  placeholder="O que você procura? Ex.: Dipirona, UBS Central, ambulância"
                  aria-label="Buscar serviços da Secretaria"
                />
                <Button asChild className="rounded-full">
                  <Link to="/auth">Buscar</Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/login" search={{ app: "cuida" }}>
                    Encontre medicamentos <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/login" search={{ app: "vigia" }}>
                    Agende seu transporte em saúde
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-brand-deep">Serviços ao cidadão</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu CPF para acessar suas informações e usar as ferramentas.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {servicos.map((s) => (
              <Card key={s.title} className="border-border shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <span className={`flex size-12 items-center justify-center rounded-2xl ${s.accent}`}>
                    <s.icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                  {/* Login único: leva pra tela de login do portal, que autentica
                      no Cuida e encaminha pro app escolhido depois de entrar. */}
                  <Button asChild className="mt-auto w-fit rounded-full">
                    <Link to="/login" search={{ app: s.app }}>
                      {s.cta} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="secretaria" className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold text-brand-deep">A Secretaria</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              A Secretaria Municipal da Saúde coordena a rede de atenção básica, urgência,
              assistência farmacêutica e transporte em saúde de Marília, garantindo acesso
              organizado e humanizado aos serviços do SUS.
            </p>
            <div id="unidades" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {informacoes.map((i) => (
                <Card key={i.title} className="border-border bg-background shadow-sm">
                  <CardContent className="space-y-3 p-5">
                    <i.icon className="size-6 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">{i.title}</h3>
                    <p className="text-sm text-muted-foreground">{i.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Os textos institucionais e horários acima são provisórios e precisam de confirmação
              oficial da Secretaria.
            </p>
          </div>
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
