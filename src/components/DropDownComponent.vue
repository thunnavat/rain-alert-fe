<script setup>
import { ref } from "vue"
const props = defineProps({
  options: { type: Array, default: () => [] },
  type: { type: String, default: "" },
  iconName: { type: String, default: "" }
})

const emits = defineEmits(["selectedValue", "sortBy", "selectedStatus"])
const selectedValue = ref(props.options[0])
const isSelected = ref(false)

const selectedStatus = ref([])

const sort = ref("")

function changeSelected(selected) {
  selectedValue.value = selected
  isSelected.value = false
  emits("selectedValue", selectedValue.value)
}

function sortBy(sorted) {
  if (sort.value == sorted) {
    sort.value = ""
    emits("sortBy", "classic")
  } else if (sort.value != sorted) {
    sort.value = sorted
    emits("sortBy", sorted)
  }
}

function sortSelected(option) {
  if (selectedStatus.value.includes(option)) {
    const remove = selectedStatus.value.findIndex((e) => e == option)
    selectedStatus.value.splice(remove, 1)
    emits(
      "selectedStatus",
      selectedStatus.value.length == 4 || selectedStatus.value.length == 0
        ? "all"
        : selectedStatus.value
    )
  } else if (!selectedStatus.value.includes(option)) {
    selectedStatus.value.push(option)
    emits(
      "selectedStatus",
      selectedStatus.value.length == 4 || selectedStatus.value.length == 0
        ? "all"
        : selectedStatus.value
    )
  }
}
</script>

<template>
  <div
    v-if="type == 'dropdown'"
    class="dropdown"
  >
    <button
      class="dropbtn"
      :style="
        isSelected ? 'border-radius: 10px 10px 0 10px;' : 'border-radius: 10px;'
      "
      @click="isSelected = !isSelected"
    >
      {{ selectedValue }}
      <img
        src="../assets/DropdownIcon.svg"
        width="20"
        height="20"
        :style="isSelected ? 'transform: scale(-1)' : ''"
        class="absolute"
      />
    </button>
    <div
      v-show="isSelected"
      id="myDropdown"
      class="dropdown-content show"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
        @click="changeSelected(option)"
      >
        {{ option }}
      </span>
    </div>
  </div>

  <div
    v-if="type == 'icon' && iconName == 'status'"
    class="icon"
  >
    <img
      src="../assets/StatusIcon.svg"
      width="20"
      height="20"
      class="hover:cursor-pointer px-1 absolute -bottom-1"
      @click="isSelected = !isSelected"
    />

    <div
      v-show="isSelected"
      class="icon-content show bg-gray-800 absolute left-0 top-2"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
      >
        <input
          :id="option"
          :name="option"
          type="checkbox"
          @click="sortSelected(option, index)"
        />
        <label :for="option">{{ option }}</label>
      </span>
    </div>
  </div>

  <div
    v-if="type == 'icon' && iconName == 'district'"
    class="icon"
  >
    <img
      src="../assets/DistrictArrow.svg"
      width="20"
      height="20"
      class="cursor-pointer px-1 absolute bottom-0 scale-100 opacity-50"
      :style="sort == 'asc' ? 'opacity: 100' : ''"
      @click="sortBy('asc')"
    />
    <img
      src="../assets/DistrictArrow.svg"
      width="20"
      height="20"
      class="cursor-pointer px-1 absolute -scale-100 -bottom-3 opacity-50"
      :style="sort == 'desc' ? 'opacity: 100' : ''"
      @click="sortBy('desc')"
    />
  </div>
</template>

<style scoped>
.dropbtn {
  background-color: #5598fd;
  color: white;
  padding: 16px;
  user-select: none;
  padding-right: 2.5em;
  margin-left: 1em;
  font-size: 14px;
  border: none;
  cursor: pointer;
  outline: none;
}

/* .dropbtn:hover,
.dropbtn:focus {
  background-color: #4e7fdf;
} */
.dropbtn:focus {
  border: none;
}

.dropdown {
  /* float: right; */
  position: relative;
  display: inline-block;
}

.icon {
  /* float: right; */
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #508be4;
  min-width: 160px;
  overflow: auto;
  user-select: none;
  font-size: 14px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 10px 10px;
  right: 0;
  z-index: 1;
  max-height: 15em;
}

.icon-content {
  display: none;
  position: absolute;
  min-width: 160px;
  overflow: auto;
  user-select: none;
  font-size: 14px;
  border: rgba(255, 255, 255, 0.5) solid 1px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  right: 0;
  z-index: 1;
  max-height: 15em;
}

.dropdown-content span {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.icon-content span {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.dropdown span:hover {
  background-color: #4e7fdf;
}

.show {
  display: block;
}

.statusIcon {
  cursor: pointer;
  position: absolute;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
</style>
