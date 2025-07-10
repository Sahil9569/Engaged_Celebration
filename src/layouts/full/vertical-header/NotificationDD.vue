<script setup lang="ts">
// import {notifications} from '@/_mockApis/headerData';
import { ref } from 'vue';
import Navigations from './Navigations.vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios';
import notificationbell from '@/assets/images/website/notification-bell.png'

const notifications = ref(
    notif["not_list"].value.map((a: any) => ({
        id: a.id,
        avatar: (a.sender) ? BASE_URL + a.sender.pic : notificationbell,
        title: a.title,
        subtitle: a.content,
        timed: a.created_at,
        link: (a.link) ? a.link : null,
        unread: !(a.is_read)
    }))
)
async function not_read(nid: any) { const response = await axios.post('home/notifications', { 'nid': nid }) }

const shownotcount = ref( (parseInt(notif['not_count'].value) > 0) ? true : false)


</script>
<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="true">
        <template v-slot:activator="{ props }">
            <v-btn icon variant="text" color="primary" class="custom-hover-primary" v-bind="props">
                <template v-if="shownotcount">
                    <!-- <v-badge dot color="success" class="ctm_badge d-flex align-center justify-center" >
                        <span class="notify-text position-absolute text-white">{{ notif["not_count"] }}</span>
                        <BellRingingIcon stroke-width="1.5" size="22" />
                    </v-badge> -->
                    <v-badge color="primary" class="ctm_badge">
                        <template v-slot:badge>
                            <span class="notify-text position-absolute text-white">{{ notif.not_count }}</span>
                        </template>
                        <BellRingingIcon stroke-width="1.5" size="22" />
                    </v-badge>
                </template>
                <template v-else>
                    <BellRingingIcon stroke-width="1.5" size="22" />
                </template>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pb-4 pt-6 border-bottom">
                <div class="d-flex align-center justify-space-between">
                    <h6 class="text-h5">Notifications</h6>
                    <v-chip color="primary" variant="flat" size="small" class="text-white">{{ notif["not_count"] }}
                        New</v-chip>
                </div>
            </div>
            <perfect-scrollbar style="height: 400px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in notifications" :key="item.title" :value="item" active-color="primary"
                        class="py-4 px-8 align-top border-bottom" :class="{ 'bg-grey200': item.unread }">
                        <template v-slot:prepend>
                            <v-avatar size="55" class="mr-3 noti_ctm ">
                                <v-img :src="item.avatar" width="55" :alt="item.avatar" class="notifyuserimg" />
                            </v-avatar>
                        </template>
                        <a :href="item.link" class="text-decoration-none text-dark" @click="not_read(item.id)">
                            <h6 class="text-subtitle-1  mb-1 font-weight-semibold" >{{
                                item.title }}</h6>
                            <p class="text-subtitle-2 font-weight-medium textSecondary mb-1">{{ item.subtitle }}
                            </p>
                            <p class="textSecondary text-subtitle-2">{{ item.timed }}</p>
                        </a>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-list>
            </perfect-scrollbar>
            <div class="py-4 px-6 text-center">
                <v-btn color="primary" variant="outlined" block :to="'/notifications'">See all Notifications</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
<style>
.notify-text {
    font-size: 9px;
}

.v-badge--dot .v-badge__badge {
    border-radius: 50px;
    height: 14px;
    min-width: 0;
    padding: 0;
    width: 14px;
}
.noti_ctm {
    background-color: #f3e9d5;
    border: 3px solid #ccc;
}
.text-dark {
    color: #000;
}

</style>
