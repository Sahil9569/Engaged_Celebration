<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import BASE_URL from '@/stores/myVar';
const user      = JSON.parse(localStorage.getItem('user'))
const urole     = localStorage.getItem('role')
const upack     = (urole == 'vendor') ? localStorage.getItem('vpackname') : null

const cpack =  (urole == 'customer') ? localStorage.getItem('cpackname') : null

const upic      = (user.profile_pic) ? BASE_URL + user.profile_pic : '/src/assets/images/profile/user-1.jpg'
const authStore = useAuthStore();
</script>

<template>
    <v-sheet rounded="md"  class="px-4 py-3 bg-grey200 ExtraBox  borderCustomuserCard ">
        <div class="d-flex align-center hide-menu">
            <div>
                <v-avatar size="40">
                    <img :src="upic" alt="user" height="40" />
                </v-avatar>
                
            </div>
            <div class="ml-4">
                <h4 class="text-h6 text-capitalize">{{user.user.first_name}}</h4>
                <p class="text-body-2 font-weight-medium text-capitalize text-dark">{{ urole }}</p>



                 <p v-if="upack" class="text-body-2 font-weight-medium">({{ upack }})</p>
                 <p v-if="cpack" class="text-body-2 font-weight-medium">({{ cpack }})</p>

                 



                <v-btn flat size="x-small" class="rounded-sm" color="error" @click="authStore.logout()"> 
                    <PowerIcon size="12" stroke-width="3" class="me-1"/> Logout
                <v-tooltip activator="parent" location="top">Logout </v-tooltip>
                </v-btn>
            </div>
            <!-- <div class="ml-auto">
                <v-btn variant="tonal" size="small"  icon rounded="md" color="error" @click="authStore.logout()">
                    <PowerIcon />
                    <v-tooltip activator="parent" location="top">Logout </v-tooltip>
                </v-btn>
            </div> -->
        </div>
    </v-sheet>
</template>
<style lang="scss">
.ExtraBox {     position: relative;     overflow: hidden; }
.line-height-none {     line-height: normal; }
.borderCustomuserCard {
    border: 1px solid #b7b1b1;
}
</style>
