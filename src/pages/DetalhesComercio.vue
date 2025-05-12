<template>
  <div>
    <Header :showSearch="true" />

    <!-- Detalhes do Comércio -->
    <div class="details-container">
      <h2>{{ comercio.titulo }}</h2>
      <div class="carousel">
        <button
          v-if="comercio.fotos && comercio.fotos.length > 1"
          @click="prevPhoto"
          class="carousel-btn"
        >
          ‹
        </button>
        <img :src="currentPhoto" alt="Foto do comércio" class="detail-photo" />
        <button
          v-if="comercio.fotos && comercio.fotos.length > 1"
          @click="nextPhoto"
          class="carousel-btn"
        >
          ›
        </button>
      </div>
      <p><strong>Descrição:</strong> {{ comercio.descricao }}</p>
      <p><strong>Endereço:</strong> {{ comercio.enderecoCompleto }}</p>
      <p>
        <strong>Horário de Funcionamento:</strong>
        {{ comercio.horarioFuncionamento }}
      </p>
      <p><strong>Telefone:</strong> {{ comercio.telefone }}</p>
      <p v-if="comercio.website">
        <strong>Website:</strong>
        <a :href="comercio.website" target="_blank">{{ comercio.website }}</a>
      </p>
    </div>

    <!-- Formulário de avaliação para usuário autenticado -->
    <div class="avaliacao-container" v-if="isAuthenticated">
      <h3>Deixe sua Avaliação</h3>
      <form @submit.prevent="submitAvaliacao">
        <!-- Star selector para avaliação -->
        <div class="star-selector">
          <span
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            :class="{ filled: star <= avaliacao.nota }"
          >
            ★
          </span>
        </div>
        <textarea
          id="comentario"
          v-model="avaliacao.comentario"
          placeholder="Escreva seu comentário..."
        ></textarea>
        <div class="button-wrapper">
          <button type="submit">Enviar Avaliação</button>
        </div>
      </form>
    </div>
    <div class="avaliacao-container" v-else>
      <p>Faça login para deixar sua avaliação.</p>
    </div>

    <!-- Lista de avaliações já enviadas para este comércio -->
    <div class="avaliacoes-list">
      <h3>Avaliações</h3>
      <div v-if="avaliacoes.length === 0">
        <p>Sem avaliações até o momento.</p>
      </div>
      <div
        v-for="avaliacaoItem in avaliacoes"
        :key="avaliacaoItem.id"
        class="avaliacao-item"
      >
        <!-- Exibição com estrelas -->
        <div class="star-display">
          <span
            v-for="star in 5"
            :key="star"
            :class="{ filled: star <= avaliacaoItem.nota }"
          >
            ★
          </span>
        </div>
        <p><strong>Comentário:</strong> {{ avaliacaoItem.comentario }}</p>
        <!-- Exibe a resposta, se existir -->
        <p v-if="avaliacaoItem.resposta" class="resposta-display">
          <strong>Resposta:</strong> {{ avaliacaoItem.resposta }}
        </p>
        <p v-if="avaliacaoItem.usuario">
          <em>
            Por:
            {{
              avaliacaoItem.usuario.firstName
                ? avaliacaoItem.usuario.firstName
                : avaliacaoItem.usuario.nome
            }}
            {{
              avaliacaoItem.usuario.lastName
                ? avaliacaoItem.usuario.lastName
                : ""
            }}
          </em>
        </p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axiosInstance from "@/services/axios.js";
import { useUserStore } from "@/stores/user"; // A store do Pinia para autenticação

