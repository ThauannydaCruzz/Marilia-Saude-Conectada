import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ArrowLeft, Ambulance, Eye, EyeOff, HeartPulse, Accessibility, Stethoscope } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Importação do logo correto da aplicação
import logoApp from "@/assets/logo.png";

export default function CadastroClientes() {
  const [formData, setFormData] = useState({
    nome: "", idade: "", endereco: "", cpf: "", rg: "", email: "", telefone: "",
    contatoEmergenciaNome: "", contatoEmergenciaTelefone: "",
    carteirinha: "", tipoSanguineo: "",
    mobilidade: "", necessitaAcompanhante: false, necessitaOxigenio: false,
    necessitaMaca: false, bariatrico: false,
    condicoesCriticas: [] as string[],
    alergias: "", medicamentosUso: "", comorbidades: "",
    password: "", confirmPassword: "", acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const toggleCondicao = (cond: string) => {
    setFormData(prev => ({
      ...prev,
      condicoesCriticas: prev.condicoesCriticas.includes(cond)
        ? prev.condicoesCriticas.filter(c => c !== cond)
        : [...prev.condicoesCriticas, cond],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-surface to-primary/5 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      {/* TEXTURA DE LOGO AO FUNDO */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={logoApp} 
          alt="" 
          className="w-[900px] h-[900px] object-contain opacity-[0.06] grayscale contrast-125 mix-blend-multiply select-none"
        />
      </div>

      <div className="w-full max-w-5xl relative z-10 animate-fade-in">
        <button
          onClick={() => navigate("/clientes/loginClientes")}
          className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 mb-8 transition-all duration-300 hover:gap-3 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao login
        </button>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-16 flex items-center justify-center animate-scale-in">
            <img 
              src={logoApp} 
              alt="Logo VIGIA" 
              className="w-full h-full object-contain mix-blend-multiply" 
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground font-poppins">VIGIA — Cadastro do Cidadão</h1>
            <p className="text-sm text-muted-foreground font-medium">Agendamento de Ambulâncias • Marília/SP</p>
          </div>
        </div>

        <Card className="shadow-2xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-10 px-8 bg-gradient-to-b from-secondary/5 to-transparent">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-secondary/20 shadow-lg">
              <Users className="w-12 h-12 text-secondary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground font-poppins mb-2">Criar sua Conta</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              As informações de saúde abaixo são usadas para priorizar seu transporte
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <Users className="w-5 h-5 text-secondary" /> Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input id="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome completo" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade *</Label>
                    <Input id="idade" type="number" value={formData.idade} onChange={handleChange} placeholder="Ex: 65" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input id="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="endereco">Endereço completo (origem do transporte) *</Label>
                    <Input id="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, número, bairro, ponto de referência" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmergenciaNome">Contato de emergência</Label>
                    <Input id="contatoEmergenciaNome" value={formData.contatoEmergenciaNome} onChange={handleChange} placeholder="Nome" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmergenciaTelefone">Telefone do contato</Label>
                    <Input id="contatoEmergenciaTelefone" value={formData.contatoEmergenciaTelefone} onChange={handleChange} placeholder="(00) 00000-0000" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                </div>
              </div>

              {/* Mobilidade e Necessidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <Accessibility className="w-5 h-5 text-secondary" /> Mobilidade e Necessidades Especiais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="mobilidade">Condição de mobilidade *</Label>
                    <Select value={formData.mobilidade} onValueChange={(v) => setFormData({ ...formData, mobilidade: v })}>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-border/50 bg-background/50">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deambula">Anda sem ajuda</SelectItem>
                        <SelectItem value="auxilio">Anda com auxílio (bengala/andador)</SelectItem>
                        <SelectItem value="cadeirante">Cadeirante</SelectItem>
                        <SelectItem value="acamado">Acamado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoSanguineo">Tipo sanguíneo</Label>
                    <Input id="tipoSanguineo" value={formData.tipoSanguineo} onChange={handleChange} placeholder="Ex: A+, O-, B+" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { id: "necessitaAcompanhante", label: "Necessita de acompanhante" },
                    { id: "necessitaOxigenio", label: "Uso contínuo de oxigênio" },
                    { id: "necessitaMaca", label: "Transporte exclusivo em maca" },
                    { id: "bariatrico", label: "Paciente bariátrico (acima de 130kg)" },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 hover:border-secondary/40 cursor-pointer transition-colors bg-background/30">
                      <Checkbox
                        checked={formData[opt.id as keyof typeof formData] as boolean}
                        onCheckedChange={(c) => setFormData({ ...formData, [opt.id]: !!c })}
                      />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condições Críticas */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <HeartPulse className="w-5 h-5 text-destructive" /> Condições Clínicas Críticas
                  <span className="text-xs font-normal text-muted-foreground ml-2">(definem prioridade no agendamento)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {condicoesOpcoes.map(cond => (
                    <label key={cond} className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 hover:border-destructive/40 cursor-pointer transition-colors bg-background/30">
                      <Checkbox
                        checked={formData.condicoesCriticas.includes(cond)}
                        onCheckedChange={() => toggleCondicao(cond)}
                      />
                      <span className="text-sm text-foreground">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dados Clínicos Gerais */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <Stethoscope className="w-5 h-5 text-secondary" /> Dados Clínicos Gerais
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="carteirinha">Cartão SUS</Label>
                    <Input id="carteirinha" value={formData.carteirinha} onChange={handleChange} placeholder="Número da carteirinha" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="alergias">Alergias</Label>
                    <Input id="alergias" value={formData.alergias} onChange={handleChange} placeholder="Medicamentos, alimentos, látex..." className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                  <div className="space-y-2 lg:col-span-3">
                    <Label htmlFor="medicamentosUso">Medicamentos de uso contínuo</Label>
                    <Textarea id="medicamentosUso" value={formData.medicamentosUso} onChange={handleChange} placeholder="Liste medicamentos e dosagem" className="min-h-[80px] rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                  <div className="space-y-2 lg:col-span-3">
                    <Label htmlFor="comorbidades">Comorbidades / diagnósticos</Label>
                    <Textarea id="comorbidades" value={formData.comorbidades} onChange={handleChange} placeholder="Diabetes, hipertensão, AVC prévio, etc." className="min-h-[80px] rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50" />
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Criar Senha de Acesso
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Crie uma senha segura" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50 pr-12" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Digite a senha novamente" className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50 pr-12" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODIFICADO: Substituição da tag <a> pelo componente <Link> do react-router-dom */}
              <div className="flex items-start space-x-3 p-5 rounded-xl bg-secondary/5 border-2 border-secondary/20">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: !!checked })}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-foreground leading-relaxed cursor-pointer">
                  Aceito os{" "}
                  <Link
                    to="/termos-de-uso"
                    className="text-secondary hover:text-secondary/80 font-semibold underline decoration-2 underline-offset-2"
                  >
                    termos de uso e política de privacidade
                  </Link>{" "}
                  do VIGIA
                </Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-secondary text-white hover:opacity-90 h-14 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-base">
                <div className="flex items-center justify-center gap-2">
                  Criar Conta
                  <Ambulance className="w-5 h-5" />
                </div>
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link to="/clientes/loginClientes" className="text-secondary hover:text-secondary/80 font-semibold underline decoration-2 underline-offset-4">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}