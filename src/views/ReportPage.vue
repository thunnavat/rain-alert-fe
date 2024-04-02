<script setup>
import { userData } from "../store/userData"
import router from "../router"
import uploadImg from "vue-image-crop-upload"
import { ref } from "vue"
import BtnComponent from "../components/BtnComponent.vue"
import axios from "axios"
import AlertComponent from "../components/AlertComponent.vue"

localStorage.setItem('page', 'Report Bug')
const profile = userData()
const isLoggedIn = profile.loginStatus
const isUpload = ref(false)
const btnProperty = {
  btnName: 'Send'
}
const problem = ref('')
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const imgData = ref('')
const alertMsg = ref('')
const alertType = ref('')

function CropSuccess(cropData) {
  imgData.value = cropData
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

function navigateToLogin() {
  router.push({name: "Login"})
}
function sendReport() {
  console.log(problem.value)
  if(problem.value == ''){
    alertType.value = 'ERROR'
    alertMsg.value = 'กรุณากรอกข้อมูลปัญหาที่พบ'
  }
  else if(problem.value != ''){
    axios.post(`${url}/bugReport`, {
    note: problem.value,
    picture: imgData.value == '' ? '' : dataURLtoFile(imgData.value, 'reportImg.jpg')
  },
  {
    headers: {
    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "multipart/form-data"
    }
  }).catch(function (error) {
    alertMsg.value = error.response.data.message
  })
    .then(() => {
      if(alertMsg.value == ""){
        alertMsg.value = 'เราได้รับรายงานของคุณเเล้ว ขอบคุณสำหรับการรายงาน'
        alertType.value = 'SUCCESS'
        problem.value = ''
        imgData.value = ''

      }
  })
  }


}
</script>

<template>
  <div class="bg-[#161616] py-10 flex flex-col">
    <div v-if="isLoggedIn == true">
      <alert-component :alert-msg="alertMsg" :alert-type="alertType" />
      <div class="header w-11/12 ml-10 pb-5">REPORT BUG</div>
      <div class="flex flex-col pl-10 py-10 text-xl place-items-start">
        <label for="problem">Encountered Problems</label><br>
        <textarea id="problem" v-model="problem" @keypress="alertMsg = ''"></textarea>
        <span class="py-3">Attech Picture(Optional)</span>
        <button class="rounded-3xl bg-slate-50 px-7" @click="isUpload = true"><span class="text-7xl text-black font-thin">+</span></button>
        <uploadImg
            v-model="isUpload"
            lang-type="en"
            :no-circle="true"
            @crop-success="CropSuccess"
          ></uploadImg>
          <img
            v-show="imgData != ''"
            class="hover:cursor-pointer bg-slate-900 mt-8"
            style="width: 10em;"
            :src="imgData"
            alt="NO IMAGE CHOSEN"
            @click="isUpload = true"
          />
        <btn-component 
        @click="sendReport()"
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
