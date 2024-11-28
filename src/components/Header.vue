<template>
  <header class="header" :class="{ sticky: isSticky }">
    <router-link to="/" class="logo-link">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </router-link>
    <!-- Barra de pesquisa condicional -->
    <div v-if="showSearch" class="search-bar">
      <input type="text" placeholder="Pesquisar..." />
      <img src="@/assets/lupa.png" alt="Pesquisar" class="search-icon" />
    </div>
    <nav class="nav">
      <ul class="nav-links">
        <li><router-link to="/comercios">Comércio</router-link></li>
        <li><router-link to="/servicos">Serviços</router-link></li>
        <li><router-link to="/aluguels">Aluguéis</router-link></li>
        <li><router-link to="/sobre">Sobre</router-link></li>
      </ul>
      <router-link to="/login" class="cadastro-button">Login</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    showSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSticky: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isSticky = window.scrollY > 50;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  font-family: "Inter", sans-serif;
  transition: all 0.3s ease;
  box-shadow: none; /* Remover sombra ao desfixar */
  height: 40px; /* Fixar a altura do header */
}

.sticky {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Transparência */
  backdrop-filter: blur(10px); /* Efeito de vidro */
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra suave ao fixar */
}

.logo {
  height: 90px; /* Aumentar altura do logo */
  width: 90px; /* Aumentar largura do logo */
  margin: 0; /* Remover margens adicionais */
}

.logo-link {
  display: flex;
  align-items: center;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Reduzir gap */
}

.nav-links {
  display: flex;
  gap: 2rem; /* Aumentar espaço entre links */
  list-style-type: none;
  margin: 0;
}

.nav-links li a {
  color: #000;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
}

.nav-links li a:hover {
  color: #445669; /* Cor para o efeito hover */
  transform: scale(1.1); /* Cresce um pouco */
}

.cadastro-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  text-decoration: none;
  font-family: "Inter", sans-serif;
  transition: background-color 0.3s, transform 0.3s;
}

.cadastro-button:hover {
  background-color: #425161; /* Cor para o efeito hover */
  transform: scale(1.1); /* Cresce um pouco */
}

/* Estilos para a barra de pesquisa */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fcf8f8; /* Tom de cinza intermediário */
  padding: 0.5rem;
  border-radius: 15px;
  width: 50%; /* Largura adequada */
  height: 20px;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  flex-grow: 1;
}

.search-icon {
  height: 20px;
  width: 20px;
  margin-left: 0.5rem;
}

/* Estilos de responsividade */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
  }

  .logo {
    height: 70px; /* Ajustar altura do logo */
    width: 70px; /* Ajustar largura do logo */
  }

  .nav {
    justify-content: center;
    margin-top: 1rem;
  }

  .search-bar {
    width: 80%;
    margin: 1rem 0;
  }

  .cadastro-button {
    padding: 0.5rem 2rem;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links li a {
    font-size: 0.9rem;
  }

  .search-bar {
    width: 100%;
  }
}
</style>
