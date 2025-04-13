<template>
    <v-card
      class="service-card d-flex justify-space-between align-center"
      flat
      tile
      @click="$emit('click')"
      style="border-radius: 12px !important; background-color: #f3f4f6; "
    >
      <div class="d-flex align-center">
        <v-avatar class="icon-wrapper" size="40">
          <v-icon>{{ icon }}</v-icon>
        </v-avatar>
        <span class="service-title ml-4">{{ title }}</span>
      </div>
      <div class="d-flex align-center">
        <span class="service-price mr-2">{{ price }}</span>
        <v-icon small>mdi-chevron-right</v-icon>
      </div>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'ServiceCard',
    props: {
      icon: {
        type: String,
        default: 'mdi-cog'
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .service-card {
    // background-color: #f3f4f6; 
    padding: 16px 20px;
    // border-radius: 12px !important;
    margin: 12px auto;
    // width: 100%;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  
    &:hover {
      background-color: #e6e4e2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  
    .icon-wrapper {
      background-color: white;
      color: #2c3e50;
      border: 1px solid #ddd;
    }
  
    .service-title {
      font-weight: 600;
      font-size: 16px;
      color: #2c3e50;
    }
  
    .service-price {
      font-weight: 500;
      font-size: 15px;
      color: #555;
    }
  }
  </style>
  