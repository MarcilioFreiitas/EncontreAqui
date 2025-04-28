<template>
  <div>
    <!-- O Header emite o evento "searched", que é capturado pelo método handleSearch -->
    <Header :showSearch="true" @searched="handleSearch" />
    <div class="categories">
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando aluguéis...
      </div>
      <div v-else>
        <div
          v-for="category in filteredCategories"
          :key="category.nome"
          class="category"
        >
          <div class="category-header">
            <h3>{{ category.nome }}</h3>
            <img
              src="@/assets/seta-direita.png"
              alt="Icon"
              @click="viewAllItems(category.nome, 'rental')"
              class="toggle-icon"
            />
          </div>
          <div class="items">
            <div
              v-for="item in category.items.slice(0, 3)"
              :key="item.id"
              class="item"
              @click="viewItemDetail(item.id, 'rental')"
            >
              <!-- Exibe a primeira imagem; se não houver, usa placeholder -->
              <img
                :src="
                  item.fotos && item.fotos.length
                    ? item.fotos[0]
                    : 'https://via.placeholder.com/150'
                "
                alt="Photo"
                class="item-photo"
              />
              <!-- Exibe o título -->
              <p class="item-title">{{ item.titulo }}</p>
              <!-- Exibe o status: 'Disponível' (verde) para ativo, ou 'Indisponível' (vermelho) caso contrário -->
              <p
                class="item-status"
                :class="{
                  'status-disponivel': item.status === 'ativo',
                  'status-indisponivel': item.status !== 'ativo',
                }"
              >
                {{ item.status === "ativo" ? "Disponível" : "Indisponível" }}
              </p>
            </div>
          </div>
        </div>
        <!-- Exibe mensagem caso nenhum resultado seja encontrado -->
        <div v-if="filteredCategories.length === 0" class="no-results">
          Nenhum aluguel encontrado.
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/services/axios.js";

export default {
  name: "RentalPage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      localSearch: "", // Valor recebido do Header via o evento "searched"
    };
  },
  computed: {
    // Retorna o texto pesquisado (já em minúsculas e sem espaços extras)
    searchText() {
      return this.localSearch.trim().toLowerCase();
    },
    // Filtra os grupos de aluguéis com base no nome da categoria ou no título do item (partial match)
    filteredCategories() {
      if (!this.searchText) {
        return this.categories;
      }
      return this.categories
        .map((group) => {
          // Se o nome da categoria contiver o texto pesquisado, retorna o grupo inteiro
          if (group.nome.toLowerCase().includes(this.searchText)) {
            return group;
          }
          // Caso contrário, filtra apenas os itens cujo título contenha o texto pesquisado
          const filteredItems = group.items.filter((item) =>
            item.titulo.toLowerCase().includes(this.searchText)
          );
          return { nome: group.nome, items: filteredItems };
        })
        .filter((group) => group.items && group.items.length > 0);
    },
  },
  methods: {
    handleSearch(value) {
      // Atualiza o valor local de pesquisa com o valor recebido do Header.
      this.localSearch = value;
    },
    viewAllItems(categoryName, categoryType) {
      this.$router.push({
        name: "CategoryPage",
        params: { categoryId: categoryName, categoryType: categoryType },
      });
    },
    viewItemDetail(itemId, type) {
      if (type === "rental") {
        this.$router.push({
          name: "DetalhesAluguel",
          params: { id: itemId },
        });
      } else {
        this.$router.push({
          name: "ItemDetailPage",
          params: { itemId: itemId, type: type },
        });
      }
    },
  },
  async created() {
    try {
      // Busca todos os anúncios de aluguel na API
      const response = await axiosInstance.get("/alugueis");
      const alugueis = response.data.map((aluguel) => ({
        ...aluguel,
        // Define um default para status e rating se não existirem
        status: aluguel.status || "inativo",
        rating: aluguel.rating || 0,
      }));
      // Agrupa os anúncios de aluguel por categoria
      const categoriesMap = alugueis.reduce((acc, aluguel) => {
        const category = aluguel.categoria;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(aluguel);
        return acc;
      }, {});
      this.categories = Object.keys(categoriesMap).map((key) => ({
        nome: key,
        items: categoriesMap[key],
      }));
    } catch (error) {
      console.error("Erro ao buscar aluguéis:", error.response || error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  margin: 2rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}

.category {
  margin-bottom: 2rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.items {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.item {
  width: 150px;
  flex-shrink: 0;
  margin: 1rem;
  text-align: center;
  cursor: pointer;
}

.item-photo {
  width: 150px; /* Fixed width */
  height: 150px; /* Fixed height */
  object-fit: cover; /* Ensures image covers the container */
  border-radius: 8px;
}

.item-title {
  margin: 0.5rem 0 0.25rem;
  font-weight: bold;
  font-size: 1rem;
}

.item-status {
  font-size: 0.9rem;
  margin: 0;
  font-weight: bold;
}

.status-disponivel {
  color: green;
}

.status-indisponivel {
  color: red;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>
