<template>
  <div>
    <Header />
    <div class="encontre-container">
      <h1>Encontre e Conecte</h1>
      <form v-if="isAuthenticated" @submit.prevent="addPost">
        <div class="form-group">
          <label for="title">Título</label>
          <input type="text" id="title" v-model="newPost.title" required />
        </div>
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea
            id="description"
            v-model="newPost.description"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="payment">Quanto está disposto a pagar</label>
          <input
            type="number"
            id="payment"
            v-model="newPost.payment"
            required
          />
        </div>
        <div class="form-group">
          <label for="negotiable"
            >Está disposto a propostas ou refazer orçamento?</label
          >
          <select id="negotiable" v-model="newPost.negotiable" required>
            <option value="Propostas aceitas">Propostas aceitas</option>
            <option value="Refazer orçamento">Refazer orçamento</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <button type="submit">Publicar</button>
      </form>
      <p v-else>
        Por favor, faça <router-link to="/login">login</router-link> para
        publicar uma postagem.
      </p>
      <div class="post-list">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="{ name: 'PostDetailPage', params: { id: post.id } }"
          class="post-card"
        >
          <img :src="post.userPhoto" alt="Foto do usuário" class="user-photo" />
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <p><strong>Quanto disposto a pagar:</strong> {{ post.payment }}</p>
            <p><strong>Negociável:</strong> {{ post.negotiable }}</p>
            <p><strong>Publicado por:</strong> {{ post.user }}</p>
          </div>
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
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
      payment: 0, // Adicionar campo para valor do pagamento
      negotiable: "Propostas aceitas", // Adicionar campo para opções de negociação
      user: "Usuário Anônimo",
      userPhoto: "", // Adicionar o campo para a URL da foto do usuário
    });
    const posts = ref([]);
    const isAuthenticated = ref(false);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true;
        newPost.value.user = user.displayName || "Usuário Anônimo";
        newPost.value.userPhoto = user.photoURL || "URL_DA_FOTO_PADRAO"; // Atualizar com a URL da foto do usuário ou uma foto padrão
      }
    });

    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      posts.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    const addPost = async () => {
      try {
        await addDoc(collection(db, "posts"), {
          ...newPost.value,
        });
        alert("Postagem publicada com sucesso!");
        fetchPosts();
        newPost.value.title = "";
        newPost.value.description = "";
        newPost.value.payment = 0;
        newPost.value.negotiable = "Propostas aceitas";
      } catch (e) {
        console.error("Erro ao publicar postagem: ", e);
        alert(
          "Ocorreu um erro ao publicar a postagem. Por favor, tente novamente."
        );
      }
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      newPost,
      posts,
      addPost,
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
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
}

.post-list {
  margin-top: 2rem;
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

/* Estilos responsivos para dispositivos móveis */
@media (max-width: 768px) {
  .post-card {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
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
}
</style>
