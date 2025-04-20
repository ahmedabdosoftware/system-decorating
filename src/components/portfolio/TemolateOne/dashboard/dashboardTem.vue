<template>
    <v-dialog v-model="visible" max-width="800" persistent>
        <v-card class="pa-4" dir="rtl">
        <v-row class="mb-4 align-center justify-space-between">
            <v-tabs v-model="activeTab" background-color="transparent" grow>
                <v-tab value="requests">طلبات المعاينة</v-tab>
                <v-tab value="setup">اعدادات الموقع</v-tab>
            </v-tabs>
            <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-row>
    
        <v-tabs-items v-model="activeTab">
          <!-- Tab 0: Inspection Requests -->
          <v-tab-item>
            <v-card-text>
              <v-list two-line>
                <v-list-item v-for="(request, index) in inspectionRequests" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ request.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ request.date }} - {{ request.location }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip :color="request.status === 'جاري' ? 'orange' : 'green'" text-color="white">
                      {{ request.status }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-tab-item>
  
          <!-- Tab 1: Setup -->
          <v-tab-item>
            <v-card-text>
              <v-row>
                <v-col v-for="item in setupOptions" :key="item.title" cols="6" md="3">
                  <v-card class="pa-3"  @click="selectSection(item.key)"   :class="{ 'active-box': selectedSection === item.key }"                  >
                    <v-icon class="mb-2">{{ item.icon }}</v-icon>
                    <div class="text-center font-weight-bold">{{ item.title }}</div>
                    <div class="text-center">
                      <v-icon small>mdi-chevron-down</v-icon>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
  
              <!-- Dynamic Section Rendered Below -->
              <component :is="selectedSection" />

            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import HandelCatalog from "@/components/portfolio/TemolateOne/dashboard/HandelCatalog.vue";
  import HandelService from "@/components/portfolio/TemolateOne/dashboard/HandelService.vue";
  import HandelProjects from "@/components/portfolio/TemolateOne/dashboard/HandelProjects.vue";
  import HandelTemplate from "@/components/portfolio/TemolateOne/dashboard/HandelTemplate.vue";

  export default {
    props: {
      visible: Boolean,
    },
    components: {
        HandelCatalog,
        HandelService,
        HandelProjects,
        HandelTemplate,
  },
    data() {
      return {
        dialog: true,
        activeTab: 1, // 0 => Inspection, 1 => Setup
        selectedSection: null,
        setupOptions: [
          { key: 'HandelCatalog', title: 'الكاتالوج', icon: 'mdi-folder' },
          { key: 'HandelProjects', title: 'المشاريع', icon: 'mdi-briefcase' },
          { key: 'HandelService', title: 'الخدمات', icon: 'mdi-cog' },
          { key: 'HandelTemplate', title: 'إعدادات القالب', icon: 'mdi-tune' }
        ],
        inspectionRequests: [
          { name: 'أحمد محمد', date: '2025-04-15', location: 'القاهرة', status: 'جاري' },
          { name: 'منى علي', date: '2025-04-10', location: 'الجيزة', status: 'تم' },
        ]
      }
    },
    methods: {
      selectSection(key) {
        this.selectedSection = key;
      }
    }
  }
  </script>
  
  <style scoped>
  .v-tabs {
    direction: rtl;
  }
  .v-card-text {
    direction: rtl;
  }
  .active-box {
  border: 1px solid #1976d2 !important;
  background-color: #e3f2fd !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;

}
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

  </style>
  