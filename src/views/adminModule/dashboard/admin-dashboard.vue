<script setup lang="ts">



import { ref, computed } from 'vue';
import { getSecondary } from '@/utils/UpdateColors';

import axios from '@/stores/axios';
import { useAuthStore } from '@/stores/auth';
import BASE_URL from '@/stores/myVar';
import notif from '@/stores/notify';

import user1 from "@/assets/images/profile/user-1.jpg";
import card_icon1 from "@/assets/images/admin/people-teamwork.svg"
import card_icon3 from "@/assets/images/admin/messages.svg"

const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);



const recentTransaction = ref([ ]);
const rvncount = ref()
const vencount = ref()
const cupcount = ref()
const bookcount = ref()
const topCardsData = ref([
    {
        img: card_icon1,
        title: "total vendors",
        subtitle: "in the portal.",
        number: vencount.value,
        bgcolor: "color-tab",
        textcolor: "secondary",
    },
    {
        img: card_icon3,
        title: "New Messages",
        subtitle: "Messages from vendors",
        number: notif["msg_count"].value,
        bgcolor: "color-vendor",
        textcolor: "vendors"
    },
]);
/*--Top Projects --*/
// const bookingData = ref([
//     {
//         vendorname: "Sunil Joshi",
//         service: "Makeup Artists",
//         statuscolor: "success",
//         statustext: "Completed",
//         money: "$3.9K",
//         eventdate: "22-03-2024 ",
//     },
//     {
//         vendorname: "John Deo",
//         service: "Photographers",
//         statuscolor: "success   ",
//         statustext: "Completed",
//         money: "$24.5K",
//         eventdate: "25-03-2024 ",
//     },
//     {
//         vendorname: "Nirav Joshi",
//         service: "Decorators",
//         statuscolor: "success",
//         statustext: "Completed",
//         money: "$12.8K",
//         eventdate: "24-03-2024 ",
//     },
//     {
//         vendorname: "Yuvraj Sheth",
//         service: "DJs",
//         statuscolor: "success",
//         statustext: "Completed",
//         money: "$2.4K",
//         eventdate: "23-03-2024 ",
//     },
// ]);

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
(async function() {
    const response = await axios.post('home/data_admin_dashboard')
    console.log('response_______________', response.data)
    if (response.data.status == 'SENT'){
        topCardsData.value[0].number = response.data.vendors
        rvncount.value  =   response.data.revenue
        vencount.value  =   response.data.vendors
        cupcount.value  =   response.data.couples
        bookcount.value =   response.data.bookings
        recentTransaction.value = response.data.recenttrx.map((a:any)=>({
            img: (a.vendor) ? ((a.vendor?.userprofile.profile_pic) ? BASE_URL + a.vendor.userprofile.profile_pic: user1) : ((a.couple.userprofile.profile_pic) ? BASE_URL + a.couple.userprofile.profile_pic: user1),
            vendorname: (a.vendor) ? a.vendor.userprofile.fullname : a.couple.userprofile.fullname,
            money: "$"+ String(a.total_amt),
            status: a.status,
            payment_type: a.payment_type,
            time: formatDate(a.created_at),
        }))

        fullpageloader.value=false;
    }else{ fullpageloader.value=false;}
})();

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
        <v-col cols="12" lg="4" >
            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                <v-card-item class="pt-3 pb-0 pe-0 overflow-hidden">
                    <router-link to="/internal-booking" class="text-decoration-none">
                        <v-row>
                            <v-col cols="12" sm="6" class="pt-sm-10 pt-5">
                                <div class="d-flex align-center">
                                    <v-avatar size="50" variant="flat" rounded="sm" class="booking_customer"><img
                                            src="@/assets/images/admin/booking-img.svg" height="30" alt="icon" />
                                    </v-avatar>
                                    <div>
                                        <h5 class="text-h5 ml-4 text-secondary mb-1">Total Bookings</h5>
                                        <h4
                                            class="text-h4 mt-3 ml-4 text-secondary">
                                            {{bookcount}}</h4>
                                    </div>
                                </div>
                           
    
                            </v-col>
                            <v-col cols="12" sm="6" class="text-sm-right">
                                <div class="mb-n2 ">
                                    <img src="@/assets/images/admin/bg-removes.png" class="customer_bookingimage" alt="image"
                                        width="155" />
                                </div>
                            </v-col>
                        </v-row>
                    </router-link>
                </v-card-item>
            </v-card>
        </v-col>
       
        <!-- <v-col cols="12" lg="4" md="4" sm="4">
            <v-card elevation="10" class="bg-lightprimary">
                <v-card-item>
                    <h6 class="text-subtitle-1 textSecondary">Total Bookings</h6>
                    <h4 class="text-h4 mt-1">535</h4>
                    <div class="pt-2">
                        <v-avatar class="bg-secondary" size="25">
                            <ArrowUpRightIcon size="20" color="secondary" />
                        </v-avatar>
                        <span class="text-subtitle-1 ml-2 font-weight-bold">+9%</span>
                    </div>
                </v-card-item>
                <apexchart class="" type="area" height="80" :options="chartOptions" :series="Chart"> </apexchart>
            </v-card>
        </v-col> -->

        <v-col cols="12" lg="2" md="4" sm="4">

            <v-card elevation="10" class="bg-color-vendors">
                <v-card-item>
                    <router-link to="/admin-reports" class=" text-dark text-decoration-none">
                        <h6 class="text-subtitle-1 text-vendors font-weight-bold">Total Revenue</h6>
                        <h4 class="text-h4 mt-1 ">$ {{rvncount}}</h4>
                        <div class="pt-2">
                            <v-avatar class="bg-arrow-color" size="25">
                                <ArrowUpRightIcon size="20" color="#fff" />
                            </v-avatar>
                            <!-- <span class="text-subtitle-1 ml-2 font-weight-bold">+9%</span> -->
                        </div>
                    </router-link>
                </v-card-item>
                <div class="mb-n2 ">
                    <!-- <img src="@/assets/images/admin/graph.png" class="graph-image" alt="image"
                        width="181" /> -->
                </div>
            </v-card>
        </v-col>

        <!-- additional -->
        
 
        <v-col cols="12" lg="2" md="4" sm="4" v-for="card in topCardsData" :key="card.title">
            <router-link to="/achats" class="text-decoration-none">
                <div
                    :class="'h-100 py-7 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-' + card.bgcolor">
                    <div>
                        <img :src="card.img" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-' + card.textcolor">{{ card.number }}</h4>
                        <h3><span :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-' + card.textcolor">{{
                            card.title }}</span></h3>
                        <!-- <div :class="'text-subtitle-2 text-capitalize font-weight-bold mt-1 text-' + card.textcolor"
                            v-text="card.subtitle"></div> -->
    
                    </div>
                </div>
            </router-link>
        </v-col>

        <v-col cols="12" lg="2" md="4" sm="4">
            <v-card elevation="10" class="bg-color-tab">
                <v-card-item class="cust_omers">
                    <router-link to="/admin-couples" class="text-decoration-none">
                        <h6 class="text-subtitle-1  text-secondary font-weight-bold mb-2">Total Customers</h6>
                        <h4 class="text-h4 mt-1 text-primary">{{cupcount}}</h4>
                        <div class="pt-2">
                            <v-avatar class="bg-secondary" size="25">
                                <ArrowUpRightIcon size="20" color="#fff" />
                            </v-avatar>
                            <span class="text-subtitle-1 ml-2 font-weight-bold text-primary">Customers</span>
                        </div>
                    </router-link>
                </v-card-item>
                <!-- <apexchart class="" type="area" height="80" :options="chartOptions" :series="Chart"> </apexchart> -->
            </v-card>
        </v-col>

        <!-- <v-col cols="12" md="7">
            <v-card elevation="10" class="h-100">
                <v-card-item>
                    <div class="d-sm-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Bookings</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/all-bookings">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6 text-nowrap">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Provided Service</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Event Date</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Status</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in bookingData" :key="item.vendorname" :class="item.activestate"
                                    class="month-item">
                                    <td>
                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                            item.vendorname }}</h4>

                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                        <div rounded="md" class="text-body-1" size="small" label>{{ item.eventdate
                                            }}</div>
                                    </td>
                                    <td>
                                        <v-chip rounded="md" class=" font-weight-semibold" :color="item.statuscolor"
                                            size="small" label>{{ item.statustext }}</v-chip>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat v-bind="props" to="/vendor-bookings-single">
                                                        <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </h5>

                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-item>
            </v-card>
        </v-col> -->
        <v-col cols="12" md="12">
            <v-card elevation="10" class="h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5">All Payments</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/admin-reports">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-bold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-bold">Customer</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-bold">Payment type</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-bold">Status</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-bold text-end">Payments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in recentTransaction" :key="item.vendorname" :class="item.activestate" class="month-item">
                                    <td><h4 class="text-body-1 font-weight-bold">{{ index+1 }}</h4></td>
                                    <td>
                                        <div class="d-flex align-top">
                                            <v-avatar size="40" color="primary" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" />
                                            </v-avatar>
                                            <div class="mx-3">
                                                <h4
                                                    class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary">
                                                    {{ item.vendorname }}</h4>

                                                <p class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    <span class="text-subtitle-2 text-no-wrap font-weight-semibold">Date
                                                        :</span> {{ item.time }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    
                                    <td>
                                        <h4 class="text-body-1 text-primary font-weight-bold  text-capitalize">{{ item.payment_type }} Payment
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 class="text-body-1 text-primary font-weight-bold text-capitalize">{{ item.status }}
                                        </h4>
                                    </td>



                                    <td>
                                        <h4 class="text-body-1 text-success font-weight-bold text-end">{{ item.money }}
                                        </h4>
                                    </td>
                                </tr>
                                <tr v-if="recentTransaction.length === 0">
                                    <td colspan="3">
                                        <v-card elevation="0" class=" mt-6 border-0" color="">
                                            <v-card-item class="text-center">
                                                <AlertCircleIcon stroke-width="1.5" size="50"
                                                    class="mr-2 text-error" />
                                                <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                            </v-card-item>
                                        </v-card>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style type="text/css">

.topCardIcon {
    width: 45px;
    height: 45px;
}


/*booking tab */
.booking_customer {
    background: #b4801c;
    height: 45px !important;
    width: 45px !important;
    border-radius: 50% !important;

}
.booking_customer img {
    height: 26px;
    width: 26px;
    margin-left: 0px;
    margin-top: -3px;
}
.bg-color-tab{
    background-color: rgb(255 235 195) !important;
}
.bg-color-vendor {
    background-color: rgb(138 255 55 / 22%) !important;

}
.bg-color-vendors {
    background-color: rgb(130 238 54 / 31%) !important;
    min-height: 187px;
    background-image: url(/src/assets/images/admin/graph.png);
    background-position-y: 102px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: -52px;
}
.bg-arrow-color{
    background-color: rgb(16 176 147) !important;
}
.text-vendors {
    color: rgb(15 133 109) !important;
}
.v-card-item.cust_omers {
    min-height: 185px;
}
</style>
