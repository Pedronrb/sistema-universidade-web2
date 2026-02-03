import jwt from "jsonwebtoken";
import { authenticate } from "../../src/middlewares/authMiddleware.js";
import { HttpError } from "../../src/middlewares/HttpError.js";

describe("AuthMiddleware - Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = {};
    next = jest.fn();
  });

  test("Deve lançar erro 401 se o header Authorization não existir", () => {
    req.header.mockReturnValue(null);
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    expect(next.mock.calls[0][0].status).toBe(401);
  });

  test("Deve lançar erro 401 se o token estiver vazio após o Bearer", () => {
    req.header.mockReturnValue("Bearer ");
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Token inválido" }));
  });

  test("Deve autenticar e anexar o usuário no req se o token for válido", () => {
    const mockUser = { id: 1, nome: "Teste" };
    const token = jwt.sign(mockUser, process.env.JWT_SECRET || "mysecretkey");
    req.header.mockReturnValue(`Bearer ${token}`);

    authenticate(req, res, next);

    expect(req.user).toMatchObject(mockUser);
    expect(next).toHaveBeenCalledWith(); // Chamado sem erro
  });

  test("Deve lançar erro 401 se o token for expirado ou malformado", () => {
    req.header.mockReturnValue("Bearer token-invalido");
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });
});