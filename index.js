require("dotenv").config();
const { createApp } = require("./src/app");

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`StudyNest API (Modulo Notificaciones y Eventos) escuchando en http://localhost:${PORT}`);
});
