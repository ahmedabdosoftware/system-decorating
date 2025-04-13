<template>
    <v-card class="project-card" @click="$emit('open', project)">
      <v-img :src="project.cover" height="160px" />
      <v-card-title class="text-truncate">{{ project.title }}</v-card-title>
      <v-card-subtitle>{{ project.subtitle }}</v-card-subtitle>
    </v-card>
  </template>
  
  <script>
  export default {
    props: ['project'],
  }
  </script>
  
  <style lang="scss" scoped>
  .project-card {
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      transform: scale(1.02);
    }
  }
  </style>
  