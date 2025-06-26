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
            <div class="main-preview mb-4" @click="handleMainClick">
              <v-img
                v-if="currentMedia?.type === 'image'"
                :src="currentMedia?.url"
                height="250"
                contain
              ></v-img>
              <div v-else-if="currentMedia?.type === 'video'" class="video-thumb-main">
                <v-img
                  :src="project.cover"
                  height="250"
                  cover
                ></v-img>
                <div class="video-overlay-main">
                  <v-icon color="white" size="48">mdi-play-circle</v-icon>
                </div>
              </div>
            </div>

             <v-row dense>
              <v-col
                v-for="(item, i) in mediaItems"
                :key="i"
                cols="4"
                class="clickable"
                :class="{ bordered: item.url === currentMedia?.url }"
                @click="currentMedia = item"
              >
                <!-- صورة مصغرة -->
                <v-img
                  v-if="item.type === 'image'"
                  :src="item.url"
                  height="80"
                  contain
                ></v-img>

                <!-- فيديو مصغر -->
              <div
                v-else-if="item.type === 'video'"
                class="video-thumb"
                @click="openVideoInNewTab(item.url)"
              >
                <div class="video-overlay">
                  <v-icon color="white">mdi-play-circle</v-icon>
                </div>
                <v-img
                  :src="project.cover"
                  height="80"
                  cover
                ></v-img>
              </div>
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
                <strong>{{ $t('portfolio.project.materials') }}</strong><br />
                {{ project.materials }}
              </div>

              <div class="mt-2">
                <strong>{{ $t('portfolio.project.duration') }}</strong><br />
                {{ project.duration }}
              </div>

              <div class="mt-2">
                <strong>{{ $t('portfolio.project.testimonial') }}</strong>
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
        <v-btn class="Previous" color="grey" :disabled="!canGoPrev" @click="$emit('prev')"> 
           {{ $t('portfolio.project.previous') }}
        </v-btn>
        <v-btn color="orange darken-1" dark :loading="loadingNext" @click="$emit('next')">
          {{ $t('portfolio.project.next') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    project: Object,
    index: Number,
    loadingNext: Boolean,

  },
  data() {
    return {
    currentMedia: null
    };
  },
  methods: {
  openVideoInNewTab(url) {
    window.open(url, '_blank');
  },
  handleMainClick() {
    if (this.currentMedia?.type === 'video') {
      this.openVideoInNewTab(this.currentMedia.url);
    }
  },
},

 watch: {
  project: {
    handler(newVal) {
      if (newVal?.gallery?.length) {
        this.currentMedia = {
          url: newVal.gallery[0],
          type: 'image'
        };
      } else if (newVal?.videoUrls?.length) {
        this.currentMedia = {
          url: newVal.videoUrls[0],
          type: 'video'
        };
      } else {
        this.currentMedia = null;
      }
    },
    immediate: true
  },
  },
  computed: {
    mediaItems() {
      const images = (this.project.gallery || []).map(url => ({
        url,
        type: 'image'
      }));
      const videos = (this.project.videoUrls || []).map(url => ({
        url,
        type: 'video'
      }));
      return [...images, ...videos];
    },
     canGoPrev() {
    return this.index > 0;
  },
}

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
.video-thumb {
  position: relative;
  cursor: pointer;
  height: 80px;
}
.video-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  padding: 4px;
}
.video-thumb-main {
  position: relative;
  cursor: pointer;
}
.video-overlay-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  padding: 8px;
}

</style>
