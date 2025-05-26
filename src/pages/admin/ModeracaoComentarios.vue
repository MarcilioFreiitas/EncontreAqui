<template>
  <div class="admin-page-container">
    <!-- Header -->
    <Header :showSearch="false" />

    <!-- Main Content -->
    <main class="admin-main-content">
      <div class="content-wrapper">
        <!-- Título & Controles -->
        <div class="actions-header">
          <h1 class="page-title">Moderação de Comentários</h1>
          <div class="actions-group">
            <input
              v-model="filters.query"
              @input="applyFilter"
              type="text"
              placeholder="Buscar por autor ou conteúdo..."
              class="input-filter"
            />
            <button @click="loadComments" class="btn btn-update">
              Atualizar
            </button>
            <button
              @click="showColumnMenu = !showColumnMenu"
              class="btn btn-columns"
            >
              Colunas ▼
            </button>
            <div v-if="showColumnMenu" class="column-chooser-menu">
              <label
                v-for="col in columnDefs"
                :key="col.key"
                class="column-option"
              >
                <input type="checkbox" v-model="col.visible" />
                {{ col.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Comments Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="check-col">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  />
                </th>
                <th
                  v-for="col in columnDefs"
                  v-if="col.visible"
                  :key="col.key"
                  class="header-cell"
                >
                  {{ col.label }}
                </th>
                <th class="actions-cell-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="comment in paginatedComments"
                :key="comment.id"
                class="table-row"
              >
                <td class="table-cell check-col">
                  <input
                    type="checkbox"
                    v-model="selected"
                    :value="comment.id"
                  />
                </td>
                <td v-if="isColVisible('id')" class="table-cell">
                  {{ comment.id }}
                </td>
                <td v-if="isColVisible('user')" class="table-cell">
                  {{ comment.user }}
                </td>
                <td v-if="isColVisible('adTitle')" class="table-cell">
                  {{ comment.adTitle }}
                </td>
                <td
                  v-if="isColVisible('content')"
                  class="table-cell content-cell"
                >
                  {{ comment.content }}
                </td>
                <td v-if="isColVisible('flagReason')" class="table-cell">
                  {{ comment.flagReason }}
                </td>
                <td v-if="isColVisible('createdAt')" class="table-cell">
                  {{ formatDate(comment.createdAt) }}
                </td>
                <td class="table-cell actions-cell">
                  <button
                    @click="actionComment(comment, 'remove')"
                    class="btn btn-delete"
                  >
                    Remover
                  </button>
                  <button
                    @click="actionComment(comment, 'restore')"
                    class="btn btn-restore"
                  >
                    Liberar
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredComments.length">
                <td colspan="7" class="no-data">
                  Nenhum comentário sinalizado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        <div class="pagination-container">
          <div class="pagination-info">
            {{ pageStart }}–{{ pageEnd }} de
            {{ filteredComments.length }} comentários
          </div>
          <div class="pagination-buttons">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="btn btn-pagination"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-pagination"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";

// Definição das colunas
const columnDefs = ref([
  { key: "id", label: "ID", visible: true },
  { key: "user", label: "Autor", visible: true },
  { key: "adTitle", label: "Anúncio", visible: true },
  { key: "content", label: "Comentário", visible: true },
  { key: "flagReason", label: "Motivo", visible: true },
  { key: "createdAt", label: "Data", visible: true },
]);

// Estado e carregamento dos comentários
const adminStore = useAdminStore();
const comments = ref([]);
const filters = ref({ query: "" });
const selected = ref([]);
const selectAll = ref(false);
const showColumnMenu = ref(false);

const loadComments = async () => {
  comments.value = await adminStore.fetchFlaggedComments();
};
onMounted(loadComments);

// Filtro dos comentários
const filteredComments = computed(() => {
  const q = filters.value.query.trim().toLowerCase();
  return comments.value.filter(
    (c) =>
      !q ||
      c.user.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
  );
});
watch(filters, () => {
  currentPage.value = 1;
});

// Helpers
const isColVisible = (k) => columnDefs.value.find((c) => c.key === k)?.visible;
const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR");

// Controle de seleção em massa
watch(selected, () => {
  selectAll.value = selected.value.length === paginatedComments.value.length;
});
const toggleSelectAll = () => {
  selected.value = selectAll.value
    ? paginatedComments.value.map((c) => c.id)
    : [];
};

// Ações nos comentários
const actionComment = async (comment, action) => {
  if (action === "remove") await adminStore.removeComment(comment.id);
  else await adminStore.restoreComment(comment.id);
  await loadComments();
};

// Paginação
const pageSize = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(filteredComments.value.length / pageSize)
);
const paginatedComments = computed(() =>
  filteredComments.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);
const pageStart = computed(() => (currentPage.value - 1) * pageSize + 1);
const pageEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredComments.value.length)
);
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const applyFilter = () => {};
</script>

<style scoped>
/* Container principal do painel */
.admin-page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7fafc;
  font-family: Arial, sans-serif;
}

/* Área principal do conteúdo */
.admin-main-content {
  flex-grow: 1;
  padding: 24px;
}

/* Centraliza e limita a largura do conteúdo */
.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Seção de título e controles */
.actions-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}
@media (min-width: 640px) {
  .actions-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  margin: 0;
}
.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Input de filtro */
.input-filter {
  padding: 8px 12px;
  border: 1px solid #d2d6dc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.input-filter:focus {
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6);
}

/* Botões gerais */
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  outline: none;
}
.btn:focus {
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6);
}
.btn-update {
  background-color: #3182ce;
  color: #fff;
}
.btn-update:hover {
  background-color: #2b6cb0;
}
.btn-columns {
  background-color: #e2e8f0;
  color: #4a5568;
}
.btn-columns:hover {
  background-color: #cbd5e0;
}

/* Menu de escolha de colunas */
.column-chooser-menu {
  position: absolute;
  right: 0;
  margin-top: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  z-index: 20;
  padding: 8px 0;
  width: 200px;
}
.column-option {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
}
.column-option:hover {
  background-color: #f9fafb;
}
.column-option input {
  margin-right: 8px;
}

/* Tabela de comentários */
.table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-top: 16px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table thead {
  background-color: #f9fafb;
}
.data-table thead .header-cell {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  text-align: left;
}
.data-table thead .check-col,
.data-table thead .actions-cell-header {
  text-align: center;
}
.table-row {
  transition: background-color 0.2s ease;
}
.table-row:hover {
  background-color: #f9fafb;
}
.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #4a5568;
  white-space: nowrap;
}
.table-cell.check-col {
  text-align: center;
}
.table-cell.actions-cell {
  text-align: center;
}
.data-table tbody tr + tr {
  border-top: 1px solid #e2e8f0;
}
.no-data {
  padding: 24px;
  text-align: center;
  color: #718096;
}

/* Célula de conteúdo: limitar a duas linhas */
.content-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Paginação */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.pagination-info {
  font-size: 14px;
  color: #4a5568;
}
.pagination-buttons {
  display: flex;
  gap: 8px;
}
.btn-pagination {
  background-color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-pagination:hover {
  background-color: #cbd5e0;
}
.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 4px;
}

/* Responsividade */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  .data-table thead .header-cell,
  .data-table tbody .table-cell {
    padding: 8px 12px;
    font-size: 12px;
  }
  .no-data {
    padding: 16px;
  }
}
</style>
