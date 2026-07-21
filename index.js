require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/error.middleware');
const { sequelize } = require('./src/models');
const { initSocket } = require('./src/config/socket');
const validacionIAService = require('./src/services/validacionIA.service');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Models synchronized');
    }

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      // Precarga el modelo de validación IA en segundo plano (no bloquea el arranque).
      validacionIAService.precargar();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
