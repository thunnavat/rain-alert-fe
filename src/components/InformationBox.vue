<script setup>
const props = defineProps({
  infoBoxs: { type: Array, default: () => [] }
})

function imageUrl(array){
  return new URL(`${props.infoBoxs[array].icon}`, import.meta.url).href
} 

</script>

<template>
  <div class="information-box flex">
    <span
      v-for="(infoBox, index) in infoBoxs"
      :key="index"
      class="pb-8"
    >
      <div
        v-if="infoBox.value"
        class="forecast"
      >
        <h1 class="RightToLeft">{{ infoBox.value }}</h1>
      </div>

      <div
        v-if="!infoBox.value"
        class="info w-44 mx-3 md:w-64"
      >
        <h3>{{ infoBox.district }}</h3>
        <div class="subHeader">{{ infoBox.status }}</div>
        <img
          :src="imageUrl(index)"
          alt=""
        />
      </div>
    </span>
  </div>
</template>

<style scoped>
img {
  padding: 10px 0;
  width: 25px;
}

.forecast {
  background-color: aqua;
  background-image: linear-gradient(rgb(69, 67, 67), black);
  padding: 1px;
  white-space: nowrap;
  height: 4em;
  border-radius: 10px;
  border: thin solid grey;
}

.RightToLeft {
  position: relative;
  top: -20px;
  font-size: 40px;
  font-family: "Space Mono";
  animation: RightToLeft 30s infinite linear;
}

@keyframes RightToLeft {
  from {
    transform: translateX(50%);
  }
  to {
    transform: translateX(-50%);
  }
}
.information-box {
  /* margin-right: 3em; */
  flex-wrap: wrap;
  justify-content: center;
  /* margin-bottom: 5em; */
  /* overflow: hidden; */
  border-radius: 10px;
}
.info {
  padding: 1px 20px;
  /* width: 15em; */
  background-image: linear-gradient(rgb(69, 67, 67), black);
  border: thin solid grey;
  border-radius: 10px;
  /* margin-left: 2em; */
}

.subHeader {
  position: relative;
  top: -7px;
  padding-bottom: 5px;
  font-family: "Space Mono";
  /* font-weight: 400; */
  font-size: 13px;
}
</style>
