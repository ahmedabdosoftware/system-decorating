<template>
  <div class="add">
    <div class="add_title">
      <p :class="{ 'dark-mode-title': getDarkMode }">Create Clint</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="add_allContent">
      <div>
        <h3 :class="{ 'dark-mode-title': getDarkMode }">Add Clint</h3>
      </div>
      <ValidationObserver
        class="wraper-form"
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="createNewClint" class="add_allContent_cont-form">
          <div class="cont-form_field Name">
            <ValidationProvider
              name="الاسم الاول"
              rules="required"
              v-slot="{ errors }"
            >
              <label :class="{ 'dark-mode-title': getDarkMode }"
                >Full Name</label
              >
              <input
                v-model="name"
                type="text"
                placeholder="Enter your name"
                required
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="cont-form_field cont-form_field--Password">
            <ValidationProvider
              name=" كلمة السر"
              rules="required"
              v-slot="{ errors }"
            >
              <label :class="{ 'dark-mode-title': getDarkMode }"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                placeholder="Enter your password"
                required
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="cont-form_field cont-form_field--Number">
            <ValidationProvider
              name=" رقم التليفون"
              rules="required|digits:11"
              v-slot="{ errors }"
            >
              <label :class="{ 'dark-mode-title': getDarkMode }">Number</label>
              <input
                v-model="number"
                type="number"
                placeholder="Enter your number"
                required
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="cont-form_field cont-form_field--Email">
            <ValidationProvider
              name="الايميل"
              rules="required|email"
              v-slot="{ errors }"
            >
              <label :class="{ 'dark-mode-title': getDarkMode }">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your Email"
                required
              />
              <p class="note">You will be able to edit it later.</p>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="cont-form_Image">
            <label>Image</label>
            <input
              id="fileImage"
              class="filee"
              type="file"
              @change="handleFileUpload"
            />
          </div>
          <div class="cont-form_btn">
            <router-link to="/dashboard/users/clintPages/Clint"
              ><button type="button">Cancel</button></router-link
            >
            <button
              class="create"
              :class="{ 'disabled-btn': invalid }"
              :disabled="invalid"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <CircleLoader :show="isLoading" />
  </div>
</template>

<script>
// CircleLoader
import CircleLoader from "@/shared/components/loading/CircleLoader.vue";

import { extend } from "vee-validate";
import { required, email, numeric, digits } from "vee-validate/dist/rules";

// Register rules with custom messages

extend("required", {
  ...required,
  message: "{_field_} مطلوب",
});

extend("email", {
  ...email,
  message: " ادخل ايميل صالح",
});
extend("numeric", {
  ...numeric,
  message: " ادخل  رقم من فضلك",
});
extend("digits", {
  ...digits,
  message: " ادخل  رقم صحيح من فضلك",
});

import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/store/auth/auth.js";

export default {
  name: "AddClint",
  data() {
    return {
      name: "",
      password: "",
      email: "",
      number: null,
      file: null, // for add picture
      profileImageURL: "",

      // loading
      isLoading: false,
    };
  },
  components: {
    CircleLoader,
  },
  computed: {
    ...mapState(useUserStore, ["user", "role"]),
    getDarkMode() {
      return false;
    },
  },
  methods: {
    ...mapActions(useUserStore, [
      "registerUser",
      "handleAuthStateChanged",
      "uploadImage",
    ]),
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async createNewClint() {
      this.isLoading = true;

      try {
        const userCredential = await this.registerUser({
          email: this.email,
          password: this.password,
          name: this.name,
          number: this.number,
          role: "clint",
          profileImageURL: this.profileImageURL,
        });
        const userId = userCredential.user.uid;
        if (this.file) {
          await this.uploadImage({ uid: userId, file: this.file });
        }

        this.isLoading = false;
        alert("User created successfully!");
      } catch (error) {
        this.isLoading = false;
        alert("Error creating user: " + error.message);
      }
    },
  },
  created() {
    // this.handleAuthStateChanged();
  },
};
</script>

<style scoped lang="scss">
// global style :-
//  scss folder => path ( formStyle - form )
.add {
  color: rgb(13, 12, 12);
  background-color: white;
}

.add_title {
  margin: 25px 0px;
}
.note {
  margin-top: 10px;
}
</style>
