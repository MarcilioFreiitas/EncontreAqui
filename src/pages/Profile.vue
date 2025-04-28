<template>
  <div class="profile-container">
    <!-- Componente Header -->
    <Header />

    <!-- Card de Perfil -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="user-avatar">
          <img src="@/assets/do-utilizador.png" alt="Foto de perfil" />
        </div>
        <div class="user-info">
          <h1 class="user-name">
            {{ userStore.firstName }} {{ userStore.lastName }}
          </h1>
          <p class="user-email">{{ userStore.email }}</p>
        </div>
        <button class="logout-button" @click="logout">Sair</button>
      </div>

      <div class="profile-body">
        <h2>Minhas Informações</h2>
        <form @submit.prevent="updateProfile" class="info-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nome</label>
              <input
                type="text"
                id="firstName"
                v-model="editableData.firstName"
                :disabled="!editMode"
                maxlength="50"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">Sobrenome</label>
              <input
                type="text"
                id="lastName"
                v-model="editableData.lastName"
                :disabled="!editMode"
                maxlength="50"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="editableData.email"
                :disabled="!editMode"
                maxlength="100"
                required
              />
            </div>
          </div>
          <div class="form-actions" v-if="!editMode">
            <button type="button" class="btn-edit" @click="enableEdit">
              Editar Informações
            </button>
            <button type="button" class="btn-recover" @click="recoverPassword">
              Recuperar Senha
            </button>
          </div>
          <div class="form-actions" v-else>
            <button type="submit" class="btn-save">Salvar Alterações</button>
            <button type="button" class="btn-cancel" @click="cancelEdit">
              Cancelar
            </button>
          </div>
          <p v-if="updateError" class="message error">{{ updateError }}</p>
          <p v-if="updateSuccess" class="message success">
            {{ updateSuccess }}
          </p>
        </form>
      </div>

      <!-- Seção de gerenciamento de anúncios -->
      <div class="ads-management">
        <h2>Gerenciar Anúncios</h2>
        <div class="ads-menu">
          <button @click="goToCadastro()" class="ads-button">
            <img src="@/assets/comercio.png" alt="Comércio" class="ads-icon" />
            Cadastrar Comércio
          </button>
          <button @click="goToCadastro('servicos')" class="ads-button">
            <img src="@/assets/servico.png" alt="Serviços" class="ads-icon" />
            Cadastrar Serviços
          </button>
          <button @click="goToCadastro('aluguels')" class="ads-button">
            <img src="@/assets/aluguel.png" alt="Aluguéis" class="ads-icon" />
            Cadastrar Aluguéis
          </button>
          <button @click="goToMeusAnuncios()" class="ads-button">
            <img src="@/assets/anuncios.png" alt="Anúncios" class="ads-icon" />
            Meus Anúncios
          </button>
        </div>
      </div>
    </div>

    <!-- Componente Footer -->
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import axiosInstance from "@/services/axios.js";

