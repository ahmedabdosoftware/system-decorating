<template>
  <v-card class="pa-4 mt-8" elevation="3">
    <h4 class="mb-4">🖼️ اختر خلفية او اكثر يظهروا في  الـ Hero Section</h4>
    <div v-show="false" style="display: flex; flex-wrap: wrap; justify-content: space-evenly;" class="d-flex justify-center mb-4">
        <v-chip
            color="primary"
            class="ma-2"
            outlined
            label
        >
           كل التصاميم
        </v-chip>
        <v-chip
            v-for="(category, index) in categories"
            :key="index"
            color="primary"
            class="ma-2"
            outlined
            label
        >
            {{ category }}
        </v-chip>
        </div>
    <swiper :options="swiperOptions">
      <!-- Upload New Background Hero-->
      <swiper-slide>
        <v-card
          class="d-flex flex-column align-center justify-center pa-4 upload-card"
          style="height: 150px; border: 2px dashed #ccc; cursor: pointer;"
          @click="triggerFileInput"
        >
          <v-icon color="primary" size="36">mdi-upload</v-icon>
          <span class="mt-2">رفع صورة</span>
          <span class="mt-2 sml-text">  لو مقاسات الصوره مش مظبوطه يفضل عدم رفعها واختر صوره جاهزة (متاح خدمة عمل صوره خصيصا لك)</span>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none;"
          />
        </v-card>
      </swiper-slide>

      <!-- default Image-->
      <swiper-slide>
        <v-card
          :class="['d-flex flex-column align-center pa-2', isDefaultSelected ? 'selected-default' : '']"
          style="position: relative; cursor: pointer;"
          @click="selectDefaultImage"
        >
          <v-img :src="defaultImage" height="100" contain />
          <small class="mt-2">الخلفية الافتراضيه لسايت  </small>
        </v-card>
      </swiper-slide>

      <!-- Other Images-->
      <swiper-slide
        v-for="(img, index) in heroImages"
        :key="index"
      >
        <v-card
          class="d-flex flex-column align-center pa-2"
          style="position: relative;"
        >
          <v-img :src="getImageSrc(img)" height="100" contain />
          <v-checkbox
            v-model="selectedImages"
            :value="img"
            class="mt-2"
            hide-details
            dense
            color="primary"
          />
          <v-btn v-if="isUserUploaded(img)" icon @click.stop="removeUserImage(img)">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
    <v-progress-circular
      v-if="isUploading"
      indeterminate
      color="primary"
      class="upload-loader"
    />
  </v-card>
</template>

<script>
// Store
import { mapActions } from 'pinia';
import { useTemplateStore } from '@/store/portfolio/templates/templates';
import { useUserStore } from '@/store/auth/auth';

export default {
  name: 'HeroImageSelector',
  props: ['initialHeroSection'],

  data() {
    return {
      defaultImage: '',
      heroImages: [],
      selectedImages: [],
      isDefaultSelected: true,
      categories: ['مطابخ', 'المونتال', 'جبس'], 
      isUploading: false,

      swiperOptions: {
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
     pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
     breakpoints: {
        0: {        
             slidesPerView: 1
        },
        600: {       
             slidesPerView: 2
        },
        960: {      
             slidesPerView: 3
        }
  }
}
};
  },


  methods: {
    ...mapActions(useTemplateStore, ['fetchTemplateById', 'uploadImageToImgBB']),
    ...mapActions(useUserStore, ['fetchTenantByCompanyName']),

    async loadTemplateImages(companyName) {
          const tenant = await this.fetchTenantByCompanyName(companyName);
          const templateId = tenant.template_id;
          const template = await this.fetchTemplateById(templateId);
          this.heroImages = template?.heroImages || [];
          this.defaultImage = template?.image ||'';
          console.log("(this.initialHeroSection",this.initialHeroSection)
           // Sync with parent heroSection
          if (this.initialHeroSection && this.initialHeroSection.images.length) {
            this.initialHeroSection.images.forEach(img => {
              if (!this.heroImages.includes(img)) this.heroImages.push(img);
            });
            this.selectedImages = [...this.initialHeroSection.images];
          }
        },

    getImageSrc(img) {
      return typeof img === 'string' ? img : URL.createObjectURL(img);
    },

    selectDefaultImage() {
      this.isDefaultSelected = true;
      this.selectedImages = [];
      this.emitSelection();
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
     async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.heroImages.unshift(file);
        this.selectedImages.push(file);
        this.isDefaultSelected = false;
        this.emitSelection();
      }
    },
     async emitSelection() {
      this.isUploading = true;
      const imageUrls = [];
      for (const img of this.selectedImages) {
        if (typeof img === 'string') {
          imageUrls.push(img);
        } else if (img instanceof File) {
          const uploadedURL = await this.uploadImageToImgBB(img);
          imageUrls.push(uploadedURL);
        }
      }
      this.$emit('hero-selection-changed', {
        isDefault: this.isDefaultSelected,
        images: imageUrls
      });

     this.isUploading = false;

    },
     isUserUploaded(img) {
      return img instanceof File;
    },
    removeUserImage(img) {
      const index = this.heroImages.indexOf(img);
      if (index > -1) this.heroImages.splice(index, 1);

      const selectedIndex = this.selectedImages.indexOf(img);
      if (selectedIndex > -1) this.selectedImages.splice(selectedIndex, 1);

      this.emitSelection();
    },
  },
  watch: {
    selectedImages(newVal) {
      if (newVal.length > 0) {
        this.isDefaultSelected = false;
        this.emitSelection();

      }
    },
  },
   mounted() {
   const companyName = this.$route.params.companyName;
    this.loadTemplateImages(companyName);
  }
};
</script>

<style scoped>
::v-deep(.selected-default){
  border: 3px solid #1976d2;
  box-shadow: 0 0 10px #1976d2;
  transition: 0.3s;
}
::v-deep(.swiper-button-next),
::v-deep(.swiper-button-prev) {
  color: white;
  background-color: #1976d2; 
  border-radius: 50%;        
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  position: absolute;
  top: 70%;
  /* transform: translateY(-50%); */
  z-index: 10;
  cursor: pointer;
  transition: background-color 0.3s;
}

::v-deep(.swiper-button-prev) {
  left: -15px; 
}

::v-deep(.swiper-button-next) {
  right: -15px;
}

::v-deep(.swiper-button-next:hover),
::v-deep(.swiper-button-prev:hover) {
  background-color: #1565c0; 
}

::v-deep(.swiper-button-next::after),
::v-deep(.swiper-button-prev::after) {
  font-size: 16px !important; 
  font-weight: bold;
}

::v-deep(.swiper-pagination){
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
}
::v-deep(.swiper-slide > .v-card) {
  border-radius: 12px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.15); 
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff; 
  padding: 10px;
}

::v-deep(.swiper-slide > .v-card:hover) {
  transform: translateY(-5px); 
  box-shadow: 0 8px 16px rgba(0,0,0,0.2); 
}

::v-deep(.swiper-slide > .v-card .v-img) {
  border-radius: 8px; 
  overflow: hidden;
}

::v-deep(.swiper-slide > .v-card small) {
  margin-top: 8px;
  color: #555; 
  font-weight: 500;
  text-align: center;
}
.sml-text{
    font-size: 10px;
}

.upload-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
</style>
