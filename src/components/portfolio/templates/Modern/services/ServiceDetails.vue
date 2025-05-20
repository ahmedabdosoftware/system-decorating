<!-- ServiceDetails.vue -->
<template>
  <div v-show="expanded" class="service-details-box">
    <div class="details-layout">
      <!-- main-content-->
      <div class="main-content">
        <h3 class="section-title">Service Description</h3>
        <p class="mb-4">
          {{ service.description }}
        </p>

        <ul class="benefits mb-4">
          <li>
            <v-icon color="orange" small>mdi-check-circle</v-icon>
            Professional installation by certified technicians
          </li>
          <li>
            <v-icon color="orange" small>mdi-check-circle</v-icon>
            Premium materials and components
          </li>
          <li>
            <v-icon color="orange" small>mdi-check-circle</v-icon>
            2-year warranty on all installations
          </li>
        </ul>

        <h3 class="section-title">Installation Details</h3>
        <div class="install-box mb-4">
          <strong>Standard Installation</strong>
          <p class="mb-0">Includes basic setup and configuration</p>
          <p class="install-price">{{ service.price }}</p>
        </div>

        <h3 class="section-title">Additional Specifications</h3>
         <ul class="specs-list mb-4">
          <li v-for="(spec, index) in service.specifications" :key="index">
            <span>{{ spec.label }}</span>
            <span class="service-price">
              {{ spec.value?.toLowerCase() === 'included' ? 'included' : spec.value }}
            </span>
          </li>
        </ul>
      </div>

      <div class="side-box">
        <div class="highlights-box">
          <h3 class="section-title mb-3">Service Highlights</h3>
          <ul class="highlight-points mb-3">
            <li>
              <v-icon left color="orange" small>mdi-timer</v-icon> Average completion time: 4–6 hours
            </li>
            <li>
              <v-icon left color="orange" small>mdi-calendar</v-icon> Scheduling available 7 days a week
            </li>
            <li>
              <v-icon left color="orange" small>mdi-tools</v-icon> All tools and materials provided
            </li>
          </ul>

          <div class="limited-offer-box">
            <h4>Limited Time Offer</h4>
            <p>
              {{ service.offer }}
            </p>
            <v-btn class="limited-offer-btn" color="orange" dark small>
              Claim Offer
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceDetails",
  props: {
    service: Object,
    expanded: Boolean
  }
};
</script>
<style lang="scss" scoped>
.service-details {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  // padding: 16px;
  margin-top: 8px;
  font-size: 15px;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 95%;
}
.service-details-box {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 15px;
  color: #333;
}

/* تقسيم الأعمدة */
.details-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

/* العمود الرئيسي */
.main-content {
  flex: 2;
  min-width: 300px;
}

/* العمود الجانبي */
.side-box {
  flex: 1;
  min-width: 260px;
}

/* العناوين كلها تبقى على الشمال */
.section-title {
  text-align: left;
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: bold;
  color: #444;
}

.benefits li {
  list-style: none;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.install-box {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #eee;
}

.install-price {
  color: #f57c00;
  font-weight: bold;
  margin-top: 4px;
}

.specs-list {
  list-style: none;
  padding: 0;
}
.specs-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.highlights-box {
  background: #f7f9fa;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.highlight-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.limited-offer-box {
  background: #fff3cd;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #f57c00;
  margin-top: 16px;
}

.limited-offer-box h4 {
  margin: 0 0 8px 0;
  color: #b45309;
  font-weight: bold;
}
.limited-offer-btn {
  width: 120px;
}
@media (max-width: 480px) {
  .service-price {
    margin-right: 20px;
  }
}
</style>