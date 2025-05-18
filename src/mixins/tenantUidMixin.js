import { mapActions } from "pinia";
import { useUserStore } from "@/store/auth/auth";

export default {
  data() {
    return {
      tenant: null,
      tenantUid: null,
      loadingTenant: true,
      tenantError: null,
    };
  },
  computed: {
    companyName() {
      return this.$route.params.companyName;
    },
  },
  methods: {
    ...mapActions(useUserStore, ["fetchTenantByCompanyName"]),
    
    async fetchTenantUid() {
      this.loadingTenant = true;
      try {
        const tenant = await this.fetchTenantByCompanyName(this.companyName);
        this.tenant = tenant;
        this.tenantUid = tenant?.uid || null;
      } catch (err) {
        this.tenantError = err;
        console.error("خطأ أثناء جلب بيانات التينانت:", err);
      } finally {
        this.loadingTenant = false;
      }
    },
  },
  created() {
    this.fetchTenantUid();
  },
};
