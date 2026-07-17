const { ConversacionChatbot } = require('../models');

class ConversacionChatbotRepository {
  async create(data) {
    return ConversacionChatbot.create(data);
  }

  async findByUsuarioId(usuarioId, { page = 1, limit = 20 } = {}) {
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: conversaciones, count: total } = await ConversacionChatbot.findAndCountAll({
      where: { usuario_id: usuarioId },
      order: [['fecha_interaccion', 'DESC']],
      limit: Number(limit),
      offset,
    });

    return {
      conversaciones,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}

module.exports = new ConversacionChatbotRepository();
