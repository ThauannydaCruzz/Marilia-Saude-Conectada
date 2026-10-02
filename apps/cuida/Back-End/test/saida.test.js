/**
 * Saída de estoque (dispensação) — sem Supabase (model simulado).
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { darSaida, validarSaida } = require('../src/services/estoqueService');

/** Lotes já ordenados por vencimento, como o model devolve */
function bancoFalso(lotes) {
  const gravados = [];
  return {
    gravados,
    lotesDisponiveis: async () => lotes.map((l) => ({ ...l })),
    definirQuantidade: async (idEstoque, q) => { gravados.push([idEstoque, q]); }
  };
}

const LOTES = [
  { id_estoque: 1, quantidade: 3, id_lote: 10, lote: 'A', data_vencimento: '2026-12-01' },
  { id_estoque: 2, quantidade: 5, id_lote: 11, lote: 'B', data_vencimento: '2027-03-01' }
];

test('baixa primeiro do lote que vence antes (FEFO)', async () => {
  const Estoque = bancoFalso(LOTES);
  const r = await darSaida({ id_medicamento: 2, id_unidade: 4, quantidade: 4 }, { Estoque });
  assert.equal(r.estoque_antes, 8);
  assert.equal(r.estoque_depois, 4);
  assert.deepEqual(Estoque.gravados, [[1, 0], [2, 4]]);
  assert.deepEqual(r.baixas.map((b) => [b.lote, b.quantidade]), [['A', 3], ['B', 1]]);
});

test('saída de tudo deixa o estoque em 0', async () => {
  const Estoque = bancoFalso(LOTES);
  const r = await darSaida({ id_medicamento: 2, id_unidade: 4, quantidade: 8 }, { Estoque });
  assert.equal(r.estoque_depois, 0);
  assert.deepEqual(Estoque.gravados, [[1, 0], [2, 0]]);
});

test('pedir mais do que há -> 409 e não grava nada', async () => {
  const Estoque = bancoFalso(LOTES);
  await assert.rejects(darSaida({ id_medicamento: 2, id_unidade: 4, quantidade: 9 }, { Estoque }),
    (e) => e.status === 409 && e.codigo === 'ESTOQUE_INSUFICIENTE');
  assert.equal(Estoque.gravados.length, 0);
});

test('validação da saída: lista todos os problemas', () => {
  assert.throws(() => validarSaida({ id_medicamento: 0, quantidade: -1 }), (e) => {
    assert.equal(e.status, 400);
    assert.equal(e.erros.length, 3);
    return true;
  });
});
