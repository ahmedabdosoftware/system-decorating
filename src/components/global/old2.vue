<template>
    <header class="header">
      <!-- Search Input -->
      <div class="search-container">
        <i class="icon-search"></i>
        <input type="text" placeholder="Search" />
        <button class="shortcut">⌘K</button>
      </div>
  
      <!-- Icons Section -->
      <div class="icons-container-header">
        <!-- Regular Icons -->
        <font-awesome-icon icon="store" class="icon" />
        <font-awesome-icon icon="user" class="icon" />
        <font-awesome-icon icon="bell" class="icon" />
        <font-awesome-icon icon="sign-out-alt" class="icon" />
        <font-awesome-icon icon="moon" class="icon" />
        <font-awesome-icon icon="sun" class="icon" />
        
        <!-- Profile Section with Dropdown for Small Screens -->
        <div class="profile" @click="toggleDropdown">
          <img src="https://i.pravatar.cc/300" alt="User Profile" />
          <span class="status-dot"></span>
          <div v-if="dropdownVisible" class="dropdown-menu">
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        </div>
  
        <!-- threeLines -->
        <div class="cont-threeLines">
            <img
              v-on:click="appearMenue()"
              class="threeLines"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDcuD37EZ7RcuSCK-xgiviaswyxNkGoXYggQ&usqp=CAU"
            />
          </div>
       
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "Header",
    data() {
      return {
        dropdownVisible: false,
        isMenuVisible: false,
      };
    },
    methods: {
        appearMenue() {
          document.getElementById("sidebar").style.cssText = "left:0%;";
        },
        toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
        },
        toggleMenu() {
          this.isMenuVisible = !this.isMenuVisible;
        },
      },
      computed: {
        getDarkMode() {
          return this.$store.state.darkMode;
        },
      
      },
   
  };
  </script>
  
  <style scoped>
  /* Header Styling */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color:#f7f7f9;
    border-bottom: 2px solid rgb(215, 213, 213);
    height: 50px;
    position: sticky;
    top: 0px;
    z-index: 2;
    width: 100%; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
    height: 63px;
  }
  
  /* Search Container */
  .search-container {
    display: flex;
    flex-direction: row !important;
    align-items: center !important;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 5px 10px;
    width: 250px;
    margin-right: 15px;
  }
  
  /* Icons Section */
  .icons-container-header {
    display: flex;
    flex-direction: row !important;
    align-items: center !important;
    gap: 15px;
    justify-content: space-evenly;
  }
  
  .icon {
    font-size: 18px;
    color: #6c757d;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .icon:hover {
    color: #343a40;
  }
  
  /* Notification Dot */
  .notification-dot {
    position: absolute;
    top: 0px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: #ff4d4f;
    border-radius: 50%;
  }
  
  /* Profile Section */
  /* .profile {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
  } */
  
  .profile img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: #28a745;
    border: 2px solid #ffffff;
    border-radius: 50%;
  }
  
  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    top: 40px;
    right: 0;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 150px;
    z-index: 1000;
  }
  
  .dropdown-menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .dropdown-menu ul li {
    padding: 10px;
    cursor: pointer;
    text-align: left;
  }
  
  .dropdown-menu ul li:hover {
    background-color: #f1f3f5;
  }
  
  /* Dropdown Menu for Small Screens (Hamburger) */
  .dropdown-menu-mobile {
    position: absolute;
    top: 40px;
    right: 0;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 150px;
    z-index: 1000;
  }
  
  .dropdown-menu-mobile ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .dropdown-menu-mobile ul li {
    padding: 10px;
    cursor: pointer;
    text-align: left;
  }
  
  .dropdown-menu-mobile ul li:hover {
    background-color: #f1f3f5;
  }
  .cont-threeLines{
      display: none;
    }
  /* Media Queries for Responsive Design */
  @media (max-width: 768px) {
    .header {
      width: 100%;
  
    }
    .cont-threeLines{
        display: block;
      }
    .search-container {
      /* width: 100%; */
      margin-bottom: 10px;
    }
  
    .icons-container-header {
      gap: 10px;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
  
    .icon {
      display: none;
    }
  
    .icon-bell,
    .icon-user,
    .icon-store,
    .icon-sign-out-alt,
    .icon-moon,
    .icon-sun {
      display: none;
    }
  
    .icon-bars {
      display: block;
    }
  }
  </style>
  