<template>
  <div class="services-section pa-5" :class="{ 'custom-theme': isCustomTheme }">
    <h2 class="font-weight-bold mb-4">{{ $t("services.title") }}</h2>
    <LoadingSpinner v-if="loading" :message='$t("services.loading")' />

    <NoData v-else-if="!loading && paginatedServices.length === 0" :message='$t("services.noData")'/>

    <div v-else>
      <div
        v-for="service in paginatedServices"
        :key="service.id"
        class="mb-4 service-card-cont"
        style="border-radius: 12px !important; background-color: #f3f4f6"
      >
        <ServiceCard
          :title="service.name"
          :price="service.price"
          :icon="getRandomIcon(service.id)"
          @click="toggleService(service.id)"
        />

        <!-- service-details-box-->
        <ServiceDetails
          :service="service"
          :expanded="expandedServiceId === service.id"
        />

      </div>
      <div class="par-btns">
        <!-- 🔘See More-->
           <v-icon
            v-if="!endReached && !loading"
            @click="loadMore"
            class="arrow-icon-portfolio down-arrow mt-4"
            >
            mdi-chevron-down
          </v-icon>
      
      
          <!-- See Less-->
          <v-icon
          v-if="paginatedServices.length > 4"
          @click="resetToFirst"
          class="arrow-icon-portfolio up-arrow mt-2"
           >
          mdi-chevron-up
         </v-icon>
      </div>


    </div>
  </div>
</template>

<script>
// Component
import ServiceCard from "@/components/portfolio/templates/Modern/services/ServiceCard.vue";
import ServiceDetails from "@/components/portfolio/templates/Modern/services/ServiceDetails.vue";
import NoData from "@/components/portfolio/shared/additions/NoData.vue";
import LoadingSpinner from "@/components/portfolio/shared/additions/LoadingSpinner.vue";
// Store
import { useServicesStore } from "@/store/portfolio/portfolioData/services";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";
import { mapState, mapActions } from "pinia";
// localization
// import { useI18n } from "vue-i18n";
// Mixins
import tenantUidMixin from "@/mixins/tenantUidMixin";
export default {
  mixins: [tenantUidMixin],
  components: { ServiceCard,ServiceDetails,NoData, LoadingSpinner},
  props: {
    isCustomTheme: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandedServiceId: null,
        icons: [
        "mdi-saw-blade",
        "mdi-wall",
        "mdi-ceiling-light",
        "mdi-texture-box",
        "mdi-hammer",
        "mdi-paint",
        "mdi-ruler",
        "mdi-brush",
        "mdi-lightbulb",
        "mdi-screwdriver",
    ],
    };
  },
  computed: {
    ...mapState(useServicesStore, [
      "paginatedServices",
      "endReached",
      "loading"
    ]),
        ...mapState(useTemplateSettingsStore, ["settings"]),

  },
  methods: {
    ...mapActions(useServicesStore, [
    "fetchInitialServices",
    "loadMoreServices",
    "resetServices"
    ]),
    loadMore() {
      this.loadMoreServices(this.tenantUid);
    },
    resetToFirst() {
      this.resetServices(this.tenantUid);
    },

    toggleService(id) {
      this.expandedServiceId = this.expandedServiceId === id ? null : id;
    },
     getRandomIcon(serviceId) {
      // Fixed For Every Service
      const index = serviceId % this.icons.length;
      //Random Icon Every Once
      // const index = Math.floor(Math.random() * this.icons.length);
      return this.icons[index];
  },
  },
   watch: {
    tenantUid(newVal) {
      if (newVal) {
        this.fetchInitialServices(newVal);
      }
    },
  },

};
</script>

<style scoped lang="scss">
.services-section {
  background: #eeede9;
}
.service-card-cont {
  // border-radius: 12px !important;
  // background-color: red;
}
.services-section.custom-theme {
  background: #fff;
}

</style>
