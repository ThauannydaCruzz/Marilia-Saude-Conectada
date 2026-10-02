const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const exigirChaveInterna = require('../middlewares/chaveInternaMiddleware');

// Envio avulso (teste/diagnóstico). Este monorepo não usa JWT, então a rota fica
// protegida pela chave interna (x-api-key), como as demais. Sem NOTIFICACAO_API_KEY
// definida ela fica aberta: preencha a chave em qualquer ambiente acessível pela rede.
router.post('/enviar', exigirChaveInterna, whatsappController.enviarMensagem);

// Disparo em massa e diagnóstico: chave interna (x-api-key), se configurada
router.post('/notificar-disponibilidade', exigirChaveInterna, whatsappController.notificarDisponibilidade);
router.get('/notificacoes', exigirChaveInterna, whatsappController.listarLotes);
router.get('/notificacoes/:id', exigirChaveInterna, whatsappController.statusLote);
router.get('/status', exigirChaveInterna, whatsappController.statusInstancia);
router.post('/validar-numero', exigirChaveInterna, whatsappController.validarNumero);

module.exports = router;
