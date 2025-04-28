import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    userId: "", // Nova propriedade para armazenar o id do usuário
    firstName: "",
    lastName: "",
    email: "",
    isAuthenticated: false,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Armazena o id do usuário (aqui usamos "id" – ajuste conforme o claim do seu token)
          this.userId = decoded.id || decoded.sub || "";

          // Para o nome, se existir "firstName" use-o; senão, use "name"
          const fullName = decoded.firstName || decoded.name || "";
          if (fullName) {
            const names = fullName.split(" ");
            this.firstName = names.shift() || "";
            this.lastName = names.join(" ") || "";
          }
          // Para o email, utiliza "email" se existir, ou "sub" caso o token use este claim para o email
          this.email = decoded.email || decoded.sub || "";

          this.isAuthenticated = true;
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          this.reset();
        }
      } else {
        this.reset();
      }
    },
    reset() {
      this.token = null;
      this.userId = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.isAuthenticated = false;
    },
    logout() {
      this.reset();
      localStorage.removeItem("token");
    },
  },
});
