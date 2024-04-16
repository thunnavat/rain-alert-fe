<script setup>
import { userData } from "../store/userData"
import BtnComponent from "../components/BtnComponent.vue"
import NavComponent from "../components/NavComponent.vue"
import { ref, onMounted } from "vue"
import { UserDataApi } from "../util/utils"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import uploadImg from "vue-image-crop-upload"
import AlertComponent from "../components/AlertComponent.vue"

localStorage.setItem("page", "Profile")

const notifyText = ref("")
const GetNotified = ref(false)
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
notifyText.value = "Need Line or Email Notification"
const navNames = ["Preference"]
const navSelected = ref("")
const profile = userData()
const imageUrl = ref()
const isUpload = ref(false)
const oldPass = ref('')
const newPass = ref('')
const reNewPass = ref('')
const alertMsg = ref('')
const alertType = ref('ERROR')

onMounted(() => {
  navSelected.value = "Preference"
  profile.getProfile()
  if(profile.picture == null || !profile.picture.includes("line")){
    navNames.push("Change Password")
  }
  imageUrl.value = profile.picture == null ?
  import.meta.env.PROD ?  import.meta.env.VITE_IMAGE_PATH + 'DefaultProfile.png' : '/DefaultProfile.png':
  profile.picture
})

let btnProperty = {
  btnName: "Confirm",
  bgColor: "#13161B",
  height: "5rem",
  width: "14rem"
}

function setProvinces(name) {
  profile.removeProvince(name)
  UserDataApi.setDistrict()
}

function changeRoute(route) {
  navSelected.value = route
  console.log(navSelected.value)
}


