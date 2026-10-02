import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ?? "http://localhost:3000";

/**
 * Substitui a antiga página inicial (Index) na rota "/".
 * Não há mais landing page própria: se já existe sessão, vai direto pro
 * dashboard; senão, encaminha para o login único hospedado no portal.
 */
export default function Gateway() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      navigate("/PortalCidadao", { replace: true });
    } else {
      window.location.href = `${PORTAL_URL}/login?app=cuida`;
    }
  }, [navigate]);

  return null;
}
