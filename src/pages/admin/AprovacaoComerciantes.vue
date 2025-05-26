<template>
  <div class="admin-page-container">
    <!-- Header -->
    <Header :showSearch="false" />

    <!-- Main Content -->
    <main class="admin-main-content">
      <div class="content-wrapper">
        <h1 class="page-title">Aprovação de Comerciantes</h1>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CNPJ</th>
                <th>Data</th>
                <th class="actions-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="merchant in merchants" :key="merchant.id">
                <td class="cell-id">{{ merchant.id }}</td>
                <td class="cell-name">{{ merchant.name }}</td>
                <td class="cell-email">{{ merchant.email }}</td>
                <td class="cell-cnpj">{{ merchant.cnpj }}</td>
                <td class="cell-date">{{ formatDate(merchant.requested) }}</td>
                <td class="cell-actions">
                  <button
                    @click="handleAction(merchant, 'approve')"
                    class="btn btn-approve"
                  >
                    Aprovar
                  </button>
                  <button
                    @click="handleAction(merchant, 'reject')"
                    class="btn btn-reject"
                  >
                    Rejeitar
                  </button>
                </td>
              </tr>
              <tr v-if="!merchants.length">
                <td colspan="6" class="no-data">
                  Nenhuma solicitação pendente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useAdminStore } from "@/stores/admin";

// Função para formatação de data (DD/MM/AAAA)
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
};

const adminStore = useAdminStore();
const merchants = ref([]);

const loadMerchants = async () => {
  merchants.value = await adminStore.fetchPendingMerchants();
};

const handleAction = async (merchant, action) => {
  if (action === "approve") {
    await adminStore.approveMerchant(merchant.id);
  } else {
    await adminStore.rejectMerchant(merchant.id);
  }
  await loadMerchants();
};

onMounted(loadMerchants);
</script>

<style scoped>
/* Container principal do painel */
.admin-page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7fafc; /* Cor de fundo clara */
  font-family: Arial, sans-serif;
}

/* Área principal do conteúdo */
.admin-main-content {
  flex-grow: 1;
  padding: 32px;
}

/* Centraliza e limita a largura do conteúdo */
.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Título da página */
.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 24px;
}

/* Container da tabela com fundo branco, sombra e bordas arredondadas */
.table-container {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* Estilos gerais para a tabela */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Cabeçalho da tabela */
thead {
  background-color: #f9fafb; /* tom claro semelhante a bg-gray-50 */
}
thead th {
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  text-align: left;
}
thead th.actions-header {
  text-align: center;
}

/* Linhas do corpo da tabela */
tbody tr {
  transition: background-color 0.2s ease-in-out;
}
tbody tr:hover {
  background-color: #f9fafb;
}

/* Células da tabela */
tbody td {
  padding: 16px;
  font-size: 14px;
  color: #4a5568;
  white-space: nowrap;
}
tbody td.cell-actions {
  text-align: center;
}
tbody tr + tr {
  border-top: 1px solid #e2e8f0;
}

/* Linha para exibir quando não há dados */
.no-data {
  padding: 48px 16px;
  text-align: center;
  color: #718096;
}

/* Botões de ação */
.btn {
  display: inline-block;
  margin: 0 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6);
}
.btn-approve {
  background-color: #2f855a; /* Aproximadamente bg-green-600 */
}
.btn-approve:hover {
  background-color: #276749; /* Aproximadamente bg-green-700 */
}
.btn-reject {
  background-color: #e53e3e; /* Aproximadamente bg-red-600 */
}
.btn-reject:hover {
  background-color: #c53030; /* Aproximadamente bg-red-700 */
}

/* Ajustes responsivos */
@media (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }
  table,
  thead th,
  tbody td {
    font-size: 12px;
    padding: 12px;
  }
  .no-data {
    padding: 32px 12px;
  }
}
</style>
