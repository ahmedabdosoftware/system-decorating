<template>
    <div class="dropdown">
      <div class="dropdown-content">
        <slot></slot> 
        
      </div>
    </div>
  </template>
  
  
  <script>
  
  
  export default {
    name: "DropDownMenuSidebar", 
   
  };
  </script>
  
  <style scoped lang="scss">
  .dropdown {
    position: fixed;
    left:65px;
    top:170px;
    display: none;
    width: 110px;
    z-index: 1000; 
    height: 180px;

  }
  .dropdown-content {
    position: absolute;
    left: 0px;
    background-color: white;
    width: 110px;
    height: 180px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 15px;
    z-index: 777;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;  
    align-items: flex-start;
  }
  .dropdown-content a {
    height: 15px;
    border-radius: 15px;
    color: rgb(31, 31, 48);
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    line-height: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    margin-top: 5px;
    font: {
        size: 12px;
        weight:500;
    }
    
    &:hover {
      background-color: #ddd;
    }
  }
  .dropdown-content a:last-child{
    margin-bottom: 10px ;
  }
  </style>
  