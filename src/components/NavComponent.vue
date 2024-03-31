<script setup>
import router from "../router"
import { ref } from "vue"
import BtnComponent from "./BtnComponent.vue";
defineProps({
  navNames: { type: Array, default: () => [] },
  navSelected: { type: String, default: "" },
  direction: { type: String, default: ''},
  showLogOut: { type: Boolean, default: false}
})

const emits = defineEmits(["selectedRoute"])

const selected = ref("")
const btnProperty = {
  btnName: "Logout",
  iconPath: import.meta.env.PROD ?  import.meta.env.VITE_IMAGE_PATH + 'LogoutIcon.svg' : '/LogoutIcon.svg',
  bgColor: "#1A212E",
}
let homeRoutes = ["Home", "Rain Fall", "Subscribe", "Report Bug"]
function changePage(route) {
  selected.value = route
  if(homeRoutes.includes(route)){
    router.push({ name: route })
  }
  else if(!homeRoutes.includes(route)) {
    emits("selectedRoute", route)
  }
}

function logout() {
  localStorage.removeItem("access_token")
  router.push({ name: "Home"})
}
</script>

<template>
  <div class="navDiv cursor-pointer" :class="direction == 'col' ? 'flex-col m-10 w-1/2 rounded-2xl bg-[#13161B]' : 'flex-row rounded-lg bg-[#171715]'">
    <span
      v-for="(navName, index) in navNames"
      :key="index"
      :style="
        navName == (navSelected == '' ? selected : navSelected)
          ? { 'background-color': 'black' }
          : ''
      "
      class="navSpan"
      :class="direction == 'col' ? 'my-3 self-center' : 'mx-3'"
      @click="changePage(navName)"
      >{{ navName }}
    </span>
    <span v-if="showLogOut" class="hover:brightness-110 self-center mt-10 mb-5">
      <btn-component 
        @click="logout()"
        :btnProperty="btnProperty"
      />
    </span>
  </div>
</template>

<style scoped>
.navDiv {
  display: flex;
  justify-content: space-between;
  /* width: 750px; */
  /* height: 50px; */
  /* background-color: #171715; */
  padding: 10px;
  /* border-radius: 10px; */
}

.navSpan {
  padding: 15px;
  background-color: #141415;
  width: 150px;
  border-radius: 10px;
}

.navSpan:hover {
  background-color: black;
}
</style>
