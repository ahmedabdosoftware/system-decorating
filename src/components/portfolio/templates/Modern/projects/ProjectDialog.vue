<template>
  <v-dialog v-model="visible" max-width="960" scrollable>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ project.title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <!-- ✅ Gallery Left -->
            <v-col cols="12" md="6">
              <v-img
                :src="currentImage"
                class="mb-4"
                height="250"
                contain
              ></v-img>

              <v-row dense>
                <v-col v-for="(img, i) in project.gallery" :key="i" cols="4">
                  <v-img
                    :src="img"
                    height="80"
                    contain
                    class="clickable"
                    :class="{ bordered: img === currentImage }"
                    @click="currentImage = img"
                  ></v-img>
                </v-col>
              </v-row>
            </v-col>

            <!-- ✅ Content Right -->
            <v-col cols="12" md="6">
              <v-chip color="amber lighten-4" small class="mb-1">{{
                project.category
              }}</v-chip>
              <v-icon small class="ml-1">mdi-map-marker</v-icon>
              {{ project.location }}

              <p class="mt-2">{{ project.description }}</p>

              <div class="mt-2">
                <strong>Materials Used</strong><br />
                {{ project.materials }}
              </div>

              <div class="mt-2">
                <strong>Project Duration</strong><br />
                {{ project.duration }}
              </div>

              <div class="mt-2">
                <strong>Client Testimonial</strong>
                <v-card class="mt-1 pa-2" color="grey lighten-4" outlined>
                  <em>"{{ project.testimonial }}"</em>
                  <br />
                  <strong>— {{ project.client }}</strong>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-space-between">
        <v-btn class="Previous" color="grey" @click="$emit('prev')"
          >Previous</v-btn
        >
        <v-btn color="orange darken-1" dark @click="$emit('next')">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    project: Object,
  },
  data() {
    return {
      currentImage: null,
    };
  },
  watch: {
    project: {
      handler(newVal) {
        this.currentImage = newVal?.cover || "";
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
  transition: 0.2s;
}
.clickable:hover {
  opacity: 0.8;
}
.bordered {
  /* border: 2px solid orange; */
  border-radius: 4px;
}
.Previous {
  width: 90px !important;
  color: white !important;
}
</style>
