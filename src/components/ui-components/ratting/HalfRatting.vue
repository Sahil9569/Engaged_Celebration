<script setup lang="ts">
import { ref } from "vue";
const rating2 = ref(2.5);
</script>
<template>
    <div>
    <v-rating half-increments v-model="rating2"  density="compact" color="warning"></v-rating>
    </div>
</template>
