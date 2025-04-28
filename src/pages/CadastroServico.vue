<template>
  <div class="cadastro-page">
    <Header :showSearch="false" />
    <div class="cadastro-servico">
      <h1>Cadastrar Serviço</h1>

      <!-- Exibe mensagem de sucesso, se houver -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitServico" class="form-servico">
        <!-- Campos comuns -->
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="servico.titulo" required />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea
            id="descricao"
            v-model="servico.descricao"
            required
          ></textarea>
        </div>
        <!-- Campos específicos do serviço -->
        <div class="form-group">
          <label for="preco">Preço:</label>
          <input
            type="number"
            id="preco"
            v-model="servico.preco"
            step="0.01"
            required
          />
        </div>
        <div class="form-group">
          <label for="categoria">Categoria:</label>
          <input
            type="text"
            id="categoria"
            v-model="servico.categoria"
            required
          />
        </div>
        <div class="form-group">
          <label for="localizacao">Localização:</label>
          <input
            type="text"
            id="localizacao"
            v-model="servico.localizacao"
            required
          />
        </div>
        <!-- Campos específicos técnicos -->
        <div class="form-group">
          <label for="areaAtuacao">Área de Atuação:</label>
          <input
            type="text"
            id="areaAtuacao"
            v-model="servico.areaAtuacao"
            required
          />
        </div>
        <div class="form-group">
          <label for="tempoMedioAtendimento"
            >Tempo Médio de Atendimento (min):</label
          >
          <input
            type="number"
            id="tempoMedioAtendimento"
            v-model="servico.tempoMedioAtendimento"
            required
          />
        </div>
        <div class="form-group">
          <label for="necessitaAgendamento">Necessita Agendamento?</label>
          <select
            id="necessitaAgendamento"
            v-model="servico.necessitaAgendamento"
            required
          >
            <option value="" disabled>Selecione</option>
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div class="form-group">
          <label for="profissionalResponsavel">Profissional Responsável:</label>
          <input
            type="text"
            id="profissionalResponsavel"
            v-model="servico.profissionalResponsavel"
            required
          />
        </div>
        <!-- Upload de fotos -->
        <div class="form-group">
          <label for="fotos">Fotos (selecione uma ou mais):</label>
          <input type="file" id="fotos" @change="handleFiles" multiple />
        </div>

        <button type="submit" class="submit-button">Cadastrar Serviço</button>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>
import axiosInstance from "@/services/axios.js";
import { ref } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useUserStore } from "@/stores/user";

export default {
  name: "CadastroServico",
  components: { Header, Footer },
  setup() {
    // Acessa a store do usuário para obter o userId (o usuário deve estar autenticado)
    const userStore = useUserStore();

    // Objeto inicial de serviço de acordo com o DTO
    const servico = ref({
      id: null,
      titulo: "",
      descricao: "",
      preco: null,
      categoria: "",
      localizacao: "",
      areaAtuacao: "",
      tempoMedioAtendimento: null,
      necessitaAgendamento: null,
      profissionalResponsavel: "",
      usuarioId: "", // Será definido a partir da store – sem valor default
      fotos: [], // Array de URLs
    });

    const selectedFiles = ref([]);
    const successMessage = ref("");

    const handleFiles = (event) => {
      selectedFiles.value = Array.from(event.target.files);
    };

    const submitServico = async () => {
      try {
        // Verifica se o usuário está autenticado
        if (!userStore.userId) {
          console.error(
            "Erro: usuário não autenticado. Nenhum userId encontrado."
          );
          return;
        }
        // Atribui o userId do usuário ao objeto serviço
        servico.value.usuarioId = userStore.userId;

        // Realiza o upload das imagens e coleta as URLs
        const uploadedPhotoUrls = [];
        for (const file of selectedFiles.value) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", servico.value.usuarioId);
          const response = await axiosInstance.post(
            "/imagens/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          // Verifica se a resposta é uma string ou um objeto
          let uploadedUrl = "";
          if (typeof response.data === "string") {
            const parts = response.data.split(": ");
            uploadedUrl = parts.length > 1 ? parts[1].trim() : "";
          } else if (typeof response.data === "object" && response.data.url) {
            uploadedUrl = response.data.url;
          }
          if (uploadedUrl) {
            uploadedPhotoUrls.push(uploadedUrl);
          }
        }
        // Define o array de URLs no objeto serviço
        servico.value.fotos = uploadedPhotoUrls;

        // Envia o objeto completo para o endpoint de criação
        const result = await axiosInstance.post("/servicos", servico.value);
        console.log("Serviço cadastrado:", result.data);
        successMessage.value = "Serviço cadastrado com sucesso!";
        resetForm();
      } catch (error) {
        console.error("Erro ao cadastrar serviço:", error.response || error);
      }
    };

    const resetForm = () => {
      servico.value = {
        id: null,
        titulo: "",
        descricao: "",
        preco: null,
        categoria: "",
        localizacao: "",
        areaAtuacao: "",
        tempoMedioAtendimento: null,
        necessitaAgendamento: null,
        profissionalResponsavel: "",
        usuarioId: userStore.userId, // mantém o id do usuário autenticado
        fotos: [],
      };
      selectedFiles.value = [];
    };

    return { servico, handleFiles, submitServico, successMessage };
  },
};
</script>

<style scoped>
/* Container da página */
.cadastro-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
}

/* Card do formulário */
.cadastro-servico {
  max-width: 800px;
  margin: 5rem auto 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Título */
.cadastro-servico h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d3436;
}

/* Mensagem de sucesso */
.success-message {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}

/* Grupos de formulário */
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

/* Botão de submit */
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

/* Responsividade */
@media (max-width: 768px) {
  .cadastro-servico {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .cadastro-servico {
    margin: 1rem;
  }
}
</style>
