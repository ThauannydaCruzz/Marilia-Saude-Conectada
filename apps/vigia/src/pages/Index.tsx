import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, Users, Activity, Shield, Clock, Calendar, Bot, TrendingUp, Award, LayoutDashboard } from "lucide-react";
import logoSecretaria from "@/assets/logo-secretaria-saude-marilia.png";
import logoApp from "@/assets/logo.png"; 
import Footer from "@/components/Footer"; // Ajuste o caminho se a sua pasta for minúscula (ex: "@/components/footer")

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface relative overflow-x-hidden flex flex-col justify-between">
      
      <div className="flex-1">
        <div className="absolute inset-0 pointer-events-none z-0 flex items-start justify-center pt-20 overflow-hidden">
          <img 
            src={logoApp} 
            alt="" 
            className="w-[800px] h-[800px] object-contain opacity-[0.05] grayscale contrast-125 mix-blend-multiply select-none"
          />
        </div>

        <nav className="relative z-10 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src={logoApp} 
                    alt="Logo VIGIA" 
                    className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </div>
                <div className="text-xl font-bold text-foreground font-poppins">VIGIA</div>
                <div className="text-xs text-muted-foreground mx-2">|</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <img
                    src={logoSecretaria}
                    alt="Secretaria de Saúde de Marília"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link to="/gestor">
                  <Button variant="outline" className="rounded-xl px-5 py-3 text-sm font-medium">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Portal do Gestor
                  </Button>
                </Link>
                <Link to="/clientes/loginClientes">
                  <Button className="bg-gradient-primary text-white hover:opacity-90 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Users className="w-4 h-4 mr-2" />
                    Portal Cidadão
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-2 rounded-full text-sm border border-primary/20">
                    <Ambulance className="w-4 h-4" />
                    Agendamento Inteligente de Ambulâncias
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-[1.1] font-poppins">
                    Transporte por
                    <br />
                    <span className="bg-gradient-to-r from-primary via-secondary to-cuida-green bg-clip-text text-transparent">
                      ambulância
                    </span> sem filas
                  </h1>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  O VIGIA conecta cidadãos e a Secretaria de Saúde de Marília no agendamento de
                  ambulâncias para consultas, tratamentos e exames. Veja horários disponíveis, escolha
                  o seu e tenha prioridade automática para casos clínicos críticos.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link to="/clientes/loginClientes">
                    <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 rounded-xl px-8 py-4 text-base font-medium flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto">
                      <Calendar className="w-5 h-5" />
                      Agendar Ambulância
                    </Button>
                  </Link>
                  <Link to="/gestor">
                    <Button size="lg" variant="outline" className="rounded-xl px-8 py-4 text-base font-medium w-full sm:w-auto">
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Acessar Gestão
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 flex justify-center" />

                <Card className="absolute top-8 right-0 bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl p-5 w-56 animate-float border border-primary/10">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                        <Ambulance className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-foreground font-poppins">24/7</div>
                        <div className="text-sm text-muted-foreground font-medium">Frota disponível</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute top-48 right-8 bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl p-5 w-60 animate-float-delayed border border-secondary/10">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20">
                        <TrendingUp className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-foreground font-poppins">+1.200</div>
                        <div className="text-sm text-muted-foreground font-medium">Transportes/mês</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute bottom-16 left-8 bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl p-5 w-52 animate-float border border-success/10">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                        <Award className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-foreground font-poppins">100%</div>
                        <div className="text-sm text-muted-foreground font-medium">Prioridade clínica</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-20 bg-surface/50 backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">Como o VIGIA funciona</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Um fluxo simples para o cidadão e gestão completa da escala para a Secretaria
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-primary/10 hover:border-primary/20 bg-gradient-to-b from-card to-card/50">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                    <Calendar className="w-9 h-9 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">Escolha seu horário</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Veja em tempo real os horários disponíveis de ambulância e selecione o que melhor
                    encaixa no seu tratamento ou consulta.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-6 text-primary">
                    <Clock className="w-4 h-4" />
                    <Calendar className="w-4 h-4" />
                    <Ambulance className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-secondary/10 hover:border-secondary/20 bg-gradient-to-b from-card to-card/50">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-secondary/20">
                    <Shield className="w-9 h-9 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">Prioridade clínica</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pacientes oncológicos, em hemodiálise, acamados ou com mobilidade reduzida recebem
                    prioridade automática conforme o perfil de saúde.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-6 text-secondary">
                    <Activity className="w-4 h-4" />
                    <Shield className="w-4 h-4" />
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-accent/10 hover:border-accent/20 bg-gradient-to-b from-card to-card/50">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                    <Bot className="w-9 h-9 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">Gestão de escala</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Gestores acompanham agendamentos do dia, confirmam a escala e reorganizam a
                    sequência das corridas com poucos cliques.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-6 text-accent">
                    <LayoutDashboard className="w-4 h-4" />
                    <TrendingUp className="w-4 h-4" />
                    <Award className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />

    </div>
  );
};

export default HomePage;