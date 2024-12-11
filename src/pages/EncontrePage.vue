<template>
  <div>
    <Header />
    <div class="encontre-container">
      <h1>Encontre e Conecte</h1>
      <div v-if="isAuthenticated && !mostrarFormulario">
        <button @click="mostrarFormulario = true" class="btn btn-primary">
          Publicar
        </button>
      </div>
      <form
        v-if="isAuthenticated && mostrarFormulario"
        @submit.prevent="isEditing ? updatePost() : addPost()"
        class="mt-4"
      >
        <div class="form-group">
          <label for="title">Título</label>
          <input
            type="text"
            id="title"
            v-model="newPost.title"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea
            id="description"
            v-model="newPost.description"
            class="form-control"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="payment">Quanto está disposto a pagar</label>
          <input
            type="number"
            id="payment"
            v-model="newPost.payment"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="negotiable">O preço pode ser negociável?</label>
          <select
            id="negotiable"
            v-model="newPost.negotiable"
            class="form-control"
            required
          >
            <option value="Propostas aceitas">Propostas aceitas</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
            <option value="Refazer orçamento">Refazer orçamento</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success mt-3">
          {{ isEditing ? "Salvar Atualização" : "Publicar" }}
        </button>
      </form>
      <p v-else-if="!isAuthenticated" class="mt-4">
        Por favor, faça <router-link to="/login">login</router-link> para
        publicar uma postagem.
      </p>
      <div class="post-list mt-5">
        <div v-for="post in sortedPosts" :key="post.id" class="post-card">
          <img :src="post.userPhoto" alt="Foto do usuário" class="user-photo" />
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <p><strong>Quanto disposto a pagar:</strong> {{ post.payment }}</p>
            <p>
              <strong>O preço pode ser negociado?:</strong>
              {{ post.negotiable }}
            </p>
            <p><strong>Publicado por:</strong> {{ post.user }}</p>
          </div>
          <div
            class="card-actions d-flex justify-content-between align-items-center mt-2"
          >
            <div v-if="!isAuthenticated" class="curtidas-info">
              <i class="bi bi-heart"></i>
              <span>Curtidas: {{ post.likes }}</span>
            </div>
            <button
              v-if="isAuthenticated"
              class="like-button btn btn-link text-decoration-none"
              @click.stop="likePost(post)"
            >
              <i
                :class="{
                  'bi bi-heart-fill': post.likedBy[currentUser?.uid],
                  'bi bi-heart': !post.likedBy[currentUser?.uid],
                }"
              ></i>
              <span class="button-text">Curtir ({{ post.likes }})</span>
            </button>
            <router-link
              :to="{ name: 'PostDetailPage', params: { id: post.id } }"
              class="comment-button btn btn-link"
            >
              <i class="bi bi-chat-dots"></i>
              <span class="button-text">Comentar</span>
            </router-link>
            <a
              :href="getWhatsAppShareLink(post)"
              target="_blank"
              class="share-link btn btn-link"
            >
              <i class="bi bi-share"></i>
              <span class="button-text">Compartilhar</span>
            </a>
            <button
              v-if="isAuthenticated && post.user === currentUser.displayName"
              @click="editPost(post)"
              class="btn btn-warning"
            >
              Editar
            </button>
            <button
              v-if="isAuthenticated && post.user === currentUser.displayName"
              @click="deletePost(post.id)"
              class="btn btn-danger"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "EncontrePage",
  components: {
    Header,
    Footer,
  },
  setup() {
    const newPost = ref({
      title: "",
      description: "",
      payment: 0,
      negotiable: "Propostas aceitas",
      user: "Usuário Anônimo",
      userPhoto: "",
      likes: 0,
      likedBy: {}, // Adicionando campo likedBy para rastrear curtidas por usuário
    });
    const posts = ref([]);
    const isAuthenticated = ref(false);
    const mostrarFormulario = ref(false);
    const isEditing = ref(false); // Variável para rastrear o estado de edição
    const currentUser = ref(null); // Para rastrear o usuário atual

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true;
        currentUser.value = user;
        newPost.value.user = user.displayName || "Usuário Anônimo";
        newPost.value.userPhoto = user.photoURL || "URL_DA_FOTO_PADRAO";
      }
    });

    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      posts.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        likedBy: {}, // Inicializando likedBy se estiver indefinido
        ...doc.data(),
      }));
    };

    const addPost = async () => {
      try {
        await addDoc(collection(db, "posts"), {
          ...newPost.value,
          createdAt: new Date().toISOString(),
        });
        alert("Postagem publicada com sucesso!");
        fetchPosts();
        resetForm();
      } catch (e) {
        console.error("Erro ao publicar postagem: ", e);
        alert(
          "Ocorreu um erro ao publicar a postagem. Por favor, tente novamente."
        );
      }
    };

    const editPost = (post) => {
      // Função para abrir o formulário de edição com os dados atuais do post
      mostrarFormulario.value = true;
      isEditing.value = true;
      newPost.value = { ...post }; // Carregar os dados atuais do post no formulário
    };

    const updatePost = async () => {
      try {
        const postRef = doc(db, "posts", newPost.value.id);
        const postSnapshot = await getDoc(postRef);

        if (!postSnapshot.exists()) {
          alert("O documento não existe mais. Talvez tenha sido removido.");
          resetForm();
          return;
        }

        await updateDoc(postRef, {
          title: newPost.value.title,
          description: newPost.value.description,
          payment: newPost.value.payment,
          negotiable: newPost.value.negotiable,
        });
        alert("Postagem atualizada com sucesso!");
        fetchPosts();
        resetForm();
      } catch (e) {
        console.error("Erro ao atualizar a postagem: ", e);
        alert(
          "Ocorreu um erro ao atualizar a postagem. Por favor, tente novamente."
        );
      }
    };

    const resetForm = () => {
      newPost.value = {
        title: "",
        description: "",
        payment: 0,
        negotiable: "Propostas aceitas",
        user: "Usuário Anônimo",
        userPhoto: "",
        likes: 0,
        likedBy: {},
      };
      isEditing.value = false;
      mostrarFormulario.value = false;
    };

    const deletePost = async (postId) => {
      try {
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef);
        alert("Postagem excluída com sucesso!");
        fetchPosts();
      } catch (e) {
        console.error("Erro ao excluir a postagem: ", e);
        alert(
          "Ocorreu um erro ao excluir a postagem. Por favor, tente novamente."
        );
      }
    };

    const likePost = async (post) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para curtir um post.");
        return;
      }

      const userId = user.uid;

      try {
        const postRef = doc(db, "posts", post.id);
        const postSnapshot = await getDoc(postRef);
        const postData = postSnapshot.data();

        if (!postData.likedBy) {
          postData.likedBy = {};
        }

        if (postData.likedBy[userId]) {
          alert("Você já curtiu esse post.");
          return;
        }

        const newLikes = post.likes + 1;

        await updateDoc(postRef, {
          likes: newLikes,
          [`likedBy.${userId}`]: true,
        });

        post.likes = newLikes;
        post.likedBy = { ...post.likedBy, [userId]: true };
      } catch (e) {
        console.error("Erro ao curtir a postagem: ", e);
        alert(
          "Ocorreu um erro ao curtir a postagem. Por favor, tente novamente."
        );
      }
    };

    const getWhatsAppShareLink = (post) => {
      const message = `Confira esta postagem: ${post.title} - ${post.description}. Quanto disposto a pagar: R$ ${post.payment}. Negociável: ${post.negotiable}. Publicado por: ${post.user}`;
      return `https://wa.me/?text=${encodeURIComponent(message)}`;
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      newPost,
      posts,
      addPost,
      isAuthenticated,
      mostrarFormulario,
      getWhatsAppShareLink,
      likePost,
      editPost,
      updatePost,
      deletePost,
      currentUser,
      isEditing,
      resetForm,
      sortedPosts: computed(
        () => posts.value.sort((a, b) => b.likes - a.likes) // Ordenar posts por curtidas
      ),
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");
@import "bootstrap-icons/font/bootstrap-icons.css";

/* Estilos Gerais */
body {
  font-family: "Inter", sans-serif;
}

.encontre-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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
.form-group textarea,
.form-group select {
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
  margin-top: 1rem;
}

button:hover {
  background-color: #333;
}

.post-list {
  margin-top: 2rem;
}

.post-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  text-align: left;
  color: #000;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
  position: relative;
}

