const pool = require('../config/db');

module.exports = {
  // Cria um novo funcionário
  async criarFuncionario(req, res) {
    try {
      const { nome, cargo, salario } = req.body;
      
      // Validação simples
      if (!nome || !cargo || salario === undefined) {
        return res.status(400).json({ error: 'Nome, cargo e salário são obrigatórios' });
      }

      const [result] = await pool.query(
        'INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)',
        [nome, cargo, salario]
      );
      
      res.status(201).json({ 
        id: result.insertId, 
        nome, 
        cargo, 
        salario 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
  },

  // Lista todos os funcionários
  async listarFuncionarios(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM funcionarios');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
  },

  // Busca um funcionário por ID
  async buscarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM funcionarios WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
  },

  // Atualiza um funcionário
  async atualizarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const { nome, cargo, salario } = req.body;
      
      const [result] = await pool.query(
        'UPDATE funcionarios SET nome = ?, cargo = ?, salario = ? WHERE id = ?',
        [nome, cargo, salario, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      res.json({ message: 'Funcionário atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
  },

  // Remove um funcionário
  async removerFuncionario(req, res) {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM funcionarios WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      res.json({ message: 'Funcionário removido com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover funcionário' });
    }
  }
};