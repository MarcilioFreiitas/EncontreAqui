<template>
  <div>
    <Header :showSearch="true" />
    <div class="category-items">
      <h2>{{ categoryName }}</h2>
      <div class="items">
        <div
          v-for="item in items"
          :key="item.id"
          class="item"
          @click="viewItemDetail(item.id)"
        >
          <img :src="item.photo" alt="Photo" class="item-photo" />
          <p>{{ item.name }}</p>
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

export default {
  name: "CategoryPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const categoryId = route.params.categoryId;
    const categoryName = ref("");
    const items = ref([]);

    const fetchCategoryItems = () => {
      // Substitua este código com a busca real no Firestore mais tarde
      const mockCategories = {
        1: {
          name: "Restaurantes",
          items: [
            { id: 1, name: "Restaurante A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Restaurante B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Restaurante C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Restaurante D", photo: "path/to/photo4.jpg" },
          ],
        },
        2: {
          name: "Supermercados",
          items: [
            { id: 1, name: "Supermercado A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Supermercado B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Supermercado C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Supermercado D", photo: "path/to/photo4.jpg" },
          ],
        },
        3: {
          name: "Lojas de Roupas",
          items: [
            { id: 1, name: "Loja A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Loja B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Loja C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Loja D", photo: "path/to/photo4.jpg" },
          ],
        },
        4: {
          name: "Academias",
          items: [
            { id: 1, name: "Academia A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Academia B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Academia C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Academia D", photo: "path/to/photo4.jpg" },
          ],
        },
        5: {
          name: "Livrarias",
          items: [
            { id: 1, name: "Livraria A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Livraria B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Livraria C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Livraria D", photo: "path/to/photo4.jpg" },
          ],
        },
        6: {
          name: "Farmácias",
          items: [
            { id: 1, name: "Farmácia A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Farmácia B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Farmácia C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Farmácia D", photo: "path/to/photo4.jpg" },
          ],
        },
        7: {
          name: "Padarias",
          items: [
            { id: 1, name: "Padaria A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Padaria B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Padaria C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Padaria D", photo: "path/to/photo4.jpg" },
          ],
        },
        8: {
          name: "Pet Shops",
          items: [
            { id: 1, name: "Pet Shop A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Pet Shop B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Pet Shop C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Pet Shop D", photo: "path/to/photo4.jpg" },
          ],
        },
        9: {
          name: "Bares",
          items: [
            { id: 1, name: "Bar A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Bar B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Bar C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Bar D", photo: "path/to/photo4.jpg" },
          ],
        },
        10: {
          name: "Salões de Beleza",
          items: [
            { id: 1, name: "Salão A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Salão B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Salão C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Salão D", photo: "path/to/photo4.jpg" },
          ],
        },
      };

      const category = mockCategories[categoryId];
      if (category) {
        categoryName.value = category.name;
        items.value = category.items;
      }
    };

    const viewItemDetail = (itemId) => {
      router.push({ name: "ItemDetailPage", params: { itemId: itemId } });
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
.category-items {
  margin: 2rem;
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
