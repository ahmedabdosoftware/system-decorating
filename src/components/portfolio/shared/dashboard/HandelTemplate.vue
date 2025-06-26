<template>
  <v-container fluid style="padding:0px;" class="mt-8">
    <v-row justify="center" no-gutters >
      <v-col cols="12">
        <v-card class="pa-6" elevation="4">
          <h2 class="mb-6">🎨 إعدادات القالب الخاصة بك</h2>

          <!-- معلومات أساسية -->
          <v-divider class="mb-4" />
          <h4 class="mb-3">معلومات عامة</h4>

          <v-file-input
            v-model="form.logo"
            label="ارفع لوجو شركتك"
            prepend-icon="mdi-upload"
            accept="image/*"
          />
      

          <v-text-field
            v-model="form.heroTitle"
            label="عنوان الهيرو (Hero Section)"
            outlined
          />

          <v-textarea
            v-model="form.heroDescription"
            label="الوصف تحت العنوان"
            rows="3"
            outlined
          />

          <div class="text-subtitle-2 font-weight-medium mb-2">
            لون الهوية البصرية (اختر لونًا قريبًا من شعارك)
          </div>
          <v-color-picker
            v-model="form.primaryColor"
            flat
            hide-canvas
            class="mt-6"
          />

          <!-- زر عرض التفاصيل -->
          <v-divider class="my-6" />
          <v-btn
            block
            color="secondary"
            @click="toggleAdditionalInfo"
            prepend-icon="mdi-chevron-down"
            class="mb-3"
          >
            {{ showAdditionalInfo ? 'إخفاء المعلومات الإضافية' : 'عرض معلومات إضافية' }}
          </v-btn>

          <v-expand-transition>
            <div v-show="showAdditionalInfo">
              <h4 class="mb-3">معلومات إضافية</h4>

                <!-- اختيار اللغة -->
                <v-select
                  v-model="form.language"
                  :items="languages"
                  item-text="label"
                  item-value="value"
                  label="اختار لغة الموقع"
                  outlined
                  class="mb-2"
                />

                <p class="text-caption text--secondary mb-4">
                  ⚠️ تأكد من رفع البيانات مثل الكاتالوج والخدمات باللغة التي تختارها، لأن الموقع هيتم ضبطه بناءً عليها.
                </p>

              <!-- الموقع -->
              <v-text-field
                v-model="form.location"
                label="عنوان موقع البيزنس"
                outlined
              />

              <!-- البريد الإلكتروني -->
              <v-text-field
                v-model="form.email"
                label="البريد الإلكتروني"
                outlined
              />

              <!-- رقم الهاتف -->
              <v-text-field
                v-model="form.phoneNumber"
                label="رقم الهاتف الأساسي للتواصل"
                outlined
              />

              <!-- مواعيد العمل -->
              <h5 class="mt-6 mb-2">مواعيد العمل</h5>
              <v-row dense v-for="(item, index) in form.businessHours" :key="index">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.day"
                    label="اليوم"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.from"
                    label="من"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.to"
                    label="إلى"
                    outlined
                  />
                </v-col>
              </v-row>

              <!-- روابط السوشيال ميديا -->
              <h5 class="mt-6 mb-2">روابط السوشيال ميديا</h5>
              <v-text-field
                v-model="form.socialLinks.facebook"
                label="رابط فيسبوك"
                outlined
              />
              <v-text-field
                v-model="form.socialLinks.instagram"
                label="رابط انستجرام"
                outlined
              />
              <v-text-field
                v-model="form.socialLinks.pinterest"
                label="رابط بينترست"
                outlined
              />
              <!-- <v-text-field
                v-model="form.socialLinks.website"
                label="رابط الموقع الإلكتروني"
                outlined
              /> -->
            </div>
          </v-expand-transition>

          <!-- Choose Hero background -->
          <ChooseHero 
            :initialHeroSection="form.heroSection"
            @hero-selection-changed="handleHeroSelection"
            
          />

          <!-- واتساب -->
          <v-divider class="my-6" />
          <h4 class="mb-4 mr-4">خيارات التواصل واتساب</h4>
         <v-switch
            v-model="form.showWhatsApp"
            class="mb-4"
            inset
          >
            <template #label>
              <span class="mr-2">تفعيل زر الواتساب</span>
            </template>
          </v-switch>

          <v-text-field
            v-if="form.showWhatsApp"
            v-model="form.whatsappNumber"
            label="رقم الواتساب (مع كود الدولة)"
            placeholder="+201234567890"
            outlined
          />

          


          <!-- Teaser ظريف -->
          <div class="coming-soon mt-8 text-center">
              <v-icon color="deep-purple" size="36">mdi-rocket-launch</v-icon>
              <h4 class="mb-1">مفاجآت قادمة! 🚀</h4>
              <p class="text-caption">
                  قريبًا هتقدر تختار من قوالب متعددة تناسب ذوقك واحتياج شركتك ✨
              </p>
          </div>
          
          <!-- زر الحفظ -->
          <v-btn
            class="mt-6"
            color="primary"
            @click="saveSettings"
            large
            block
            :loading="loading"
            :disabled="loading"
          >
            حفظ الإعدادات
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
// Mixins
import tenantUidMixin from "@/mixins/tenantUidMixin";

