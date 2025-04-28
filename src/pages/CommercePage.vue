<template>
  <div>
    <!-- A barra de pesquisa vem do Header e emite o evento "searched" -->
    <Header :showSearch="true" @searched="handleSearch" />

    <div class="categories">
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando comércios...
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
              @click="viewAllItems(category.nome, 'commerce')"
              class="toggle-icon"
            />
          </div>
          <div class="items">
            <div
              v-for="item in category.items.slice(0, 3)"
              :key="item.id"
              class="item"
              @click="viewItemDetail(item.id, 'commerce')"
            >
              <!-- Se houver fotos, exibe a primeira; senão, usa placeholder -->
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
              <!-- Exibe o horário de funcionamento -->
              <p class="item-horario">
                Horário: {{ item.horarioFuncionamento }}
              </p>
            </div>
          </div>
        </div>
        <!-- Messagem caso nenhum item seja encontrado -->
        <div v-if="filteredCategories.length === 0" class="no-results">
          Nenhum comércio encontrado.
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/services/axios.js";

export default {
  name: "CommercePage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      localSearch: "", // Valor de pesquisa recebido do Header via evento "searched"
    };
  },
  computed: {
    // Computed que retorna o texto de pesquisa convertido para minúsculas
    searchText() {
      return this.localSearch.trim().toLowerCase();
    },
    // Filtra os grupos com base no nome da categoria ou no título do item (partial match)
    filteredCategories() {
      if (!this.searchText) {
        return this.categories;
      }
      return this.categories
        .map((group) => {
          // Se o nome da categoria contiver a string pesquisada, retorna o grupo inteiro
          if (group.nome.toLowerCase().includes(this.searchText)) {
            return group;
          }
          // Caso contrário, filtra somente os itens cujo título contenha o texto pesquisado
          const filteredItems = group.items.filter((item) =>
            item.titulo.toLowerCase().includes(this.searchText)
          );
          return { nome: group.nome, items: filteredItems };
        })
        .filter((group) => group.items && group.items.length > 0);
    },
  },
  methods: {
    // Atualiza a propriedade localSearch via o evento emitido pelo Header
    handleSearch(value) {
      this.localSearch = value;
    },
    viewAllItems(categoryName, categoryType) {
      this.$router.push({
        name: "CategoryPage",
        params: { categoryId: categoryName, categoryType: categoryType },
      });
    },
    viewItemDetail(itemId, type) {
      if (type === "commerce") {
        this.$router.push({
          name: "DetalhesComercio",
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
      // Busca todos os comércios da API
      const response = await axiosInstance.get("/comercios");
      const comercios = response.data.map((comercio) => ({
        ...comercio,
        rating: comercio.rating || 0,
      }));

      // Agrupa os comércios por categoria
      const categoriesMap = comercios.reduce((acc, comercio) => {
        const category = comercio.categoria;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(comercio);
        return acc;
      }, {});

      this.categories = Object.keys(categoriesMap).map((key) => ({
        nome: key,
        items: categoriesMap[key],
      }));
    } catch (error) {
      console.error("Erro ao buscar comércios:", error.response || error);
    } finally {
      this.isLoading = false;
    }
  },
  watch: {
    // Se desejar, é possível colocar ações adicionais ao mudar a query (não é obrigatório)
    "$route.query.q"(newVal) {
      // Essa lógica pode ser usada se você quiser sincronizar com a query string,
      // mas, neste exemplo, usamos o evento "searched" para alimentar o filtro.
    },
  },
};
</script>

<style scoped>
/* (Opcional) Estilos para container de filtro, caso queira exibir algo extra */
.filter-container {
  margin: 1rem 2rem;
  display: flex;
  justify-content: center;
}

.filter-input {
  width: 100%;
  max-width: 500px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Layout das Categorias e Itens */
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
}

.item {
  width: 150px;
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

.item-horario {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>
