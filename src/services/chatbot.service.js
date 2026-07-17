const conversacionChatbotRepository = require('../repositories/conversacion_chatbot.repository');

const FAQ = [
  {
    keywords: ['precio', 'costo', 'cuanto', 'cuesta', 'pagar', 'price', 'cost'],
    respuesta: 'Los precios de alojamiento en StudyNest varían según la ubicación y servicios. Puedes usar los filtros de búsqueda para encontrar opciones dentro de tu presupuesto.',
  },
  {
    keywords: ['buscar', 'encontrar', 'busqueda', 'filtrar', 'search', 'find'],
    respuesta: 'Puedes buscar alojamientos usando los filtros de precio, ubicación y servicios en la página principal. También puedes hacer búsquedas en lenguaje natural como "habitaciones cerca de la uni con wifi".',
  },
  {
    keywords: ['resena', 'review', 'calificar', 'opinion', 'rating'],
    respuesta: 'Las reseñas ayudan a otros estudiantes a elegir. Puedes dejar una reseña después de visitar un alojamiento. Las reseñas pasan por moderación antes de publicarse.',
  },
  {
    keywords: ['anuncio', 'publicar', 'arrendador', 'listing', 'publish'],
    respuesta: 'Si eres arrendador, puedes crear anuncios desde tu perfil. Asegúrate de incluir buenas fotos, una descripción clara y un precio justo.',
  },
  {
    keywords: ['contrato', 'agreement', 'contrato alquiler'],
    respuesta: 'StudyNest puede generar contratos de alquiler automáticos. Ve a la sección de contratos para crear uno personalizado.',
  },
  {
    keywords: ['cuenta', 'login', 'registro', 'contraseña', 'password', 'account'],
    respuesta: 'Puedes registrarte con tu correo electrónico. Si olvidaste tu contraseña, contacta al soporte.',
  },
  {
    keywords: ['seguro', 'safety', 'seguridad', 'estafa', 'scam'],
    respuesta: 'StudyNest verifica los anuncios y arrendadores. Si ves algo sospechoso, repórtalo. Nunca transfieras dinero sin visitar el alojamiento primero.',
  },
  {
    keywords: ['hello', 'hola', 'buenas', 'hey', 'hi'],
    respuesta: '¡Hola! Soy el asistente de StudyNest. ¿En qué puedo ayudarte? Puedo resolver dudas sobre búsqueda de alojamientos, precios, reseñas o uso de la plataforma.',
  },
];

const DEFAULT_RESPONSE = 'Lo siento, no entendí tu pregunta. Puedo ayudarte con dudas sobre búsqueda de alojamientos, precios, reseñas, contratos o uso de la plataforma. Intenta reformular tu pregunta.';

function findBestMatch(mensaje) {
  const q = mensaje.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

class ChatbotService {
  async procesarMensaje(usuarioId, mensaje) {
    if (!mensaje || !mensaje.trim()) {
      const error = new Error('El mensaje no puede estar vacío');
      error.statusCode = 400;
      throw error;
    }

    const match = findBestMatch(mensaje);
    const respuesta = match ? match.respuesta : DEFAULT_RESPONSE;

    await conversacionChatbotRepository.create({
      usuario_id: usuarioId,
      mensaje_usuario: mensaje,
      respuesta_chatbot: respuesta,
      fecha_interaccion: new Date(),
    });

    return {
      respuesta,
      fecha: new Date(),
    };
  }

  async getHistorial(usuarioId, page = 1, limit = 20) {
    return conversacionChatbotRepository.findByUsuarioId(usuarioId, { page, limit });
  }
}

module.exports = new ChatbotService();
