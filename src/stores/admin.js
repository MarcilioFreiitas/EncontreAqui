// stores/admin.js
import axios from "@/services/axios";
import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    merchants: [],
    users: [], // listagem de /usuarios
    ads: [], // mix de servicos + alugueis filtrados
    comments: [], // listagem de /avaliacoes filtrados
    stats: {},
  }),
  actions: {
    // Comerciantes pendentes = approved === false
    async fetchPendingMerchants() {
      const { data } = await axios.get("/comercios");
      this.merchants = data.filter((c) => c.approved === false);
      return this.merchants;
    },
    // Aprovar = simplesmente dar PUT no recurso atualizando approved
    async approveMerchant(id) {
      const { data: com } = await axios.get(`/comercios/${id}`);
      await axios.put(`/comercios/${id}`, { ...com, approved: true });
    },
    async rejectMerchant(id) {
      const { data: com } = await axios.get(`/comercios/${id}`);
      await axios.put(`/comercios/${id}`, { ...com, approved: false });
    },

    // Usuários: reutiliza seus endpoints /usuarios
    async fetchAllUsers() {
      const { data } = await axios.get("/usuarios");
      this.users = data;
      return data;
    },
    async suspendUser(id) {
      const { data: u } = await axios.get(`/usuarios/${id}`);
      await axios.put(`/usuarios/${id}`, { ...u, active: false });
    },
    async activateUser(id) {
      const { data: u } = await axios.get(`/usuarios/${id}`);
      await axios.put(`/usuarios/${id}`, { ...u, active: true });
    },
    async deleteUser(id) {
      await axios.delete(`/usuarios/${id}`);
    },

    // Anúncios sinalizados = flagged === true
    async fetchFlaggedAds() {
      // traz ambos serviços e alugueis e concatena
      const [{ data: servicos }, { data: alugueis }] = await Promise.all([
        axios.get("/servicos"),
        axios.get("/alugueis"),
      ]);
      this.ads = [
        ...servicos.filter((s) => s.flagged),
        ...alugueis.filter((a) => a.flagged),
      ];
      return this.ads;
    },
    async removeAd({ id, type }) {
      // type = 'servico' ou 'aluguel'
      await axios.delete(`/${type}s/${id}`);
    },
    async restoreAd({ id, type }) {
      const { data: item } = await axios.get(`/${type}s/${id}`);
      await axios.put(`/${type}s/${id}`, {
        ...item,
        flagged: false,
        flagReason: null,
      });
    },

    // Comentários sinalizados = Avaliacao.flagged === true
    async fetchFlaggedComments() {
      const { data } = await axios.get("/avaliacoes/item", {
        params: { tipoItem: "any", itemId: 0 },
      });
      // se seu endpoint não aceita filtro por flagged, você pode ter que usar
      // GET /avaliacoes e filtrar client-side:
      // const { data } = await axios.get('/avaliacoes')
      this.comments = data.filter((c) => c.flagged);
      return this.comments;
    },
    async removeComment(id) {
      await axios.delete(`/avaliacoes/${id}`);
    },
    async restoreComment(id) {
      const { data: c } = await axios.get(`/avaliacoes/${id}`);
      await axios.put(`/avaliacoes/${id}`, {
        ...c,
        flagged: false,
        flagReason: null,
      });
    },

    // Estatísticas básicas
    async fetchDashboardStats() {
      // basta rodar todas as querys e montar o objeto
      const [m, u, a, c] = await Promise.all([
        axios.get("/comercios"), // pendentes
        axios.get("/usuarios"),
        axios.get("/servicos"), // sinalizados
        axios.get("/avaliacoes"), // sinalizados
      ]);
      this.stats = {
        pendingMerchants: m.data.filter((x) => !x.approved).length,
        activeUsers: u.data.filter((x) => x.active).length,
        flaggedAds: a.data.filter((x) => x.flagged).length,
        flaggedComments: c.data.filter((x) => x.flagged).length,
      };
      return this.stats;
    },
  },
});
