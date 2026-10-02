import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Recebe id/nome emitidos pelo Cuida (via login único no portal) por query
 * string. Sem JWT: o Vigia só guarda esse id (pra saber quem está logado
 * e exibir o nome), e usa o Supabase do seu próprio projeto (chave
 * publicável) para os dados de ambulância.
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

    navigate("/portal", { replace: true });
  }, [navigate]);

  return null;
}
