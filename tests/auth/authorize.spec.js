import { authorize } from "../../src/middlewares/authorize.js";

describe("Authorize Middleware - Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    res = {};
    next = jest.fn();
  });

  test("Deve permitir acesso se o usuário tiver o papel necessário", () => {
    req = { user: { papeis: ["admin", "aluno"] } };
    const middleware = authorize(["admin"]);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  test("Deve negar acesso (403) se o usuário não tiver o papel", () => {
    req = { user: { papeis: ["aluno"] } };
    const middleware = authorize(["admin"]);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });

  test("Deve negar acesso se o objeto de usuário ou papéis não existir", () => {
    req = { user: {} };
    const middleware = authorize(["admin"]);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });
});