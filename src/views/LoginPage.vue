<script setup>
import BtnComponent from "../components/BtnComponent.vue"
import { ref } from "vue"
import uploadImg from "vue-image-crop-upload"

localStorage.setItem("page", "Login")
const Mode = ref("login")
const userName = ref("")
const passWord = ref("")
const isUpload = ref(false)
let imgData = ref("")

let btnProp = {
  btnName: "Login",
  iconPath: "",
  bgColor: "#484848",
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
  iconPath: "",
  bgColor: "black",
  width: "12em"
}

let lineBtn = {
  btnName: "Log in with LINE",
  iconPath: import.meta.env.PROD ?  import.meta.env.VITE_IMAGE_PATH + 'LineIcon.png' : '/LineIcon.png',
  iconAlt: "LineIcon",
  iconWidth: "40",
  iconHeight: "40",
  bgColor: "#06C755",
  width: "24rem",
  height: "3.5rem"
}

function login(user, pass) {
  alert(user)
  alert(pass)
}

function CropSuccess(cropData) {
  console.log('upload success')
  imgData.value = cropData
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
        <BtnComponent :btn-property="lineBtn" />
      </div>
      <div class="formText pt-6">
        Email / Username <br />
        <input
          v-model="userName"
          type="text"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-10">
        Password <br />
        <input
          v-model="passWord"
          type="password"
          required
          class="textInput"
        />
      </div>
      <div class="pt-10 flex">
        <BtnComponent
          :btn-property="btnProp"
          class="btn"
          @click="login(userName, passWord)"
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click="Mode = 'sign-up'"
          >Need to sign up</span
        >
      </div>
      <p
        class="btn altFont text-center text-[#FF0000]"
        @click="Mode = 'fgPass'"
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
      <div class="formText">
        Username <br />
        <input
          type="text"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-4">
        Email <br />
        <input
          type="text"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-4">
        Password <br />
        <input
          type="password"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-4">
        Re-type password <br />
        <input
          type="password"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-4">
        DisplayName <br />
        <input
          type="text"
          required
          class="textInput"
        />
      </div>
      <div class="formText pt-6 pb-6">
        Choose Your Profile Picture<br />
        <!-- <input type="file" @change="upload"> -->
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
        />
        <span
          class="btn altFont pl-7 pt-2"
          @click="Mode = 'login'"
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
      <div class="formText">
        Email <br />
        <input
          type="text"
          required
          class="textInput"
        />
      </div>
      <div class="pt-28 flex">
        <BtnComponent
          :btn-property="cancelBtn"
          class="btn pr-20"
          @click="Mode = 'login'"
        />
        <BtnComponent
          :btn-property="resetBtn"
          class="btn"
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
