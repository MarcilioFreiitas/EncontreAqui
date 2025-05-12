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
        <li><router-link to="/comercios">Comércio</router-link></li>
        <li><router-link to="/servicos">Serviços</router-link></li>
        <li><router-link to="/aluguels">Aluguéis</router-link></li>
        <li><router-link to="/sobre">Sobre</router-link></li>
      </ul>
      <div
        v-if="userStore.isAuthenticated"
        class="user-section"
        @click="goToProfile"
      >
        <img
          src="@/assets/do-utilizador.png"
          alt="User Icon"
          class="user-icon"
        />
      </div>
      <router-link v-else to="/login" class="cadastro-button">
        Login
      </router-link>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

export default {
  name: "Header",
  props: {
    showSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const isSticky = ref(false);
    const searchQuery = ref("");

    // Atualiza o estado sticky conforme o scroll
    const handleScroll = () => {
      isSticky.value = window.scrollY > 50;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("storage", () => {
        const token = localStorage.getItem("token");
        userStore.setToken(token);
      });
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    const goToProfile = () => {
      router.push("/profile");
    };

    const search = () => {
      if (!searchQuery.value.trim()) return;

      // Determina o contexto a partir do caminho da rota atual
      const currentPath = route.path;
      let searchContext = "";
      if (currentPath.startsWith("/comercios")) {
        searchContext = "comercios";
      } else if (currentPath.startsWith("/servicos")) {
        searchContext = "servicos";
      } else if (currentPath.startsWith("/aluguels")) {
        searchContext = "aluguels";
      } else {
        // Se não estiver em nenhuma destas páginas específicas, pode ser global ou um contexto padrão
        searchContext = "global";
      }

      // Emite o evento "searched" com o termo pesquisado e o contexto
      emit("searched", {
        query: searchQuery.value.toLowerCase(),
        context: searchContext,
      });

      // Opcional: redireciona para uma página de resultados com query parameters
      // router.push({ name: "SearchResults", query: { q: searchQuery.value.toLowerCase(), type: searchContext } });
    };

    return {
      isSticky,
      searchQuery,
      goToProfile,
      search,
      showSearch: props.showSearch,
      userStore,
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
  padding: 0.5rem 1rem;
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
  height: 70px;
  width: 70px;
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
  list-style: none;
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
  padding: 0.5rem 0.5rem;
  border-radius: 10px;
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
  cursor: pointer;
  margin-left: 1rem;
}

.user-icon {
  width: 25px;
  height: 25px;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fcf8f8;
  padding: 0.25rem;
  border-radius: 15px;
  width: 50%;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  padding: 0.25rem;
  font-size: 0.9rem;
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
    padding: 0.5rem;
  }
  .logo {
    height: 50px;
    width: 50px;
  }
  .nav {
    justify-content: center;
  }
  .cadastro-button {
    padding: 0.25rem 1rem;
    margin-left: 1rem;
  }
  .user-section {
    margin-left: 1rem;
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
    width: calc(100% - 70px);
  }
}
</style>
