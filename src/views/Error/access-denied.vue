<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center" class="fill-height">
      <v-col class="text-center">
        <v-icon large class="icon">mdi-alert-circle</v-icon>

        <p class="message">
          You do not have the necessary permissions or your subscription has expired.
        </p>

        <!-- Option to go back to home or other relevant pages -->
        <v-btn style="width: 120px; color: white; background-color: blue; margin-top: 20px;" @click="goBack" color="primary" large>
          Go Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push("/"); // Redirect to homepage or any other desired page
    },
  },
};
</script>

<style scoped>
.v-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.icon {
  font-size: 5rem;
  color: #ff6347;
}

.message {
  font-size: 1.5rem;
  color: #555;
  margin-top: 20px;
}

v-btn {
  margin-top: 30px;
}
</style>
