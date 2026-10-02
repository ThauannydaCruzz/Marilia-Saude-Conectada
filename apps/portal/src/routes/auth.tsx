import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  component: AuthPlaceholder,
});

function AuthPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border shadow-sm">
        <CardContent className="space-y-4 p-8 text-center">
          <h1 className="text-lg font-semibold text-brand-deep">Acesso do cidadão</h1>
          <p className="text-sm text-muted-foreground">
            Login com CPF ainda não implementado neste portal.
          </p>
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link to="/">
              <ArrowLeft className="size-4" /> Voltar ao início
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
