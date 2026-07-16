const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const { COOKIE_NAME } = require('../utils/cookie');

let io;
const connectedUsers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';')
        .filter(c => c.trim().length > 0)
        .map(c => {
          const idx = c.indexOf('=');
          if (idx === -1) return [c.trim(), ''];
          return [c.substring(0, idx).trim(), c.substring(idx + 1).trim()];
        })
    );
    const token = cookies[COOKIE_NAME];

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = verifyToken(token);
      connectedUsers.set(decoded.id, socket.id);
      socket.userId = decoded.id;

      socket.on('disconnect', () => {
        connectedUsers.delete(decoded.id);
      });
    } catch {
      socket.disconnect();
    }
  });
}

function notifyUser(userId, eventName, data) {
  const socketId = connectedUsers.get(userId);
  if (socketId && io) {
    io.to(socketId).emit(eventName, data);
  }
}

module.exports = { initSocket, notifyUser };
