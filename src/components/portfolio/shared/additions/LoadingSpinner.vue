<template>
  <div class="loading-box">
    <v-progress-circular
      indeterminate
      :color="spinnerColor"
      size="40"
    ></v-progress-circular>
    <!-- <p class="loading-text">{{ message }}</p> -->
  </div>
</template>

<script>
// Stores
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
  props: {
    message: {
      type: String,
      default: "Loading..."
    },
  },
  computed: {
      computed: {
    ...mapState(useTemplateSettingsStore, ["settings"]),
  },
    spinnerColor() {
      return this.settings?.primaryColor || "#f57c00";
    }
  }
};
</script>

<style scoped>
.loading-box {
  text-align: center;
  padding: 30px 0;
}
.loading-text {
  margin-top: 10px;
  color: #666;
}
</style>
