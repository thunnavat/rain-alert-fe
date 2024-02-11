<script setup>
defineProps({
  btnProperty: { type: Object, default: () => {} }
})
</script>

<template>
  <div>
    <button class="default" :class="btnProperty.class" :style="{backgroundColor: btnProperty.bgColor, width: btnProperty.width, height: btnProperty.height, justifyContent: btnProperty.iconPath ? '' : 'space-evenly'}">
      <span v-if="btnProperty.iconPath != ''">
        <img
          :src="btnProperty.iconPath"
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