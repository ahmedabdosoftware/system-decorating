
<template>
  <div class="addTechnical">
    <div class="title">
      <p :class="{ 'dark-mode-title': getDarkMode }">Create Technical</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="allContent">
      <div>
        <h3 :class="{ 'dark-mode-title': getDarkMode }">Add Technical</h3>
      </div>
      <form @submit.prevent="createNewTechnical" class="cont-form">
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">Full Name</label>
          <input v-model="name" type="text" placeholder="Enter your name" required />
        </div>
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required />
        </div>
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">Number</label>
          <input v-model="number" type="phone" placeholder="Enter your number" required />
        </div>
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">Email</label>
          <input v-model="email" type="email" placeholder="Enter your Email" required />
          <p class="note">You will be able to edit it later.</p>
        </div>
        <div>
          <label>Image</label>
          <input id="fileImage" class="filee" type="file" @change="handleFileUpload" />
        </div>
        <div>
          <router-link to="/dashboard/users/technicalPages/Technical"><button type="button">Cancel</button></router-link>
          <button class="create" type="submit">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useUserStore } from '@/store/auth/auth.js';

export default {
  name: "AddTechnical",
  data() {
    return {
      name: '',
      password: '',
      email: '',
      number:null,
      file: null, // for add picture
      profileImageURL:'',
    };
  },
  computed: {
    getDarkMode() {
      return false;
    }
  },
  methods: {
    ...mapActions(useUserStore, ['registerUser', 'handleAuthStateChanged', 'uploadImage']),
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async createNewTechnical() {
      try {
        const userCredential = await this.registerUser({ email: this.email, password: this.password, name: this.name, number: this.number, role: 'technical' , profileImageURL : this.profileImageURL});
        const userId= userCredential.user.uid
        //console.log("from create",userId)
        if (this.file) {
          await this.uploadImage({ uid:userId, file: this.file });
        }
        alert('User created successfully!');
      } catch (error) {
        alert('Error creating user: ' + error.message);
      }
    },
  },
  created() {
   // this.handleAuthStateChanged();
  },
};
</script>

<style scoped lang="scss">
  %spichial_flex{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  .addTechnical {
    // background-color: blueviolet;
    @extend %spichial_flex;
  
  }
  .allContent {
    width: 370px;
    display: flex;
    flex-wrap: wrap;
    height: 680px;
    background-color: white;
    border-radius: 10px;
    border: solid 1px rgb(181, 179, 179);
    // background-color: forestgreen;
  }
  // title.....
  .allContent > div:first-child {
    width: 100%;
    height: 70px;
    //   background-color: forestgreen;
  }
  
  h3 {
    text-align: center;
    line-height: 70px;
    text-transform: capitalize;
  }
  // cont-form.....
  .allContent form {
    width: 100%;
    height: 580px;
  // background-color: rgb(60, 82, 69);
    display: flex;
    flex-wrap: wrap;
  }
  .allContent form > div {
   // background-color: rgb(48, 129, 82);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-left: 20px;
    input {
      width: 90%;
      height: 35px;
      border-radius: 5px;
    }
  }
  
  .cont-form > div:first-child {
    width: 100%;
    height: 12%;
    // background-color: red;
  }
  .cont-form > div:nth-child(2),.cont-form > div:nth-child(3) {
    width: 100%;
    height: 15%;
  //background-color: sandybrown;
    input {
      height: 50px;
    }
  }
  .cont-form > div:nth-child(4) {
    width: 100%;
    height:25%;
   // background-color: seagreen;
  }
  
  .cont-form > div:nth-child(5){
      width: 100%;
      height: 18%;
     // background-color: saddlebrown;

      input {
      height: 50px;
        // border: 2px dotted rgb(59, 59, 63);
        &:focus {
          outline: none; 
        }
     
    }
    
  
    }
  
  // input file
  input[type="file"]{
          font-size: 19px;
          background-color: white;
          border-radius: 5px;
          border: 2px solid rgb(198, 195, 195);
          width: 90%;
        }
        input[type="file"]::-webkit-file-upload-button{
          background-color: rgb(198, 195, 195);
          /* border-radius: 5px; */
          /* style goes here */
          border: none;
          width: 120px;
          height: 50px;
          cursor: pointer;
          margin-left:-7px ;
   }
  
  .cont-form > div:nth-child(6) {
    width: 100%;
    height: 15%;
    //background-color: saddlebrown;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    button:nth-child(2) {
      background-color: rgb(67, 67, 227);
      width: 120px;
      // cursor: pointer;
      margin-right: 33px;
      // border: none;
      color: white;
      // font-weight: bold;
    }
  }
  
 
  
  button {
    margin-right: 7px;
    border-radius: 5px;
    width: 70px;
    height: 30px;
    text-transform: capitalize;
    font-weight: bold;
    cursor: pointer;
  }
  .note {
    font-size: 15px;
    padding-left: 3px;
    color: rgb(181, 179, 179);
  }
  .note::first-letter {
    text-transform: capitalize;
  }
  .title {
    width: 15%;
    height: 50px;
    margin-top: -80px;
    // background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    p {
      text-transform: capitalize;
      font-size: 18px;
      font-weight: 600;
    }
  }
  .dark-mode-title {
    color: white !important;
  }
  .dark-moode {
    background-color: black !important;
    border: solid 1px rgb(28, 27, 27)  !important;
  }
  // phone
  @media(max-width:477px){
    .title {
  margin-left: 20px;
    }
  }
  /* loader => start  */
  .lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: rgb(27, 25, 25);
  }
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  #loader {
    width: 500px;
    height: 900px;
    visibility: hidden;
    /* background-color: slategray; */
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* loader => end  */
  
  </style>
  <!-- let formData = new FormData();
  formData.append("title", this.categoryTitle);
  formData.append("price", this.price);
  formData.append("description", this.description);
  formData.append("images", this.imageUrl);
  formData.append("categoryId","2"); -->
  