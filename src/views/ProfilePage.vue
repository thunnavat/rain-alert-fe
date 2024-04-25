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
const oldPass = ref("")
const newPass = ref("")
const reNewPass = ref("")
const alertMsg = ref("")
const alertType = ref("ERROR")

onMounted(() => {
  navSelected.value = "Preference"
  profile.getProfile()
  if (profile.picture == null || !profile.picture.includes("line")) {
    navNames.push("Change Password")
  }
  imageUrl.value =
    profile.picture == null
      ? import.meta.env.PROD
        ? import.meta.env.VITE_IMAGE_PATH + "DefaultProfile.png"
        : "/DefaultProfile.png"
      : profile.picture
})

const screenWidth = window.screen.width

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
  const file = ref('')
  if (imgData.target) {
    file.value = imgData.target.files[0]
  }
  const headerConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "multipart/form-data"
    }
  }
  axios
    .put(
      `${url}/users/updateProfile`,
      {
        picture: file.value != '' ? file.value : dataURLtoFile(imgData, "profile.jpg")
      },
      headerConfig
    )
    .then(() => {
      window.location.reload()
    })
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function changePassword() {
  if (oldPass.value == "" || newPass.value == "" || reNewPass.value == "") {
    alertMsg.value = "โปรดกรอกข้อมูลให้ครบ"
    alertType.value = "ERROR"
  } else if (newPass.value != reNewPass.value) {
    alertMsg.value = "รหัสผ่านไม่ตรงกัน"
    alertType.value = "ERROR"
  } else if (oldPass.value == newPass.value) {
    alertMsg.value = "รหัสผ่านไม่สามารถเป็นรหัสเดิมได้"
    alertType.value = "ERROR"
  } else if (newPass.value != "" && newPass.value == reNewPass.value) {
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
      )
      .catch(function (error) {
        alertMsg.value = error.response.data.message
      })
      .then(() => {
        if (alertMsg.value == "") {
          alertType.value = "SUCCESS"
          alertMsg.value = "เปลี่ยนรหัสผ่านเรียบร้อยเเล้ว"
          oldPass.value = ""
          newPass.value = ""
          reNewPass.value = ""
        }
      })
  }
}
</script>

<template>
  <div class="flex flex-col place-items-center lg:flex-row lg:place-items-start">
    <div class="w-2/6 min-w-fit flex flex-col items-center">
      <div class="container md:pr-20 lg:pr-0">
        <img
          :src="imageUrl"
          alt=""
          class="image w-auto rounded-full"
        />
        <uploadImg
          v-model="isUpload"
          lang-type="en"
          :no-square="true"
          :img-format="'jpg'"
          @crop-success="CropSuccess"
        ></uploadImg>
        <div class="middle hidden lg:block">
          <btn-component
            :btn-property="{ btnName: 'Change IMAGE' }"
            @click="isUpload = true"
          />
        </div>
      </div>
      <div class="userData flex flex-col place-items-centers  ">
        <input
            id="image-file"
            type="file"
            @change="CropSuccess"
            accept="image/jpg, image/jpeg, image/png, image/gif"
          /><br />
          <label
            for="image-file"
            class="custom-file-input lg:hidden"
            >Upload Image</label
            ><br />
            <div class=" text-center lg:mt-0">
              Name: {{ profile.displayName }} <br />
              Email: {{ profile.email }}
            </div>
            
      </div>
      <div class="static w-full flex-col place-items-center bg-transparent hidden lg:flex">
        <nav-component
          :nav-names="navNames"
          :nav-selected="navSelected"
          :direction="'col'"
          :show-log-out="true"
          @selectedRoute="changeRoute"
          :override="false"
        />
      </div>
      <div class="fixed bottom-0 flex z-10 justify-evenly w-full bg-[#13161B] lg:hidden ">
        <nav-component
          v-if="(screenWidth < 768 && navNames.length != 1) || screenWidth >= 768"
          :nav-names="navNames"
          :nav-selected="navSelected"
          :direction="'row'"
          :show-log-out="screenWidth >= 768"
          @selectedRoute="changeRoute"
          :override="true"
        />
      </div>
    </div>
    <div class="w-full lg:w-4/6 flex flex-col items-center text-lg">
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
            class=" relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
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
        <div class="md:hidden pt-5" v-show="(profile.notificationByEmail != true && profile.notificationByLine != true) && profile.districtSubscribed.length != 0"> {{ notifyText }} </div>
          <div
            v-if="profile.districtSubscribed.length == 0"
            class="py-10 tracking-wider"
          >
            You Currently Have No District Subscribed
          </div>
          <div
            v-else-if="profile.districtSubscribed.length > 0"
            v-for="(province, index) in profile.districtSubscribed"
            :key="index"
            class="flex  justify-evenly  my-9 "
          >
            <div class="md:w-1/5 pb-2 md:pb-0">
              {{ province }}
            </div>
            <div>
              <span class="hidden md:block" v-show="(profile.notificationByEmail != true && profile.notificationByLine != true) && profile.districtSubscribed.length != 0"> {{ notifyText }} </span>
            </div>
            <span
              class="text-red-600 cursor-pointer select-none pt-2 md:pt-0"
              @click="setProvinces(province)"
              >X</span
            >
          </div>
        </div>
      </div>
      <div
        v-else-if="navSelected == 'Change Password'"
        class="w-full flex flex-col place-items-center md:flex-row justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
        <div class="w-full md:w-1/2">
          <alert-component
            :alert-msg="alertMsg"
            :alert-type="alertType"
          />
          <div class="formText pt-11">
            Old Password <br />
            <input
              v-model="oldPass"
              type="password"
              required
              class="textInput"
              @change="alertMsg = ''"
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
              @change="alertMsg = ''"
              @keypress="alertMsg = ''"
            />
          </div>
          <ul class="text-sm text-left ">
            <li :class="newPass.length >= 8 ? 'text-green-600' : ''">
              อย่างน้อย 8 ตัวอักษร
            </li>
            <li :class="/\d/.test(newPass) ? 'text-green-600' : ''">ตัวเลข</li>
            <li :class="/[A-Z]/.test(newPass) ? 'text-green-600' : ''">
              ตัวพิมพ์ใหญ่
            </li>
            <li :class="/[a-z]/.test(newPass) ? 'text-green-600' : ''">
              ตัวพิมพ์เล็ก
            </li>
            <li :class="/(?=.*[\W_])/.test(newPass) ? 'text-green-600' : ''">
              อักขระพิเศษ
            </li>
          </ul>
          <div class="formText pt-6 pb-11">
            Re-type new Password <br />
            <input
              v-model="reNewPass"
              type="password"
              required
              class="textInput"
              @change="alertMsg = ''"
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
  @apply text-2xl font-normal pl-5 md:pl-0;
  text-align: left;
}

.textInput {
  height: 2em;
  border: none;
  border-bottom: 1px solid white;
  background-color: #191d23;
  margin-left: 1em;
  transition: border 200ms ease-out;
  @apply w-10/12 md:w-full
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
  width: 15vw;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: 0.5s ease;
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
  background-color: #04aa6d;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}
@media screen and (max-width: 768px) {
  .image {
    width: 40vw;
  }
  .container:hover .image {
    opacity: 1;
  }
}
input[type="file"] {
  display: none;
}

.custom-file-input {
  
  @apply text-blue-400 border border-solid p-5 text-center lg:hidden
}

</style>
