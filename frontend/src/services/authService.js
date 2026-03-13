import api from "../api/api";

export const authService = {
  /**
   * Realiza a autenticação no backend
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise} Dados do usuário e token
   */
  login: async (email, senha) => {
    try {
      // Faz a chamada POST para o backend (rota /auth/login)
      const response = await api.post("/auth/login", { email, senha });

      // Verifica se a resposta foi bem-sucedida baseada na estrutura do seu backend
      if (response.data.success) {
        return response.data.data; // Retorna { usuario: {...}, token: "..." }
      } else {
        throw new Error(response.data.message || "Falha na autenticação");
      }
    } catch (error) {
      // Trata erros de rede ou 401/403 do backend
      console.error("Erro no authService:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Remove as credenciais e limpa o estado (utilitário adicional)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};