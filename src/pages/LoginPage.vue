<template>
  <div class="auth-container">
    <Header :showSearch="false" />
    <div class="auth-content">
      <img src="@/assets/logo.png" alt="Login Icon" class="login-icon" />
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn-primary">Login</button>
        <button type="button" class="btn-secondary" @click="loginWithGoogle">
          Entrar com
          <img
            src="@/assets/google.png"
            alt="Google Icon"
            class="google-icon"
          />
        </button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <router-link to="/register" class="register-link">
        Não tem uma conta? Cadastre-se
      </router-link>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/stores/user";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const userStore = useUserStore();

const validateLogin = () => {
  errorMessage.value = "";
  const trimmedEmail = email.value.trim();
  const trimmedPassword = password.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errorMessage.value = "O campo email é obrigatório.";
    return false;
  }
  if (!emailRegex.test(trimmedEmail)) {
    errorMessage.value = "Por favor, insira um email válido.";
    return false;
  }
  if (!trimmedPassword) {
    errorMessage.value = "O campo senha é obrigatório.";
    return false;
  }
  if (trimmedPassword.length < 6) {
    errorMessage.value = "A senha deve ter no mínimo 6 caracteres.";
    return false;
  }
  return true;
};

const login = async () => {
  if (!validateLogin()) return;
  try {
    // Envia os dados para o backend
    const response = await axios.post(
      "http://localhost:8080/api/usuarios/login",
      {
        email: email.value,
        senha: password.value,
      }
    );
    // Supondo que o backend retorne um objeto com { token: "...." }
    const token = response.data.token;
    localStorage.setItem("token", token);
    // Armazena o token na store
    userStore.setToken(token);
    // Adicione logs para verificar as informações do token extraídas pela store
    console.log("Token armazenado:", token);
    console.log("Dados extraídos na store:");
    console.log("ID:", userStore.userId);
    console.log("Nome:", userStore.firstName);
    console.log("Sobrenome:", userStore.lastName);
    console.log("Email:", userStore.email);
    router.push("/");
  } catch (error) {
    console.error("Erro ao fazer login:", error.response || error);
    if (error.response && error.response.status === 401) {
      errorMessage.value =
        "Credenciais inválidas. Verifique seu email ou senha.";
    } else {
      errorMessage.value =
        "Ocorreu um erro ao fazer login. Por favor, tente novamente.";
    }
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "usuarios", user.uid);
    await setDoc(
      userRef,
      {
        userId: user.uid,
        nome: user.displayName,
        email: user.email,
        userPhoto: user.photoURL,
      },
      { merge: true }
    );
    // Para o login com Google, você pode optar por um fluxo específico.
    // Aqui, você redireciona para a página principal.
    router.push("/");
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error.message);
    errorMessage.value =
      "Ocorreu um erro ao fazer login com Google. Por favor, tente novamente.";
  }
};
</script>

<style scoped>
/* Seus estilos existentes para LoginPage permanecem */
.auth-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  margin-top: 10px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  box-sizing: border-box;
}

.auth-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  padding-bottom: 100px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

.login-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 0.5rem;
}

.form-group {
  width: 100%;
  margin-bottom: 0.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

input[type="email"],
input[type="password"],
button {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #333;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #000;
  border: 1px solid #ffffff;
}

.btn-secondary:hover {
  background-color: #fcfcfc;
  transform: scale(1.05);
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-left: 0.5rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.register-link {
  margin-top: 2rem;
  color: #007bff;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .auth-content {
    padding-top: 80px;
    padding-bottom: 80px;
  }
  .auth-form {
    max-width: 300px;
  }
  .login-icon {
    width: 100px;
    height: 100px;
  }
  input[type="email"],
  input[type="password"],
  button {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .auth-content {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .auth-form {
    max-width: 70%;
    padding: 0 1rem;
  }
  .login-icon {
    width: 80px;
    height: 80px;
  }
  input[type="email"],
  input[type="password"],
  button {
    padding: 0.5rem;
  }
}
</style>
