<script setup>
import BtnComponent from "../components/BtnComponent.vue"
import { ref, onMounted } from "vue"
import uploadImg from "vue-image-crop-upload"
import { useRoute } from "vue-router"
import axios from "axios"
import router from "../router"

localStorage.setItem("page", "Login")
const Mode = ref("login")
const email = ref("")
const passWord = ref("")
const isUpload = ref(false)
const displayName = ref("")
const errorMsg = ref("")
let imgData = ref("")
let img = new Image()
const rePassWord = ref("")
var formData = new FormData();

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
      params.append("redirect_uri", "https://capstone23.sit.kmutt.ac.th/tt3/login")
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
              router.push({ name: "Home" })
            })
        })
    }
  } catch (error) {
    console.error(error)
  }
}

function isValidate() {
  const regExp = new RegExp(/^\S+@\S+\.\S+$/)
  if(email.value.trim() == '') {
    errorMsg.value = 'อีเมลไม่สามารถเว้นว่างได้'
    return false
  }
  else if(!regExp.test(email.value.trim())){
      errorMsg.value = 'กรุณากรอกอีเมลที่ถูกต้อง'
      return false
  }  
  else if(passWord.value == '' && (Mode.value == 'sign-up' || Mode.value == 'login')){
    errorMsg.value = 'รหัสผ่านไม่สามารถเว้นว่างได้'
    return false
  }

  else if(Mode.value == 'sign-up'){
    if(passWord.value != rePassWord.value) {
      errorMsg.value = 'รหัสผ่านไม่ตรงกัน'
      return false
    }
    else if(displayName.value.trim() == '') {
      errorMsg.value = 'กรุณาใส่ชื่อที่ต้องการเเสดง'
      return false
    }
    else {
      return true
    }
  }

  else {
    return true
  }
}

function login() {
  if(isValidate() == true){
    axios
    .post(`${url}/login`, {
      email: email.value.trim(),
      password: passWord.value,
      registerType: "WEB"
    }).catch(function(error) {
      errorMsg.value = error.response.data.message
    })
    .then((res) => {
      localStorage.setItem("access_token", res.data.accessToken)
      router.push({ name: "Home" })
    })
  }
}

function signUp() {
  console.log(CropSuccess(imgData.value)),
  console.log(isValidate())
  const headerConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  if(isValidate() == true) {
    axios
    .post(`${url}/users/register`, 
    {
      email: email.value.trim(),
      password: passWord.value,
      displayName: displayName.value.trim(),
      picture: CropSuccess(imgData.value),
      registerType: "WEB",
    },
    headerConfig, )
    .catch(function(error) {
        console.log(error)
        errorMsg.value = error.response.data.message
        return;
    })
    .then(() => {
      if(errorMsg.value == ''){
        axios
        .post(`${url}/login`, {
          email: email.value,
          password: passWord.value,
          registerType: "WEB"
        })
        .then((res) => {
          localStorage.setItem("access_token", res.data.accessToken)
          router.push({ name: "Home" })
        })
      }
      
    })
  }
  
}

function resetPs() {
  if(isValidate() == true){
    axios.put(`${url}/login/forgot-password`, {
    email: email.value
    })
    .catch(function(error) {
        errorMsg.value = error.response.data.message
        return;
    })
  }

}


function CropSuccess(cropData) {
  imgData.value = cropData
  img.src = cropData
  const imgType = imgData.value.split(/:(.*?);/)[1];
  const base64 = imgData.value.split('base64,')[1];
  const fileSurname = imgType.split('/')[1];
  const blob = new Blob([atob(base64)], { type: imgType });
  const file = new File([blob], `profileImage.${fileSurname}`, { type: imgType });
  console.log(file)
  console.log(imgData.value)
  return file
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
          <BtnComponent :btn-property="lineBtn" />
        </a>
      </div>
      <div
        v-show="errorMsg != ''"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ errorMsg }}</span>
      </div>

      <div class="formText pt-6">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="formText pt-10">
        Password <br />
        <input
          v-model="passWord"
          type="password"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="pt-10 flex">
        <BtnComponent
          :btn-property="btnProp"
          class="btn"
          @click="login()"
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click="Mode = 'sign-up', errorMsg = ''"
          >Need to sign up</span
        >
      </div>
      <p
        class="btn altFont text-center text-[#FF0000]"
        @click="Mode = 'fgPass' , errorMsg = ''"
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
      <div
        v-show="errorMsg != ''"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ errorMsg }}</span>
      </div>
      <div class="formText pt-4">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="formText pt-4">
        Password <br />
        <input
          v-model="passWord"
          type="password"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="formText pt-4">
        Re-type password <br />
        <input
          v-model="rePassWord"
          type="password"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="formText pt-4">
        DisplayName <br />
        <input
          v-model="displayName"
          type="text"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="formText pt-6 pb-6">
        Choose Your Profile Picture<br />
        <button @click="isUpload = true">upload image</button>
        <div class="pt-3">
          <img
            v-show="imgData != ''"
            class="hover:cursor-pointer bg-slate-900"
            style="clip-path: circle()"
            :src="imgData"
            alt="NO IMAGE CHOSEN"
            @click="isUpload = true"
          />
          <uploadImg
            v-model="isUpload"
            lang-type="en"
            :no-square="true"
            @crop-success="CropSuccess"
          ></uploadImg>
        </div>
      </div>
      <div class="py-8 flex">
        <BtnComponent
          :btn-property="signUpBtn"
          class="btn"
          @click="signUp()"
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click="Mode = 'login' , errorMsg = ''"
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
      <div
        v-show="errorMsg != ''"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ errorMsg }}</span>
      </div>
      <div class="formText">
        Email <br />
        <input
          v-model="email"
          type="text"
          required
          class="textInput"
          @click="errorMsg = ''"
        />
      </div>
      <div class="pt-28 flex">
        <BtnComponent
          :btn-property="cancelBtn"
          class="btn pr-20"
          @click="Mode = 'login' , errorMsg = ''"
        />
        <BtnComponent
          :btn-property="resetBtn"
          class="btn"
          @click="resetPs()"
        />
      </div>
    </div>
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
