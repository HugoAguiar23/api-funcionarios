const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionariosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Funcionario:
 *       type: object
 *       required:
 *         - nome
 *         - cargo
 *         - salario
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           readOnly: true
 *         nome:
 *           type: string
 *           example: "João Silva"
 *         cargo:
 *           type: string
 *           example: "Desenvolvedor"
 *         salario:
 *           type: number
 *           format: float
 *           example: 5000.5
 *
 *     Error:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *           example: "Erro de validação"
 *         mensagem:
 *           type: string
 *           example: "Nome é obrigatório"
 */

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     tags: [Funcionários]
 *     summary: Cria novo funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       201:
 *         description: Funcionário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', controller.criarFuncionario);

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     tags: [Funcionários]
 *     summary: Lista todos os funcionários
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 */
router.get('/', controller.listarFuncionarios);

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     tags: [Funcionários]
 *     summary: Busca funcionário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do funcionário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       404:
 *         description: Não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:id', controller.buscarFuncionario);

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     tags: [Funcionários]
 *     summary: Atualiza funcionário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       200:
 *         description: Funcionário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       404:
 *         description: Não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.put('/:id', controller.atualizarFuncionario);

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     tags: [Funcionários]
 *     summary: Remove funcionário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removido com sucesso
 *       404:
 *         description: Não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete('/:id', controller.removerFuncionario);

module.exports = router;