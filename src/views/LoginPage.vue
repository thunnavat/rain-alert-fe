<script setup>
import BtnComponent from "../components/BtnComponent.vue"
import { ref, onMounted } from "vue"
import uploadImg from "vue-image-crop-upload"
import { useRoute } from "vue-router"
import axios from "axios"
import router from "../router"
import { userData } from "../store/userData"
import AlertComponent from "../components/AlertComponent.vue"
import LoadingComponent from "../components/LoadingComponent.vue"

localStorage.setItem("page", "Login")
const Mode = ref("login")
const email = ref("")
const passWord = ref("")
const isUpload = ref(false)
const displayName = ref("")
let imgData = ref("")
const rePassWord = ref("")
const profile = userData()
const alertMsg = ref("")
const alertType = ref("ERROR")
const loading = ref(false)
const isModalVisible = ref(false)
const mergeMessage = ref("")
const districtSubscribe = ref([])
const isMergeModal = ref(false)
const selectedDistrict = ref([])
const otp = ref()
let btnProp = {
  btnName: "Login",
  width: "12em"
}

let signUpBtn = {
  ...btnProp,
  btnName: "Create Account"
}

let resetBtn = {
  ...btnProp,
  btnName: "Reset Password"
}

let cancelBtn = {
  btnName: "Cancel",
  bgColor: "black",
  width: "12em"
}

