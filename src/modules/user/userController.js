import { userService } from "./userService.js";
import { CreateUserDTO } from "./dto/CreateUserDTO.js";
import { UpdateUserDTO } from "./dto/UpdateUserDTO.js";
import { UserResponseDTO } from "./dto/UserResponseDTO.js";

export const userController = {
  async listAll(req, res, next) {
    try {
      const users = await userService.listAll();
      return res.json({
        success: true,
        data: users.map(u => new UserResponseDTO(u))
      });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getById(id);
      return res.json({
        success: true,
        data: new UserResponseDTO(user)
      });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const dto = new CreateUserDTO(req.body);
      const user = await userService.create(dto);
      return res.status(201).json({
        success: true,
        data: new UserResponseDTO(user)
      });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      const dto = new UpdateUserDTO(req.body);
      const user = await userService.update(id, dto);
      return res.json({
        success: true,
        data: new UserResponseDTO(user)
      });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      await userService.delete(id);
      return res.status(204).send();
    } catch (err) { next(err); }
  }
};