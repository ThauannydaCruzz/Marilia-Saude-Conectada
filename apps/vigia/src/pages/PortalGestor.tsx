import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Ambulance, LogOut, LayoutDashboard, CalendarCheck, ArrowUp, ArrowDown,
  CheckCircle2, Clock, TrendingUp, Users, AlertTriangle, MapPin, HeartPulse
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoApp from "@/assets/logo.png";

type Agendamento = {
  id: string;
  paciente: string;
  hora: string;
  tipo: string;
  destino: string;
  prioridade: "alta" | "media" | "normal";
  motivoPrioridade?: string;
  status: "pendente" | "confirmado" | "concluido";
};

const initialAgendamentos: Agendamento[] = [
  { id: "1", paciente: "Maria da Silva", hora: "07:00", tipo: "Hemodiálise", destino: "Hospital das Clínicas", prioridade: "alta", motivoPrioridade: "Hemodiálise + Acamada", status: "confirmado" },
  { id: "2", paciente: "João Pereira", hora: "07:30", tipo: "Quimioterapia", destino: "Hospital do Câncer", prioridade: "alta", motivoPrioridade: "Oncologia", status: "confirmado" },
  { id: "3", paciente: "Ana Costa", hora: "08:00", tipo: "Consulta", destino: "UBS Vila Real", prioridade: "normal", status: "pendente" },
  { id: "4", paciente: "Carlos Souza", hora: "08:30", tipo: "Exame", destino: "Santa Casa", prioridade: "media", motivoPrioridade: "Cardiopatia", status: "pendente" },
  { id: "5", paciente: "Beatriz Lima", hora: "09:00", tipo: "Hemodiálise", destino: "Hospital das Clínicas", prioridade: "alta", motivoPrioridade: "Hemodiálise", status: "confirmado" },
  { id: "6", paciente: "Pedro Alves", hora: "09:30", tipo: "Retorno", destino: "UBS Centro", prioridade: "normal", status: "pendente" },
  { id: "7", paciente: "Lúcia Mendes", hora: "10:00", tipo: "Radioterapia", destino: "Hospital do Câncer", prioridade: "alta", motivoPrioridade: "Oncologia", status: "pendente" },
  { id: "8", paciente: "Roberto Dias", hora: "10:30", tipo: "Consulta", destino: "UPA Zona Sul", prioridade: "normal", status: "pendente" },
];

const prioridadeColors = {
  alta: "border-destructive/40 bg-destructive/5",
  media: "border-accent/50 bg-accent/5",
  normal: "border-border/50 bg-background",
};

const PortalGestor = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(initialAgendamentos);

  const move = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= agendamentos.length) return;
    const next = [...agendamentos];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    // Reatribui horários conforme nova sequência
    const horas = initialAgendamentos.map(a => a.hora);
    next.forEach((a, i) => (a.hora = horas[i]));
    setAgendamentos(next);
  };

  const confirmar = (id: string) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: "confirmado" } : a));
    toast.success("Agendamento confirmado");
  };

  const confirmarEscala = () => toast.success("Escala do dia confirmada e publicada");
  const handleLogout = () => navigate("/");

  const total = agendamentos.length;
  const confirmados = agendamentos.filter(a => a.status === "confirmado").length;
  const altaPrioridade = agendamentos.filter(a => a.prioridade === "alta").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/5 relative overflow-x-hidden">
      
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={logoApp} 
          alt="" 
          className="w-[900px] h-[900px] object-contain opacity-[0.03] grayscale brightness-125 select-none"
        />
      </div>

      <header className="bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoApp} 
                  alt="Logo VIGIA" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div>
                <h1 className="text-lg font-bold text-foreground font-poppins">VIGIA — Portal do Gestor</h1>
                <p className="text-xs text-muted-foreground">Secretaria de Saúde • Marília/SP</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="escala" className="gap-2"><CalendarCheck className="w-4 h-4" /> Escala do Dia</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: CalendarCheck, label: "Agendamentos hoje", value: total, color: "primary" },
                { icon: CheckCircle2, label: "Confirmados", value: confirmados, color: "secondary" },
                { icon: AlertTriangle, label: "Alta prioridade", value: altaPrioridade, color: "destructive" },
                { icon: TrendingUp, label: "Taxa de ocupação", value: "87%", color: "accent" },
              ].map((s, i) => (
                <Card key={i} className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${s.color}/10 border border-${s.color}/20`}>
                      <s.icon className={`w-6 h-6 text-${s.color}`} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
                      <div className="text-2xl font-bold text-foreground font-poppins">{s.value}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Users className="w-5 h-5 text-primary" /> Próximos transportes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agendamentos.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold font-poppins text-primary min-w-[60px]">{a.hora}</div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{a.paciente}</div>
                          <div className="text-xs text-muted-foreground">{a.tipo} • {a.destino}</div>
                        </div>
                      </div>
                      {a.prioridade === "alta" && <Badge variant="destructive">Prioridade</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <TrendingUp className="w-5 h-5 text-secondary" /> Resumo da semana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { dia: "Segunda", total: 18 }, { dia: "Terça", total: 24 },
                      { dia: "Quarta", total: 21 }, { dia: "Quinta", total: 27 },
                      { dia: "Sexta", total: 19 },
                    ].map((d) => (
                      <div key={d.dia} className="flex items-center gap-3">
                        <div className="text-sm font-medium text-foreground w-20">{d.dia}</div>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${(d.total / 30) * 100}%` }} />
                        </div>
                        <div className="text-sm font-semibold text-foreground w-10 text-right">{d.total}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="escala" className="space-y-6">
            <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <CalendarCheck className="w-5 h-5 text-primary" /> Escala do dia — reorganize a sequência
                </CardTitle>
                <Button onClick={confirmarEscala} className="bg-gradient-primary text-white hover:opacity-90 rounded-xl gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Confirmar escala
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use as setas para mover os agendamentos para cima ou para baixo. Os horários são reatribuídos automaticamente conforme a nova sequência.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agendamentos.map((a, idx) => (
                    <div
                      key={a.id}
                      className={`rounded-2xl border-2 p-4 transition-all ${prioridadeColors[a.prioridade]} hover:shadow-lg`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xl font-bold font-poppins text-foreground">{a.hora}</div>
                            <div className="text-xs text-muted-foreground">#{idx + 1} na fila</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(idx, -1)} disabled={idx === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(idx, 1)} disabled={idx === agendamentos.length - 1}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-semibold text-foreground">{a.paciente}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Ambulance className="w-4 h-4" /> {a.tipo}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {a.destino}
                        </div>
                        {a.motivoPrioridade && (
                          <div className="flex items-center gap-2 text-xs text-destructive font-medium">
                            <HeartPulse className="w-3 h-3" /> {a.motivoPrioridade}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <Badge variant={a.prioridade === "alta" ? "destructive" : a.prioridade === "media" ? "default" : "secondary"}>
                          {a.prioridade === "alta" ? "Alta prioridade" : a.prioridade === "media" ? "Média" : "Normal"}
                        </Badge>
                        {a.status === "confirmado" ? (
                          <Badge variant="outline" className="gap-1 border-secondary/40 text-secondary">
                            <CheckCircle2 className="w-3 h-3" /> Confirmado
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => confirmar(a.id)}>
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PortalGestor;