<template>
  <footer class="footer">
    <v-container>
      <v-row class="footer-top" no-gutters>
        <!-- Column 1 -->
        <v-col cols="12" md="4" class="mb-6">
          <h3 class="footer-title">John Carpenter</h3>
          <p class="footer-desc">
            Master craftsman specializing in custom woodworking, furniture
            design, and restoration services.
          </p>
          <div class="footer-socials">
            <v-icon small class="mr-2" color="amber lighten-2"
              >mdi-facebook</v-icon
            >
            <v-icon small class="mr-2" color="amber lighten-2"
              >mdi-instagram</v-icon
            >
            <v-icon small class="mr-2" color="amber lighten-2"
              >mdi-pinterest</v-icon
            >
            <v-icon small class="mr-2" color="amber lighten-2">mdi-home</v-icon>
          </div>
          <div class="footer-contact mt-3">
            <p>
              <v-icon small style="margin-right: 6px" color="amber darken-2"
                >mdi-email</v-icon
              >
              john@carpentercrafts.com
            </p>
            <p>
              <v-icon small style="margin-right: 6px" color="amber darken-2"
                >mdi-phone</v-icon
              >
              (555) 123-4567
            </p>
          </div>
        </v-col>

        <!-- Column 2 -->
        <v-col cols="12" md="4" class="mb-6">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li>
              <a href="#"> <span>›</span> Services</a>
            </li>
            <li>
              <a href="#"> <span>›</span> Portfolio</a>
            </li>
            <li>
              <a href="#"> <span>›</span> About Me</a>
            </li>
            <li>
              <a href="#"> <span>›</span> Testimonials</a>
            </li>
            <li>
              <a href="#"> <span>›</span> Blog</a>
            </li>
            <li>
              <a href="#"> <span>›</span> Contact</a>
            </li>
          </ul>
        </v-col>

        <!-- Column 3 -->
        <v-col cols="12" md="4" class="mb-6">
          <h4 class="footer-heading">Business Hours</h4>
          <ul class="footer-hours">
            <li><span>Monday - Friday:</span><span>9:00 AM – 6:00 PM</span></li>
            <li><span>Saturday:</span><span>10:00 AM – 4:00 PM</span></li>
            <li><span>Sunday:</span><span>Closed</span></li>
          </ul>
          <div class="footer-location mt-4">
            <strong>Workshop Location</strong>
            <p>123 Craftsman Way<br />Woodville, CA 90210</p>
            <p class="footer-payment">
              <span class="text-warning">Payment Methods (soon):</span>
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
          © 2025 John Carpenter Woodworks. All rights reserved.
        </p>
        <div class="footer-policy text-caption">
          <a href="#" class="mr-4">Privacy Policy</a>
          <a href="#" class="mr-4">Terms of Service</a>
          <a href="#">Sitemap</a>
        </div>
      </v-row>
    </v-container>
  </footer>
</template>
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
