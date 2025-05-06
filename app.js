const express = require('express');
const pool = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Funcionários',
      version: '1.0.0',
    },
  },
  apis: ['./app.js'], // Certifique-se que o caminho está correto
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota de teste
 *     responses:
 *       200:
 *         description: Mensagem de status
 */
app.get('/', (req, res) => {
  res.send('API Funcionários Online! Acesse /api-docs para documentação.');
});

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cargo:
 *                 type: string
 *               salario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Funcionário cadastrado
 */
app.post('/funcionarios', async (req, res) => {
  const { nome, cargo, salario } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)',
      [nome, cargo, salario]
    );
    res.status(201).json({ id: result.insertId, nome, cargo, salario });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar funcionário');
  }
});

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     responses:
 *       200:
 *         description: Lista de funcionários
 */
app.get('/funcionarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM funcionarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar funcionários');
  }
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Funcionário encontrado
 *       404:
 *         description: Funcionário não encontrado
 */
app.get('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM funcionarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Funcionário não encontrado');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar funcionário');
  }
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionário
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
 *               cargo:
 *                 type: string
 *               salario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Funcionário atualizado
 *       404:
 *         description: Funcionário não encontrado
 */
app.put('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, salario } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE funcionarios SET nome = ?, cargo = ?, salario = ? WHERE id = ?',
      [nome, cargo, salario, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Funcionário não encontrado');
    }
    res.send('Funcionário atualizado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar funcionário');
  }
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     summary: Remove um funcionário
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
 */
app.delete('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM funcionarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Funcionário não encontrado');
    }
    res.send('Funcionário removido com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover funcionário');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});