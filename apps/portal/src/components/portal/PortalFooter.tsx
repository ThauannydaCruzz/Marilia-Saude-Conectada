import { Mail, MapPin, Phone } from "lucide-react";

export function PortalFooter() {
  return (
    <footer id="contato" className="border-t border-border bg-brand-soft/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold text-brand-deep">
            Secretaria Municipal da Saúde de Marília
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Atendimento, informação e serviços digitais de saúde para o cidadão mariliense.
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 text-primary" />
            Rua Bandeirantes, 25 — Centro, Marília/SP
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-primary" /> (14) 3402-6000
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-primary" /> saude@marilia.sp.gov.br
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Emergências</p>
          <p>SAMU 192 · Bombeiros 193</p>
          <p className="text-xs">
            Informações de contato e horários devem ser confirmados pela Secretaria antes da
            publicação oficial.
          </p>
        </div>
      </div>
    </footer>
  );
}
