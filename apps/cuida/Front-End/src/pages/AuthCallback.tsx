import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Recebe id/nome vindos do login único (hospedado no portal) via query
 * string, salva localmente do mesmo jeito que o LoginCli já fazia, e segue
 * pro dashboard. Sem JWT: a sessão é só esse id salvo no localStorage.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const nome = params.get("nome");

    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    localStorage.setItem("id", id);
    if (nome) localStorage.setItem("nome", nome);

    navigate("/PortalCidadao", { replace: true });
  }, [navigate]);

  return null;
}
