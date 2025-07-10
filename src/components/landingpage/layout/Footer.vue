<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue'
import Footer from '@/components/landingpage/layout/Footer.vue';

import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
const editdialog = ref(false);
const fullpageloader = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')

const footer_id                 = ref();
const fcontent                  = ref([]);
const imageUrl                  = ref();
const title                     = ref();
const facebook_or_vendors       = ref();
const twitter_or_couples        = ref();
const whatsapp                  = ref();
const pinterest                  = ref("");
const indeed                     = ref("");
const youtube                    = ref("");
const discord                    = ref("");
const tiktok                     = ref("");
const instgram                  = ref();
const image1                   = ref();
const image2       = ref();
const image3        = ref();
const image4                  = ref();
const image5                  = ref();
const image6                  = ref();


(async function() {
    let fdta = '';
    const response = await axios.get(`/home/handle_wcontent`);

    if (response.data.status == "SENT") {
        console.log('-ddddtttttt----',response.data)
        console.log('footer_data:-----', response.data.footer_data);
        title.value                 = response.data.footer_data['title']
        facebook_or_vendors.value   = response.data.footer_data['facebook_or_vendors']
        twitter_or_couples.value    = response.data.footer_data['twitter_or_couples']
        whatsapp.value              = response.data.footer_data['whatsapp']
        pinterest.value = response.data.footer_data['pinterest'];
        indeed.value = response.data.footer_data['indeed'];
        youtube.value = response.data.footer_data['youtube'];
        discord.value = response.data.footer_data['discord'];
        tiktok.value = response.data.footer_data['tiktok'];
        instgram.value              = response.data.footer_data['instgram']
        image1.value              = response.data.footer_data['image1']
        image2.value              = response.data.footer_data['image2']
        image3.value              = response.data.footer_data['image3']
        image4.value              = response.data.footer_data['image4']
        image5.value              = response.data.footer_data['image5']
        image6.value              = response.data.footer_data['image6']

    }
})();





</script>

