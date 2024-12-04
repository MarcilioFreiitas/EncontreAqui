<template>
  <div>
    <Header />
    <div class="post-detail-container">
      <h1>{{ post.title }}</h1>
      <div class="post-card">
        <img :src="post.userPhoto" alt="User Photo" class="user-photo" />
        <div class="post-content">
          <p>{{ post.description }}</p>
          <p><strong>Quanto disposto a pagar:</strong> R${{ post.payment }}</p>
          <p><strong>Negociável:</strong> {{ post.negotiable }}</p>
          <p><strong>Publicado por:</strong> {{ post.user }}</p>
        </div>
      </div>
      <h2>Comentários</h2>
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment-card">
          <img :src="comment.userPhoto" alt="User Photo" class="user-photo" />
          <div class="comment-content">
            <p>
              <strong>{{ comment.user }}:</strong> {{ comment.text }}
            </p>
          </div>
        </div>
      </div>
      <form v-if="isAuthenticated" @submit.prevent="addComment">
        <div class="form-group">
          <label for="comment">Adicionar Comentário</label>
          <textarea id="comment" v-model="newComment.text" required></textarea>
        </div>
        <button type="submit">Enviar</button>
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
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "PostDetailPage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const postId = route.params.id;
    const post = ref({});
    const comments = ref([]);
    const newComment = ref({
      text: "",
      user: "Usuário Anônimo",
      userPhoto: "", // Adicionar o campo para a URL da foto do usuário
    });
    const isAuthenticated = ref(false);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true;
        newComment.value.user = user.displayName || "Usuário Anônimo";
        newComment.value.userPhoto = user.photoURL || "URL_DA_FOTO_PADRAO"; // Atualizar com a URL da foto do usuário ou uma foto padrão
      }
    });

    const fetchPost = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        post.value = docSnap.data();
      } else {
        console.error("No such document!");
      }
    };

    const fetchComments = async () => {
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(commentsQuery);
      comments.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    const addComment = async () => {
      try {
        await addDoc(collection(db, "comments"), {
          postId: postId,
          ...newComment.value,
        });
        alert("Comentário adicionado com sucesso!");
        fetchComments();
        newComment.value.text = "";
      } catch (e) {
        console.error("Erro ao adicionar comentário: ", e);
        alert(
          "Ocorreu um erro ao adicionar o comentário. Por favor, tente novamente."
        );
      }
    };

    onMounted(() => {
      fetchPost();
      fetchComments();
    });

    return {
      post,
      comments,
      newComment,
      addComment,
      isAuthenticated,
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
  align-items: center; /* Alinhar itens no centro verticalmente */
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
  margin-left: 10px; /* Espaço entre a foto e o conteúdo */
  flex: 1; /* Garante que a descrição ocupe o espaço restante */
}

.post-card h3,
.post-card p {
  margin: 1rem 0; /* Espaço entre os elementos */
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
  align-items: center; /* Alinhar itens no centro verticalmente */
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  text-align: left;
}

.comment-card .comment-content {
  margin-left: 10px;
  flex: 1; /* Garante que a descrição ocupe o espaço restante */
}
</style>
