<script setup>
import InformationBox from "../components/InformationBox.vue"
const infoBoxs = [
  {
    value:
      "Bangkok and Perimeters | Isolated thundershowers. Minimum temperature 25-26 °C. Maximum temperature 33-36 °C. Easterly winds 10-25 km/hr."
  }
]
const iconPath = "src/assets/rain-status/"
const favorites = [
  {
    district: "Bangkok noi",
    status: "Heavy rain",
    icon: iconPath + "heavy-rain.svg"
  },
  {
    district: "Phasi Charon",
    status: "Moderate rain",
    icon: iconPath + "moderate-rain.svg"
  },
  {
    district: "Thung kru",
    status: "Light rain",
    icon: iconPath + "light-rain.svg"
  },
  {
    district: "Wang thong lang",
    status: "No rain",
    icon: iconPath + "no-rain.svg"
  }
]
</script>

<template>
  <div class="page">
    <div class="header">
      <h1 class="header-text">RAINALERT</h1>
    </div>
    <div class="content">
      <h3>Daily Weather Forecast</h3>
      <InformationBox :info-boxs="infoBoxs" />
      <InformationBox :info-boxs="favorites" />
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.header {
  padding: 6em;
  margin-left: 2em;
  margin-right: 3em;
  background-image: url("../assets/Title_Background.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
}

.header-text {
  font-size: 60px;
  background-image: linear-gradient(yellow, white);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 300% 300%;
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
  margin-left: 2em;
}
</style>
