<script setup lang="ts">
import { ref } from 'vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios'
import notificationbell from '@/assets/images/website/notification-bell.png'

import { onMounted, computed } from 'vue';

const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);


const subject = ref('');
const content = ref('');

const email_data = ref([])


async function email_listing() {
    try {
        const response = await axios.post('/home/email_data');
        console.log("response_em_init____________", response.data);
        if (response.data.status === 'SENT') {
            fullpageloader.value = false;
            email_data.value = response.data.vend_emails.map(item => {
                let contentLength = 132; // Default
                if (item.subject.length > 30 && item.subject.length <= 40) {
                    contentLength = 85;
                } else if (item.subject.length > 20 && item.subject.length <= 30) {
                    contentLength = 90;
                } else if (item.subject.length > 10 && item.subject.length <= 20) {
                    contentLength = 100;
                }else if (item.subject.length > 40 ) {
                    contentLength = 80;
                }

                const allReceivers = [
                    ...(item.couple_p ? item.couple_p.map(couple => couple.userprofile.user.first_name) : []),
                    ...(item.vendor_p ? item.vendor_p.map(vendor => vendor.userprofile.user.first_name) : [])
                ].join(', ');
                const truncatedReceivers = allReceivers.length > 13 ? allReceivers.substring(0, 13) + '.' : allReceivers;

                return {
                    id: item.id,
                    read_unread: item.vendor_read_unread,
                    email_link: "/single-mail/" + item.id,
                    subject: item.subject.length > 36 ? item.subject.substring(0, 36) + '.. ' : item.subject,
                    content: item.content.length > contentLength ? item.content.substring(0, contentLength) + '...' : item.content,
                    unread: true,
                    // selected: false,
                    // unread      : !(item.is_read),
                    receivers: truncatedReceivers,
                    created_at: new Date(item.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                };
            });
        }else{
            fullpageloader.value = false;
        }
    } catch (error) {
        console.error("Error initializing email data:", error);
    }
}
email_listing();



async function deleteSelectedEmails() {
    const selectedEmailIds = email_data.value
        .filter(item => item.selected)
        .map(item => item.id);

    if (selectedEmailIds.length === 0) {
        fullpageloader.value = false
        // showSuccessMessage.value = true;
        showErrorMessage.value = true;
        myerrors.value = 'Please select the mail.';
        setTimeout(() => {
            // showSuccessMessage.value = false;
            showErrorMessage.value = false;
            fullpageloader.value = false;
            }, 1000);
        return;
    }

    try {
        // const formData = new FormData();
        // formData.append("vendor_delete_email", 'vendor_delete_email');
        const response = await axios.post('/home/delete_emails', {vendor_delete_email: 'vendor_delete_email', email_ids: selectedEmailIds });

        // if (response.data.success) {
        if (response.data.status === 'SUCCESS'){
            email_data.value = email_data.value.filter(item => !selectedEmailIds.includes(item.id));
            // alert("Selected emails have been deleted successfully.");
            fullpageloader.value = false
            showSuccessMessage.value = true;
            myerrors.value = 'Selected emails have been deleted successfully.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 2000);
        } else {
            showSuccessMessage.value = false;
            myerrors.value = "Something went wrong";
        }
    } catch (error) {
        console.error("Error deleting emails:", error);
        showSuccessMessage.value = false;
        myerrors.value = "An unexcepted error occured!"
    }finally {
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 2000)}
}





// const roleMail = ref('1');

// const items2 = ref([]);
// const packages = ref([]);
// const sendtoitems = ref([]);
// const sendto = ref([]);

// async function initlist() {
//     try {
//         const response = await axios.get('home/all_v_c_data');
//         console.log("response_initlist____________", response.data);

//         if (response.data.status === 'SENT') {

//             if (roleMail.value === '1') {
//                 // If Couple is selected
//                 items2.value = response.data.cpack.map(a => ({
//                     // "package": a.packages,
//                     'text': a.text,
//                     'value': a.value,
//                 }));
//                 sendtoitems.value = response.data.cprofile.map(item => ({
//                     'label': item.text,
//                     'value': item.value,
//                 }));
//             } else if (roleMail.value === '2') {

//                 items2.value = response.data.v_pack.map(a => ({
//                     // package: a.packages,
//                     'text': a.text,
//                     'value': a.value,

//                 }));
//                 sendtoitems.value = response.data.vprofile.map(item => ({
//                     'label': item.text,
//                     'value': item.value,
//                 }));
//             }
//             // fullpageloader.value = false
//         }else{
//             fullpageloader.value = false
//         }
//     } catch (error) {
//         console.error("Error fetching data: ", error);
//     }
// }

// function refreshContent() {
//     initlist();
// }

// initlist();






</script>

<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="6"> <v-card-title class="text-h4 ">Email Inbox </v-card-title></v-col>
                        <!-- <v-col cols="12" md="5" class="d-flex gap-2 justify-end">
                        </v-col> -->

                        <v-col cols="6" class="justify-end d-flex">
                            <v-btn v-if="email_data.length != 0" color="error" variant="flat"
                                class="d-block py-1 rounded-sm textPrimary " size="small" @click="deleteSelectedEmails">
                                Delete
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row justify="left">
                        <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
                        <!-- <div v-for="item in email_data" :key="item.id" :value="item"> when add delete and read and unread -->
                        <div v-for="item in email_data" :key="item.id" :value="item">
                            <v-card elevation="10" class="w-100 mb-2">
                            <v-card-title class="py-3 px-5">
                                <div class="d-flex justify-space-between align-center">
                                <div class="d-flex align-center">
                                    <div class=" d-flex align-center" style="width: 200px;">
                                         <input type="checkbox" class="mr-2" v-model="item.selected" />
                                        <h6 v-if="item.read_unread == false"  class="text-subtitle-1 font-weight-bold text-dark">To: {{ item.receivers }}
                                        </h6>
                                        <h6 v-else  class="text-subtitle-1 font-weight-normal text-dark" >To: {{ item.receivers }}
                                        </h6>
                                    </div>
                                    <router-link class="text-decoration-none" v-if="item.id" :to="{ name: 'Vendor Single Mail', params: { id: item.id } }">
                                    <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                            <div class="">
                                                <h6 v-if="item.read_unread == false" class="text-subtitle-1 font-weight-bold text-dark"> {{ item.subject }} - <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                                </h6>

                                                <h6 v-else  class="text-subtitle-1 font-weight-normal text-dark" > {{ item.subject }} - <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                                </h6>
                                            </div>
                                            <div class=""></div> 
                                    </div>
                                    </router-link>                                   
                                </div>
                                    <p class=" text-subtitle-2 text-Darklight font-weight-semibold" :class="{ 'font-weight-bold':item.unread }">{{ item.created_at }}</p>
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

.font-weight-bold {
    font-weight: bold;
}
.font-weight-normal {
    font-weight: normal;
}

</style>