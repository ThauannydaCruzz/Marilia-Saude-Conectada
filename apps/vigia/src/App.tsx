import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gateway from "./pages/Gateway";
import AuthCallback from "./pages/AuthCallback";
import PortalCidadao from "./pages/PortalCidadao";
import PortalGestor from "./pages/PortalGestor";
import NotFound from "./pages/NotFound";
import LoginCli from "./pages/LoginCli";
import CadastroClientes from "./pages/CadastroClientes";
import TermosDeUso from "./pages/TermosDeUso";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gateway />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/portal" element={<PrivateRoute><PortalCidadao /></PrivateRoute>} />
          <Route path="/gestor" element={<PortalGestor />} />
          <Route path="/clientes/loginClientes" element={<LoginCli />} />
          <Route path="/clientes/cadastroClientes" element={<CadastroClientes />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