let lineBtn = {
  btnName: "Log in with LINE",
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

const otpBtn = {
  btnName: "GET OTP"
}

const lineLoginUrl =
  "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2003424448&redirect_uri=https%3A%2F%2Fcapstone23.sit.kmutt.ac.th%2Ftt3%2Flogin&state=cp23tt3mtj&scope=profile%20openid%20email"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const route = useRoute()
const userInfo = ref()

onMounted(() => {
  getInitialProps()
})

const getInitialProps = async () => {
  const lineCode = route.query.code
  try {
    if (lineCode) {
      const params = new URLSearchParams()
      params.append("grant_type", "authorization_code")
      params.append("code", lineCode)
      params.append(
        "redirect_uri",
        "https://capstone23.sit.kmutt.ac.th/tt3/login"
      )
      params.append("client_id", "2003424448")
      params.append("client_secret", "6448af88b9fa3786a350bd4ee089c532")

      const request = await axios.post(
        "https://api.line.me/oauth2/v2.1/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )

      const tokenData = request.data
      const verifyParams = new URLSearchParams()
      verifyParams.append("id_token", tokenData.id_token)
      verifyParams.append("client_id", "2003424448")
      const requestVerify = await axios.post(
        "https://api.line.me/oauth2/v2.1/verify",
        verifyParams,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      userInfo.value = {
        lineToken: tokenData,
        profile: requestVerify.data
      }
    }
    if (userInfo.value) {
      await axios
        .post(`${url}/users/register`, {
          lineId: userInfo.value.profile.sub,
          email: userInfo.value.profile.email,
          displayName: userInfo.value.profile.name,
          picture: userInfo.value.profile.picture,
          registerType: "LINE",
          role: "USER"
        })
        .then(async () => {
          await axios
            .post(`${url}/login`, {
              lineId: userInfo.value.profile.sub,
              channelId: userInfo.value.profile.aud,
              registerType: "LINE"
            })
            .then((res) => {
              localStorage.setItem("access_token", res.data.accessToken)
              localStorage.setItem("page", "Home")
              profile.getProfile()
              router.push({ name: "Home" })
            })
        })
    }
  } catch (error) {
    console.error(error)
  }
}

function isValidate() {
  alertType.value = 'ERROR'
  const regExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  const passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
  if (email.value.trim() == "") {
    alertMsg.value = "อีเมลไม่สามารถเว้นว่างได้"
    return false
  } else if (!regExp.test(email.value.trim())) {
    alertMsg.value = "กรุณากรอกอีเมลที่ถูกต้อง"
    return false
  }
  else if (
    passWord.value == "" &&
    (Mode.value == "sign-up" || Mode.value == "login")
  ) {
    alertMsg.value = "รหัสผ่านไม่สามารถเว้นว่างได้"
    return false
  } else if (Mode.value == "sign-up") {
    if(!passwordRegExp.test(passWord.value)) {
      alertMsg.value = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวเลข ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และอักขระพิเศษ"
      return false
    }
    if (passWord.value != rePassWord.value) {
      alertMsg.value = "รหัสผ่านไม่ตรงกัน"
      return false
    } else if (displayName.value.trim() == "") {
      alertMsg.value = "กรุณาใส่ชื่อที่ต้องการเเสดง"
      return false
    } else if(otp.value == '') {
      alertMsg.value = "กรุณากรอกรหัส OTP"
      return false
    } else if(otp.value.length != 6) {
      alertMsg.value = "รหัส OTP ไม่ถูกต้อง"
      return false
    }
     else {
      return true
    }
  } else {
    return true
  }
}

function emailValidate() {
  alertType.value = 'ERROR'
  const regExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  if (email.value.trim() == "") {
    alertMsg.value = "อีเมลไม่สามารถเว้นว่างได้"
    return false
  } else if (!regExp.test(email.value.trim())) {
    alertMsg.value = "กรุณากรอกอีเมลที่ถูกต้อง"
    return false
  }
  return true
}

function login() {
  if (isValidate() == true) {
    axios
      .post(`${url}/login`, {
        email: email.value.trim(),
        password: passWord.value,
        registerType: "WEB"
      })
      .catch(function (error) {
        alertMsg.value = error.response.data.message
      })
      .then(async(res) => {
        localStorage.setItem("access_token", res.data.accessToken)
        await profile.getProfile() 
        router.push({ name: "Home" })
      })
  }
}

function signUp() {
  const headerConfig = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
  if (isValidate() == true) {
    axios
      .post(
        `${url}/users/register`,
        {
          email: email.value.trim(),
          password: passWord.value,
          displayName: displayName.value.trim(),
          picture: imgData.value != "" ? UploadPicture(imgData.value) : "",
          otp: otp.value,
          registerType: "WEB"
        },
        headerConfig
      )
      .catch(function (error) {
        alertMsg.value = error.response.data.message
        return
      })
      .then(() => {
        if (alertMsg.value == "") {
          axios
            .post(`${url}/login`, {
              email: email.value,
              password: passWord.value,
              registerType: "WEB"
            })
            .then(async(res) => {
              localStorage.setItem("access_token", res.data.accessToken)
              await profile.getProfile() 
              router.push({ name: "Home" })
            })
        }
      })
  }
}


function getOtp() {
  alertMsg.value = ''
  if (emailValidate() == true) {
    loading.value = true
    axios.post(`${url}/login/request-email-verification`, {
      email: email.value
    })
    .catch(function (error) {
        alertMsg.value = error.response.data.message
        loading.value = false
        return
      })
    .then(() => {
      if(alertMsg.value == "") {
        alertMsg.value = 'ส่งรหัส OTP ไปยัง Email ของคุณเเล้ว'
        alertType.value = 'SUCCESS'
        loading.value = false
      }
    })
  }
}

function resetPs() {
  if (isValidate() == true) {
    loading.value = true
    axios
      .post(`${url}/login/forgot-password`, {
        email: email.value
      })
      .catch(function (error) {
        loading.value = false
        alertMsg.value = error.response.data.message
        alertType.value = 'ERROR'
      })
      .then(() => {
        if(alertMsg.value == ''){
          loading.value = false
          alertMsg.value = 'ส่งอีเมล์ไปยังบัญชีของคุณเเล้ว'
          alertType.value = 'SUCCESS'
        }
      })
  }
}

function CropSuccess(cropData) {
  imgData.value = cropData
}

function UploadPicture(cropData) {
  const file = dataURLtoFile(cropData, 'profile.jpg')
  return file
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

</script>

<template>
  <div
    v-if="Mode == 'login'"
    class="main"
  >
    <div>
      <img
        src="../assets/Login_Image.png"
        alt=""
        class="max-w-full"
      />
    </div>

    <div
      class="info"
      :class="Mode == 'login' ? '' : 'altFont w-4/6'"
    >
      <div class="btn h-auto max-w-full">
        <a :href="lineLoginUrl">
          <btn-component :btn-property="lineBtn" />
        </a>
      </div>
      <alert-component :alert-msg="alertMsg" />
      <div class="formText pt-6">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @keypress="alertMsg = ''"
        />
      </div>
      <div class="formText pt-10">
        Password <br />
        <input
          v-model="passWord"
          type="password"
          required
          class="textInput"
          @keypress="alertMsg = ''"
        />
      </div>
      <div class="pt-10 flex">
        <btn-component
          :btn-property="btnProp"
          class="btn"
          @click="login()"
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click=";(Mode = 'sign-up'), (alertMsg = '')"
          >Need to sign up</span
        >
      </div>
      <p
        class="btn altFont text-center text-[#FF0000]"
        @click=";(Mode = 'fgPass'), (alertMsg = '')"
      >
        Forgotten password?
      </p>
    </div>
  </div>
  <div
    v-else-if="Mode == 'sign-up'"
    class="main"
  >
    <div>
      <img
        src="../assets/Login_Image.png"
        alt=""
        class="max-w-full"
      />
    </div>
    <div class="info altFont w-4/6">
      <alert-component :alert-msg="alertMsg" :alert-type="alertType" />
      <div class="formText pt-4">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @keypress="alertMsg = ''"
          placeholder="Enter Your Email Address"
        />
      </div>
      <div class="flex pt-5">
        <btn-component
        v-if="loading == false"
        :btn-property="otpBtn"
        @click="getOtp()"
        />
        <loading-component :size="'12px'" v-else-if="loading == true"/>
        <input
          type="text"
          maxlength="6"
          class="textInput pt-4"
          pattern="\d*"
          v-model="otp"
          placeholder="OTP Verification Code"
        />
      </div>

      <div class="formText pt-4">
        Password <br />
        <input
          v-model="passWord"
          type="password"
          required
          class="textInput"
          @keypress="alertMsg = ''"
          placeholder="Enter Your Password"
        />
        <ul class="text-sm">
          <li :class="passWord.length >= 8 ? 'text-green-600' : ''">อย่างน้อย 8 ตัวอักษร</li>
          <li :class="/\d/.test(passWord) ? 'text-green-600' : ''">ตัวเลข</li>
          <li :class="/[A-Z]/.test(passWord) ? 'text-green-600' : ''">ตัวพิมพ์ใหญ่</li>
          <li :class="/[a-z]/.test(passWord) ? 'text-green-600' : ''">ตัวพิมพ์เล็ก</li>
          <li :class="/(?=.*[\W_])/.test(passWord) ? 'text-green-600' : ''">อักขระพิเศษ</li>
        </ul>
      </div>
      <div class="formText pt-4">
        Re-type password <br />
        <input
          v-model="rePassWord"
          type="password"
          required
          class="textInput"
          @keypress="alertMsg = ''"
          placeholder="Re-Enter Your Password"
        />
      </div>
      <div class="formText pt-4">
        DisplayName <br />
        <input
          v-model="displayName"
          type="text"
          required
          class="textInput"
          @keypress="alertMsg = ''"
          placeholder="Enter Your Display Name"
        />
      </div>
      <div class="formText pt-6 pb-6">
        Choose Your Profile Picture (Optional)<br />
        <button @click="isUpload = true">upload image</button>
        <div class="pt-3">
          <img
            v-show="imgData != ''"
            class="hover:cursor-pointer bg-slate-900"
            style="clip-path: circle(); width: 10em"
            :src="imgData"
            alt="NO IMAGE CHOSEN"
            @click="isUpload = true"
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
        </div>
      </div>
      <div class="py-8 flex">
        <btn-component
          :btn-property="signUpBtn"
          class="btn"
          @click="signUp()"
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click=";(Mode = 'login'), (alertMsg = '')"
          >I already have account</span
        >
      </div>
    </div>
  </div>
  <div
    v-else-if="Mode == 'fgPass'"
    class="main"
  >
    <div>
      <img
        src="../assets/Login_Image.png"
        alt=""
        class="max-w-full"
      />
    </div>
    <div class="info altFont w-4/6 self-center">
      <loading-component
        class="h-0"
        v-show="loading"
      />
      <alert-component
        :alert-msg="alertMsg"
        :alert-type="alertType"
      />
      <div class="formText">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @keypress="alertMsg = ''"
        />
      </div>
      <div class="pt-28 flex">
        <btn-component
          :btn-property="cancelBtn"
          class="btn pr-20"
          @click=";(Mode = 'login'), (alertMsg = '')"
        />
        <btn-component
          :btn-property="resetBtn"
          class="btn"
          @click="resetPs()"
        />
      </div>
    </div>
    <transition name="fade">
      <div v-if="isModalVisible">
        <div class="absolute bg-black bg-opacity-70 inset-0 z-0">
          <div
            class="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white top-1/2 transform -translate-y-1/2"
          >
            <div v-if="!isMergeModal">
              <div class="text-center p-3 flex-auto justify-center leading-6">
                <p class="text-md text-gray-500 px-8">
                  {{ mergeMessage }}
                </p>
              </div>
              <div class="p-3 mt-2 text-center space-x-4 md:block">
                <button
                  class="mb-2 md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                  @click="onClickMerge"
                >
                  Merge
                </button>
                <button
                  class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100"
                  @click="isModalVisible = false"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div v-else>
              <div class="text-center p-3 flex-auto justify-center leading-6">
                <p class="text-md text-gray-500 px-8">
                  โปรดเลือกเขตที่ต้องการรับข้อมูลจากบัญชีที่ต้องการรวม
                </p>
                <div class="text-md text-gray-500 px-8">
                  <div
                    v-for="(district, index) in districtSubscribe"
                    :key="index"
                  >
                    <input
                      :id="district"
                      v-model="selectedDistrict"
                      type="checkbox"
                      :value="district"
                    />
                    <label :for="district">{{ district }}</label>
                  </div>
                </div>
              </div>
              <div class="p-3 mt-2 text-center space-x-4 md:block">
                <button
                  class="mb-2 md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                  @click="userMerge"
                >
                  Merge
                </button>
                <button
                  class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100"
                  @click="isModalVisible = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    </div>
</template>
<style scoped>
.main {
  margin: auto;
  background-color: #171717;
  border-radius: 10px;
  width: 60%;
  display: flex;
  justify-content: space-between;
}

.info {
  padding: 3em 2em 0;
  text-align: left;
}

.textInput {
  width: 100%;
  height: 2em;
  border: none;
  border-bottom: 1px solid black;
  background-color: #171717;
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

.btn {
  cursor: pointer;
}
.btn:hover {
  @apply brightness-90;
}

.altFont {
  font-family: "average";
}

.formText {
  @apply text-2xl font-normal;
}
</style>
