<template>
  <div>
    <Header :showSearch="true" />
    <div class="categories">
      <div v-for="category in categories" :key="category.id" class="category">
        <div class="category-header">
          <h3>{{ category.name }}</h3>
          <img
            src="@/assets/seta-direita.png"
            alt="Icon"
            @click="viewAllItems(category.id)"
            class="toggle-icon"
          />
        </div>
        <div class="items">
          <div
            v-for="item in category.items.slice(0, 3)"
            :key="item.id"
            class="item"
            @click="viewItemDetail(item.id)"
          >
            <img :src="item.photo" alt="Photo" class="item-photo" />
            <p>{{ item.name }}</p>
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

export default {
  name: "RentalPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const router = useRouter();
    const viewAllItems = (categoryId) => {
      router.push({ name: "CategoryPage", params: { categoryId: categoryId } });
    };

    const viewItemDetail = (itemId) => {
      router.push({ name: "ItemDetailPage", params: { itemId: itemId } });
    };

    return { viewAllItems, viewItemDetail };
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: "Casas",
          items: [
            { id: 1, name: "Casa A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Casa B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Casa C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Casa D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 2,
          name: "Apartamentos",
          items: [
            { id: 1, name: "Apartamento A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Apartamento B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Apartamento C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Apartamento D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 3,
          name: "Comércios",
          items: [
            { id: 1, name: "Comércio A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Comércio B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Comércio C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Comércio D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 4,
          name: "Salas Comerciais",
          items: [
            { id: 1, name: "Sala Comercial A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Sala Comercial B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Sala Comercial C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Sala Comercial D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 5,
          name: "Terrenos",
          items: [
            { id: 1, name: "Terreno A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Terreno B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Terreno C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Terreno D", photo: "path/to/photo4.jpg" },
          ],
        },
      ],
    };
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
