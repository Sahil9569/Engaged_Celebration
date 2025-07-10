<script setup lang="ts">

import { ref, computed } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


import serviceimg from "@/assets/images/customer/destination.webp";
const rating = ref(5);
const reviewCard = ref([]);



const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)





function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
async function service_listing() {
    const formData = new FormData();

    formData.append("user_current_role", "customer");
    const response = await axios.post(`/home/show_all_reviews`, formData, config);
    console.log(response.data.all_reviews, "hi responce for all_reviews")
    if (response.data.status == 'SAVED') {
        reviewCard.value = response.data.all_reviews.map((elem: any) => {
            return {
                "photo": (elem.package.package_logo) ? BASE_URL + elem.package.package_logo : serviceimg,
                "id": elem.id,
                "servicename":elem.package.name,
                "vendorname": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                "vendortype": `${elem.user.user.email}`,
                "rating": elem.rating, // Use this rating for each review item
                "reviewtext": elem.comment, // Use this rating for each review item
                "reviewreply": elem.reply, // Use this rating for each review item
                "reviewcreate": formatDate(elem.created_at),
                "reviewupdate": formatDate(elem.updated_at),
                "replyby":elem.package.vendor ? `${elem.package.vendor.userprofile.user.first_name} ${elem.package.vendor.userprofile.user.last_name}`:`${elem.package.admin.userprofile.user.first_name} ${elem.package.admin.userprofile.user.last_name}`,

            };
        }).reverse();
    fullpageloader.value = false
    }
}
service_listing();

</script>
<template>
       <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage"
         density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8"> <v-card-title class="text-h4">All Review/Rating</v-card-title></v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" v-for="item in reviewCard" :key="item.servicename">
                            <v-card elevation="10" class="">
                                <v-card-item class=" pa-4">
                                   <div class="border-bottom ">
                                    <QuoteIcon stroke-width="2" size="35" class="text-primary"
                                                    />
                                        <p class="text-body-1 mt-3 mb-6 text-13 ">
                                            
                                            {{ item.reviewtext }}
                                        </p>
                                    </div>
                                    <v-row class="mt-3">
                                        <v-col cols="12" md="8">
                                            <v-row>
                                                <v-col cols="12" md="4" class="">
                                                    <img :src="item.photo" class="img-fluid-custom rounded-sm">
                                                </v-col>
                                                <v-col cols="12" md="8" class="ps-md-0 pt-4">  
                                                    
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2">{{ item.servicename }}
                                                    </h4>
                                                    <p class="text-body-2 text-Darklight text-12 text-capitalize font-weight-medium">{{ item.vendorname }}</p>
                                                    <p class="text-body-2 text-Darklight text-12 font-weight-medium">{{ item.vendortype }}</p>
                                                </v-col>
                                                <v-col cols="12" md="6" class="">
                                                    <p class="text-body-2 text-Darklight text-12 font-weight-medium">{{ item.reviewreply }}</p>
                                                    <p class="text-body-2 text-Darklight text-12 font-weight-bold">Reply by : <span class="font-weight-medium">{{ item.replyby }}</span></p>
                                                </v-col>
                                            </v-row>
                                          
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="text-md-end text-start">
                                                <v-rating half-increments v-model="item.rating" density="compact" color="warning" size="small"></v-rating >
                                                <p class="text-body-2 text-Darklight text-13">{{ item.reviewcreate }}</p>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>    
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.img-fluid-custom {
    width: 100%;
    height: 80px;
    object-fit: cover;
}
</style>