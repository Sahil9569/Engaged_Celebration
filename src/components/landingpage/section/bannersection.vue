<script setup lang="ts">
import { ref } from 'vue';
/* Breadcrumb component */
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
// theme breadcrumb
const page = ref({ title: 'Contact Us' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '#'
    },
    {
        text: 'Contact',
        disabled: true,
        href: '#'
    }
]);
</script>
<template>
    <section class="mainbanner py-16 mt-16">
        <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold">
            Contact  <span class="text-secondary">Us</span>
        </h2>      
</section>
</template>