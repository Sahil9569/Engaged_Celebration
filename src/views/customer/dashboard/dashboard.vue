<script setup lang="ts">

import { ref } from 'vue';
import { Carousel, Slide, } from "vue3-carousel";
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import notif from '@/stores/notify';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


import card_icon1 from "@/assets/images/customer/networkb-golden.png"
import card_icon2 from "@/assets/images/customer/link.png"
import card_icon3 from "@/assets/images/customer/chatvendor.png"
import user1 from "@/assets/images/profile/user-1.jpg";
import review1 from '@/assets/images/customer/makeUp.png';


const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)
const bkcount = ref(111)
const chcount = ref(999)





const bookingData = ref([]);
const recentTransaction = ref ([]);


async function showtransactions() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'user_current_role');
    formData.append("user_current_role",'customer');
   
    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    
    if (response.data.status == 'SAVED') {
        recentTransaction.value = response.data.pay_booking_data.map((elem) => ({
        "img": elem.vendor 
       ? (elem.vendor.userprofile.profile_pic ? BASE_URL + elem.vendor.userprofile.profile_pic : user1) 
       : (elem.admin.userprofile.profile_pic ? BASE_URL + elem.admin.userprofile.profile_pic : user1),
        "vendorname": `${elem.booking.package.user.first_name} ${elem.booking.package.user.last_name}`,
        "vendoremail": `${elem.booking.package.user.email}`,
        "service": elem.booking.package.name,
        "transactiondate": formatDate(elem.created_at),
        "payment": '$' + elem.total_amt,
      })).slice(0,5);
     
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showtransactions()


const vendorcategory = ref([{ img: review1, title: 'Makeup Artists', vendors: '200', },]);
async function init_dashboard() {
    const response = await axios.post('/home/vendor_dashboard', {}, { headers: { "Content-Type": "application/json" }, withCredentials: true })
    console.log("response___________________", response)
    if (response.data.status == 'SENT') {
        vendorcategory.value = response.data.cats.map((cat: any) => ({
            img: BASE_URL + cat.pic, title: cat.name, vendors: cat.vendor_count,
            id: cat.id
        }))
        bkcount.value = response.data.bkcount
        chcount.value = response.data.chcount
        
    }
}
init_dashboard()

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
        formData.append("ViewAllBopking", 'ViewAllBopking');
        formData.append("user_role", 'customer');
        const response = await axios.post(`/home/makebooking`, formData, config);
        console.log(response.data, "hi responce all booking customer    v   ")

        if (response.data.status == 'SAVED') {
            bookingData.value = response.data.booking_data.map((elem) => ({
                "img": (elem.package.vendor) ? ((elem.package.vendor.userprofile.profile_pic) ? BASE_URL + elem.package.vendor.userprofile.profile_pic : user1) :((elem.package.admin.userprofile.profile_pic) ? BASE_URL + elem.package.admin.userprofile.profile_pic : user1),
                "vendorname": `${elem.package.user.first_name} ${elem.package.user.last_name}`,
                "vendoremail": `${elem.package.user.email}`,
                "service": elem.package.name,
                "bookingdate": formatDate(elem.seldate),
                "bookingpayment":  elem.budget,
                "statustext": elem.status,
                "link": `/booking-single/` + elem.id,
                // Include other properties as needed
            })).slice(0,5);
            fullpageloader.value = false
        }


    } catch (error) { console.error("Error fetching data:", error); }
}
showbooking()

const welcomedialog = ref(false);
async function mark_welcome(mark = false) {
    const response = await axios.post(`/home/mark_welcome`, { 'mark': mark }, config);
    if (response.data.status == 'DONE') { welcomedialog.value = false }
    else { welcomedialog.value = true }
}
mark_welcome()

const testimonialSettings = { 
    snapAlign: "start",
  itemsToShow: 3,
  autoplay: false,
  arrows: true,
  loop: true // Enable infinite sliding
 };
