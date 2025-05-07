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
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions); // CORREÇÃO AQUI

// DEBUG
console.log('Rotas documentadas:', Object.keys(swaggerSpec.paths));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/', (req, res) => {
  res.send('API Funcionários Online! Acesse /api-docs para documentação.');
});

app.use('/funcionarios', funcionariosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});