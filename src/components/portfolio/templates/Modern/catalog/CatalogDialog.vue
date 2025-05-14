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
                        v-model="filterText"
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
                    v-model="filterText"
                    :items="categoryOptions"
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
                v-for="(item, index) in catalogItems"
                :key="index"
                class="catalog-item px-3 py-2"
                style="border-radius: 16px; background-color: #f7f7f7;"
            >

            <v-list-item-avatar>
              <v-img :src="item.image" />
            </v-list-item-avatar>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "CatalogDialog",
    props: {
      visible: Boolean,
    },
    data() {
      return {
        selectedFilter: "name", // Default selected filter
        filterText: '',
        filterOptions: [
        { label: 'By name', value: 'name' },
        { label: 'By category', value: 'category' },
        { label: 'By color', value: 'color' },
        { label: 'By price range', value: 'price' },
        { label: 'Usage Type', value: 'usage' },
      ],
      categoryOptions: ['Wood', 'PVC', 'Marble', 'GRP'],

      catalogItems: [
        {
          id: 1,
          title: 'Wood Alternative',
          description: 'Premium wood-like panels',
          size: '32.5x04',
          price: 42.02,
          category: 'Wood',
          color: 'brown',
          usage: 'Indoor',
          image: 'https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg',
        },
        {
          id: 2,
          title: 'PVC Panels',
          description: 'Durable and lightweight',
          size: '12.5C',
          price: 2.52,
          category: 'PVC',
          color: 'white',
          usage: 'Outdoor',
          image: 'https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg',
        },
        {
          id: 3,
          title: 'Futec',
          description: 'Durable and lightweight',
          size: '12.5C',
          price: 2.52,
          category: 'PVC',
          color: 'blue',
          usage: 'Outdoor',
          image: 'https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg',
        },
        {
          id: 4,
          title: 'Futec',
          description: 'Durable and lightweight',
          size: '12.5C',
          price: 2.52,
          category: 'PVC',
          color: 'blue',
          usage: 'Outdoor',
          image: 'https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg',
        },
        // more items...
      ],
      };
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
  