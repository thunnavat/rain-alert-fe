<script setup>
import router from "../router"
import { ref } from "vue"
defineProps({
  navNames: { type: Array, default: () => [] },
  navSelected: { type: String, default: "" }
})
const selected = ref("Home")

function changePage(route) {
  selected.value = route
  router.push({ name: route })
}
</script>

<template>
  <div class="navDiv">
    <span
      v-for="(navName, index) in navNames"
      :key="index"
      :style="
        navName == (navSelected == '' ? selected : navSelected)
          ? { 'background-color': 'black' }
          : ''
      "
      class="navSpan"
      @click="changePage(navName)"
      >{{ navName }}
    </span>
  </div>
</template>

<style scoped>
.navDiv {
  display: flex;
  justify-content: space-between;
  width: 750px;
  height: 50px;
  background-color: #171715;
  padding: 10px;
  border-radius: 10px;
}

.navSpan {
  padding: 10px;
  background-color: #141415;
  width: 150px;
  border-radius: 10px;
}

.navSpan:hover {
  background-color: black;
}
</style>
