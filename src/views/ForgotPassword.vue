<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import BtnComponent from "../components/BtnComponent.vue"
import { UserDataApi } from "../util/utils"
const route = useRoute()
const passWord = ref()
const rePassWord = ref()
let btnProperty = {
  btnName: "Confirm",
  bgColor: "#13161B",
  height: "5rem",
  width: "14rem"
}
console.log(route.params.id)
function resetPs() {
    if(passWord.value == rePassWord.value){
        UserDataApi.resetPassword(route.params.id, passWord.value)
    }
}
</script>

<template>
    <div
        class="w-full flex justify-evenly bg-[#191d23] mt-16 rounded-lg"
      >
      <div class="w-1/2">
            <h1>Reset Password</h1>
          <div class="formText">
            New Password <br />
            <input
              v-model="passWord"
              type="password"
              required
              class="textInput"
            />
          </div>
          <div class="formText pt-6 py-11">
            Re-type new Password <br />
            <input
              v-model="rePassWord"
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