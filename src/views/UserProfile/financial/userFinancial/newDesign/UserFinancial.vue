<template>
  <!-- /* eslint-disable */ -->
  <div class="page transactions">
    <OptionWraper />
    <GlobalInfoWraper />
  </div>
</template>

<script>
//store
//   import { mapState, mapActions } from 'pinia'
//   import { useTransactionsStore } from '@/store/transactions/transactions.js';
//   import { useUserStore } from '@/store/auth/auth.js';

// componnents
import OptionWraper from "@/components/users/financial/mainPage/optionTransaction/OptionWraper.vue";
import GlobalInfoWraper from "@/components/users/financial/mainPage/globalInfo/GlobalInfoWraper.vue";

export default {
  name: "Transactions",
  components: {
    OptionWraper,
    GlobalInfoWraper,
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    //   ...mapState(useTransactionsStore, ['userTransactions']),

    //   ...mapState(useUserStore, ['isAdmin']),
  },
  async created() {
    this.profileId = this.$route.params.profileId;
    //   await this.fetchTransactionsByUserId(this.profileId );
    //   this.isLoading = false;
  },
  methods: {
    //   ...mapActions(useTransactionsStore, ['fetchTransactionsByUserId']),
    generateRoute(section) {
      const layout = this.$route.meta.layout;

      if (layout === "DashboardLayout") {
        return `/dashboard/profile/${this.profileId}/${section}`;
      } else if (layout === "profileInDashboardLayout") {
        return `/dashboard/profile/${this.profileId}/${section}`;
      } else if (layout === "profileOutDashboardLayout") {
        return `/profile/${this.profileId}/${section}`;
      }
    },
  },
  data() {
    return {
      profileId: null,
      isLoading: true,
    };
  },
};
</script>
<style scoped lang="scss">
@media (max-width: 477px) {
}
@media (max-width: 370px) {
}
</style>
