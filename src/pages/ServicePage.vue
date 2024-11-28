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
            @click="viewAllItems(category.id, 'service')"
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
  name: "ServicePage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const router = useRouter();
    const viewAllItems = (categoryId, type) => {
      router.push({
        name: "CategoryPage",
        params: { categoryId: categoryId, type: type },
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
      categories: [
        {
          id: 1,
          name: "Encanadores",
          items: [
            { id: 1, name: "Encanador A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Encanador B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Encanador C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Encanador D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 2,
          name: "Eletricistas",
          items: [
            { id: 1, name: "Eletricista A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Eletricista B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Eletricista C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Eletricista D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 3,
          name: "Marceneiros",
          items: [
            { id: 1, name: "Marceneiro A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Marceneiro B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Marceneiro C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Marceneiro D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 4,
          name: "Pedreiros",
          items: [
            { id: 1, name: "Pedreiro A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Pedreiro B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Pedreiro C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Pedreiro D", photo: "path/to/photo4.jpg" },
          ],
        },
        {
          id: 5,
          name: "Pintores",
          items: [
            { id: 1, name: "Pintor A", photo: "path/to/photo1.jpg" },
            { id: 2, name: "Pintor B", photo: "path/to/photo2.jpg" },
            { id: 3, name: "Pintor C", photo: "path/to/photo3.jpg" },
            { id: 4, name: "Pintor D", photo: "path/to/photo4.jpg" },
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
