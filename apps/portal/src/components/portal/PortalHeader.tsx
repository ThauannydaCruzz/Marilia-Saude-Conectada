import { Link } from "@tanstack/react-router";
import { HeartPulse, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "A Secretaria", href: "#secretaria" },
  { label: "Serviços", href: "#servicos" },
  { label: "Unidades", href: "#unidades" },
  { label: "Contato", href: "#contato" },
];

export function PortalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Prefeitura de Marília
            </span>
            <span className="block text-base font-semibold text-brand-deep">
              Secretaria Municipal da Saúde
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand-soft hover:text-brand-deep"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button asChild className="ml-auto hidden rounded-full md:inline-flex">
          <Link to="/auth">Acesso do cidadão</Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="ml-auto rounded-full md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-brand-soft"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <Button asChild className="mt-3 w-full rounded-full">
            <Link to="/auth">Acesso do cidadão</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
