<template>
  <div class="financial-box">
    <!-- المنطقة اليسرى أو الأولى لحرف أو أيقونة -->
    <div class="letter-area">
      <!-- يمكن تمرير الحرف/الأيقونة عبر slot -->
      <slot name="letter">R</slot>
    </div>

    <!-- المنطقة اليمنى أو الثانية لعنوان الصندوق وقيمته -->
    <div class="text-area">
      <p class="box-title">
        <slot name="title">Some Title</slot>
      </p>
      <p class="box-value">
        <slot name="value">$0.00</slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinancialBox",
};
</script>

<style scoped lang="scss">
.financial-box {
  // background-color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  width: 200px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;

  margin-right: 15px;

  .letter-area {
    background-color: #4b6dff;
    width: 45px;
    height: 100%;
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }

  .text-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .box-title {
    font-size: 14px;
    margin: 0;
    color: #555;
    font-weight: 600;
  }

  .box-value {
    font-size: 16px;
    margin: 0;
    font-weight: 700;
    color: #333;
  }
}
</style>
