export function errorMiddleware(err, req, res, next) {
  console.error("ERRO CAPTURADO:", err);

  const status = err?.status || (err instanceof SyntaxError ? 400 : 500);

  return res.status(status).json({
    success: false,
    error: err?.message || "Erro interno do servidor",
  });
}
