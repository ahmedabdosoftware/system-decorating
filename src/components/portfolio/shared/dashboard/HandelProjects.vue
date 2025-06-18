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
                v-model="searchQuery"
                append-icon="mdi-magnify"
                label="ابحث بعنوان المشروع"
                hide-details
                dense
                solo
                @input="handleSearch"

            ></v-text-field>
                
          </div>
        </div>
        <!-- progress-circular -->
        <div v-if="loading" class="d-flex justify-center my-5">
        <v-progress-circular
            indeterminate
            color="primary"
            size="50"
          ></v-progress-circular>
        </div>

      <!-- 📋 Project List -->
      <v-row>
        <v-col
           v-for="(proj) in projects"
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
              <v-btn icon @click="editProject(proj, proj.id)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon @click="handelDeleteProjects(proj.id)"><v-icon color="red">mdi-delete</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 📄 Pagination -->
      <v-btn
        v-if="!endReached && !loading"
        @click="handelloadMore"
        block color="primary"
        class="mt-4"
        >
        تحميل المزيد
      </v-btn>
  
      <!-- 🔍 View Dialog -->
      <ProjectDialog
        v-if="selectedProject"
        :visible="viewDialog"
        :project="selectedProject"
        :index="selectedIndex"
        :loadingNext="loading"
        @close="viewDialog = false"
        @next="handleNextProject"
        @prev="handlePrevProject"
      />
  
      <!-- 📝 Add/Edit Form Dialog -->
      <v-dialog  v-model="formDialog" max-width="800">
        <v-card style="direction: rtl">
        <v-form ref="formRef">
          <v-card-title>{{ form.id ? 'تعديل مشروع' : 'إضافة مشروع' }}</v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field :rules="[v => !!v || 'هذا الحقل مطلوب']" required  v-model="form.title" label="عنوان المشروع" ></v-text-field>
              <v-text-field :rules="[v => !!v || 'هذا الحقل مطلوب']" v-model="form.subtitle" label="عنوان فرعي" required></v-text-field>
              <v-select :rules="[v => !!v || 'من فضلك أدخل تصنيف المشروع']" :items="services" item-text="name" item-value="name" v-model="form.category" label="التصنيف المشروع مثل مظابخ " outlined dense />
              <v-text-field :rules="[v => !!v || 'من فضلك أدخل موقع المشروع']" v-model="form.location" label="الموقع"></v-text-field>
              <v-textarea   :rules="[v => !!v || 'من فضلك أدخل وصف المشروع']" v-model="form.description" label="الوصف"></v-textarea>
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
             
           <v-text-field
              v-model="newVideoUrl"
              label="روابط فيديوهات (اختياري)"
              prepend-icon="mdi-video"
              :rules="[v => !v || validURL(v) || 'الرابط غير صحيح']"
            />
            <button style="width: 80px; background-color: blue; color: white; margin-bottom: 15px;"  dark @click="addVideo">اضافة الرابط</button>
            <div>
              <label>روابط الفيديو:</label>
              <div v-for="(url, index) in form.videoUrls" :key="index" class="mb-2 flex items-center gap-2">
                <input v-model="form.videoUrls[index]" type="text" placeholder="Video URL" class="input-style" />
                <button @click="removeVideo(index)">❌</button>
              </div>
            </div>

            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="formDialog = false">إلغاء</v-btn>
            <v-btn :loading="saving" color="orange darken-2" dark @click="saveProject">حفظ</v-btn>
          </v-card-actions>
        </v-form>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
<script>
// Store
import { mapState, mapActions } from "pinia";
import { useProjectsStore } from "@/store/portfolio/portfolioData/projects";
import { useServicesStore } from "@/store/portfolio/portfolioData/services";
// Components
import ProjectDialog from "@/components/portfolio/templates/Modern/projects/ProjectDialog.vue";
// mixins
  import textHelpers from "@/mixins/textHelpers";
  import tenantUidMixin from "@/mixins/tenantUidMixin";
