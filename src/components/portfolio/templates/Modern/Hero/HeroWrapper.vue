<template>
  <component :is="computedHeroComponent" />
</template>

<script>
// Component
import DefaultHero from '@/components/portfolio/templates/Modern/Hero/DefaultHero.vue';
import CustomHero from '@/components/portfolio/templates/Modern/Hero/CustomHero.vue';
// Store
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
  computed: {
    ...mapState(useTemplateSettingsStore, ["settings"]),

    computedHeroComponent() {
      return this.settings.heroSection.isDefault ? 'DefaultHero' : 'CustomHero';
    }
  },
  components: {
    DefaultHero,
    CustomHero
  }
};
</script>
