<template>
  <div
    class="statistics-result"
    :class="{
      'statistics-result--non-paid': isNonPaid,
      'statistics-result--loading': isLoading,
    }"
  >
    <div class="statistics-result__icon">
      <font-awesome-icon class="statistics-result__icon-img" :icon="icon" />
    </div>
    <div class="statistics-result__content">
      <p class="statistics-result__title">{{ title }}</p>
      <slot>
        <span class="statistics-result__value">{{ value }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: "",
    },
    isNonPaid: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.statistics-result {
  width: 220px;
  height: 100px;
  background-color: rgb(240, 237, 237);
  border-radius: 8px;
  margin: 15px 0;
  display: flex;
  border: 2px solid transparent;
  align-items: center;
  padding: 5px;

  &--loading {
    border-color: orange;
    animation: pulse 1.5s infinite;
  }

  &--non-paid {
    background-color: #ffefef;
  }
}

.statistics-result__icon {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.statistics-result__icon-img {
  width: 40px;
  height: 40px;
}

.statistics-result__content {
  width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.statistics-result__title {
  color: rgb(109, 108, 108);
  margin-bottom: 10px;
  font-size: 14px;
  font-family: "Lateef", serif;
  font-weight: 700;
}

.statistics-result__value {
  font-size: 19px;
  font-weight: 600;
  color: rgb(49, 48, 48);
}

@keyframes pulse {
  0% {
    background-color: rgba(255, 165, 0, 0.3);
  }
  50% {
    background-color: rgba(255, 165, 0, 0.1);
  }
  100% {
    background-color: rgba(255, 165, 0, 0.3);
  }
}

@media (max-width: 477px) {
  .statistics-result {
    margin: 15px;
    width: 250px;
    height: 100px;
    background-color: white;
  }

  .statistics-result__icon-img {
    width: 30px;
    height: 30px;
  }
}
</style>
