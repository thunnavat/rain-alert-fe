<script setup>
const props = defineProps({
  size: { type: String, default: "" }
})
</script>

<template>
    <div class="flex justify-center">
        <div class="loader" :style="{width: size, height: size}"></div>
    </div>
</template>
<style scoped>
    .loader {
  border: 10px solid #232323;
  border-radius: 50%;
  border-top: 11px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>