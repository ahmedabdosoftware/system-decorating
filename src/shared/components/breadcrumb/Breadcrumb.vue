<template>
    <nav class="breadcrumb">
      <ul>
        <li v-for="(item, index) in breadcrumbs" :key="index">
          <span v-if="index !== breadcrumbs.length - 1">
            <router-link :to="item.link">{{ item.label }}</router-link>
            <span class="separator">/</span>
          </span>
          <span v-else>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: "Breadcrumb",
    props: {
      breadcrumbs: {
        type: Array,
        required: true,
        default: () => []
      }
    }
  };
  </script>
  
  <style scoped>
  .breadcrumb {
    padding: 10px 0;
    background-color: #f7f7f9;
    /* border-bottom: 1px solid #e0e0e0; */
    font-size: 14px;
    color: #6c757d;
    /* background-color: red; */
    margin-left: 50px;
    margin-top: 20px;
  }
  
  .breadcrumb ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .breadcrumb li {
    display: flex;
    align-items: center;
  }
  
  .breadcrumb .separator {
    margin: 0 5px;
  }
  
  .breadcrumb a {
    text-decoration: none;
    color: #007bff;
  }
  
  .breadcrumb a:hover {
    text-decoration: underline;
  }
  
  .breadcrumb span {
    color: #6c757d;
  }

   /* phone */
  @media (max-width: 467px){
    .breadcrumb {
        margin-left: 10px;
        margin-top: 20px;
        /* background-color: red; */
  }
  }
  </style>
  