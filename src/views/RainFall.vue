<script setup>
import axios from "axios"
import TableComponent from "../components/TableComponent.vue"
import { ref, onBeforeMount } from "vue"
import moment from "moment"

const headers = ["DISTRICT", "Status"]
const options = ref()
const sort = ref()
const selectedVal = ref()
const selectedStatus = ref("all")

onBeforeMount(() => {
  getTimes()
  getReports()
})

const reports = ref([])
const getReports = async (reportTime, sorted, selectedStatus) => {
  const time = await getTimes()
  const modifiedTime = reportTime
    ? moment(reportTime).toISOString(true).slice(0, -13) + "Z"
    : moment(time[0].reportTime).toISOString().slice(0, -8) + "Z"
  reports.value = []
  axios
    .get(
      `http://localhost:3000/api/report?specificTime=${modifiedTime}${
        selectedStatus != undefined ? "&rainStatus=" + selectedStatus : ""
      }${sorted ? "&sort=distinctname," + sorted : ""}`
    )
    .then((res) => {
      for (let i in res.data) {
        reports.value.push({
          district: res.data[i].reportDistrict.districtName,
          status: res.data[i].rainStatus
        })
      }
    })
}

const getTimes = () => {
  const Times = axios
    .get("http://localhost:3000/api/report/time")
    .then((res) => {
      options.value = []
      for (let i in res.data) {
        options.value.push(
          moment.utc(res.data[i].reportTime).format("DD MMMM YYYY HH:mm")
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
  sort.value = sorted
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
    <TableComponent
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
