<template>
  <div class="dashboard-container">
    <!-- Header -->
    <Header :showSearch="false" />

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-content">
        <!-- Title and Refresh -->
        <div class="dashboard-header-area">
          <h1>Painel de Controle</h1>
          <button @click="loadStats" class="refresh-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="refresh-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a1 1 0 011-1h2a1 1 0 110 2H6v1a1 1 0 11-2 0V4zM4 
                   15a1 1 0 100 2h2a1 1 0 100-2H6v-1a1 1 0 10-2 0v1zm12-11
                   a1 1 0 011 1v2a1 1 0 11-2 0V6h-1a1 1 0 110-2h2zM15
                   15a1 1 0 10-1 1h-2a1 1 0 100 2h2a1 1 0 001-1v-1a1 
                   1 0 10-2 0v1zm-7-.707l-3-3a1 1 0 011.414-1.414L8
                   12.586l6.293-6.293a1 1 0 111.414 1.414l-7 
                   7a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Atualizar
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-cards-grid">
          <div v-for="card in statsCards" :key="card.title" class="stats-card">
            <div :class="['card-icon', card.bg]">
              <component :is="card.icon" class="icon" />
            </div>
            <div>
              <p class="card-title">{{ card.title }}</p>
              <p class="card-value">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";
import { User, Building, AlertCircle, MessageSquare } from "lucide-vue-next";

const adminStore = useAdminStore();
const stats = ref({
  pendingMerchants: 0,
  activeUsers: 0,
  flaggedAds: 0,
  flaggedComments: 0,
});

const loadStats = async () => {
  const data = await adminStore.fetchDashboardStats();
  stats.value = data;
};

onMounted(loadStats);

const statsCards = ref([
  {
    title: "Comerciantes Pendentes",
    value: stats.value.pendingMerchants,
    icon: Building,
    bg: "bg-yellow-500",
  },
  {
    title: "Usuários Ativos",
    value: stats.value.activeUsers,
    icon: User,
    bg: "bg-green-500",
  },
  {
    title: "Anúncios Reportados",
    value: stats.value.flaggedAds,
    icon: AlertCircle,
    bg: "bg-red-500",
  },
  {
    title: "Comentários Ofensivos",
    value: stats.value.flaggedComments,
    icon: MessageSquare,
    bg: "bg-purple-500",
  },
]);

watch(stats, (newStats) => {
  statsCards.value = [
    { ...statsCards.value[0], value: newStats.pendingMerchants },
    { ...statsCards.value[1], value: newStats.activeUsers },
    { ...statsCards.value[2], value: newStats.flaggedAds },
    { ...statsCards.value[3], value: newStats.flaggedComments },
  ];
});
</script>

<style scoped>
/* Container principal */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7fafc; /* Semelhante ao bg-gray-100 */
  font-family: Arial, sans-serif;
}

/* Main content area */
.dashboard-main {
  flex-grow: 1;
  padding: 24px;
}

/* Centraliza e restringe a largura do conteúdo */
.dashboard-content {
  max-width: 1280px; /* Aproximado de max-w-7xl */
  margin: 0 auto;
}

/* Espaçamento vertical entre os elementos internos */
.dashboard-content > * + * {
  margin-top: 24px;
}

/* Área de título e botão */
.dashboard-header-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 640px) {
  .dashboard-header-area {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* Título principal */
.dashboard-header-area h1 {
  font-size: 36px; /* Aproximadamente text-4xl */
  font-weight: bold;
  color: #2d3748; /* Aproximadamente text-gray-800 */
  margin: 0;
}

/* Botão Atualizar */
.refresh-button {
  display: flex;
  align-items: center;
  padding: 8px 16px; /* Aproximadamente py-2 e px-4 */
  background-color: #3182ce; /* Aproximadamente bg-blue-600 */
  color: #ffffff;
  border: none;
  border-radius: 8px; /* Aproximadamente rounded-lg */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.refresh-button:hover {
  background-color: #2b6cb0; /* Aproximadamente bg-blue-700 */
}

.refresh-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #4299e1; /* Aproximadamente focus:ring-2 e focus:ring-blue-500 */
}

/* Ícone do botão */
.refresh-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* Grid dos Cards */
.stats-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .stats-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Cartão de Estatística */
.stats-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Ícone de cada card */
.card-icon {
  padding: 12px;
  border-radius: 50%;
}

/* Cores de fundo para ícones (simulando as classes Tailwind) */
.bg-yellow-500 {
  background-color: #ecc94b;
}

.bg-green-500 {
  background-color: #48bb78;
}

.bg-red-500 {
  background-color: #f56565;
}

.bg-purple-500 {
  background-color: #9f7aea;
}

/* Ícone interno (SVG) */
.icon {
  width: 24px;
  height: 24px;
  fill: #ffffff;
}

/* Título do card */
.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280; /* Aproximadamente text-gray-500 */
  margin: 0;
}

/* Valor do card */
.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748; /* Aproximadamente text-gray-800 */
  margin: 0;
}
</style>
