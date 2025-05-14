<template>
  <div class="banner-section">
    <div class="banner-overlay">
      <div class="banner-content">
        <h1 class="banner-title">Transforming Spaces with Elegance</h1>
        <p class="banner-subtitle">
          Where craftsmanship meets design to create timeless beauty in every
          detail.
        </p>
        <v-btn
          color="orange-darken-2"
          class="mt-4 explore-design"
          style="width: 270px; background-color: orange"
          size="large"
          dark
        >
          <v-icon start>mdi-wrench</v-icon>
          Explore Design Services
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-section {
  position: relative;
  background-image: url("https://public.readdy.ai/ai/img_res/aca82fdb2552f347a383c1f283945aa7.jpg");
  background-size: cover;
  background-position: center;
  height: 300px;
  /* border-radius: 8px; */
  overflow: hidden;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-overlay {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: white;
  padding: 20px;
  max-width: 600px;
}

.banner-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.banner-subtitle {
  font-size: 16px;
}
</style>
