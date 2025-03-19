<template>
  <!-- /* eslint-disable */ -->
  <div class="Purchases">
    <div class="title">
      <div>
        <div>
          <Breadcrumb :breadcrumbs="breadcrumbs" />
          <!-- <div class="contTitle">
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU"
              />
            </div>
            <p :class="{ 'dark-mode-title': getDarkMode }">AddPurchase grid</p>
          </div> -->
        </div>
        <div>
          <div>
            <div class="export">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
              />
              <button>export</button>
            </div>
            <router-link to="/dashboard/AddPurchase">
              <button class="add">+ add Purchase</button>
            </router-link>
          </div>
        </div>
      </div>

      <div :class="{ 'dark-mode-box': getDarkMode }" class="filter_by_search">
        <div class="">
          <input
            :class="{ 'dark-mode-search': getDarkMode }"
            placeholder="search"
            type="search"
            v-model="searchQuery"
          />
          <select placeholder="filter" class="filter" v-model="selectedFilter">
            <option value="date">date</option>
            <option value="adress">Supplier</option>
            <option value="selectedBranch">branch</option>
          </select>
        </div>
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <div>
            <select placeholder="filter" class="filter" v-model="selectStatus">
              <option value="all">الكل</option>
              <option value="0">مدفوع</option>
              <option value="1">اجل</option>
            </select>
          </div>
          <div>
            <button>last aded</button>
            <img
              class="arroow aded"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_HHn9uGD0sPLHcGzdjI_WX8Au22ap-x1b1Q&usqp=CAU"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="{ 'dark-mode-box': getDarkMode }" class="allContent">
      <TableSkeleton v-if="isLoading" :rows="5" :columns="6" />
      <ListTable
        v-else-if="getPurchases.length > 0"
        :purchases="getPurchases"
        class="ListTable_cont"
      ></ListTable>
      <NoData v-else context="purchases"></NoData>
    </div>
    <div id="scrollUp" class="scrollUp">
      <!-- <img
        /> -->
    </div>
  </div>
</template>
<script>
// actions
import { mapState, mapActions } from "pinia";
//store
import { usePurchasesStore } from "@/store/purchases/purchase.js";

// ListTable
import ListTable from "@/components/purchases/ListTable.vue";

// Skeleton Table
import TableSkeleton from "@/shared/components/loading/skeletonLoader/TableSkeleton.vue";

// NoData
import NoData from "@/shared/components/noData/NoData.vue";

// Breadcrumb
import Breadcrumb from "@/shared/components/breadcrumb/Breadcrumb.vue";

export default {
  name: "Purchase",
  components: {
    ListTable,
    NoData,
    TableSkeleton,
    Breadcrumb,
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },

    ...mapState(usePurchasesStore, ["purchases"]),

    // ============ filter => start=======================================

    getPurchases() {
      let filteredPurchases = this.purchases;

      // فلترة حسب الحالة
      if (this.selectStatus !== "all") {
        filteredPurchases = filteredPurchases.filter(
          (purchase) => purchase.status == this.selectStatus
        );
      }

      // البحث
      if (this.searchQuery) {
        filteredPurchases = filteredPurchases.filter((purchase) => {
          const valueToSearch = purchase[this.selectedFilter]
            .toString()
            .toLowerCase();
          console.log(purchase[this.selectedFilter].toString().toLowerCase());
          return valueToSearch.includes(this.searchQuery.toLowerCase());
        });
      }

      return filteredPurchases;
    },
    // ============ filter => end=======================================
  },
  async created() {
    await this.fetchPurchases();
    this.isLoading = false;
  },
  methods: {
    // ============ my actions => start=======================================

    ...mapActions(usePurchasesStore, ["fetchPurchases"]),

    // ============ my actions => end==========================================
  },
  data() {
    return {
      searchQuery: "",
      selectStatus: "all",
      selectedFilter: "date",
      isLoading: true,
      breadcrumbs: [
        { label: "Dashboard", link: "/dashboard" },
        { label: "Purchases", link: "/dashboard/Purchases" },
        // { label: "Create Order", link: "/dashboard/AddNewOrder" }
      ],
    };
  },
};
</script>
<style scoped lang="scss">
.Purchases {
  // background-color: aqua;
  display: flex;
  flex-wrap: wrap;
}

.contTitle {
  background-color: blue;
}
.arroow {
  width: 15px;
  height: 15px;
}

.allContent {
  width: 96%;
  min-height: 400px;
  background-color: white;
  margin-bottom: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  margin-left: 4%;
}
.allContent > div {
  width: 100%;
  height: 400px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.add {
  width: 140px;
  height: 40px;
  background-color: blue;
  cursor: pointer;
  // margin-left: 80%;
  // margin-top: 60px;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  text-transform: capitalize;
  color: white;
}
.add::first-letter {
  font-weight: 500;
  font-size: 19px;
}

@media (max-width: 477px) {
}
</style>
