require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const pool = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const funcionariosRoutes = require('./routes/funcionariosRoutes');

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Funcionários',
      version: '1.0.0',
      description: 'API para gerenciamento de funcionários',
    },
    servers: [{
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor local'
    }],
    components: {
      schemas: {
        Funcionario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'João Silva' },
            cargo: { type: 'string', example: 'Desenvolvedor' },
            salario: { type: 'number', format: 'float', example: 5000.00 }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.use('/funcionarios', funcionariosRoutes);

// Middleware de Erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
  
});