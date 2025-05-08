const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionariosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Funcionario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: ID único do funcionário
 *         nome:
 *           type: string
 *           example: "João Silva"
 *           description: Nome completo do funcionário
 *         cargo:
 *           type: string
 *           example: "Desenvolvedor"
 *           description: Cargo ocupado
 *         salario:
 *           type: number
 *           format: float
 *           example: 5000.50
 *           description: Salário mensal
 *     Erro:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *           example: "Erro de validação"
 *           description: Tipo do erro
 *         mensagem:
 *           type: string
 *           example: "Nome é obrigatório"
 *           description: Descrição detalhada
 * 
 * tags:
 *   - name: Funcionários
 *     description: Endpoints para gestão de funcionários
 */

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     description: Cria um novo registro de funcionário no sistema
 *     tags: [Funcionários]
 *     requestBody:
 *       required: true
 *       description: Dados do funcionário
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               camposObrigatorios:
 *                 value:
 *                   erro: "Dados incompletos"
 *                   mensagem: "Nome, cargo e salário são obrigatórios"
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', controller.criarFuncionario);

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     description: Retorna uma lista com todos os funcionários cadastrados
 *     tags: [Funcionários]
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/', controller.listarFuncionarios);

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário específico
 *     description: Retorna os dados de um funcionário pelo seu ID
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do funcionário
 *     responses:
 *       200:
 *         description: Dados do funcionário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       404:
 *         description: Funcionário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoEncontrado:
 *                 value:
 *                   erro: "Não encontrado"
 *                   mensagem: "Funcionário com ID 999 não existe"
 *       500:
 *         description: Erro interno
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
 *     summary: Atualiza um funcionário
 *     description: Altera os dados de um funcionário existente
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do funcionário
 *     requestBody:
 *       required: true
 *       description: Novos dados do funcionário
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
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Funcionário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro interno
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
 *     summary: Remove um funcionário
 *     description: Exclui permanentemente um funcionário do sistema
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do funcionário
 *     responses:
 *       200:
 *         description: Funcionário removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Funcionário removido com sucesso"
 *       404:
 *         description: Funcionário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete('/:id', controller.removerFuncionario);

module.exports = router;