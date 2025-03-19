<template>
  <nav class="breadcrumb">
    <ul>
      <li class="icon">
        <font-awesome-icon icon="fa-solid fa-home" />
      </li>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <span v-if="index !== breadcrumbs.length - 1">
          <router-link :to="item.link">{{ item.label }}</router-link>
          <span class="separator">&raquo;</span>
        </span>
        <span v-else class="current">{{ item.label }}</span>
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
      default: () => [],
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  padding: 12px 20px;
  /* background-color: #f0f4f8; */
  border-radius: 8px;
  font-size: 15px;
  color: #0056b3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
}

.breadcrumb ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb .icon {
  margin-right: 8px;
  color: #007bff;
  font-size: 16px;
}

.breadcrumb .separator {
  margin: 0 8px;
  color: #007bff;
}

.breadcrumb a {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  transition: color 0.3s ease-in-out;
}

.breadcrumb a:hover {
  color: #004085;
}

.breadcrumb .current {
  font-weight: bold;
  color: #004085;
}

/* Responsive Design */
@media (max-width: 467px) {
  .breadcrumb {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
