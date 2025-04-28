<template>
  <div class="auth-container">
    <Header :showSearch="false" />
    <div class="auth-content">
      <img src="@/assets/logo.png" alt="Register Icon" class="login-icon" />
      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <label for="firstName">Nome</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            required
            maxlength="50"
            size="30"
          />
        </div>
        <div class="form-group">
          <label for="lastName">Sobrenome</label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            required
            maxlength="50"
            size="30"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            maxlength="100"
            size="30"
          />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            maxlength="30"
            size="30"
          />
        </div>
        <button type="submit" class="btn-primary">Cadastrar</button>
        <!-- Botão para cadastro com Google -->
        <button type="button" class="btn-secondary" @click="registerWithGoogle">
          Entrar com
          <img
            src="@/assets/google.png"
            alt="Google Icon"
            class="google-icon"
          />
        </button>
      </form>
      <router-link to="/login" class="register-link">
        Já tem uma conta? Faça login
      </router-link>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
    <Footer />
  </div>
</template>

<script>
// Importa os componentes e bibliotecas necessárias
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

// Importações para o fluxo de cadastro com Google via Firebase
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  name: "RegisterPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    // Propriedades reativas para o cadastro via backend
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    // Para o fluxo com Google via Firebase
    const auth = getAuth();
    const db = getFirestore();

    // Função de validação para garantir que os dados sejam válidos e não excedam os limites
    const validateRegistration = () => {
      error.value = "";
      const fName = firstName.value.trim();
      const lName = lastName.value.trim();
      const e = email.value.trim();
      const pwd = password.value.trim();

      // Limites de caracteres
      const maxNameLength = 50;
      const maxEmailLength = 100;
      const maxPasswordLength = 30;

      // Regex simples para validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!fName) {
        error.value = "O campo 'Nome' é obrigatório.";
        return false;
      }
      if (fName.length > maxNameLength) {
        error.value = "Nome não pode exceder 50 caracteres.";
        return false;
      }
      if (!lName) {
        error.value = "O campo 'Sobrenome' é obrigatório.";
        return false;
      }
      if (lName.length > maxNameLength) {
        error.value = "Sobrenome não pode exceder 50 caracteres.";
        return false;
      }
      if (!e) {
        error.value = "O campo 'Email' é obrigatório.";
        return false;
      }
      if (e.length > maxEmailLength) {
        error.value = "Email não pode exceder 100 caracteres.";
        return false;
      }
      if (!emailRegex.test(e)) {
        error.value = "Por favor, insira um email válido.";
        return false;
      }
      if (!pwd) {
        error.value = "O campo 'Senha' é obrigatório.";
        return false;
      }
      if (pwd.length < 6) {
        error.value = "A senha deve ter no mínimo 6 caracteres.";
        return false;
      }
      if (pwd.length > maxPasswordLength) {
        error.value = "A senha não pode exceder 30 caracteres.";
        return false;
      }
      return true;
    };

    // Função para cadastro via backend Spring Boot
    const register = async () => {
      if (!validateRegistration()) {
        return;
      }
      try {
        const payload = {
          nome: `${firstName.value.trim()} ${lastName.value.trim()}`,
          email: email.value.trim(),
          senha: password.value.trim(),
          role: "CLIENTE", // Define o role padrão
        };

        // Realiza a chamada para o endpoint de registro
        await axios.post(
          "http://localhost:8080/api/usuarios/registro",
          payload
        );

        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      } catch (err) {
        console.error("Erro ao fazer cadastro:", err.response || err);
        error.value = "Erro ao fazer cadastro. Por favor, tente novamente.";
      }
    };

    // Função para cadastro com Google via Firebase
    const registerWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await setDoc(
          doc(db, "usuarios", user.uid),
          {
            userId: user.uid,
            nome: user.displayName,
            email: user.email,
          },
          { merge: true }
        );

        alert("Cadastro realizado com Google com sucesso!");
        await signOut(auth);
        router.push("/login");
      } catch (err) {
        console.error(
          "Erro ao fazer cadastro com Google:",
          err.response || err
        );
        error.value =
          "Erro ao fazer cadastro com Google. Por favor, tente novamente.";
      }
    };

    return {
      firstName,
      lastName,
      email,
      password,
      error,
      register,
      registerWithGoogle,
    };
  },
};
</script>

<style scoped>
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
  width: 75%;
  max-width: 400px;
  box-sizing: border-box;
}

footer {
  bottom: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
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

input[type="text"],
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
  border: 1px solid #ccc;
  margin-top: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
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

.register-link {
  margin-top: 2rem;
  color: #007bff;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 1rem;
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
  input[type="text"],
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
    max-width: 100%;
    padding: 0 1rem;
  }
  .login-icon {
    width: 80px;
    height: 80px;
  }
  input[type="text"],
  input[type="email"],
  input[type="password"],
  button {
    padding: 0.5rem;
  }
}
</style>
