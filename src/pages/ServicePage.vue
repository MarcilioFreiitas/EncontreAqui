<template>
  <div>
    <!-- O Header agora emite o evento "searched", que é capturado via handleSearch -->
    <Header :showSearch="true" @searched="handleSearch" />
    <div class="categories">
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando serviços...
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
              @click="viewAllItems(category.nome, 'service')"
              class="toggle-icon"
            />
          </div>
          <div class="items">
            <div
              v-for="item in category.items.slice(0, 3)"
              :key="item.id"
              class="item"
              @click="viewItemDetail(item.id, 'service')"
            >
              <!-- Exibe a primeira imagem, se houver; caso contrário, utiliza um placeholder -->
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
              <!-- Exibe o profissional responsável -->
              <p class="item-profissional">
                Profissional: {{ item.profissionalResponsavel }}
              </p>
            </div>
          </div>
        </div>
        <!-- Caso nenhum item seja encontrado -->
        <div v-if="filteredCategories.length === 0" class="no-results">
          Nenhum serviço encontrado.
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
  name: "ServicePage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      localSearch: "", // Valor de pesquisa recebido do Header
    };
  },
  computed: {
    // Converte o valor de pesquisa para minúsculas e remove espaços extras
    searchText() {
      return this.localSearch.trim().toLowerCase();
    },
    // Filtra os grupos de serviços com base na pesquisa parcial
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
          // Caso contrário, filtra os itens cujo título contenha o texto pesquisado
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
      // Atualiza o valor local com o texto pesquisado emitido pelo Header
      this.localSearch = value;
    },
    viewAllItems(categoryName, categoryType) {
      this.$router.push({
        name: "CategoryPage",
        params: { categoryId: categoryName, categoryType: categoryType },
      });
    },
    // Redireciona para a tela de detalhes específica para serviço
    viewItemDetail(itemId, type) {
      if (type === "service") {
        this.$router.push({
          name: "DetalhesServicos",
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
      // Busca todos os serviços na API
      const response = await axiosInstance.get("/servicos");
      // Mapear os serviços e garantir os campos necessários; define default para horário se necessário.
      const servicos = response.data.map((servico) => ({
        ...servico,
        horarioFuncionamento: servico.horarioFuncionamento || "Não informado",
      }));
      // Agrupar os serviços por categoria
      const categoriesMap = servicos.reduce((acc, servico) => {
        const category = servico.categoria;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(servico);
        return acc;
      }, {});
      this.categories = Object.keys(categoriesMap).map((key) => ({
        nome: key,
        items: categoriesMap[key],
      }));
    } catch (error) {
      console.error("Erro ao buscar serviços:", error.response || error);
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

.item-profissional {
  font-size: 0.9rem;
  color: #555;
  margin: 0.25rem 0 0;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>
