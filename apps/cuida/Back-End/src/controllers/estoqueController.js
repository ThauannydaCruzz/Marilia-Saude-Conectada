const Estoque = require('../models/Estoque');
const { darEntrada, darSaida, ErroEntrada } = require('../services/estoqueService');
const log = require('../utils/logger');

exports.estoque = async (req, res) => {
  try {
    const data = await Estoque.getEstoque();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar lote:", err);
    res.status(500).json({ error: "Erro ao buscar lote" });
  }
}

/**
 * Quantidade disponível (lotes dentro da validade) de um medicamento numa UBS.
 * GET /api/estoques/disponivel?id_medicamento=3&id_unidade=4
 */
exports.disponivel = async (req, res) => {
  const idMedicamento = Number(req.query.id_medicamento);
  const idUnidade = Number(req.query.id_unidade);
  if (!Number.isInteger(idMedicamento) || idMedicamento <= 0 || !Number.isInteger(idUnidade) || idUnidade <= 0) {
    return res.status(400).json({ success: false, codigo: 'DADOS_INVALIDOS', error: 'Informe id_medicamento e id_unidade.' });
  }
  try {
    const quantidade = await Estoque.quantidadeDisponivel(idMedicamento, idUnidade);
    return res.json({ success: true, id_medicamento: idMedicamento, id_unidade: idUnidade, quantidade });
  } catch (err) {
    log.error('estoque.disponivel_falhou', { erro: err.message });
    return res.status(500).json({ success: false, codigo: 'ERRO_INTERNO', error: 'Falha ao consultar o estoque.' });
  }
};

/**
 * Entrada de estoque (uso da gestão/UBS).
 * POST /api/estoques/entrada
 * Body: { id_medicamento, id_unidade, quantidade, lote, data_vencimento: "AAAA-MM-DD", notificar?: true }
 *
 * Se o medicamento estava zerado na UBS, os cidadãos que o favoritaram
 * são avisados automaticamente (WhatsApp + e-mail), pela mesma fila anti-ban.
 */
exports.entrada = async (req, res) => {
  try {
    const resultado = await darEntrada(req.body);
    return res.status(201).json({ success: true, ...resultado });
  } catch (err) {
    if (err instanceof ErroEntrada) {
      return res.status(err.status).json({ success: false, codigo: err.codigo, error: err.message, erros: err.erros });
    }
    log.error('estoque.entrada_falhou', { erro: err.message });
    return res.status(500).json({ success: false, codigo: 'ERRO_INTERNO', error: 'Falha ao registrar entrada de estoque.' });
  }
};

/**
 * Saída de estoque (uso da gestão/UBS): dispensação, perda, transferência.
 * POST /api/estoques/saida
 * Body: { id_medicamento, id_unidade, quantidade }
 * Baixa dos lotes que vencem primeiro. 409 ESTOQUE_INSUFICIENTE se pedir mais do que há.
 */
exports.saida = async (req, res) => {
  try {
    const resultado = await darSaida(req.body);
    return res.status(200).json({ success: true, ...resultado });
  } catch (err) {
    if (err instanceof ErroEntrada) {
      return res.status(err.status).json({ success: false, codigo: err.codigo, error: err.message, erros: err.erros });
    }
    log.error('estoque.saida_falhou', { erro: err.message });
    return res.status(500).json({ success: false, codigo: 'ERRO_INTERNO', error: 'Falha ao registrar saída de estoque.' });
  }
};
