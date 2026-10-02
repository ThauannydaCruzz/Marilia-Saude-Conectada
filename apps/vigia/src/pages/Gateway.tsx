import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ?? "http://localhost:3000";

/**
 * Substitui a antiga página inicial (Index) na rota "/".
 * Não há mais landing page própria: se já existe sessão (token vindo do
 * login único do Cuida), vai direto pro dashboard; senão, encaminha para
 * o login único hospedado no portal.
 */
export default function Gateway() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      navigate("/portal", { replace: true });
    } else {
      window.location.href = `${PORTAL_URL}/login?app=vigia`;
    }
  }, [navigate]);

  return null;
}
