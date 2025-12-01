import app from "./app.js";

const PORT = process.env.PORT || 3000;

function startServer() {
  try {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    process.on("SIGTERM", () => {
      console.log("Encerrando servidor...");
      server.close(() => {
        console.log("Servidor finalizado com segurança.");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
}

startServer();
