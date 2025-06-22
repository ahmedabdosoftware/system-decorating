<template>
  <div class="banner-section" :style="{ backgroundImage: computedBackgroundImage }">
    <div class="banner-overlay">
      <div class="banner-content">
        <h1 class="banner-title">Transforming Spaces with Elegance</h1>
        <p class="banner-subtitle">
          Where craftsmanship meets design to create timeless beauty in every
          detail.
        </p>
        <!-- Temprary -->
      
        <v-btn
          color="orange-darken-2"
          class="mt-4 explore-design"
          style="width: 270px; background-color: orange"
          size="large"
          dark
           @click="showSoonAlert"

        >
          <v-icon start>mdi-wrench</v-icon>
          Explore Design Services
        </v-btn>

         <v-snackbar v-model="snackbar" :timeout="3000" top>
          Design services will be available soon!
        </v-snackbar>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
   data() {
    return {
      snackbar: false, 
    };
  },
  computed: {
    ...mapState(useTemplateSettingsStore, ["settings"]),
    computedBackgroundImage() {
      
      const heroSection = this.settings.heroSection;
      // isDefault true 
      if (heroSection.isDefault) {
        return 'url("https://public.readdy.ai/ai/img_res/aca82fdb2552f347a383c1f283945aa7.jpg")';
      }

      // heroSection.images 
      const images = heroSection.images;
      if (images && images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return `url('${images[randomIndex]}')`;
      }

      // fallback 
      return 'url("https://public.readdy.ai/ai/img_res/aca82fdb2552f347a383c1f283945aa7.jpg")';
    }
  },
   methods: {
    showSoonAlert() {
      this.snackbar = true;
    }
  }
};
</script>


<style scoped>
.banner-section {
  position: relative;
  /* background-image: url("https://public.readdy.ai/ai/img_res/aca82fdb2552f347a383c1f283945aa7.jpg"); */
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
.banner-extra-text {
  font-size: 16px;
  color: #fff;
  max-width: 500px;
  margin: 0 auto;
  height: 70px;
  display: block;
  /* background-color: red; */
}

</style>
