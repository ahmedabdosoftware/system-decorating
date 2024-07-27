<template>
    <div class="no-data">
      <font-awesome-icon class="icon" :icon="icon" size="4x" />
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  
  export default {
    props:["context"],
    name: "NoData",
    computed: {
      icon() {
        switch (this.context) {
          case 'orders':
            return 'sticky-note'
          case 'products':
            return 'box-open'
          case 'categories':
            return 'tags'
          case 'users':
            return 'user-slash'
          default:
            return 'exclamation-circle'
        }
      },
      message() {
        switch (this.context) {
          case 'orders':
            return 'لا توجد طلبات'
          case 'products':
            return 'لا توجد منتجات'
          case 'categories':
            return 'لا توجد تصنيفات'
          case 'users':
            return 'لا يوجد مستخدمون'
          default:
            return 'لا توجد بيانات'
        }
      }
    },
     created() {

        console.log('prop',this.context);

    },

  }
  </script>
  
  <style scoped lang="scss">
  .no-data {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    padding: 20px;
    //background-color: #f5f5f5;
   // background-color: #681818;
    border-radius: 5px;
    margin-top: 10px;
    p{
      margin-top: 10px;
      font-size: 25px;

    }
    .icon{
        width: 50%;
        height: 50%;
    }
  }
  
  </style>
  