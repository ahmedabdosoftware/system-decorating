<template>
  <v-app>
    <v-container
      class="d-flex flex-column align-center justify-center loader-background"
    >
      <!-- Logo -->
      <v-img
        :src="require('@/assets/images/logo.svg')"
        max-width="120"
        class="mb-6"
        aspect-ratio="1"
        contain
      />

      <!-- Circular Loader -->
      <v-progress-circular
        :size="70"
        :width="6"
        color="deep-purple-accent-2"
        indeterminate
      ></v-progress-circular>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "AnimatedLoader",
};
</script>

<style scoped>
.loader-background {
  height: 100vh;
  color: white;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1e2f, #2c2c54);
}

/* Glowing blurred light spots */
.loader-background::before,
.loader-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: moveGlow 8s ease-in-out infinite alternate;
  pointer-events: none;
}

.loader-background::before {
  width: 300px;
  height: 300px;
  background: #a18cd1;
  top: -100px;
  left: -100px;
}

.loader-background::after {
  width: 300px;
  height: 300px;
  background: #fbc2eb;
  bottom: -100px;
  right: -100px;
}

/* Animation */
@keyframes moveGlow {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(20px, 30px) scale(1.2);
  }
}
</style>
