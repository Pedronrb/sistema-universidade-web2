/*
  Warnings:

  - A unique constraint covering the columns `[matriculaId,data]` on the table `Frequencia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId,turmaId]` on the table `Matricula` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matriculaId,etapa]` on the table `Nota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Papel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo,periodo]` on the table `Turma` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Frequencia_matriculaId_data_key" ON "Frequencia"("matriculaId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_usuarioId_turmaId_key" ON "Matricula"("usuarioId", "turmaId");

-- CreateIndex
CREATE UNIQUE INDEX "Nota_matriculaId_etapa_key" ON "Nota"("matriculaId", "etapa");

-- CreateIndex
CREATE UNIQUE INDEX "Papel_nome_key" ON "Papel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_codigo_periodo_key" ON "Turma"("codigo", "periodo");
