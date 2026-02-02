import { userController } from "../../src/modules/user/userController.js";
import { userService } from "../../src/modules/user/userService.js";

jest.mock("../../src/modules/user/userService.js");

describe("UserController - Unit Tests", () => {
  const mockRes = () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    return res;
  };
  const next = jest.fn();

  test("Sucesso: Deve converter ID de string para number e retornar usuário", async () => {
    const req = { params: { id: "10" } };
    const res = mockRes();
    userService.getById.mockResolvedValue({ id: 10, nome: "João" });

    await userController.getById(req, res, next);

    expect(userService.getById).toHaveBeenCalledWith(10); // Verificação do tipo Number
    expect(res.json).toHaveBeenCalled();
  });

  test("Erro: Deve capturar erro do Service e passar para o middleware via next", async () => {
    const req = { params: { id: "1" } };
    const error = new Error("Database error");
    userService.getById.mockRejectedValue(error);

    await userController.getById(req, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});