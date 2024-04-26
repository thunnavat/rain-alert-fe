<script setup>
import axios from "axios"
import TableComponent from "../components/TableComponent.vue"
import LoadingComponent from "../components/LoadingComponent.vue"
import { ref, onBeforeMount } from "vue"
import moment from "moment"
import { userData } from "../store/userData"

localStorage.setItem('page', 'Rain Fall')

const url = import.meta.env.PROD ?  import.meta.env.VITE_API_URL : '/api'
const headers = ["DISTRICT", "Status"]
const options = ref()
const sort = ref()
const selectedVal = ref()
const selectedStatus = ref("all")
const isLoading = ref(true)
const profile = userData()

onBeforeMount(() => {
  getTimes()
  getReports().then(() => {
    isLoading.value = false
  })
  if(profile.getUserData.role == 'ADMIN'){
    headers.push('Change Status')
  }

})

const reports = ref([])
const getReports = async (reportTime, sorted, selectedStatus) => {
  const time = await getTimes()
  const modifiedTime = reportTime
    ? moment(reportTime).toISOString().slice(0, -8) + "Z"
    : moment(time[0].reportTime).toISOString().slice(0, -8) + "Z"
  reports.value = []
  axios
    .get(
      `${url}/reports?specificTime=${modifiedTime}${
        selectedStatus != undefined ? "&rainStatus=" + selectedStatus : ""
      }${sorted ? "&sort=distinctname," + sorted : ""}`
    )
    .then((res) => {
      for (let i in res.data) {
        reports.value.push({
          district: res.data[i].reportDistrict.districtName,
          status: res.data[i].rainStatus,
          id: res.data[i]._id
        })
      }
    })
}

const getTimes = () => {
  const Times = axios
    .get(`${url}/reports/time`)
    .then((res) => {
      options.value = []
      for (let i in res.data) {
        options.value.push(
          moment.utc(res.data[i].reportTime).local().format("DD MMMM YYYY HH:mm")
        )
      }
      return res.data
    })
  return Times
}

function selectedValue(selected) {
  selectedVal.value = selected
  doGetReport()
}

function sortBy(sorted) {
  if(sorted == "asc" || sorted == "desc"){
    sort.value = sorted
  }
  else if(sorted == "classic"){
    sort.value = "asc"
  }
  doGetReport()
}

function selectStatus(status) {
  selectedStatus.value = status == "all" ? "all" : String(status).toUpperCase()
  doGetReport()
}

function doGetReport() {
  getReports(selectedVal.value, sort.value, selectedStatus.value)
}
</script>

<template>
  <div>
    <loading-component v-if="isLoading == true"/>
    <TableComponent 
      v-if="isLoading == false"
      :options="options"
      :headers="headers"
      :columns="reports"
      :mode="'districtReport'"
      @selected-value="selectedValue"
      @sort-by="sortBy"
      @selected-status="selectStatus"
    />
  </div>
</template>

<style scoped></style>
