<script setup>
import BtnComponent from "./components/BtnComponent.vue"
import NavComponent from "./components/NavComponent.vue"
import { ref } from "vue"
import router from "./router"
import { userData } from "./store/userData"
import { onMounted } from "vue"

const profile = userData()
const showNav = ref(false)

let navNames = ref(["Home", "Rain Fall", "Subscribe"])

onMounted(() => {
  profile.getLoginStatus
  console.log(localStorage.getItem('page'))
  if(profile.getUserData.exp != undefined){
    setTimeout(() => {
      alert("Time Out Please Log In Again")
      localStorage.removeItem("access_token")
      if(localStorage.getItem('page') == 'Profile'){
        router.push({ name: "Home" })
      }else {
        window.location.reload()
      }
    }, profile.getUserData.exp * 1000 - Date.now())
  }
  if(profile.getUserData.role == "ADMIN"){
    navNames.value.push('Check Report')
  }else if(profile.getUserData.role != "ADMIN"){
    navNames.value.push('Report Bug')
  }
})

const btnProperty = {
  btnName: "Logout",
  iconPath: import.meta.env.PROD
    ? import.meta.env.VITE_IMAGE_PATH + "LogoutIcon.svg"
    : "/LogoutIcon.svg",
  bgColor: "#1A212E"
}

const page = localStorage.getItem("page")
let btnProp = {
  btnName: "Login",
  iconPath: import.meta.env.PROD
    ? import.meta.env.VITE_IMAGE_PATH + "LoginIcon.svg"
    : "/LoginIcon.svg",
  iconAlt: "LoginIcon",
  class: "login",
  bgColor: "#3b95d6"
}

let ProfileIcon = {
  btnName: profile.displayName,
  iconPath: profile.picture,
  iconPath:
    profile.picture == null
      ? import.meta.env.PROD
        ? import.meta.env.VITE_IMAGE_PATH + "DefaultProfile.png"
        : "/DefaultProfile.png"
      : profile.picture,
  bgColor: "black"
}


let navSelected = ref(page)

function login() {
  router.push({ name: "Login" })
  navSelected.value = "Login"
}

function navigateToHome() {
  router.push({ name: "Home" })
  navSelected.value = "Home"
}

function navigateToProfile() {
  router.push({ name: "Profile" })
}

function logout() {
  localStorage.removeItem("access_token")
  router.push({ name: "Home" })
}
</script>

<template>
  <div>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <div class="header">
      <div
        class="navBar flex flex-col w-full xl:w-0 xl:flex-row sidenav"
        :class="showNav == true ? 'open' : 'close'"
      >
      
        <button
          @click="showNav = !showNav"
          class="menuBtn absolute flex place-items-center right-5 py-4"
        >
        <span class="material-symbols-outlined pr-2">
          close
        </span>
        
        Close
        </button>
        <img
          src="./assets/HomeIcon.png"
          style="padding-right: 1em"
          width="180"
          height="100"
          @click="navigateToHome(), (showNav = !showNav)"
          class="z-10"
        />
        <NavComponent
          :nav-names="navNames"
          :nav-selected="navSelected"
          @click=";(navSelected = ''), (showNav = !showNav)"
        />

        <btn-component
          v-if="profile.getUserData == 'Token not found'"
          class="loginBtn xl:absolute bg-[#171717]"
          :btn-property="btnProp"
          @click="login(), (showNav = !showNav)"
        />
        <div
          v-else-if="profile.getUserData != 'Token not found'"
          class=" w-full flex flex-col place-items-center justify-evenly "
        >
          <btn-component
            class="loginBtn xl:absolute bg-blue"
            :btn-property="ProfileIcon"
            @click="navigateToProfile(), (showNav = !showNav)"
          />
          <btn-component
            class="md:hidden"
            @click="logout()"
            :btnProperty="btnProperty"
          />
        </div>
      </div>
      <button
        @click="showNav = !showNav"
        class="menuBtn flex place-items-center p-4"
      >
      <span class="material-symbols-outlined pr-2">menu</span>
        Menu
      </button>
    </div>
    <router-view></router-view>
    <div class="footer">
      <div class="footer-link md:w-4/6 xl:w-2/6">
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

.loginBtn {
  right: 5em;
  margin-top: 0.4em;
  padding: 8px;
  border-radius: 10px;
}

@media screen and (max-width: 767px) {
  .sidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    overflow-x: hidden;
    background-color: black;
    transition: 0.5s;
    padding-top: 60px;
    text-align: center;
  }
  .open {
    width: 100vw;
  }
  .close {
    width: 0%;
  }
}

@media screen and (min-width: 768px) {
  .menuBtn {
    display: none;
  }
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
  /* width: 30%; */
  align-self: center;
  margin: auto;
  padding: 3em 0px;
}
</style>
