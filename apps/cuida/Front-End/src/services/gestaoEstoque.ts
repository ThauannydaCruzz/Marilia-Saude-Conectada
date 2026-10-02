import api from "./api";

// ---------------------------------------------------------------------------
// Tipos (espelham as respostas do back-end do Cuida)
// ---------------------------------------------------------------------------

export interface UnidadeResumo {
  id: number;
  name: string;
}

export interface MedicamentoResumo {
  id_medicamento: number;
  nome: string;
  concentracao?: string | null;
}

export interface EntradaEstoquePayload {
  id_medicamento: number;
  id_unidade: number;
  quantidade: number;
  lote: string;            // código do lote do fabricante
  data_vencimento: string; // "AAAA-MM-DD"
  notificar?: boolean;     // padrão: true
}

export type MotivoSemAviso =
  | "JA_HAVIA_ESTOQUE"
  | "SEM_INTERESSADOS"
  | "NOTIFICACAO_DESLIGADA"
  | "ERRO_AO_NOTIFICAR"
  | "SEM_ESTOQUE";

export interface EntradaEstoqueResposta {
  success: true;
  entrada: {
    id_lote: number;
    lote: string;
    data_vencimento: string;
    lote_novo: boolean;
    id_estoque: number;
    quantidade_adicionada: number;
  };
  estoque_antes: number;
  estoque_depois: number;
  notificacao:
    | { disparada: true; id_lote_notificacao: string; total_inscritos: number; acompanhar_em: string }
    | { disparada: false; motivo: MotivoSemAviso; detalhe?: string };
}

export type StatusLote =
  | "na_fila"
  | "processando"
  | "aguardando_janela"
  | "concluido"
  | "concluido_com_interrupcao"
  | "erro";

export interface ItemNotificacao {
  id_cliente: number;
  nome: string | null;
  telefone: string; // mascarado, ex.: 5514*****5432
  whatsapp: {
    status: "pendente" | "enviado" | "falhou" | "ignorado" | "nao_enviado";
    codigo?: string;
    id_mensagem?: string;
  };
  email: { status: "pendente" | "enviado" | "falhou" | "ignorado" | "sem_email"; codigo?: string };
}

export interface LoteNotificacao {
  id: string;
  status: StatusLote;
  total: number;
  motivo_interrupcao: string | null;
  itens: ItemNotificacao[];
  resumo: {
    whatsapp: Record<"enviado" | "falhou" | "ignorado" | "nao_enviado" | "pendente", number>;
    falhas_por_codigo: Record<string, number>;
    emails_enviados: number;
  };
}

// ---------------------------------------------------------------------------
// Chamadas
// ---------------------------------------------------------------------------

export async function listarUnidades(): Promise<UnidadeResumo[]> {
  const { data } = await api.get("/unidades/get-unidades");
  return (data || []).map((u: { id: number; name: string }) => ({ id: u.id, name: u.name }));
}

export async function listarMedicamentos(): Promise<MedicamentoResumo[]> {
  const { data } = await api.get<MedicamentoResumo[]>("/medicamentos/listar");
  return data || [];
}

export async function consultarEstoqueDisponivel(idMedicamento: number, idUnidade: number): Promise<number> {
  const { data } = await api.get<{ quantidade: number }>("/estoques/disponivel", {
    params: { id_medicamento: idMedicamento, id_unidade: idUnidade },
  });
  return data.quantidade;
}

export async function darEntradaEstoque(dados: EntradaEstoquePayload): Promise<EntradaEstoqueResposta> {
  const { data } = await api.post<EntradaEstoqueResposta>("/estoques/entrada", dados);
  return data;
}

export async function buscarLoteNotificacao(id: string): Promise<LoteNotificacao> {
  const { data } = await api.get<{ success: boolean; lote: LoteNotificacao }>(`/whatsapp/notificacoes/${id}`);
  return data.lote;
}

export const STATUS_FINAIS: StatusLote[] = ["concluido", "concluido_com_interrupcao", "erro"];

/** Mensagem amigável para os erros que o back-end devolve em `codigo`. */
export function mensagemDeErro(e: unknown): { titulo: string; detalhes: string[] } {
  const resp = (e as { response?: { status?: number; data?: { codigo?: string; error?: string; erros?: string[] } } })
    ?.response;
  if (!resp) {
    return {
      titulo: "Não foi possível falar com o back-end.",
      detalhes: [`Confira se ele está rodando e se VITE_API_URL (${import.meta.env.VITE_API_URL ?? "não definido"}) está certo.`],
    };
  }
  const { codigo, error, erros } = resp.data || {};
  const titulos: Record<string, string> = {
    DADOS_INVALIDOS: "Confira os campos do formulário.",
    MEDICAMENTO_INEXISTENTE: "Medicamento não encontrado.",
    UNIDADE_INEXISTENTE: "Unidade não encontrada.",
    LOTE_VENCIMENTO_DIVERGENTE: "Esse código de lote já existe com outra data de vencimento.",
  };
  return {
    titulo: (codigo && titulos[codigo]) || error || `Erro ${resp.status ?? ""}`.trim(),
    detalhes: erros || [],
  };
}
