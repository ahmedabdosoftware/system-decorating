<template>
    <div class="services-section pa-5">
      <h2 class="font-weight-bold mb-4">Services</h2>
      <div>
        <div v-for="service in services"
         :key="service.id" 
         class="mb-4 service-card-cont"
         style="border-radius: 12px !important; background-color: #f3f4f6; "

         >
          <ServiceCard
            :title="service.title"
            :price="service.price"
            :icon="service.icon"
            @click="toggleService(service.id)"
          />
  
         <!-- service-details-box-->
         <div v-show="expandedServiceId === service.id" class="service-details-box">
            <div class="details-layout">
                <!-- main-content-->
                <div class="main-content">
                <!-- Description -->
                <h3 class="section-title">Service Description</h3>
                <p class="mb-4">
                    Our {{ service.title }} service provides comprehensive installation and maintenance for all your kitchen needs.
                    We specialize in custom solutions that blend functionality with aesthetic appeal.
                </p>

                <!-- benefits -->
                <ul class="benefits mb-4">
                    <li>
                    <v-icon color="orange" small>mdi-check-circle</v-icon>
                    Professional installation by certified technicians
                    </li>
                    <li>
                    <v-icon color="orange" small>mdi-check-circle</v-icon>
                    Premium materials and components
                    </li>
                    <li>
                    <v-icon color="orange" small>mdi-check-circle</v-icon>
                    2-year warranty on all installations
                    </li>
                </ul>

                <!-- Installation Details -->
                <h3 class="section-title">Installation Details</h3>
                <div class="install-box mb-4">
                    <strong>Standard Installation</strong>
                    <p class="mb-0">Includes basic setup and configuration</p>
                    <p class="install-price">$299</p>
                </div>

                <!-- Additional Specs -->
                <h3 class="section-title">Additional Specifications</h3>
                <ul class="specs-list mb-4">
                    <li><span>Viotic installation</span><span class="service-price">$150</span></li>
                    <li><span>Wood alternative installation</span><span class="service-price">$275</span></li>
                    <li><span>GBR details</span><span class="service-price"> <strong>Included</strong></span></li>
                </ul>
                </div>

                <!-- highlights-box-->
                <div class="side-box">
                <div class="highlights-box">
                    <h3 class="section-title mb-3">Service Highlights</h3>
                    <ul class="highlight-points mb-3">
                    <li><v-icon left color="orange" small>mdi-timer</v-icon> Average completion time: 4–6 hours</li>
                    <li><v-icon left color="orange" small>mdi-calendar</v-icon> Scheduling available 7 days a week</li>
                    <li><v-icon left color="orange" small>mdi-tools</v-icon> All tools and materials provided</li>
                    </ul>

                    <div class="limited-offer-box">
                    <h4>Limited Time Offer</h4>
                    <p>Book before April 30, 2025 and receive a 15% discount on all {{ service.title }} installations.</p>
                    <v-btn class="limited-offer-btn" color="orange" dark small>Claim Offer</v-btn>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ServiceCard from '@/components/portfolio/TemolateOne/services/ServiceCard.vue'
  
  export default {
    components: { ServiceCard },
    data() {
      return {
        expandedServiceId: null,
        services: [
          {
            id: 1,
            title: "Badel Khaship",
            price: "20 جنيه / متر",
            icon: "mdi-saw-blade",
            description: "خدمة بديل الخشب عالية الجودة",
            supervisor: "م. أحمد علي",
            location: "القاهرة"
          },
          {
            id: 2,
            title: "Futec",
            price: "25 جنيه / متر",
            icon: "mdi-wall",
            description: "تركيب ألواح فيوتك للحوائط",
            supervisor: "م. سارة شوقي",
            location: "الجيزة"
          },
          {
            id: 3,
            title: "Gips Board",
            price: "30 جنيه / متر",
            icon: "mdi-ceiling-light",
            description: "جبس بورد للأسقف والحوائط",
            supervisor: "م. مصطفى عادل",
            location: "الإسكندرية"
          },
          {
            id: 4,
            title: "Badel Rokham",
            price: "35 جنيه / متر",
            icon: "mdi-texture-box",
            description: "بديل الرخام لتشطيب الأرضيات والحوائط",
            supervisor: "م. ندى فؤاد",
            location: "طنطا"
          }
        ]
      };
    },
    methods: {
      toggleService(id) {
        this.expandedServiceId = this.expandedServiceId === id ? null : id;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .services-section {
    background: #eeede9;
  }
  .service-card-cont{
    // border-radius: 12px !important;
    // background-color: red;
  }
  
  .service-details {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    // padding: 16px;
    margin-top: 8px;
    font-size: 15px;
    color: #333;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: 95%;
  }
.service-details-box {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-size: 15px;
  color: #333;
}

/* تقسيم الأعمدة */
.details-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

/* العمود الرئيسي */
.main-content {
  flex: 2;
  min-width: 300px;
}

/* العمود الجانبي */
.side-box {
  flex: 1;
  min-width: 260px;
}

/* العناوين كلها تبقى على الشمال */
.section-title {
  text-align: left;
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: bold;
  color: #444;
}

.benefits li {
  list-style: none;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.install-box {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #eee;
}

.install-price {
  color: #f57c00;
  font-weight: bold;
  margin-top: 4px;
}

.specs-list {
  list-style: none;
  padding: 0;
}
.specs-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.highlights-box {
  background: #f7f9fa;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.highlight-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.limited-offer-box {
  background: #fff3cd;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #f57c00;
  margin-top: 16px;
}

.limited-offer-box h4 {
  margin: 0 0 8px 0;
  color: #b45309;
  font-weight: bold;
}
.limited-offer-btn{
    width: 120px;
}
@media (max-width: 480px){
    .service-price{
    margin-right: 20px;
    }

}
</style>
