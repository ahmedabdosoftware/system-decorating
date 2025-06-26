<template>
  <v-container fluid class="custom-hero-section d-flex align-center">
    <div class="background-overlay"></div>
    <swiper v-if="sliderImages.length > 1" :options="swiperOptions">
      <swiper-slide v-for="(img, index) in sliderImages" :key="index">
        <div
          class="custom-hero-slide"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
      </swiper-slide>
    </swiper>
    <div
      v-else
      class="custom-hero-slide single"
      :style="{ backgroundImage: `url(${sliderImages[0]})` }"
    ></div>

    <v-row class="align-center hero-content">
      <v-col cols="12" md="6" class="hero-text">
        <h1>{{ settings.heroTitle }}</h1>
        <p>{{ settings.heroDescription }}</p>
        <div class="action-container">
          <v-btn
            @click="dialog = true"
            :style="{ backgroundColor: settings.primaryColor || '#f57c00' }"
            class="catalog-btn"
          >
            {{ $t("hero.catalog") }}
          </v-btn>
          <v-avatar size="50" class="avatar">
            <img :src="avatarUrl || 'https://i.pravatar.cc/300'" alt="User Avatar" />
          </v-avatar>
        </div>
        <CatalogDialog :visible="dialog" @close="dialog = false" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CatalogDialog from "@/components/portfolio/templates/Modern/catalog/CatalogDialog.vue";
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
  name: "CustomHero",
  components: {
    CatalogDialog,
  },
  data() {
    return {
      dialog: false,
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: { delay: 3000 },
      },
    };
  },
  computed: {
    ...mapState(useTemplateSettingsStore, ["settings"]),
    sliderImages() {
      console.log("iam work > sliderImages",this.settings.heroSection?.images)
      console.log("iam work > settings",this.settings)
      return this.settings.heroSection?.images || [];
    },
    avatarUrl() {
      return this.settings?.logo || require("@/assets/images/logo.svg");
    },
  },
};
</script>

<style scoped lang="scss">

.custom-hero-section {
  position: relative;
  min-height: 80vh;
  width: 100%;
  padding: 40px;
  overflow: hidden;
  

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

   ::v-deep(.swiper-container)  {
        z-index: 0;
        position: absolute;
        left: 0px;
        width: 100%;
        top: 0px;
        height: 100%;  
}

  .custom-hero-slide {
    z-index: 0;
    position: absolute;  
    height: 100%;
    width: 100%;
    left: 0px;
    top: 0px;  
    background-size: cover;
    background-position: center;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    // margin: auto;
  }

  .hero-text {
    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 15px;
      color: #fff;
    }

    p {
      font-size: 1rem;
      margin-bottom: 20px;
      color: #fff;
      max-width: 500px;
      line-height: 1.6;
    }

    .action-container {
      display: flex;
      align-items: center;
      gap: 15px;

      .catalog-btn {
        min-width: 150px;
        height: 40px;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        border: none;
        border-radius: 30px;
        color: white;
      }

      .avatar {
        border: 2px solid #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
@media (max-width: 768px) {
  .custom-hero-section {
    .hero-text {

      h1 {
        // font-size: 2rem;
      }

      p {
        font-size: 0.9rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .custom-hero-section {
    .hero-text {
      h1 {
        // font-size: 2rem;
      }

      p {
        font-size: 0.85rem;
      }


    }
  }
}

</style>
