// axios.js
import axios from "axios";

// Crie uma instância do axios
const instance = axios.create({
  baseURL: "http://localhost:8080/api", // ou a URL base do seu backend
});

// Adicione um interceptor para incluir o token no header de cada requisição
instance.interceptors.request.use(
  (config) => {
    // Recupera o token armazenado localmente
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Trata o erro da requisição
    return Promise.reject(error);
  }
);

export default instance;
