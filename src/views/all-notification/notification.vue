<script setup lang="ts">
import { ref } from 'vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios'
import notificationbell from '@/assets/images/website/notification-bell.png'


const notifications = ref([{}])
async function not_init(){
    const response = await axios.post('home/notifications')
    console.log("response____________", response.data)
    if (response.data.status == 'SENT'){
        notifications.value = response.data.not_list.map((a:any)=>({
        avatar      : (a.sender) ? BASE_URL + a.sender.pic : notificationbell,
        title       : a.title,
        subtitle    : a.content,
        timed       : a.created_at,
        link        : (a.link) ? a.link : null,
        unread      : !(a.is_read)
        }))
        notif["not_count"].value = 0
    }
}
not_init()

</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">All Notification</v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2"></v-col>
                    </v-row>


                    <v-row justify="left">
                        <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
                            <div v-for="item in notifications" :key="item.title" :value="item">
                                <v-card elevation="10" class="w-100 mb-4" :class="{ 'bg-lightprimary':item.unread }">
                                <!-- <v-card elevation="10" class="w-100 mb-4" :class="{ 'bg-lightprimary': item.unread }"> -->
                                    <v-card-title class="py-6 px-5">
                                        <div class="d-flex justify-space-between align-center">
                                            <div class="d-flex align-center">
                                            <v-avatar class="mr-3"><img :src="item.avatar" class="noti_ctm inner-noti" width="50" height="50"></v-avatar>
                                        <a :href="item.link" class="text-decoration-none">
                                           <h6 class="text-subtitle-1  mb-1 font-weight-semibold text-dark" :class="{ 'font-weight-bold':item.unread }">{{item.title}}
                                            </h6>
                                            <p class="text-subtitle-2 font-weight-regular text-Darklight mb-1">{{item.subtitle}}</p>
                                        </a>
                                        </div>
                                        <div>
                                            <p class=" text-subtitle-2 text-Darklight font-weight-semibold" :class="{ 'font-weight-bold':item.unread }">{{item.timed}}</p>
                                        </div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </div>
                        </v-col>
                    </v-row>


                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>

</style>