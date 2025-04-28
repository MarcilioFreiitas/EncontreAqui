<template>
  <div>
    <Header :showSearch="true" />
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
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axiosInstance from "@/services/axios.js";

export default {
  name: "DetalhesAluguel",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const aluguelId = route.params.id;
    const aluguel = ref({});
    const currentPhotoIndex = ref(0);

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
      } catch (error) {
        console.error("Erro ao buscar aluguel:", error);
      }
    };

    onMounted(() => {
      fetchAluguel();
    });

    return { aluguel, currentPhoto, nextPhoto, prevPhoto };
  },
};
</script>

<style scoped>
.details-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: left;
}

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
</style>
