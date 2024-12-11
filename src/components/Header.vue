<template>
  <header class="header" :class="{ sticky: isSticky }">
    <router-link to="/" class="logo-link">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </router-link>
    <div v-if="showSearch" class="search-bar">
      <input
        type="text"
        placeholder="Pesquisar..."
        v-model="searchQuery"
        @keyup.enter="search"
      />
      <img
        src="@/assets/lupa.png"
        alt="Pesquisar"
        class="search-icon"
        @click="search"
      />
    </div>
    <nav class="nav">
      <ul class="nav-links">
        <li>
          <router-link to="/encontre"
            ><i class="bi bi-people"></i> Encontre e Conecte</router-link
          >
        </li>
        <li><router-link to="/comercios">Comércio</router-link></li>
        <li><router-link to="/servicos">Serviços</router-link></li>
        <li><router-link to="/aluguels">Aluguéis</router-link></li>
        <li><router-link to="/vendas">Vendas</router-link></li>
        <li><router-link to="/viagem">Viagem Compartilhada</router-link></li>
        <li><router-link to="/sobre">Sobre</router-link></li>

        <!-- Adicionando a nova opção -->
      </ul>
      <div v-if="isAuthenticated" class="user-section" @click="toggleDropdown">
        <img
          src="@/assets/do-utilizador.png"
          alt="User Icon"
          class="user-icon"
        />
        <div v-if="dropdownVisible" class="dropdown-menu">
          <button @click="logout" class="dropdown-item">Sair</button>
        </div>
      </div>
      <router-link v-else to="/login" class="cadastro-button"
        >Login</router-link
      >
    </nav>
  </header>
</template>

<script>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default {
  name: "Header",
  props: {
    showSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter();
    const isSticky = ref(false);
    const isAuthenticated = ref(false);
    const dropdownVisible = ref(false);
    const searchQuery = ref("");
    const auth = getAuth();

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    const handleScroll = () => {
      isSticky.value = window.scrollY > 50;
    };

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    const logout = async () => {
      try {
        await signOut(auth);
        isAuthenticated.value = false;
        dropdownVisible.value = false;
      } catch (error) {
        console.error("Erro ao fazer logout: ", error);
      }
    };

    const search = () => {
      if (!searchQuery.value.trim()) return;

      router.push({
        name: "SearchResults",
        query: { q: searchQuery.value.toLowerCase() }, // Converter para minúsculas
      });
    };

    return {
      isSticky,
      isAuthenticated,
      dropdownVisible,
      handleScroll,
      toggleDropdown,
      logout,
      searchQuery,
      search,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem; /* Reduzir padding */
  background-color: #fff;
  font-family: "Inter", sans-serif;
  transition: all 0.3s ease;
  box-shadow: none;
}

.sticky {
  position: fixed;
  top: 0;
  width: 99%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 70px; /* Reduzir altura do logo */
  width: 70px; /* Reduzir largura do logo */
  margin: 0;
}

.logo-link {
  display: flex;
  align-items: center;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style-type: none;
  margin: 0;
}

.nav-links li a {
  color: #000;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
}

.nav-links li a:hover {
  color: #445669;
  transform: scale(1.1);
}

.cadastro-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 0.5rem; /* Reduzir padding */
  border-radius: 10px; /* Reduzir borda */
  text-decoration: none;
  font-family: "Inter", sans-serif;
  transition: background-color 0.3s, transform 0.3s;
}

.cadastro-button:hover {
  background-color: #425161;
  transform: scale(1.1);
}

.user-section {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-left: 1rem; /* Adicionar margem esquerda para espaçamento */
}

.user-icon {
  width: 25px; /* Reduzir tamanho do ícone */
  height: 25px; /* Reduzir tamanho do ícone */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1001;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fcf8f8;
  padding: 0.25rem; /* Reduzir padding */
  border-radius: 15px;
  width: 50%;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  padding: 0.25rem;
  font-size: 0.9rem; /* Reduzir tamanho da fonte */
  flex-grow: 1;
}

.search-icon {
  height: 20px;
  width: 20px;
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: row;
    height: auto;
    padding: 0.5rem; /* Ajustar padding */
  }

  .logo {
    height: 50px; /* Reduzir ainda mais para dispositivos móveis */
    width: 50px;
  }

  .nav {
    justify-content: center;
  }

  .cadastro-button {
    padding: 0.25rem 1rem;
    margin-left: 1rem; /* Adicionar margem esquerda para espaçamento */
  }

  .user-section {
    margin-left: 1rem; /* Adicionar margem esquerda para espaçamento */
  }

  .sticky {
    position: static;
    background-color: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .nav-links {
    display: none;
  }

  .drawer {
    display: block;
  }

  .drawer .v-list-item {
    display: flex;
    justify-content: center;
  }

  .drawer .v-list-item a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    font-size: 1.1rem;
    font-family: "Inter", sans-serif;
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
    width: calc(
      100% - 70px
    ); /* Ajustar largura para dar espaço ao lado direito */
  }
}
</style>
