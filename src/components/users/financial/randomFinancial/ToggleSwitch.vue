<template>
    <div class="toggle-switch" @click="toggle">
      <div class="toggle-circle" :class="{ 'active': isHidden }"></div>
    </div>
  </template>
  
  <script>

   import { mapActions } from "pinia";
  // stores
  import { useRandomTransactionsStore } from '@/store/transactions/randomTransactions.js';
  
  export default {
    props: {
      isHidden: Boolean, // for parent pass intial value
    },

    methods: {
      ...mapActions(useRandomTransactionsStore, ["toggleHidden"]),

      toggle() {

        const newState = !this.isHidden;

        // change state in parent componnent 
        this.$emit('update:isHiddenActive', newState); 

        // change state in store
        this.toggleHidden()
      },
    },
  };
  </script>

  <style scoped>
  .toggle-switch {
    width: 50px;
    height: 25px;
    /* background-color: #792424; */
    /* background-color: rgb(241, 240, 237); */
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
    background-color: #c9c6c6;
    border-radius: 50%;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    transition:  all 0.3s;
  }
  
  .toggle-circle.active {
    transform: translateX(25px); 
    background-color: #fff;

  }
  </style>
  