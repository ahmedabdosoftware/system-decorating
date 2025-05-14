<template>
    <component :is="currentTemplate" v-if="currentTemplate" />
    <div v-else>جارٍ تحميل الموقع...</div>
  </template>
  
  <script>

//  All My Templates  
  import Modern from "@/components/portfolio/templates/Modern/Modern.vue";
// Stores
  import { mapActions } from "pinia";
  import { useUserStore } from "@/store/auth/auth";
  import { useTemplateStore } from "@/store/portfolio/templates/templates";
  
  export default {
    name: "CompanyPortfolio",
    components: {
        Modern,
    },
    data() {
      return {
        currentTemplate: null,
        tenantData: null,
      };
    },
    methods: {
      ...mapActions(useUserStore, ["fetchTenantByCompanyName"]),
      ...mapActions(useTemplateStore, ["fetchTemplateById"]),
  
      async resolveTemplate() {
        try {
            const companyName = this.$route.params.companyName;
            const tenant = await this.fetchTenantByCompanyName(companyName);

            // Check Type
            const allowedTypes = ["Portfolio", "Full System"];
            const isAllowedType = allowedTypes.includes(tenant.subscription_type);

            // Check Validility
            const now = new Date();
            const startDate = new Date(tenant.subscription_start);
            const endDate = new Date(tenant.subscription_end);
            const isActive = tenant.is_active;
            const inValidRange = now >= startDate && now < endDate;

            if (!isAllowedType || !isActive || !inValidRange) {
            console.warn("هذا الاشتراك غير مفعل أو غير صالح لعرض البورتفوليو.");
            // Page Depends on User or Admin
            this.$router.replace({ name: "PortfolioAlert" });
            return;
            }

            // loading Template
            const templateId = tenant.template_id;
            const selectedTemplate = await this.fetchTemplateById(templateId);
            const templateName = selectedTemplate.name.toLowerCase(); 

            const componentMap = {
            modern: "Modern",
            // Other in Future inshaaalah
            };

            this.currentTemplate = componentMap[templateName] || null;

            if (!this.currentTemplate) {
            console.warn("لم يتم العثور على تيمبلت مناسب");
            }

            //Maybe I Need Them
            this.tenantData = tenant;

        } catch (err) {
            console.error("خطأ أثناء تحميل التيمبلت:", err);
            // I Didnt Creat it Yet
            this.$router.replace({ name: "NotFound" });
        }
    },

    },
    mounted() {
      this.resolveTemplate();
    },
  };
  </script>
  