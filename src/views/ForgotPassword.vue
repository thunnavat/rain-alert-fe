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
  const passwordRegExp = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
  )
  if(rePassWord.value != '' && passWord.value == ''){
    alertMsg.value = "โปรดกรอกข้อมูลให้ครบ"
  }
  else if(passWord.value != rePassWord.value){
    alertMsg.value = "รหัสผ่านไม่ตรงกัน"
  }
  else if(passWord.value == ''){
    alertMsg.value = "password ไม่สามารถเว้นว่างได้"
  }
  else if (!passwordRegExp.test(passWord.value)) {
      alertMsg.value =
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวเลข ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และอักขระพิเศษ"
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
        class="w-full flex flex-col md:flex-row justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
      <div class="w-full md:w-1/2">
        <alert-component :alert-msg="alertMsg"/>
            <h1>Reset Password</h1>
          <div class="formText">
            New Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput pt-1"
              @change="alertMsg = ''"
              @keypress="alertMsg = ''"
              placeholder="Enter New Password"
            />
            <ul class="text-sm text-left ">
            <li :class="passWord.length >= 8 ? 'text-green-600' : ''">
              อย่างน้อย 8 ตัวอักษร
            </li>
            <li :class="/\d/.test(passWord) ? 'text-green-600' : ''">ตัวเลข</li>
            <li :class="/[A-Z]/.test(passWord) ? 'text-green-600' : ''">
              ตัวพิมพ์ใหญ่
            </li>
            <li :class="/[a-z]/.test(passWord) ? 'text-green-600' : ''">
              ตัวพิมพ์เล็ก
            </li>
            <li :class="/(?=.*[\W_])/.test(passWord) ? 'text-green-600' : ''">
              อักขระพิเศษ
            </li>
          </ul>
          </div>
          <div class="formText pt-6 py-11">
            Re-type new Password <br />
            <input
              v-model="rePassWord"
              type="password"
              required
              class="textInput pt-1"
              @change="alertMsg = ''"
              @keypress="alertMsg = ''"
              placeholder="Re-Enter New Password"
            />
          </div>
        </div>
        <div class="self-center">
          <btn-component
            class="hover:brightness-90 pb-3 "
            :btn-property="btnProperty"
            @click="resetPs()"
          />
        </div>
        </div>
</template>
<style scoped>
.textInput {
  width: 90%;
  height: 2em;
  border: none;
  border-bottom: 2px solid white;
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