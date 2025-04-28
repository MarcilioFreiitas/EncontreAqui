<template>
  <div class="cadastro-page">
    <Header :showSearch="false" />
    <div class="cadastro-comercio">
      <h1>Cadastrar Comércio</h1>

      <!-- Mensagem de sucesso -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitComercio" class="form-comercio">
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="comercio.titulo" required />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea
            id="descricao"
            v-model="comercio.descricao"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="enderecoCompleto">Endereço Completo:</label>
          <input
            type="text"
            id="enderecoCompleto"
            v-model="comercio.enderecoCompleto"
            required
          />
        </div>
        <div class="form-group">
          <label for="horarioFuncionamento"
            >Horário de Funcionamento (HH:MM-HH:MM):</label
          >
          <input
            type="text"
            id="horarioFuncionamento"
            v-model="comercio.horarioFuncionamento"
            pattern="^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$"
            required
          />
        </div>
        <div class="form-group">
          <label for="telefone">Telefone (+DD DDDDDDDDD):</label>
          <input
            type="text"
            id="telefone"
            v-model="comercio.telefone"
            pattern="^[+][0-9]{2} [0-9]{9}$"
            required
          />
        </div>
        <div class="form-group">
          <label for="website">Website:</label>
          <input type="url" id="website" v-model="comercio.website" />
        </div>
        <div class="form-group">
          <label for="tipoEstabelecimento">Tipo de Estabelecimento:</label>
          <input
            type="text"
            id="tipoEstabelecimento"
            v-model="comercio.tipoEstabelecimento"
            required
          />
        </div>
        <!-- Campo de Categoria -->
        <div class="form-group">
          <label for="categoria">Categoria:</label>
          <select id="categoria" v-model="comercio.categoria" required>
            <option value="">Selecione uma categoria</option>
            <!-- Opções originais -->
            <option value="Restaurante">Restaurante</option>
            <option value="Lanchonete">Lanchonete</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="Padaria">Padaria</option>
            <option value="Floricultura">Floricultura</option>
            <option value="Supermercado">Supermercado</option>
            <option value="Loja de Roupas">Loja de Roupas</option>
            <option value="Farmácia">Farmácia</option>
            <option value="Pet Shop">Pet Shop</option>
            <option value="Livraria">Livraria</option>
            <!-- Novas opções -->
            <option value="Autopeças">Autopeças</option>
            <option value="Eletrodomésticos">Eletrodomésticos</option>
            <option value="Móveis">Móveis</option>
            <option value="Jóias e Acessórios">Jóias e Acessórios</option>
            <option value="Papelaria">Papelaria</option>
            <option value="Bar e Pub">Bar e Pub</option>
            <option value="Sorveteria">Sorveteria</option>
            <option value="Informática">Informática</option>
            <option value="Fitness">Fitness</option>
            <option value="Casa de Carnes">Casa de Carnes</option>
          </select>
        </div>
        <!-- Upload de fotos -->
        <div class="form-group">
          <label for="fotos">Fotos (selecione uma ou mais):</label>
          <input type="file" id="fotos" @change="handleFiles" multiple />
        </div>
        <button type="submit" class="submit-button">Cadastrar Comércio</button>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>
import axiosInstance from "@/services/axios.js"; // Instância configurada do axios
import { ref } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useUserStore } from "@/stores/user";

export default {
  name: "CadastroComercio",
  components: { Header, Footer },
  setup() {
    const userStore = useUserStore();

    // Objeto do comércio (DTO) conforme esperado pelo backend
    const comercio = ref({
      titulo: "",
      descricao: "",
      enderecoCompleto: "",
      horarioFuncionamento: "",
      telefone: "",
      website: "",
      tipoEstabelecimento: "",
      categoria: "", // Novo campo categoria
      usuarioId: "",
      fotos: [],
    });

    const successMessage = ref("");

    // Guarda os arquivos selecionados do input type="file"
    const selectedFiles = ref([]);

    const handleFiles = (event) => {
      selectedFiles.value = Array.from(event.target.files);
    };

    const submitComercio = async () => {
      try {
        if (!userStore.userId) {
          console.error("Erro: o usuário deve estar autenticado.");
          return;
        }
        comercio.value.usuarioId = userStore.userId;

        // Upload das imagens
        const uploadedPhotoUrls = [];
        for (const file of selectedFiles.value) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", comercio.value.usuarioId);

          const uploadResponse = await axiosInstance.post(
            "/imagens/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          let uploadedUrl = "";
          if (typeof uploadResponse.data === "string") {
            const parts = uploadResponse.data.split(": ");
            uploadedUrl = parts.length > 1 ? parts[1].trim() : "";
          } else if (
            typeof uploadResponse.data === "object" &&
            uploadResponse.data.url
          ) {
            uploadedUrl = uploadResponse.data.url;
          }
          if (uploadedUrl) {
            uploadedPhotoUrls.push(uploadedUrl);
          }
        }
        comercio.value.fotos = uploadedPhotoUrls;

        // Cria o comércio
        const response = await axiosInstance.post("/comercios", comercio.value);
        console.log("Comércio cadastrado:", response.data);

        successMessage.value = "Comércio cadastrado com sucesso!";
        resetForm();
      } catch (error) {
        console.error("Erro ao cadastrar comércio:", error.response || error);
      }
    };

    const resetForm = () => {
      comercio.value = {
        titulo: "",
        descricao: "",
        enderecoCompleto: "",
        horarioFuncionamento: "",
        telefone: "",
        website: "",
        tipoEstabelecimento: "",
        categoria: "", // Reseta o campo categoria
        usuarioId: userStore.userId,
        fotos: [],
      };
      selectedFiles.value = [];
    };

    return { comercio, handleFiles, submitComercio, successMessage };
  },
};
</script>

<style scoped>
.cadastro-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
}

.cadastro-comercio {
  max-width: 800px;
  margin: 5rem auto 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.cadastro-comercio h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d3436;
}

.success-message {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #219150;
}

@media (max-width: 768px) {
  .cadastro-comercio {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .cadastro-comercio {
    margin: 1rem;
  }
}
</style>
