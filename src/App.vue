<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
document.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
        event.preventDefault();
    }
   
    if ((event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || 
        (event.ctrlKey && event.key === 'U')) {
        event.preventDefault();
    }
});
</script>