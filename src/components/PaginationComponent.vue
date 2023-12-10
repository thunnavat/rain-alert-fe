<script setup>
import { ref, computed } from "vue"
const emits = defineEmits(["selectedSize", "selectedPage"])
const props = defineProps({
  totalPage: { type: Number, default: 1 }
})

const shownTotal = [3, 5, 7]
const selectedSize = ref(5)
const selectedPage = ref(1)
const getTotalPage = computed(() => {
  const pages = ref([])
  let onsides = 1
  for (let i = 1; i <= props.totalPage; i++) {

    if (
      i == 1 ||
      (selectedPage.value - onsides <= i && selectedPage.value + onsides >= i) ||
      i == selectedPage.value ||
      i == props.totalPage
    ) {
      pages.value.push(i)
    } else if (
      i == selectedPage.value + (onsides + 1)
    ) {
      pages.value.push("...")
    }
  }
  console.log(pages.value)
  return pages.value
})

function navigate(page) {
  if (page == "forward" && selectedPage.value < props.totalPage) {
    selectedPage.value += 1
  } else if (page == "backward" && selectedPage.value > 1) {
    selectedPage.value -= 1
  } else if (typeof page == "number") {
    selectedPage.value = page
  }
  emits("selectedPage", selectedPage.value)
}
</script>

<template>
  <div class="pages">
    <div
      :class="totalPage == 1 || selectedPage == 1 ? 'disabled' : ''"
      class="page"
      @click="navigate('backward')"
    >
      &lt;
    </div>

    <div
      v-if="totalPage <= 5"
      class="flex"
    >
      <div
        v-for="page in getTotalPage"
        :key="page"
        :class="Math.round(page) == Math.round(selectedPage) ? 'selected' : ''"
        class="page"
        @click="navigate(page)"
      >
        {{ page }}
      </div>
    </div>

    <div
      v-if="totalPage > 5"
      class="flex"
    >
      <div
        v-for="page in getTotalPage"
        :key="page"
        :class="Math.round(page) == Math.round(selectedPage) ? 'selected' : ''"
        class="page"
        @click="navigate(page)"
      >
        {{ page }}
      </div>
    </div>

    <div
      class="page"
      :class="totalPage == 1 || selectedPage == totalPage ? 'disabled' : ''"
      @click="navigate('forward')"
    >
      &gt;
    </div>
    <div class="pageSize">
      <span class="opacity-50">SHOW</span>
      <select
        v-model="selectedSize"
        class="pl-7 pr-9 py-4"
        @change="$emit('selectedSize', selectedSize)"
      >
        <option
          v-for="(option, index) in shownTotal"
          :key="index"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.pages {
  display: flex;
  justify-content: space-evenly;
}

.page {
  background-color: #353535;
  padding: 0.75em 1.25em;
  margin: 0 1em;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}

.page:hover {
  background-color: #000000;
}

.selected {
  background-color: #000000;
}

.pageSize {
  background-color: #353535;
  padding: 0em 2em;
  /* margin: 0em 1em; */
  border-radius: 10px;
  cursor: pointer;
  margin-left: auto;
}

select {
  background-image: url(../assets/DropdownIcon.svg);
  background-size: 33px;
  background-repeat: no-repeat;
  background-position: calc(100% - 0.25rem);
  appearance: none;
  border: none;
  background-color: #353535;
  cursor: pointer;
}

select:focus {
  outline: none;
}

.disabled {
  opacity: 50%;
  cursor: not-allowed;
}

.disabled:hover {
  background-color: #353535;
}
</style>
