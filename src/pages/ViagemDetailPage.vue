<template>
  <div>
    <Header />
    <div class="post-detail-container">
      <h1>{{ viagem.titulo }}</h1>
      <div class="post-card">
        <img :src="viagem.imagem" alt="Imagem da Viagem" class="viagem-img" />
        <div class="post-content">
          <p>{{ viagem.descricao }}</p>
          <p><strong>De:</strong> {{ viagem.saida }}</p>
          <p><strong>Para:</strong> {{ viagem.destino }}</p>
          <p><strong>Data:</strong> {{ viagem.data }} às {{ viagem.hora }}</p>
          <p><strong>Vagas Disponíveis:</strong> {{ viagem.vagas }}</p>
          <p><strong>Preço por Vaga:</strong> R$ {{ viagem.preco }}</p>
          <p v-if="viagem.intermediarias && viagem.intermediarias.length">
            <strong>Rota Intermediária:</strong>
            {{ viagem.intermediarias.join(", ") }}
          </p>
          <p>
            <strong>Publicado por:</strong>
            {{ viagem.user || "Usuário Anônimo" }}
          </p>
          <div class="whatsapp-container">
            <a
              :href="`https://wa.me/${viagem.whatsapp}`"
              target="_blank"
              class="whatsapp-link"
            >
              <i class="bi bi-whatsapp"></i>
              <span>Contatar via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      <h2>Comentários e Avaliações</h2>
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment-card">
          <img :src="comment.userPhoto" alt="User Photo" class="user-photo" />
          <div class="comment-content">
            <p>
              <strong>{{ comment.user }}:</strong> {{ comment.text }}
            </p>
            <div class="rating">
              <i
                v-for="star in 5"
                :key="star"
                class="bi"
                :class="comment.rating >= star ? 'bi-star-fill' : 'bi-star'"
              ></i>
            </div>
            <div
              v-if="isAuthenticated && user.uid === comment.userId"
              class="comment-actions"
            >
              <i @click="editComment(comment)" class="bi bi-pencil-square"></i>
              <i @click="deleteComment(comment.id)" class="bi bi-trash"></i>
            </div>
          </div>
        </div>
      </div>
      <form v-if="isAuthenticated" @submit.prevent="addComment">
        <div class="form-group">
          <label for="comment">Adicionar Comentário</label>
          <textarea id="comment" v-model="newComment.text" required></textarea>
        </div>
        <div class="form-group">
          <label for="rating">Avaliação</label>
          <div class="rating">
            <i
              v-for="star in 5"
              :key="star"
              class="bi"
              :class="newComment.rating >= star ? 'bi-star-fill' : 'bi-star'"
              @click="newComment.rating = star"
            ></i>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
      <p v-else>
        Por favor, faça <router-link to="/login">login</router-link> para
        comentar.
      </p>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "ViagemDetailPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const viagemId = route.params.id;
    const viagem = ref({});
    const comments = ref([]);
    const newComment = ref({
      text: "",
      rating: 0,
      user: "Usuário Anônimo",
      userPhoto: "",
      userId: "",
    });
    const isAuthenticated = ref(false);
    const user = ref(null);
    const editingComment = ref(null);

    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        isAuthenticated.value = true;
        user.value = currentUser;
        newComment.value.user = currentUser.displayName || "Usuário Anônimo";
        newComment.value.userPhoto =
          currentUser.photoURL || "URL_DA_FOTO_PADRAO";
        newComment.value.userId = currentUser.uid;
      }
    });

    const fetchViagem = async () => {
      const docRef = doc(db, "viagens", viagemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        viagem.value = docSnap.data();
      } else {
        console.error("No such document!");
      }
    };

    const fetchComments = async () => {
      const commentsQuery = query(
        collection(db, "comments"),
        where("viagemId", "==", viagemId)
      );
      const querySnapshot = await getDocs(commentsQuery);
      comments.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    const addComment = async () => {
      if (editingComment.value) {
        await updateDoc(doc(db, "comments", editingComment.value.id), {
          text: newComment.value.text,
          rating: newComment.value.rating,
        });
        editingComment.value = null;
      } else {
        await addDoc(collection(db, "comments"), {
          viagemId: viagemId,
          ...newComment.value,
        });
      }
      alert("Comentário salvo com sucesso!");
      fetchComments();
      newComment.value.text = "";
      newComment.value.rating = 0;
    };

    const editComment = (comment) => {
      editingComment.value = comment;
      newComment.value.text = comment.text;
      newComment.value.rating = comment.rating;
    };

    const deleteComment = async (commentId) => {
      await deleteDoc(doc(db, "comments", commentId));
      alert("Comentário excluído com sucesso!");
      fetchComments();
    };

    onMounted(() => {
      fetchViagem();
      fetchComments();
    });

    return {
      viagem,
      comments,
      newComment,
      addComment,
      editComment,
      deleteComment,
      isAuthenticated,
      user,
    };
  },
};
</script>

<style scoped>
.post-detail-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.post-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  text-align: left;
  color: #000;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.post-card:hover {
  background-color: #f0f0f0;
  transform: translateY(-5px);
}

.post-content {
  margin-left: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-content p {
  margin: 1rem;
}

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
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

.comments {
  margin-top: 2rem;
}

.comment-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  text-align: left;
  justify-content: space-between;
}

.comment-card .comment-content {
  flex: 1;
}

.comment-actions {
  margin-left: 80%;
  margin-top: 5px;
  display: inline-flex;
  justify-content: flex-end;
  gap: 2rem;
}

.comment-actions i {
  cursor: pointer;
  font-size: 0.9rem; /* Tamanho razoável para os ícones */
  margin-left: auto;
}

.comment-actions i:hover {
  color: #ff0000; /* Cor para indicar a ação de deletar */
}

.rating .bi {
  font-size: 1.5rem;
  color: #ffc107;
  cursor: pointer;
}

.rating .bi-star {
  color: #ccc;
}

.rating .bi-star-fill {
  color: #ffc107;
}

.whatsapp-container {
  text-align: center;
  margin-top: 1rem;
}

.whatsapp-link {
  display: inline-flex;
  align-items: center;
  font-size: 1.5rem;
  color: #25d366;
  text-decoration: none;
}

.whatsapp-link i {
  margin-right: 0.5rem; /* Espaço entre o ícone e o texto */
}

.whatsapp-link:hover {
  color: #128c7e;
}
</style>
