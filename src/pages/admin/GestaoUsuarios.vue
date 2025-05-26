<template>
  <div class="users-page">
    <Header :showSearch="false" />

    <main class="users-page__main">
      <div class="users-page__header">
        <h1 class="users-page__title">Gestão de Usuários</h1>
        <div class="users-page__controls">
          <input
            v-model="filters.query"
            @input="applyFilter"
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            class="users-page__filter"
          />
          <button
            @click="loadUsers"
            class="users-page__btn users-page__btn--refresh"
          >
            Atualizar
          </button>
          <div class="users-page__column-chooser">
            <button
              @click="showColumnMenu = !showColumnMenu"
              class="users-page__btn users-page__btn--columns"
            >
              Colunas ▼
            </button>
            <div v-if="showColumnMenu" class="users-page__column-menu">
              <label
                v-for="col in columnDefs"
                :key="col.key"
                class="users-page__column-option"
              >
                <input type="checkbox" v-model="col.visible" />
                {{ col.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="users-page__table-wrapper">
        <table class="users-page__table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />
              </th>
              <th v-for="col in columnDefs" v-if="col.visible" :key="col.key">
                {{ col.label }}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>
                <input type="checkbox" v-model="selected" :value="user.id" />
              </td>
              <td v-if="isColVisible('id')">{{ user.id }}</td>
              <td v-if="isColVisible('name')">{{ user.name }}</td>
              <td v-if="isColVisible('email')">{{ user.email }}</td>
              <td v-if="isColVisible('role')">{{ user.role }}</td>
              <td v-if="isColVisible('status')">
                <span
                  :class="
                    user.status === 'active'
                      ? 'users-page__status--active'
                      : 'users-page__status--inactive'
                  "
                >
                  {{ user.status === "active" ? "Ativo" : "Suspenso" }}
                </span>
              </td>
              <td>
                <button
                  @click="toggleStatus(user)"
                  class="users-page__btn users-page__btn--toggle"
                >
                  {{ user.status === "active" ? "Suspender" : "Ativar" }}
                </button>
                <button
                  @click="deleteUser(user)"
                  class="users-page__btn users-page__btn--delete"
                >
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="!filteredUsers.length">
              <td :colspan="visibleColumnCount + 2" class="users-page__no-data">
                Nenhum usuário encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="users-page__pagination">
        <span
          >{{ pageStart }}–{{ pageEnd }} de
          {{ filteredUsers.length }} usuários</span
        >
        <button @click="prevPage" :disabled="currentPage === 1">
          Anterior
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Próxima
        </button>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";

const adminStore = useAdminStore();
const users = ref([]);
const filters = ref({ query: "" });
const selected = ref([]);
const selectAll = ref(false);
const showColumnMenu = ref(false);

const columnDefs = ref([
  { key: "id", label: "ID", visible: true },
  { key: "name", label: "Nome", visible: true },
  { key: "email", label: "E-mail", visible: true },
  { key: "role", label: "Perfil", visible: false },
  { key: "status", label: "Status", visible: true },
]);

const loadUsers = async () => {
  users.value = await adminStore.fetchAllUsers();
};
onMounted(loadUsers);

const filteredUsers = computed(() => {
  const q = filters.value.query.trim().toLowerCase();
  return users.value.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );
});

watch(filters, () => (currentPage.value = 1));

const isColVisible = (key) =>
  columnDefs.value.find((c) => c.key === key)?.visible;

const visibleColumnCount = computed(
  () => columnDefs.value.filter((c) => c.visible).length
);

// seleção
watch(selected, () => {
  selectAll.value = selected.value.length === paginatedUsers.value.length;
});
const toggleSelectAll = () => {
  selected.value = selectAll.value ? paginatedUsers.value.map((u) => u.id) : [];
};

// ações
const toggleStatus = async (user) => {
  if (user.status === "active") await adminStore.suspendUser(user.id);
  else await adminStore.activateUser(user.id);
  await loadUsers();
};
const deleteUser = async (user) => {
  if (confirm(`Excluir usuário ${user.name}?`)) {
    await adminStore.deleteUser(user.id);
    await loadUsers();
  }
};

// paginação
const pageSize = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / pageSize)
);
const paginatedUsers = computed(() =>
  filteredUsers.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);
const pageStart = computed(() => (currentPage.value - 1) * pageSize + 1);
const pageEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredUsers.value.length)
);
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;
</script>

<style scoped>
.users-page {
  background: #f7fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.users-page__main {
  flex: 1;
  padding: 24px;
}
.users-page__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}
.users-page__title {
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
}
.users-page__controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.users-page__filter {
  padding: 8px;
  border: 1px solid #d2d6dc;
  border-radius: 4px;
}
.users-page__btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.users-page__btn--refresh {
  background: #3182ce;
  color: #fff;
}
.users-page__btn--columns {
  background: #e2e8f0;
  color: #4a5568;
}
.users-page__column-menu {
  position: absolute;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}
.users-page__column-option {
  display: flex;
  align-items: center;
  padding: 4px;
}
.users-page__table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}
.users-page__table {
  width: 100%;
  border-collapse: collapse;
}
.users-page__table th,
.users-page__table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
.users-page__table th {
  background: #f9fafb;
  color: #718096;
  text-transform: uppercase;
  font-size: 12px;
}
.users-page__status--active {
  color: #2f855a;
}
.users-page__status--inactive {
  color: #e53e3e;
}
.users-page__btn--toggle {
  background: #ecc94b;
  color: #fff;
}
.users-page__btn--delete {
  background: #e53e3e;
  color: #fff;
}
.users-page__no-data {
  text-align: center;
  padding: 24px;
  color: #718096;
}
.users-page__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.users-page__pagination button {
  background: #e2e8f0;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.users-page__pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
