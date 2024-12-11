<template>
  <div>
    <Header />
    <div class="banner">
      <div class="banner-content">
        <h1>Focamos em oferecer</h1>
        <h1>profissionalismo e competência</h1>
        <p>
          EncontreAqui é a sua plataforma local para descobrir os melhores
          comércios, serviços e aluguéis na sua cidade.
        </p>
        <p>Conectando com você o que há de melhor perto de você.</p>
        <router-link to="/sobre" class="saiba-mais-button"
          >Saiba mais</router-link
        >
      </div>
    </div>
    <div class="cards">
      <router-link to="/comercios" class="card">
        <img src="@/assets/comercio.png" alt="Comércio" />
        <h3>COMÉRCIOS</h3>
        <p>
          Encontre os melhores comércios locais, desde mercearias a lojas de
          vestuário. Suporte o negócio da sua comunidade e descubra novidades
          pertinho de você.
        </p>
      </router-link>

      <router-link to="/servicos" class="card">
        <img src="@/assets/servico.png" alt="Serviços" />
        <h3>SERVIÇOS</h3>
        <p>
          Precisa de um encanador, eletricista ou outro profissional? Nossa
          lista de serviços locais conecta você aos melhores profissionais da
          cidade, prontos para te atender.
        </p>
      </router-link>

      <router-link to="/aluguels" class="card">
        <img src="@/assets/aluguel.png" alt="Aluguéis" />
        <h3>ALUGUÉIS</h3>
        <p>
          Buscando uma casa, apartamento ou ponto comercial para alugar? Confira
          nossas opções de aluguéis na cidade, com detalhes e contato direto com
          os proprietários.
        </p>
      </router-link>

      <router-link to="/encontre" class="card">
        <img src="@/assets/encontro.png" alt="Encontro" />
        <h3>ENCONTRE E CONECTE</h3>
        <p>
          Precisa de um serviço específico ou está oferecendo algo especial?
          Publique suas necessidades e ofertas na nossa plataforma e conecte-se
          com outras pessoas na sua área.
        </p>
      </router-link>

      <router-link to="/vendas" class="card">
        <img src="@/assets/venda.png" alt="Venda" />
        <h3>VENDA</h3>
        <p>
          Encontre as melhores ofertas de venda na sua região. Produtos de
          qualidade esperando por você.
        </p>
      </router-link>

      <router-link to="/viagem" class="card">
        <img src="@/assets/viajem.png" alt="Viagem Compartilhada" />
        <h3>VIAGEM COMPARTILHADA</h3>
        <p>
          Descubra opções de viagens compartilhadas para economizar e conhecer
          novas pessoas durante suas viagens.
        </p>
      </router-link>
    </div>

    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Logo" />
    </div>
    <div class="sections">
      <div class="section">
        <img src="@/assets/confianca.png" alt="Confiança" />
        <div class="section-content">
          <h3>Confiança</h3>
          <p>
            Nosso sistema é projetado para garantir total confiança, oferecendo
            segurança e transparência em cada interação.
          </p>
        </div>
      </div>
      <div class="section">
        <img src="@/assets/validacao.png" alt="Credibilidade" />
        <div class="section-content">
          <h3>Credibilidade</h3>
          <p>
            Fornecemos informações precisas e verificadas para que você possa
            tomar decisões informadas e seguras.
          </p>
        </div>
      </div>
      <div class="section">
        <img src="@/assets/ethics.png" alt="Ética" />
        <div class="section-content">
          <h3>Ética</h3>
          <p>
            Nossa plataforma opera com os mais altos padrões éticos, promovendo
            justiça, honestidade e responsabilidade.
          </p>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-overlay">
        <div class="form-content">
          <h2>Entre em contato conosco</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" v-model="nome" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" />
            </div>
            <div class="form-group">
              <label for="message">Mensagem</label>
              <textarea id="message" v-model="mensagem"></textarea>
            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
        <div class="contact-info">
          <h3>Informações de Contato</h3>
          <p>Email: contato@encontreaqui.com</p>
          <p>Telefone: (81) 99999-9999</p>
          <p>Endereço: Rua Exemplo, 123, Centro, Recife - PE, Brasil</p>
        </div>
      </div>
    </div>

    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

const auth = getAuth();
const isAuthenticated = ref(false);

const nome = ref("");
const email = ref("");
const mensagem = ref("");

const submitForm = async () => {
  try {
    await addDoc(collection(db, "contatos"), {
      nome: nome.value,
      email: email.value,
      mensagem: mensagem.value,
    });
    alert("Mensagem enviada com sucesso!");
    nome.value = "";
    email.value = "";
    mensagem.value = "";
  } catch (e) {
    console.error("Erro ao enviar mensagem: ", e);
    alert(
      "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
    );
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    isAuthenticated.value = false;
  } catch (error) {
    console.error("Erro ao fazer logout: ", error);
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
  });
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.banner {
  width: 100%;
  height: 50vh; /* Aumentado para 70vh */
  background: url("@/assets/banner.jpeg") no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: flex-start;
  padding: 2rem 0;
}

