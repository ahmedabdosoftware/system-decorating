<!-- MainPage.vue -->
<template>
    <div class="portfolio-view">
        <HeaderComponent />
        <HeroSection />
    </div>
  </template>
  
  <script>
  import HeaderComponent from "@/components/portfolio/HeaderPortfolio.vue";
  import HeroSection from "@/components/portfolio/Hero.vue";
  
  export default {
    components: {
      HeaderComponent,
      HeroSection,
    },
  };
  </script>
  <style lang="scss">
  .portfolio-view{
    height: 1200px;
  }

</style>