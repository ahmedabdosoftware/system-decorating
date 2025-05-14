<!-- MainPage.vue -->
<template>
    <v-app>
      <div class="portfolio-view">
        <HeaderComponent />
        <HeroSection />
        <Services />
        <PortfolioContainer />
        <Baner />
        <InspectionReques />
        <Footer />
      </div>
    </v-app>
  </template>
  
  <script>
  import HeaderComponent from "@/components/portfolio/templates/Modern/Header/HeaderPortfolio.vue";
  import HeroSection from "@/components/portfolio/templates/Modern/Hero/Hero.vue";
  import Services from "@/components/portfolio/templates/Modern/services/Services.vue";
  import PortfolioContainer from "@/components/portfolio/templates/Modern/projects/PortfolioContainer.vue";
  import Baner from "@/components/portfolio/templates/Modern/baners/Baner.vue";
  import InspectionReques from "@/components/portfolio/templates/Modern/baners/Request/Inspection-reques.vue";
  import Footer from "@/components/portfolio/templates/Modern/footer/Footer.vue";
  
  export default {
    components: {
      HeaderComponent,
      HeroSection,
      PortfolioContainer,
      Services,
      Baner,
      InspectionReques,
      Footer,
    },
  };
  </script>
  <style lang="scss">
  .portfolio-view {
    // height: 1200px;
    background: #eeece9;
  }
  </style>
  