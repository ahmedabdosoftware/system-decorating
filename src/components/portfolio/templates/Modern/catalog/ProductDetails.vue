<template>
  <div  class="product-details">
    <h2 class="title-catlog-details">{{ product.name }}</h2>
    <p class="description-catlog-details">{{ product.description }}</p>

    <div class="colors-section">
      <h3 class="section-title">{{ $t('catalog.productDetails.images') }}</h3>
      <div class="color-previews">
        <div
          v-for="(img, index) in product.images"
          :key="index"
          class="color-box"
        >
          <img :src="img" alt="Color image" />
        </div>
      </div>

      <div class="color-select">
        <h3 class="section-title">{{ $t('catalog.productDetails.colorsAndShapes') }}</h3>
        <div class="color-circles">
          <span
            v-for="(color, index) in product.colors"
            :key="index"
            class="circle"
            :title="color" >
          {{ color }}
        </span>
        </div>
      </div>
    </div>

    <div class="features">
      <h3 class="section-title">{{ $t('catalog.productDetails.features') }} :</h3>
      <ul>
        <li v-for="(feature, index) in product.Feature" :key="index">
          <span class="arrow-catlog-details">▶</span> {{ feature }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetails',
  props: {
    product: Object,
  },
  
  methods: {
   
  }
};
</script>

<style scoped lang="scss">
.product-details {
  background: white;
  /* border: 1px solid #ddd; */
  border-radius: 8px;
  padding: 16px;
  /* margin-top: 8px; */
  font-size: 15px;
  color: #333;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
  width: 100%;
  text-align: start;
}
.title-catlog-details {
  font-size: 18px;
  font-weight: bold;
}
.description-catlog-details {
  font-size: 14px;
  color: #444;
  margin-bottom: 16px;
}

.section-title {
  font-weight: bold;
  font-size: 14px;
  margin: 12px 0 8px;
  text-align: start;
  /* padding-left: 5px; */
}

.color-previews {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  
}
.color-box {
  background: #eee;
  padding: 4px;
  border-radius: 8px;
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.color-box img {
  width: 90%;
  height: auto;
  border-radius: 4px;
}

.color-circles {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a3f51, #1f1f2e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #fff; 
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: default;
}

.circle:hover {
  transform: scale(1.05); 
}


.features ul {
  list-style: none;
  padding: 0;
}
.features li {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}
.arrow-catlog-details {
  display: inline-block;
  margin-right: 6px;
  transform: scale(0.8);
}
</style>
