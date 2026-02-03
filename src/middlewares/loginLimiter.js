import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Muitas tentativas de login. Tente novamente me 1 minuto."
  standardHeaders: true,
  legacyHeaders: false,
});
