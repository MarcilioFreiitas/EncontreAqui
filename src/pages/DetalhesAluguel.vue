<template>
  <div>
    <Header :showSearch="true" />

    <!-- Detalhes do Aluguel -->
    <div class="details-container">
      <h2>{{ aluguel.titulo }}</h2>
      <div class="carousel">
        <button
          v-if="aluguel.fotos && aluguel.fotos.length > 1"
          @click="prevPhoto"
          class="carousel-btn"
        >
          ‹
        </button>
        <img :src="currentPhoto" alt="Foto do aluguel" class="detail-photo" />
        <button
          v-if="aluguel.fotos && aluguel.fotos.length > 1"
          @click="nextPhoto"
          class="carousel-btn"
        >
          ›
        </button>
      </div>
      <p><strong>Descrição:</strong> {{ aluguel.descricao }}</p>
      <p><strong>Categoria:</strong> {{ aluguel.categoria }}</p>
      <p><strong>Endereço:</strong> {{ aluguel.enderecoCompleto }}</p>
      <p><strong>Valor do Aluguel:</strong> R$ {{ aluguel.valorAluguel }}</p>
      <p>
        <strong>Número de Banheiros:</strong> {{ aluguel.numeroDeBanheiros }}
      </p>
      <p><strong>Número de Vagas:</strong> {{ aluguel.numeroDeVagas }}</p>
      <p>
        <strong>Data de Disponibilidade:</strong>
        {{ aluguel.dataDisponibilidade }}
      </p>
      <p><strong>Status:</strong> {{ aluguel.status }}</p>
      <p><strong>Número de Quartos:</strong> {{ aluguel.numeroDeQuartos }}</p>
      <p><strong>Área (m²):</strong> {{ aluguel.areaEmM2 }}</p>
      <p><strong>Mobiliado:</strong> {{ aluguel.mobiliado ? "Sim" : "Não" }}</p>
      <p><strong>Valor de Caução:</strong> R$ {{ aluguel.valorCaucao }}</p>
      <p>
        <strong>Período Mínimo de Contrato:</strong>
        {{ aluguel.periodoMinimoContrato }}
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

    <!-- Lista de avaliações já enviadas para este aluguel -->
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
        <!-- Exibição de estrelas baseada na nota -->
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
        <!-- Exibe a resposta, se houver -->
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
import { useUserStore } from "@/stores/user"; // Store do Pinia

export default {
  name: "DetalhesAluguel",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const aluguelId = route.params.id;
    const aluguel = ref({});
    const currentPhotoIndex = ref(0);

    // Integração com a store de autenticação
    const userStore = useUserStore();
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const currentUser = computed(() => ({
      id: userStore.userId,
      firstName: userStore.firstName,
      lastName: userStore.lastName,
      email: userStore.email,
    }));

    // Dados do formulário de avaliação
    const avaliacao = ref({
      nota: 5,
      comentario: "",
    });

    // Lista de avaliações do aluguel
    const avaliacoes = ref([]);

    const currentPhoto = computed(() => {
      if (aluguel.value.fotos && aluguel.value.fotos.length > 0) {
        return aluguel.value.fotos[currentPhotoIndex.value];
      }
      return "https://via.placeholder.com/500";
    });

    const nextPhoto = () => {
      if (aluguel.value.fotos && aluguel.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value + 1) % aluguel.value.fotos.length;
      }
    };

    const prevPhoto = () => {
      if (aluguel.value.fotos && aluguel.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value - 1 + aluguel.value.fotos.length) %
          aluguel.value.fotos.length;
      }
    };

    const fetchAluguel = async () => {
      try {
        const response = await axiosInstance.get(`/alugueis/${aluguelId}`);
        aluguel.value = response.data;
        console.log("Dados do aluguel obtidos:", response.data);
      } catch (error) {
        console.error("Erro ao buscar aluguel:", error);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await axiosInstance.get(
          `/avaliacoes/item?tipoItem=aluguel&itemId=${aluguelId}`
        );
        avaliacoes.value = response.data;
        console.log("Avaliações do aluguel obtidas:", avaliacoes.value);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    };

    onMounted(() => {
      fetchAluguel();
      fetchAvaliacoes();
      console.log("Autenticação (isAuthenticated):", isAuthenticated.value);
      if (isAuthenticated.value) {
        console.log("Dados do usuário obtidos da store:", currentUser.value);
      }
    });

    // Atualiza a nota ao clicar em uma estrela
    const setRating = (star) => {
      avaliacao.value.nota = star;
    };

    const submitAvaliacao = async () => {
      if (!aluguel.value.id) {
        alert("Aluguel inválido.");
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
          tipoItem: "aluguel",
          itemId: aluguel.value.id,
          usuarioId: currentUser.value.id,
        };
        console.log("Payload da avaliação:", payload);
        await axiosInstance.post("/avaliacoes", payload);
        alert("Avaliação enviada com sucesso!");
        avaliacao.value.nota = 5;
        avaliacao.value.comentario = "";
        fetchAvaliacoes(); // Atualiza a lista de avaliações
      } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Erro ao enviar avaliação.");
      }
    };

    return {
      aluguel,
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

/* Exibição de estrelas nas avaliações */
.star-display {
  margin-bottom: 0.4rem;
}

.star-display span {
  font-size: 1.2rem;
  color: #ccc;
  margin-right: 2px;
}

.star-display span.filled {
  color: gold;
}

/* Responsividade geral */
@media (max-width: 600px) {
  .details-container,
  .avaliacao-container,
  .avaliacoes-list {
    margin: 1rem auto;
    padding: 0.5rem;
  }
}

/* Destaque para resposta exibida */
.resposta-display {
  background-color: #f8f9fa;
  padding: 0.3rem;
  border-radius: 4px;
  margin-top: 0.4rem;
}
</style>
