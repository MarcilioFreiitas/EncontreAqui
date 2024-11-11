import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import CommercePage from "@/pages/CommercePage.vue"; // Exemplo de outras páginas
import ServicePage from "@/pages/ServicePage.vue";
import RentalPage from "@/pages/RentalPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/comercios", component: CommercePage },
  { path: "/servicos", component: ServicePage },
  { path: "/aluguels", component: RentalPage },
  // Adicione outras rotas conforme necessário
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
