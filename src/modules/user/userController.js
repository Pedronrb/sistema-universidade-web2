import { userService } from "./userService.js";
import { CreateUserDTO } from "./dto/CreateUserDTO.js";
import { UpdateUserDTO } from "./dto/UpdateUserDTO.js";
import { UserResponseDTO } from "./dto/UserResponseDTO.js";

export const userController = {
  async listAll(req, res, next) {
    try {
      const users = await userService.listAll();
      res.json({ success: true, data: users.map(u => new UserResponseDTO(u)) });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const user = await userService.getById(Number(req.params.id));
      res.json({ success: true, data: new UserResponseDTO(user) });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const dto = new CreateUserDTO(req.body);
      const user = await userService.create(dto);
      res.status(201).json({ success: true, data: new UserResponseDTO(user) });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const dto = new UpdateUserDTO(req.body);
      const user = await userService.update(Number(req.params.id), dto);
      res.json({ success: true, data: new UserResponseDTO(user) });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      await userService.delete(Number(req.params.id));

      res.status(200).json({
        success: true,
        message: "Usuário deletado com sucesso!"
      });
    } catch (err) {
      next(err);
    }
  }
};
