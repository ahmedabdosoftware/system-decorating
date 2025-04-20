<!-- TemplateSettings.vue -->
<template>
    <v-container class="mt-8">
        <v-row justify="center">
            <v-col style="padding: 0px !important;" cols="12" >
                <v-card class="pa-6" elevation="4">
                    <h2 class="mb-4">🎨 إعدادات القالب الخاصة بك</h2>
  
                    <!-- رفع اللوجو -->
                    <v-file-input
                    v-model="form.logo"
                    label="ارفع لوجو شركتك"
                    prepend-icon="mdi-upload"
                    accept="image/*"
                    />
            
                    <!-- عنوان الهيرو -->
                    <v-text-field
                    v-model="form.heroTitle"
                    label="عنوان الهيرو (Hero Section)"
                    outlined
                    class="mt-4"
                    />
            
                    <!-- وصف الهيرو -->
                    <v-textarea
                    v-model="form.heroDescription"
                    label="الوصف تحت العنوان"
                    rows="3"
                    outlined
                    />
            
                    <!-- اختيار اللون الأساسي -->
                    <v-color-picker
                    v-model="form.primaryColor"
                    label="لون الهوية"
                    flat
                    hide-canvas
                    class="mt-6"
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
                    >
                    حفظ الإعدادات
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          logo: null,
          heroTitle: '',
          heroDescription: '',
          primaryColor: '#f57c00',
        },
      };
    },
    methods: {
      saveSettings() {
        // تخزين البيانات في Firebase أو Store أو أي مكان بتستخدمه
        console.log("Saved Settings:", this.form);
        this.$emit("settings-updated", this.form);
      },
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
  