.post-card:hover {
  background-color: #f0f0f0;
  transform: translateY(-5px);
}

.post-content {
  margin-left: 10px;
  flex: 1;
}

.post-card h3,
.post-card p {
  margin: 1rem 0;
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

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

.like-button {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.like-button i {
  margin-right: 5px;
}

.like-button .bi-heart-fill {
  color: #ff6b6b;
}

.like-button .bi-heart {
  color: #ccc;
}

.like-button:hover .bi-heart {
  color: #ff6b6b;
}

.comment-button {
  background: none;
  border: none;
  color: #212931;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.comment-button i {
  margin-right: 5px;
}

.comment-button .bi-chat-dots {
  color: #20252b;
}

.comment-button:hover .bi-chat-dots {
  color: #212830;
}

.share-link {
  background: none;
  border: none;
  color: #25d366;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.share-link i {
  margin-right: 5px;
}

.share-link .bi-share {
  color: #25d366;
}

.share-link:hover .bi-share {
  color: #128c7e;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* Ajuste para espaçamento entre o ícone e o texto "Curtidas" */
.curtidas-info {
  display: flex;
  align-items: center;
  gap: 5px; /* Espaçamento entre ícone e texto */
}

@media (max-width: 768px) {
  .post-card {
    padding: 3rem;
    flex-direction: column;
    align-items: flex-start;
    min-height: 200px;
  }

  .post-content {
    margin-left: 0;
    margin-top: 1rem;
  }

  .user-photo {
    display: block;
    margin: 0 auto 1rem auto;
  }

  .post-card h3,
  .post-card p {
    margin: 0.5rem 0;
  }

  .card-actions {
    flex-direction: row;
    justify-content: space-around; /* Alinhar ícones com espaçamento */
    width: 100%;
    position: absolute;
    bottom: 10px;
  }

  .card-actions button,
  .card-actions .share-link,
  .card-actions .comment-button {
    margin-bottom: 0;
    width: auto;
    text-align: center;
  }

  .like-button .button-text,
  .comment-button .button-text,
  .share-link .button-text {
    display: none;
  }
}
</style>
