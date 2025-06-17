<template>
    <v-app>
      <v-container class="manageTemplates-view">
        <!-- Header with Search Label + Add Button -->
        <v-row style="margin-top: 16px;" align="center" justify="space-between" class="mb-2">
          <div class="text-Search">Search templates</div>
          <v-btn class="btn-add-temp" style="width: 180px; font-size: 13px; border-radius: 16px; margin-right: 20px;" color="blue darken-2" dark @click="openAddDialog">
            Add new template
          </v-btn>
        </v-row>
  
        <!-- Search Field -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search templates"
              solo
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
  
        <!-- Templates Grid -->
        <v-row>
          <v-col
            v-for="template in filteredTemplates"
            :key="template.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pa-3">
              <v-img :src="template.image" height="150px" contain></v-img>
              <v-card-title class="text-h6">{{ template.name }}</v-card-title>
              <v-card-subtitle>{{ template.description }}</v-card-subtitle>
  
              <v-card-actions class="d-flex justify-space-between">
                <v-btn icon color="primary" @click="viewTemplate(template)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon color="blue darken-2" @click="openEditDialog(template)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deleteTemplate(template.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Add/Edit Template Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h6">{{ isEdit ? 'Edit Template' : 'Add New Template' }}</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="form.name" label="Template Name"></v-text-field>
              <v-combobox
                v-model="form.components"
                :items="availableComponents"
                label="Components"
                multiple
              ></v-combobox>
              <v-text-field
                v-model="form.description"
                label="Description"
              ></v-text-field>
              <v-file-input
                label="Upload Image"
                @change="onFileChange"
                accept="image/*"
              ></v-file-input>
              <v-img v-if="form.image" :src="form.image" height="150px" contain></v-img>

              <!-- رفع صور -->
              <v-file-input
                label="صور الهيرو"
                multiple
                show-size
                outlined
                dense
                @change="handleImageUpload"
              />
              <div class="flex flex-wrap mt-2 gap-2">
                <div v-for="(img, index) in form.heroImages" :key="index" class="relative w-24 h-24">
                  <img :src="getImageSrc(img)" height="80" width="80" />
                  <v-btn icon small class="absolute top-0 right-0" @click="removeImage(index)">
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :loading="loading" color="blue darken-2" text @click="saveTemplate">{{ isEdit ? 'Update' : 'Save' }}</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- View Template Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h6">Template Details</span>
            </v-card-title>
            <v-card-text>
              <v-img :src="selectedTemplate.image" height="150px" contain></v-img>
              <p><strong>Name:</strong> {{ selectedTemplate.name }}</p>
              <p><strong>Description:</strong> {{ selectedTemplate.description }}</p>
              <p><strong>Components:</strong> {{ selectedTemplate?.components?.join(', ') }}</p>
              <p><strong>Hero Images:</strong></p>
              <div style="display: flex; flex-wrap: wrap; justify-content: space-evenly;" class="flex flex-wrap mt-2 gap-2">
                <div
                  v-for="(img, index) in selectedTemplate.heroImages"
                  :key="index"
                  class="relative w-24 h-24"
                >
                  <img :src="getImageSrc(img)" height="80" width="80" />
                </div>
              </div>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="viewDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import { mapState, mapActions } from 'pinia';
  import { useTemplateStore } from '@/store/portfolio/templates/templates';
  
  export default {
    data() {
      return {
        dialog: false,
        viewDialog: false,
        isEdit: false,
        search: '',
        form: {
          name: '',
          components: [],
          description: '',
          heroImages: [],
          image: '',

        },
        selectedTemplate: {},
        file: null,
        availableComponents: ['Catalog', 'Projects', 'Blog', 'Contact', 'About', 'Services', 'Team'],
      };
    },
    computed: {
      ...mapState(useTemplateStore, ['templates','loading']),
      filteredTemplates() {
        if (!this.search) return this.templates;
        const term = this.search.toLowerCase();
        return this.templates.filter(t =>
          t.name.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
        );
      },
    },
    methods: {
      ...mapActions(useTemplateStore, ['fetchTemplates', 'addTemplate', 'updateTemplate', 'deleteTemplate','uploadImageToImgBB']),
      openAddDialog() {
        this.resetForm();
        this.isEdit = false;
        this.dialog = true;
      },
      openEditDialog(template) {
        this.form = { ...template };
        this.isEdit = true;
        this.dialog = true;
      },
      viewTemplate(template) {
        this.selectedTemplate = template;
        this.viewDialog = true;
      },
      onFileChange(file) {
        this.file = file;
      },
      async saveTemplate() {
        console.log("hi")
        // Pictures First
        const imageUrls = [];
        if (this.form.heroImages && this.form.heroImages.length > 0) {
          for (const img of this.form.heroImages) {
            if (typeof img === "string") {
              // الصورة موجودة مسبقًا كرابط (مش صورة جديدة)
              imageUrls.push(img);
            } else if (img instanceof File) {
              // الصورة جديدة من نوع File - نرفعها
              const uploadedURL = await this.uploadImageToImgBB(img);
              imageUrls.push(uploadedURL);
            } else {
              // حالة غير متوقعة، ممكن تتجاهل أو تعطي تحذير هنا
              console.warn("صورة غير صالحة في المعرض:", img);
            }
          }
        } else {
          console.warn("لا توجد صور في المعرض للرفع");
        }
        this.form.heroImages = imageUrls
        
        if (this.isEdit) {
          await this.updateTemplate(this.form.id, this.form, this.file);
        } else {
          await this.addTemplate(this.form, this.file);
        }
        this.dialog = false;
        this.resetForm();
      },

       handleImageUpload(newFiles) {
        if (!newFiles) return;
        console.log("heroImages",this.form.heroImages)
        // console.log("description",this.form.description)
        const total = this.form.heroImages.length + newFiles.length;

        if (total > 4) {
            const availableSlots = 4 - this.form.heroImages.length;
            const filesToAdd = newFiles.slice(0, availableSlots);
            this.form.heroImages.push(...filesToAdd);
        } else {
            this.form.heroImages.push(...newFiles);
        }
        },
      getImageSrc(img) {
        return typeof img === "string" ? img : URL.createObjectURL(img);
      },
      removeImage(index) {
        this.form.heroImages.splice(index, 1);
      },
      resetForm() {
        this.form = {
          name: '',
          components: [],
          description: '',
          image: '',
          heroImages: [],

        };
        this.file = null;
      },
    },
    mounted() {
      this.fetchTemplates();
    },
  };
  </script>
  
  <style scoped>
  .v-card-title {
    font-weight: bold;
  }
  .text-Search {
    margin-left: 20px;
    font-weight: 500;
    font-size: 19px;
  }
  .manageTemplates-view {
    background-color: #f7f7f9;
  }
  /* Responsive adjustments */
  @media (max-width: 477px) {
    .btn-add-temp {
      margin-right: 5px !important;
      width: 150px !important;
      font-size: 11px !important;
    }
  }
  </style>
  