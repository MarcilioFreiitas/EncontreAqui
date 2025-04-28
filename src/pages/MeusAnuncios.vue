<template>
  <div class="meus-anuncios">
    <Header :showSearch="false" />
    <div class="container">
      <h1>Meus Anúncios</h1>

      <!-- Seção de Comercios -->
      <section class="anuncio-section">
        <h2>Comércios</h2>
        <div v-if="comercios.length === 0">
          <p>Você ainda não cadastrou nenhum comércio.</p>
        </div>
        <div v-else>
          <div
            v-for="comercio in comercios"
            :key="comercio.id"
            class="anuncio-card"
          >
            <h3>{{ comercio.titulo }}</h3>
            <p>{{ comercio.descricao }}</p>
            <p><strong>Endereço:</strong> {{ comercio.enderecoCompleto }}</p>
            <!-- Exibe imagens do comércio -->
            <div class="images" v-if="comercio.fotos && comercio.fotos.length">
              <img
                v-for="(foto, index) in comercio.fotos"
                :key="index"
                :src="foto"
                :alt="'Imagem do comércio ' + (index + 1)"
                class="anuncio-img"
              />
            </div>
            <div class="actions">
              <button @click="editComercio(comercio.id)">Editar</button>
              <button @click="deleteComercio(comercio.id)">Excluir</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Serviços -->
      <section class="anuncio-section">
        <h2>Serviços</h2>
        <div v-if="servicos.length === 0">
          <p>Você ainda não cadastrou nenhum serviço.</p>
        </div>
        <div v-else>
          <div
            v-for="servico in servicos"
            :key="servico.id"
            class="anuncio-card"
          >
            <h3>{{ servico.titulo }}</h3>
            <p>{{ servico.descricao }}</p>
            <p><strong>Preço:</strong> R$ {{ servico.preco }}</p>
            <!-- Exibe imagens do serviço -->
            <div class="images" v-if="servico.fotos && servico.fotos.length">
              <img
                v-for="(foto, index) in servico.fotos"
                :key="index"
                :src="foto"
                :alt="'Imagem do serviço ' + (index + 1)"
                class="anuncio-img"
              />
            </div>
            <div class="actions">
              <button @click="editServico(servico.id)">Editar</button>
              <button @click="deleteServico(servico.id)">Excluir</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Aluguéis -->
      <section class="anuncio-section">
        <h2>Aluguéis</h2>
        <div v-if="aluguels.length === 0">
          <p>Você ainda não cadastrou nenhum anúncio de aluguel.</p>
        </div>
        <div v-else>
          <div
            v-for="aluguel in aluguels"
            :key="aluguel.id"
            class="anuncio-card"
          >
            <h3>{{ aluguel.titulo }}</h3>
            <p>{{ aluguel.descricao }}</p>
            <p>
              <strong>Valor do Aluguel:</strong> R$ {{ aluguel.valorAluguel }}
            </p>
            <p><strong>Endereço:</strong> {{ aluguel.enderecoCompleto }}</p>
            <!-- Exibe imagens do aluguel -->
            <div class="images" v-if="aluguel.fotos && aluguel.fotos.length">
              <img
                v-for="(foto, index) in aluguel.fotos"
                :key="index"
                :src="foto"
                :alt="'Imagem do aluguel ' + (index + 1)"
                class="anuncio-img"
              />
            </div>
            <div class="actions">
              <button @click="editAluguel(aluguel.id)">Editar</button>
              <button @click="deleteAluguel(aluguel.id)">Excluir</button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import axiosInstance from "@/services/axios.js";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

export default {
  name: "MeusAnuncios",
  components: { Header, Footer },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    // Arrays que armazenarão os anúncios do usuário para cada categoria
    const comercios = ref([]);
    const servicos = ref([]);
    const aluguels = ref([]);

    // Converte os valores para string para garantir a comparação
    const userIdString = String(userStore.userId);

    // Busca os dados de cada anúncio e filtra usando a comparação convertida
    const fetchComercios = async () => {
      try {
        const response = await axiosInstance.get("/comercios");
        comercios.value = response.data.filter(
          (item) => String(item.usuarioId) === userIdString
        );
      } catch (error) {
        console.error("Erro ao buscar comercios:", error.response || error);
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await axiosInstance.get("/servicos");
        servicos.value = response.data.filter(
          (item) => String(item.usuarioId) === userIdString
        );
      } catch (error) {
        console.error("Erro ao buscar servicos:", error.response || error);
      }
    };

    const fetchAluguels = async () => {
      try {
        const response = await axiosInstance.get("/alugueis");
        aluguels.value = response.data.filter(
          (item) => String(item.usuarioId) === userIdString
        );
      } catch (error) {
        console.error("Erro ao buscar aluguels:", error.response || error);
      }
    };

    // Chama as funções de busca ao montar o componente
    onMounted(() => {
      fetchComercios();
      fetchServicos();
      fetchAluguels();
    });

    // Métodos para navegação de edição redirecionam para a página de edição
    const editComercio = (id) => router.push(`/editarcomercio/${id}`);
    const editServico = (id) => router.push(`/editarservico/${id}`);
    const editAluguel = (id) => router.push(`/editaraluguel/${id}`);

    // Métodos para exclusão com confirmação, atualizando as listas após a exclusão
    const deleteComercio = async (id) => {
      if (confirm("Tem certeza que deseja excluir esse comércio?")) {
        try {
          await axiosInstance.delete(`/comercios/${id}`);
          fetchComercios();
        } catch (error) {
          console.error("Erro ao excluir comércio:", error.response || error);
          alert("Erro ao excluir comércio.");
        }
      }
    };

    const deleteServico = async (id) => {
      if (confirm("Tem certeza que deseja excluir esse serviço?")) {
        try {
          await axiosInstance.delete(`/servicos/${id}`);
          fetchServicos();
        } catch (error) {
          console.error("Erro ao excluir serviço:", error.response || error);
          alert("Erro ao excluir serviço.");
        }
      }
    };

    const deleteAluguel = async (id) => {
      if (confirm("Tem certeza que deseja excluir esse anúncio de aluguel?")) {
        try {
          await axiosInstance.delete(`/alugueis/${id}`);
          fetchAluguels();
        } catch (error) {
          console.error("Erro ao excluir aluguel:", error.response || error);
          alert("Erro ao excluir aluguel.");
        }
      }
    };

    return {
      comercios,
      servicos,
      aluguels,
      editComercio,
      editServico,
      editAluguel,
      deleteComercio,
      deleteServico,
      deleteAluguel,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.meus-anuncios h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3436;
}

.anuncio-section {
  margin-bottom: 2rem;
}

.anuncio-section h2 {
  margin-bottom: 1rem;
  color: #2d3436;
}

.anuncio-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #fff;
}

.anuncio-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.anuncio-card p {
  margin-bottom: 0.5rem;
  color: #555;
}

.images {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.anuncio-img {
  max-width: 100px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 1rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  opacity: 0.8;
}

.actions button:nth-child(1) {
  background-color: #0275d8;
  color: #fff;
}

.actions button:nth-child(2) {
  background-color: #d9534f;
  color: #fff;
}
</style>
