<template>
  <div class="cont-categoryBox">
    <div v-for="Financial in Financials" :key="Financial.id">
      <BoxFinancial :Financial="Financial"> </BoxFinancial>
    </div>
  </div>
</template>

<script>
//  BoxFinancial
import BoxFinancial from "@/components/users/financial/settling/BoxFinancial.vue";

export default {
  name: "FinancialList",

  props: ["Financials"],

  components: {
    BoxFinancial,
  },
};
</script>

<style scoped lang="scss">
.cont-categoryBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  min-height: 380px;
}
</style>
