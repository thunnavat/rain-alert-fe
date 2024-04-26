<script setup>
import LoadingComponent from "../components/LoadingComponent.vue"
import { onMounted, ref } from "vue"
import { userData } from "../store/userData"
import axios from "axios"

const profile = userData()
const reports = ref()
const role = profile.getUserData.role
const no_image =  import.meta.env.PROD ? import.meta.env.VITE_IMAGE_PATH + "No_image_available.png": "/No_image_available.png"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
onMounted(() => {
  axios
    .get(`${url}/admin/getBugReport`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    })
    .then((res) => {
      reports.value = res.data
    })
})
</script>

<template>
  <div
    v-if="role != 'ADMIN'"
    class="text-3xl"
  >
    401 Unauthorized
  </div>
  <div v-else-if="role == 'ADMIN'" class="flex flex-wrap">
    <span
      v-for="(report, index) in reports"
      :key="index"
      class="w-1/5 m-7"
    >
      <div
        class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-5"
      >
      Number: {{ index + 1 }}
      <div class="p-5">NOTE : {{ report.note }}</div>
        <img
          class="rounded-t-lg"
          :src="report.picture == null ? no_image : report.picture"
          alt=""
          width="200"
          height="200"
        />
        <img src="" alt="" width="200"><br />
      </div>
    </span>
  </div>
</template>
<style scoped>
</style>