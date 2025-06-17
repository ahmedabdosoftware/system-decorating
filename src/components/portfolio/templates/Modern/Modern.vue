<!-- MainPage.vue -->
<template>
    <v-app>
       <div class="portfolio-view" :class="{ 'custom-theme': isCustomTheme }">
        <HeaderComponent :isCustomTheme="isCustomTheme" />
        <HeroWrapper/>
        <Services :isCustomTheme="isCustomTheme" />
        <PortfolioContainer :isCustomTheme="isCustomTheme" />
        <Baner :isCustomTheme="isCustomTheme" />
        <InspectionReques :isCustomTheme="isCustomTheme" />
        <Footer :isCustomTheme="isCustomTheme" />
        <WhatsAppFloating
        v-if="showWhatsappButton"
        :whatsappNumber="settings.whatsappNumber"
      />
    </div>
    </v-app>
  </template>
  
  <script>

  // Components
  import HeaderComponent from "@/components/portfolio/templates/Modern/Header/HeaderPortfolio.vue";
  import HeroWrapper from "@/components/portfolio/templates/Modern/Hero/HeroWrapper.vue";
  import Services from "@/components/portfolio/templates/Modern/services/Services.vue";
  import PortfolioContainer from "@/components/portfolio/templates/Modern/projects/PortfolioContainer.vue";
  import Baner from "@/components/portfolio/templates/Modern/baners/Baner.vue";
  import InspectionReques from "@/components/portfolio/templates/Modern/baners/Request/Inspection-reques.vue";
  import Footer from "@/components/portfolio/templates/Modern/footer/Footer.vue";
  import WhatsAppFloating from "@/components/portfolio/shared/additions/WhatsAppFloating.vue";

  // Store
  import { mapState } from "pinia";
  import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

  export default {
    components: {
      HeaderComponent,
      HeroWrapper,
      PortfolioContainer,
      Services,
      Baner,
      InspectionReques,
      Footer,
      WhatsAppFloating
      
    },
    computed: {
      ...mapState(useTemplateSettingsStore, ["settings"]),
      isCustomTheme() {
        return !this.settings.heroSection.isDefault;
      },
       showWhatsappButton() {
        // console.log("from up whats",this.settings.whatsappNumber,this.settings.showWhatsapps)
        return (
          this.settings.showWhatsApp === true &&
          this.settings.whatsappNumber &&
          this.settings.whatsappNumber.trim() !== ""
        );
    },
    },
  };
  </script>
  <style lang="scss">
  .portfolio-view {
    // height: 1200px;
    background: #eeece9;
  }
  .portfolio-view.custom-theme {
    background: #fff; 
}
  </style>
  