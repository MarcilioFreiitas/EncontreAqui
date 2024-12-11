<template>
  <div>
    <Header />
    <div class="vendas">
      <h1>Produtos à Venda</h1>
      <div v-if="isAuthenticated && !mostrarFormulario">
        <button @click="mostrarFormulario = true">Publicar Produto</button>
      </div>
      <form
        v-if="isAuthenticated && mostrarFormulario"
        @submit.prevent="addProduto"
      >
        <div class="form-group">
          <label for="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            v-model="novoProduto.titulo"
            placeholder="Ex: Vendo Gol 2014"
            required
          />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea
            id="descricao"
            v-model="novoProduto.descricao"
            placeholder="Descrição do produto"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="whatsapp">Número do WhatsApp</label>
          <input
            type="text"
            id="whatsapp"
            v-model="novoProduto.whatsapp"
            placeholder="55"
            required
          />
        </div>
        <div class="form-group">
          <label for="preco">Preço</label>
          <input
            type="number"
            id="preco"
            v-model="novoProduto.preco"
            required
          />
        </div>
        <div class="form-group">
          <label for="negociavel">Preço negociável?</label>
          <select id="negociavel" v-model="novoProduto.negociavel" required>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="form-group">
          <label for="imagem">Imagem do Produto</label>
          <input type="file" id="imagem" @change="onFileChange" required />
        </div>
        <button type="submit">Publicar</button>
      </form>
      <p v-else-if="!isAuthenticated">
        Por favor, faça <router-link to="/login">login</router-link> para
        publicar um produto.
      </p>
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando produtos...
      </div>
      <div v-else>
        <div class="produtos">
          <div v-for="produto in produtos" :key="produto.id" class="produto">
            <div class="produto-header">
              <img
                v-if="produto.userPhoto"
                :src="produto.userPhoto"
                alt="Foto do usuário"
                class="user-photo"
              />
            </div>
            <img
              :src="produto.imagem"
              alt="Imagem do Produto"
              class="produto-img"
            />
            <h3>{{ produto.titulo }}</h3>
            <p>{{ produto.descricao }}</p>
            <p class="preco"><strong>Preço:</strong> R$ {{ produto.preco }}</p>
            <p><strong>Preço negociável?:</strong> {{ produto.negociavel }}</p>
            <p><strong>Publicado por:</strong> {{ produto.usuario }}</p>
            <a
              :href="`https://wa.me/${produto.whatsapp}`"
              target="_blank"
              class="whatsapp-link"
            >
              <i class="bi bi-whatsapp"></i> Contatar via WhatsApp
            </a>
            <a
              :href="getShareLink(produto)"
              target="_blank"
              class="share-whatsapp-link"
            >
              <i class="bi bi-share"></i> Compartilhar no WhatsApp
            </a>
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
import { collection, getDocs, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Adicione esta linha

export default {
  name: "VendasPage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      produtos: [],
      novoProduto: {
        titulo: "",
        descricao: "",
        whatsapp: "55",
        preco: 0,
        negociavel: "Sim",
        imagem: null,
        usuario: "",
        userPhoto: "",
      },
      isLoading: true, // Estado de carregamento
      isAuthenticated: false,
      mostrarFormulario: false,
      imagemUrl: "",
    };
  },
  methods: {
    async fetchProdutos() {
      const querySnapshot = await getDocs(collection(db, "vendas"));
      this.produtos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.isLoading = false; // Atualiza o estado de carregamento
    },
    onFileChange(event) {
      this.novoProduto.imagem = event.target.files[0];
    },
    async addProduto() {
      try {
        const storage = getStorage();
        const storageReference = storageRef(
          storage,
          `produtos/${this.novoProduto.imagem.name}`
        );
        await uploadBytes(storageReference, this.novoProduto.imagem);
        const imagemUrl = await getDownloadURL(storageReference);

        await addDoc(collection(db, "vendas"), {
          ...this.novoProduto,
          imagem: imagemUrl,
        });

        alert("Produto publicado com sucesso!");
        this.fetchProdutos();
        this.resetFormulario();
      } catch (error) {
        console.error("Erro ao publicar produto: ", error);
        alert(
          "Ocorreu um erro ao publicar o produto. Por favor, tente novamente."
        );
      }
    },
    resetFormulario() {
      this.novoProduto = {
        titulo: "",
        descricao: "",
        whatsapp: "55",
        preco: 0,
        negociavel: "Sim",
        imagem: null,
        usuario: "",
        userPhoto: "",
      };
      this.mostrarFormulario = false;
    },

    getShareLink(produto) {
      const url = `${window.location.origin}/vendas/${produto.id}`; // Modifique isso conforme necessário
      const message = `Confira este produto: ${produto.titulo} - ${produto.descricao}. Preço: R$ ${produto.preco}. Negociável: ${produto.negociavel}. Veja mais aqui: ${url}`;
      return `https://wa.me/?text=${encodeURIComponent(message)}`;
    },
  },

  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.novoProduto.usuario = user.displayName || "Usuário Anônimo";
        this.novoProduto.userPhoto = user.photoURL || "URL_DA_FOTO_PADRAO";
      } else {
        this.isAuthenticated = false;
      }
    });
    this.fetchProdutos();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

/* Estilos Gerais */
body {
  font-family: "Inter", sans-serif;
}

.vendas {
  padding: 2rem;
}

.vendas h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
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

.produtos {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  justify-items: center;
  align-items: start;
}

.produto {
  position: relative;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s, background-color 0.3s;
  width: 100%;
  max-width: 300px;
}

.produto-header {
  position: absolute;
  top: 10px;
  left: 10px;
}

.produto:hover {
  transform: translateY(-10px);
  background-color: #f0f0f0;
}

.produto-img {
  height: 150px;
  width: auto;
  margin-top: 2.5rem; /* Espaçamento entre a foto do usuário e a imagem do produto */
  border-radius: 10px;
}

.produto h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.produto p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #666;
}

.produto .preco {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #363a3f;
  font-weight: bold;
}

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.whatsapp-link,
.share-whatsapp-link {
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
  color: #25d366;
  text-decoration: none;
  margin-top: 1rem;
}

.whatsapp-link i,
.share-whatsapp-link i {
  margin-right: 0.5rem; /* Espaço entre o ícone e o texto */
}

.whatsapp-link:hover,
.share-whatsapp-link:hover {
  color: #128c7e;
}

/* Estilos de Responsividade */
@media (max-width: 768px) {
  .vendas h1 {
    font-size: 1.8rem;
  }

  .produto {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .vendas h1 {
    font-size: 1.5rem;
  }

  .produto {
    padding: 1rem;
  }

  .produto h3 {
    font-size: 1rem;
  }

  .produto p {
    font-size: 0.9rem;
  }

  .produto .preco {
    font-size: 1rem;
  }
}
</style>
