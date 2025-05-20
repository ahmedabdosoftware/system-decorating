<template>
  <div class="portfolio-section pa-5">
    <div
      class="portfolio-header d-flex justify-space-between align-center mb-4"
    >
      <h2 class="font-weight-bold">Portfolio</h2>
      <div class="custom-select">
        <select v-model="searchQuery">
          <option value="">All</option>
          <option
            v-for="(service, index) in services"
            :key="index"
            :value="service.name"
          >
            {{ service.name }}
          </option>
        </select>
      </div>
    </div>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="(project, index) in projects"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="mb-4"
        >
          <portfolio-card :project="project" @open="viewProject(project)" />
        </v-col>
      </v-row>
    </v-container>

    <!-- 📄 Pagination -->
      <v-icon
        v-if="!endReached && !loading"
        @click="handelloadMore"
        class="arrow-icon-portfolio down-arrow mt-4"

      >
          mdi-chevron-down
      </v-icon>

      <project-dialog
      v-if="selectedProject"
      :visible="viewDialog"
      :project="selectedProject"
      :index="selectedIndex"
      :loadingNext="loading"
      @close="viewDialog = false"
      @next="handleNextProject"
      @prev="handlePrevProject"
      />
  </div>
</template>

<script>

// Store
import { mapState, mapActions } from "pinia";
import { useProjectsStore } from "@/store/portfolio/portfolioData/projects";
import { useServicesStore } from "@/store/portfolio/portfolioData/services";

// components
import PortfolioCard from "@/components/portfolio/templates/Modern/projects/PortfolioCard.vue";
import ProjectDialog from "@/components/portfolio/templates/Modern/projects/ProjectDialog.vue";

// mixins
import tenantUidMixin from "@/mixins/tenantUidMixin";
import textHelpers from "@/mixins/textHelpers";

export default {
  mixins: [textHelpers,tenantUidMixin],
  components: {
    PortfolioCard,
    ProjectDialog,
  },
  data() {
    return {
      searchQuery: "",
      viewDialog: false,
      selectedProject: null,
      selectedIndex: null,

      // projects: [
      //   {
      //     title: "Modern Kitchen Cabinetry",
      //     subtitle: "Malibu, CA",
      //     cover:
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //     gallery: [
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //     ],
      //     category: "Cabinetry",
      //     location: "Malibu, CA",
      //     description:
      //       "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
      //     materials:
      //       "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
      //     duration: "8 weeks",
      //     testimonial:
      //       "Working with John on our kitchen renovation was a dream...",
      //     client: "David & Sarah Miller, Malibu",
      //   },
      //   {
      //     title: "Modern Kitchen Cabinetry",
      //     subtitle: "Malibu, CA",
      //     cover:
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //     gallery: [
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //     ],
      //     category: "Cabinetry",
      //     location: "Malibu, CA",
      //     description:
      //       "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
      //     materials:
      //       "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
      //     duration: "8 weeks",
      //     testimonial:
      //       "Working with John on our kitchen renovation was a dream...",
      //     client: "David & Sarah Miller, Malibu",
      //   },
      //   {
      //     title: "Modern Kitchen Cabinetry",
      //     subtitle: "Malibu, CA",
      //     cover:
      //       "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
      //     gallery: [
      //       "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/8b8f050bdd9dbca1ffc0553795fb2381.jpg",
      //     ],
      //     category: "Cabinetry",
      //     location: "Malibu, CA",
      //     description:
      //       "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
      //     materials:
      //       "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
      //     duration: "8 weeks",
      //     testimonial:
      //       "Working with John on our kitchen renovation was a dream...",
      //     client: "David & Sarah Miller, Malibu",
      //   },
      //   {
      //     title: "Modern Kitchen Cabinetry",
      //     subtitle: "Malibu, CA",
      //     cover:
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //     gallery: [
      //       "https://public.readdy.ai/ai/img_res/85594205265b80dac205cb4531686a75.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //       "https://public.readdy.ai/ai/img_res/7da2fdbe14c9b3986c0e81c939132017.jpg",
      //     ],
      //     category: "Cabinetry",
      //     location: "Malibu, CA",
      //     description:
      //       "Full kitchen renovation featuring custom maple cabinetry with integrated lighting.",
      //     materials:
      //       "Maple hardwood, satin nickel hardware, LED lighting, polyurethane finish",
      //     duration: "8 weeks",
      //     testimonial:
      //       "Working with John on our kitchen renovation was a dream...",
      //     client: "David & Sarah Miller, Malibu",
      //   },
      // ],
    };
  },
  computed: {
 
   ...mapState(useProjectsStore, ["projects", "loading","endReached"]),
   ...mapState(useServicesStore, ["services"]),
  },
  methods: {
     ...mapActions(useProjectsStore, ['fetchProjects',"loadMore","searchProjectsByService","deleteProject", "addProject", "updateProject","uploadImageToImgBB"]),
    ...mapActions(useServicesStore, [
        "fetchServices",
        ]),
    async handelloadMore() {
        await this.loadMore(this.tenantUid);
    },
     // **********  Search **************
      async handleSearch() {

        if (this.searchQuery.trim()) {
            await this.searchProjectsByService(this.tenantUid, this.searchQuery.trim());
        } else {
            await this.fetchProjects(this.tenantUid);
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

<style lang="scss" scoped>
.portfolio-section {
  background: #eeece9;
  // min-height: 100vh;
}
.portfolio-header {
  select {
    padding: 8px 20px;
    border-radius: 24px;
    border: 1px solid #000;
    background: transparent;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
  }

  .custom-select {
    position: relative;

    &::after {
      content: "›";
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      pointer-events: none;
      color: #000;
    }
  }
}
</style>
