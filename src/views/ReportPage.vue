<script setup>
import { UserDataApi } from "../util/utils"
import { userData } from "../store/userData"
import router from "../router"
import uploadImg from "vue-image-crop-upload"
import { ref } from "vue"
import BtnComponent from "../components/BtnComponent.vue"

localStorage.setItem('page', 'Report Bug')
const user = userData()
const isLoggedIn = user.getLoginStatus == 1
const isUpload = ref(false)
const btnProperty = {
  btnName: 'Send'
}
const problem = ref()

function navigateToLogin() {
  router.push({name: "Login"})
}
</script>

<template>
  <div class="bg-[#161616] py-10 flex flex-col">
    <div v-if="isLoggedIn == true">
      <div class="header w-11/12 ml-10 pb-5">REPORT BUG</div>
      <div class="flex flex-col pl-10 py-10 text-xl place-items-start">
        <label for="problem">Encountered Problems</label><br>
        <textarea id="problem" v-model="problem"></textarea>
        <span class="py-3">Attech Picture(Optional)</span>
        <button class="rounded-3xl bg-slate-50 px-7" @click="isUpload = true"><span class="text-7xl text-black font-thin">+</span></button>
        <uploadImg
            v-model="isUpload"
            lang-type="en"
            :no-circle="true"
            @crop-success="CropSuccess"
          ></uploadImg>
        <btn-component 
        @click="console.log(problem)"
        :btn-property="btnProperty"
        class="pt-8"
        />
      </div>
    </div>
    <div
    v-else-if="isLoggedIn == false"
    class="bg-[#171717] h-96 flex items-center justify-center"
  >
    <h1>Please 
      <span 
      class="text-blue-600 hover:cursor-pointer hover:underline"
      @click="navigateToLogin()">Log In</span>
       First</h1>
  </div>
  </div>
  
</template>

<style scoped>
  .header {
    font-size: xx-large;
    border-bottom: 2px black solid;
  }
  textarea {
    width:80%;
    height: 10em;
    font-size: large;
    padding: 12px 20px;
  }
</style>
