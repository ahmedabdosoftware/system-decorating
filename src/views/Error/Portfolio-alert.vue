<template>
  <div class="subscription-invalid">
    <h1>🚫 عذرًا، لا يمكن عرض البورتفوليو</h1>

    <p v-if="!isAdmin">
      الاشتراك الخاص بهذه الشركة غير مفعل، أو انتهت صلاحيته، أو لا يسمح بعرض البورتفوليو.
    </p>

    <div v-else>
      <p>انتهت صلاحية اشتراك البورتفوليو الخاص بك.</p>
      <p>يرجى التواصل مع المسؤول لتجديد الاشتراك عبر الواتساب:</p>
      <a
        href="https://wa.me/1152449706"
        target="_blank"
        class="whatsapp-link"
      >
        💬 تواصل معنا الآن
      </a>
    </div>

  </div>
</template>

  <script>
  // Stores
  import { mapState } from "pinia";
  import { useUserStore } from "@/store/auth/auth";
  export default {
    name: "SubscriptionInvalid",
     computed: {
      ...mapState(useUserStore, ["isAdmin"]),
    
    },
  };
  </script>
  
  <style scoped>
  .subscription-invalid {
    text-align: center;
    padding: 4rem 1rem;
    max-width: 600px;
    margin: auto;
  }
  
  .subscription-invalid h1 {
    color: #c0392b;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .subscription-invalid p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .back-home {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #3498db;
    color: white;
    border-radius: 5px;
    text-decoration: none;
  }
  .whatsapp-link {
  display: inline-block;
  margin-top: 10px;
  padding: 0.6rem 1.2rem;
  background-color: #25d366;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

  </style>
  