export default {
  name: "Profile",
  components: {
    Header,
    Footer,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    onMounted(() => {
      console.log("Dados da store no Profile:", {
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        email: userStore.email,
        isAuthenticated: userStore.isAuthenticated,
      });
      if (!userStore.isAuthenticated) {
        router.push("/login");
      } else {
        editableData.value = {
          firstName: userStore.firstName,
          lastName: userStore.lastName,
          email: userStore.email,
        };
      }
    });

    const editableData = ref({
      firstName: "",
      lastName: "",
      email: "",
    });
    const editMode = ref(false);
    const updateError = ref("");
    const updateSuccess = ref("");

    const enableEdit = () => {
      editMode.value = true;
    };

    const updateProfile = async () => {
      updateError.value = "";
      updateSuccess.value = "";

      // Validações básicas
      if (
        !editableData.value.firstName.trim() ||
        editableData.value.firstName.length > 50
      ) {
        updateError.value = "Nome inválido.";
        return;
      }
      if (
        !editableData.value.lastName.trim() ||
        editableData.value.lastName.length > 50
      ) {
        updateError.value = "Sobrenome inválido.";
        return;
      }
      if (
        !editableData.value.email.trim() ||
        editableData.value.email.length > 100
      ) {
        updateError.value = "Email inválido.";
        return;
      }

      try {
        const nomeCompleto = `${editableData.value.firstName.trim()} ${editableData.value.lastName.trim()}`;

        const payload = {
          nome: nomeCompleto,
          email: editableData.value.email.trim(),
        };

        // Usa a instância configurada que já possui o token no header
        await axiosInstance.patch(
          `/usuarios/${userStore.userId}/profile`,
          payload
        );

        updateSuccess.value = "Informações atualizadas com sucesso!";
        editMode.value = false;
        userStore.firstName = editableData.value.firstName.trim();
        userStore.lastName = editableData.value.lastName.trim();
        userStore.email = editableData.value.email.trim();
      } catch (err) {
        console.error("Erro ao atualizar perfil:", err.response || err);
        updateError.value = "Erro ao atualizar perfil. Tente novamente.";
      }
    };

    const cancelEdit = () => {
      editMode.value = false;
      updateError.value = "";
      updateSuccess.value = "";
      editableData.value = {
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        email: userStore.email,
      };
    };

    const logout = () => {
      userStore.logout();
      router.push("/login");
    };

    // Função para redirecionamento para a página de cadastro
    const goToCadastro = (category) => {
      if (typeof category !== "string" || category === "comercio") {
        router.push("/cadastrocomercio");
      } else if (category === "servicos") {
        router.push("/cadastroservico");
      } else if (category === "aluguels") {
        router.push("/cadastroaluguel");
      }
    };

    // Função para redireccionar para a página "Meus Anúncios".
    // Isso utiliza a rota nomeada "MeusAnuncios", que deve ser definida no seu router.
    const goToMeusAnuncios = () => {
      router.push({ path: "/meusanuncios" });
    };

    const recoverPassword = () => {
      router.push("/recover-password");
    };

    return {
      userStore,
      editableData,
      editMode,
      updateError,
      updateSuccess,
      enableEdit,
      updateProfile,
      cancelEdit,
      logout,
      recoverPassword,
      goToCadastro,
      goToMeusAnuncios,
    };
  },
};
</script>

<style scoped>
/* ===============================
   Base e Layout Principal
   =============================== */
.profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 1rem;
}

.profile-card {
  max-width: 900px;
  margin: 100px auto 2rem auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* ===============================
   Cabeçalho do Perfil
   =============================== */
.profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #2d3436 0%, #414856 100%);
  color: #fff;
}

.user-avatar {
  flex: 0 0 80px;
  height: 80px;
  margin-right: 1rem;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.user-info {
  flex: 1;
}

.user-info .user-name {
  font-size: 1.8rem;
  margin: 0;
}

.user-info .user-email {
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
}

.logout-button {
  flex: 0 0 auto;
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c0392b;
}

/* ===============================
   Corpo do Perfil e Formulário
   =============================== */
.profile-body {
  padding: 2rem;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* ===============================
   Botões do Formulário
   =============================== */
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-edit,
.btn-recover {
  background-color: #2d3436;
  color: #fff;
}

.btn-edit:hover,
.btn-recover:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.btn-save {
  background-color: #27ae60;
  color: #fff;
}

.btn-save:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.btn-cancel {
  background-color: #b2bec3;
  color: #333;
}

.btn-cancel:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

/* Mensagens de Feedback */
.message {
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.message.error {
  color: #e74c3c;
}

.message.success {
  color: #27ae60;
}

/* ===============================
   Gerenciamento de Anúncios
   =============================== */
.ads-management {
  padding: 2rem;
  border-top: 1px solid #eee;
}

.ads-management h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.ads-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.ads-button {
  flex: 1 1 200px;
  max-width: 250px;
  background-color: #000;
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ads-button:hover {
  background-color: #333;
  transform: scale(1.02);
}

/* Ícones dos Botões de Anúncios */
.ads-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  filter: brightness(0) invert(1);
}

/* ===============================
   Responsividade
   =============================== */
@media (max-width: 768px) {
  .profile-card {
    margin-top: 80px;
    margin-bottom: 1rem;
  }
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .user-avatar {
    margin-right: 0;
  }
  .user-avatar img {
    width: 70px;
    height: 70px;
  }
  .user-info .user-name {
    font-size: 1.5rem;
  }
  .profile-body,
  .ads-management {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .profile-card {
    margin: 20px auto;
  }
  .info-form {
    gap: 1rem;
  }
  .form-group {
    min-width: 100%;
  }
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
