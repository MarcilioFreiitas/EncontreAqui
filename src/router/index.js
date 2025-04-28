import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import CommercePage from "@/pages/CommercePage.vue";
import ServicePage from "@/pages/ServicePage.vue";
import RentalPage from "@/pages/RentalPage.vue";
import CategoryPage from "@/pages/CategoryPage.vue";
import ItemDetailPage from "@/pages/ItemDetailPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import SobrePage from "@/pages/SobrePage.vue";
import SearchResults from "@/pages/SearchResults.vue";
import EncontrePage from "@/pages/EncontrePage.vue";

import Profile from "../pages/Profile.vue";
import CadastroComercio from "../pages/CadastroComercio.vue";
import CadastroServico from "../pages/CadastroServico.vue";
import CadastroAluguel from "../pages/CadastroAluguel.vue";
import MeusAnuncios from "../pages/MeusAnuncios.vue";

// Novas telas de edição adicionadas abaixo:
import EditarComercio from "@/pages/EditarComercio.vue";
import EditarServico from "@/pages/EditarServico.vue";
import EditarAluguel from "@/pages/EditarAluguel.vue";

// ADICIONANDO OS NOVOS COMPONENTES DE DETALHES:
import DetalhesComercio from "@/pages/DetalhesComercio.vue";
import DetalhesServicos from "@/pages/DetalhesServicos.vue";
import DetalhesAluguel from "@/pages/DetalhesAluguel.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/comercios", component: CommercePage },
  { path: "/servicos", component: ServicePage },
  { path: "/aluguels", component: RentalPage },
  {
    path: "/category/:categoryType/:categoryId",
    name: "CategoryPage",
    component: CategoryPage,
  },
  {
    path: "/item/:itemId/:type",
    name: "ItemDetailPage",
    component: ItemDetailPage,
  },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/sobre", component: SobrePage },
  { path: "/search", name: "SearchResults", component: SearchResults },
  { path: "/encontre", component: EncontrePage },

  { path: "/profile", component: Profile },
  { path: "/cadastrocomercio", component: CadastroComercio },
  { path: "/cadastroservico", component: CadastroServico },
  { path: "/cadastroaluguel", component: CadastroAluguel },
  { path: "/meusanuncios", component: MeusAnuncios },

  // Rotas de edição adicionadas:
  {
    path: "/editarcomercio/:id",
    name: "EditarComercio",
    component: EditarComercio,
  },
  {
    path: "/editarservico/:id",
    name: "EditarServico",
    component: EditarServico,
  },
  {
    path: "/editaraluguel/:id",
    name: "EditarAluguel",
    component: EditarAluguel,
  },

  // Novas rotas para Detalhes
  {
    path: "/detalhescomercio/:id",
    name: "DetalhesComercio",
    component: DetalhesComercio,
  },
  {
    path: "/detalhesservicos/:id",
    name: "DetalhesServicos",
    component: DetalhesServicos,
  },
  {
    path: "/detalhesaluguel/:id",
    name: "DetalhesAluguel",
    component: DetalhesAluguel,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
