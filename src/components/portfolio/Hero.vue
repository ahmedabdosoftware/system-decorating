<!-- HeroSection.vue -->
<template>
    <v-container fluid class="hero-section d-flex align-center">
      <v-row class="align-center hero-content">
        <v-col cols="12" md="6" class="hero-text">
          <h1 >Exquisite Décor, Perfect Details</h1>
          <p>We bring artistic touches that blend creativity with quality, using the finest materials like Viotech, wood alternatives, marble, and GRP. With precision and expertise, we turn your vision into a stunning </p>
        <div class="action-container">
          <v-btn class="catalog-btn">Catalog</v-btn>
          <v-avatar size="50" class="avatar">
            <img src="https://i.pravatar.cc/300" alt="User Avatar">
          </v-avatar>
        </div>
        </v-col>
        <v-col cols="12" md="6" class="cont-imag-hero-res">
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style scoped lang="scss">
  .hero-section {
    min-height: 80vh;
    width: 100%;
    background: url('../../assets/portfolio/bci.png') no-repeat;
    background-size: cover;
    background-size: 100% 100% !important; 
    padding: 40px;
    // margin-top: 110px; 
    .hero-content {
    max-width: 1200px;
    margin: auto;
  }

  .hero-text {
    text-align: left;

    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 15px;
    }

    p {
      font-size: 1rem;
      margin-bottom: 20px;
      color: #444;
      max-width: 500px;
      line-height: 1.6;
    }

    .action-container {
      display: flex;
      align-items: center;
      gap: 15px;

      .catalog-btn {
        min-width: 150px;
        height: 40px;
        white-space: nowrap;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        background-color: red;
        border: none;
        border-radius: 30px;
        color: white;
      }

      .avatar {
        border: 2px solid #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      }

  }
  .cont-imag-hero-res{
    // width: 100%;
    display: none;
    height: 300px;
    background: url('../../assets/portfolio/bci.png') no-repeat;
    background-size: cover;
    background-size: 100% 100% !important; 
  }


  }
  // .hero-image {
  //   max-height: 400px;
  // }


  
@media (max-width: 768px) {
  .hero-section {
    padding: 0px;
    .hero-text {
      text-align: center;

      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 0.9rem;
      }
    }
    .action-container {
        justify-content: center;
      }
    .hero-image {
      margin-top: 20px;
    }
  }
}

@media (max-width: 480px) {
  .hero-section {
    background: #edebe9;
    .hero-text {
      h1 {
        font-size: 1.8rem;
      }

      p {
        font-size: 0.85rem;
      }
      
      .action-container {
      gap: 10px;
    }
      .catalog-btn {
        font-size: 0.9rem;
        padding: 8px 16px;
      }
    }

    .hero-image {
      img {
        max-height: 250px;
      }
    }
    .cont-imag-hero-res{
      display: block;
    }
  }
}
  </style>
 
  