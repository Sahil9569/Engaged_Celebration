<script setup>
import { ref } from 'vue';

import BASE_URL from '@/stores/myVar';
const ia            = JSON.parse(String(localStorage.getItem('user')))
let local_pic       = ia['profile_pic']
const profile_pic   = ref( (local_pic) ? BASE_URL + local_pic : 'src/assets/images/profile/user-1.jpg');
console.log("localStorage.getItem('vpack')_____________", localStorage.getItem('vpack')[0] )
let vpack = (localStorage.getItem('vpack'))
const irole         = (localStorage.getItem('role') == 'admin') ? 'admin' : ((vpack == 'null') || (vpack == 'undefined') || !((vpack)) ? 'customer' : `${vpack} ${ia['role']}`)

</script>

<template>
    <v-sheet>  
        <div class="d-flex gap-2 align-center pa-6 bg-grey200 borderRightcustom">
            <v-avatar size="large"> <img :src="profile_pic" alt="pro" width="54" /> </v-avatar>
            <v-badge class="badg-dotDetail" dot color="success"> </v-badge>
            <!---Name & Last seen-->
            <div>
                <h5 class="text-subtitle-1 font-weight-semibold">{{ia['user']['first_name']}} {{ia['user']['last_name']}}</h5>
                <h6 class="text-subtitle-2">{{ irole }}</h6>
            </div>
        </div>
    </v-sheet>
</template>