<template>
    <div class="custom-footer">
        <v-container class="container-width">
            <v-row class="justify-center py-md-10 py-6">
                <v-col cols="12" md="6" lg="3" sm="6">
                    <div class="mt-md-8 mt-2 mb-md-4 mb-1 px-md-4 px-2">
                        <!-- <img src="@/assets/images/logos/logoIcon.svg" alt="favicon" /> -->
                        <router-link to="/"
                            class="router-link-active router-link-exact-active sailFont text-primary footer-text text-decoration-none"><img src="@/assets/images/logos/Logo-a12.png" class="w-100">
                        </router-link>
                        <p  v-if="title" class="text-subtitle-1 mt-2">
                            {{ title }}
                        </p>
                        <p v-else class="text-subtitle-1 mt-2">
                            Our platform offers a seamless experience where couples can explore, compare, and connect with vendors who align with their vision and style.
                        </p>   
                        <ul class="d-flex social-icon flex-wrap">
                            <li v-if="facebook_or_vendors" class="px-1 py-2">
                                <a v-if="facebook_or_vendors" 
                                :href="`https://www.facebook.com/${encodeURIComponent(facebook_or_vendors)}`" 
                                target="_blank" 
                                class="text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-facebook">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                    </svg>
                                </a>

                                <a v-else href="https://www.facebook.com" target="_blank" class="text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-facebook">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                    </svg>
                                </a>
                                
                            </li>

                            <li v-if="twitter_or_couples" class="px-1 py-2">
                            <a v-if="twitter_or_couples" 
                            :href="`https://twitter.com/${encodeURIComponent(twitter_or_couples)}`" 
                            target="_blank" 
                            class="text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                </svg>
                            </a>

                            <a v-else href="https://www.twitter.com"  target="_blank" class="text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                </svg>
                            </a>

                            </li>

                            <li v-if="instgram"  class="px-1 py-2">
                                <a v-if="instgram" 
                                :href="`https://www.instagram.com/${encodeURIComponent(instgram)}`" 
                                target="_blank" 
                                class="text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                        <path d="M16.5 7.5l0 .01" />
                                    </svg>
                                </a>

                                <a v-else href="https://www.instagram.com" target="_blank" class="text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                        <path d="M16.5 7.5l0 .01" />
                                    </svg>
                                </a>
                            </li>

                            <!-- <li class="px-1 py-2">
                                <a v-if="whatsapp" :href="'https://wa.me/' + whatsapp" target="_blank" class="text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                                    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                                </svg>
                                </a>
                                <a v-else href="https://www.whatsapp.com" target="_blank" class="text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                                    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                                </svg>
                                </a>
                            </li> -->

                            <li v-if="pinterest" class="px-1 py-2">
                                <a v-if="pinterest" :href="'https://www.pinterest.com/' + pinterest"
                                target="_blank" class="text-secondary">
                               <svg  xmlns="http://www.w3.org/2000/svg"  width="22"  height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-pinterest"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l4 -9" /><path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>
                                </a>
                                <a v-else href="https://www.pinterest.com" target="_blank" class="text-secondary">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="22"  height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-pinterest"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l4 -9" /><path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                </svg>
                                </a>
                            </li>


                            <li v-if="indeed" class="px-1 py-2">
                                <a v-if="indeed" :href="indeed" target="_blank" class="text-secondary">
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" /></svg>
                                </a>
                                <a v-else href="https://www.linkedin.com" target="_blank" class="text-secondary">
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" /></svg>
                                </a>
                            </li>

                            <li v-if="youtube" class="px-1 py-2">
                                <a v-if="youtube" :href="youtube" target="_blank" class="text-secondary">
                               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" /><path d="M10 9l5 3l-5 3z" /></svg>
                                </a>
                                <a v-else href="https://www.youtube.com" target="_blank" class="text-secondary">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" /><path d="M10 9l5 3l-5 3z" /></svg>
                                </a>
                            </li>

                            <li v-if="discord" class="px-1 py-2">
                                <a v-if="discord"  :href="discord" target="_blank" class="text-secondary">
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" /><path d="M7 16.5c3.5 1 6.5 1 10 0" /></svg>
                                </a>
                                <a v-else href="https://www.discord.com" target="_blank" class="text-secondary">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" /><path d="M7 16.5c3.5 1 6.5 1 10 0" /></svg>
                                </a>
                            </li>


                            <li v-if="tiktok" class="px-1 py-2">
                                <a v-if="tiktok" :href="tiktok" target="_blank" class="text-secondary">
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" /></svg>
                                </a>
                                <a v-else href="https://www.tiktok.com" target="_blank" class="text-secondary">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" /></svg>
                                </a>
                            </li>

                        </ul>
                    </div>
                </v-col>
                <v-col cols="12" md="6" lg="2" sm="6">
                    <div class="mt-md-8 mt-2 mb-md-4 mb-1 px-md-4 px-2">
                        <h2 class="footer-heading">Information</h2>
                        <ul class="footer-list">
                            <li><router-link variant="text" to="/customer" class="ps-0">For Customer</router-link></li>
                            <li><router-link variant="text" to="/for-vendor" class="ps-0">For Vendor</router-link></li>
                            <li><router-link variant="text" to="/how-it-works" class="ps-0">How it Works</router-link>
                            </li>
                            <li><router-link variant="text" to="/faq" class="ps-0">FAQ</router-link></li>
                            <li><router-link variant="text" to="/contact" class="ps-0">Contact</router-link></li>
                            <li><router-link variant="text" to="/privacy-policy" class="ps-0">Privacy Policy</router-link></li>
                        </ul>
                    </div>
                </v-col>
                <v-col cols="12" md="6" lg="4" sm="6">
                    <div class="mt-md-8 mt-2 mb-md-4 mb-1 px-md-4 px-2">
                        <h2 class="footer-heading">Contact</h2>
                        <ul class="inquiry-list">
                            <li>
                                    <a href="mailto:party@engagedcelebration.com" class="text-decoration-none d-flex align-center">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                        <path d="M3 7l9 6l9 -6" />
                                        </svg>
                                        engagedcelebration@gmail.com
                                    </a>
                                    </li>

                                    <li><router-link variant="text" to="/contact" class="ps-0"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                    </svg>(866) 346-2155</router-link></li>

                            <!-- <li><router-link to="tel:(757) 325-0583" class="text-decoration-none d-flex align-center"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                    </svg>(866) 346-2155</router-link></li> -->



                            <!-- <li>
                                <router-link to="javascript:void(0)" class="text-decoration-none d-flex align-center">
                                <svg
                                        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                        <path
                                            d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                    </svg>
                                    65 Buxton Ave, Newport News, Virginia 23507 
                                </router-link>
                            </li> -->
                        </ul>
                    </div>
                </v-col>
                <v-col cols="12" md="6" lg="3" sm="6">
                    <div class="mt-md-8 mt-2 mb-md-4 mb-1 px-md-4 px-2">
                        <h2 class="footer-heading">Portfolios</h2>
                        <ul class="d-flex instagram">
                            <li>
                                <a v-if="image1" :href="BASE_URL+image1" bis_skin_checked="1">
                                    <img  :src="BASE_URL+image1" alt="" class="w-100">
                                </a>
                                <a v-else href="@/assets/images/website/decoration1.jpg" bis_skin_checked="1">
                                <img  src="@/assets/images/website/decoration1.jpg"
                                        alt="" class="w-100"></a>
                            </li>
                            <li>
                                <a v-if="image2" :href="BASE_URL+image2" bis_skin_checked="1">
                                <img v-if="image2" :src="BASE_URL+image2" alt="" class="w-100"></a>
                                <a v-else href="@/assets/images/website/photograph.jpg" bis_skin_checked="1">
                                <img  src="@/assets/images/website/photograph.jpg"
                                        alt="" class="w-100"></a>
                            </li>
                            <li>
                                <a v-if="image3" :href="BASE_URL+image3" bis_skin_checked="1">
                                    <img v-if="image3" :src="BASE_URL+image3" alt="" class="w-100">
                                </a>
                                <a v-else href="@/assets/images/website/DJ.jpg" bis_skin_checked="1">
                                    <img src="@/assets/images/website/DJ.jpg"
                                        alt="" class="w-100">
                                </a>
                            </li>
                            <li>
                                <a v-if="image4" :href="BASE_URL+image4" bis_skin_checked="1">
                                    <img v-if="image4" :src="BASE_URL+image4" alt="" class="w-100">
                                </a>
                                <a v-else href="@/assets/images/website/DJ1.jpg" bis_skin_checked="1">
                                    <img src="@/assets/images/website/DJ1.jpg" alt=""
                                        class="w-100">
                                </a>
                            </li>
                            <li>
                                <a v-if="image5" :href="BASE_URL+image5" bis_skin_checked="1">
                                    <img v-if="image5" :src="BASE_URL+image5" alt="" class="w-100">
                                </a>
                                <a v-else href="@/assets/images/website/jwellary.jpg" bis_skin_checked="1">
                                    <img src="@/assets/images/website/jwellary.jpg" alt=""
                                        class="w-100">
                                </a>
                            </li>
                            <li>
                                <a v-if="image6" :href="BASE_URL+image6" bis_skin_checked="1">
                                    <img v-if="image6" :src="BASE_URL+image6" alt="" class="w-100">
                                    <img v-else src="@/assets/images/website/destination.jpg"
                                        alt="" class="w-100"></a>
                                <a v-else href="@/assets/images/website/destination.jpg" bis_skin_checked="1">
                                    <img  src="@/assets/images/website/destination.jpg"
                                        alt="" class="w-100"></a>
                            </li>
                        </ul>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <div class="footer-copyright text-center py-4">
        <!-- <p class="text_14">© 2024 Wedding Planner. All Rights Reserved.</p> -->
        <p class="text_14">© 2024 Engaged Celebration. All Rights Reserved.</p>
    </div>
