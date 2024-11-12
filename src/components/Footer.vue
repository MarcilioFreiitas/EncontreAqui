<template>
  <footer class="footer">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <div class="footer-content">
      <p>
        Apoie o crescimento do comércio e serviços locais. Vamos juntos
        fortalecer nossa comunidade!
      </p>
      <p>
        Fique atualizado e siga-nos nas redes sociais para as últimas novidades
        e ofertas especiais.
        <a href="https://facebook.com" target="_blank" class="social-icon"
          ><img src="@/assets/facebook.png" alt="Facebook"
        /></a>
        <a href="https://twitter.com" target="_blank" class="social-icon"
          ><img src="@/assets/twitter.png" alt="Twitter"
        /></a>
        <a href="https://instagram.com" target="_blank" class="social-icon"
          ><img src="@/assets/instagram.png" alt="Instagram"
        /></a>
      </p>
      <p>
        © 2024 Encontre Aqui. Todos os direitos reservados. Qualquer reprodução
        ou distribuição não autorizada deste material é proibida.
        <a href="/politica-privacidade">Política de Privacidade</a> |
        <a href="/termos-uso">Termos de Uso</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  color: #000;
  font-family: "Inter", sans-serif;
  width: 100%;
  box-sizing: border-box; /* Adiciona box-sizing para evitar estouro */
}

.logo {
  height: auto;
  width: 10%;
}

.footer-content {
  flex-grow: 1;
  text-align: center;
  padding-left: 2rem;
  flex-shrink: 1; /* Permite que o conteúdo encolha */
  flex-basis: 0; /* Impede que o conteúdo cresça além do necessário */
}

.footer-content p {
  margin: 1rem 0;
}

.social-icon {
  margin-left: 0.5rem;
}

.social-icon img {
  height: 24px;
  width: 24px;
}

/* Estilos de responsividade */
@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0;
  }

  .logo {
    width: 20%;
    margin-bottom: 1rem;
  }

  .footer-content {
    padding-left: 0;
    width: 100%;
  }

  .social-icon {
    margin: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .footer-content p {
    font-size: 0.9rem;
  }

  .logo {
    width: 30%;
  }

  .social-icon img {
    height: 20px;
    width: 20px;
  }
}
</style>
