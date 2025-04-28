<template>
  <div>
    <Header :showSearch="true" />
    <div class="details-container">
      <h2>{{ servico.titulo }}</h2>
      <div class="carousel">
        <button
          v-if="servico.fotos && servico.fotos.length > 1"
          @click="prevPhoto"
          class="carousel-btn"
        >
          ‹
        </button>
        <img :src="currentPhoto" alt="Foto do serviço" class="detail-photo" />
        <button
          v-if="servico.fotos && servico.fotos.length > 1"
          @click="nextPhoto"
          class="carousel-btn"
        >
          ›
        </button>
      </div>
      <p><strong>Descrição:</strong> {{ servico.descricao }}</p>
      <p><strong>Preço:</strong> R$ {{ servico.preco }}</p>
      <p><strong>Categoria:</strong> {{ servico.categoria }}</p>
      <p><strong>Localização:</strong> {{ servico.localizacao }}</p>
      <p><strong>Área de Atuação:</strong> {{ servico.areaAtuacao }}</p>
      <p>
        <strong>Tempo Médio de Atendimento:</strong>
        {{ servico.tempoMedioAtendimento }} minutos
      </p>
      <p>
        <strong>Necessita Agendamento:</strong>
        {{ servico.necessitaAgendamento ? "Sim" : "Não" }}
      </p>
      <p>
        <strong>Profissional Responsável:</strong>
        {{ servico.profissionalResponsavel }}
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
  name: "DetalhesServicos",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const servicoId = route.params.id; // Assume que a rota envia o id do serviço
    const servico = ref({});
    const currentPhotoIndex = ref(0);

    const currentPhoto = computed(() => {
      if (servico.value.fotos && servico.value.fotos.length > 0) {
        return servico.value.fotos[currentPhotoIndex.value];
      }
      return "https://via.placeholder.com/500";
    });

    const nextPhoto = () => {
      if (servico.value.fotos && servico.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value + 1) % servico.value.fotos.length;
      }
    };

    const prevPhoto = () => {
      if (servico.value.fotos && servico.value.fotos.length > 0) {
        currentPhotoIndex.value =
          (currentPhotoIndex.value - 1 + servico.value.fotos.length) %
          servico.value.fotos.length;
      }
    };

    const fetchServico = async () => {
      try {
        const response = await axiosInstance.get(`/servicos/${servicoId}`);
        servico.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
      }
    };

    onMounted(() => {
      fetchServico();
    });

    return { servico, currentPhoto, nextPhoto, prevPhoto };
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
