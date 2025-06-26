<template>
  <footer class="footer">
    <v-container>
      <v-row class="footer-top" no-gutters>
        <!-- Column 1 -->
        <v-col cols="12" md="4" class="mb-6">
          <h3 class="footer-title">{{ settings?.heroTitle ||  $t('footer.businessTitle')}}</h3>
          <p class="footer-desc">
            {{ settings?.heroDescription ||$t('footer.businessDesc') }}
          </p>
          <div class="footer-socials">
            <a
              v-if="settings?.socialLinks?.facebook"
              :href="settings.socialLinks.facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon small class="mr-2" color="amber lighten-2">mdi-facebook</v-icon>
            </a>

            <a
              v-if="settings?.socialLinks?.instagram"
              :href="settings.socialLinks.instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon small class="mr-2" color="amber lighten-2">mdi-instagram</v-icon>
            </a>

            <a
              v-if="settings?.socialLinks?.pinterest"
              :href="settings.socialLinks.pinterest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon small class="mr-2" color="amber lighten-2">mdi-pinterest</v-icon>
            </a>

            <a
              v-if="settings?.socialLinks?.website"
              :href="settings.socialLinks.website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon small class="mr-2" color="amber lighten-2">mdi-web</v-icon>
            </a>
          </div>
          <div class="footer-contact mt-3">
            <p v-if="settings?.email">
                <v-icon small class="mr-1" color="amber darken-2">mdi-email</v-icon>
                {{ settings.email }}
            </p>
            <p v-if="settings?.phoneNumber">
                <v-icon small class="mr-1" color="amber darken-2">mdi-phone</v-icon>
                {{ settings.phoneNumber }}
            </p>
            <p v-if="settings?.showWhatsApp && settings?.whatsappNumber">
                <v-icon small class="mr-1" color="amber darken-2">mdi-whatsapp</v-icon>
                {{ settings.whatsappNumber }}
            </p>
          </div>
        </v-col>

        <!-- Column 2 -->
        <v-col cols="12" md="4" class="mb-6">
          <h4 class="footer-heading">{{ $t('footer.quickLinks') }}</h4>
          <ul class="footer-links">
            <li><a href="#"><span>›</span> {{ $t('footer.links.services') }}</a></li>
            <li><a href="#"><span>›</span> {{ $t('footer.links.portfolio') }}</a></li>
            <li><a href="#"><span>›</span> {{ $t('footer.links.about') }}</a></li>
            <li><a href="#"><span>›</span> {{ $t('footer.links.testimonials') }}</a></li>
            <li><a href="#"><span>›</span> {{ $t('footer.links.blog') }}</a></li>
            <li><a href="#"><span>›</span> {{ $t('footer.links.contact') }}</a></li>
          </ul>
        </v-col>

        <!-- Column 3 -->
        <v-col cols="12" md="4" class="mb-6">
          <h4 class="footer-heading">{{ $t('footer.businessHours') }}</h4>
        <ul class="footer-hours">
          <li v-for="(item, index) in settings?.businessHours || []" :key="index">
            <span>{{ item.day }}:</span>
            <span>{{ item.from && item.to ? `${item.from} – ${item.to}` : item.to }}</span>
          </li>
        </ul>
          <div v-if="settings?.location" class="footer-location mt-4">
            <strong>{{ $t('footer.workshopLocation') }}</strong>
            <p>{{ settings.location }}</p>
            <p class="footer-payment">
              <span class="text-warning">{{ $t('footer.paymentMethods') }}</span>
              <v-icon small class="ml-1" color="amber lighten-2"
                >mdi-credit-card</v-icon
              >
              <v-icon small class="ml-1" color="amber lighten-2"
                >mdi-credit-card-outline</v-icon
              >
              <v-icon small class="ml-1" color="amber lighten-2"
                >mdi-paypal</v-icon
              >
            </p>
          </div>
        </v-col>
      </v-row>

      <v-divider class="mb-4"></v-divider>

      <v-row class="footer-bottom" justify="space-between" align="center">
        <p class="text-caption mb-0">
           {{ $t('footer.copyRight') }}
        </p>
        <div class="footer-policy text-caption">
          <a href="#" class="mr-4">{{ $t('footer.privacyPolicy') }}</a>
          <a href="#" class="mr-4">{{ $t('footer.termsOfService') }}</a>
          <a href="#">{{ $t('footer.sitemap') }}</a>
        </div>
      </v-row>
    </v-container>
  </footer>
</template>

<script>
// Stores
import { mapState } from "pinia";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

export default {
  data() {
    return {
    };
  },
   computed: {
      ...mapState(useTemplateSettingsStore, ["settings"]),
      logoUrl() {
          return this.settings?.logo || require("@/assets/images/logo.svg");
        }
    },

};
</script>

<style scoped>
.footer {
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 60px 0 30px;
  font-family: "Segoe UI", sans-serif;
}

.footer-title {
  font-weight: bold;
  font-size: 20px;
  color: white;
  margin-bottom: 12px;
  text-align: start !important;
}

.footer-desc {
  color: #94a3b8;
  font-size: 14px;
}

.footer-socials v-icon {
  color: white;
  cursor: pointer;
}

.footer-contact p {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 4px 0;
}

.footer-contact v-icon {
  margin-right: 6px;
}

.footer-heading {
  font-weight: bold;
  font-size: 16px;
  color: white;
  margin-bottom: 10px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li a {
  text-decoration: none;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
  color: white;
}
.footer-links li a span {
  color: #fbbf24;
}

.footer-hours {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.footer-hours li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.footer-location p {
  margin: 6px 0;
  font-size: 14px;
}

.footer-payment {
  font-size: 14px;
  margin-top: 8px;
}

.footer-bottom {
  padding-top: 20px;
  font-size: 12px;
  color: #94a3b8;
}

.footer-policy a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.footer-policy a:hover {
  text-decoration: underline;
}
</style>
