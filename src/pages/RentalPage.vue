<template>
  <div>
    <Header :showSearch="true" />
    <div class="categories">
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando aluguéis...
      </div>
      <div v-else>
        <div
          v-for="category in categories"
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
              <img :src="item.imagem" alt="Photo" class="item-photo" />
              <p>{{ item.nome }}</p>
              <p class="rating">
                <span v-for="star in 5" :key="star" class="star">
                  <i
                    class="fa"
                    :class="star <= item.rating ? 'fa-star' : 'fa-star-o'"
                  ></i>
                </span>
                ({{ item.rating.toFixed(1) }})
              </p>
            </div>
          </div>
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Adicione esta linha

export default {
  name: "RentalPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const router = useRouter();
    const viewAllItems = (categoryName, type) => {
      router.push({
        name: "CategoryPage",
        params: { categoryId: categoryName, categoryType: type },
      });
    };

    const viewItemDetail = (itemId, type) => {
      router.push({
        name: "ItemDetailPage",
        params: { itemId: itemId, type: type },
      });
    };

    return { viewAllItems, viewItemDetail };
  },
  data() {
    return {
      categories: [],
      isLoading: true, // Estado de carregamento
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "alugueis"));
    const alugueis = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      rating: 0, // Inicializa a avaliação com zero
    }));

    // Buscar avaliações e calcular a média
    for (let aluguel of alugueis) {
      const q = query(
        collection(db, "avaliacoes"), // Nome correto da coleção
        where("itemId", "==", aluguel.id)
      );
      const querySnapshot = await getDocs(q);
      const ratings = querySnapshot.docs.map((doc) => doc.data().avaliacao);

      console.log(`Ratings for ${aluguel.nome}:`, ratings);

      const averageRating =
        ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length || 0;

      console.log(`Average rating for ${aluguel.nome}:`, averageRating);

      aluguel.rating = averageRating;
    }

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

    this.isLoading = false; // Atualiza o estado de carregamento
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
  flex-direction: row; /* Organizar itens em linha */
  overflow-x: auto; /* Adicionar rolagem horizontal se necessário */
  -webkit-overflow-scrolling: touch; /* Suavizar a rolagem em dispositivos móveis */
}

.item {
  width: 150px;
  flex-shrink: 0; /* Evitar que os itens encolham */
  margin: 1rem;
  text-align: center;
  cursor: pointer;
}

.item-photo {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.star {
  color: #ffb400; /* Cor das estrelas */
  margin-right: 0.1rem;
}

.star i {
  font-size: 1rem; /* Tamanho das estrelas */
}
</style>
