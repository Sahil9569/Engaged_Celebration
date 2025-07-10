<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
import { useAuthStore } from '@/stores/auth';
import BASE_URL from '@/stores/myVar';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }    
const authStore     = useAuthStore();
const user          = JSON.parse(localStorage.getItem('user'))
const urole         = localStorage.getItem('role')
const upackactive   = (localStorage.getItem('vpackactive') == 'true')
const upic          = (user.profile_pic) ? BASE_URL + user.profile_pic : '/src/assets/images/profile/user-1.jpg'

import { getSecondary } from '@/utils/UpdateColors';
import card_icon1 from "@/assets/images/customer/event-golden.png"
import card_icon3 from "@/assets/images/customer/chatvendor.png"
import card_icon2 from "@/assets/images/customer/customer.png"
import { CircleXIcon, AlertTriangleIcon } from 'vue-tabler-icons';

import user1 from "@/assets/images/profile/user-1.jpg";
import notif from '@/stores/notify';


const isExpired           = ref(!(localStorage.getItem('vpackactive') == 'true'));
const myerrors              = ref('');
const showSuccessMessage    = ref(false);
const showErrorMessage      = ref(false);
const fullpageloader        = ref(true)
const bookingDataLength     = ref(0)
const total_amt             = ref('0')
const ccount                = ref('111')
const bookingData           = ref([]);
const recentTransaction     = ref ([]);



async function showtransactions() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'user_current_role');
    formData.append("user_current_role",'vendor');
    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    
    if (response.data.status == 'SAVED') {
        recentTransaction.value = response.data.pay_booking_data.map((elem) => ({
        "img": elem.vendor 
       ? (elem.vendor.userprofile.profile_pic ? BASE_URL + elem.vendor.userprofile.profile_pic : user1) 
       : (elem.admin.userprofile.profile_pic ? BASE_URL + elem.admin.userprofile.profile_pic : user1),

        "name":elem.couple ? `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`:"",
        "email":elem.couple ?  `${elem.couple.userprofile.user.email}`:"",
        "service": elem.booking.package.name,
        "transactiondate": formatDate(elem.created_at),
        "payment": '$' + elem.total_amt, 
      })).slice(0,5);
      fullpageloader.value = false
    }else{
        fullpageloader.value = false
    }
    ccount.value    = response.data.ccount
    total_amt.value = `$${parseInt(response.data.yearly_total).toFixed(2)}`;

 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showtransactions()

