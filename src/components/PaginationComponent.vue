<script setup>
import { ref } from 'vue'
const emits = defineEmits(['selectedSize', 'selectedPage'])
defineProps({
  totalPage: { type: Number, default: 1 },

})

const shownTotal = [3, 5, 7]
const selectedSize = ref(5)
const selectedPage = ref(1)

function selectPage (page) {
    selectedPage.value = page
    emits('selectedPage', selectedPage.value)
}

function backward () {
    selectedPage.value -= 1
    emits('selectedPage', selectedPage.value)
}

function forward () {
    selectedPage.value += 1
    emits('selectedPage', selectedPage.value)
}
</script>

<template>
  <div class="pages">
    <div @click="backward()" class="page" :class="totalPage == 1 || selectedPage == 1 ? 'disabled' : ''">
        &lt;
    </div>
    <div
      v-for="page in totalPage"
      :key="page"
      :class="Math.round(page) == Math.round(selectedPage) ? 'selected' : ''"
      class="page"
      @click="selectPage(page)"
    >
      {{ page }}
    </div>
    <div @click="forward()" class="page" :class="totalPage == 1 || selectedPage == totalPage ? 'disabled' : ''">
        &gt;
    </div>
    <div class="pageSize">
        <span class="opacity-50">SHOW</span>
        <select
            v-model="selectedSize"
            class="pl-9 pr-11 py-5"
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
  padding: 1em 1.5em;
  margin: 0 1.25rem;
  border-radius: 10px;
  cursor: pointer;
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
