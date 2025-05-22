import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig";

export const useTemplateSettingsStore = defineStore("templateSettingsStore", {
  state: () => ({
    settings: null,
    loading: false,
  }),

  actions: {
    async addDefaultTemplateSettings(tenantUid) {
      const defaultData = {
        userId: tenantUid,
        logo: null,
        heroTitle: "Exquisite Décor, Perfect Details",
        heroDescription: "We bring artistic touches that blend creativity with quality, using the finest materials like Viotech, wood alternatives, marble, and GRP. With precision and expertise, we turn your vision into a stunning",
        email: "",
        phoneNumber: "",
        showWhatsapp: false,
        whatsappNumber: "",
        primaryColor: "#1976D2",
        businessHours: [
          { day: "Monday - Friday", hours: "9:00 AM – 6:00 PM" },
          { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
          { day: "Sunday", hours: "Closed" },
        ],
        socialLinks: {
          facebook: "",
          instagram: "",
          website: "",
        },
        location: "",
      };

      try {
        await db.collection("portfolioHandelTemplate").doc(tenantUid).set(defaultData);
        this.settings = defaultData;
      } catch (error) {
        console.error("خطأ أثناء إنشاء إعدادات القالب:", error);
      }
    },

    async updateTemplateSettings(payload) {
        this.loading = true;
      if (!payload.userId) return;
      try {
        await db.collection("portfolioHandelTemplate").doc(payload.userId).update(payload);
        this.settings = payload;
      } catch (error) {
        console.error("خطأ أثناء تحديث إعدادات القالب:", error);
      }finally {
        this.loading = false;
      }
    },

    async fetchTemplateSettings(tenantUid) {
      this.loading = true;
      try {
        const doc = await db.collection("portfolioHandelTemplate").doc(tenantUid).get();
        if (doc.exists) {
          this.settings = { id: doc.id, ...doc.data() };
        } else {
          this.settings = null;
        }
      } catch (error) {
        console.error("خطأ أثناء جلب إعدادات القالب:", error);
      } finally {
        this.loading = false;
      }
    },
    async uploadImageToImgBB(file) {
    const apiKey = 'a70bc1d60d105c80b4eb207fb2ca3ba1';
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
    throw new Error("رفع الصورة فشل");
    }

    return data.data.url;
    },
  },
});
