<template>
    <div>
      <v-row class="mb-4" >
        <v-col cols="12">
            <h3 class="text-right">الخدمات المتاحة</h3>
        </v-col>
    </v-row>
    <v-row class="mb-4" >
        <v-col cols="12">
            <v-btn style="width: 120px;" color="primary" @click="dialogAddService = true">+ إضافة خدمة</v-btn>
        </v-col>
      </v-row>
  
      <v-list two-line>
        <v-list-item
            v-for="(service, index) in services"
            :key="index"
            class="mb-2"
        >
            <v-list-item-content>
            <v-list-item-title>{{ service.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ service.description }} - {{ service.price }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action style="display: flex !important; flex-direction: row !important; justify-content: space-evenly;">
            <v-btn icon small @click="viewService(service)">
                <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small @click="editService(service, index)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="handeldeleteService(index)">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            </v-list-item-action>
        </v-list-item>
      </v-list>

  
      <!-- Dialog: Add/Edit Service -->
      <v-dialog v-model="dialogAddService" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h6">{{ editedIndex !== null ? 'تعديل خدمة' : 'إضافة خدمة' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="form.name" label="اسم الخدمة" outlined></v-text-field>
            <v-text-field v-model="form.description" label="وصف الخدمة" outlined></v-text-field>
            <v-text-field v-model="form.price" label="السعر" outlined></v-text-field>
  
            <v-divider class="my-4"></v-divider>
  
            <h4 class="mb-2">تفاصيل إضافية</h4>
            <v-row v-for="(spec, i) in form.specifications" :key="i" class="mb-2">
              <v-col cols="5">
                <v-text-field v-model="spec.label" label="العنصر"></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="spec.value" label="القيمة"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn icon @click="removeSpecification(i)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-btn style="width: 140px;" text small @click="addSpecification">+ إضافة عنصر إضافي</v-btn>
  
            <v-divider class="my-4"></v-divider>
  
            <v-textarea v-model="form.offer" label="العرض الترويجي (اختياري)" outlined></v-textarea>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="resetForm">إلغاء</v-btn>
            <v-btn :loading="loading" color="primary" @click="saveService">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Dialog: View Service -->
      <v-dialog v-model="dialogViewService" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h6">عرض الخدمة</span>
          </v-card-title>
          <v-card-text>
            <p><strong>الاسم:</strong> {{ selectedService.name }}</p>
            <p><strong>الوصف:</strong> {{ selectedService.description }}</p>
            <p><strong>السعر:</strong> {{ selectedService.price }}</p>
            <div v-if="selectedService.specifications && selectedService.specifications.length">
              <h4 class="mt-4 mb-2">المواصفات الإضافية:</h4>
              <ul>
                <li v-for="(item, i) in selectedService.specifications" :key="i">
                  {{ item.label }}: {{ item.value }}
                </li>
              </ul>
            </div>
            <div v-if="selectedService.offer">
              <h4 class="mt-4 mb-2">العرض الترويجي:</h4>
              <p>{{ selectedService.offer }}</p>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialogViewService = false">إغلاق</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>

  import { mapState, mapActions } from "pinia";
  import { useServicesStore } from "@/store/portfolio/portfolioData/services";
  export default {
    data() {
      return {
        dialogAddService: false,
        dialogViewService: false,
        editedIndex: null,
        selectedService: {},
        form: {
          name: '',
          description: '',
          price: '',
          specifications: [],
          offer: ''
        }
      };
    },
    computed: {
      ...mapState(useServicesStore, ["services","loading"]),
       companyName() {
      return this.$route.params.companyName;
    },

  },
    methods: {
      ...mapActions(useServicesStore, [
        "fetchServices","addService","updateService",
        "deleteService",
      ]),
      resetForm() {
        this.form = {
          name: '',
          description: '',
          price: '',
          specifications: [],
          offer: ''
        };
        this.dialogAddService = false;
        this.editedIndex = null;
      },

       async saveService() {
        
          const service = { ...this.form };
          service.companyName = this.companyName;
        if (this.editedIndex !== null) {
          const id = this.services[this.editedIndex].id
          await this.updateService(id, service)
        } else {
          await this.addService(service)
        }
        this.resetForm()
    },

      editService(service, index) {
          this.form = { ...service, specifications: [...(service.specifications || [])] }
          this.editedIndex = index
          this.dialogAddService = true
        },
        
    async handeldeleteService(index) {
      const id = this.services[index].id
      await this.deleteService(id)
    },

    viewService(service) {
      this.selectedService = service
      this.dialogViewService = true
    },
      addSpecification() {
        this.form.specifications.push({ label: '', value: '' });
      },
      removeSpecification(index) {
        this.form.specifications.splice(index, 1);
      }
    },
    created() {
     this.fetchServices(this.companyName);
  },
  };
  </script>
  
  <style scoped>
  h3 {
    font-weight: bold;
  }
  .v-card{
    direction: rtl;

  }
  </style>
  