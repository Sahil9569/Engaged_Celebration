<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import BASE_URL from '@/stores/myVar'
import user1 from "@/assets/images/profile/user-1.jpg";

const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)

const managepayments = ref([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Pending', 'Complete', 'Rejected', 'Paid']);
const constatusvalue = ref('All');
// const constatusitem = ref(['All', 'Create', 'Pending', 'Inprogress', 'Onhold', 'Complete']);
const constatusitem = ref(['All', 'Active', 'Pending', 'End']);
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');

const filteredList = computed(() => {
    const isearch = search.value.toLowerCase()
    const ilist = managepayments.value.filter((i:any) => (
        i.customername.toLowerCase().includes(isearch) ||
        i.customeremail.toLowerCase().includes(isearch) ||
        i.service.toLowerCase().includes(isearch) ||
        // i.bookingdate.includes(isearch) ||
        String(i.amount).includes(isearch) ))

    function chdate(a:any, b:any) { 
        console.log(a, b)
        const i = new String(a).split("-"); 
        const j = new String(b).split("/"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter(item =>
        (   
            // (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.includes(item.paymentstatustext)) &&
            (constatusvalue.value.length === 0 || constatusvalue.value.includes('All') || constatusvalue.value.toLowerCase().includes(item.contractstatustext.toLowerCase())) &&
            ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.paymentdate ))
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

async function showbooking() {
  try {
    const formData = new FormData();
    formData.append("user_role",'vendor');
    formData.append("manage_payments",'vendor_manage_payments');
    const response = await axios.post(`/home/all_contracts`, formData, config);
    console.log(response.data,"hi responce booking vendor")
    fullpageloader.value   = true;

    if (response.data.status == 'SAVED') {

        if (response.data.accepted_bookings) {
            managepayments.value = response.data.accepted_bookings.map((elem, index) => ({
                sno: index+1,
                img: elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1,
                customername: `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
                customeremail: elem.couple.userprofile.user.email,
                service: elem.package.name,
                id: elem.id,
                paymentdate: formatDate(elem.seldate),
                amount: elem.package.price,

                pay_req: `/vendor-booking-single-action/payment_request/${elem.booking.id}`,
                offline_pay: `/vendor-booking-single-action/offline_payments/${elem.booking.id}`,
                end_con: `/vendor-booking-single-action/end_contract/${elem.booking.id}`,
                view_link: `/vendor-contract-single/${elem.id}`,
                view_all_paymnets: `/manage-payment-single/${elem.booking.id}`,

                status: (elem.action_status=='inprogress') ? 'Active' : ((elem.action_status=='complete') ? 'End' : 'Pending'),
                paymentstatustext : elem.status,
                paymentstatuscolor : "primary",
                contractstatuscolor : "error",
                contractstatustext : (elem.action_status=='inprogress') ? 'Active' : ((elem.action_status=='complete') ? 'End' : 'Pending'),
               
            }));
        }
        if (response.data.aaccepted_bookings) {
            managepayments.value = response.data.aaccepted_bookings.map((elem, index) => ({

                sno: index+1,
                img:elem.vendor ? elem.vendor.userprofile.profile_pic ? BASE_URL + elem.vendor.userprofile.profile_pic : user1 :elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1 ,
                customername:elem.couple ? `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`:`${elem.vendor.userprofile.user.first_name} ${elem.vendor.userprofile.user.last_name}`,
                customeremail:elem.couple ? elem.couple.userprofile.user.email : elem.vendor.userprofile.user.email,

                service: elem.package.name,
                id: elem.id,
                paymentdate: formatDate(elem.seldate),
                amount: elem.package.price,

                pay_req: `/admin-booking-single-action/payment_request/${elem.booking.id}`,
                offline_pay: `/admin-booking-single-action/offline_payments/${elem.booking.id}`,
                end_con: `/admin-booking-single-action/end_contract/${elem.booking.id}`,
                view_link: `/vendor-contract-single/${elem.id}`,
                view_all_paymnets: `/manage-payment-single/${elem.booking.id}`,

                status: elem.status,
                paymentstatustext : elem.status,
                paymentstatuscolor : "primary",
                contractstatuscolor : "error",
                contractstatustext : (elem.action_status=='inprogress') ? 'Active' : ((elem.action_status=='complete') ? 'End' : 'Pending'),
               
            }));
        }

    fullpageloader.value=false;
    }
    else{
        fullpageloader.value=false;

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
                <div class="pa-sm-6 pa-3 ">
                    <v-card-title class="text-h4 text- ps-0 mb-2">Manage Payments</v-card-title>
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightCustom">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking/Price" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                        </v-col>
                                        <!-- <v-col cols="12" md="4">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Payment Status" hide-details class="me-2" density="compact">
                                            </v-select>
                                        </v-col> -->
                                        <v-col cols="12" md="4">
                                            <v-select :items="constatusitem" v-model="constatusvalue" label="Filter By Contract Status" hide-details density="compact">
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-table class="month-table mt-6 text-nowrap border">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Event Date</th>
                                
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Action </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Contract Status</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Status</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Contract Action</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5" class="month-item">
                                    <td>
                                        <h5 class="text-no-wrap text-body-2 font-weight-medium">
                                            {{ item.sno }}
                                        </h5>
                                    </td>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-avatar size="40" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> 
                                                    {{ item.customername }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap mt-1 font-weight-medium text-Darklight">
                                                    {{ item.customeremail }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-2 font-weight-medium">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-2 font-weight-medium">
                                            $ {{ item.amount }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-2 font-weight-medium">
                                            <CalendarIcon size="12" color="secondary" stroke-width="2.5" class="mr-1" />
                                            {{ item.paymentdate }}
                                        </h5>
                                    </td>
                                   
                                    <td>
                                        <div v-if="item.contractstatustext == 'End'" class="d-flex flex-column">
                                            <v-btn :to="item.pay_req" disabled color="success" variant="flat" size="small" class="rounded-sm  mr-1 mb-1">
                                            <CashIcon size="16" class="me-1 mb-1" />
                                            Payment Request
                                        </v-btn>

                                        <v-btn :to="item.offline_pay" disabled color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                            <CashIcon size="16" class="me-1" />
                                            Offline Payment 
                                        </v-btn>

                                        </div>
                                        <div v-else class="d-flex flex-column">
                                            <v-btn :to="item.pay_req" color="success" variant="flat" size="small" class="rounded-sm  mr-1 mb-1">
                                                <CashIcon size="16" class="me-1 mb-1"/>
                                                Payment Request
                                            </v-btn>
                                            <v-btn  :to="item.offline_pay" color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                <CashIcon size="16" class="me-1"/>
                                                Offline Payment 
                                            </v-btn>
                                        </div>
                                    </td>
                                    <td>
                                        <v-chip rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                            :color="item.contractstatuscolor" size="small" label>{{
                                            item.contractstatustext }}
                                        </v-chip>
                                    </td>
                                    <!-- <td>
                                        <v-chip rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                            :color="item.paymentstatuscolor" size="small" label>{{
                                            item.paymentstatustext }}
                                        </v-chip>
                                    </td> -->
                                    <td>
                                        <div class="d-flex flex-column">
                                            <!-- <v-btn to="/vendor-contract-single" flat size="small"  color="primary" class="rounded-sm mb-1"><EyeIcon size="16" class="me-1 mb-1"/> Create Contract</v-btn> -->
                                            <v-btn :to="item.view_link" flat size="small"  color="primary" class="rounded-sm mb-1"><EyeIcon size="16" class="me-1 mb-1"/> View Contract</v-btn>
                                            <v-btn :to="item.end_con" flat size="small"  color="error" class="rounded-sm"><PlaystationCircleIcon size="16" class="me-1"/> End Contract</v-btn>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            <v-tooltip text="View All Payments">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props" :to="item.view_all_paymnets">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </h5>
                                    </td>
                                </tr>
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
                        </template>
                    </v-table>
                    <v-pagination color="primary" v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
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
.bg-lightCustom{
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
.radiofloat {
    position: absolute;
    right: 0px;
    top: 0;
}
</style>