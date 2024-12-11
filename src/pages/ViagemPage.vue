<template>
  <div>
    <Header />
    <div class="viagem">
      <h1>Viagens Compartilhadas</h1>
      <div v-if="isLoading" class="loading">
        <i class="fa fa-spinner fa-spin"></i> Carregando viagens...
      </div>
      <div v-else>
        <!-- Exibe o botão de "Publicar Viagem" apenas para usuários autenticados -->
        <div
          v-if="isAuthenticated && !mostrarFormulario"
          class="publicar-opcao"
        >
          <button @click="mostrarFormulario = true" class="publicar-button">
            Publicar Viagem
          </button>
        </div>
        <!-- Formulário de publicação de viagem -->
        <div v-if="isAuthenticated && mostrarFormulario" class="new-viagem">
          <h2>{{ editando ? "Atualizar" : "Publicar" }} Viagem</h2>
          <form
            @submit.prevent="editando ? atualizarViagem() : publishViagem()"
          >
            <div class="form-group">
              <label for="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                v-model="newViagem.titulo"
                required
              />
            </div>
            <div class="form-group">
              <label for="saida">Saída</label>
              <input
                type="text"
                id="saida"
                v-model="newViagem.saida"
                required
              />
            </div>
            <div class="form-group">
              <label for="destino">Destino</label>
              <input
                type="text"
                id="destino"
                v-model="newViagem.destino"
                required
              />
            </div>
            <div class="form-group">
              <label for="intermediarias">Cidades Intermediárias</label>
              <div
                v-for="(cidade, index) in newViagem.intermediarias"
                :key="index"
                class="intermediaria-input"
              >
                <input
                  type="text"
                  v-model="newViagem.intermediarias[index]"
                  placeholder="Digite uma cidade"
                />
              </div>
              <button
                type="button"
                @click="adicionarIntermediaria"
                class="add-button"
              >
                +
              </button>
            </div>
            <div class="form-group">
              <label for="data">Data</label>
              <input type="date" id="data" v-model="newViagem.data" required />
            </div>
            <div class="form-group">
              <label for="hora">Hora</label>
              <input type="time" id="hora" v-model="newViagem.hora" required />
            </div>
            <div class="form-group">
              <label for="vagas">Vagas Disponíveis</label>
              <input
                type="number"
                id="vagas"
                v-model="newViagem.vagas"
                required
              />
            </div>
            <div class="form-group">
              <label for="preco">Preço por Vaga (R$)</label>
              <input
                type="number"
                id="preco"
                v-model="newViagem.preco"
                required
              />
            </div>
            <div class="form-group">
              <label for="descricao">Descrição</label>
              <textarea
                id="descricao"
                v-model="newViagem.descricao"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="whatsapp">Número do WhatsApp</label>
              <input
                type="text"
                id="whatsapp"
                v-model="newViagem.whatsapp"
                placeholder="+5511999998888"
                required
              />
            </div>
            <button type="submit" class="publicar-button">
              {{ editando ? "Atualizar" : "Publicar" }} Viagem
            </button>
          </form>
        </div>
        <!-- Lista de viagens (visível para todos) -->
        <div class="viagens">
          <div v-for="viagem in viagens" :key="viagem.id" class="viagem-item">
            <router-link
              :to="{ name: 'ViagemDetailPage', params: { id: viagem.id } }"
            >
              <img
                :src="viagem.imagem"
                alt="Imagem da Viagem"
                class="viagem-img"
              />
              <h3>{{ viagem.titulo }}</h3>
              <p>{{ viagem.descricao }}</p>
              <p class="local">
                De {{ viagem.saida }} para {{ viagem.destino }}
              </p>
              <p
                class="intermediarias"
                v-if="viagem.intermediarias && viagem.intermediarias.length"
              >
                Rota de possíveis paradas:
                {{ viagem.intermediarias.join(", ") }}
              </p>
              <p class="data">{{ viagem.data }} às {{ viagem.hora }}</p>
              <p class="vagas">Vagas Disponíveis: {{ viagem.vagas }}</p>
              <p class="preco">Preço por Vaga: R$ {{ viagem.preco }}</p>
            </router-link>
            <a
              :href="`https://wa.me/${viagem.whatsapp}`"
              target="_blank"
              class="whatsapp-link"
            >
              <i class="bi bi-whatsapp"></i>
            </a>
            <!-- Ações de edição e exclusão, visíveis apenas para o proprietário da viagem -->
            <div v-if="user && viagem.uid === user.uid" class="viagem-actions">
              <i @click="editViagem(viagem)" class="bi bi-pencil-square"></i>
              <i @click="deleteViagem(viagem.id)" class="bi bi-trash"></i>
            </div>
          </div>
        </div>
        <!-- Mensagem para usuários não autenticados -->
        <div v-if="!isAuthenticated" class="login-message">
          <p>
            Por favor, <router-link to="/login">faça login</router-link> para
            publicar uma viagem.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Adicione esta linha

