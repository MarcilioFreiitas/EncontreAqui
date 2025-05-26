// src/stores/user.js
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "", // ← novo campo
    isAuthenticated: false,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.userId = decoded.id || decoded.sub || "";

          const fullName = decoded.firstName || decoded.name || "";
          if (fullName) {
            const names = fullName.split(" ");
            this.firstName = names.shift() || "";
            this.lastName = names.join(" ") || "";
          }

          this.email = decoded.email || decoded.sub || "";
          this.role = decoded.role || ""; // ← pega o claim "role"

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
      this.role = ""; // ← limpa também
      this.isAuthenticated = false;
    },
    logout() {
      this.reset();
      localStorage.removeItem("token");
    },
  },
});
