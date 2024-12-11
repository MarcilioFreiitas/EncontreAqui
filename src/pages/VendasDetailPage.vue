<template>
  <div>
    <Header />
    <div class="vendas-detalhe">
      <div class="produto-detalhe">
        <div class="produto-header">
          <img
            v-if="produto && produto.userPhoto"
            :src="produto.userPhoto"
            alt="Foto do usuário"
            class="user-photo"
          />
        </div>
        <img
          v-if="produto"
          :src="produto.imagem"
          alt="Imagem do Produto"
          class="produto-img"
        />
        <h3 v-if="produto">{{ produto.titulo }}</h3>
        <p v-if="produto">{{ produto.descricao }}</p>
        <p v-if="produto" class="preco">
          <strong>Preço:</strong> R$ {{ produto.preco }}
        </p>
        <p v-if="produto">
          <strong>Preço negociável?:</strong> {{ produto.negociavel }}
        </p>
        <p v-if="produto">
          <strong>Publicado por:</strong> {{ produto.usuario }}
        </p>
        <a
          v-if="produto"
          :href="`https://wa.me/${produto.whatsapp}`"
          target="_blank"
          class="whatsapp-link"
        >
          <i class="bi bi-whatsapp"></i> Contatar via WhatsApp
        </a>
        <a
          v-if="produto"
          :href="getShareLink(produto)"
          target="_blank"
          class="share-whatsapp-link"
        >
          <i class="bi bi-share"></i> Compartilhar no WhatsApp
        </a>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "VendasDetailPage",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const produto = ref(null);
    const fetchProduto = async (id) => {
      const docRef = doc(db, "vendas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        produto.value = docSnap.data();
        setMetaTags(produto.value);
      } else {
        console.log("No such document!");
      }
    };
    const setMetaTags = (produto) => {
      document
        .querySelector('meta[property="og:title"]')
        .setAttribute("content", produto.titulo);
      document
        .querySelector('meta[property="og:description"]')
        .setAttribute("content", produto.descricao);
      document
        .querySelector('meta[property="og:image"]')
        .setAttribute("content", produto.imagem);
      document
        .querySelector('meta[property="og:url"]')
        .setAttribute("content", window.location.href);
    };
    onMounted(() => {
      fetchProduto(route.params.id);
    });
    return {
      produto,
      getShareLink(produto) {
        const url = `${window.location.origin}/vendas/${produto.id}`;
        const message = `Confira este produto: ${produto.titulo} - ${produto.descricao}. Preço: R$ ${produto.preco}. Negociável: ${produto.negociavel}. Veja mais aqui: ${url}`;
        return `https://wa.me/?text=${encodeURIComponent(message)}`;
      },
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

/* Estilos Gerais */
body {
  font-family: "Inter", sans-serif;
}

.vendas-detalhe {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.produto-detalhe {
  position: relative;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s, background-color 0.3s;
  width: 100%;
  max-width: 400px;
}

.produto-header {
  position: absolute;
  top: 10px;
  left: 10px;
}

.produto-img {
  height: 200px;
  width: auto;
  margin-top: 2.5rem; /* Espaçamento entre a foto do usuário e a imagem do produto */
  border-radius: 10px;
}

.produto-detalhe h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: #333;
}

.produto-detalhe p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #666;
}

.produto-detalhe .preco {
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
</style>
