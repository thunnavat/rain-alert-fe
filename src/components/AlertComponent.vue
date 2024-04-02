<script setup>
const props = defineProps({
  alertType: {type: String, default:"ERROR"},
  alertMsg: {type: String, default: ""}
})
</script>

<template>
    <div>
        <div
        v-show="alertMsg != '' && alertType == 'ERROR'"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-3 rounded relative"
        role="alert"
        >
        <span class="block sm:inline">{{ alertMsg }}</span>
        </div>
        <div
        v-show="alertMsg != '' && alertType == 'SUCCESS'"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 my-3 rounded relative"
        role="alert"
        >
        <span class="block sm:inline">{{ alertMsg }}</span>
        </div>
    </div>
</template>
<style scoped>

</style>