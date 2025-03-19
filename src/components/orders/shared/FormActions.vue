<template>
  <div class="actions-container">
    <button
      class="btn create-btn"
      :disabled="isInvalid"
      @click="$emit('create')"
    >
      <slot name="create-button">Create Order</slot>
    </button>
    <button class="btn cancel-btn" @click="$emit('cancel')">
      <slot name="cancel-button">Cancel</slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    isInvalid: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  /* background-color: red; */
  width: 100%;
  padding-left: 40px;
}

.btn {
  padding: 10px 16px;
  font-size: 14px !important;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 40px;
  width: 140px;
  font-weight: 600;
}

.create-btn {
  background-color: blue;
  color: white;
}

.create-btn:disabled {
  /* background-color: #9e9e9e; */
  cursor: not-allowed;
  opacity: 0.5;
}

.create-btn:hover:not(:disabled) {
  background-color: #45a049; /* لون أغمق عند التمرير */
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
  margin-left: 8px;
  width: 150px;
}

.cancel-btn:hover {
  background-color: #757575; /* لون أغمق عند التمرير */
}
</style>
