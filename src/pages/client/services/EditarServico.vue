<template>
  <div class="editar-servico">
    <Header :showSearch="false" />
    <div class="container">
      <div class="card">
        <h1 class="card-title">Editar Serviço</h1>
        <form @submit.prevent="updateServico" class="card-form">
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
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div class="form-group">
            <label for="profissionalResponsavel"
              >Profissional Responsável:</label
            >
            <input
              type="text"
              id="profissionalResponsavel"
              v-model="servico.profissionalResponsavel"
              required
            />
          </div>
          <!-- Exibe as imagens atuais com opção de remoção -->
          <div
            class="form-group images"
            v-if="servico.fotos && servico.fotos.length"
          >
            <h3>Imagens atuais:</h3>
            <div class="images-container">
              <div
                v-for="(foto, index) in servico.fotos"
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
          <!-- Seção para adicionar novas fotos -->
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
  name: "EditarServico",
  components: { Header, Footer },
  setup() {
    const router = useRouter();
    const route = useRoute();

    // Objeto de serviço com os dados retornados do backend
    const servico = ref({
      id: null,
      titulo: "",
      descricao: "",
      preco: 0,
      categoria: "",
      localizacao: "",
      areaAtuacao: "",
      tempoMedioAtendimento: 0,
      necessitaAgendamento: false,
      profissionalResponsavel: "",
      usuarioId: null,
      fotos: [], // Array de strings com URLs das fotos já existentes
    });
    const servicoId = route.params.id;

    // Vetor para os novos arquivos (File objects) selecionados
    const newPhotos = ref([]);
    // Vetor para os previews (URLs) das novas fotos
    const newPhotosPreviews = ref([]);

    // Função para tratar a seleção de novos arquivos e gerar os previews
    const handleNewPhotos = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        newPhotos.value.push(files[i]);
        newPhotosPreviews.value.push(URL.createObjectURL(files[i]));
      }
      // Limpa o input para permitir nova seleção se necessário
      event.target.value = "";
    };

    // Remove uma foto existente do array
    const removeExistingPhoto = (index) => {
      servico.value.fotos.splice(index, 1);
    };

    // Remove uma nova foto (arquivo) e seu preview
    const removeNewPhoto = (index) => {
      newPhotos.value.splice(index, 1);
      newPhotosPreviews.value.splice(index, 1);
    };

    // Busca os dados do serviço a partir do ID da rota
    const fetchServico = async () => {
      try {
        const response = await axiosInstance.get(`/servicos/${servicoId}`);
        servico.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar serviço:", error.response || error);
      }
    };

    // Atualiza o serviço criando um FormData com o objeto JSON (parte "servico"),
    // os caminhos das fotos que devem ser mantidas ("fotosExistentes") e os novos arquivos ("novasFotos")
    const updateServico = async () => {
      try {
        // Cria um objeto com os dados do serviço (exceto fotos)
        const serviceData = {
          titulo: servico.value.titulo,
          descricao: servico.value.descricao,
          preco: servico.value.preco,
          categoria: servico.value.categoria,
          localizacao: servico.value.localizacao,
          areaAtuacao: servico.value.areaAtuacao,
          tempoMedioAtendimento: servico.value.tempoMedioAtendimento,
          necessitaAgendamento: servico.value.necessitaAgendamento,
          profissionalResponsavel: servico.value.profissionalResponsavel,
          usuarioId: servico.value.usuarioId,
        };

        const formData = new FormData();
        // Anexa a parte "servico" como Blob com content type JSON
        const servicoBlob = new Blob([JSON.stringify(serviceData)], {
          type: "application/json",
        });
        formData.append("servico", servicoBlob);

        // Anexa as fotos existentes como uma string JSON
        formData.append("fotosExistentes", JSON.stringify(servico.value.fotos));

        // Anexa os novos arquivos, se houver
        newPhotos.value.forEach((file) => {
          formData.append("novasFotos", file);
        });

        // Não defina o header Content-Type manualmente.
        await axiosInstance.put(`/servicos/${servicoId}`, formData);
        alert("Serviço atualizado com sucesso!");
        router.push("/meusanuncios");
      } catch (error) {
        console.error("Erro ao atualizar serviço:", error.response || error);
        alert("Erro ao atualizar serviço.");
      }
    };

    onMounted(() => {
      fetchServico();
    });

    return {
      servico,
      updateServico,
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
  background-color: #f0f8ff; /* AliceBlue */
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
