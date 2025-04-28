<template>
  <div>
    <Header :showSearch="true" />
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
  name: "DetalhesComercio",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const comercioId = route.params.id; // Assume que a rota envia o id do comércio
    const comercio = ref({});
    const currentPhotoIndex = ref(0);

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
      } catch (error) {
        console.error("Erro ao buscar comércio:", error);
      }
    };

    onMounted(() => {
      fetchComercio();
    });

    return { comercio, currentPhoto, nextPhoto, prevPhoto };
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
