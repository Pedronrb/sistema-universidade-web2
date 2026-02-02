import { authService } from "./authService.js";
import { LoginDTO } from "./dto/LoginDTO.js";

export const authController = {

  async login(req, res, next) {
    try {
      const dto = new LoginDTO(req.body);
      const result = await authService.login(dto);

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: result.user,
        token: result.token
      });
    } catch (err) {
      next(err);
    }
  }
};