export default {
  name: "ViagemPage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      viagens: [],
      newViagem: {
        titulo: "",
        saida: "",
        destino: "",
        intermediarias: [],
        data: "",
        hora: "",
        vagas: 0,
        preco: 0,
        descricao: "",
        whatsapp: "",
      },
      isAuthenticated: false,
      user: null,
      isLoading: true,
      mostrarFormulario: false,
      editando: false,
      viagemAtual: null,
    };
  },
  methods: {
    adicionarIntermediaria() {
      this.newViagem.intermediarias.push("");
    },
    async publishViagem() {
      try {
        if (!this.isAuthenticated) {
          alert("Você precisa estar logado para publicar uma viagem.");
          return;
        }
        const viagemData = {
          ...this.newViagem,
          uid: this.user.uid,
          imagem: this.user.photoURL || "default-avatar.png",
        };
        await addDoc(collection(db, "viagens"), viagemData);
        alert("Viagem publicada com sucesso!");
        this.fetchViagens();
        this.resetarFormulario();
      } catch (e) {
        console.error("Erro ao publicar viagem: ", e);
        alert(
          "Ocorreu um erro ao publicar a viagem. Por favor, tente novamente."
        );
      }
    },
    async atualizarViagem() {
      try {
        if (!this.isAuthenticated) {
          alert("Você precisa estar logado para atualizar uma viagem.");
          return;
        }
        if (this.viagemAtual && this.viagemAtual.id) {
          await updateDoc(
            doc(db, "viagens", this.viagemAtual.id),
            this.newViagem
          );
          alert("Viagem atualizada com sucesso!");
          this.fetchViagens();
          this.resetarFormulario();
        } else {
          throw new Error("ID da viagem não encontrado para atualização.");
        }
      } catch (e) {
        console.error("Erro ao atualizar viagem: ", e);
        alert(
          "Ocorreu um erro ao atualizar a viagem. Por favor, tente novamente."
        );
      }
    },
    async fetchViagens() {
      try {
        const querySnapshot = await getDocs(collection(db, "viagens"));
        this.viagens = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.isLoading = false;
      } catch (e) {
        console.error("Erro ao carregar viagens: ", e);
        alert(
          "Ocorreu um erro ao carregar as viagens. Por favor, tente novamente."
        );
        this.isLoading = false;
      }
    },
    async deleteViagem(id) {
      try {
        if (!this.isAuthenticated) {
          alert("Você precisa estar logado para excluir uma viagem.");
          return;
        }
        await deleteDoc(doc(db, "viagens", id));
        alert("Viagem excluída com sucesso!");
        this.fetchViagens();
      } catch (e) {
        console.error("Erro ao excluir viagem: ", e);
        alert(
          "Ocorreu um erro ao excluir a viagem. Por favor, tente novamente."
        );
      }
    },
    editViagem(viagem) {
      if (!this.isAuthenticated) {
        alert("Você precisa estar logado para editar uma viagem.");
        return;
      }
      this.mostrarFormulario = true;
      this.editando = true;
      this.viagemAtual = viagem;
      this.newViagem = { ...viagem };
    },
    resetarFormulario() {
      this.newViagem = {
        titulo: "",
        saida: "",
        destino: "",
        intermediarias: [],
        data: "",
        hora: "",
        vagas: 0,
        preco: 0,
        descricao: "",
        whatsapp: "",
      };
      this.mostrarFormulario = false;
      this.editando = false;
      this.viagemAtual = null;
    },
  },
  async created() {
    this.fetchViagens();
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.user = user;
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    });
  },
};
</script>

<style scoped>
/* Estilos Gerais */
.viagem {
  padding: 2rem;
}

.viagem h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}

.login-message {
  text-align: center;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 2rem;
}

.login-message a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-message a:hover {
  text-decoration: underline;
}

.publicar-opcao {
  text-align: center;
  margin-bottom: 1rem;
}

button.publicar-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
}

button.publicar-button:hover {
  background-color: #333;
}

.new-viagem {
  margin-bottom: 2rem;
}

.new-viagem h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
}

.intermediaria-input {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

button.add-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
}

button.add-button:hover {
  background-color: #0056b3;
}

button.publicar-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
}

button.publicar-button:hover {
  background-color: #333;
}

.viagens {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  justify-items: center;
  align-items: start;
}

.viagem-item {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s, background-color 0.3s;
  width: 100%;
  max-width: 300px;
}

.viagem-item:hover {
  transform: translateY(-10px);
  background-color: #f0f0f0;
}

.viagem-item a {
  text-decoration: none;
  color: inherit;
}

.viagem-img {
  height: 150px;
  width: auto;
  margin-bottom: 1rem;
  border-radius: 10px;
}

.viagem-item h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.viagem-item p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #666;
}

.viagem-item .local {
  margin-top: 1rem;
  font-size: 1rem;
  color: #20201e;
  font-weight: bold;
}

.viagem-item .data {
  margin-top: 1rem;
  font-size: 1rem;
  color: #20201e;
  font-weight: bold;
}

.viagem-item .vagas {
  margin-top: 1rem;
  font-size: 1rem;
  color: #20201e;
  font-weight: bold;
}

.viagem-item .preco {
  margin-top: 1rem;
  font-size: 1rem;
  color: #20201e;
  font-weight: bold;
}

.viagem-item .whatsapp-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem; /* Aumentando o tamanho do ícone */
  color: #25d366;
  margin-top: 1rem;
}

.viagem-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.viagem-actions i {
  cursor: pointer;
  font-size: 1.5rem; /* Tamanho razoável para os ícones */
}

.viagem-actions i:hover {
  color: #ff0000; /* Cor para indicar a ação de deletar */
}

/* Estilos de Responsividade */
@media (max-width: 768px) {
  .viagem h1 {
    font-size: 1.8rem;
  }

  .viagem-item {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .viagem h1 {
    font-size: 1.5rem;
  }

  .viagem-item {
    padding: 1rem;
  }

  .viagem-item h3 {
    font-size: 1rem;
  }

  .viagem-item p {
    font-size: 0.9rem;
  }

  .viagem-item .local,
  .viagem-item .data,
  .viagem-item .vagas,
  .viagem-item .preco {
    font-size: 1rem;
  }
}
</style>
