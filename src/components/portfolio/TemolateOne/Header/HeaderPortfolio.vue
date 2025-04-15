<template>
  <nav class="navbar">
    <!-- اللوجو -->
    <div class="logo logo-portfolio">
      <!-- <img src="@/assets/images/logo.svg" alt="Craftsman" /> -->
      <span style="font-weight: bold; font-size: 19px">Logo</span>
    </div>

    <!-- زر القائمة (يظهر فقط في الشاشات الصغيرة) -->
    <button class="menu-button" @click="toggleSidebar">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>

    <!-- الروابط -->
    <ul class="nav-links">
      <li v-for="link in links" :key="link">{{ link }}</li>
    </ul>

    <!-- الأزرار -->
    <div class="buttons-catalog">
      <button class="request-catalog">Catalog</button>
      <button class="add-button">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
      <v-avatar size="50" class="avatar">
        <img src="https://i.pravatar.cc/300" alt="User Avatar" />
      </v-avatar>
    </div>

    <!-- السايدبار -->
    <div class="sidebar-portfolio" :class="{ 'sidebar-open': isSidebarOpen }">
      <!-- هيدر السايدبار -->
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/images/logo.svg" alt="Craftsman" />
        </div>
        <button class="close-button" @click="toggleSidebar">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <ul>
        <li v-for="link in links" :key="link" @click="toggleSidebar">
          {{ link }}
        </li>
      </ul>
    </div>

    <!-- الـ Overlay عند فتح السايدبار -->
    <div class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      links: ["Moonst", "Cuotioos", "Faltcos", "Bolps", "Doctiors"],
      isSidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
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
  background-color: #f57c00;
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
    display: block; /* يظهر زر القائمة في الشاشات الصغيرة */
  }
}
</style>
