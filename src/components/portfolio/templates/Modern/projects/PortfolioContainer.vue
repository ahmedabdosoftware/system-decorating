<template>
  <div class="portfolio-section pa-5">
    <div
      class="portfolio-header d-flex justify-space-between align-center mb-4"
    >
      <h2 class="font-weight-bold">Portfolio</h2>
      <div class="custom-select">
        <select v-model="selectedCategory">
          <option value="All">All</option>
          <option
            v-for="(cat, index) in uniqueCategories"
            :key="index"
            :value="cat"
          >
            {{ cat }}
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
          <portfolio-card :project="project" @open="openDialog(index)" />
        </v-col>
      </v-row>
    </v-container>

    <project-dialog
      :visible="dialog"
      :project="selectedProject"
      @close="dialog = false"
      @next="nextProject"
      @prev="prevProject"
    />
  </div>
</template>

<script>
import PortfolioCard from "@/components/portfolio/templates/Modern/projects/PortfolioCard.vue";
import ProjectDialog from "@/components/portfolio/templates/Modern/projects/ProjectDialog.vue";

export default {
  components: {
    PortfolioCard,
    ProjectDialog,
  },
  data() {
    return {
      dialog: false,
      currentIndex: 0,
      selectedCategory: "All",
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
      ],
    };
  },
  computed: {
    selectedProject() {
      return this.projects[this.currentIndex];
    },
    uniqueCategories() {
      const all = this.projects.map((p) => p.category);
      return [...new Set(all)];
    },
  },
  methods: {
    openDialog(index) {
      this.currentIndex = index;
      this.dialog = true;
    },
    nextProject() {
      if (this.currentIndex < this.projects.length - 1) this.currentIndex++;
    },
    prevProject() {
      if (this.currentIndex > 0) this.currentIndex--;
    },
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