// Stores
import { mapState, mapActions } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

// Components
import ChooseHero from "@/components/portfolio/shared/dashboard/Template-Setting/ChooseHero.vue";

export default {
  name: "TemplateSettings",
  mixins: [tenantUidMixin],
  components: { ChooseHero },

  data() {
    return {
      showAdditionalInfo: false,
      oldLogo: null,
      form: {
        logo: null,
        heroTitle: "",
        heroDescription: "",
        primaryColor: "#f57c00",
        location: "",
        email: "",
        phoneNumber: "",
        businessHours: [
          { day: "Monday - Friday", from: "09:00 AM", to: "06:00 PM" },
          { day: "Saturday", from: "10:00 AM", to: "04:00 PM" },
          { day: "Sunday", from: "", to: "Closed" },
        ],
        socialLinks: {
          facebook: "",
          instagram: "",
          pinterest: "",
          website: "",
        },
        showWhatsApp: false,
        whatsappNumber: "",
        heroSection: {
          isDefault: true,
          images: [],
          
        },
      language: "en", 
      },
      languages: [
      { label: "الإنجليزية", value: "en" },
      { label: "العربية", value: "ar" },
    ],

    };
  },
    computed: {
    ...mapState(useTemplateSettingsStore, ["settings", "loading"]),
  },
  methods: {
    ...mapActions(useTemplateSettingsStore, [
      "uploadImageToImgBB",
      "updateTemplateSettings",
      "fetchTemplateSettings",
      ]),
      toggleAdditionalInfo() {
        this.showAdditionalInfo = !this.showAdditionalInfo;
      },

     async loadSettings(uid) {
      try {
       await this.fetchTemplateSettings(uid);
        if (this.settings) {
        this.form = {
          ...this.settings,
          logo: this.settings.logo || null,
          businessHours: this.settings.businessHours || [
            { day: "Monday - Friday", from: "09:00 AM", to: "06:00 PM" },
            { day: "Saturday", from: "10:00 AM", to: "04:00 PM" },
            { day: "Sunday", from: "", to: "Closed" },
          ],
          socialLinks: {
            facebook: this.settings.socialLinks?.facebook || "",
            instagram: this.settings.socialLinks?.instagram || "",
            pinterest: this.settings.socialLinks?.pinterest || "",
            website: this.settings.socialLinks?.website || "",
          },
           heroSection: this.settings.heroSection || {
            isDefault: true,
            images: []
          },
          showWhatsApp: this.settings.showWhatsApp || false,
          whatsappNumber: this.settings.whatsappNumber || "",
          language: this.settings.language || "en",

        };
        this.oldLogo = this.settings.logo || null;
        }
        } catch (err) {
          console.error("فشل تحميل الإعدادات:", err);
        }
        
      },
    async saveSettings() {
      let logoURL = null;

      // رفع اللوجو لو صورة جديدة (File) مش رابط
      if (this.form.logo && typeof this.form.logo !== "string") {
        logoURL = await this.uploadImageToImgBB(this.form.logo);
      } else if (typeof this.form.logo === "string" || this.oldLogo) {
        logoURL = this.oldLogo;
      } else {
        logoURL = null;
      }

      const payload = {
        ...this.form,
        logo: logoURL,
        userId: this.tenantUid,
      };

      this.updateTemplateSettings(payload)
        .then(() => {
          console.log("تم حفظ الإعدادات:", payload);
          this.$toast.success("تم تحديث الإعدادات بنجاح");
          this.$emit("settings-updated", payload);
        })
        .catch((error) => {
          console.error("خطأ أثناء حفظ الإعدادات:", error);
          this.$toast.error("حدث خطأ أثناء تحديث الإعدادات");
        });
    },
     handleHeroSelection(payload) {
       console.log("payload",payload)
   
      this.form.heroSection.images = payload.images;
      this.form.heroSection.isDefault = payload.isDefault;
    },

  },
  watch: {
  tenantUid(newVal) {
    if (newVal) {
      this.loadSettings(newVal);
    }
  }
},

};
</script>


<style scoped>
.v-color-picker {
  max-width: 300px;
}
.coming-soon {
  background-color: #f3f3f3;
  padding: 20px;
  border-radius: 12px;
  border: 1px dashed #ccc;
  transition: background-color 0.3s ease;
}

.coming-soon:hover {
  background-color: #f0e6ff;
}
</style>
