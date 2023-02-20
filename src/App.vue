<template>
  <div class="container grid-lg">
    <header class="navbar p-2 s-rounded">
      <section class="navbar-section">
        <router-link to="" class="btn btn-link">Home</router-link>
        <router-link to="/profile" class="btn btn-link">Profile</router-link>
      </section>
      <section class="navbar-center">
        <h1 class="text-bold">Watch🎈Party</h1>
      </section>
      <section class="navbar-section">
        <a
          href="https://github.com/Vitor-M/erural-watch-party-ui"
          class="btn btn-link"
          >GitHub</a
        >
      </section>
    </header>
    <router-view class="pt-2" />
  </div>
</template>

<style scoped>
h1 {
  font-size: 2em;
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  flex: 1;
}
</style>
