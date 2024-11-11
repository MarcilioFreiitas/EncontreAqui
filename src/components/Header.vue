<template>
  <header class="header">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <nav class="nav">
      <ul class="nav-links">
        <li><router-link to="/comercios">Comércio</router-link></li>
        <li><router-link to="/servicos">Serviços</router-link></li>
        <li><router-link to="/sobre">Sobre</router-link></li>
      </ul>
      <router-link to="/cadastro" class="cadastro-button"
        >Cadastre-se</router-link
      >
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.logo {
  height: 60px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style-type: none;
  margin: 0;
}

.nav-links li a {
  color: #000;
  text-decoration: none;
}

.cadastro-button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  text-decoration: none;
  font-family: "Inter", sans-serif;
}
</style>
