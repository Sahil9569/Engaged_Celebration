<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useEcomStore } from '@/stores/apps/eCommerce';
import { GridDotsIcon, LanguageIcon, SearchIcon, Menu2Icon, BellRingingIcon, ShoppingCartIcon, Message2Icon } from 'vue-tabler-icons';
import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';
import notif from '@/stores/notify';

const customizer = useCustomizerStore();
const showSearch = ref(false);
const appsdrawer = ref(false);
const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
function searchbox() {
    showSearch.value = !showSearch.value;
}
watch(priority, (newPriority) => {
    priority.value = newPriority;
});

// count items
const store = useEcomStore();
const getCart = computed(() => {
    return store.cart;
});
const showmsgcount = ref((parseInt(notif['msg_count'].value) > 0) ? true : false)
const irole = localStorage.getItem('role')
const chatlink = ref((irole == 'admin') ? '/achats' : ((irole == 'vendor') ? '/vchats' : '/cchats'))


const cart_count = ref((parseInt(notif['cart_count'].value)))


</script>

<template>
    <v-app-bar elevation="0" :priority="priority" height="70" class="">
        <v-btn class="hidden-md-and-down" icon color="primary" variant="text"
            @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)">
            <Menu2Icon size="20" stroke-width="1.5" />
        </v-btn>
        <v-btn class="hidden-lg-and-up" icon variant="flat" @click.stop="customizer.SET_SIDEBAR_DRAWER" size="small">
            <Menu2Icon size="20" stroke-width="1.5" />
        </v-btn>
        <v-spacer />

        <template>
            <v-btn icon variant="text" color="primary" class="custom-hover-primary">
                <template>
                    <v-badge dot color="primary" class="ctm_badge DSASADFDSAF">
                        <span class="notify-text position-absolute text-white">0DG0</span>
                        <BellRingingIcon stroke-width="1.5" size="22" />
                    </v-badge>
                </template>
                <template>
                    <BellRingingIcon stroke-width="1.5" size="22" />
                </template>
            </v-btn>
        </template>
        <v-btn icon v-if="irole == 'customer'" variant="text" color="primary" class="custom-hover-primary" to="/wishlist">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="#b4801c"  class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
        </v-btn>
        <template v-if="showmsgcount">
            <v-btn icon variant="text" color="primary" class="custom-hover-primary" :to="chatlink">
                <v-badge color="primary" class="ctm_badge">
                    <template v-slot:badge>
                        <span class="notify-text position-absolute text-white">
                            {{notif["msg_count"] }}
                        </span>
                    </template>
                    <Message2Icon stroke-width="1.5" size="22" />
                </v-badge>
            </v-btn>
        </template>
        <template v-else>
            <v-btn icon variant="text" color="primary" class="custom-hover-primary" :to="chatlink">
                <Message2Icon stroke-width="1.5" size="22" />
            </v-btn>
        </template>
            <v-btn icon v-if="irole == 'customer'" variant="text" color="primary" class="custom-hover-primary" to="/multiple-booking">
                <v-badge color="primary" class="ctm_badge">
                    <template v-slot:badge>
                        <span class="notify-text position-absolute text-white">
                            {{ cart_count }}
                        </span>
                    </template>
                    <GardenCartIcon stroke-width="1.5" size="22" />
                </v-badge>
            </v-btn>
        <NotificationDD />

        <div class="ml-2">
            <ProfileDD />
        </div>
    </v-app-bar>
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
</style>
