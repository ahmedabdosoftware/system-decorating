<template>
  <v-app>
    <v-container
      class="d-flex align-center justify-center"
      style="height: 100vh; background-color: #f5f5f5;"
    >
      <v-img
        :src="require('@/assets/portfolio/portfolio-not-found.svg')"
        max-width="500"
        contain
        class="not-found-image"
      />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "PortfolioNotFound",
};
</script>

<style scoped>
.not-found-image {
  width: 100%;
  max-width: 600px;
  opacity: 0.9;
  transition: all 0.3s ease;
}
</style>
