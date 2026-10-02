import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import VigiaLogo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={VigiaLogo} 
                alt="VIGIA Logo" 
                className="w-10 h-10 rounded-lg shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold text-primary">VIGIA</h3>
                <p className="text-xs text-muted-foreground">Sistema de Agendamento de Ambulâncias</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Cuidando de você e sua família com tecnologia, segurança e humanização. 
              Sua saúde é nossa prioridade.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Serviços</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Agendamentos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Emergência 24h
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Monitoramento
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Suporte</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Localização</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">
                    UNIMAR- Universidade de Marília<br />
                    Marília, SP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2026 VIGIA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;