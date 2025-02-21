<template>
  <div :class="['option', layoutClass]">
    <div class="icon_option">
        <slot name="iconLetter">
          <span class="letter_icon_option">E</span>
        </slot>
      </div>
      <div class="info_option">
        <p class="option-title">
          <slot name="optionTitle">Employee</slot>
        </p>
        <div class="option-link">
          <p class="option-link-text">
            <slot name="optionLinkText">Select To Go</slot>
          </p>
          <slot name="optionRouterLink">
            <router-link to="/"> &rarr; </router-link>
          </slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OptionCard",
  props: {
    layout: {
      type: String,
      default: "column",
    },
  },
  computed: {
    layoutClass() {
      return this.layout === "row" ? "option-row" : "";
    },
  }, 
 };
  </script>
  
  <style scoped lang="scss">
  .option {
    width: 220px;
    height: 160px;
    // background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 14px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .option-row {
    flex-direction: row;
    width: 300px;
    height: 100px;
  }
  .icon_option {
    width: 50px;
    height: 50px;
    background-color: #527ce6;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .letter_icon_option {
    font-size: 20px;
    color: #fff;
  }
  
  .info_option {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  
    .option-title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      margin-bottom: 5px;
    }
  
    .option-link {
      display: flex;
      align-items: center;
      width: 140px;
      justify-content: space-evenly;
      // background-color: red;
      cursor: pointer;
      .option-link-text {
        font-size: 12px;
        color: #777;
      }
  
      a {
        font-size: 16px;
        color: #527ce6;
        text-decoration: none;
      }
    }
  }
  .option-row {
    .info_option {
    align-items: flex-start;
    .option-link { 
      justify-content: flex-start;
      .option-link-text {
        padding-right: 8px;
      }
}
}
}
@media (max-width: 477px) {
    
  .option {
    margin-top: 20px;
  }
  }
  @media (max-width: 370px) {
      
  }
  </style>
  