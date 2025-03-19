<template>
  <!-- /* eslint-disable */ -->
  <div class="page technichal">
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
            <p :class="{ 'dark-mode-title': getDarkMode }">order technichal</p>
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
            <router-link to="/dashboard/users/technical/AddTechnical">
              <button class="add font_sm">+ add technichal</button>
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
        </div>
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <div></div>
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

      <UsersList
        v-else-if="filteredUsers.length > 0"
        :users="filteredUsers"
      ></UsersList>

      <NoData v-else context="users"></NoData>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
//  store
import { useGetUserStore } from "@/store/users/users.js";

// NoData
import NoData from "@/shared/components/noData/NoData.vue";

// Skeleton Box
import TableSkeleton from "@/shared/components/loading/skeletonLoader/TableSkeleton.vue";

// UsersList
import UsersList from "@/components/users/UsersList.vue";

// Breadcrumb
import Breadcrumb from "@/shared/components/breadcrumb/Breadcrumb.vue";

export default {
  name: "Category",
  components: {
    NoData,
    UsersList,
    TableSkeleton,
    Breadcrumb,
  },
  data() {
    return {
      searchQuery: "",
      isLoading: true,
      breadcrumbs: [
        { label: "Dashboard", link: "/dashboard" },
        { label: "Technical", link: "users/technical/AddTechnical" },
        // { label: "Create Order", link: "/dashboard/AddNewOrder" }
      ],
    };
  },
  computed: {
    ...mapState(useGetUserStore, ["technicalUsers"]),
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      // just to be more clear code and less time (optmization) but this condition not  nessesry event the query is "empty string" no problem will return all categories
      if (!query) {
        return this.technicalUsers;
      }
      return this.technicalUsers.filter((technicalUser) =>
        technicalUser.name.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    ...mapActions(useGetUserStore, ["fetchUsers"]),
  },
  async created() {
    await this.fetchUsers();
    this.isLoading = false;
  },
};
</script>

<style scoped lang="scss">
.allContent {
  margin-top: 2px;
}

// phone
@media (max-width: 477px) {
  .title--noFilterSearch {
    height: 220px;

    > div:nth-of-type(2) {
      height: 30%;
      input {
        width: 130px;
      }
    }
  }

  .title--noFilterSearch {
    > div:first-child {
      height: 70%;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;

      > div:first-child {
        width: 196px;
        p {
          margin-left: 10px;
          font-size: 16px;
          margin-right: 0px;
        }
      }
      > div:nth-of-type(2) {
        display: flex;
        justify-content: flex-end;
        a {
          margin-left: 20px;
          button {
            width: 140px;
            font-size: 15px;
          }
        }
        align-items: flex-end;
        > div {
          width: 70px;
          button {
            width: 40px;
          }
          img {
            width: 16px;
            height: 16px;
            margin-left: 3px;
            margin-right: 3px;
          }
        }
      }
    }
    > div:nth-of-type(2) {
      margin-left: 4%;

      input {
        margin-left: 4px;
      }
    }
  }
}
</style>
