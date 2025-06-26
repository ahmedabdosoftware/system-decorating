<template>
  <nav class="navbar" :class="{ 'custom-theme': isCustomTheme }">
    <!-- logo -->
    <div class="logo logo-portfolio">

      <img :src="logoUrl" alt="Craftsman" />
      <!-- <span style="font-weight: bold; font-size: 19px">Logo</span> -->
    </div>

    <!-- menue Borger-->
    <button class="menu-button" @click="toggleSidebar">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>

    <!-- nav-links -->
    <ul class="nav-links">
      <li v-for="link in links" :key="link.name" @click="scrollToSection(link.target)">
        {{ link.name }}
      </li>
    </ul>


    <!-- buttons -->
    <div class="buttons-catalog">
      <button @click="scrollToSection('request-section')" class="request-catalog" :style="{ backgroundColor: settings.primaryColor || '#f57c00' }"> {{ $t("header.request") }}</button>
      <button
        @click="isAdmin ? dialog = true : null"
        class="add-button"
        :style="{ visibility: isAdmin ? 'visible' : 'hidden', width: !isAdmin ? '30px':'' }"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>

      <!-- Catalog -->
      <Catalog-dialog :visible="dialogCatalog" @close="dialogCatalog = false" />
      <v-avatar size="50" class="avatar">
        <img :src="logoUrl" alt="User Avatar" />
      </v-avatar>
    </div>

    <!-- sidebar -->
    <div class="sidebar-portfolio" :class="{ 'sidebar-open': isSidebarOpen }">
      <!-- هيدر السايدبار -->
      <div class="sidebar-header">
        <div class="logo">
          <img :src="logoUrl" alt="Craftsman" />
        </div>
        <button class="close-button" @click="toggleSidebar">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <ul>
        <li v-for="link in links" :key="link.name" @click="scrollToSection(link.target); toggleSidebar()">
          {{ link.name }}
        </li>
      </ul>

    </div>

    <!--  Overlay -->
    <div class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>
    <dashboard-tem :visible="dialog" @close="dialog = false" />

  </nav>
</template>

<script>
// Stores
import { mapState } from "pinia";
import { useUserStore } from "@/store/auth/auth";
import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

// Components
import dashboardTem from "@/components/portfolio/shared/dashboard/dashboardTem.vue";
import CatalogDialog from "@/components/portfolio/templates/Modern/catalog/CatalogDialog.vue";

export default {
    props: {
    isCustomTheme: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    
    return {
     links: [
      { name: this.$t("header.navbar.services"), target: "services-section" },
      { name: this.$t("header.navbar.portfolio"), target: "portfolio-section" },
      { name: this.$t("header.navbar.request"), target: "request-section" },
      { name: this.$t("header.navbar.contact"), target: "contact-section" },
    ],
      isSidebarOpen: false,
      dialog: false,
      dialogCatalog: false,

    };
  },
   computed: {
      ...mapState(useUserStore, ["isAdmin"]),
      ...mapState(useTemplateSettingsStore, ["settings"]),
      logoUrl() {
          return this.settings?.logo || require("@/assets/images/logo.svg");
        }
    },
  components: {
    dashboardTem,
    CatalogDialog,
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
     scrollToSection(target) {
      if (target === "contact-section" && this.settings.whatsappNumber) {
        const cleanedNumber = this.settings.whatsappNumber.replace(/[^+\d]/g, "");
        window.open(`https://wa.me/${cleanedNumber}`, '_blank');
        return;
      }
      
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
  }
  },
};
</script>

<style scoped>
/* الأساسيات */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  background-color: #edebe9;
  /* position: sticky; */
  width: 100%;
  height: 100px;
}
.navbar.custom-theme {
  background: #fff ;
}
.avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.logo img {
  height: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-links li {
  font-size: 16px;
  cursor: pointer;
}

.buttons-catalog {
  display: flex;
  align-items: center;
  padding: 20px;
}

.request-catalog {
  /* background-color: #f57c00; */
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  width: 120px;
  height: 35px;
}

.add-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

/* زر القائمة (يظهر فقط في الشاشات الصغيرة) */
.menu-button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  display: none; /* يخفي الزر في الشاشات الكبيرة */
}

/* السايدبار */
.sidebar-portfolio {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 110vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 2001;
  padding-top: 10px;
}

/* فتح السايدبار */
.sidebar-open {
  right: 0;
}

/* هيدر السايدبار */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.sidebar-header .logo img {
  height: 35px;
}

/* زر الإغلاق */
.close-button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

/* الروابط داخل السايدبار */
.sidebar-portfolio ul {
  list-style: none;
  padding: 0;
}

.sidebar-portfolio li {
  font-size: 18px;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

/* الـ Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* جعل التصميم متجاوب */
@media (max-width: 768px) {
  .nav-links,
  .logo-portfolio {
    display: none;
  }

  .menu-button {
    display: block; 
  }
}

</style>
