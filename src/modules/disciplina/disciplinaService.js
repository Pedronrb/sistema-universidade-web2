import { disciplinaRepository } from "./disciplinaRepository.js";
import { cursoService } from "../curso/cursoService.js"; // <--- NOVO IMPORT
import { HttpError } from "../../middlewares/HttpError.js";

class DisciplinaService {
  
  async getById(id) {
    const disciplina = await disciplinaRepository.findById(id);

    if (!disciplina) {
      throw new HttpError(404, "Disciplina não encontrada");
    }

    return disciplina;
  }
  
  async createDisciplina(data) {
    const { nome, codigo, cargaHoraria, cursoId } = data;

    if (!nome || !codigo || !cargaHoraria || !cursoId) {
      throw new HttpError(400, "Todos os campos são obrigatórios: nome, codigo, cargaHoraria, cursoId.");
    }
    
    const idCursoInt = Number.parseInt(cursoId);
    if (Number.isNaN(idCursoInt)) {
        throw new HttpError(400, "cursoId inválido. Deve ser um número.");
    }

    try {
        await cursoService.getById(idCursoInt);
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
            throw new HttpError(404, `Curso com ID ${cursoId} não encontrado. Não é possível criar a disciplina.`);
        }
        throw error;
    }

    const disciplinaExiste = await disciplinaRepository.findByCodigo(codigo);
    if (disciplinaExiste) {
      throw new HttpError(409, "Já existe uma disciplina com este código");
    }

    return await disciplinaRepository.create({
      nome,
      codigo,
      cargaHoraria: Number.parseInt(cargaHoraria),
      cursoId: idCursoInt,
    });
  }

  
  async listDisciplinas() {
    return await disciplinaRepository.findAll();
  }
  
  async getDisciplinasByCurso(cursoId) {
    return await disciplinaRepository.findByCurso(cursoId);
  }

  async updateDisciplinas(id, data) {
    const disciplinaExiste = await this.getById(id)

    // Logica do código único
    if (data.codigo && data.codigo !== disciplinaExiste.codigo) {
      const codigoEmUso = await disciplinaRepository.findByCodigo(data.codigo);
      if (codigoEmUso) {
        throw new HttpError(409, "Já existe uma disciplina com este código");
      }
    }
    
    if (data.cursoId) {
        const novoCursoIdInt = Number.parseInt(data.cursoId);
        if (Number.isNaN(novoCursoIdInt)) {
            throw new HttpError(400, "cursoId inválido. Deve ser um número.");
        }
        try {
             await cursoService.getById(novoCursoIdInt);
        } catch (error) {
             if (error instanceof HttpError && error.status === 404) {
                throw new HttpError(404, `Novo Curso ID ${data.cursoId} não encontrado.`);
             }
             throw error;
        }
        data.cursoId = novoCursoIdInt;
    }

    if (data.cargaHoraria) {
      data.cargaHoraria = Number.parseInt(data.cargaHoraria);
    }

    return await disciplinaRepository.update(id, data);
  }

  async deleteDisciplina(id) {
    await this.getById(id);
    return await disciplinaRepository.delete(id);
  }
}

export const disciplinaService = new DisciplinaService();