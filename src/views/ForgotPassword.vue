<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import BtnComponent from "../components/BtnComponent.vue"
import AlertComponent from '../components/AlertComponent.vue';
import router from "../router"
const route = useRoute()
const passWord = ref('')
const rePassWord = ref('')
import axios from "axios"

const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const alertMsg = ref("")

let btnProperty = {
  btnName: "Confirm",
  bgColor: "#13161B",
  height: "5rem",
  width: "14rem"
}
function resetPs() {
  if(rePassWord.value != '' && passWord.value == ''){
    alertMsg.value = "โปรดกรอกข้อมูลให้ครบ"
  }
  else if(passWord.value != rePassWord.value){
    alertMsg.value = "รหัสผ่านไม่ตรงกัน"
  }
  else if(passWord.value == ''){
    alertMsg.value = "password ไม่สามารถเว้นว่างได้"
  }
  else if(passWord.value == rePassWord.value){
        axios.put(`${url}/login/reset-password`, {
            resetLink: route.params.id,
            newPass: passWord.value
        })
        .catch(function (error) {
          alertMsg.value = error.response.data.message
        })
        .then(() => {
          if(alertMsg.value == ""){
            alert('Your Password Has Been Reset')
            router.push({ name : "Home"})
            }
        })
    }

}
</script>

<template>
    <div
        class="w-full flex justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
      <div class="w-1/2">
        <alert-component :alert-msg="alertMsg"/>
            <h1>Reset Password</h1>
          <div class="formText">
            New Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput"
              @click="alertMsg = ''"
            />
          </div>
          <div class="formText pt-6 py-11">
            Re-type new Password <br />
            <input
              v-model="rePassWord"
              type="password"
              required
              class="textInput"
              @click="alertMsg = ''"
            />
          </div>
        </div>
        <div class="self-center">
          <btn-component
            class="hover:brightness-90"
            :btn-property="btnProperty"
            @click="resetPs()"
          />
        </div>
        </div>
</template>
<style scoped>
.textInput {
  width: 100%;
  height: 2em;
  border: none;
  border-bottom: 2px solid black;
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