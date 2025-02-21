<template>
    <!-- /* eslint-disable */ -->
    <div class="optionWraper">
        <OptionCard v-if="getRole== 'technical'">
            <template #iconLetter>
                <span class="letter_icon_option">E</span>
            </template>
            <template #optionTitle>
                Employee
            </template>

            <template #optionRouterLink>
                <router-link to="/"> &rarr; </router-link>
            </template>
        </OptionCard>
        <OptionCard :layout="getRole!= 'technical'? 'row' :'column'">
            <template #iconLetter>
                <span class="letter_icon_option">  {{ getRole== 'technical' ? "T" :"M" }}</span>
            </template>
            <template #optionTitle>
              {{ getRole== 'technical' ? "Transiction" :"More Than Place" }}  
            </template>
            <template v-if="getRole !='technical'" #optionLinkText>
                Like Location
            </template>
            <template #optionRouterLink>
                <router-link :to="generateRoute('RandomFinancial')"> &rarr; </router-link>
            </template>
        </OptionCard>
        <OptionCard  layout="row" v-if="getRole !='technical'">
            <template #iconLetter>
                <span class="letter_icon_option">O  </span>
            </template>
            <template #optionTitle>
                One Place
            </template>
            <template #optionLinkText>
                Like department
            </template>
            <template #optionRouterLink>
                <router-link :to="generateRoute('ListOfTransaction')"> &rarr; </router-link>
            </template>
        </OptionCard>
        <OptionCard v-if="getRole== 'technical'">
            <template #iconLetter>
                <span class="letter_icon_option">E</span>
            </template>
            <template #optionTitle>
                expenses
            </template>
            <template #optionRouterLink>
                <router-link to="/"> &rarr; </router-link>
            </template>
        </OptionCard>


    </div>
  </template>
  

  <script>

  // stores
  import { useGetUserStore } from '@/store/users/users.js';
  import { mapActions } from "pinia";
  // componnents
import OptionCard from "@/components/users/financial/mainPage/optionTransaction/OptionCard.vue";

  export default {
    name: "Transactions",
    components: { 
        OptionCard,
  },
    computed: {
     getRole(){
      if(this.userInfo){
        return this.userInfo.role
      } else{
        return ""
      }
    }
   
    },
  
    methods: {
        ...mapActions(useGetUserStore, ['fetchSingleUser']),
        generateRoute(section) {
        const layout = this.$route.meta.layout;

        if (layout === 'DashboardLayout') {
            
            return `/dashboard/profile/${this.profileId}/${section}`;
        } else if (layout === 'profileInDashboardLayout') {
            return `/dashboard/profile/${this.profileId}/${section}`;
        } else if (layout === 'profileOutDashboardLayout') {
            return `/profile/${this.profileId}/${section}`;
        }
    },

    
      
    },
    data() {
      return {
        profileId:null,
        userInfo:null,
      };
    },
    async created() {
      this.profileId = this.$route.params.profileId;
      this.userInfo = await this.fetchSingleUser(this.profileId);
      console.log('Fetched user info:', this.userInfo); 
    },
  };
  </script> 
  <style scoped lang="scss">
  .optionWraper{
    margin-top: 30px;
    width: 100%;
    // background-color: #565a5e;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
  
  @media (max-width: 477px) {
    .optionWraper{

      min-height: 100px;
    }
    
   
    }
    @media (max-width: 370px) {
        
    }



  
  </style>
  