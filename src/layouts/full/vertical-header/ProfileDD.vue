<script setup lang="ts">
import { profileDD, profileDDven, profileDDadmin } from '@/_mockApis/headerData';
import { useAuthStore } from '@/stores/auth';
import BASE_URL from '@/stores/myVar';

const authStore     = useAuthStore();
const user          = JSON.parse(localStorage.getItem('user'))
const urole         = localStorage.getItem('role')
const upack         = (urole == 'vendor') ? localStorage.getItem('vpackname') : null
// const wpack = (urole === 'vendor') ? localStorage.getItem('vpacks') || '' : ''; 
const upackactive   = (localStorage.getItem('vpackactive') == 'true')
const upic          = (user.profile_pic) ? BASE_URL + user.profile_pic : '/src/assets/images/profile/user-1.jpg'
const iprofileDD    = (urole == 'vendor') ? profileDDven : ((urole == 'admin') ? profileDDadmin : profileDD)
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="true">
        <template v-slot:activator="{ props }">
            <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img :src="upic" width="35" alt="Julia" class="main-header-user"  />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pt-6">
                <h6 class="text-h5 font-weight-medium">User Profile</h6>
                <div class="d-flex align-center mt-4 pb-6">
                    <v-avatar size="80"> 
                        <img :src="upic" width="80" class="main-img-user" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-h6 mb-1">{{ user.user.first_name }} {{ user.user.last_name }}</h6>
                        <h3 class="text-body-2 font-weight-semibold text-Darklight"
                            v-if="user.user.email">{{ user.user.email }}</h3>
                        <p class="text-body-2 font-weight-semibold text-Darklight"
                            v-if="user.phone">{{ user.phone }}</p>
                        <!-- <p class="text-body-2 font-weight-semibold text-Darklight">{{ urole }} <span v-if="upack" class="text-body-2 font-weight-semibold text-Darklight">({{ upack }})</span></p> -->
                        <p v-if="urole=='vendor'" class="text-body-2 font-weight-semibold text-Darklight">Package : 
                            <span class="text-body-2 font-weight-bold">
                                <strong class="text-success" v-if="upackactive">{{ upack }} (Active)</strong>
                                <strong class="text-error" v-else>{{ upack }} (Expired)</strong></span>
                        </p>
                        <!-- <div class="d-flex align-center mt-1">
                            <MailIcon size="18" stroke-width="1.5" />
                            <span class="text-subtitle-1 font-weight-regular textSecondary ml-2">info@modernize.com</span>
                        </div> -->
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <perfect-scrollbar style="height: calc(100vh - 240px); max-height: 240px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in iprofileDD" :key="item.title" class="py-4 px-8 custom-text-primary"
                        :to="item.href">
                        <template v-slot:prepend>
                            <v-avatar size="48" class="mr-3 custom_bg_color" rounded="md">
                                <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                    </v-list-item>
                </v-list>
            </perfect-scrollbar>
            <!-- <div class="px-8 py-3">
                <div class="bg-lightprimary rounded-md pa-5 overflow-hidden position-relative">
                    <h5 class="text-h6">
                        Unlimited<br />
                        Access
                    </h5>
                    <v-btn variant="flat" color="primary" class="mt-3">Upgrade</v-btn>
                    <img src="@/assets/images/backgrounds/unlimited-bg.png" alt="bg-img" class="right-pos-img" />
                </div>
            </div> -->
            <div class="pt-4 pb-6 px-8 text-center">
                <v-btn color="primary" variant="outlined" block @click="authStore.logout()">Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
<style>


</style>