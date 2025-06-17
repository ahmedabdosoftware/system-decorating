<template>
  <a
    :href="`https://wa.me/${formattedNumber}`"
    class="whatsapp-float"
    target="_blank"
    rel="noopener"
    v-if="whatsappNumber"
  >
    <span class="pulse"></span>
    <v-icon>mdi-whatsapp</v-icon>
  </a>
</template>

<script>
export default {
  props: {
    whatsappNumber: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedNumber() {
      console.log("whatsappNumber", this.whatsappNumber);
      return this.whatsappNumber.replace(/[^+\d]/g, "");
    },
  },
};
</script>

<style scoped>
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25d366;
  color: white;
  padding: 12px 14px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 999;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}

/* Pulse Animation */
.pulse {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(37, 211, 102, 0.4); /* WhatsApp green with transparency */
  border-radius: 50%;
  animation: pulse-animation 2s infinite;
  z-index: -1;
}

@keyframes pulse-animation {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
 
}
</style>
