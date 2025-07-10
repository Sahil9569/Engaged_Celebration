<script setup lang="ts">
import { ref, computed } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


/*--Booking table data --*/
import user1 from "@/assets/images/profile/defaultuserimg.png";
const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);


const search = ref('');
const filteredList = computed(() => {
    const searchTerm = search.value.toLowerCase();
    return bookingData.value.filter((item:any) =>
        item.custname.toLowerCase().includes(searchTerm) ||
        item.service.toLowerCase().includes(searchTerm) ||
        item.custemail.toLowerCase().includes(searchTerm)
    );
});
const itemsPerPage = 5;
const currentPage = ref(1);
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});



const total_count = ref(0);
const average_rating = ref(0);



const rating = ref(3);
const bookingData = ref([]);

async function service_listing() {
    const formData = new FormData();
    formData.append("user_current_role", "vendor");
    const response = await axios.post(`/home/show_all_reviews`, formData, config);
    console.log(response.data, "hi responce for all reviews")
    if (response.data.status == 'SAVED') {
        if(response.data.total_reviews_count){
            total_count.value = response.data.total_reviews_count
            average_rating.value = response.data.average_rating

        }
        bookingData.value = response.data.all_reviews.map((elem: any, index) => {
            return {
                "sno": index + 1,
                "coupleimgphoto": (elem.user.profile_pic) ? BASE_URL + elem.user.profile_pic : user1,
                "service": elem.package.name,
                "reviewppostedtime": '$' + elem.created_at,
                "custname": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                "custemail": `${elem.user.user.email}`,
                "rating": elem.rating, // Use this rating for each review item
                "id": elem.id,
                "link": `/rating-single/${elem.package.id}`,
                "msglink": `/${(localStorage.getItem('role').toLowerCase() == 'vendor') ? 'vchats' : 'achats'}?march=${elem.march}`
                
            };
        });
        fullpageloader.value=false;
    }else{ fullpageloader.value=false;}
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
            <v-row class="justify-content-between pt-3">
                <v-col cols="12" md="12"> <v-card-title class="text-h4 ps-0 mb-3">All Review/Rating</v-card-title>
                </v-col>
            </v-row>
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="pb-3">
                        <v-col cols="12" md="3" class="border-end-custom py-8 pt-4">
                            <div class="v-card-title text-h6">Total Reviews</div>
                            <div class="v-card-title text-h2 font-weight-semibold ">{{ total_count }}
                                <!-- <v-btn class="bg-lightsuccess text-success font-weight-bold rounded-xl" size="x-small">
                                    21%<ArrowUpRightIcon size="17" class="ms-1"/>
                                </v-btn> -->
                            </div>
                            <p class="text-Darklight mb-0 text-subtitle-2">Growth in reviews on this year</p>
                        </v-col>


                        <!-- <v-col cols="12" md="4" class="ps-14 py-8 pt-4">
                            <div class="v-card-title text-h6">Average Ratings</div>
                            <div class="v-card-title text-h2 font-weight-semibold d-flex align-center gap-2">{{ average_rating }}
                                <v-rating half-increments disabled v-model="rating" density="compact" color="warning"></v-rating>
                            </div>
                            <p class="text-Darklight mb-0 text-subtitle-2">Average rating on this year</p>
                        </v-col> -->

                        <!-- <v-col cols="12" md="4" class="ps-14 py-8 pt-4">
                            <div class="v-card-title text-h6">Average Ratings</div>
                          
                            <div class="v-card-title text-h2 font-weight-semibold d-flex align-center gap-2">
                            {{ average_rating !== 0 ? average_rating.toFixed(1) : '0.0' }}
                            <v-rating half-increments :value="average_rating" density="compact" color="warning" readonly></v-rating>
                            </div>
                            <p class="text-Darklight mb-0 text-subtitle-2">Average rating this yearAverage rating this year</p>
                        </v-col> -->

                       

                        <v-col cols="12" md="5" class="ps-sm-14 py-sm-8 pt-sm-4 d-flex align-end justify-sm-end justify-start">
                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Package/Couple" hide-details variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-table class="month-table border rounded">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">
                                                Sno
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">
                                                Couples Info
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">
                                                Package Name
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">
                                                Ratings</th>
                                            <th
                                                class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">
                                                Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in filteredList" :key="item.id" :currentPage="currentPage" :pageSize="5" class="month-item">
                                            <td><h5 class="text-no-wrap text-body-1">{{ item.sno }}</h5></td>
                                            <td>
                                                <div class="d-flex align-center justify-space-between">
                                                    <v-avatar size="40">
                                                        <img :src="item.coupleimgphoto" :alt="item.coupleimgphoto" width="40" />
                                                    </v-avatar>
                                                    <div class="mx-3 w-100">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                            {{ item.custname }}
                                                        </h4>
                                                        <h6 class="text-subtitle-2 textSecondary mt-1">
                                                            {{ item.custemail }}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    {{ item.service }}
                                                </h5>
                                            </td>
                                            <td>
                                              
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    <div class="removeLebel">
                                                        <v-rating half-increments disabled v-model="item.rating" density="compact" color="warning" size="s"></v-rating>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="View Review">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.link">
                                                                <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                    <v-tooltip text="Chat">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.msglink">
                                                                <MessageIcon stroke-width="2" size="20" class="text-success" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="6">
                                                <v-col cols="12" v-if="filteredList.length === 0">
                                                    <v-card elevation="0" class=" mt-6 border-0" color="">
                                                        <v-card-item class="text-center">
                                                            <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                            <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                            <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                                Search again with another Bookings<br> temporary error.
                                                            </h6> -->
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                            </td>
                                        </tr>
                                    </tbody>

                                </template>
                            </v-table>
                            <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                                rounded="circle"></v-pagination>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}

.border-end-custom {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.removeLebel .v-rating>label {
    display: none;
}
</style>