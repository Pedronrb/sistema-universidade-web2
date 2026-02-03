import { userController } from "../../src/modules/user/userController.js";
import { userService } from "../../src/modules/user/userService.js";
import { UserResponseDTO } from "../../src/modules/user/dto/UserResponseDTO.js";

jest.mock("../../src/modules/user/userService.js");

describe("UserController - Unit Tests", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
  };
  const next = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("listAll - Deve retornar lista de usuários", async () => {
    const res = mockRes();
    userService.listAll.mockResolvedValue([{ id: 1, nome: "Teste", papeis: [] }]);
    
    await userController.listAll({}, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("getById - Deve retornar um usuário por ID", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();
    userService.getById.mockResolvedValue({ id: 1, nome: "User", papeis: [] });

    await userController.getById(req, res, next);
    expect(userService.getById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalled();
  });

  test("create - Deve criar usuário e retornar 201", async () => {
    const req = { body: { nome: "Novo", email: "n@e.com", senha: "123" } };
    const res = mockRes();
    userService.create.mockResolvedValue({ id: 1, ...req.body, papeis: [] });

    await userController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("update - Deve atualizar usuário", async () => {
    const req = { params: { id: "1" }, body: { nome: "Editado" } };
    const res = mockRes();
    userService.update.mockResolvedValue({ id: 1, nome: "Editado", papeis: [] });

    await userController.update(req, res, next);
    expect(res.json).toHaveBeenCalled();
  });

  test("delete - Deve deletar e retornar 204", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();
    
    await userController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("Error Handling - Deve passar erro para o next", async () => {
    const req = { params: { id: "1" } };
    userService.getById.mockRejectedValue(new Error("DB Error"));

    await userController.getById(req, {}, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});