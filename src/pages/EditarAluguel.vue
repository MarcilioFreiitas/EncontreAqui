<template>
  <div class="editar-aluguel">
    <Header :showSearch="false" />
    <div class="container">
      <div class="card">
        <h1 class="card-title">Editar Anúncio de Aluguel</h1>
        <form @submit.prevent="updateAluguel" class="card-form">
          <!-- Form Fields -->
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
          <div class="form-group">
            <label for="valorAluguel">Valor do Aluguel:</label>
            <input
              type="number"
              id="valorAluguel"
              v-model="aluguel.valorAluguel"
              step="0.01"
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
              <option value="">Selecione o status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
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
              id="areaEmM2"
              v-model="aluguel.areaEmM2"
              step="0.1"
              required
            />
          </div>
          <div class="form-group">
            <label for="mobiliado">Mobiliado:</label>
            <select id="mobiliado" v-model="aluguel.mobiliado" required>
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div class="form-group">
            <label for="valorCaucao">Valor da Caução:</label>
            <input
              type="number"
              id="valorCaucao"
              v-model="aluguel.valorCaucao"
              step="0.01"
              required
            />
          </div>
          <div class="form-group">
            <label for="periodoMinimoContrato"
              >Período Mínimo de Contrato:</label
            >
            <input
              type="text"
              id="periodoMinimoContrato"
              v-model="aluguel.periodoMinimoContrato"
              required
            />
          </div>
          <!-- Existing Images Section -->
          <div
            class="form-group images"
            v-if="aluguel.fotos && aluguel.fotos.length > 0"
          >
            <h3>Imagens atuais:</h3>
            <div class="images-container">
              <div
                v-for="(foto, index) in aluguel.fotos"
                :key="'existing-' + index"
                class="photo-wrapper"
              >
                <img
                  :src="foto"
                  class="anuncio-img"
                  :alt="'Imagem ' + (index + 1)"
                />
                <button
                  type="button"
                  class="remove-btn"
                  @click="removeExistingPhoto(index)"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
          <!-- New Images Section -->
          <div class="form-group new-photos">
            <label for="newPhotos">Adicionar novas fotos:</label>
            <input
              type="file"
              id="newPhotos"
              multiple
              accept="image/*"
              @change="handleNewPhotos"
            />
            <div class="images-container" v-if="newPhotosPreviews.length">
              <div
                v-for="(photo, index) in newPhotosPreviews"
                :key="'new-' + index"
                class="photo-wrapper"
              >
                <img
                  :src="photo"
                  class="anuncio-img"
                  :alt="'Nova Imagem ' + (index + 1)"
                />
                <button
                  type="button"
                  class="remove-btn"
                  @click="removeNewPhoto(index)"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
          <button type="submit" class="submit-button">Salvar Alterações</button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axiosInstance from "@/services/axios.js";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "EditarAluguel",
  components: { Header, Footer },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const aluguel = ref({
      id: null,
      titulo: "",
      descricao: "",
      enderecoCompleto: "",
      valorAluguel: 0,
      numeroDeBanheiros: 0,
      numeroDeVagas: 0,
      dataDisponibilidade: "",
      status: "",
      numeroDeQuartos: 0,
      areaEmM2: 0,
      mobiliado: false,
      valorCaucao: 0,
      periodoMinimoContrato: "",
      usuarioId: null,
      fotos: [], // Array de URLs das imagens existentes
    });
    const aluguelId = route.params.id;

    // Array para armazenar novos arquivos selecionados (File objects)
    const newPhotos = ref([]);
    // Array para armazenar os previews (URLs) das novas fotos
    const newPhotosPreviews = ref([]);

    const fetchAluguel = async () => {
      try {
        const response = await axiosInstance.get(`/alugueis/${aluguelId}`);
        aluguel.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar aluguel:", error.response || error);
      }
    };

    // Remove a imagem existente pelo índice
    const removeExistingPhoto = (index) => {
      aluguel.value.fotos.splice(index, 1);
    };

    // Trata a seleção de novos arquivos e gera preview URLs
    const handleNewPhotos = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        newPhotos.value.push(files[i]);
        newPhotosPreviews.value.push(URL.createObjectURL(files[i]));
      }
      // Limpa o input para permitir nova seleção se necessário
      event.target.value = "";
    };

    // Remove uma nova foto (removendo o arquivo e o preview)
    const removeNewPhoto = (index) => {
      newPhotos.value.splice(index, 1);
      newPhotosPreviews.value.splice(index, 1);
    };

    // Atualiza o aluguel enviando um FormData com:
    // - a parte "aluguel": os dados do aluguel (exceto fotos) como JSON Blob;
    // - a parte "fotosExistentes": JSON string com as URLs das imagens mantidas;
    // - a parte "novasFotos": os arquivos selecionados.
    const updateAluguel = async () => {
      try {
        const aluguelData = {
          titulo: aluguel.value.titulo,
          descricao: aluguel.value.descricao,
          enderecoCompleto: aluguel.value.enderecoCompleto,
          valorAluguel: aluguel.value.valorAluguel,
          numeroDeBanheiros: aluguel.value.numeroDeBanheiros,
          numeroDeVagas: aluguel.value.numeroDeVagas,
          dataDisponibilidade: aluguel.value.dataDisponibilidade,
          status: aluguel.value.status,
          numeroDeQuartos: aluguel.value.numeroDeQuartos,
          areaEmM2: aluguel.value.areaEmM2,
          mobiliado: aluguel.value.mobiliado,
          valorCaucao: aluguel.value.valorCaucao,
          periodoMinimoContrato: aluguel.value.periodoMinimoContrato,
          usuarioId: aluguel.value.usuarioId,
        };

        const formData = new FormData();
        // Anexa o objeto "aluguel" como um Blob com content type JSON
        const aluguelBlob = new Blob([JSON.stringify(aluguelData)], {
          type: "application/json",
        });
        formData.append("aluguel", aluguelBlob);

        // Anexa as fotos existentes (aquelas que o usuário não removeu) como JSON string
        formData.append("fotosExistentes", JSON.stringify(aluguel.value.fotos));

        // Anexa os novos arquivos, se houver
        newPhotos.value.forEach((file) => {
          formData.append("novasFotos", file);
        });

        // Usa a instância Axios para enviar a requisição PUT sem sobrescrever o header Content-Type
        await axiosInstance.put(`/alugueis/${aluguelId}`, formData);
        alert("Aluguel atualizado com sucesso!");
        router.push("/meusanuncios");
      } catch (error) {
        console.error("Erro ao atualizar aluguel:", error.response || error);
        alert("Erro ao atualizar aluguel.");
      }
    };

    onMounted(() => {
      fetchAluguel();
    });

    return {
      aluguel,
      updateAluguel,
      handleNewPhotos,
      removeExistingPhoto,
      newPhotosPreviews,
      removeNewPhoto,
    };
  },
};
</script>

<style scoped>
/* Reset básico */
* {
  box-sizing: border-box;
}

/* Container Principal */
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f0f8ff;
  border-radius: 10px;
}

/* Cartão de Formulário */
.card {
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Título do Cartão */
.card-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Estilo do Formulário */
.card-form {
  display: flex;
  flex-direction: column;
}

/* Grupo de Campos */
.form-group {
  margin-bottom: 1.5rem;
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
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0275d8;
}

/* Container para Imagens */
.images-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 0.5rem;
}

.photo-wrapper {
  position: relative;
}

.anuncio-img {
  max-width: 120px;
  border-radius: 6px;
  object-fit: cover;
}

/* Botão para Remover Imagem */
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 37, 82, 0.8);
  border: none;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #ff5252;
}

/* Botão de Envio */
.submit-button {
  background-color: #0275d8;
  color: #fff;
  border: none;
  padding: 0.75rem;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #025aa5;
}

/* Responsividade */
@media (max-width: 768px) {
  .card {
    padding: 1.25rem;
  }
  .card-title {
    font-size: 1.75rem;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem;
  }
  .card {
    padding: 1rem;
  }
  .card-title {
    font-size: 1.5rem;
  }
}
</style>
