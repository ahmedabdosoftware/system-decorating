<template>
    <div class="contBox">
      <div :class=" { 'dark-mode': getDarkMode }">
        <span class="title">مدينتى</span>
       <div class="contBox__toggle">
            <div class="contBox__toggle__chosse" >
                <span v-if="isMaterialActiveOrTechnical">فنى</span>
                <span v-else>مساعد</span>
            </div>
            <ToggleSwitch
                :isMaterialActiveOrTechnical="isMaterialActiveOrTechnical"
                @update:isMaterialActive="updateMaterialStatus"
            />
        </div>
        <div class="contBox__data">
            
            <FinancialListPayments
                :transactionInfo="Financial"
            />

         </div>
         <div class="contBox__action"></div>
      </div>
    </div>
  </template>
  
  <script>

   // ListTable
   import FinancialListPayments from "@/components/users/financial/settling/FinancialListPayments.vue";
   // ToggleSwitch
  import ToggleSwitch from './ToggleSwitch.vue';

  export default {
    name: "BoxFinancial",
    props: [ "Financial"],
    components: {
        ToggleSwitch,
        FinancialListPayments,
   },
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
    },
    created(){
      console.log(this.category)
  
    },
    
    data() {
    return {
        isMaterialActiveOrTechnical: false, 
    };
   },

   methods: {
    updateMaterialStatus(status) {
      this.isMaterialActiveOrTechnical = status; 
    },
  },

  };
  //  console.log(pro)
  </script>
  <style scoped lang="scss">
  

  .contBox {
    width: 300px;
    height: 380px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  /* cont one product */
  .contBox > div {
    width: 100%;
    height: 100%;
    background-color: white;
    margin-left: 15px;
    box-shadow: 0 0 5px rgb(210, 205, 205);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    /* background-color: red; */
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
  }
  // sass
  %center_flex{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  %add_flex{
    display: flex;
    align-items: center;
  }
  .title{
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(241, 240, 237);
    width: 80px;
    height: 30px;
    border-radius: 7px;
    @extend %center_flex;
  }
  .contBox__toggle{
    width: 100%;
    height: 70px;
    // background-color: red;
    @extend %add_flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: space-evenly;
    margin-right: 13px
    
    
}
.contBox__toggle__chosse{
    @extend %add_flex;
    justify-content: flex-end;
    width: 30%;
    height: 30px;
    // background-color: rgb(149, 126, 126);
    span{
       
        font-family: "Lateef", serif;
        font-weight: 600;
        font-style: normal;

    }

  }
  .contBox__data{
    width: 100%;
    height: 160px;
    // background-color: rgb(108, 91, 91);
  }
  .contBox__action{
    width: 100%;
    height: 60px;
    background-color: rgb(139, 61, 61);
  }
  
  
  </style>
  