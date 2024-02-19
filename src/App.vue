<script setup>
import BtnComponent from "./components/BtnComponent.vue"
import NavComponent from "./components/NavComponent.vue"
import { ref } from "vue"
import router from "./router"
import { userData } from "./store/userData"

const storeProvince = userData()

const page = localStorage.getItem('page')
let btnProp = {
  btnName: "Login",
  iconPath: import.meta.env.PROD ?  import.meta.env.VITE_IMAGE_PATH + 'LoginIcon.svg' : '/LoginIcon.svg',
  iconAlt: "LoginIcon",
  class: "login",
  bgColor: "#3b95d6"
}

let ProfileIcon = {
  btnName: storeProvince.getUserData.displayName,
  iconPath: '',
  bgColor: 'black'
}

let navNames = ["Home", "Rain Fall", "Subscribe", "Report Bug"]

let navSelected = ref(page)

function login() {
  router.push({ name : "Login" })
  navSelected.value = "Login"
}

function navigateToHome() {
  router.push({ name: "Home" })
  navSelected.value = "Home"
}

function navigateToProfile() {
  console.log(storeProvince.getUserData)
}
</script>

<template>
  <div class="header">
    <span class="navBar">
      <img
        src="./assets/HomeIcon.png"
        style="padding-right: 1em"
        width="180"
        height="100"
        @click="navigateToHome()"
      />
      <NavComponent
        :nav-names="navNames"
        :nav-selected="navSelected"
        @click="navSelected = ''"
      />
    
        <BtnComponent
        v-if="storeProvince.getUserData == 'Token not found'"
        class="loginBtn bg-[#171717]"
        :btn-property="btnProp"
        @click="login()"
        />
  
        <BtnComponent
        v-else-if="storeProvince.getUserData != 'Token not found'"
        class="loginBtn"
        :btn-property="ProfileIcon"
        @click="navigateToProfile()"
        />

      
      
    </span>
  </div>
  <router-view></router-view>
  <div class="footer">
    <div class="footer-link">
      <router-link
        :to="{ name: 'Rain Fall' }"
        @click="navSelected = 'Rain Fall'"
        >Rain Check</router-link
      >
      <router-link
        :to="{ name: 'Subscribe' }"
        @click="navSelected = 'Subscribe'"
        >Subscribe</router-link
      >
      <router-link
        :to="{ name: 'Report Bug' }"
        @click="navSelected = 'Report Bug'"
        >Report Bug</router-link
      >
    </div>
    <span style="color: #575757"
      >© 2023 Rain Alert - All Rights Reserved.</span
    >
  </div>
</template>

<style scoped>
.header {
  margin-bottom: 3em;
  margin-top: 1em;
  display: flex;
  align-items: center;
}

.navBar {
  display: flex;
  align-items: center;
}

.navBar:hover {
  cursor: pointer;
}
.loginBtn {
  position: absolute;
  right: 5em;
  margin-top: 0.4em;
  padding: 8px;
  border-radius: 10px;
}

.footer {
  border-top: 1px solid #121212;
  width: 70%;
  margin: auto;
  margin-top: 3em;
}

.footer-link {
  display: flex;
  justify-content: space-evenly;
  width: 30%;
  align-self: center;
  margin: auto;
  padding: 3em;
}
</style>
