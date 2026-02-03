import { errorMiddleware } from "../../src/middlewares/errorMiddleware.js";
import { HttpError } from "../../src/middlewares/HttpError.js";

describe("ErrorMiddleware - Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    // Silencia o console.error durante os testes para manter o terminal limpo
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Deve usar o status e a mensagem do HttpError", () => {
    const error = new HttpError(404, "Recurso não encontrado");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Recurso não encontrado",
    });
  });

  test("Deve retornar status 400 para erros de SyntaxError (JSON malformado)", () => {
    const error = new SyntaxError("Unexpected token } in JSON at position 10");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: error.message,
      })
    );
  });

  test("Deve retornar status 500 para erros genéricos sem status definido", () => {
    const error = new Error("Erro de banco de dados");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Erro de banco de dados",
    });
  });

  test("Deve usar mensagem padrão se o erro não tiver mensagem", () => {
    const error = {}; // Erro sem nada

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Erro interno do servidor",
      })
    );
  });
});