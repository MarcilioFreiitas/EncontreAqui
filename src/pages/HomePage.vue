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
      <div class="card">
        <img src="@/assets/comercio.png" alt="Comércio" />
        <h3>COMÉRCIOS</h3>
        <p>
          Encontre os melhores comércios locais, desde mercearias a lojas de
          vestuário. Suporte o negócio da sua comunidade e descubra novidades
          pertinho de você.
        </p>
      </div>
      <div class="card">
        <img src="@/assets/servico.png" alt="Serviços" />
        <h3>SERVIÇOS</h3>
        <p>
          Precisa de um encanador, eletricista ou outro profissional? Nossa
          lista de serviços locais conecta você aos melhores profissionais da
          cidade, prontos para te atender.
        </p>
      </div>
      <div class="card">
        <img src="@/assets/aluguel.png" alt="Aluguéis" />
        <h3>ALUGUÉIS</h3>
        <p>
          Buscando uma casa, apartamento ou ponto comercial para alugar? Confira
          nossas opções de aluguéis na cidade, com detalhes e contato direto com
          os proprietários.
        </p>
      </div>
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
            segurança e transparência em cada interação. Conectamos você aos
            melhores comerciantes e prestadores de serviços locais, confiáveis e
            comprometidos com a qualidade.
          </p>
        </div>
      </div>
      <div class="section">
        <img src="@/assets/validacao.png" alt="Credibilidade" />
        <div class="section-content">
          <h3>Credibilidade</h3>
          <p>
            Com anos de experiência e um compromisso inabalável com a
            excelência, nosso sistema é sinônimo de credibilidade. Fornecemos
            informações precisas e verificadas para que você possa tomar
            decisões informadas e seguras.
          </p>
        </div>
      </div>
      <div class="section">
        <img src="@/assets/ethics.png" alt="Ética" />
        <div class="section-content">
          <h3>Ética</h3>
          <p>
            Nossa plataforma opera com os mais altos padrões éticos, promovendo
            justiça, honestidade e responsabilidade. Priorizamos a integridade
            em todas as nossas ações para garantir uma experiência justa e
            respeitosa para todos os usuários.
          </p>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-overlay">
        <div class="form-content">
          <h2>Entre em contato conosco</h2>
          <form>
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" name="name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div class="form-group">
              <label for="message">Mensagem</label>
              <textarea id="message" name="message"></textarea>
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
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
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

.cards {
  display: flex;
  justify-content: space-around;
  margin-top: -4rem;
  padding: 2rem;
}

.card {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 25%;
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s, background-color 0.3s;
}

.card:hover {
  transform: translateY(-10px);
  background-color: #f0f0f0; /* Efeito hover para cor */
}

.card img {
  height: 50px;
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
  width: 80%; /* Ajustado para 80% da largura */
  margin-bottom: 1rem; /* Espaço entre as seções */
  padding: 2rem; /* Aumentar o padding */
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60vh;
  background: url("@/assets/banner2.jpg") no-repeat center center;
  background-size: cover;
  position: relative;
}

.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Efeito escuro */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-content {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 10px;
  width: 40%;
  max-width: 500px;
  text-align: center;
  margin-left: 10rem; /* Espaçamento à esquerda */
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

  .cards {
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }

  .card {
    width: 80%;
    margin-bottom: 1rem;
  }

  .sections {
    padding: 1rem;
  }

  .section {
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .form-section {
    flex-direction: column;
    height: auto;
  }

  .form-content {
    width: 80%;
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .contact-info {
    width: 80%;
    padding: 1rem;
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
    font-size: 1rem; /* Ajustar tamanho da fonte para dispositivos menores */
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
