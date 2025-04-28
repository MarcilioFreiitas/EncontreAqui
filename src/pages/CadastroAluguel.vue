<template>
  <div class="cadastro-page">
    <Header :showSearch="false" />
    <div class="cadastro-aluguel">
      <h1>Cadastrar Anúncio de Aluguel</h1>

      <!-- Mensagem de sucesso -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitAluguel" class="form-aluguel">
        <!-- Campos comuns -->
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="aluguel.titulo" required />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea
            id="descricao"
            v-model="aluguel.descricao"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="enderecoCompleto">Endereço Completo:</label>
          <input
            type="text"
            id="enderecoCompleto"
            v-model="aluguel.enderecoCompleto"
            required
          />
        </div>

        <!-- Novo campo de Categoria -->
        <div class="form-group">
          <label for="categoria">Categoria:</label>
          <select id="categoria" v-model="aluguel.categoria" required>
            <option value="">Selecione uma categoria</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Escritório">Escritório</option>
            <option value="Condomínio">Condomínio</option>
            <option value="Loja">Loja</option>
            <option value="Terreno">Terreno</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Sala Comercial">Sala Comercial</option>
            <option value="Galpão">Galpão</option>
            <option value="Fazenda">Fazenda</option>
            <option value="Chácara">Chácara</option>
            <option value="Kitnet">Kitnet</option>
            <option value="Loja/Salão">Loja/Salão</option>
            <option value="Pavilhão">Pavilhão</option>
            <option value="Solar">Solar</option>
            <option value="Imóvel de Luxo">Imóvel de Luxo</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <!-- Campos específicos do anúncio de aluguel -->
        <div class="form-group">
          <label for="valorAluguel">Valor do Aluguel:</label>
          <input
            type="number"
            step="0.01"
            id="valorAluguel"
            v-model="aluguel.valorAluguel"
            required
          />
        </div>
        <div class="form-group">
          <label for="numeroDeBanheiros">Número de Banheiros:</label>
          <input
            type="number"
            id="numeroDeBanheiros"
            v-model="aluguel.numeroDeBanheiros"
            required
          />
        </div>
        <div class="form-group">
          <label for="numeroDeVagas">Número de Vagas:</label>
          <input
            type="number"
            id="numeroDeVagas"
            v-model="aluguel.numeroDeVagas"
            required
          />
        </div>
        <div class="form-group">
          <label for="dataDisponibilidade">Data de Disponibilidade:</label>
          <input
            type="date"
            id="dataDisponibilidade"
            v-model="aluguel.dataDisponibilidade"
            required
          />
        </div>
        <div class="form-group">
          <label for="status">Status:</label>
          <select id="status" v-model="aluguel.status" required>
            <option value="" disabled>Selecione o status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <!-- Campos técnicos do imóvel -->
        <div class="form-group">
          <label for="numeroDeQuartos">Número de Quartos:</label>
          <input
            type="number"
            id="numeroDeQuartos"
            v-model="aluguel.numeroDeQuartos"
            required
          />
        </div>
        <div class="form-group">
          <label for="areaEmM2">Área (m²):</label>
          <input
            type="number"
            step="0.1"
            id="areaEmM2"
            v-model="aluguel.areaEmM2"
            required
          />
        </div>
        <div class="form-group">
          <label for="mobiliado">Mobiliado?</label>
          <select id="mobiliado" v-model="aluguel.mobiliado" required>
            <option value="" disabled>Selecione</option>
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div class="form-group">
          <label for="valorCaucao">Valor de Caução:</label>
          <input
            type="number"
            step="0.01"
            id="valorCaucao"
            v-model="aluguel.valorCaucao"
            required
          />
        </div>
        <div class="form-group">
          <label for="periodoMinimoContrato">Período Mínimo de Contrato:</label>
          <input
            type="text"
            id="periodoMinimoContrato"
            v-model="aluguel.periodoMinimoContrato"
            required
          />
        </div>

        <!-- Upload de fotos -->
        <div class="form-group">
          <label for="fotos">Fotos (selecione uma ou mais):</label>
          <input type="file" id="fotos" @change="handleFiles" multiple />
        </div>

        <button type="submit" class="submit-button">Cadastrar Aluguel</button>
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
// Importando a store do usuário
import { useUserStore } from "@/stores/user";

export default {
  name: "CadastroAluguel",
  components: { Header, Footer },
  setup() {
    const userStore = useUserStore();

    const aluguel = ref({
      id: null,
      titulo: "",
      descricao: "",
      enderecoCompleto: "",
      valorAluguel: null,
      numeroDeBanheiros: null,
      numeroDeVagas: null,
      dataDisponibilidade: "",
      status: "",
      numeroDeQuartos: null,
      areaEmM2: null,
      mobiliado: null,
      valorCaucao: null,
      periodoMinimoContrato: "",
      categoria: "", // Novo campo de categoria
      usuarioId: "", // Será definido a partir da store
      fotos: [],
    });

    const selectedFiles = ref([]);
    const successMessage = ref("");

    const handleFiles = (event) => {
      selectedFiles.value = Array.from(event.target.files);
    };

    const submitAluguel = async () => {
      try {
        // Verifica se o usuário está autenticado
        if (!userStore.userId) {
          console.error(
            "Erro: o usuário deve estar autenticado. Nenhum userId encontrado."
          );
          return;
        }
        aluguel.value.usuarioId = userStore.userId;

        const uploadedPhotoUrls = [];
        for (const file of selectedFiles.value) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", aluguel.value.usuarioId);
          const uploadResponse = await axiosInstance.post(
            "/imagens/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
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
        aluguel.value.fotos = uploadedPhotoUrls;

        const response = await axiosInstance.post("/alugueis", aluguel.value);
        console.log("Aluguel cadastrado:", response.data);
        successMessage.value = "Anúncio de aluguel cadastrado com sucesso!";
        resetForm();
      } catch (error) {
        console.error("Erro ao cadastrar aluguel:", error.response || error);
      }
    };

    const resetForm = () => {
      aluguel.value = {
        id: null,
        titulo: "",
        descricao: "",
        enderecoCompleto: "",
        valorAluguel: null,
        numeroDeBanheiros: null,
        numeroDeVagas: null,
        dataDisponibilidade: "",
        status: "",
        numeroDeQuartos: null,
        areaEmM2: null,
        mobiliado: null,
        valorCaucao: null,
        periodoMinimoContrato: "",
        categoria: "", // Reseta o campo categoria
        usuarioId: userStore.userId,
        fotos: [],
      };
      selectedFiles.value = [];
    };

    return { aluguel, handleFiles, submitAluguel, successMessage };
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

.cadastro-aluguel {
  max-width: 800px;
  margin: 5rem auto 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.cadastro-aluguel h1 {
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
  .cadastro-aluguel {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .cadastro-aluguel {
    margin: 1rem;
  }
}
</style>