.banner-content {
  margin-left: 2rem;
  color: #fff;
  font-family: "Inter", sans-serif;
  max-width: 600px; /* Aumentar espaço ocupado */
}

.banner-content h1,
.banner-content h2 {
  margin: 0;
  font-weight: bold;
}

.banner-content h2 {
  margin-top: 0.5rem;
}

.banner-content p {
  margin: 1rem 0 0;
  font-size: 1.2rem; /* Aumentar o tamanho da fonte */
}

.saiba-mais-button {
  display: inline-block;
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  text-decoration: none;
  margin-top: 1rem;
  transform: scale(1.1); /* Cresce um pouco */
  transition: background-color 0.3s, transform 0.3s;
}

.auth-buttons {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.auth-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 1rem;
}

.auth-button:hover {
  background-color: #333;
}

.user-icon {
  width: 20px;
  height: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Define 3 colunas */
  gap: 1rem;
  margin-top: -4rem;
  padding: 2rem;
}

.card {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem; /* Aumentar o padding */
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s, background-color 0.3s;
  text-decoration: none; /* Remove o sublinhado */
  color: inherit; /* Mantém a cor do texto */
  width: calc(100% - 100px); /* Reduzir a largura */
}

.card:hover {
  transform: translateY(-10px);
  background-color: #f0f0f0;
}

.card img {
  height: 70px; /* Aumentar a altura da imagem */
}

.logo-section {
  text-align: center;
  margin-top: 2rem;
}

.logo-section img {
  width: 10%;
}

.sections {
  display: flex;
  flex-direction: column; /* Alterado para coluna */
  align-items: center; /* Centraliza as seções */
  padding: 2rem;
}

.section {
  display: flex;
  width: 70%; /* Ajustado para 80% da largura */
  margin-bottom: 1rem; /* Espaço entre as seções */
  padding: 4rem; /* Aumentar o padding */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Efeito profissional */
  transition: transform 0.3s;
}

.section:hover {
  transform: translateY(-10px); /* Crescer ao passar o mouse */
}

.section img {
  height: 50px;
}

.section-content {
  margin-left: 1rem;
}

.section h3 {
  margin: 0;
}

.section p {
  margin-top: 0.5rem;
  text-align: left;
  line-height: 1.5; /* Aumentar o espaço entre linhas */
  max-height: 7rem; /* Aumentar a altura máxima dos parágrafos */
}

.form-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 90vh; /* Alterado para min-height */
  background: url("@/assets/banner2.jpg") no-repeat center center;
  background-size: cover;
  position: relative;
  margin-top: 4rem; /* Adicionado espaço extra acima para não sobrepor o card anterior */
  margin-bottom: 4rem; /* Adicionado espaço extra abaixo para não sobrepor o footer */
}

.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Efeito escuro */
  display: flex;
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
  align-items: center; /* Centraliza o conteúdo verticalmente */
  flex-direction: column; /* Organiza os itens em coluna */
}

.form-content {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 10px;
  width: 40%;
  max-width: 500px;
  text-align: center;
  margin-left: 0; /* Remove o espaçamento à esquerda */
}

.form-content h2 {
  margin-bottom: 1rem;
  font-family: "Inter", sans-serif;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-family: "Inter", sans-serif;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  font-family: "Inter", sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
}

.contact-info {
  width: 50%;
  padding: 2rem;
  color: #fff;
  font-family: "Inter", sans-serif;
  text-align: center; /* Centraliza o texto */
}

.contact-info h3 {
  margin-bottom: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

/* Estilos de responsividade */
@media (max-width: 768px) {
  .banner-content {
    max-width: 100%;
    padding: 1rem;
    text-align: center;
  }
  .logo-section img {
    width: 150px; /* Tamanho do logo para telas menores */
  }

  .cards {
    grid-template-columns: 1fr; /* Definir 1 coluna em telas menores */
    gap: 1rem;
    margin-top: 1rem;
  }

  .card {
    width: 80%;
    margin-bottom: 1rem;
  }

  .sections {
  }

  .section {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .form-section {
    flex-direction: column;
    min-height: 100vh; /* Garante que a altura mínima seja respeitada */
    margin-top: 2rem; /* Ajuste o espaço acima para dispositivos móveis */
    margin-bottom: 2rem; /* Ajuste o espaço abaixo para dispositivos móveis */
  }

  .form-overlay {
    justify-content: center; /* Centraliza o conteúdo horizontalmente */
    align-items: center; /* Centraliza o conteúdo verticalmente */
  }

  .form-content {
    width: 70%;
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .contact-info {
    width: 80%;
    padding: 1rem;
    text-align: center; /* Centraliza o texto */
  }

  .footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer .logo {
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .banner-content h1,
  .banner-content h2,
  .banner-content p {
    font-size: 1.3rem; /* Ajustar tamanho da fonte para dispositivos menores */
  }
  .logo-section img {
    width: 150px; /* Tamanho do logo para telas ainda menores */
  }
  .form-content h2 {
    font-size: 1.2rem;
  }

  .form-group input,
  .form-group textarea,
  button {
    font-size: 0.9rem;
  }
}
</style>
