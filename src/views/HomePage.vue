<script setup>
import InformationBox from "../components/InformationBox.vue"
import LoadingComponent from "../components/LoadingComponent.vue"
import { useRoute } from 'vue-router';
import { ref, onBeforeMount, onMounted } from "vue"
import axios from "axios"
import moment from "moment"
import { userData } from "../store/userData"
const route = useRoute()
onBeforeMount(() => {
  getReports().then(() => {
    isLoading.value = false
  })
})

const isLoading = ref(true)

const profile = userData()

onMounted(() => {
  profile.getLoginStatus
  if((localStorage.getItem('access_token') != null && profile.loginStatus != true) 
    || (localStorage.getItem('access_token') == null && profile.loginStatus != false)){
    window.location.reload()
  }
  
})
localStorage.setItem('page', 'Home')
const random = ref([])
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const iconPath = import.meta.env.PROD ? import.meta.env.VITE_IMAGE_PATH + "rain-status/" : "/rain-status/";
async function getRandom() {
  for (random.value; random.value.length <= 3; ) {
    if(profile.districtSubscribed && profile.districtSubscribed.length != 0){

    }
    const randomNum = Math.floor(Math.random() * (49 - 0 + 1) )
    if (!random.value.includes(randomNum)) {
      random.value.push(randomNum)
    }
  }
  return random.value
}

const getReports = async (reportTime) => {
  favorites.value = []
  const favoriteDistrict = ref([])
  favoriteDistrict.value.push(...profile.districtSubscribed)
  const randoms = await getRandom()
  const time = await getTimes()
  const modifiedTime = reportTime
    ? moment(reportTime).toISOString(true).slice(0, -13) + "Z"
    : moment(time[0].reportTime).toISOString().slice(0, -8) + "Z"
  axios.get(`${url}/reports?specificTime=${modifiedTime}`).then((res) => {
    const data = ref([])
    for(let i = 0; i < res.data.length; i++) {
      data.value.push(res.data[i])
    }
    const favoriteLength = favoriteDistrict.value.length
    const districtReport = ref([])
    
    function filterReport(status) {
        const reportStatus = favoriteDistrict.value.filter(
          (report) =>  report.rainStatus.toLowerCase() == status.toLowerCase()
        )
        return reportStatus
      }
    for(let i = 0; i < favoriteLength; i++){
      const favoriteIndex = data.value.findIndex((data) => data.reportDistrict.districtName.toLowerCase() == favoriteDistrict.value[i].toLowerCase())
      districtReport.value.push(data.value[favoriteIndex])
      if(i == favoriteLength - 1) {
        favoriteDistrict.value = districtReport.value
        districtReport.value = []
        districtReport.value.push(
          ...filterReport("heavy rain"),
          ...filterReport("moderate rain"),
          ...filterReport("light rain"),
          ...filterReport("no rain")
        )
      }
    }
   
    for (let i = 0; i < 4; i++) {
      if(favoriteDistrict.value.length != 0 && profile.loginStatus == true){
        const index = data.value.findIndex((report) => report.reportDistrict == districtReport.value[i].reportDistrict)
        favorites.value.push({
        district: districtReport.value[i].reportDistrict.districtName,
        status:
        districtReport.value[i].rainStatus.charAt(0) +
        districtReport.value[i].rainStatus.slice(1).toLowerCase(),
        icon:
          iconPath +
          districtReport.value[i].rainStatus.replace(/\s+/g, "-").toLowerCase() +
          ".svg"
      })
      favoriteDistrict.value.splice(0, 1)
      data.value.splice(index, 1)
      }else {
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
    <div class="header lg:mx-12">
      <h1 class="header-text lg:text-transparent">RAINALERT</h1>
    </div>
    <div class="content">
      <!-- <h3>Daily Weather Forecast</h3> -->
      <!-- <InformationBox :info-boxs="infoBoxs" /> -->
      <loading-component v-if="isLoading == true"/>
      <InformationBox
        v-if="favorites.length != 0 && isLoading == false"
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
  /* margin-left: 2em; */
  /* margin-right: 3em; */
  background-image: url("../assets/Title_Background.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
}

.header-text {
  font-size:calc(12px + 3vw);
  background-image: linear-gradient(yellow, white);
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 100% 100%;
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
  /* margin-left: 2em; */
  margin-top: 6em;
}

</style>
