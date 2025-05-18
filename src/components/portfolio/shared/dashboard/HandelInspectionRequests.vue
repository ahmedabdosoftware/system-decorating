<!-- InspectionRequests.vue -->
<template>
  <div>
    <div class="flex justify-between items-center">
        <!-- <h3 class="text-right text-lg font-bold">طلبات المعاينه</h3> -->
        <div style="display: flex !important; flex-direction: row !important;" class="flex search-products-catalog justify-between items-center gap-2">
        
        <v-btn style="width: 120px;" color="success" class="mb-4" @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon>
            إضافة طلب
        </v-btn>          
            <v-text-field
            v-model="searchQuery"
            label="بحث بالاسم أو التاريخ"
            prepend-icon="mdi-magnify"
            outlined dense class="mb-4"
            @input="handleSearch"
        />
        </div>
    </div>
    <v-list two-line>
    <v-list-item
        v-for="(request) in requests"
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
        <v-btn icon @click="handelDeleteRequest(request.id)">
            <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
        </v-list-item-action>
    </v-list-item>
    </v-list>

    <div v-if="!loading && requests.length === 0" class="text-center mt-4">
    <v-icon color="grey">mdi-information-outline</v-icon>
    <p>لا يوجد طلبات حالياً</p>
    </div>

    <v-btn
    v-if="!endReached && !loading"
    @click="hadelloadMore"
    block color="primary"
    class="mt-4"
    >
    تحميل المزيد
    </v-btn>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-2" />

    
    <!-- Dialog Details -->
    <v-dialog v-model="detailsDialog" max-width="600px">
        <v-card>
        <v-card-title class="headline">
            تفاصيل طلب المعاينة
        </v-card-title>
        <v-card-text dir="rtl">
            <v-list dense>
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>الاسم:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedRequest.name }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>نوع الخدمة:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedRequest.service }}</v-list-item-subtitle>
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

            <v-list-item v-if="selectedRequest.projectDescription">
                <v-list-item-content>
                <v-list-item-title>وصف المضروع:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedRequest.projectDescription }}</v-list-item-subtitle>
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
    
    <!-- Dialog Add && Edit -->
    <v-dialog v-model="showRequestDialog" max-width="600px">
        <v-card>
            <v-card-title class="headline">إضافة طلب جديد</v-card-title>
            <v-form ref="requestForm" v-model="formValid">
                <v-card-text>
                    <v-text-field v-model="selectedRequest.name" :rules="[v => !!v || 'الاسم مطلوب']" label="الاسم" />
                    <v-text-field v-model="selectedRequest.location" :rules="[v => !!v || 'العنوان مطلوب']" label="العنوان" />
                    <v-text-field v-model="selectedRequest.phone" :rules="[v => !!v || 'رقم الهاتف مطلوب']" label="رقم الهاتف" />
                    <v-select :items="services" item-text="name" item-value="name" v-model="selectedRequest.service" label="نوع الخدمه" outlined dense />
                    <v-text-field v-model="selectedRequest.date" :rules="[v => !!v || 'التاريخ مطلوب']" label="التاريخ" />
                    <v-textarea v-model="selectedRequest.projectDescription" label="وصف المشروع" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="showRequestDialog = false">إغلاق</v-btn>
                    <v-btn color="primary" @click="saveRequest">حفظ</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

  </div>
</template>

<script>
// Store
  import { mapState, mapActions } from "pinia";
  import { useInspectionStore } from "@/store/portfolio/portfolioData/inspection";
  import { useServicesStore } from "@/store/portfolio/portfolioData/services";
// mixins
  import textHelpers from "@/mixins/textHelpers";
  import tenantUidMixin from "@/mixins/tenantUidMixin";
export default {    

  mixins: [textHelpers,tenantUidMixin],

  data() {
    return {
        searchQuery: "",
        detailsDialog: false,
        selectedRequest: {},

          showRequestDialog: false,
          isEditing: false,
          formValid: false,
    }
  },
  methods: {
      ...mapActions(useInspectionStore, ['fetchRequests',"loadMore","searchRequests","deleteRequest","updateRequestStatus", "addRequest", "editRequest"]),
      ...mapActions(useServicesStore, [
                "fetchServices",
                ]),
        openAddDialog() {
            this.selectedRequest = {
            name: "",
            location: "",
            phone: "",
            date: "",
            projectDescription: "",
            status: "جاري",
            createdAt: new Date(),
            };
            this.isEditing = false;
            this.showRequestDialog = true;
        },
             // ********** inspection Save **************

        async saveRequest() {

            const isValid = await this.$refs.requestForm.validate();
            if (!isValid) return;
            
            const request = { ...this.selectedRequest };
            request.userId = this.tenantUid;
            // Add Keywords For Search
            request.keywords = this.generateKeywords(request.name);
            if (this.isEditing) {
            await this.editRequest(request);
            } else {
            await this.addRequest(request);
            }
            this.showRequestDialog = false;
            this.fetchRequests(this.tenantUid);
        },
     // ********** inspection Search **************
      async handleSearch() {

        if (this.searchQuery.trim()) {
            await this.searchRequests(this.tenantUid, this.searchQuery.trim());
        } else {
            await this.fetchRequests(this.tenantUid);
        }
    },

     async hadelloadMore() {
        await this.loadMore(this.tenantUid);
    },
    async handelDeleteRequest(id) {
      if (confirm("هل أنت متأكد من حذف الطلب؟")) {
        await this.deleteRequest(id);
      }
    },
    toggleStatus(request) {
      const newStatus = request.status === "جاري" ? "تم" : "جاري";
      this.updateRequestStatus(request.id, newStatus);
    },
    viewDetails(request) {
        this.selectedRequest = { ...request };
        this.isEditing = true;
        this.detailsDialog = true;
    },
  },
   computed: {
      ...mapState(useInspectionStore, ["requests", "loading","endReached"]),
      ...mapState(useServicesStore, ["services"]),
    },
    watch: {
      tenantUid(newVal) {
      if (newVal) {
        console.log("userId", newVal);
        this.fetchRequests(newVal);
        this.fetchServices(newVal);
      }
    },
    searchQuery: function () {
      this.searchProducts(this.tenantUid,this.searchQuery);
    }
  },

}
</script>
