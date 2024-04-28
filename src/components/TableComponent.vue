<script setup>
import { ref, computed } from "vue"
import PaginationComponent from "./PaginationComponent.vue"
import DropDownComponent from "./DropDownComponent.vue"
import axios from "axios"
const emits = defineEmits(["selectedValue", "sortBy", "selectedStatus"])

const props = defineProps({
  options: { type: Array, default: () => [] },
  headers: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  mode: { type: String, default: "" }
})
const search = ref("")

const showContent = ref(5)

const page = ref(1)

const lastSelectedPage = ref()

const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"

const start = ref(showContent.value * (page.value - 1))
const changeStatusList = ref([])

const end = ref(
  page.value == 1 ? showContent.value : showContent.value * page.value
)

const searchResult = ref(0)

// const totalPage = ref(Math.ceil(Math.round(props.columns.length) / Math.round(showContent.value)))


function selectedSize(size) {
  showContent.value = size
  if(page.value > totalPage.value){
    page.value = totalPage.value
  }
  start.value = showContent.value * (page.value - 1)
  console.log(start.value)
  end.value = page.value == 1 ? showContent.value : showContent.value * page.value
  console.log(end.value)
  
}

function selectedPage(pg) {
  lastSelectedPage.value = pg
  page.value = pg
  start.value = showContent.value * (page.value - 1)
  end.value =
    page.value == 1 ? showContent.value : showContent.value * page.value
}

function changeSelectedValue(selectedValue) {
  emits("selectedValue", selectedValue)
}


const filteredDistrict = computed(() => {
  start.value = showContent.value * (page.value - 1)
  end.value = page.value == 1 ? showContent.value : showContent.value * page.value
  if (search.value == "") {
    return props.columns.slice(start.value, end.value)
  } else if (search.value != "") {
    searchResult.value = 0
    return props.columns
      .filter((col) => {
        if(col.district.toLowerCase().includes(search.value.toLowerCase())){
          searchResult.value++
          return col.district.toLowerCase()
        }
      })
      .slice(start.value, end.value)
  }

  return ""
})
console.log(filteredDistrict.value)

const totalPage = computed(() => {
  const pageNum = Math.ceil(
      Math.round(search.value == ""? props.columns.length : searchResult.value) / Math.round(showContent.value)
)

   if(pageNum != 0 && pageNum < page.value){
    page.value = pageNum

  }else if(pageNum == page.value){

  }else if(lastSelectedPage.value != undefined){
    page.value = lastSelectedPage.value
  }
  return pageNum

})

function sortBy(sorted) {
  emits("sortBy", sorted)
}

function selectedStatus(selectStatus) {
  emits("selectedStatus", selectStatus)
}

function changeStatus(status, id) {
  changeStatusList.value.push({status: status, id: id})
  const removeDuplicate = (list) => list.id == id
  const duplicate = changeStatusList.value.findIndex(removeDuplicate)
  console.log(duplicate)
  console.log(changeStatusList.value[0].id)
  if(duplicate != changeStatusList.value.length - 1){
    changeStatusList.value.splice(duplicate, 1)
  }

}

function confirmChangeStatus(status) {
  if(status == 'confirm'){
    for(let i = 0; i < changeStatusList.value.length; i++){
      axios.put(`${url}/admin/updateRainStatus`, { 
        rainStatus: changeStatusList.value[i].status,
        _id: changeStatusList.value[i].id
      },
      {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    )
    window.location.reload();
  }
  }
  else if(status == 'discard'){
    changeStatusList.value = []
    window.location.reload()
  }
}

</script>

<template>
  <div
    class="table"
  >
    <div v-if="mode == 'districtReport' && options.length != 0">
      <div class="header">
        <h3>Rain reports</h3>
        <span class="text-sm">Report 50 district of Bangkok</span>
      </div>

      <div class="text-right">
        <input
          v-model="search"
          type="search"
          placeholder="Search by district name"
          class="bg-black rounded-full px-10 py-1 pr-32 text-sm mb-3"
          required
        />
        <div class="time">
          <span class="text-sm">Report time</span>
          <DropDownComponent
            :options="options"
            :type="'dropdown'"
            @selected-value="changeSelectedValue"
          />
        </div>
        <div v-if="changeStatusList.length != 0" class="pt-5 ">
          <span>Do You Want To Save This Change? </span> <br />
          <button class="bg-green-700 mt-2 mr-5" @click="confirmChangeStatus('confirm')">Confirm</button>
          <button class="bg-red-700" @click="confirmChangeStatus('discard')">Discard</button>
        </div>
      </div>
    </div>

    <div class="sub-header" :class="headers.length == 1 ? 'flex justify-center' : 'flex justify-between'">
      <div
        v-for="(header, index) in headers"
        :key="index"
      >
        <div
          class="pb-10 text-left"
          :style="
            header == headers[0]
              ? 'padding-left: 3em'
              : '' || filteredDistrict.length == 0
              ? 'padding-right: 10em'
              : ''
          "
        >
          {{ header }} 
          <DropDownComponent
            :type="'icon'"
            :icon-name="header.toLowerCase()"
            :options="['No rain', 'Light rain', 'Moderate rain', 'Heavy rain']"
            @sort-by="sortBy"
            @selected-status="selectedStatus"
          />
        </div>
        <div
          v-for="(col, i) in filteredDistrict"
          :key="i"
          class="pt-4 pb-4 my-5 px-14 rounded-xl text-base "
          :class="
            col[header.toLowerCase()] == col.status
              ? col[header.toLowerCase()].replace(/\s+/g, '-').toLowerCase()
              : ''
          "
        >
        {{ col[(header.toLowerCase() == 'district'? 'district' : header.toLowerCase() == 'status' ? 'status' : '')] }}
        <select name="" id="" v-if="header.toLowerCase() == 'change status'" @change="changeStatus($event.target.value, col.id)">
          <option :selected=" col.status.toLowerCase() == 'no rain'">No Rain</option>
          <option :selected=" col.status.toLowerCase() == 'light rain'">Light Rain</option>
          <option :selected=" col.status.toLowerCase() == 'moderate rain'">Moderate Rain</option>
          <option :selected=" col.status.toLowerCase() == 'heavy rain'">Heavy Rain</option>
        </select>
        
        </div>
      </div>
    </div>
    <PaginationComponent
      :page-selected="page"
      :total-page="totalPage"
      @selected-size="selectedSize"
      @selected-page="selectedPage"
    />
  </div>
</template>

<style scoped>
.table {
  padding: 2em 5em;
  margin: auto;
  background-color: #171717;
  border-radius: 10px;
  width: 60%;
}

.header {
  text-align: left;
  line-height: 0.75rem;
  margin-top: 1em;
  float: left;
}

.sub-header {
  padding: 1em 0em;


  background-color: #353535;
  background: linear-gradient(to bottom, #353535 4em, transparent 0);
  margin: 1.5em 0;
  border-radius: 10px;
  font-size: large;
}

.time {
  padding-top: 1em;
}




.heavy-rain {
  color: #f01c1c;
  background: linear-gradient(to bottom, #353535 4em, transparent 0);
}

.moderate-rain {
  color: #fd9800;
  background: linear-gradient(to bottom, #353535 4em, transparent 0);
}

.light-rain {
  color: #46f01c;
  background: linear-gradient(to bottom, #353535 4em, transparent 0);
}

.no-rain {
  color: #4e7fdf;
  background: linear-gradient(to bottom, #353535 4em, transparent 0);
}


</style>
