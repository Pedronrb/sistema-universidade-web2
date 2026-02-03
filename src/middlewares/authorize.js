import { HttpError } from "./HttpError.js";
export const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return next(new HttpError(401, "Usuário não autenticado"));

  const userRoles = req.user.papeis || [];
  // Verifica se o usuário tem pelo menos um dos papéis necessários
  const hasRole = roles.some(role => userRoles.includes(role));

  if (!hasRole) {
    return next(new HttpError(403, `Acesso negado. Requer um dos papéis: ${roles.join(", ")}`));
  }

  next();
};