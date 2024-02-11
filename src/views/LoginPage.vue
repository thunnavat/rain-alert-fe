<script setup>
import BtnComponent from "../components/BtnComponent.vue"
import { ref } from "vue";

const Mode = ref('login')

let btnProp = {
    btnName: "Login",
    iconPath: "",
    bgColor: "#484848",
    width: "12em",
}

let signUpBtn = {
    ...btnProp,
    btnName: "Create Account"
}

let resetBtn = {
    ...btnProp,
    btnName: 'Reset Password'
}

let cancelBtn = {
    btnName: 'Cancel',
    iconPath: '',
    bgColor: 'black',
    width: "12em",
}

let lineBtn = {
    btnName: "Log in with LINE",
    iconPath: "src/assets/LineIcon.png",
    iconAlt: "LineIcon",
    iconWidth: "40",
    iconHeight: "40",
    bgColor: "#06C755",
    width: "24rem",
    height: "3.5rem"
}

</script>

<template>
    <div v-if=" Mode == 'login'" class="main">
        <div>
            <img src="../assets/Login_Image.png" alt="" class="max-w-full"/>
        </div>
        <div class="info">
            <div class="btn h-auto max-w-full">
                <BtnComponent :btn-property="lineBtn" />
            </div>
            <div class="formText pt-6">
                Email / Username <br />
                <input type="text" required class="textInput" />
            </div>
            <div class="formText pt-10">
                Password <br />
                <input type="password" required class="textInput" />
            </div>
            <div class="pt-10 flex">
                <BtnComponent :btn-property="btnProp" class="btn" />
                <span class="btn altFont pl-7 pt-2" @click="Mode = 'sign-up'" >Need to sign up</span>
            </div>
            <p class="btn altFont text-center text-[#FF0000]" @click="Mode = 'fgPass'" >Forgotten password?</p>
        </div>
    </div>
    <div v-else-if=" Mode == 'sign-up'" class="main" >
        <div>
            <img src="../assets/Login_Image.png" alt="" class="max-w-full"/>
        </div>
        <div class="info altFont w-4/6">
            <div class="formText">
                Username <br />
                <input type="text" required class="textInput" />
            </div>
            <div class="formText pt-4">
                Email <br />
                <input type="text" required class="textInput" />
            </div>
            <div class="formText pt-4">
                Password <br />
                <input type="password" required class="textInput" />
            </div>
            <div class="formText pt-4">
                Re-type password <br />
                <input type="password" required class="textInput" />
            </div>
            <div class="py-5 flex">
                <BtnComponent :btn-property="signUpBtn" class="btn" />
                <span class="btn altFont pl-7 pt-2"  @click="Mode = 'login'">I already have account</span>
            </div>
        </div>
    </div>
    <div v-else-if="Mode == 'fgPass'" class="main">
        <div>
            <img src="../assets/Login_Image.png" alt="" class="max-w-full"/>
        </div>
        <div class="info altFont w-4/6 self-center">
            <div class="formText">
                Email <br />
                <input type="text" required class="textInput" />
            </div>
            <div class="pt-28 flex">
                <BtnComponent :btn-property="cancelBtn" class="btn pr-20" @click="Mode = 'login'" />
                <BtnComponent :btn-property="resetBtn" class="btn" />
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
    transition : border 200ms ease-out;
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
    font-family: 'average';
}

.formText {
    @apply text-2xl font-normal
}
</style>
