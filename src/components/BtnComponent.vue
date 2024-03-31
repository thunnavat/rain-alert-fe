<script setup>
const props = defineProps({
  btnProperty: { type: Object, default: () => {} }
})

function imageUrl(){
  return new URL(`${props.btnProperty.iconPath}`, import.meta.url).href
} 
</script>

<template>
  <div>
    <button class="default" :class="btnProperty.class" :style="{backgroundColor: btnProperty.bgColor, width: btnProperty.width, height: btnProperty.height, justifyContent: btnProperty.iconPath ? '' : 'space-evenly'}">
      <span v-if="btnProperty.iconPath != '' && btnProperty.iconPath != undefined">
        <img
          :src="imageUrl()"
          :alt="btnProperty.iconAlt"
          :width="btnProperty.iconWidth ? btnProperty.iconWidth : 30"
          :height="btnProperty.iconHeight ? btnProperty.iconHeight : 30"
          style="padding-right: 7px"
        />
      </span>
      {{ btnProperty.btnName }}
    </button>
  </div>
</template>

<style scoped>

.default {
  display: flex;
  align-items: center;
  white-space: pre-line;
  background-color: #484848;
}


.login:hover {
  animation: move 0.15s 2 alternate;
}

.Login:focus {
  outline: none;
}

@keyframes move {
  from {
    width: 120px;
  }
  to {
    width: 125px;
  }
}
</style>