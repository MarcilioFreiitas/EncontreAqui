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
      <router-link to="/register" class="register-link"
        >Não tem uma conta? Cadastre-se</router-link
      >
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "LoginPage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        if (error.code === "auth/wrong-password") {
          this.errorMessage = "Senha incorreta. Por favor, tente novamente.";
        } else if (error.code === "auth/user-not-found") {
          this.errorMessage = "Usuário não encontrado. Por favor, cadastre-se.";
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage =
            "Email inválido. Por favor, insira um email válido.";
        } else {
          this.errorMessage =
            "Ocorreu um erro ao fazer login. Por favor, tente novamente.";
        }
      }
    },
    async loginWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Salvar informações do usuário no Firestore
        const userRef = doc(db, "usuarios", user.uid);
        await setDoc(
          userRef,
          {
            userId: user.uid,
            nome: user.displayName,
            email: user.email,
            userPhoto: user.photoURL, // Adicionar a URL da foto do usuário
          },
          { merge: true }
        );

        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao fazer login com Google:", error.message);
        this.errorMessage =
          "Ocorreu um erro ao fazer login com Google. Por favor, tente novamente.";
      }
    },
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
  padding-top: 100px; /* Ajuste para a altura do header */
  padding-bottom: 100px; /* Ajuste para a altura do footer */
}

.auth-form {
  width: 100%; /* Garante que o formulário ocupe 100% da largura disponível */
  max-width: 400px; /* Define um limite máximo de largura */
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
  margin-bottom: 0.5rem; /* Ajuste o espaço abaixo do ícone */
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
  width: 100%; /* Garante que os botões e inputs ocupem 100% da largura do form */
  box-sizing: border-box; /* Inclui padding e border na largura total */
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 1rem;
}

input[type="email"],
input[type="password"] {
  margin-top: 0; /* Remove a margem superior dos inputs */
}

button {
  cursor: pointer;
  border: none; /* Remove a borda padrão */
  transition: transform 0.2s ease; /* Adiciona transição para o efeito hover */
}

.btn-primary {
  background-color: #000;
  color: #fff;
  border: 1px solid #000; /* Adiciona borda preta */
}

.btn-primary:hover {
  background-color: #333; /* Efeito hover */
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #000; /* Define a cor do texto para preto */
  border: 1px solid #ffffff;
}

.btn-secondary:hover {
  background-color: #fcfcfc;
  transform: scale(1.05); /* Aumenta o tamanho do botão e do conteúdo em 5% */
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-left: 0.5rem; /* Adiciona espaço entre o texto e o ícone */
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.register-link {
  margin-top: 2rem; /* Aumentado o espaço entre o form e o footer */
  color: #007bff;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .auth-content {
    padding-top: 80px; /* Ajuste para a altura do header */
    padding-bottom: 80px; /* Ajuste para a altura do footer */
  }

  .auth-form {
    max-width: 300px; /* Reduzir o limite máximo de largura */
  }

  .login-icon {
    width: 100px; /* Reduzir tamanho do ícone */
    height: 100px;
  }

  input[type="email"],
  input[type="password"],
  button {
    padding: 0.5rem; /* Reduzir o padding */
    font-size: 0.9rem; /* Reduzir o tamanho da fonte */
  }
}

@media (max-width: 480px) {
  .auth-content {
    padding-top: 60px; /* Ajuste para a altura do header */
    padding-bottom: 60px; /* Ajuste para a altura do footer */
  }

  .auth-form {
    max-width: 70%; /* Ocupa toda a largura disponível */
    padding: 0 1rem; /* Adicionar padding lateral */
  }

  .login-icon {
    width: 80px; /* Reduzir ainda mais o tamanho do ícone */
    height: 80px;
  }

  input[type="email"],
  input[type="password"],
  button {
    padding: 0.5rem; /* Manter o padding reduzido */
    /* Reduzir ainda mais o tamanho da fonte */
  }
}
</style>
