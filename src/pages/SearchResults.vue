<template>
  <div>
    <Header :showSearch="true" />
    <div class="search-results">
      <h2>Resultados da Pesquisa</h2>
      <div v-if="results.length === 0">Nenhum resultado encontrado.</div>
      <div v-else>
        <div v-for="result in results" :key="result.id" class="result">
          <img :src="result.imagem" alt="Photo" class="result-photo" />
          <p>{{ result.nome }}</p>
          <p>{{ result.categoria }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default {
  name: "SearchResults",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const results = ref([]);
    const searchQuery = ref(route.query.q || "");

    onMounted(async () => {
      if (searchQuery.value) {
        const queryCollection = ["comercios", "servicos", "aluguels"];
        let searchResults = [];

        for (let collectionName of queryCollection) {
          const qNome = query(
            collection(db, collectionName),
            where("nomeLowerCase", ">=", searchQuery.value),
            where("nomeLowerCase", "<=", searchQuery.value + "\uf8ff")
          );
          const qCategoria = query(
            collection(db, collectionName),
            where("categoriaLowerCase", ">=", searchQuery.value),
            where("categoriaLowerCase", "<=", searchQuery.value + "\uf8ff")
          );

          const querySnapshotNome = await getDocs(qNome);
          const querySnapshotCategoria = await getDocs(qCategoria);

          searchResults = [
            ...searchResults,
            ...querySnapshotNome.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              type: collectionName,
            })),
            ...querySnapshotCategoria.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              type: collectionName,
            })),
          ];
        }
        console.log("Resultados da pesquisa:", searchResults);
        results.value = searchResults;
      }
    });

    return {
      results,
    };
  },
};
</script>

<style scoped>
.search-results {
  margin: 2rem;
}

.result {
  margin-bottom: 2rem;
  text-align: center;
}

.result-photo {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}
</style>
