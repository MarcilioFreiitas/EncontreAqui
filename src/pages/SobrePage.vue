<template>
  <div class="about-container">
    <Header :showSearch="false" />
    <div class="about-content">
      <section class="intro">
        <img src="@/assets/logo.png" alt="Company Logo" class="company-logo" />
        <p>
          Nossa empresa foi fundada com a missão de facilitar a vida das
          pessoas, entregando valor e soluções inovadoras. Acreditamos que a
          tecnologia pode transformar a forma como vivemos e trabalhamos, e
          estamos comprometidos em desenvolver produtos e serviços que realmente
          fazem a diferença.
        </p>
      </section>
      <section class="values">
        <h2>Nossos Valores</h2>
        <ul>
          <li>
            <strong>Inovação:</strong> Estamos sempre buscando novas ideias e
            tecnologias para melhorar nossos produtos.
          </li>
          <li>
            <strong>Qualidade:</strong> Nossos produtos são desenvolvidos com os
            mais altos padrões de qualidade.
          </li>
          <li>
            <strong>Compromisso:</strong> Estamos comprometidos com a satisfação
            de nossos clientes e parceiros.
          </li>
          <li>
            <strong>Sustentabilidade:</strong> Nos preocupamos com o impacto
            ambiental de nossas ações e produtos.
          </li>
        </ul>
      </section>
      <section class="contact">
        <h2>Contato</h2>
        <p>
          Para mais informações, entre em contato conosco através do email:
          <a href="mailto:contato@empresa.com">encontreaqui@gmail.com</a>
        </p>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "AboutPage",
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.about-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
}

h1,
h2 {
  color: #333;
}

.intro,
.values,
.team,
.contact {
  margin-bottom: 2rem;
}

.company-logo {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
}

.team-member {
  margin: 1rem;
  text-align: center;
}

.team-photo {
  width: 150px;
  height: auto;
  border-radius: 50%;
}

ul {
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}
</style>
