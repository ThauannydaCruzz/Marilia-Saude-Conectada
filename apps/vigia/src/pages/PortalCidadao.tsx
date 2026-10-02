import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ambulance, LogOut, Calendar, User, Clock, MapPin, Check, HeartPulse, Accessibility } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoApp from "@/assets/logo.png";

type Slot = { id: string; time: string; available: boolean; tipo: string };

const generateSlotsForDate = (dateLabel: string): Slot[] => {
  const base = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
  return base.map((t, i) => ({
    id: `${dateLabel}-${t}`,
    time: t,
    available: Math.random() > 0.35,
    tipo: i % 3 === 0 ? "Hemodiálise" : i % 3 === 1 ? "Consulta/Exame" : "Tratamento oncológico",
  }));
};

const next7Days = () => {
  const out: { key: string; label: string; weekday: string; date: string }[] = [];
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : `${dias[d.getDay()]}`,
      weekday: dias[d.getDay()],
      date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return out;
};

const PortalCidadao = () => {
  const navigate = useNavigate();
  const days = next7Days();
  const [selectedDay, setSelectedDay] = useState(days[0].key);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [destino, setDestino] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [slotsByDay] = useState<Record<string, Slot[]>>(() => {
    const map: Record<string, Slot[]> = {};
    days.forEach(d => (map[d.key] = generateSlotsForDate(d.key)));
    return map;
  });

  const [perfil, setPerfil] = useState({
    nome: "Maria da Silva",
    cpf: "123.456.789-00",
    telefone: "(14) 99999-0000",
    endereco: "Rua das Flores, 100 - Centro, Marília/SP",
    contatoEmergencia: "João Silva - (14) 98888-1111",
    tipoSanguineo: "O+",
    mobilidade: "auxilio",
    necessitaAcompanhante: true,
    necessitaOxigenio: false,
    necessitaMaca: false,
    bariatrico: false,
    condicoesCriticas: ["Tratamento oncológico (câncer)"],
    alergias: "Dipirona",
    medicamentosUso: "Losartana 50mg, Metformina 850mg",
    comorbidades: "Hipertensão, Diabetes tipo 2",
  });

  const condicoesOpcoes = [
    "Tratamento oncológico (câncer)",
    "Hemodiálise",
    "Quimioterapia / Radioterapia",
    "Cardiopatia grave",
    "Doença pulmonar crônica (DPOC)",
    "Gestação de alto risco",
    "Pós-operatório recente",
    "Cuidados paliativos",
  ];

  const toggleCondicao = (cond: string) => {
    setPerfil(p => ({
      ...p,
      condicoesCriticas: p.condicoesCriticas.includes(cond)
        ? p.condicoesCriticas.filter(c => c !== cond)
        : [...p.condicoesCriticas, cond],
    }));
  };

  const handleLogout = () => navigate("/");

  const confirmarAgendamento = () => {
    if (!selectedSlot || !destino || !tipoConsulta) {
      toast.error("Preencha destino, tipo e selecione um horário");
      return;
    }
    toast.success("Agendamento solicitado! Você receberá confirmação no seu telefone.");
    setSelectedSlot(null);
  };

  const slots = slotsByDay[selectedDay] ?? [];
  const temPrioridade = perfil.condicoesCriticas.length > 0 || perfil.mobilidade === "acamado";

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
                <h1 className="text-lg font-bold text-foreground font-poppins">VIGIA — Portal do Cidadão</h1>
                <p className="text-xs text-muted-foreground">Agendamento de Ambulâncias • Marília/SP</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs defaultValue="agendar" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="agendar" className="gap-2"><Calendar className="w-4 h-4" /> Agendar</TabsTrigger>
            <TabsTrigger value="perfil" className="gap-2"><User className="w-4 h-4" /> Meu Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="agendar" className="space-y-6">
            {temPrioridade && (
              <Card className="border-2 border-destructive/30 bg-destructive/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-foreground">
                    <strong>Prioridade clínica ativa.</strong> Seu perfil tem condições críticas — você terá preferência nos slots disponíveis.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Calendar className="w-5 h-5 text-primary" /> Horários disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {days.map(d => (
                      <button
                        key={d.key}
                        onClick={() => { setSelectedDay(d.key); setSelectedSlot(null); }}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all min-w-[88px] ${
                          selectedDay === d.key
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border/50 bg-background/50 hover:border-primary/40"
                        }`}
                      >
                        <div className="text-xs font-semibold uppercase">{d.label}</div>
                        <div className="text-lg font-bold font-poppins">{d.date}</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map(slot => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            !slot.available
                              ? "border-border/30 bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
                              : isSelected
                                ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                                : "border-border/50 bg-background hover:border-primary/40 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg font-bold text-foreground font-poppins flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {slot.time}
                            </span>
                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{slot.tipo}</div>
                          {!slot.available && <div className="text-xs text-destructive mt-1">Indisponível</div>}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl h-fit lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Ambulance className="w-5 h-5 text-secondary" /> Detalhes do transporte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de atendimento *</Label>
                    <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                      <SelectTrigger className="h-11 rounded-xl border-2 border-border/50 bg-background/50">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta">Consulta médica</SelectItem>
                        <SelectItem value="exame">Exame</SelectItem>
                        <SelectItem value="hemodialise">Hemodiálise</SelectItem>
                        <SelectItem value="quimio">Quimioterapia</SelectItem>
                        <SelectItem value="radio">Radioterapia</SelectItem>
                        <SelectItem value="retorno">Retorno pós-cirúrgico</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino (unidade) *</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="destino"
                        value={destino}
                        onChange={e => setDestino(e.target.value)}
                        placeholder="Ex: Hospital das Clínicas"
                        className="h-11 pl-9 rounded-xl border-2 border-border/50 focus:border-primary bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="obs">Observações</Label>
                    <Textarea
                      id="obs"
                      value={observacoes}
                      onChange={e => setObservacoes(e.target.value)}
                      placeholder="Informações adicionais para a equipe"
                      className="min-h-[80px] rounded-xl border-2 border-border/50 focus:border-primary bg-background/50"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                    <div className="text-muted-foreground text-xs mb-1">Horário selecionado</div>
                    <div className="font-bold text-foreground font-poppins">
                      {selectedSlot ? selectedSlot.split("-").slice(-1)[0] + " — " + (days.find(d => d.key === selectedDay)?.date ?? "") : "Nenhum"}
                    </div>
                  </div>

                  <Button
                    onClick={confirmarAgendamento}
                    className="w-full bg-gradient-primary text-white hover:opacity-90 h-12 font-bold rounded-xl shadow-lg"
                  >
                    Confirmar agendamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <User className="w-5 h-5 text-primary" /> Dados pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={perfil.nome} onChange={e => setPerfil({ ...perfil, nome: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={perfil.cpf} disabled className="h-11 rounded-xl border-2 border-border/50 bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={perfil.telefone} onChange={e => setPerfil({ ...perfil, telefone: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo sanguíneo</Label>
                  <Input value={perfil.tipoSanguineo} onChange={e => setPerfil({ ...perfil, tipoSanguineo: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Endereço (origem do transporte)</Label>
                  <Input value={perfil.endereco} onChange={e => setPerfil({ ...perfil, endereco: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Contato de emergência</Label>
                  <Input value={perfil.contatoEmergencia} onChange={e => setPerfil({ ...perfil, contatoEmergencia: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <Accessibility className="w-5 h-5 text-secondary" /> Mobilidade e necessidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-sm">
                  <Label>Condição de mobilidade</Label>
                  <Select value={perfil.mobilidade} onValueChange={(v) => setPerfil({ ...perfil, mobilidade: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-2 border-border/50 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deambula">Anda sem ajuda</SelectItem>
                      <SelectItem value="auxilio">Anda com auxílio</SelectItem>
                      <SelectItem value="cadeirante">Cadeirante</SelectItem>
                      <SelectItem value="acamado">Acamado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "necessitaAcompanhante", label: "Necessita de acompanhante" },
                    { id: "necessitaOxigenio", label: "Uso contínuo de oxigênio" },
                    { id: "necessitaMaca", label: "Transporte exclusivo em maca" },
                    { id: "bariatrico", label: "Paciente bariátrico" },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 hover:border-secondary/40 cursor-pointer bg-background/30">
                      <Checkbox
                        checked={perfil[opt.id as keyof typeof perfil] as boolean}
                        onCheckedChange={(c) => setPerfil({ ...perfil, [opt.id]: !!c })}
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-destructive/20 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <HeartPulse className="w-5 h-5 text-destructive" /> Condições críticas
                  <Badge variant="destructive" className="ml-2">Define prioridade</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {condicoesOpcoes.map(cond => (
                  <label key={cond} className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 hover:border-destructive/40 cursor-pointer bg-background/30">
                    <Checkbox
                      checked={perfil.condicoesCriticas.includes(cond)}
                      onCheckedChange={() => toggleCondicao(cond)}
                    />
                    <span className="text-sm">{cond}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="font-poppins">Dados clínicos gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alergias</Label>
                  <Input value={perfil.alergias} onChange={e => setPerfil({ ...perfil, alergias: e.target.value })} className="h-11 rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Medicamentos de uso contínuo</Label>
                  <Textarea value={perfil.medicamentosUso} onChange={e => setPerfil({ ...perfil, medicamentosUso: e.target.value })} className="min-h-[80px] rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Comorbidades / diagnósticos</Label>
                  <Textarea value={perfil.comorbidades} onChange={e => setPerfil({ ...perfil, comorbidades: e.target.value })} className="min-h-[80px] rounded-xl border-2 border-border/50 bg-background/50" />
                </div>
                <Button onClick={() => toast.success("Perfil atualizado")} className="bg-gradient-primary text-white hover:opacity-90 rounded-xl">
                  Salvar perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PortalCidadao;