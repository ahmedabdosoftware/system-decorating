<!-- CatalogDialog.vue -->
<template>
    <v-dialog v-model="visible" max-width="650" scrollable>
      <v-card class="rounded-xl pa-2" style="height: 90vh; overflow-y: auto">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="catalog-label">Catalog</div>
          <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
  
        <!-- Filter Buttons -->
            <v-row class="mb-4 filter-buttons" no-gutters>
            <v-col
                v-for="option in filterOptions"
                :key="option.value"
                cols="auto"
                class="mr-2"
            >
                <v-btn
                class="filter-btn"
                large
                rounded
                :color="selectedFilter === option.value ? 'orange darken-2' : 'grey lighten-1'"
                @click="selectedFilter = option.value"
                >
                {{ option.label }}
                </v-btn>
            </v-col>
            </v-row>

  
        <!-- Search Input/Select -->
            <v-row class="mb-4">
                <v-col cols="12" class="Search-Input-Select">
                    <div class="search-label mb-1"> Search by {{ selectedFilter }}</div>
                    <v-text-field
                        v-if="selectedFilter !== 'category'"
                        v-model="searchQuery"
                        label="write here"
                        class="full-width-input search-input"
                        hide-details
                        solo
                        flat
                        dense
                        clearable
                    />
                    <v-select
                    v-else
                    v-model="searchQuery"
                    :items="categories"
                    item-text="name"
                    item-value="name"
                    label="Select Category"
                    class="full-width-input search-input"
                    solo
                    flat
                    dense
                    hide-details
                    clearable
                    />
                </v-col>
            </v-row>


        <!-- Catalog List -->
        <v-list dense>
            <v-list-item
                v-for="(item, index) in products"
                :key="index"
                class="catalog-item px-3 py-2"
                style="border-radius: 16px; background-color: #f7f7f7;"
            >

            <v-list-item-avatar>
              <v-img :src="item.images[0]" />
            </v-list-item-avatar>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ item.description }}
              </v-list-item-subtitle>
              <div class="text-caption grey--text">{{ item.size }}</div>
            </v-list-item-content>
  
            <v-list-item-action class="text-right">
              <div class="font-weight-bold">{{ item.price }}</div>
              <v-btn icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-2" />

        <div class="par-btns">
          <!-- 🔘See More-->
          <v-icon
            v-if="!endReached && !loading && !searchQuery"
            @click="loadMore(tenantUid)"
            :loading="loading"
            class="arrow-icon-portfolio down-arrow mt-4"
            >
            mdi-chevron-down
          </v-icon>
        </div>

      </v-card>
    </v-dialog>
  </template>
  
  <script>
   // Store
  import { mapState, mapActions } from "pinia";
  import { usePortfolioStore } from "@/store/portfolio/portfolioData/catalog";
  // mixins
  import tenantUidMixin from "@/mixins/tenantUidMixin";

  export default {
    name: "CatalogDialog",
    mixins: [tenantUidMixin],

    props: {
      visible: Boolean,
    },
    data() {
      return {
        selectedFilter: "name", // Default selected filter
        searchQuery: '',
        filterOptions: [
        { label: 'By name', value: 'name' },
        { label: 'By category', value: 'category' },
        { label: 'By color', value: 'color' },
        { label: 'By price', value: 'price' },
        { label: 'By Feature', value: 'Feature' },
      ],

      };
    },
     computed: {

  ...mapState(usePortfolioStore, ["products", "categories", "loading","endReached"]),
    },
    methods: {

    ...mapActions(usePortfolioStore, [
      "fetchCategories", "fetchProducts", 
      "searchProducts","loadMore"
    ]),

  },
    watch: {
      tenantUid(newVal) {
      if (newVal) {
        console.log("userId", newVal);
        this.fetchCategories(newVal);
        this.fetchProducts(newVal);
      }
  },
    searchQuery: function () {
      this.searchProducts(this.tenantUid,this.searchQuery,this.selectedFilter);
    }
  },
  };
  </script>
  
  <style scoped>
  .catalog-label {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.search-label {
  font-size: 19px;
  font-weight: 500;
  /* color: #666; */
  padding: 10px;
}

.search-input {
  /* background-color: #f2f2f2; */
  border-radius: 12px;
  padding-left: 12px;
  font-size: 14px;
}

.catalog-item {
  transition: box-shadow 0.2s ease;
  margin-top: 10px;
}

.catalog-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-btn {
  font-size: 13px !important;
  min-width: 110px !important;
  /* background-color: #eee !important; */
  border-radius: 999px !important;
  text-transform: none !important;
  margin-top: 10px;
  color: white !important;
}


.full-width-input {
  width: 100%;
}
.Search-Input-Select{
    border-bottom: 2px solid #eee;
}
  </style>
  