<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

html,
body {
  height: 100%;
  margin: 0;
  font-family: "Inter", sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app > * {
  flex: 1;
}
</style>
