<script setup>
import { ref, computed } from "vue"
import PaginationComponent from "./PaginationComponent.vue"
import DropDownComponent from "./DropDownComponent.vue"
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

const start = ref(showContent.value * (page.value - 1))

const end = ref(
  page.value == 1 ? showContent.value : showContent.value * page.value
)

// const totalPage = ref(Math.ceil(Math.round(props.columns.length) / Math.round(showContent.value)))
const totalPage = computed(() => {
  return Math.ceil(
    Math.round(props.columns.length) / Math.round(showContent.value)
  )
})

function selectedSize(size) {
  showContent.value = size
  start.value = showContent.value * (page.value - 1)
  end.value =
    page.value == 1 ? showContent.value : showContent.value * page.value
  totalPage.value = Math.ceil(
    Math.round(props.columns.length) / Math.round(showContent.value)
  )
}

function selectedPage(pg) {
  page.value = pg
  start.value = showContent.value * (page.value - 1)
  end.value =
    page.value == 1 ? showContent.value : showContent.value * page.value
}

function changeSelectedValue(selectedValue) {
  emits("selectedValue", selectedValue)
}

const filteredDistrict = computed(() => {
  if (search.value == "") {
    return props.columns.slice(start.value, end.value)
  } else if (search.value != "") {
    return props.columns
      .filter((col) => {
        return col.district.toLowerCase().includes(search.value.toLowerCase())
      })
      .slice(start.value, end.value)
  }

  return ""
})

function sortBy(sorted) {
  emits("sortBy", sorted)
}

function selectedStatus(selectStatus) {
  emits("selectedStatus", selectStatus)
}
</script>

<template>
  <div
    v-if="options.length != 0"
    class="table"
  >
    <div v-if="mode == 'districtReport'">
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
      </div>
    </div>

    <div class="sub-header">
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
          class="pt-4 pb-4 my-5 px-14 rounded-xl text-base"
          :class="
            col[header.toLowerCase()] == col.status
              ? col[header.toLowerCase()].replace(/\s+/g, '-').toLowerCase()
              : ''
          "
        >
          {{ col[header.toLowerCase()] }}
        </div>
      </div>
    </div>
    <PaginationComponent
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
  display: flex;
  justify-content: space-between;
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

select {
  background-image: url(../assets/DropdownIcon.svg);
  background-size: 33px;
  background-repeat: no-repeat;
  background-position: calc(100% - 0.25rem);
  appearance: none;
}

select:focus {
  outline: none;
  background-size: 33px;
  background-repeat: no-repeat;
  background-position: calc(100% - 0.25rem);
  appearance: none;
}

select:focus {
  outline: none;
  background-size: 33px;
  background-repeat: no-repeat;
  background-position: calc(100% - 0.25rem);
  appearance: none;
}

select:focus {
  outline: none;
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