export default {
  name: "DetalhesComercio",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const comercioId = route.params.id;
    const comercio = ref({});
    const currentPhotoIndex = ref(0);

    // Integração com a store do Pinia
    const userStore = useUserStore();
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const currentUser = computed(() => ({
      id: userStore.userId,
      firstName: userStore.firstName,
      lastName: userStore.lastName,
      email: userStore.email,
    }));

    // Dados do formulário de avaliação – inicialmente com nota 5
    const avaliacao = ref({
      nota: 5,
      comentario: "",
    });

    // Lista de avaliações do comércio
    const avaliacoes = ref([]);

    const currentPhoto = computed(() => {
      if (comercio.value.fotos && comercio.value.fotos.length > 0) {
        return comercio.value.fotos[currentPhotoIndex.value];
      }
      return "https://via.placeholder.com/500";
    });

    const nextPhoto = () => {
      if (comercio.value.fotos && comercio.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value + 1) % comercio.value.fotos.length;
      }
    };

    const prevPhoto = () => {
      if (comercio.value.fotos && comercio.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value - 1 + comercio.value.fotos.length) %
          comercio.value.fotos.length;
      }
    };

    const fetchComercio = async () => {
      try {
        const response = await axiosInstance.get(`/comercios/${comercioId}`);
        comercio.value = response.data;
        console.log("Dados do comércio obtidos:", response.data);
      } catch (error) {
        console.error("Erro ao buscar comércio:", error);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await axiosInstance.get(
          `/avaliacoes/item?tipoItem=comercio&itemId=${comercioId}`
        );
        avaliacoes.value = response.data;
        console.log("Avaliações do comércio obtidas:", avaliacoes.value);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    };

    onMounted(() => {
      fetchComercio();
      fetchAvaliacoes();
      console.log("Autenticação (isAuthenticated):", isAuthenticated.value);
      if (isAuthenticated.value) {
        console.log("Dados do usuário obtidos da store:", currentUser.value);
      }
    });

    // Atualiza a nota da avaliação ao clicar em uma estrela
    const setRating = (star) => {
      avaliacao.value.nota = star;
    };

    const submitAvaliacao = async () => {
      if (!comercio.value.id) {
        alert("Comércio inválido.");
        return;
      }
      if (!currentUser.value?.id) {
        alert("Usuário não autenticado.");
        return;
      }
      try {
        const payload = {
          nota: avaliacao.value.nota,
          comentario: avaliacao.value.comentario,
          tipoItem: "comercio",
          itemId: comercio.value.id,
          usuarioId: currentUser.value.id,
        };
        console.log("Payload da avaliação:", payload);
        await axiosInstance.post("/avaliacoes", payload);
        alert("Avaliação enviada com sucesso!");
        avaliacao.value.nota = 5;
        avaliacao.value.comentario = "";
        fetchAvaliacoes();
      } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Erro ao enviar avaliação.");
      }
    };

    return {
      comercio,
      currentPhoto,
      nextPhoto,
      prevPhoto,
      isAuthenticated,
      avaliacao,
      submitAvaliacao,
      avaliacoes,
      setRating,
    };
  },
};
</script>

<style scoped>
.details-container,
.avaliacao-container,
.avaliacoes-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: left;
  background-color: #fff;
  border-radius: 8px;
}

/* Carousel */
.carousel {
  position: relative;
  text-align: center;
  margin-bottom: 1rem;
}

.detail-photo {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.carousel-btn:first-of-type {
  left: 10px;
}

.carousel-btn:last-of-type {
  right: 10px;
}

/* Formulário de avaliação */
.avaliacao-container form {
  display: flex;
  flex-direction: column;
}

.avaliacao-container label {
  margin-top: 0.5rem;
}

.avaliacao-container textarea {
  resize: vertical;
  min-height: 80px;
  margin-top: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Star selector */
.star-selector {
  margin-bottom: 1rem;
}
.star-selector span {
  font-size: 1.8rem;
  color: #ccc;
  cursor: pointer;
  margin-right: 4px;
  transition: color 0.2s;
}
.star-selector span.filled {
  color: gold;
}

/* Container para o botão */
.button-wrapper {
  margin-top: 1rem;
}
.button-wrapper button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Layout para tablet/desktop */
@media (min-width: 768px) {
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
  .button-wrapper button {
    padding: 0.5rem 1.5rem;
    width: auto;
  }
}

/* Layout para dispositivos móveis */
@media (max-width: 767px) {
  .button-wrapper button {
    padding: 0.8rem;
    width: 100%;
  }
}

/* Lista de avaliações */
.avaliacoes-list {
  background-color: #e9ecef;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
}

.avaliacao-item {
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
}

.avaliacao-item:last-of-type {
  border-bottom: none;
}

/* Exibição de estrelas */
.star-display,
.star-rating {
  margin-bottom: 0.4rem;
}

.star-display span,
.star-rating span {
  font-size: 1.2rem;
  color: #ccc;
  margin-right: 2px;
}

.star-display span.filled,
.star-rating span.filled {
  color: gold;
}

/* Responsividade */
@media (max-width: 600px) {
  .details-container,
  .avaliacao-container,
  .avaliacoes-list {
    margin: 1rem auto;
    padding: 0.5rem;
  }
}

/* Destaque para a resposta exibida */
.resposta-display {
  background-color: #f8f9fa;
  padding: 0.3rem;
  border-radius: 4px;
  margin-top: 0.4rem;
}
</style>
