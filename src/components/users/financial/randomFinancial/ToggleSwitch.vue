<template>
    <div class="toggle-switch" @click="toggle">
      <div class="toggle-circle" :class="{ 'active': isHidden }"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isHidden: Boolean, // for parent pass intial value
    },

    methods: {
      toggle() {
        const newState = !this.isHidden;
        this.$emit('update:isHiddenActive', newState); 
      },
    },
  };
  </script>

  <style scoped>
  .toggle-switch {
    width: 50px;
    height: 25px;
    background-color: #792424;
    background-color: rgb(241, 240, 237);
    background-color: var(--popularCalar);


    border-radius: 15px;
    display: flex;
    align-items: center;
    padding: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  /* .toggle-switch.active {
    background-color: #ff5722; 
  }
   */
  .toggle-circle {
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
  }
  
  .toggle-circle.active {
    transform: translateX(25px); 
  }
  </style>
  