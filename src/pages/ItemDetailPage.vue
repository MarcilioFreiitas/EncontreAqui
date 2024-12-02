<template>
  <div>
    <Header :showSearch="true" />
    <div class="item-details">
      <h2>{{ item.nome }}</h2>
      <img :src="item.imagem" alt="Photo" class="item-photo" />
      <p>{{ item.descricao }}</p>
    </div>
    <div class="reviews">
      <h3>Avaliações e Comentários</h3>
      <div v-for="review in reviews" :key="review.id" class="review">
        <p>
          <strong>{{ review.userId }}:</strong> {{ review.comentario }}
        </p>
        <p>Avaliação: {{ review.avaliacao }} estrelas</p>
      </div>
      <div v-if="isAuthenticated">
        <h4>Deixe sua Avaliação</h4>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="avaliacao">Avaliação (1-5)</label>
            <input
              type="number"
              id="avaliacao"
              v-model="avaliacao"
              min="1"
              max="5"
              required
            />
          </div>
          <div class="form-group">
            <label for="comentario">Comentário</label>
            <textarea id="comentario" v-model="comentario" required></textarea>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
      <div v-else>
        <p>Faça login para deixar um comentário.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default {
  name: "ItemDetailPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const itemId = route.params.itemId;
    const type = route.params.type;
    const item = ref({});
    const reviews = ref([]);
    const avaliacao = ref(0);
    const comentario = ref("");
    const isAuthenticated = ref(false);
    const userId = ref("");

    const fetchItemDetails = async () => {
      const collectionName =
        type === "commerce"
          ? "comercios"
          : type === "service"
          ? "servicos"
          : "alugueis";
      const docRef = doc(db, collectionName, itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        item.value = docSnap.data();
      } else {
        console.error("No such document!");
      }
    };

    const fetchReviews = async () => {
      const q = query(
        collection(db, "avaliacoes"),
        where("itemId", "==", itemId),
        where("tipoItem", "==", type)
      );
      const querySnapshot = await getDocs(q);
      reviews.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    const submitReview = async () => {
      if (isAuthenticated.value) {
        try {
          await addDoc(collection(db, "avaliacoes"), {
            userId: userId.value,
            itemId: itemId,
            tipoItem: type,
            avaliacao: avaliacao.value,
            comentario: comentario.value,
            timestamp: serverTimestamp(),
          });
          alert("Avaliação enviada com sucesso!");
          avaliacao.value = 0;
          comentario.value = "";
          fetchReviews();
        } catch (e) {
          console.error("Erro ao enviar avaliação: ", e);
          alert(
            "Ocorreu um erro ao enviar sua avaliação. Por favor, tente novamente."
          );
        }
      } else {
        alert("Você precisa estar logado para enviar uma avaliação.");
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true;
        userId.value = user.uid;
      } else {
        isAuthenticated.value = false;
        userId.value = "";
      }
    });

    onMounted(() => {
      fetchItemDetails();
      fetchReviews();
    });

    return {
      item,
      reviews,
      avaliacao,
      comentario,
      submitReview,
      isAuthenticated,
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
  width: 200px;
  height: auto;
  border-radius: 8px;
}

.reviews {
  margin: 2rem;
}

.review {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
