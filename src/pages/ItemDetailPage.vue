<template>
  <div>
    <Header :showSearch="true" />
    <div class="item-details">
      <h2>{{ item.name }}</h2>
      <img :src="item.photo" alt="Photo" class="item-photo" />
      <p>{{ item.description }}</p>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "ItemDetailPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const itemId = route.params.itemId;
    const item = ref({});

    const fetchItemDetails = () => {
      // Substitua este código com a busca real no Firestore mais tarde
      const mockItems = {
        1: {
          name: "Restaurante A",
          photo: "path/to/photo1.jpg",
          description: "Descrição do Restaurante A",
        },
        2: {
          name: "Restaurante B",
          photo: "path/to/photo2.jpg",
          description: "Descrição do Restaurante B",
        },
        3: {
          name: "Restaurante C",
          photo: "path/to/photo3.jpg",
          description: "Descrição do Restaurante C",
        },
        4: {
          name: "Restaurante D",
          photo: "path/to/photo4.jpg",
          description: "Descrição do Restaurante D",
        },
      };

      item.value = mockItems[itemId];
    };

    onMounted(fetchItemDetails);

    return {
      item,
    };
  },
};
</script>

<style scoped>
.item-details {
  margin: 2rem;
  text-align: center;
}

.item-photo {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
