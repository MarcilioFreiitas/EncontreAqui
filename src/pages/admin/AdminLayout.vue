<template>
  <div class="admin-container">
    <!-- Sidebar -->
    <aside :class="['sidebar', { 'sidebar--open': sidebarOpen }]">
      <div class="sidebar__header">
        <h2>Admin Panel</h2>
      </div>
      <nav class="sidebar__nav">
        <ul>
          <li v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.path"
              class="sidebar__link"
              active-class="sidebar__link--active"
              exact
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>

    <!-- Main content -->
    <div class="main">
      <!-- Header -->
      <header class="main__header">
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen">
          &#9776;
        </button>
        <h1 class="main__title">{{ currentTitle }}</h1>
        <div class="main__user">
          <img
            src="@/assets/user-avatar.png"
            alt="Avatar"
            class="main__avatar"
          />
          <span>{{ userName }}</span>
        </div>
      </header>

      <!-- Dynamic content -->
      <main class="main__content">
        <router-view @error="onViewError" />
      </main>

      <!-- Footer -->
      <footer class="main__footer">
        © 2025 EncontreAqui. Todos os direitos reservados.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  Home,
  UserPlus,
  Users,
  FileText,
  MessageSquare,
} from "lucide-vue-next";

const sidebarOpen = ref(false);
const route = useRoute();

const menuItems = [
  { name: "dashboard", label: "Dashboard", path: "/admin", icon: Home },
  {
    name: "merchants",
    label: "Aprovar Comerciantes",
    path: "/admin/merchants",
    icon: UserPlus,
  },
  {
    name: "users",
    label: "Gestão de Usuários",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "ads",
    label: "Moderação de Anúncios",
    path: "/admin/ads",
    icon: FileText,
  },
  {
    name: "comments",
    label: "Moderação de Comentários",
    path: "/admin/comments",
    icon: MessageSquare,
  },
];

const currentTitle = computed(() => {
  const found = menuItems.find((i) => i.path === route.path);
  return found ? found.label : "Admin";
});

const userName = ref("Administrador");

function onViewError(err) {
  console.error("Erro no componente filho:", err);
}
</script>

<style scoped>
/* Container geral */
.admin-container {
  display: flex;
  height: 100vh;
  margin: 0;
  font-family: sans-serif;
  background-color: #f4f6f8;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 1000;
}
.sidebar--open {
  left: 0;
}
@media (min-width: 768px) {
  .sidebar {
    left: 0;
  }
}

/* Sidebar header */
.sidebar__header {
  padding: 1rem;
  border-bottom: 1px solid #e2e2e2;
}
.sidebar__header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333333;
}

/* Navigation */
.sidebar__nav {
  margin-top: 1rem;
}
.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar__nav li + li {
  margin-top: 0.5rem;
}

/* Links */
.sidebar__link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #555555;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}
.sidebar__link:hover,
.sidebar__link--active {
  background-color: #e8f0fe;
  color: #1a73e8;
}
.sidebar__icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

/* Overlay em mobile */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 900;
}

/* Main area */
.main {
  margin-left: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}
@media (min-width: 768px) {
  .main {
    margin-left: 250px;
  }
}

/* Header */
.main__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.hamburger {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: inline-block;
}
.main__title {
  margin: 0;
  font-size: 1.25rem;
  color: #333333;
}
.main__user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555555;
}
.main__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #1a73e8;
}

/* Conteúdo dinâmico */
.main__content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Footer */
.main__footer {
  background-color: #ffffff;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #777777;
  border-top: 1px solid #e2e2e2;
}
</style>
