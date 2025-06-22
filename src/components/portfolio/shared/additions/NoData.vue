<!-- components/shared/NoData.vue -->
<template>
  <div class="no-data-box">
    <v-icon color="grey lighten-1" size="48">mdi-database-remove</v-icon>
    <p class="no-data-text">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "No Data Available"
    }
  }
};
</script>

<style scoped>
.no-data-box {
  text-align: center;
  padding: 30px 0;
  color: #999;
}
.no-data-text {
  margin-top: 10px;
  font-size: 16px;
}
</style>
