/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
export class UserResponseDTO {
  constructor(user) {
    this.id = user.id;
    this.nome = user.nome;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;

    if (user.papeis) {
      this.papeis = user.papeis.map(p => p.papel.nome);
    }
  }
}
