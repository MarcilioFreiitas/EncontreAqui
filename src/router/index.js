// Importa as funções necessárias do Vue Router
import { createRouter, createWebHistory } from "vue-router";

// Importa a store do usuário para verificação de autenticação e role
import { useUserStore } from "@/stores/user";

// ------------------------------
// Páginas do Cliente
// ------------------------------
import HomePage from "@/pages/client/home/HomePage.vue";
import SobrePage from "@/pages/client/home/SobrePage.vue";
import LoginPage from "@/pages/client/auth/LoginPage.vue";
import RegisterPage from "@/pages/client/auth/RegisterPage.vue";
import Profile from "@/pages/client/user/Profile.vue";
import MeusAnuncios from "@/pages/client/user/MeusAnuncios.vue";
import RentalPage from "@/pages/client/rentals/RentalPage.vue";
import CadastroAluguel from "@/pages/client/rentals/CadastroAluguel.vue";
import EditarAluguel from "@/pages/client/rentals/EditarAluguel.vue";
import DetalhesAluguel from "@/pages/client/rentals/DetalhesAluguel.vue";
import CommercePage from "@/pages/client/commerce/CommercePage.vue";
import CadastroComercio from "@/pages/client/commerce/CadastroComercio.vue";
import EditarComercio from "@/pages/client/commerce/EditarComercio.vue";
import DetalhesComercio from "@/pages/client/commerce/DetalhesComercio.vue";
import ServicePage from "@/pages/client/services/ServicePage.vue";
import CadastroServico from "@/pages/client/services/CadastroServico.vue";
import EditarServico from "@/pages/client/services/EditarServico.vue";
import DetalhesServicos from "@/pages/client/services/DetalhesServicos.vue";
import EncontrePage from "@/pages/client/search/EncontrePage.vue";
import SearchResults from "@/pages/client/search/SearchResults.vue";
import CategoryPage from "@/pages/client/search/CategoryPage.vue";
import ItemDetailPage from "@/pages/client/search/ItemDetailPage.vue";

// ------------------------------
// Páginas do Admin
// ------------------------------
import AdminLayout from "@/pages/admin/AdminLayout.vue";
import PainelControle from "@/pages/admin/PainelControle.vue";
import AprovacaoComerciantes from "@/pages/admin/AprovacaoComerciantes.vue";
import GestaoUsuarios from "@/pages/admin/GestaoUsuarios.vue";
import ModeracaoAnuncios from "@/pages/admin/ModeracaoAnuncios.vue";
import ModeracaoComentarios from "@/pages/admin/ModeracaoComentarios.vue";

// ------------------------------
// Definição das Rotas
// ------------------------------
const routes = [
  // Rotas do Admin (todas elas herdam do layout AdminLayout)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "", name: "admin.dashboard", component: PainelControle },
      {
        path: "merchants",
        name: "admin.merchants",
        component: AprovacaoComerciantes,
      },
      { path: "users", name: "admin.users", component: GestaoUsuarios },
      { path: "ads", name: "admin.ads", component: ModeracaoAnuncios },
      {
        path: "comments",
        name: "admin.comments",
        component: ModeracaoComentarios,
      },
      { path: ":pathMatch(.*)*", redirect: { name: "admin.dashboard" } },
    ],
  },

  // Rotas do Cliente
  { path: "/", component: HomePage },
  { path: "/sobre", component: SobrePage },

  // Rotas de Autenticação
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },

  // Área do Usuário
  { path: "/profile", component: Profile },
  { path: "/meusanuncios", component: MeusAnuncios },

  // Rotas de Aluguéis
  { path: "/aluguels", component: RentalPage },
  { path: "/cadastroaluguel", component: CadastroAluguel },
  {
    path: "/editaraluguel/:id",
    name: "EditarAluguel",
    component: EditarAluguel,
  },
  {
    path: "/detalhesaluguel/:id",
    name: "DetalhesAluguel",
    component: DetalhesAluguel,
  },

  // Rotas de Comércio
  { path: "/comercios", component: CommercePage },
  { path: "/cadastrocomercio", component: CadastroComercio },
  {
    path: "/editarcomercio/:id",
    name: "EditarComercio",
    component: EditarComercio,
  },
  {
    path: "/detalhescomercio/:id",
    name: "DetalhesComercio",
    component: DetalhesComercio,
  },

  // Rotas de Serviços
  { path: "/servicos", component: ServicePage },
  { path: "/cadastroservico", component: CadastroServico },
  {
    path: "/editarservico/:id",
    name: "EditarServico",
    component: EditarServico,
  },
  {
    path: "/detalhesservicos/:id",
    name: "DetalhesServicos",
    component: DetalhesServicos,
  },

  // Rotas de Pesquisa e Listagens
  { path: "/encontre", component: EncontrePage },
  { path: "/search", name: "SearchResults", component: SearchResults },
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

  // Rota de fallback (redireciona tudo que não for capturado para a home)
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

// ------------------------------
// Criação do Router
// ------------------------------
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ------------------------------
// Guarda Global de Navegação
// ------------------------------
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem("token");

  // Se existe token mas a store ainda não está inicializada, define o token na store
  if (token && !userStore.isAuthenticated) {
    userStore.setToken(token);
  }

  // Se a rota requer autenticação e o usuário não está autenticado, redireciona para o login
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next("/login");
  }

  // Se a rota requer que o usuário seja ADMIN e o role não é ADMIN, redireciona para a home
  if (to.meta.requiresAdmin && userStore.role.toUpperCase() !== "ADMIN") {
    return next("/");
  }

  // Caso contrário, permite a navegação
  return next();
});

// Exporta o router para ser utilizado na aplicação
export default router;
