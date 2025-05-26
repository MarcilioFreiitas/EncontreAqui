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
            <!-- Exibe fotos se houver -->
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
            <!-- Botão para alternar a exibição das avaliações -->
            <button
              class="coment-btn"
              @click="toggleAvaliacoes(comercio, 'comercio')"
            >
              {{
                getAvaliacoesVisibility(comercio.id, "comercio")
                  ? "Esconder Avaliações"
                  : "Ver Avaliações"
              }}
            </button>
            <!-- Seção de avaliações para o comércio -->
            <div
              v-if="getAvaliacoesVisibility(comercio.id, 'comercio')"
              class="comentarios"
            >
              <div
                v-if="
                  !avaliacoesMap[getKey(comercio.id, 'comercio')].list.length
                "
              >
                <p>Sem avaliações.</p>
              </div>
              <div v-else>
                <div
                  v-for="avaliacao in avaliacoesMap[
                    getKey(comercio.id, 'comercio')
                  ].list"
                  :key="avaliacao.id"
                  class="comentario"
                >
                  <div class="star-rating">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="{ filled: star <= avaliacao.nota }"
                      >★</span
                    >
                  </div>
                  <p><strong>Comentário:</strong> {{ avaliacao.comentario }}</p>
                  <!-- Exibe a resposta se existir -->
                  <p v-if="avaliacao.resposta" class="resposta-display">
                    <strong>Resposta:</strong> {{ avaliacao.resposta }}
                  </p>
                  <!-- Se não houver resposta, permite reposta -->
                  <div v-else class="resposta-area">
                    <input
                      type="text"
                      v-model="avaliacao.newReply"
                      placeholder="Digite sua resposta"
                    />
                    <button
                      class="responder-btn"
                      @click="sendReplyForAvaliacao(avaliacao, 'comercio')"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
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
            <button
              class="coment-btn"
              @click="toggleAvaliacoes(servico, 'servico')"
            >
              {{
                getAvaliacoesVisibility(servico.id, "servico")
                  ? "Esconder Avaliações"
                  : "Ver Avaliações"
              }}
            </button>
            <div
              v-if="getAvaliacoesVisibility(servico.id, 'servico')"
              class="comentarios"
            >
              <div
                v-if="!avaliacoesMap[getKey(servico.id, 'servico')].list.length"
              >
                <p>Sem avaliações.</p>
              </div>
              <div v-else>
                <div
                  v-for="avaliacao in avaliacoesMap[
                    getKey(servico.id, 'servico')
                  ].list"
                  :key="avaliacao.id"
                  class="comentario"
                >
                  <div class="star-rating">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="{ filled: star <= avaliacao.nota }"
                      >★</span
                    >
                  </div>
                  <p><strong>Comentário:</strong> {{ avaliacao.comentario }}</p>
                  <p v-if="avaliacao.resposta" class="resposta-display">
                    <strong>Resposta:</strong> {{ avaliacao.resposta }}
                  </p>
                  <div v-else class="resposta-area">
                    <input
                      type="text"
                      v-model="avaliacao.newReply"
                      placeholder="Digite sua resposta"
                    />
                    <button
                      class="responder-btn"
                      @click="sendReplyForAvaliacao(avaliacao, 'servico')"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
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
            <button
              class="coment-btn"
              @click="toggleAvaliacoes(aluguel, 'aluguel')"
            >
              {{
                getAvaliacoesVisibility(aluguel.id, "aluguel")
                  ? "Esconder Avaliações"
                  : "Ver Avaliações"
              }}
            </button>
            <div
              v-if="getAvaliacoesVisibility(aluguel.id, 'aluguel')"
              class="comentarios"
            >
              <div
                v-if="!avaliacoesMap[getKey(aluguel.id, 'aluguel')].list.length"
              >
                <p>Sem avaliações.</p>
              </div>
              <div v-else>
                <div
                  v-for="avaliacao in avaliacoesMap[
                    getKey(aluguel.id, 'aluguel')
                  ].list"
                  :key="avaliacao.id"
                  class="comentario"
                >
                  <div class="star-rating">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="{ filled: star <= avaliacao.nota }"
                      >★</span
                    >
                  </div>
                  <p><strong>Comentário:</strong> {{ avaliacao.comentario }}</p>
                  <p v-if="avaliacao.resposta" class="resposta-display">
                    <strong>Resposta:</strong> {{ avaliacao.resposta }}
                  </p>
                  <div v-else class="resposta-area">
                    <input
                      type="text"
                      v-model="avaliacao.newReply"
                      placeholder="Digite sua resposta"
                    />
                    <button
                      class="responder-btn"
                      @click="sendReplyForAvaliacao(avaliacao, 'aluguel')"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
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

    // Arrays para armazenar os anúncios do usuário
    const comercios = ref([]);
    const servicos = ref([]);
    const aluguels = ref([]);

    // Converter o ID do usuário para string para filtragem
    const userIdString = String(userStore.userId);

    // Objeto para armazenar as avaliações de cada anúncio (chave: tipo-id)
    const avaliacoesMap = ref({});

    // Função auxiliar para gerar a chave única para cada anúncio
    const getKey = (id, tipo) => `${tipo}-${id}`;

    // Retorna a visibilidade das avaliações para um anúncio
    const getAvaliacoesVisibility = (id, tipo) => {
      const key = getKey(id, tipo);
      return avaliacoesMap.value[key] ? avaliacoesMap.value[key].show : false;
    };

    // Alterna a exibição das avaliações e, se necessário, busca as avaliações
    const toggleAvaliacoes = async (anuncio, tipo) => {
      const key = getKey(anuncio.id, tipo);
      if (!avaliacoesMap.value[key]) {
        avaliacoesMap.value[key] = { show: false, list: [] };
      }
      avaliacoesMap.value[key].show = !avaliacoesMap.value[key].show;
      if (
        avaliacoesMap.value[key].show &&
        avaliacoesMap.value[key].list.length === 0
      ) {
        await fetchAvaliacoes(anuncio.id, tipo, key);
      }
    };

    // Busca as avaliações para um anúncio (GET /api/avaliacoes/item)
    const fetchAvaliacoes = async (anuncioId, tipo, key) => {
      try {
        const response = await axiosInstance.get("/avaliacoes/item", {
          params: { tipoItem: tipo, itemId: anuncioId },
        });
        // Para cada avaliação, adiciona a propriedade newReply para o input de resposta
        const avaliacoes = response.data.map((avaliacao) => ({
          ...avaliacao,
          newReply: "",
        }));
        avaliacoesMap.value[key].list = avaliacoes;
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error.response || error);
      }
    };

    // Envia a resposta para uma avaliação (POST /api/avaliacoes/responder)
    const sendReplyForAvaliacao = async (avaliacao, tipo) => {
      try {
        const payload = {
          comentarioId: avaliacao.id,
          resposta: avaliacao.newReply,
        };
        const response = await axiosInstance.post(
          "/avaliacoes/responder",
          payload
        );
        // Atualiza a avaliação na lista com os dados retornados
        Object.keys(avaliacoesMap.value).forEach((key) => {
          const list = avaliacoesMap.value[key].list;
          const index = list.findIndex((item) => item.id === avaliacao.id);
          if (index !== -1) {
            list[index] = response.data;
            list[index].newReply = "";
          }
        });
      } catch (error) {
        console.error("Erro ao responder avaliação:", error.response || error);
      }
    };

    // Funções para buscar os anúncios do usuário
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

    onMounted(() => {
      fetchComercios();
      fetchServicos();
      fetchAluguels();
    });

    // Métodos para navegação para as páginas de edição
    const editComercio = (id) => router.push(`/editarcomercio/${id}`);
    const editServico = (id) => router.push(`/editarservico/${id}`);
    const editAluguel = (id) => router.push(`/editaraluguel/${id}`);

    // Métodos para exclusão com confirmação, atualizando a lista após exclusão
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
      toggleAvaliacoes,
      getKey,
      getAvaliacoesVisibility,
      sendReplyForAvaliacao,
      avaliacoesMap,
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

/* Estilos para avaliações e respostas */
.coment-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background-color: #5bc0de;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.comentarios {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.comentarios .comentario {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.star-rating {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.star-rating .filled {
  color: gold;
}

.comentarios input[type="text"] {
  width: calc(100% - 100px);
  padding: 0.3rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.responder-btn {
  padding: 0.3rem 0.6rem;
  background-color: #5cb85c;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}

/* Opcional: destaque para a resposta exibida */
.resposta-display {
  background-color: #f8f9fa;
  padding: 0.3rem;
  border-radius: 4px;
  margin-top: 0.4rem;
}
</style>