const chartOptions = computed(() => {
    return {
        chart: {
            type: 'area',
            height: 80,
            fontFamily: `inherit`,
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            },
            group: 'sparklines'
        },
        colors: [getSecondary.value],
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'solid',
            opacity: 0.05
        },
        markers: {
            size: 0
        },
        tooltip: {
            enabled: false,
            theme: 'dark',
            x: {
                show: false
            }
        }
    };
});
const Chart = [
    {
        name: '',
        data: [30, 25, 35, 20, 30, 40]
    }
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function showbooking() {
  try {
    const formData = new FormData();
    formData.append("ViewAllBopking",'ViewAllBopking');
    formData.append("user_role",'vendor');
    const response = await axios.post(`/home/makebooking`, formData, config);
    console.log(response.data,"hi responce booking vendor")

    if (response.data.status == 'SAVED') {
        bookingDataLength.value = response.data.booking_data.length;
        
        bookingData.value = response.data.booking_data.map((elem:any) => ({
        "img": (elem.couple.userprofile.profile_pic) ? BASE_URL + elem.couple.userprofile.profile_pic : user1,
        "customername": `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
        "customeremail":elem.couple.userprofile.user.email,
        "service": elem.package.name,
        "bookingdate": formatDate(elem.seldate),
        "bookingpayment":elem.budget,
        // "eventlocation": '$' + elem.budget,
        // "statuscolor": "success",
        "statustext": elem.status,
        "link": `/vendor-booking-single-action/view/${elem.id}`, 
        })).slice(0,5);
    }

 

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showbooking()



const welcomedialog = ref(false);
async function mark_welcome(mark=false) {
    const response = await axios.post(`/home/mark_welcome`, {'mark':mark}, config);
    if (response.data.status == 'DONE') { welcomedialog.value = false }
    else { welcomedialog.value = true }
}
mark_welcome()


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
    
    <div class="text-center">
        <v-dialog v-model="welcomedialog" class="dialog-mw" :max-width="560" persistent transition="dialog-top-transition">
        <v-card elevation="0" rounded="md" class="bg-lightprimary mt-6 py-12 bg-welcome ">
            <v-card-item class="pt-0 position-relative">
                <v-row>
                    <v-col cols="12" sm="12" class="pa-6 text-center">
                        <img src="@/assets/images/logos/ringlogo.png" class="sizeLogoWelcome"/>
                        <h5 class="text-h4 mb-2">Welcome to Engaged Celebration</h5>
                        <h6 class="text-subtitle-1 mb-3 text-13  textSecondary font-weight-medium">Congratulations on joining. Our platform is dedicated to making your special day memorable and seamless. You're now part of a vibrant community committed to unforgettable experiences for couples, vendors, and their guests.</h6>
                        <v-btn flat color="primary" @click="mark_welcome(true)">Start Journey</v-btn>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>
        </v-dialog>
    </div>
    <v-row>
        <v-col cols="12" v-if="isExpired">
            <div class="d-flex align-center justify-start text-start rounded-md bg-error pa-1 px-2">
                <div class="d-flex justify-between align-items-center">
                    <AlertTriangleIcon width="18" class="v-icon--start" />Your package has expired, which may limit your access to certain services. Please renew your package to ensure smooth access to all features.
                    <span @click="isExpired = false" class="text-light mx-4"><CircleXIcon width="18" class="v-icon--start" /></span>
                </div>
                <!-- <div class="d-flex justify-flex-end align-center"><span @click="isExpired = false" class="text-light mx-4"><CircleXIcon width="18" class="v-icon--start" /></span></div>  -->
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" lg="6" >
            <v-card elevation="0" rounded="md" class="bg-grey100 border border-grey200 rounded overflow-hidden">
                <v-card-item class="pt-3 pb-0 pe-0 overflow-hidden">
                    <v-row>
                        <v-col cols="12" sm="6" class="pt-sm-10 pt-5">
                            <div class="d-flex align-center">
                                <v-avatar size="50" variant="flat" rounded="sm" class="setUserImg">
                                    <img :src="upic" height="50" alt="icon" /> 
                                </v-avatar>
                                <div>
                                    <h5 class="text-h5 ml-4 text-dark text-capitalize mb-1">{{user.user.first_name}} {{user.user.last_name}}</h5>
                                    <h4 class="text-subtitle-2 ml-4 text-uppercase text-no-wrap font-weight-semibold textPrimary"> Vendor Account</h4>
                                </div>
                            </div>
                            <div class="mt-8">
                                <div class="d-flex">
                                    <div>
                                        <div class="d-flex">
                                            <h2 class="text-h2 textPrimary">{{ total_amt }} </h2>
                                            <div class="mt-1 ml-1">
                                                <ArrowUpRightIcon stroke-width="1.5" size="22" class="text-success" />
                                            </div>
                                        </div>
                                        <div class="text-subtitle-1 textPrimary mt-1">Total Revenue</div>
                                    </div>
                                    <v-divider vertical class="mx-5"></v-divider>
                                    <!-- <div>
                                        <div class="d-flex">
                                            <h2 class="text-h2 textPrimary">35%</h2>
                                            <div class="mt-1 ml-1">
                                                <ArrowUpRightIcon stroke-width="1.5" size="22" class="text-success" />
                                            </div>
                                        </div>
                                        <div class="text-subtitle-1 textPrimary mt-1">Performance</div>
                                    </div> -->
                                </div>
                            </div>

                        </v-col>
                        <v-col cols="12" sm="6" class="text-sm-right">
                            <div class="mb-n2 ">
                                <img src="@/assets/images/backgrounds/welcome-bg.svg" class="" alt="image"
                                    width="340" />
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>

        <!-- <v-col cols="12" lg="2" md="4" sm="4">
            <v-card elevation="10" class="bg-lightprimary">
                <v-card-item>
                    <h6 class="text-subtitle-1 textSecondary">Customers</h6>
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
            <router-link to="/vendor-bookings" class="text-decoration-none">
                <div :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-lightsecondary'">
                    <div :class="'bg-lightsecondary'">
                        <img :src="card_icon1" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-secondary'">{{ bookingDataLength }}</h4>
                        <h3><span :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-secondary'">Total Bookings</span></h3>
                        <!-- <div :class="'text-subtitle-2 text-capitalize font-weight-bold mt-1 text-' + card.textcolor"
                            v-text="card.subtitle"></div> -->
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4">
            <router-link to="/vendor-contract-listing" class="text-decoration-none">
                <div :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-grey200'">
                    <div :class="'bg-grey200'">
                        <img :src="card_icon2" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-'">{{ ccount }}</h4>
                        <h3><span :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-'">Total Contracts</span></h3>
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4">
            <router-link to="/vchats" class="text-decoration-none">
                <div :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-lightsuccess'">
                    <div :class="'bg-lightsuccess'">
                        <img :src="card_icon3" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-success'">{{ notif["msg_count"] }}</h4>
                        <h3><span :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-success'">New Messages</span></h3>
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" md="7">
            <v-card elevation="10" class="h-100">
                <v-card-item>
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Bookings</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/vendor-bookings">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6 text-nowrap">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold">Event Date</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Deposit</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Status</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in bookingData" :key="item.id" :class="item.activestate"
                                    class="month-item">

                                <!-- <tr v-for="item in bookingData" :key="item.vendorname" :class="item.activestate"
                                    class="month-item"> -->
                                    <td><h5 class="text-no-wrap text-body-1">{{ index+1 }}</h5></td>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                        item.customername }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    {{ item.customeremail }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <!-- <td>
                                        
                                        <h5 class="text-no-wrap text-body-2">
                                            <CalendarIcon size="12" color="secondary" stroke-width="2.5" class="mr-1" />
                                            {{ item.bookingdate }}
                                        </h5>
                                      
                                    </td> -->
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                           $ {{ item.bookingpayment }} 
                                        </h5>
                                    </td>
                                    <!-- <td>
                                        <v-chip rounded="md" class=" font-weight-semibold" :color="item.statuscolor"
                                            size="small" label>{{ item.statustext }}</v-chip>
                                    </td> -->
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
                                <tr v-if="bookingData.length === 0">
                                    <td colspan="6">
                                        <v-col cols="12">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50"
                                                        class="mr-2 text-error" />
                                                    <h5 class="text-h6 pt-3 text-error">Data Not Found!</h5>
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
                </v-card-item>
            </v-card>
        </v-col>
        <v-col cols="12" md="5">
            <v-card elevation="10" class="h-100">
                <v-card-item class="">
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">All Payments</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/manage-transaction">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-end">Payments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in recentTransaction" :key="item.vendorname"
                                    class="month-item">
                                    <td><h5 class="text-no-wrap text-body-1">{{ index+1 }}</h5></td>
                                    <td>
                                        <div class="d-flex align-top">
                                            <v-avatar size="40" color="primary" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" />
                                            </v-avatar>
                                            <div class="mx-3">
                                                <h4
                                                    class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary">
                                                    {{ item.name }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    <span
                                                        class="text-subtitle-2 text-no-wrap font-weight-semibold">Service
                                                        :</span> {{ item.service }}
                                                </h6>
                                                <p class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    <span class="text-subtitle-2 text-no-wrap font-weight-semibold">Date
                                                        :</span> {{ item.transactiondate }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h4 class="text-body-1 text-success font-weight-bold text-end">{{ item.payment }}
                                        </h4>
                                    </td>
                                </tr>
                                <tr v-if="recentTransaction.length === 0">
                                    <td colspan="3">
                                        <v-col cols="12">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50"
                                                        class="mr-2 text-error" />
                                                    <h5 class="text-h6 pt-3 text-error">Oops Data Not Found!</h5>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
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

.carousel-arrows {
    width: 100%;
}

button.arrow-button.next {
    right: 0;
}

button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

button.arrow-button span {
    display: flex;
    background: #fff;
    width: 30px;
    height: 47px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
}

.text-nowrap th,
.text-nowrap td {
    white-space: nowrap;
}



/* width */
.v-table__wrapper::-webkit-scrollbar {
    height: 8px;
}

/* Track */
.v-table__wrapper::-webkit-scrollbar-track {
    background: #f2f6fa;
}

/* Handle */
.v-table__wrapper::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
}

/* Handle on hover */
.v-table__wrapper::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

img.sizeLogoWelcome {
    width: 90px;
}

.bg-welcome {
    background: url("@/assets/images/wedding/wedding-stage.jpeg");
    background-size: cover;
    background-position: center;
}
.bg-welcome:before{
        content: "";
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.8;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
}

</style>
