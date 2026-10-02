// src/data/health-units-mock.ts
import { HealthUnit } from "@/types/health-units";
import { get_estoque, get_unidades } from "../services/unidades";

// Função auxiliar para verificar restrição baseada na classificação
const checkRestriction = (
  classification: string | undefined | null
): boolean => {
  if (!classification) return false;

  const text = String(classification).toLowerCase();

  return (
    text.includes("tarja") ||
    text.includes("receita") ||
    text.includes("controlado") ||
    text.includes("antibiótico") ||
    text.includes("antimicrobiano")
  );
};

// Normaliza o retorno das APIs para garantir que sempre trabalharemos
// com arrays.
const normalizeArray = <T = any>(response: any): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.unidades)) {
    return response.unidades;
  }

  if (Array.isArray(response?.estoque)) {
    return response.estoque;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

// Sem try/catch aqui, uma falha de rede (backend fora do ar, CORS, etc.) vira
// uma rejeição não tratada na hora que o módulo carrega — e como este arquivo
// é importado (via HealthMap) direto no App.tsx, isso derruba a carga do app
// inteiro, não só a tela do mapa. Por isso os dois awaits ficam protegidos.
let unidadesResponse: any = [];
let estoqueResponse: any = [];

try {
  [unidadesResponse, estoqueResponse] = await Promise.all([
    get_unidades(),
    get_estoque(),
  ]);
} catch (err) {
  console.error(
    "Não foi possível carregar unidades/estoque (o app segue funcionando, só sem esses dados):",
    err
  );
}

const unidades = normalizeArray(unidadesResponse);
const estoque = normalizeArray(estoqueResponse);

export const healthUnits: HealthUnit[] = unidades.map(
  (unit: any, index: number) => {
    const estoqueDaUnidade = estoque.filter(
      (item: any) => item.id_unidade === unit.id
    );

    const medications = estoqueDaUnidade
      .map((itemEstoque: any, medIndex: number) => {
        const medInfo = itemEstoque.lote?.medicamento;

        if (!medInfo) return null;

        const quantity = Number(itemEstoque.quantidade) || 0;

        const minStock = 50;
        const maxStock = 100;

        let status:
          | "healthy"
          | "normal"
          | "attention"
          | "urgent" = "healthy";

        if (quantity === 0) {
          status = "urgent";
        } else if (quantity < minStock) {
          status = "attention";
        } else if (quantity < minStock * 1.5) {
          status = "normal";
        }

        const isRestricted = checkRestriction(medInfo.classificacao);

        return {
          id: `med-${unit.id}-${medInfo.id_medicamento}`,
          name: medInfo.nome,
          dosage: medInfo.concentracao,
          tipo: medInfo.tipo,
          quantity,
          minStock,
          maxStock,
          status,
          foto_url: medInfo.foto_url || "",
          description: medInfo.descricao || "",
          requiresPrescription:
            isRestricted || medInfo.requer_prescricao || false,
          viewingCount: 0,
          interests: 0,
        };
      })
      .filter(Boolean) as any[];

    let type:
      | "UBS"
      | "UPA"
      | "Hospital"
      | "Clínica"
      | "Farmácia"
      | "USF"
      | "Farmácia Popular"
      | "UCAF" = "UBS";

    const unitName = String(unit.name || "");

    if (unitName.includes("UCAF")) {
      type = "UCAF";
    } else if (unitName.includes("UBS")) {
      type = "UBS";
    } else if (unitName.includes("USF")) {
      type = "USF";
    } else if (unitName.includes("UPA")) {
      type = "UPA";
    } else if (unitName.includes("Farmácia")) {
      type = "Farmácia";
    }

    let unitStatus:
      | "healthy"
      | "normal"
      | "attention"
      | "urgent" = "normal";

    const totalMedicamentos = medications.length;

    if (totalMedicamentos > 0) {
      const totalUrgente = medications.filter(
        (m) => m.status === "urgent"
      ).length;

      const totalAtencao = medications.filter(
        (m) => m.status === "attention"
      ).length;

      const totalHealthy = medications.filter(
        (m) => m.status === "healthy"
      ).length;

      const percentUrgente = totalUrgente / totalMedicamentos;

      const percentAtencaoOuPior =
        (totalUrgente + totalAtencao) / totalMedicamentos;

      const percentHealthy = totalHealthy / totalMedicamentos;

      if (percentUrgente > 0.5) {
        unitStatus = "urgent";
      } else if (percentAtencaoOuPior >= 0.5) {
        unitStatus = "attention";
      } else if (percentHealthy > 0.9) {
        unitStatus = "healthy";
      } else {
        unitStatus = "normal";
      }
    }

    return {
      id: `unit-${unit.id}`,
      name: unit.name,
      address: unit.address,
      coordinates: [unit.lat, unit.lon],
      type,
      status: unitStatus,
      workingHours: `${unit.aberto} - ${unit.fechado}`,
      phone: unit.tel,
      manager: "Dr. João Silva",
      services: ["Consultas", "Vacinação", "Curativos"],
      medications: medications.filter(
        (m) => m !== null
      ) as Exclude<(typeof medications)[0], null>[],
    };
  }
);
