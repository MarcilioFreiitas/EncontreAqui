<template>
  <div class="editar-comercio">
    <Header :showSearch="false" />
    <div class="container">
      <div class="card">
        <h1 class="card-title">Editar Comércio</h1>
        <form @submit.prevent="updateComercio" class="card-form">
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
          <!-- Novo campo para Categoria -->
          <div class="form-group">
            <label for="categoria">Categoria:</label>
            <input
              type="text"
              id="categoria"
              v-model="comercio.categoria"
              required
            />
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
            <label for="horarioFuncionamento">Horário de Funcionamento:</label>
            <input
              type="text"
              id="horarioFuncionamento"
              v-model="comercio.horarioFuncionamento"
              required
            />
          </div>
          <div class="form-group">
            <label for="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              v-model="comercio.telefone"
              required
            />
          </div>
          <div class="form-group">
            <label for="website">Website:</label>
            <input type="text" id="website" v-model="comercio.website" />
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
          <!-- Seção para exibir as fotos atuais com opção de remoção -->
          <div
            class="form-group images"
            v-if="comercio.fotos && comercio.fotos.length"
          >
            <h3>Imagens atuais:</h3>
            <div class="images-container">
              <div
                v-for="(foto, index) in comercio.fotos"
                :key="'existing-' + index"
                class="photo-wrapper"
              >
                <img
                  :src="foto"
                  :alt="'Imagem ' + (index + 1)"
                  class="anuncio-img"
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
                  :alt="'Nova Imagem ' + (index + 1)"
                  class="anuncio-img"
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
  name: "EditarComercio",
  components: { Header, Footer },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const comercio = ref({
      id: null,
      titulo: "",
      descricao: "",
      categoria: "", // Campo adicionado
      enderecoCompleto: "",
      horarioFuncionamento: "",
      telefone: "",
      website: "",
      tipoEstabelecimento: "",
      usuarioId: null,
      fotos: [], // Array de URLs das fotos existentes
    });
    const comercioId = route.params.id;

    // Vetor para armazenar novos arquivos selecionados (File objects)
    const newPhotos = ref([]);
    // Vetor para armazenar os previews (URLs) das novas fotos
    const newPhotosPreviews = ref([]);

    // Busca os dados do comércio a partir do id da rota
    const fetchComercio = async () => {
      try {
        const response = await axiosInstance.get(`/comercios/${comercioId}`);
        comercio.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar comércio:", error.response || error);
      }
    };

    // Remove uma foto existente pelo índice
    const removeExistingPhoto = (index) => {
      comercio.value.fotos.splice(index, 1);
    };

    // Trata a seleção de novos arquivos e gera preview URLs
    const handleNewPhotos = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        newPhotos.value.push(files[i]);
        newPhotosPreviews.value.push(URL.createObjectURL(files[i]));
      }
      event.target.value = "";
    };

    // Remove uma nova foto (arquivo e preview)
    const removeNewPhoto = (index) => {
      newPhotos.value.splice(index, 1);
      newPhotosPreviews.value.splice(index, 1);
    };

    // Atualiza o comércio enviando um FormData com:
    // - a parte "comercio": os dados do comércio (exceto fotos) como JSON Blob;
    // - a parte "fotosExistentes": JSON string com as URLs das fotos mantidas;
    // - a parte "novasFotos": os arquivos selecionados.
    const updateComercio = async () => {
      try {
        // Cria o objeto com os dados do comércio, incluindo o campo "categoria"
        const commerceData = {
          titulo: comercio.value.titulo,
          descricao: comercio.value.descricao,
          categoria: comercio.value.categoria, // Campo obrigatório
          enderecoCompleto: comercio.value.enderecoCompleto,
          horarioFuncionamento: comercio.value.horarioFuncionamento,
          telefone: comercio.value.telefone,
          website: comercio.value.website,
          tipoEstabelecimento: comercio.value.tipoEstabelecimento,
          usuarioId: comercio.value.usuarioId,
        };

        console.log("Commerce Data:", JSON.stringify(commerceData));

        const formData = new FormData();
        // Anexa a parte "comercio" como Blob JSON
        const comercioBlob = new Blob([JSON.stringify(commerceData)], {
          type: "application/json",
        });
        formData.append("comercio", comercioBlob);

        // Anexa as fotos existentes (que o usuário não removeu)
        formData.append(
          "fotosExistentes",
          JSON.stringify(comercio.value.fotos)
        );

        // Anexa as novas fotos (caso haja)
        newPhotos.value.forEach((file) => {
          formData.append("novasFotos", file);
        });

        await axiosInstance.put(`/comercios/${comercioId}`, formData);
        alert("Comércio atualizado com sucesso!");
        router.push("/meusanuncios");
      } catch (error) {
        console.error("Erro ao atualizar comércio:", error.response || error);
        alert("Erro ao atualizar comércio.");
      }
    };

    onMounted(() => {
      fetchComercio();
    });

    return {
      comercio,
      updateComercio,
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
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0275d8;
}

/* Container para imagens */
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

/* Botão de remoção para fotos */
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
  .form-group textarea {
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
