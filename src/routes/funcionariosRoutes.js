const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionariosController');

/**
 * @swagger
 * tags:
 *   name: Funcionários
 *   description: Gestão de cadastro de funcionários
 */

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     tags: [Funcionários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cargo
 *               - salario
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               cargo:
 *                 type: string
 *                 example: Desenvolvedor
 *               salario:
 *                 type: number
 *                 format: float
 *                 example: 5000.50
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 salario:
 *                   type: number
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
router.post('/', controller.criarFuncionario);

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     tags: [Funcionários]
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   salario:
 *                     type: number
 *       500:
 *         description: Erro interno
 */
router.get('/', controller.listarFuncionarios);

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário por ID
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 salario:
 *                   type: number
 *       404:
 *         description: Funcionário não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:id', controller.buscarFuncionario);

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionário
 *     tags: [Funcionários]
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
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               cargo:
 *                 type: string
 *                 example: Gerente
 *               salario:
 *                 type: number
 *                 example: 7500.00
 *     responses:
 *       200:
 *         description: Funcionário atualizado
 *       404:
 *         description: Funcionário não encontrado
 *       500:
 *         description: Erro interno
 */
router.put('/:id', controller.atualizarFuncionario);

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     summary: Remove um funcionário
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Funcionário removido
 *       404:
 *         description: Funcionário não encontrado
 *       500:
 *         description: Erro interno
 */
router.delete('/:id', controller.removerFuncionario);

module.exports = router;