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
              <v-text-field
                v-model="searchQuery"
                label="بحث بالاسم أو التاريخ"
                prepend-icon="mdi-magnify"
                outlined dense class="mb-4"
                @input="handleSearch"
              />

              <v-list two-line>
                <v-list-item
                  v-for="(request, index) in inspectionStore.requests"
                  :key="request.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ request.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ request.date }} - {{ request.location }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-chip
                      :color="request.status === 'جاري' ? 'orange' : 'green'"
                      text-color="white"
                      class="mr-2"
                      @click="toggleStatus(request)"
                    >
                      {{ request.status }}
                    </v-chip>
                    <v-btn icon @click="viewDetails(request)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteRequest(request.id)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-btn
                v-if="!inspectionStore.endReached && !inspectionStore.loading"
                @click="loadMore"
                block color="primary"
                class="mt-4"
              >
                تحميل المزيد
              </v-btn>

              <v-progress-linear v-if="inspectionStore.loading" indeterminate color="primary" class="mt-2" />
            </v-card-text>


            <v-dialog v-model="detailsDialog" max-width="600px">
              <v-card>
                <v-card-title class="headline">
                  تفاصيل طلب المعاينة
                </v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>الاسم:</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedRequest.name }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>العنوان:</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedRequest.location }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>رقم الهاتف:</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedRequest.phone }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>التاريخ:</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedRequest.date }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item v-if="selectedRequest.notes">
                      <v-list-item-content>
                        <v-list-item-title>ملاحظات:</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedRequest.notes }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" text @click="detailsDialog = false">إغلاق</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-tab-item>
  
          <!-- Tab 1: Setup -->
          <v-tab-item>
            <v-card-text>
              <v-row>
                <v-col v-for="item in filteredSetupOptions" :key="item.title" cols="6" md="3">
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
  // Components
  import HandelCatalog from "@/components/portfolio/shared/dashboard/HandelCatalog.vue";
  import HandelService from "@/components/portfolio/shared/dashboard/HandelService.vue";
  import HandelProjects from "@/components/portfolio/shared/dashboard/HandelProjects.vue";
  import HandelTemplate from "@/components/portfolio/shared/dashboard/HandelTemplate.vue";
  // Store
  import { mapState, mapActions } from "pinia";
  import { useUserStore } from '@/store/auth/auth';
  import { useTemplateStore } from '@/store/portfolio/templates/templates';
  import { useInspectionStore } from "@/store/portfolio/portfolioData/inspection";

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
        allowedComponents: null,
        
        // Handel different names betwenn backEnd data and my components
        componentMap: {
          Catalog: 'HandelCatalog',
          Projects: 'HandelProjects',
          Services: 'HandelService',
          Contact: 'HandelContact' 
      },
        // All my Avilable components 
        setupOptions: [
          { key: 'HandelCatalog', title: 'الكاتالوج', icon: 'mdi-folder' },
          { key: 'HandelProjects', title: 'المشاريع', icon: 'mdi-briefcase' },
          { key: 'HandelService', title: 'الخدمات', icon: 'mdi-cog' },
          { key: 'HandelTemplate', title: 'إعدادات القالب', icon: 'mdi-tune' }
        ],
        searchQuery: "",
        detailsDialog: false,
        selectedRequest: {},
      }
    },
    methods: {
      selectSection(key) {
        this.selectedSection = key;
      },
      ...mapActions(useUserStore, ['fetchTenantByCompanyName']),
      ...mapActions(useTemplateStore, ['fetchTemplateById']),
      ...mapActions(useInspectionStore, ['fetchRequests',"loadMore","searchRequests","deleteRequest","updateRequestStatus"]),


      // fetch Allowed Components Depend on Campany Name (every tenant chossed Dif Template , so Dif Features)
      async fetchAllowedComponents(companyName) {
        try {
          const tenant = await this.fetchTenantByCompanyName(companyName);
          const templateId = tenant.template_id;
          const selectedTemplate = await this.fetchTemplateById(templateId);
          this.allowedComponents = selectedTemplate.components;
          console.log(this.allowedComponents)

        } catch (err) {
          console.error(err);
        }
      },


      // **********inspection**************
      async handleSearch() {

      if (this.searchQuery.trim()) {
        await this.searchRequests(this.companyName, this.searchQuery.trim());
      } else {
        await this.fetchRequests(this.companyName);
      }
    },

     async loadMore() {
      await this.loadMore(this.companyName);
    },
    async deleteRequest(id) {
      if (confirm("هل أنت متأكد من حذف الطلب؟")) {
        await this.deleteRequest(id);
      }
    },
    toggleStatus(request) {
      const newStatus = request.status === "جاري" ? "تم" : "جاري";
      this.updateRequestStatus(request.id, newStatus);
    },
    viewDetails(request) {
      this.selectedRequest = request;
      this.detailsDialog = true;
  }

    },
    computed: {

      ...mapState(useInspectionStore, ["requests", "loading","endReached"]),
      companyName() {
            return this.$route.params.companyName;
          },
      // Filter Feature That Will Apear
      filteredSetupOptions() {
        if (!this.allowedComponents) return [];

        const allowedKeys = this.allowedComponents.map(name => this.componentMap[name]);

        //  HandelTemplate With All Templates
        if (!allowedKeys.includes('HandelTemplate')) {
          allowedKeys.push('HandelTemplate');
        }

        return this.setupOptions.filter(option => allowedKeys.includes(option.key));
      },


    
    },

    mounted() {
    this.fetchAllowedComponents(this.companyName);
    this.fetchRequests(this.companyName);


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
  