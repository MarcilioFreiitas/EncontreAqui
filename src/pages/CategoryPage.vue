<template>
  <div class="container">
    <Header :showSearch="true" />
    <div class="content">
      <div class="category-items">
        <h2>{{ categoryName }}</h2>
        <div class="items">
          <div
            v-for="item in items"
            :key="item.id"
            class="item"
            @click="viewItemDetail(item.id)"
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
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default {
  name: "CategoryPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const categoryName = ref(route.params.categoryId || "");
    const categoryType = ref(route.params.categoryType || "");
    const items = ref([]);

    const fetchCategoryItems = async () => {
      const collectionName =
        categoryType.value === "commerce"
          ? "comercios"
          : categoryType.value === "service"
          ? "servicos"
          : "alugueis";
      const q = query(
        collection(db, collectionName),
        where("categoria", "==", categoryName.value)
      );
      const querySnapshot = await getDocs(q);
      items.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    const viewItemDetail = (itemId) => {
      router.push({
        name: "ItemDetailPage",
        params: { itemId: itemId, type: categoryType.value },
      });
    };

    onMounted(fetchCategoryItems);

    return {
      categoryName,
      items,
      viewItemDetail,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 2rem;
  text-align: center;
}

.category-items {
  margin: 2rem 0;
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
