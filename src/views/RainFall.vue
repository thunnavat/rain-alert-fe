<script setup>
import TableComponent from '../components/TableComponent.vue';

const options = ['25 October 2023 15.00', '25 October 2023 16.00']
const headers = ['DISTRICT', 'Status']
const columns = [
    {district: 'Bangkok noi', status: 'HEAVY RAIN'},
    {district: 'Dong maung', status: 'HEAVY RAIN'},
    {district: 'Phasi Charon', status: 'MODERATE RAIN'},
    {district: 'Thung kru', status: 'LIGHT RAIN'},
    {district: 'Wang thong lang', status: 'NO RAIN'}
    ]
</script>

<template>
    <div>
        <TableComponent :options="options" :headers="headers" :columns="columns" :mode="'districtReport'" />
    </div>
    
</template>


<style scoped>
</style>