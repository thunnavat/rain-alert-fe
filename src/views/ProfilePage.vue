<script setup>
import TableComponent from "../components/TableComponent.vue"
import { userSubscribe, userData } from "../store/userData"
import BtnComponent from "../components/BtnComponent.vue"
import NavComponent from "../components/NavComponent.vue"
import { ref, onMounted } from "vue"
import router from "../router"
import { UserDataApi } from "../util/utils"

localStorage.setItem("page", "Profile")

const notifyText = ref("")
const GetNotified = ref(false)
notifyText.value = "Need Line or Email Notification"
const navNames = ["Preference", "Reset Password"]
const navSelected = ref("")
const storeProvince = userSubscribe()
const user = userData()
onMounted(() => {
  navSelected.value = "Preference"
})

let lineBtn = {
  btnName: "Get Line Notification",
  iconPath: import.meta.env.PROD
    ? import.meta.env.VITE_IMAGE_PATH + "LineIcon.png"
    : "/LineIcon.png",
  iconAlt: "LineIcon",
  iconWidth: "40",
  iconHeight: "40",
  bgColor: "#06C755",
  width: "24rem",
  height: "3.5rem"
}

let btnProperty = {
  btnName: "Reset\nPassword",
  bgColor: "#13161B",
  height: "5rem"
}

function setProvinces(name) {
  storeProvince.removeProvince(name)
  UserDataApi.setDistrict()
}

function changeRoute(route) {
  navSelected.value = route
  console.log(navSelected.value)
}

const imageUrl = import.meta.env.PROD
  ? import.meta.env.VITE_IMAGE_PATH + "DefaultProfile.png"
  : "/DefaultProfile.png"
</script>

<template>
  <div class="flex">
    <div class="w-2/6 min-w-fit flex flex-col items-center">
      <img
        :src="imageUrl"
        alt=""
        style="border-radius: 50%"
        class="w-52"
      />
      <div class="userData">
        Name: {{ user.getUserData.displayName }} <br />
        Email: {{ user.getUserData.email }}
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
        <BtnComponent :btn-property="lineBtn" />
        <span class="pt-3">
          <input type="checkbox" id="emailNotify">
          <label class="pl-3 select-none" for="emailNotify">Get Email Notification</label>
        </span>
      </div>
      <div
        v-if="navSelected == 'Preference'"
        class="w-full"
      >
        <div class="bg-[#191D23] py-2 my-14 rounded-lg">
          <div class="pb-5 mt-5 border-solid border-black border-0 border-b-2">
            My Favorites
          </div>
          <div
            v-for="(province, index) in storeProvince.provinces"
            :key="index"
            class="flex justify-evenly my-9"
          >
            <div class="w-1/5">
              {{ province }}
            </div>
            <input type="checkbox" v-if="GetNotified == true">
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
        v-else-if="navSelected == 'Reset Password'"
        class="w-full flex justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
        <div class="w-1/2">
          <div class="formText pt-11">
            Old Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput"
            />
          </div>
          <div class="formText pt-6">
            New Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput"
            />
          </div>
          <div class="formText pt-6 pb-11">
            Re-type new Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput"
            />
          </div>
        </div>
        <div class="self-center">
          <btn-component 
            class="hover:brightness-90"
            :btn-property="btnProperty"
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
</style>