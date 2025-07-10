<script setup lang="ts">





















"admins ki ratings ke liye vendor ki ratings wala page hi use kiya hua h, to ye page istanmaal mein nhi hai @ anchan"
















import { ref, computed } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }




/*--Booking table data --*/
import user1 from "@/assets/images/profile/defaultuserimg.png";



const bookingData = ref([
    {
        img: user1,
        customerimg: user1,
        customername: "John",
        customeremail: "john22@gmail.com",
        vendorname: "Sumit",
        vendoremail: "sumit22@gmail.com",
        service: "Makeup Artists",
        link: "/ratings-single"
    },
    {
        img: user1,
        customerimg: user1,
        customername: "John",
        customeremail: "john22@gmail.com",
        vendorname: "Sumit",
        vendoremail: "sumit22@gmail.com",
        service: "Makeup Artists",
        link: "/ratings-single"
    },
    {
        img: user1,
        customerimg: user1,
        customername: "John",
        customeremail: "john22@gmail.com",
        vendorname: "Sumit",
        vendoremail: "sumit22@gmail.com",
        service: "Makeup Artists",
        link: "/ratings-single"
    },
]);
const search = ref('');
const filteredList = computed(() => {
    const searchTerm = search.value.toLowerCase();
    return bookingData.value.filter(item =>
        item.vendorname.toLowerCase().includes(searchTerm) ||
        item.service.toLowerCase().includes(searchTerm) ||
        item.vendoremail.toLowerCase().includes(searchTerm)
    );
});
const itemsPerPage = 5;
const currentPage = ref(1);
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});

// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

// async function showbooking() {
//   try {
//     const formData = new FormData();
//     formData.append("ViewAllBopking",'ViewAllBopking');
//     formData.append("user_role",'customer');
//     const response = await axios.post(`/home/makebooking`, formData, config);
//     console.log(response.data,"hi responce all booking customer ")

//     if (response.data.status == 'SAVED') {
//       bookingData.value = response.data.booking_data.map((elem) => ({
//         "img": elem.couple.profile_pic === '/media/default.jpg' ? user1 : BASE_URL + elem.couple.profile_pic,
//         "vendorname": `${elem.package.user.first_name} ${elem.package.user.last_name}`,
//         "vendoremail": `${elem.package.user.email}`,
//         "service": elem.package.name,
//         "bookingdate": formatDate(elem.fromdate),
//         "bookingpayment":'$' + elem.budget, 
//         "statustext":elem.status,
//         "link": `/booking-single/`+ elem.id,
//         // Include other properties as needed
//       }));
//     }


//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
// showbooking()

const rating = ref(3);




</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row class="justify-content-between pt-3">
                <v-col cols="12" md="12"> <v-card-title class="text-h4 ps-0 mb-3">All Review/Rating</v-card-title>
                </v-col>
            </v-row>
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="pb-3">
                        <v-col cols="12" md="8" class="py-8 pt-4">
                            <div class="v-card-title text-h6">Total Reviews</div>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end gap-2">
                            <!-- <v-select :items="items" density="compact" v-model="value" label="Search By Package" hide-details>
                            </v-select> -->
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="secondary" variant="outlined" v-bind="props" hide-details
                                        class="rounded-sm d-flex align-center">
                                        Download Ratings Report
                                        <CaretDownIcon stroke-width="1" />
                                    </v-btn>
                                </template>
                                <v-list class="pa-3">
                                    <v-btn color="secondary" variant="flat" size="small" hide-details
                                        class="w-100 mb-3 rounded-sm d-flex align-center">
                                        Pdf
                                    </v-btn>
                                    <v-btn color="secondary" variant="flat" size="small" hide-details
                                        class="w-100 rounded-sm d-flex align-center">
                                        Excel
                                    </v-btn>

                                </v-list>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-table class="month-table border rounded">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Couple
                                        Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor
                                        Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Service
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Ratings
                                    </th>
                                    <th
                                        class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">
                                        Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in filteredList" :key="item.id" :currentPage="currentPage"
                                    :pageSize="5" class="month-item">
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40">
                                                <img :src="item.customerimg" :alt="item.customerimg"
                                                    width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                    {{ item.customername }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    {{ item.customeremail }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40">
                                                <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                    {{ item.vendorname }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    {{ item.vendoremail }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                        <div>
                                            <div class="removeLebel">

                                                <v-rating half-increments v-model="rating" density="compact" color="warning"
                                                    size="small"></v-rating>
                                            </div>


                                            <p class="text-subtitle-2 d-inline-block text-truncate"
                                                style="max-width: 250px;">I recently had the pleasure of working with
                                                Wedding Planner to organize and execute the wedding of my dreams, and I
                                                am beyond thrilled with the results. From the initial consultation to
                                                the last dance, Wedding Planner's demonstrated professionalism,
                                                creativity, and an unwavering commitment to making our special day
                                                absolutely perfect.</p>
                                        </div>
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
                                        </h5>

                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="6">
                                        <v-col cols="12" v-if="filteredList.length === 0">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50"
                                                        class="mr-2 text-error" />
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

.border-end-custom {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.removeLebel .v-rating>label {
    display: none;
}
</style>