const checkLineNotification = async () => {
  if (profile.notificationByLine === false) {
    if (
      profile.notifyToken === null ||
      profile.notifyToken === "" ||
      profile.notifyToken === undefined
    ) {
      const userId = jwtDecode(localStorage.getItem("access_token")).userId
      alert("Please allow the permission of Line Notify first")
      window.location.href = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=e48bP0urIm25wxyt3PtwM5&redirect_uri=https://capstone23.sit.kmutt.ac.th/tt3/api/notifyCallback&scope=notify&state=${userId}`
    }
  }
  profile.notificationByLine = !profile.notificationByLine
  await axios
    .put(
      `${url}/users/updateProfile`,
      {
        notificationByLine: profile.notificationByLine
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    )
    .then(() => {
      profile.getProfile()
    })
}

const checkEmailNotification = async () => {
  profile.notificationByEmail = !profile.notificationByEmail
  await axios
    .put(
      `${url}/users/updateProfile`,
      {
        notificationByEmail: profile.notificationByEmail
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    )
    .then(() => {
      profile.getProfile()
    })
}

function CropSuccess(imgData) {
  const headerConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "multipart/form-data"
    }
  }
  axios.put(`${url}/users/updateProfile`,{
    picture: dataURLtoFile(imgData, 'profile.jpg')
  },
  headerConfig
  ).then(() => {
    window.location.reload()
  })
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

function changePassword() {
  if(oldPass.value == '' || newPass.value == '' || reNewPass.value == ''){
    alertMsg.value = 'โปรดกรอกข้อมูลให้ครบ'
    alertType.value = 'ERROR'
  } 
  else if(newPass.value != reNewPass.value){
    alertMsg.value = 'รหัสผ่านไม่ตรงกัน'
    alertType.value = 'ERROR'
  }
  else if(oldPass.value == newPass.value){
    alertMsg.value = 'รหัสผ่านไม่สามารถเป็นรหัสเดิมได้'
    alertType.value = 'ERROR'
  }
  else if(newPass.value != '' && newPass.value == reNewPass.value){
    axios
    .put(
      `${url}/users/changePassword`,
      {
        userId: profile.userId,
        currentPassword: oldPass.value,
        newPassword: newPass.value,
        retypePassword: reNewPass.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    ).catch(function (error) {
        alertMsg.value = error.response.data.message
      })
      .then(() => {
        if(alertMsg.value == ''){
          alertType.value = 'SUCCESS'
          alertMsg.value = 'เปลี่ยนรหัสผ่านเรียบร้อยเเล้ว'
          oldPass.value = ''
          newPass.value = ''
          reNewPass.value = ''
        }
      })

  }
}
</script>

<template>
  <div class="flex">
    <div class="w-2/6 min-w-fit flex flex-col items-center">
      <div class="container">
        <img
          :src="imageUrl"
          alt=""
          style="border-radius: 50% "
          class="image w-auto"
        />
        <uploadImg
            v-model="isUpload"
            lang-type="en"
            :no-square="true"
            :img-format="'jpg'"
            :width="500"
            :height="500"
            @crop-success="CropSuccess"
          ></uploadImg>
      <div class="middle">
        <btn-component
        :btn-property="{btnName: 'Change IMAGE'}"
        @click="isUpload = true"
        />
      </div>
      </div>
      <div class="userData">
        Name: {{ profile.displayName }} <br />
        Email: {{ profile.email }}
      </div>

      <NavComponent
        class=""
        :nav-names="navNames"
        :nav-selected="navSelected"
        :direction="'col'"
        :show-log-out="true"
        @selectedRoute="changeRoute"
      />
    </div>
    <div class="w-4/6 flex flex-col items-center text-lg">
      <div class="flex justify-evenly w-full">
        <label class="inline-flex items-center me-5 cursor-pointer">
          <input
            type="checkbox"
            value=""
            class="sr-only peer"
            :checked="profile.notificationByLine"
            @click="checkLineNotification"
          />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
          ></div>
          <span
            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Get Line Notification</span
          >
        </label>
        <label class="inline-flex items-center me-5 cursor-pointer">
          <input
            type="checkbox"
            value=""
            class="sr-only peer"
            :checked="profile.notificationByEmail"
            @click="checkEmailNotification"
          />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"
          ></div>
          <span
            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Get Email Notification</span
          >
        </label>
      </div>
      <div
        v-if="navSelected == 'Preference'"
        class="w-full"
      >
        <div class="bg-[#191D23] py-2 my-14 rounded-lg">
          <div class="pb-5 mt-5 border-solid border-black border-0 border-b-2">
            My Favorites
          </div>
          <div v-if="profile.districtSubscribed.length == 0" class="py-10">
            You Currently Have No District Subscribed
          </div>
          <div
            v-else-if="profile.districtSubscribed.length > 0"
            v-for="(province, index) in profile.districtSubscribed"
            :key="index"
            class="flex justify-evenly my-9"
          >
            <div class="w-1/5">
              {{ province }}
            </div>
            <input
              type="checkbox"
              v-if="GetNotified == true"
            />
            <div>
              <span> {{ notifyText }} </span>
            </div>
            <span
              class="text-red-600 cursor-pointer select-none"
              @click="setProvinces(province)"
              >X</span
            >
          </div>
        </div>
      </div>
      <div
        v-else-if="navSelected == 'Change Password'"
        class="w-full flex justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
      <div class="w-1/2">
          <alert-component
          :alert-msg= alertMsg
          :alert-type="alertType"
          />
          <div class="formText pt-11">
            Old Password <br />
            <input
              v-model="oldPass"
              type="password"
              required
              class="textInput"
              @keypress="alertMsg = ''"
            />
          </div>
          <div class="formText pt-6">
            New Password <br />
            <input
              v-model="newPass"
              type="password"
              required
              class="textInput"
              @keypress="alertMsg = ''"
            />
          </div>
          <div class="formText pt-6 pb-11">
            Re-type new Password <br />
            <input
              v-model="reNewPass"
              type="password"
              required
              class="textInput"
              @keypress="alertMsg = ''"
            />
          </div>
        </div>
        <div class="self-center">
          <btn-component
            class="hover:brightness-90"
            :btn-property="btnProperty"
            @click="changePassword()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.userData {
  padding: 2em 0px;
  line-height: 2em;
  font-size: large;
  text-align: left;
}

.formText {
  @apply text-2xl font-normal;
  text-align: left;
}

.textInput {
  width: 100%;
  height: 2em;
  border: none;
  border-bottom: 1px solid black;
  background-color: #191d23;
  margin-left: 1em;
  transition: border 200ms ease-out;
}

.textInput:focus {
  outline: none;
  border-bottom: 1px solid #3b95d6;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text;
  -webkit-text-fill-color: #ffffff;
  transition: background-color 5000s ease-in-out 0s;
  box-shadow: inset 0 0 20px 20px #23232329;
}
.container {
  position: relative;
  width: 50%;
}

.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: .5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.container:hover .image {
  opacity: 0.3;
}

.container:hover .middle {
  opacity: 1;
}

.text {
  background-color: #04AA6D;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}
</style>
