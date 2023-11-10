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
          width="25"
          height="25"
        />
      </span>
      {{ btnProperty.btnName }}
    </button>
  </div>
</template>

<style scoped>
.login {
  background-color: #3b95d6;
}
</style>
