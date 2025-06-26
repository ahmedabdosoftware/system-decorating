<!-- HeroSection.vue -->
<template>
 <!-- <v-locale-provider :rtl="false"> -->
  <v-container fluid class="hero-section d-flex align-center" >
    <v-row class="align-center hero-content">
      <v-col cols="12" md="6" class="hero-text">
        <h1  dir="ltr">{{settings.heroTitle}}</h1>
        <p>
         {{settings.heroDescription}}
        </p>
        <div class="action-container">
          <v-btn @click="dialog = true" :style="{ backgroundColor: settings.primaryColor || '#f57c00' }" class="catalog-btn"> {{ $t("hero.catalog") }}</v-btn>
          <v-avatar size="50" class="avatar">
            <img :src="avatarUrl || 'https://i.pravatar.cc/300'" alt="User Avatar" />
          </v-avatar>
        </div>
        <Catalog-dialog :visible="dialog" @close="dialog = false" />
      </v-col>
      <v-col cols="12" md="6" class="cont-imag-hero-res"> </v-col>
    </v-row>
  </v-container>
 <!-- </v-locale-provider> -->
</template>
<script>
// Component
import CatalogDialog from "@/components/portfolio/templates/Modern/catalog/CatalogDialog.vue";
// Store
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
  props: {},
  components: {
    CatalogDialog,
  },
   computed: {
      ...mapState(useTemplateSettingsStore, ["settings"]),
       avatarUrl() {
          return this.settings?.logo || require("@/assets/images/logo.svg");
        }
    },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped lang="scss">

.hero-section {
  direction:ltr !important;
  min-height: 80vh;
  width: 100%;
  background: url("../../../../../assets/portfolio/bci.png") no-repeat;
  background-size: cover;
  background-size: 100% 100% !important;
  padding: 40px;
  // margin-top: 110px;
  .hero-content {
    max-width: 1200px;
    margin: auto;
  }

  .hero-text {
    text-align: left;

    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 15px;
    }

    p {
      font-size: 1rem;
      margin-bottom: 20px;
      color: #444;
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
        white-space: nowrap;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
       // background-color: #f57c00;
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
  .cont-imag-hero-res {
    // width: 100%;
    display: none;
    height: 300px;
    background: url("../../../../../assets/portfolio/bci.png") no-repeat;
    background-size: cover;
    background-size: 100% 100% !important;
  }
}
// .hero-image {
//   max-height: 400px;
// }

@media (max-width: 768px) {
  .hero-section {
    padding: 0px;
    .hero-text {
      text-align: center;

      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 0.9rem;
      }
    }
    .action-container {
      justify-content: center;
    }
    .hero-image {
      margin-top: 20px;
    }
  }
}

@media (max-width: 480px) {
  .hero-section {
    background: #edebe9;
    .hero-text {
      h1 {
        font-size: 1.8rem;
      }

      p {
        font-size: 0.85rem;
      }

      .action-container {
        gap: 10px;
      }
      .catalog-btn {
        font-size: 0.9rem;
        padding: 8px 16px;
      }
    }

    .hero-image {
      img {
        max-height: 250px;
      }
    }
    .cont-imag-hero-res {
      display: block;
    }
  }
}
</style>
