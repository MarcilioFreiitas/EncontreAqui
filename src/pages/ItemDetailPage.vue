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
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <img :src="review.userPhoto" alt="User Photo" class="user-photo" />
        <div class="review-content">
          <p>
            <strong>{{ getUserName(review.userId) }}:</strong>
            {{ review.comentario }}
          </p>
          <p>
            Avaliação:
            <span v-for="n in 5" :key="n" class="star">
              <i
                class="fa fa-star"
                :class="n <= review.avaliacao ? 'checked' : ''"
              ></i>
            </span>
          </p>
        </div>
      </div>
      <div v-if="isAuthenticated">
        <h4>Deixe sua Avaliação</h4>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="avaliacao">Avaliação (1-5)</label>
            <div class="rating-input">
              <span v-for="n in 5" :key="n" class="star" @click="avaliacao = n">
                <i
                  class="fa fa-star"
                  :class="n <= avaliacao ? 'checked' : ''"
                ></i>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="comentario">Comentário (opcional)</label>
            <textarea id="comentario" v-model="comentario"></textarea>
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
    const userNames = ref({});
    const userPhotos = ref({});

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

    const fetchUserNamesAndPhotos = async () => {
      const userSnapshot = await getDocs(collection(db, "usuarios"));
      userSnapshot.forEach((doc) => {
        userNames.value[doc.id] = doc.data().nome;
        userPhotos.value[doc.id] = doc.data().userPhoto || "URL_DA_FOTO_PADRAO"; // Corrigir o campo para userPhoto
      });
    };

    const getUserName = (userId) => {
      return userNames.value[userId] || "Desconhecido";
    };

    const getUserPhoto = (userId) => {
      return userPhotos.value[userId] || "URL_DA_FOTO_PADRAO";
    };

    const submitReview = async () => {
      if (isAuthenticated.value) {
        try {
          const userPhoto = getUserPhoto(userId.value); // Obtenha a URL da foto do usuário
          await addDoc(collection(db, "avaliacoes"), {
            userId: userId.value,
            userPhoto: userPhoto, // Adicione a URL da foto do usuário
            itemId: itemId,
            tipoItem: type,
            avaliacao: avaliacao.value,
            comentario: comentario.value || "", // Comentário opcional
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
        newComment.value.userPhoto = user.photoURL; // Certifique-se de armazenar a URL da foto do usuário
      } else {
        isAuthenticated.value = false;
        userId.value = "";
        newComment.value.userPhoto = ""; // Limpa o campo de URL da foto do usuário
      }
    });

    onMounted(() => {
      fetchItemDetails();
      fetchReviews();
      fetchUserNamesAndPhotos();
    });

    return {
      item,
      reviews,
      avaliacao,
      comentario,
      submitReview,
      isAuthenticated,
      getUserName,
      getUserPhoto,
    };
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

.item-details {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.item-photo {
  width: 50%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.reviews {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.review-card {
  display: flex;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  text-align: left;
  color: #000;
  text-decoration: none;
}

.review-card:hover {
  background-color: #f0f0f0;
}

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  display: inline-block;
}

.review-content {
  margin-left: 10px;
}

.review-card p {
  margin: 1rem 0;
}

.star {
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 0.1rem;
}

.star:hover,
.checked {
  color: #ffb400;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
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