export default {
  mixins: [textHelpers,tenantUidMixin],
  components: { ProjectDialog },
  data() {
    return {
      searchQuery: "",
      formDialog: false,
      viewDialog: false,
      selectedProject: null,
      // editedIndex: null,
      selectedIndex: null,

      saving: false,
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
        gallery: [],
        videoUrls: [],
        
      },
      newVideoUrl: '',
      oldCover: null,

    };
  },
  computed: {
   ...mapState(useProjectsStore, ["projects", "loading","endReached"]),
   ...mapState(useServicesStore, ["services"]),
    galleryCounter() {
      return this.form.gallery?.length || 0;
    },

    
  },
  methods: {
    ...mapActions(useProjectsStore, ['fetchProjects',"loadMore","searchProjects","deleteProject", "addProject", "updateProject","uploadImageToImgBB"]),
    ...mapActions(useServicesStore, [
        "fetchServices",
        ]),
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
        gallery: [],
        videoUrls:[],
      };
       this.newVideoUrl= '';
       this.oldCover= '';

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
    editProject(proj,id) {
      
      // this.form = { ...proj,id };
      this.form = {
        ...proj,
        gallery: [...(proj.gallery || [])],
        cover:null,
        id,
      };
      console.log("id",id)
      // this.editedIndex = id
      this.oldCover = proj.cover;
      this.formDialog = true;
    },
   
     // ********** inspection Search **************
      async handleSearch() {

        if (this.searchQuery.trim()) {
            await this.searchProjects(this.tenantUid, this.searchQuery.trim());
        } else {
            await this.fetchProjects(this.tenantUid);
        }
    },

     async handelloadMore() {
        await this.loadMore(this.tenantUid);
    },
    async handelDeleteProjects(id) {
      if (confirm("هل أنت متأكد من حذف الطلب؟")) {
        await this.deleteProject(id);
      }
    },
    viewProject(proj) {
      this.selectedProject = proj;
      this.selectedIndex = this.projects.findIndex(p => p.id === proj.id);
      this.viewDialog = true;
    },
     handleNextProject() {
      if (this.selectedIndex < this.projects.length - 1) {
        this.selectedIndex += 1;
        this.selectedProject = this.projects[this.selectedIndex];
      } else {
        this.handelloadMore(); 
      }
  },
  handlePrevProject() {
    if (this.selectedIndex > 0) {
      this.selectedIndex -= 1;
      this.selectedProject = this.projects[this.selectedIndex];
    }
  },
   async saveProject () {
     const isValid = this.$refs.formRef.validate();
      if (!isValid) return;
      this.saving = true;
      console.log("start")
      try {
        const Project = { ...this.form };
        Project.userId = this.tenantUid;
        Project.keywords = this.generateKeywords(Project.title);
        Project.keywordsService = this.generateKeywords(Project.category);
        let coverURL;
            // ✅ رفع صورة الغلاف - التأكد إن صورة الغلاف موجودة وجديدة (مش رابط)
        if (Project.cover && typeof Project.cover !== "string") {
          coverURL = await this.uploadImageToImgBB(Project.cover);
        } else if (typeof Project.cover === "string" || this.oldCover) {
          // لو صورة الغلاف رابط محفوظ مسبقاً نستخدمه
          coverURL =this.oldCover;
        } else {
          // لو مفيش صورة غلاف نهائيًا
          coverURL = null;
        }

        Project.cover = coverURL;
        console.log("after upload cover",Project)

        // ✅ رفع صور المعرض
        const galleryURLs = [];
        if (Project.gallery && Project.gallery.length > 0) {
          for (const img of Project.gallery) {
            if (typeof img === "string") {
              // الصورة موجودة مسبقًا كرابط (مش صورة جديدة)
              galleryURLs.push(img);
            } else if (img instanceof File) {
              // الصورة جديدة من نوع File - نرفعها
              const uploadedURL = await this.uploadImageToImgBB(img);
              galleryURLs.push(uploadedURL);
            } else {
              // حالة غير متوقعة، ممكن تتجاهل أو تعطي تحذير هنا
              console.warn("صورة غير صالحة في المعرض:", img);
            }
          }
        } else {
          console.warn("لا توجد صور في المعرض للرفع");
        }
        console.log("after upload images")
        // console.log("before: this.editedIndex",this.editedIndex)

        Project.gallery = galleryURLs;

        if (Project.id) {
          await this.updateProject(Project);
        } else {
          await this.addProject(Project);
        }
        console.log("after add / edit")

        this.formDialog = false;
        this.resetForm();

      } catch (err) {
        console.error("فشل حفظ المشروع:", err);
      } finally {
        this.saving = false;
      }
    },

    getImageSrc(img) {
      return typeof img === "string" ? img : URL.createObjectURL(img);
    },
    removeImage(index) {
      this.form.gallery.splice(index, 1);
    },
    addVideo() {
      if (this.newVideoUrl && this.validURL(this.newVideoUrl)) {
        this.form.videoUrls.push(this.newVideoUrl);
        this.newVideoUrl = '';
      }
    },
    removeVideo(index) {
        this.project.videoUrls.splice(index, 1)

    },
    validURL(value) {
      const pattern = /^(https?:\/\/)?(www\.)?([^\s.]+\.[^\s]{2,}|localhost[:?\d]*)\S*$/;
      return pattern.test(value);
    },
    
  },
   
  watch: {
      tenantUid(newVal) {
      if (newVal) {
        console.log("userId", newVal);
        this.fetchProjects(newVal);
        this.fetchServices(newVal);
      }
    },
    searchQuery: function () {
      this.handleSearch(this.tenantUid,this.searchQuery);
    }
  },
  
};
</script>

  
<style scoped>
</style>
  