<template>
    <div>
      <!-- 🔍 Search & ➕ Add -->
        <div style="margin-bottom: 20px;" class="flex justify-between items-center">
          <h3 class="text-right text-lg font-bold">المشاريع</h3>
          <div style="display: flex !important; flex-direction: row !important;" class="flex search-products-catalog justify-between items-center gap-2">
            <v-btn style="width: 120px; margin-left: 10px;" color="orange darken-2" dark @click="openForm()">
             <v-icon left>mdi-plus</v-icon> إضافة مشروع
            </v-btn>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ابحث بعنوان المشروع"
                hide-details
                dense
                solo
            ></v-text-field>
                
          </div>
        </div>
  
      <!-- 📋 Project List -->
      <v-row>
        <v-col
          v-for="proj in paginatedProjects"
          :key="proj.id"
          cols="12" sm="6" md="4"
        >
          <v-card>
            <v-img :src="proj.cover" height="200px"></v-img>
  
            <v-card-title>{{ proj.title }}</v-card-title>
            <v-card-subtitle>
              <v-chip color="amber lighten-4" small>{{ proj.category }}</v-chip>
              <v-icon small class="ml-1">mdi-map-marker</v-icon>
              {{ proj.location }}
            </v-card-subtitle>
  
            <v-card-actions class="justify-end">
              <v-btn icon @click="viewProject(proj)"><v-icon>mdi-eye</v-icon></v-btn>
              <v-btn icon @click="editProject(proj)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon @click="deleteProject(proj.id)"><v-icon color="red">mdi-delete</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 📄 Pagination -->
      <v-pagination
        v-model="currentPage"
        :length="pageCount"
        class="mt-4"
      ></v-pagination>
  
      <!-- 🔍 View Dialog -->
      <ProjectDialog
        v-if="selectedProject"
        :visible="viewDialog"
        :project="selectedProject"
        @close="viewDialog = false"
      />
  
      <!-- 📝 Add/Edit Form Dialog -->
      <v-dialog  v-model="formDialog" max-width="800">
        <v-card style="direction: rtl">
          <v-card-title>{{ form.id ? 'تعديل مشروع' : 'إضافة مشروع' }}</v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field  v-model="form.title" label="عنوان المشروع" required></v-text-field>
              <v-text-field v-model="form.subtitle" label="عنوان فرعي" required></v-text-field>
              <v-text-field v-model="form.category" label="التصنيف"></v-text-field>
              <v-text-field v-model="form.location" label="الموقع"></v-text-field>
              <v-textarea v-model="form.description" label="الوصف"></v-textarea>
              <v-text-field v-model="form.materials" label="الخامات المستخدمة"></v-text-field>
              <v-text-field v-model="form.duration" label="مدة المشروع"></v-text-field>
              <v-textarea v-model="form.testimonial" label="رأي العميل"></v-textarea>
              <v-text-field v-model="form.client" label="اسم العميل"></v-text-field>
  
              <!-- 🖼️ Cover Image -->
              <v-file-input
                v-model="form.cover"
                label="صورة الغلاف"
                accept="image/*"
                prepend-icon="mdi-image"
                show-size
                @click:clear="form.cover = null"
                clearable
              ></v-file-input>
  
              <!-- 🖼️ Gallery Upload -->
              <v-file-input
                label="صور إضافية (حد أقصى 4 صور)"
                accept="image/*"
                multiple
                :counter="galleryCounter"
                prepend-icon="mdi-image-multiple"
                show-size
                clearable
                @click:clear="form.gallery = []"
                @change="handleGalleryUpload"
                :rules="[v => !v || v.length <= 4 || 'مسموح بحد أقصى ٤ صور']"
              ></v-file-input>
  
              <!-- 🧹 Remove Gallery Preview -->
              <div v-if="form.gallery && form.gallery.length" class="mt-2">
                <div class="d-flex flex-wrap">
                  <div
                    v-for="(img, index) in form.gallery"
                    :key="index"
                    class="mr-2 mb-2"
                  >
                    <v-img :src="getImageSrc(img)" height="80" width="80" contain></v-img>
                    <v-btn x-small color="red" icon @click="removeImage(index)">
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="formDialog = false">إلغاء</v-btn>
            <v-btn color="orange darken-2" dark @click="saveProject">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
import ProjectDialog from "@/components/portfolio/templates/Modern/projects/ProjectDialog.vue";
  
  export default {
    components: { ProjectDialog },
    data() {
      return {
        search: "",
        currentPage: 1,
        perPage: 5,
        formDialog: false,
        viewDialog: false,
        selectedProject: null,
        form: {
          id: null,
          title: "",
          subtitle: "",
          category: "",
          location: "",
          description: "",
          materials: "",
          duration: "",
          testimonial: "",
          client: "",
          cover: null,
          gallery: []
        },
        projects: [
        {
          title: "Modern Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "Modern Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "Modern Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "clasic Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "Modern Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "stylish Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "pure Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "Modern Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },
        {
          title: "simple Kitchen Cabinetry",
          subtitle: "Malibu, CA",
          cover:
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          gallery: [
            "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
            "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
          ],
          category: "Cabinetry",
          location: "Malibu, CA",
          description:
            "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
          materials:
            "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
          duration: "8 weeks",
          testimonial:
            "Working with John on our kitchen renovation was a dream...",
          client: "David & Sarah Miller, Malibu",
        },

      ],    
      };
    },
    computed: {
      filteredProjects() {
        return this.projects.filter(p =>
          p.title.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      pageCount() {
        return Math.ceil(this.filteredProjects.length / this.perPage);
      },
      paginatedProjects() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.filteredProjects.slice(start, start + this.perPage);
      },
      galleryCounter() {
        return this.form.gallery?.length || 0;
      }
    },
    methods: {
      openForm() {
        this.resetForm();
        this.formDialog = true;
      },
      resetForm() {
        this.form = {
          id: null,
          title: "",
          subtitle: "",
          category: "",
          location: "",
          description: "",
          materials: "",
          duration: "",
          testimonial: "",
          client: "",
          cover: null,
          gallery: []
        };
      },
      handleGalleryUpload(newFiles) {
        if (!newFiles) return;

        const total = this.form.gallery.length + newFiles.length;

        if (total > 4) {
            const availableSlots = 4 - this.form.gallery.length;
            const filesToAdd = newFiles.slice(0, availableSlots);
            this.form.gallery.push(...filesToAdd);
        } else {
            this.form.gallery.push(...newFiles);
        }
        },

      editProject(proj) {
        this.form = { ...proj, gallery: [...(proj.gallery || [])] };
        this.formDialog = true;
      },
      deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
      },
      viewProject(proj) {
        this.selectedProject = proj;
        this.viewDialog = true;
      },
      saveProject() {
        if (this.form.id) {
          const index = this.projects.findIndex(p => p.id === this.form.id);
          this.projects.splice(index, 1, { ...this.form });
        } else {
          this.projects.push({ ...this.form, id: Date.now() });
        }
        this.formDialog = false;
      },
      getImageSrc(img) {
        return typeof img === "string" ? img : URL.createObjectURL(img);
      },
      removeImage(index) {
        this.form.gallery.splice(index, 1);
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  