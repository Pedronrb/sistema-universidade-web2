// src/modules/turma/turmaService.js

import { turmaRepository } from "./turmaRepository.js";
import { disciplinaService } from "../disciplina/disciplinaService.js"; // Para validar Disciplina
import { userService } from "../user/userService.js";                 // Para validar Professor
import { HttpError } from "../../middlewares/HttpError.js";           // Para tratamento de erros

class TurmaService {
  
  async getById(id) {
    const turma = await turmaRepository.findById(id);

    if (!turma) {
      throw new HttpError(404, "Turma não encontrada");
    }
    return turma;
  }
  
  async createTurma(data) {
    const { codigo, disciplinaId, professorId, periodo } = data;
    const PAPEL_PROFESSOR = "Professor";

    if (!codigo || !disciplinaId || !professorId || !periodo) {
      throw new HttpError(400, "Todos os campos (codigo, disciplinaId, professorId, periodo) são obrigatórios.");
    }
    
    const idDisciplinaInt = Number.parseInt(disciplinaId);
    const idProfessorInt = Number.parseInt(professorId);
    if (Number.isNaN(idDisciplinaInt) || Number.isNaN(idProfessorInt)) {
        throw new HttpError(400, "Os IDs de disciplina e professor devem ser números válidos.");
    }

    try {
        await disciplinaService.getById(idDisciplinaInt);
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
            throw new HttpError(404, `Disciplina com ID ${disciplinaId} não encontrada.`);
        }
        throw error;
    }

    let professor;
    try {
        professor = await userService.getByIdWithRoles(idProfessorInt); 
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
            throw new HttpError(404, `Professor com ID ${professorId} não encontrado.`);
        }
        throw error;
    }
    
    const isProfessor = professor.papeis.some(
        up => up.papel.nome === PAPEL_PROFESSOR
    );
    
    if (!isProfessor) {
        throw new HttpError(403, `Usuário ${professorId} não possui o papel '${PAPEL_PROFESSOR}' e não pode ministrar a turma.`);
    }

    return await turmaRepository.create({
      codigo,
      disciplinaId: idDisciplinaInt,
      professorId: idProfessorInt,
      periodo,
    });
  }
  
  // Metodos de leitura e update
  
  async listTurmas() {
    return await turmaRepository.findAll();
  }

  async listTurmasByProfessor(professorId) {
    return await turmaRepository.findByProfessor(professorId);
  }

  async listTurmasByDisciplina(disciplinaId) {
    return await turmaRepository.findByDisciplina(disciplinaId);
  }
  
  async updateTurma(id, data) {
    await this.getById(id); 

    if (data.disciplinaId) {
       const idDisciplinaInt = Number.parseInt(data.disciplinaId);

       if (Number.isNaN(idDisciplinaInt))
        throw new HttpError(400, "disciplinaId inválido.");

       try {
            await disciplinaService.getById(idDisciplinaInt);
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                 throw new HttpError(404, "Nova Disciplina não encontrada.");
            }
            throw error;
        }
        data.disciplinaId = idDisciplinaInt;
      }

      if (data.professorId) {
        const idProfessorInt = Number.parseInt(data.professorId);
        if (Number.isNaN(idProfessorInt)) throw new HttpError(400, "professorId inválido.");
        
        try {
            const professor = await userService.getByIdWithRoles(idProfessorInt);
            const isProfessor = professor.papeis.some(up => up.papel.nome === 'Professor');
            if (!isProfessor) {
                throw new HttpError(403, `Usuário ${idProfessorInt} não possui o papel 'Professor'.`);
            }
        } catch (e) {
            if (e.status === 404) throw new HttpError(404, "Novo Professor não encontrado.");
            throw e;
        }
        data.professorId = idProfessorInt;
    }
    return await turmaRepository.update(id, data);
  }

  async deleteTurma(id) {
    await this.getById(id); 
    return await turmaRepository.delete(id);
  }
}

export const turmaService = new TurmaService();