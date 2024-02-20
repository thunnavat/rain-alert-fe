<script setup>
import InformationBox from "../components/InformationBox.vue"
import { ref, onBeforeMount, onMounted } from "vue"
import axios from "axios"
import moment from "moment"
import { userData } from "../store/userData"
onBeforeMount(() => {
  getReports()
})


const storeProvince = userData()

onMounted(() => {
  if(localStorage.getItem('access_token') != null && storeProvince.getLoginStatus != 1){
    window.location.reload()
  }
  console.log(storeProvince.getLoginStatus)
  console.log(localStorage.getItem('access_token'))
})
localStorage.setItem('page', 'Home')
const random = ref([])
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const iconPath = "../rain-status/"
async function getRandom() {
  for (random.value; random.value.length <= 3; ) {
    const randomNum = Math.floor(Math.random() * (49 - 0 + 1) )
    if (!random.value.includes(randomNum)) {
      random.value.push(randomNum)
    }
  }
  return random.value
}

const getReports = async (reportTime) => {
  favorites.value = []
  const randoms = await getRandom()
  const time = await getTimes()
  const modifiedTime = reportTime
    ? moment(reportTime).toISOString(true).slice(0, -13) + "Z"
    : moment(time[0].reportTime).toISOString().slice(0, -8) + "Z"
  axios.get(`${url}/reports?specificTime=${modifiedTime}`).then((res) => {
    for (let i = 0; i < 4; i++) {
      favorites.value.push({
        district: res.data[randoms[i]].reportDistrict.districtName,
        status:
          res.data[randoms[i]].rainStatus.charAt(0) +
          res.data[randoms[i]].rainStatus.slice(1).toLowerCase(),
        icon:
          iconPath +
          res.data[randoms[i]].rainStatus.replace(/\s+/g, "-").toLowerCase() +
          ".svg"
      })
    }
  })
}

const getTimes = () => {
  const Times = axios.get(`${url}/reports/time`).then((res) => {
    return res.data
  })
  return Times
}
const infoBoxs = [
  {
    value:
      "Bangkok and Perimeters | Isolated thundershowers. Minimum temperature 25-26 °C. Maximum temperature 33-36 °C. Easterly winds 10-25 km/hr."
  }
]
const favorites = ref([])
</script>

<template>
  <div class="page">
    <div class="header">
      <h1 class="header-text">RAINALERT</h1>
    </div>
    <div class="content">
      <!-- <h3>Daily Weather Forecast</h3> -->
      <!-- <InformationBox :info-boxs="infoBoxs" /> -->
      <InformationBox
        v-if="favorites.length != 0"
        :info-boxs="favorites"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.header {
  padding: 6em;
  margin-left: 2em;
  margin-right: 3em;
  background-image: url("../assets/Title_Background.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
}

.header-text {
  font-size: 60px;
  background-image: linear-gradient(yellow, white);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 300% 300%;
  animation: animatedText 5s ease infinite;
}

@keyframes animatedText {
  from {
    background-position: 0 0;
    text-shadow: 0 0 80px lightgoldenrodyellow;
  }
  to {
    background-position: 100% 100%;
  }
}
.content {
  text-align: left;
  margin-left: 2em;
  margin-top: 6em;
}
</style>