</template>

<style lang="scss" scoped>
.custom-footer {
    background-color: #23262c;
}
.footer-heading {
    font-size: 20px;
    margin-bottom: 20px;
    padding-top: 10px;
    color: rgb(210, 169, 87);
}
.footer-list {
    list-style: none;
}
.footer-list li {
    padding-bottom: 8px;
}
.footer-list li a {
    color: #fff;
    font-size: 14px;
    text-decoration: none;
}
.instagram li {
    flex: 0 0 33.33%;
    max-width: 33.33%;
    margin-bottom: 5px;
    padding: 0px 3px;
}
.instagram {
    flex-wrap: wrap;
    margin: 0px -3px;
    list-style: none;
}
.inquiry-list {
    list-style: none;
}
.inquiry-list li {
    padding-bottom: 15px;
    position: relative;
    font-size: 15px;
}
.inquiry-list li a {
    color: #fff;
}
.inquiry-list li svg {
    margin-right: 10px;
}
.custom-footer p {
    color: #d3d3d3;
    font-size: 14px !important;
    line-height: 1.6;
    margin-bottom: 10px;
}
.custom-footer ul li a {
    transition: all 0.38s ease-in-out 0s;
}
.custom-footer ul li a:hover {
    color: #b4801c !important;
}
.text_14 {
    font-size: 14px;
}
// .footer-copyright {
   // background-color: #b4801c63;

   .footer-copyright {
    background-color: rgb(34 34 36);
}
.footer-copyright p{
    color:#fff;
}

.footer-list .v-btn {
    height: auto;
    justify-content: start;
}
</style>
