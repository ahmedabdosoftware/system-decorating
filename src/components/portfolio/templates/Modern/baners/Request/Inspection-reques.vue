<template>
  <section class="inspection-request">
    <div class="text-center mb-8">
      <h2 class="section-title">Request an Inspection</h2>
      <p class="section-subtitle">
        Fill out the form below to request an inspection or consultation. I’ll
        get back to you within 24 hours.
      </p>
    </div>

    <ValidationObserver v-slot="{ handleSubmit }">
      <v-card class="form-card mx-auto" elevation="2">
        <v-container>
          <form @submit.prevent="handleSubmit(onSubmit)">
            <v-row dense>
              <v-col cols="12" md="6">
                <ValidationProvider
                  name="Full Name"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    label="Full Name"
                    v-model="form.name"
                    :error-messages="errors"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6">
                <ValidationProvider
                  name="location"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    label="location"
                    v-model="form.location"
                    :error-messages="errors"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6">
                <ValidationProvider
                  name="Phone"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    label="Phone Number"
                    v-model="form.phone"
                    :error-messages="errors"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6">
                <ValidationProvider
                  name="Service Type"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-select
                    label="Service Type"
                    v-model="form.service"
                    :items="services"
                    item-text="name"
                    item-value="name"
                    :error-messages="errors"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <ValidationProvider
                  name="Project Description"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-textarea
                    label="Project Description"
                    v-model="form.projectDescription"
                    :error-messages="errors"
                    outlined
                    rows="4"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6">
                <ValidationProvider
                  name="Preferred Date"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    label="Preferred Date"
                    v-model="form.date"
                    type="date"
                    :error-messages="errors"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <ValidationProvider
                  name="Agreement"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-checkbox
                    v-model="form.agree"
                    :error-messages="errors"
                    label="I agree to the terms and conditions privacy policy."
                    required
                    hide-details
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <v-btn
                  block
                  color="orange darken-2"
                  size="large"
                  dark
                  type="submit"
                >
                  <v-icon start>mdi-send</v-icon>
                  Submit Request
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </v-container>
      </v-card>
    </ValidationObserver>
  </section>
</template>

<script>
import { required } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
// Register rules with custom messages
extend("required", {
  ...required,
  message: "{_field_} is required to create a product.",
});
// mixins
import tenantUidMixin from "@/mixins/tenantUidMixin";
import textHelpers from "@/mixins/textHelpers";
// Store
  import { mapState, mapActions } from "pinia";
import { useInspectionStore } from "@/store/portfolio/portfolioData/inspection";
import { useServicesStore } from "@/store/portfolio/portfolioData/services";

export default {
  mixins: [textHelpers,tenantUidMixin],
  components: {},
  data() {
    return {
      form: {
        name: "",
        location: "",
        phone: "",
        service: "",
        projectDescription: "",
        date: "",
        status: "جاري",
        agree: false,
      },
    };
  },
  methods: {
    
    ...mapActions(useInspectionStore, ["addRequest"]),
       ...mapActions(useServicesStore, [
                "fetchServices",
     ]),
    async onSubmit() {
      try {
        
        const userId = this.tenantUid;
        const requestData = {
          ...this.form,
          userId,
          keywords:this.generateKeywords(this.form.name),
        };

        await this.addRequest(requestData);
        
        this.$toast.success("تم إرسال الطلب بنجاح سيتم التواصل معك قريبا");

        // Reset
        this.form = {
          name: "---",
          location: "---",
          phone: "---",
          service: "---",
          projectDescription: "---",
          date: "---",
          agree: false,
        };
      } catch (error) {
        console.error("فشل في إرسال الطلب", error);
        this.$toast.error("حدث خطأ أثناء إرسال الطلب");

      }
    
  },

  },
    computed: {
    ...mapState(useServicesStore, ["services"]),
  },
   watch: {
      tenantUid(newVal) {
      if (newVal) {
        console.log("userId", newVal);
        this.fetchServices(newVal);
      }
    },
    },
};
</script>

<style scoped>
.inspection-request {
  padding: 60px 20px;
}

.section-title {
  font-size: 26px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #64748b;
  font-size: 16px;
}

.form-card {
  max-width: 900px;
  border-radius: 12px;
  padding: 20px;
}
</style>
