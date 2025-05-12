<template>
  <div>
    <!-- O Header emite o evento "searched", que é capturado pelo método handleSearch -->
    <Header :showSearch="true" @searched="handleSearch" />

    <!-- Filtro de categoria -->
    <div class="filter-container">
      <label for="categoryFilter">Filtrar por Categoria:</label>
      <select id="categoryFilter" v-model="selectedCategory">
        <option value="">Todos</option>
        <option v-for="cat in allCategoryNames" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

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
              <!-- Exibe as estrelas de avaliação -->
              <div class="star-display">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="{ filled: star <= item.mediaAvaliacoes }"
                >
                  ★
                </span>
              </div>
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
      localSearch: "",
      selectedCategory: "",
    };
  },
  computed: {
    allCategoryNames() {
      return this.categories.map((cat) => cat.nome);
    },
    filteredCategories() {
      if (!this.selectedCategory) {
        return this.categories;
      }
      return this.categories.filter(
        (cat) => cat.nome === this.selectedCategory
      );
    },
  },
  methods: {
    async handleSearch(value) {
      let searchQuery = "";
      if (typeof value === "object" && value.query) {
        searchQuery = value.query;
      } else if (typeof value === "string") {
        searchQuery = value;
      } else {
        searchQuery = "";
      }
      this.localSearch = searchQuery;

      this.isLoading = true;
      try {
        let response;
        if (searchQuery.trim()) {
          response = await axiosInstance.get(
            `/alugueis/search?q=${encodeURIComponent(searchQuery)}`
          );
        } else {
          response = await axiosInstance.get("/alugueis");
        }
        const alugueis = response.data.map((aluguel) => ({
          ...aluguel,
          status: aluguel.status || "inativo",
          mediaAvaliacoes: aluguel.mediaAvaliacoes || 0,
        }));
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
      const response = await axiosInstance.get("/alugueis");
      const alugueis = response.data.map((aluguel) => ({
        ...aluguel,
        status: aluguel.status || "inativo",
        mediaAvaliacoes: aluguel.mediaAvaliacoes || 0,
      }));
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

/* Filtro de categoria */
.filter-container {
  max-width: 800px;
  margin: 1rem auto;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.filter-container label {
  font-weight: 600;
  color: #333;
}
.filter-container select {
  flex-grow: 1;
  padding: 0.4rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.item-title {
  margin: 0.5rem 0 0.25rem;
  font-weight: bold;
  font-size: 1rem;
}

.item-profissional {
  font-size: 0.9rem;
  color: #555;
  margin: 0.25rem 0 0;
}

.star-display {
  margin-top: 0.3rem;
}

.star-display span {
  font-size: 1.2rem;
  color: #ccc;
  margin-right: 2px;
}

.star-display span.filled {
  color: gold !important;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .categories {
    margin: 1rem;
  }
  .item {
    width: 130px;
    margin: 0.5rem;
  }
  .item-photo {
    width: 130px;
    height: 130px;
  }
}
</style>
