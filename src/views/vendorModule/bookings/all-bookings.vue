<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import BASE_URL from '@/stores/myVar'
import user1 from "@/assets/images/profile/user-1.jpg";
import { Carousel, Slide } from "vue3-carousel";

const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);

const strp_status = ref("");

const bookingData = ref([]);
const bookingDatareq = ref([]);
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
    const isearch = search.value.toLowerCase()
    const ilist = bookingData.value.filter((i: any) => (
        i.customername.toLowerCase().includes(isearch) ||
        i.customeremail.toLowerCase().includes(isearch) ||
        // i.service.toLowerCase().includes(isearch) ||
        // i.bookingdate.includes(isearch) ||
        String(i.price).includes(isearch) ||
        i.statustext.toLowerCase().includes(isearch)))

    function chdate(a: any, b: any) {
        const i = new String(a).split("-");
        const j = new String(b).split("/");
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter(item =>
    (
        (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.status.toLowerCase())) &&
        (searchtime.value.length === 0 || searchtime.value.includes('All') || searchtime.value.toLowerCase().includes(item.statustime.toLowerCase())) &&
        // ([undefined, null, 0, ''].includes(searchbudget.value) || String(item.price).includes(String(searchbudget.value))) &&
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
function compareDates(idate: any) {
    const a = new Date(idate);
    const b = new Date();
    const input = new Date(`${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`)
    const today = new Date(`${b.getFullYear()}-${b.getMonth() + 1}-${b.getDate()}`)
    return (input > today) ? 'Future' : ((input < today) ? 'Past' : 'Present')
}

const wallet_amt = ref(0);
async function showbooking() {
    try {
        const formData = new FormData();
        formData.append("ViewAllBopking", 'ViewAllBopking');
        formData.append("user_role", 'vendor');
        formData.append("open_platform_request", 'open');
        const response = await axios.post(`/home/makebooking`, formData, config);
        console.log(response.data, "hi responce booking vendor")
        fullpageloader.value = true;

        if (response.data.status == 'SAVED') {

            const res = response.data.ven_profile
            strp_status.value = res.stripe_status
            wallet_amt.value= response.data.wallet_amt

            if (response.data.booking_data) {
                bookingData.value = response.data.booking_data
                    .map((elem, index) => ({
                        img: elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1,
                        customername: `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
                        customeremail: elem.couple.userprofile.user.email,
                        service: elem.package.name,
                        id: elem.id,
                        bookingdate: formatDate(elem.seldate),
                        bookingpayment: elem.budget,
                        price: elem.package.price,
                        statuscolor: elem.status === "accepted" ? "success" : "primary",
                        statustime: compareDates(elem.seldate),
                        statustext: elem.status,
                        link: `/vendor-booking-single-action/view/${elem.id}`,
                        a_link: `/vendor-booking-single-action/accept/${elem.id}`,
                        r_link: `/vendor-booking-single-action/reject/${elem.id}`,
                        contract: elem.contract,
                        status: elem.status,
                        booking_status: elem.booking_status,
                        category: elem.package.category.name,
                        category_price: elem.package.category.price ? (Number(elem.package.category.price) % 1 === 0 
                                    ? Number(elem.package.category.price).toFixed(0) 
                                    : elem.package.category.price)
                                    : 0,
                        sno: index + 1,
                    }))
                    ;
            }

            if (response.data.requested_bookings) {
                bookingDatareq.value = response.data.requested_bookings.map((elem, index) => ({
                    img: elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1,
                    customername: `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
                    customeremail: elem.couple.userprofile.user.email,
                    service: elem.package.name,
                    id: elem.id,
                    bookingdate: formatDate(elem.created),
                    bookingpayment: elem.budget,
                    price: elem.package.price,
                    statuscolor: elem.status === 'accepted' ? 'success' : 'primary',
                    statustext: elem.status,
                    link: `/vendor-booking-single-action/view/${elem.id}`,
                    a_link: `/vendor-booking-single-action/accept/${elem.id}`,
                    r_link: `/vendor-booking-single-action/reject/${elem.id}`,
                    contract: elem.contract,
                    status: elem.status,
                    mlink: `vchats?march=${elem.march}`,
                    sno: index + 1,
                }));
            }

            fullpageloader.value = false;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

onMounted(() => {
    showbooking()
});

async function booking_req(action = 'null', booking_id = null) {
    try {
        const formData = new FormData();
        formData.append("action", action);

        formData.append("booking_id", booking_id);
        fullpageloader.value = true
        const response = await axios.post(`/home/booking_action`, formData, config);
        if (response.data.status == 'SENT') {
            myerrors.value = "Booking request accepted successfully!"
            showSuccessMessage.value = true;
            setTimeout(() => { showSuccessMessage.value = false; }, 800);
            window.location.href = response.data.link_btn;
        }
        if (response.data.status == 'Delete') {
            myerrors.value = "Booking request deleted successfully!"
            showSuccessMessage.value = true;
            setTimeout(() => { showSuccessMessage.value = false; }, 800);
            window.location.reload();
        }
        if (response.data.status === "SUB_EXPIRED") {
            myerrors.value = response.data.msg;
            showErrorMessage.value = true
            fullpageloader.value = false
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const newbookingslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 1, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: false,
};
const newbookingslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 3 },
    2200: { itemsToShow: 3 },
};

const carouselfirstRef = ref(null);
const nextfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.next(); };
const prevfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.prev(); };
const c_stripe_dialog = ref(false)
const connect_stripe = () => { c_stripe_dialog.value = true; };





const unlock_booking_popup = ref(false);
const activeBooking = ref<{ id: number; category_price: number } | null>(null);
const toggleDialog = (booking: { id: number; category_price: number }) => {
  activeBooking.value = booking;
  unlock_booking_popup.value = true;
};

// async function unlock_booking(amount = null,booking_id = null) {
//   fullpageloader.value = true;
//   var formdata = new FormData();
//   formdata.append('amount', amount);
//   formdata.append('booking_id', booking_id);
//   try {
//     const response = await axios.post(`/home/unlock_bookings`, formdata, config);
//     if (response.data.status === 'SAVED') {
//         unlock_booking_popup.value = false;
//         myerrors.value = "Booking request has been unlock successfully!"
//         showSuccessMessage.value = true;
//         fullpageloader.value = false;
//         setTimeout(() => { showSuccessMessage.value = false; }, 1500);
//         setTimeout(() => { window.location.reload(); }, 400);

//     }
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     console.log("fgt");
//   }
// }

const redirect_link = `${BASE_URL}/profile-settings`
const errorMsg = ref("");
async function unlock_booking(amount = null, booking_id = null) {
  // ✅ Check if wallet balance is enough
  if (wallet_amt < amount) {
    errorMsg.value = "Insufficient balance. Please add funds.";
    return;
  }

  fullpageloader.value = true;
  var formdata = new FormData();
  formdata.append("amount", amount);
  formdata.append("booking_id", booking_id);

  try {
    const response = await axios.post(`/home/unlock_bookings`, formdata, config);
    if (response.data.status === "SAVED") {
      unlock_booking_popup.value = false;
      myerrors.value = "Booking request has been unlocked successfully!";
      showSuccessMessage.value = true;
      fullpageloader.value = false;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 1500);
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("fgt");
  }
}

</script>
<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">

            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <div class="pa-sm-6 pa-3">
                    <v-card-title class="text-h4 text- ps-0 mb-2">All Bookings </v-card-title>
                    <v-row class="justify-content-between pt-3">
                        <!-- <v-col cols="12" md="12"> 
                            <v-card-title class="text-h4 text-secondary">All
                                Bookings
                            </v-card-title>
                        </v-col> -->
                        <v-col cols="12" md="12">
                            <v-card elevation="0" class="border bg-lightCustom">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">
                                        Filters
                                    </p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search"
                                                label="Search Booking/Price" hide-details
                                                variant="outlined"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details
                                                type="date" label="Filter By date" density="compact"></v-text-field>
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
                   
                    <v-row v-if="bookingDatareq.length">
                        <v-col cols="12">
                            <div class="newbookingSlider position-relative">
                                <div class="position-relative overflow-hidden">
                                    <carousel ref="carouselfirstRef" :settings="newbookingslideSettings"
                                        :breakpoints="newbookingslideBreakpoints"
                                        class="overflow-hidden slider-reset row">
                                        <slide class="pt-2 pb-4 px-2" v-for="(item, index) in bookingDatareq"
                                            :key="index">
                                            <div class="w-100">
                                                <v-card elevation="10"
                                                    class="border bg-lightsecondary border-secondary mb-5">
                                                    <v-card-item class="pa-2">
                                                        <v-row class="pa-1">
                                                            <v-col cols="auto" class="d-flex align-start">
                                                                <v-avatar size="90" variant="flat" rounded="sm"
                                                                    class="">
                                                                    <img :src="item.img" :alt="item.img" width="90"
                                                                        class="newbookingImg rounded" />
                                                                </v-avatar>
                                                            </v-col>
                                                            <v-col md="7" class="pa-md-4 ps-md-0 pe-md-0">
                                                                <div class="chatFloat">
                                                                    <v-btn icon size="x-small" :to="item.mlink">
                                                                        <Message2Icon width="16" height="16"
                                                                            stroke-width="2.5" color="success"
                                                                            class="text-success" />
                                                                    </v-btn>
                                                                </div>
                                                                <div class="">
                                                                    <div
                                                                        class="d-flex gap-1 align-center justify-space-between">
                                                                        <router-link :to="item.link"
                                                                            class="text-dark text-decoration-none d-flex gap-1 align-center">
                                                                            <h4
                                                                                class="text-subtitle-1 text-no-wrap font-weight-semibold text-start">
                                                                                {{ item.customername }}
                                                                            </h4>
                                                                            <ArrowUpRightIcon size="16"
                                                                                stroke-width="2" />
                                                                        </router-link>
                                                                    </div>
                                                                    <h5
                                                                        class="text-no-wrap text-body-2 font-weight-medium text-Darklight mb-0 text-start">
                                                                        {{ item.customeremail }}
                                                                    </h5>
                                                                    <h5
                                                                        class="text-no-wrap text-body-2 font-weight-medium text-Darklight mb-0 text-start">
                                                                        {{ item.service }}
                                                                    </h5>
                                                                    <h5
                                                                        class="text-no-wrap text-body-2 font-weight-medium text-Darklight mb-0 text-start">
                                                                        {{ item.bookingdate }}
                                                                    </h5>

                                                                    <div v-if="strp_status == 'verified'"
                                                                        class="d-flex mt-1">
                                                                        <v-btn @click="booking_req('accept', item.id)"
                                                                            flat size="small" class="rounded-sm mr-1"
                                                                            color="success">
                                                                            Accept
                                                                        </v-btn>
                                                                        <v-btn @click="booking_req('reject', item.id)"
                                                                            flat size="small" class="rounded-sm mr-1"
                                                                            color="error">
                                                                            Decline
                                                                        </v-btn>
                                                                    </div>

                                                                    <div v-else class="d-flex mt-1">
                                                                        <v-btn @click="connect_stripe()" flat
                                                                            size="small" class="rounded-sm mr-1"
                                                                            color="success">
                                                                            Accept
                                                                        </v-btn>
                                                                        <v-btn @click="booking_req('reject', item.id)"
                                                                            flat size="small" class="rounded-sm mr-1"
                                                                            color="error">
                                                                            Decline
                                                                        </v-btn>
                                                                    </div>

                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-item>
                                                </v-card>
                                            </div>
                                        </slide>
                                    </carousel>
                                </div>
                                <div class="carousel-arrows ctm_crousel">
                                    <button @click="prevfirstSlide" class="arrow-button prev">
                                        <span>
                                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                                        fill="#b4801c"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                    <button @click="nextfirstSlide" class="arrow-button next">
                                        <span>
                                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                        fill="#b4801c"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </v-col>
                    </v-row>


                    <v-table class="month-table mt-6 text-nowrap border">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Category</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Event Date </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Base Price</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Deposit </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Booking Status</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage"
                                    :pageSize="5" :class="{ 'newBooking': item.statustext === 'New' }"
                                    class="month-item">

                                  

                                    

                                    <td>
                                        <h5 class="text-no-wrap text-body-1">{{ item.sno }}</h5>
                                    </td>
                                    <td v-if="item.booking_status == 'unlock'">
                                        <router-link :to="item.link" class="text-decoration-none text-dark">
                                            <div class="d-flex align-center">
                                                <v-avatar size="40" variant="flat" rounded="sm">
                                                    <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                                <div class="mx-3">
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">

                                                        {{ item.customername }}</h4>
                                                    <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                        {{ item.customeremail }}</h6>
                                                </div>
                                            </div>
                                        </router-link>
                                    </td>
                                    <td v-else>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" style="filter: blur(3.5px);" />
                                                </v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                    Locked Profile</h4>
                                                <h6 style="filter: blur(1.7px);" class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    lockedprofile@anonymous.com</h6>
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
                                            {{ item.category }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-2">
                                            <CalendarIcon size="12" color="secondary" stroke-width="2.5" class="mr-1" />
                                            {{ item.bookingdate }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-2">
                                            $ {{ item.price }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            $ {{ item.bookingpayment }}
                                        </h5>
                                    </td>
                                    <td>
                                        <v-chip rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                            :color="item.statuscolor" size="small" label>{{
                                                item.statustext }}</v-chip>
                                    </td>
                                    <td v-if="item.booking_status == 'unlock'">
                                        <h5 v-if="item.contract" class="text-no-wrap text-body-1">
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props" :to="item.link">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </h5>

                                        <h5 v-else class="text-no-wrap text-body-1">
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props" :to="item.link">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>


                                            <template v-if="strp_status == 'verified'">

                                                <v-tooltip v-if="item.status == 'requested'" text="Accept">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small"
                                                            @click="booking_req('accept', item.id)" v-bind="props">
                                                            <CheckIcon stroke-width="2.5" size="18"
                                                                class="text-success" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip v-if="item.status == 'requested'" text="Decline">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props"
                                                            @click="booking_req('reject', item.id)">
                                                            <XIcon stroke-width="2.5" size="18" class="text-error" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip v-if="item.status == 'accepted'" text="Create Contract">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props" :to="item.link">
                                                            <FilePencilIcon stroke-width="1.5" size="20"
                                                                class="text-success" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </template>

                                            <template v-else>

                                                <v-tooltip text="Accept">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" @click="connect_stripe()"
                                                            v-bind="props">
                                                            <CheckIcon stroke-width="2.5" size="18"
                                                                class="text-success" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>

                                                <v-tooltip v-if="item.status == 'requested'" text="Decline">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props"
                                                            @click="booking_req('reject', item.id)">
                                                            <XIcon stroke-width="2.5" size="18" class="text-error" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>

                                                

                                            </template>

                                        </h5>
                                    </td>
                                    <td v-else>
                                        <h5 class="text-no-wrap text-body-1">
                                            <v-btn color="primary" flat @click="toggleDialog(item)">
                                                <LockIcon stroke-width="2.5" size="18" class="text-white me-1" />
                                                $ {{ item.category_price }}
                                            </v-btn>
                                        </h5>
                                    </td>

                            

                                </tr>
                                <v-dialog v-model="unlock_booking_popup" scrollable class="dialog-mw" max-width="500">
                                    <v-card v-if="activeBooking">
                                        <v-card-title class="py-4">
                                            Available Balance - ${{ wallet_amt }}
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <p  v-if="wallet_amt >= activeBooking.category_price" >
                                                Are you sure you want to unlock this booking with ${{ activeBooking.category_price }}?
                                            </p>
                                            <p v-else>
                                                Your balance is <b> below ${{ activeBooking.category_price }} </b>. To unlock this booking, please add funds to your wallet."
                                            </p>
                                            <v-alert v-if="errorMsg" type="error" class="mt-2">
                                                {{ errorMsg }}
                                            </v-alert>

                                        </v-card-text>
                                        <v-divider></v-divider>

                                        <v-card-actions class="justify-end d-flex">
                                            <v-btn 
                                                v-if="wallet_amt >= activeBooking.category_price"
                                                color="primary" 
                                                @click="unlock_booking(activeBooking.category_price, activeBooking.id)" 
                                                class="bg-primary"
                                            >
                                                Yes
                                            </v-btn>
                                            
                    
                                            <v-btn
                                                v-else
                                                color="warning"
                                                class="bg-warning"
                                                :to="redirect_link"
                                                tag="router-link"
                                            >
                                                Add Balance
                                            </v-btn>

                                            <v-btn class="bg-primary" color="error" @click="unlock_booking_popup = false">
                                                No
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <tr>
                                    <td colspan="7">
                                        <v-col cols="12" v-if="paginatedList.length === 0">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50"
                                                        class="mr-2 text-error" />
                                                    <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </td>
                                </tr>
                            </tbody>
                            <v-dialog v-model="c_stripe_dialog" class="dialog-mw" :max-width="600">
                                <v-card class="pa-6">
                                    <div
                                        class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4
                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                            Connect to stripe </h4>
                                        <v-btn icon color="" @click="c_stripe_dialog = false" flat
                                            variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="py-4">
                                        <p>
                                            Before you can accept booking requests, you need to link
                                            up with Stripe.
                                        </p>

                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                        <v-btn class="bg-error rounded-sm" text
                                            @click="c_stripe_dialog = false" flat>
                                            Close
                                        </v-btn>

                                        <v-btn class="bg-secondary rounded-sm"
                                            to="/profile-settings/payments" text flat>
                                            Connect to Stripe
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-table>
                    <v-pagination color="primary" v-model="currentPage"
                        :length="Math.ceil(filteredList.length / itemsPerPage)" rounded="circle"></v-pagination>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(0 0 0 / 46%);
}

label.v-label.v-field-label {
    color: #171718;
    font-size: 12px;
    font-weight: 500;
}

.newBooking td {
    background-color: rgb(255 174 31 / 13%);
}

.bg-lightCustom {
    background: #f2e8d2;
}

.newbookingImg {
    width: 100%;
    height: 110px;
    object-fit: cover;
}

.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
}

.ctm_crousel button.arrow-button span {
    display: flex;
    background: #fff;
    width: 30px;
    height: 47px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
}

.ctm_crousel button.arrow-button.next {
    right: 0px;
}

.chatFloat {
    position: absolute;
    right: 10px;
    top: 10px;
}
</style>