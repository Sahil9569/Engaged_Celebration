<script setup lang="ts">
import { ref, computed } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


import user1 from "@/assets/images/profile/user-1.jpg";

const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)

const bookingData = ref([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Requested', 'Accepted', 'Paid']);
const searchtime = ref('All');
const timeitem = ref(['All', 'Past', 'Present', 'Future']);
const searchbudget = ref();
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');

const filteredList = computed(() => {
    console.log("searchdate____", searchdate.value)
    const isearch = search.value.toLowerCase()
    const ilist = bookingData.value.filter((i:any) => (
        i.vendorname.toLowerCase().includes(isearch) ||
        i.vendoremail.toLowerCase().includes(isearch) ||
        i.service.toLowerCase().includes(isearch) ||
        String(i.bookingprice).includes(isearch) ))

    function chdate(a:any, b:any) { 
        const i = new String(a).split("-"); 
        const j = new String(b).split("/"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter(item =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.statustext.toLowerCase())) &&
            (searchtime.value.length === 0 || searchtime.value.includes('All') || searchtime.value.toLowerCase().includes(item.statustime.toLowerCase())) &&
            // ([undefined, null, 0, ''].includes(searchbudget.value) || String(item.bookingprice).includes(String(searchbudget.value))) &&
            ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.bookingdate))
        )
    );
});
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
function compareDates(idate:any) {
    const a = new Date(idate);
    const b = new Date();
    const input = new Date(`${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`)
    const today = new Date(`${b.getFullYear()}-${b.getMonth()+1}-${b.getDate()}`)
    return  ( input > today) ? 'Future' : (  (input < today) ? 'Past' : 'Present'  )
}

async function showbooking() {
    try {
    const formData = new FormData();
    formData.append("ViewAllBopking",'ViewAllBopking');
    formData.append("user_role",'customer');
    const response = await axios.post(`/home/makebooking`, formData, config);
    console.log(response.data,"hi responce all booking customer ")

    if (response.data.status == 'SAVED') {
      bookingData.value = response.data.booking_data.map((elem, index) => ({
        "sno": index+1,
        "img": (elem.couple.profile_pic) ? BASE_URL + elem.couple.profile_pic : user1,
        "vendorname": `${elem.package.user.first_name} ${elem.package.user.last_name}`,
        "vendoremail": `${elem.package.user.email}`,
        "service": elem.package.name,
        "bookingdate": formatDate(elem.seldate),
        "bookingprice": '$' + elem.package.price,
        "bookingpayment":elem.budget, 
        "statustext":elem.status,
        "statustime":compareDates(elem.seldate),
        "statuscolor": elem.status == 'accepted' ? 'success' : 'primary',
        "link": `/booking-single/`+ elem.id,
      }));

    fullpageloader.value = false
    }

 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showbooking()


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
                    <v-card-title class="text-h4 text- ps-0 mb-2">All Bookings</v-card-title>
                    <v-row class="justify-content-between pt-3">
                        <!-- <v-col cols="12" md="12"> 
                            <v-card-title class="text-h4 text-secondary">All
                                Bookings
                            </v-card-title>
                        </v-col> -->
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightsecondary">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking/Price" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status"
                                                hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="timeitem" v-model="searchtime" label="Filter By Time"
                                                hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>
                                        
                                    </v-row>
                                    
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor/Admin Info </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Event Date</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Base Price</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Deposit</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Status</th>
                                    
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="item.id" :currentPage="currentPage" :pageSize="5"
                                class="month-item">
                                <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td>
                                <td>
                                    <router-link :to="item.link" class="text-decoration-none text-dark">
                                            <div class="d-flex align-center">
                                                <v-avatar size="40">
                                                    <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                                <div class="mx-3">
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                         {{item.vendorname }}</h4>
                                    <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                        {{ item.vendoremail }}</h6>
                                                    <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                        {{ item.vendortype }}</h6>
                                                </div>
                                            </div>
                                        </router-link>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                      
                                        <h5 class="text-no-wrap text-body-2">
                                            <CalendarIcon size="12" color="secondary" stroke-width="2.5" class="mr-1" />
                                            {{ item.bookingdate }}
                                        </h5>
                                      
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.bookingprice }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                          $ {{ item.bookingpayment }} 
                                        </h5>
                                    </td>
                                    <td>
                                        <v-chip rounded="md" class="ma-2 font-weight-semibold text-capitalize" :color="item.statuscolor"
                                            size="small" label >{{ item.statustext }}</v-chip>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat v-bind="props" :to="item.link">
                                                        <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip> 
                                        </h5>

                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="6">
                                        <v-col cols="12" v-if="paginatedList.length === 0">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon  stroke-width="1.5" size="50" class="mr-2 text-error" />
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
</style>