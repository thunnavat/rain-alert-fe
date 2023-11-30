<script setup>
defineProps({
  btnProperty: { type: Object, default: () => {} }
})
</script>

<template>
  <div>
    <button :class="btnProperty.class">
      <span v-if="btnProperty.iconPath != ''">
        <img
          :src="btnProperty.iconPath"
          :alt="btnProperty.iconAlt"
          width="30"
          height="30"
          style="padding-right: 7px"
        />
      </span>
      {{ btnProperty.btnName }}
    </button>
  </div>
</template>

<style scoped>
.login {
  background-color: #3b95d6;
  display: flex;
  align-items: center;
}

.login:hover {
  animation: move 0.15s 2 alternate;
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
