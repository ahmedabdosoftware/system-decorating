<!-- TransitionWrapper.vue -->
<template>
    <transition :name="transitionName" :mode="transitionMode">
      <keep-alive>
        <slot></slot> 
      </keep-alive>
    </transition>
  </template>
  
  <script>
  export default {
    props: {
      transitionName: {
        type: String,
        default: "fade",
      },
      transitionMode: {
        type: String,
        default: "out-in",
      },
    },
  };
  </script>
  
  <style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>