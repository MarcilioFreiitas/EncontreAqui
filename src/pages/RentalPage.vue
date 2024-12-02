<template>
  <div>
    <Header :showSearch="true" />
    <div class="categories">
      <div v-for="category in categories" :key="category.nome" class="category">
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "alugueis"));
    const alugueis = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
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
  },
};
</script>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  margin: 2rem;
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
  flex-wrap: wrap;
}

.item {
  width: 150px;
  margin: 1rem;
  text-align: center;
  cursor: pointer;
}

.item-photo {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
