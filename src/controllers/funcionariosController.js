const pool = require('../config/db');

// Validações auxiliares
const validarFuncionario = (nome, cargo, salario) => {
  const erros = [];
  
  if (!nome || nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!cargo || cargo.trim().length < 2) {
    erros.push('Cargo deve ter pelo menos 2 caracteres');
  }
  
  if (salario === undefined || isNaN(salario) || salario < 0) {
    erros.push('Salário deve ser um número positivo');
  }
  
  return erros;
};

module.exports = {
  /**
   * Cria um novo funcionário com validação 
   */
  async criarFuncionario(req, res) {
    try {
      const { nome, cargo, salario } = req.body;
      
      const erros = validarFuncionario(nome, cargo, salario);
      if (erros.length > 0) {
        return res.status(400).json({ errors: erros });
      }

      const [result] = await pool.query(
        'INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)',
        [nome.trim(), cargo.trim(), parseFloat(salario)]
      );
      
      res.status(201).json({ 
        id: result.insertId, 
        nome: nome.trim(),
        cargo: cargo.trim(),
        salario: parseFloat(salario)
      });
    } catch (err) {
      console.error('Erro ao criar funcionário:', err);
      res.status(500).json({ 
        error: 'Erro ao cadastrar funcionário',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  /**
   * Lista todos os funcionários com paginação básica
   */
  async listarFuncionarios(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const [rows] = await pool.query(
        'SELECT * FROM funcionarios LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );
      
      // Contagem total para paginação
      const [total] = await pool.query(
        'SELECT COUNT(*) as total FROM funcionarios'
      );
      
      res.json({
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total[0].total
        }
      });
    } catch (err) {
      console.error('Erro ao listar funcionários:', err);
      res.status(500).json({ 
        error: 'Erro ao buscar funcionários',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  /**
   * Busca um funcionário por ID
   */
  async buscarFuncionario(req, res) {
    try {
      const { id } = req.params;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número' });
      }
      
      const [rows] = await pool.query(
        'SELECT * FROM funcionarios WHERE id = ?', 
        [parseInt(id)]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error('Erro ao buscar funcionário:', err);
      res.status(500).json({ 
        error: 'Erro ao buscar funcionário',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  /**
   * Atualiza um funcionário com validação
   */
  async atualizarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const { nome, cargo, salario } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número' });
      }
      
      const erros = validarFuncionario(nome, cargo, salario);
      if (erros.length > 0) {
        return res.status(400).json({ errors: erros });
      }
      
      const [result] = await pool.query(
        'UPDATE funcionarios SET nome = ?, cargo = ?, salario = ? WHERE id = ?',
        [nome.trim(), cargo.trim(), parseFloat(salario), parseInt(id)]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      // Retorna os dados atualizados
      const [updated] = await pool.query(
        'SELECT * FROM funcionarios WHERE id = ?',
        [parseInt(id)]
      );
      
      res.json(updated[0]);
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      res.status(500).json({ 
        error: 'Erro ao atualizar funcionário',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  /**
   * Remove um funcionário
   */
  async removerFuncionario(req, res) {
    try {
      const { id } = req.params;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número' });
      }
      
      const [result] = await pool.query(
        'DELETE FROM funcionarios WHERE id = ?', 
        [parseInt(id)]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      
      res.json({ 
        success: true,
        message: 'Funcionário removido com sucesso',
        id: parseInt(id)
      });
    } catch (err) {
      console.error('Erro ao remover funcionário:', err);
      res.status(500).json({ 
        error: 'Erro ao remover funcionário',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};