const testimonialBreakpoints = { 300: { itemsToShow: 1 }, 600: { itemsToShow: 1 }, 767: { itemsToShow: 2 }, 991: { itemsToShow: 4 }, 1500: { itemsToShow: 6 }, 1800: { itemsToShow: 6 }, 2200: { itemsToShow: 7 }, };
const carouselRef = ref(null);
const nextSlide = () => { carouselRef.value && carouselRef.value.next(); };
const prevSlide = () => { carouselRef.value && carouselRef.value.prev(); };
const valueSuccess = ref(false)


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
    <v-dialog v-model="welcomedialog" class="dialog-mw" :max-width="560" persistent transition="dialog-top-transition">
        <v-card elevation="0" rounded="md" class="bg-lightprimary mt-6 py-12 bg-welcome ">
            <v-card-item class="pt-0 position-relative">
                <v-row>
                    <v-col cols="12" sm="12" class="pa-6 text-center">
                        <img src="@/assets/images/logos/ringlogo.png" class="sizeLogoWelcome" />
                        <h5 class="text-h4 mb-2">Welcome to Engaged Celebration</h5>
                        <h6 class="text-subtitle-1 mb-3 text-13  textSecondary font-weight-medium"> Congratulations on joining. Our platform is dedicated to making your special day memorable and seamless. You're now part of a vibrant community committed to unforgettable experiences for couples, vendors, and their guests.</h6>
                        <v-btn flat color="primary" @click="mark_welcome(true)">Start Journey</v-btn>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>
    </v-dialog>


    <div class="alertWrap">
        <v-alert v-if="valueSuccess" type="success" density="flat" class="mb-4" closable>
            <div>This is an Success alert — check it out!</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert v-if="valueSuccess" type="error" density="flat" class="mb-4" closable>
            <div>This is an Error alert — check it out!</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert v-if="valueSuccess" type="info" density="flat" class="mb-4" closable>
            <div>New Message Notification — check it out!</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-bell-outline</v-icon>
            </template>
        </v-alert>
    </div>

    <v-row>
        <v-col cols="12" lg="2" md="4" sm="4">
            <router-link :to="'/all-bookings'" class="text-decoration-none">
                <div :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-lightsecondary'">
                    <div :class="'bg-lightsecondary'">
                        <img :src="card_icon1" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-secondary'">{{ bkcount }}<span class="text-subtitle-1 text-capitalize font-weight-bold mt-3">Vendors</span> </h4>
                        <div :class="'text-subtitle-2 text-capitalize font-weight-bold mt-1 text-secondary'" v-text="'you\'ve contacted.'"></div>
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4">
            <router-link :to="'/cchats'" class="text-decoration-none">
                <div
                    :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-lighterror'">
                    <div :class="'bg-lighterror'">
                        <img :src="card_icon2" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-error'">{{ chcount }} <span
                                class="text-subtitle-1 text-capitalize font-weight-bold mt-3">Recent</span> </h4>
                        <div :class="'text-subtitle-2 text-capitalize font-weight-bold mt-1 text-error'" v-text="'Interactions'"></div>
    
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4">
            <router-link :to="'/cchats'" class="text-decoration-none">
                <div
                    :class="'h-100 py-12 px-4 text-decoration-none d-flex align-center justify-start text-start rounded-md pa-6  bg-lightsuccess'">
                    <div :class="'bg-lightsuccess'">
                        <img :src="card_icon3" alt="icon" class="topCardIcon" />
                        <h4 :class="'text-h4 mt-3 text-success'">{{notif["msg_count"]}}<span class="text-subtitle-1 text-capitalize font-weight-bold mt-3">New</span></h4>
                        <div :class="'text-subtitle-2 text-capitalize font-weight-bold mt-1 text-success'" v-text="'Messages from vendors'"></div>
                    </div>
                </div>
            </router-link>
        </v-col>
        <v-col cols="12" lg="6">
            <v-card elevation="0" rounded="md"
                class="py-md-14 py-14 bg-lightprimary border-0 h-100 background-card d-flex align-center">
                <v-card-item class="pt-3 pb-0">
                    <v-row>
                        <v-col cols="12" sm="12" class="d-flex align-center">
                            <div class="">
                                <h5 class="text-h5 mb-3">Find Open Vendors and <br> Exclusive Packages Here!</h5>
                                <v-btn flat color="secondary" to="/vendor-category">Find Vendors</v-btn>
                                
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
        <v-col cols="12" md="7">
            <v-card elevation="10" class="h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <div class="d-sm-flex d-block align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Bookings</v-card-title>
                        </div>
                        <div>
                            <v-btn flat class="rounded-sm" size="small" color="secondary" to="/all-bookings">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Vendor/Admin Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Deposit</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in bookingData" :key="item.id" :class="item.activestate"
                                    :currentPage="currentPage" :pageSize="5" class="month-item">
                                    <!-- <tr v-for="item in bookingData" :key="item.vendorname" :class="item.activestate"
                                    class="month-item"> -->
                                    <td><h5 class="text-no-wrap text-body-1">{{ index + 1}}</h5></td>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40">
                                                <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                                    item.vendorname }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    {{ item.vendortype }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                           $ {{ item.bookingpayment }}
                                        </h5>
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
                                <tr v-if="bookingData.length === 0">
                                    <td colspan="4">
                                        <v-col cols="12">
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
                </v-card-item>
            </v-card>
        </v-col>
        <v-col cols="12" md="5">
            <v-card elevation="10" class="h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <div class="d-sm-flex d-block align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Recent Transaction</v-card-title>
                        </div>
                        <div>
                            <v-btn class="rounded-sm" flat size="small" color="secondary" to="/transactions">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Vendor</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-end">Payments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in recentTransaction" :key="item.vendorname" :class="item.activestate"
                                    class="month-item">
                                    <td><h5 class="text-no-wrap text-body-1">{{ index + 1}}</h5></td>
                                    <td>
                                        <div class="d-flex align-top">
                                            <v-avatar size="40" color="primary" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" />
                                            </v-avatar>
                                            <div class="mx-3">
                                                <h4
                                                    class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary">
                                                    {{ item.vendorname }}</h4>
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
        <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-2 pe-3 pe-md-0">
                <div>
                    <v-card-title class="text-h5 text-secondary">Vendors Category</v-card-title>
                </div>
                <div>
                    <v-btn flat size="small" to="/vendor-category" color="secondary">View All</v-btn>
                </div>
            </div>
            <div class="position-relative">
                <carousel ref="carouselRef" :settings="testimonialSettings" :breakpoints="testimonialBreakpoints"
                    class="overflow-hidden">
                    <template v-for="card in vendorcategory" :key="card.img">
                        <slide v-if="card.vendors != 0">
                            <!-- <router-link :to="'/vendors?cat=' + card.title" class="text-decoration-none w-100 ma-2"> -->

                            <router-link :to="'/single_service/' + card.id" class="text-decoration-none w-100 ma-2">
                                <div elevation="10" class="rounded vendor-card-background d-flex align-end"
                                    :style="{ backgroundImage: `url(${card.img})` }">
                                    <div class="pa-6 text-left text-white position-relative">
                                        <h3 class="text-subtitle-1 text-no-wrap font-weight-semibold text-white">
                                            {{ card.title }}
                                        </h3>
                                        <p class="text-subtitle-2 text-no-wrap font-weight-semibold text-white">
                                            ({{ card.vendors }})
                                        </p>
                                    </div>
                                </div>
                            </router-link>
                        </slide>
                    </template>
                </carousel>
                <div class="carousel-arrows">
                    <button @click="prevSlide" class="arrow-button prev" :disabled="isFirst">
                        <span>
                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                        fill="#0F0F0F"></path>
                                </g>
                            </svg>
                        </span>
                    </button>
                    <button @click="nextSlide" class="arrow-button next" :disabled="isLast">
                        <span>
                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                        fill="#0F0F0F"></path>
                                </g>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </v-col>
    </v-row>


    
</template>
<style type="text/css">
.topCardIcon {
    width: 35px;
    height: 35px;
}

.background-card {

    background-image: url(@/assets/images/customer/bride-groom.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.vendor-card-background {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    overflow: hidden;
    min-height: 200px;
}

.vendor-card-background:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 37%, #000000fc 80%);
    left: 0;
    top: 0;
    opacity: 0.6;
}

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

img.sizeLogoWelcome {
    width: 90px;
}

.bg-welcome {
    background: url("@/assets/images/wedding/wedding-stage.jpeg");
    background-size: cover;
    background-position: center;
}

.bg-welcome:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.7;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
}
</style>
