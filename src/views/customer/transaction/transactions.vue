<script setup lang="ts">
import { ref, computed  } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import html2pdf from 'html2pdf.js'; // Import html2pdf
import user1 from "@/assets/images/profile/user-1.jpg";



const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)


const recentTransaction = ref ([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Done', 'Pending', 'Failed', 'Requested']);
const searchbudget = ref();
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');

const filteredList = computed(() => {
    console.log("searchdate____", searchdate.value)
    const isearch = search.value.toLowerCase()
    const ilist = recentTransaction.value.filter((i:any) => (
        i.vendorname.toLowerCase().includes(isearch) ||
        i.vendoremail.toLowerCase().includes(isearch) ||
        // i.service.toLowerCase().includes(isearch) ||
        String(i.payment).includes(isearch) ||
        i.payment_status.toLowerCase().includes(isearch) ))

    function chdate(a:any, b:any) { 
        const i = new String(a).split("-"); 
        const j = new String(b).split("/"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter(item =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.payment_status.toLowerCase())) &&
            ([undefined, null, 0, ''].includes(searchbudget.value) || String(item.payment).includes(String(searchbudget.value))) &&
            ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.transactiondate))
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



async function showtransactions() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'user_current_role');
    formData.append("user_current_role",'customer');
    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    

    if (response.data.status == 'SAVED') {
        recentTransaction.value = response.data.pay_booking_data.map((elem, index) => ({
        "img": elem.vendor 
       ? (elem.vendor.userprofile.profile_pic ? BASE_URL + elem.vendor.userprofile.profile_pic : user1) 
       : (elem.admin.userprofile.profile_pic ? BASE_URL + elem.admin.userprofile.profile_pic : user1),
        "vendorname": `${elem.booking.package.user.first_name} ${elem.booking.package.user.last_name}`,
        "vendoremail": `${elem.booking.package.user.email}`,
        "service": elem.booking.package.name,
        "transactiondate": formatDate(elem.created_at),
        "payment": '$' + elem.total_amt,
        "payment_status":elem.status,
        "btn_link": `/vendor-invoice/` + elem.id,
        "pay_req": `/booking-single/${elem.booking.id}`,
        "booking_id": elem.booking.id,
        "payment_type":elem.payment_type,
        "couple_id":elem.couple.id,
        "vendor_id":elem.booking.package.vendor ? elem.booking.package.vendor.id : elem.booking.package.admin.id,

        "id":elem.id,
        "sno": index + 1,
      }));
      fullpageloader.value = false
    }

  } catch (error) { console.error("Error fetching data:", error); }
}
showtransactions()

const transaction_download = ref<HTMLElement | null>(null);
const downloadContract = () => {
  if (transaction_download.value) {
    const element = transaction_download.value as HTMLElement; // Ensure the correct type
    const options = {
      margin: 1,
      filename: 'transactions.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  }
};


async function booking_payment(action='null',amount_pay=null,booking=null,booking_pay_id=null,couple_id=null,package_owner_id=null) {
  try {
    const formData = new FormData();
    formData.append("action",action);
    if (action == 'deposit_payment') {
        formData.append("deposit_amt", final_deposit_amt.value);
    } else if (action == 'request_payment') { // Added condition for clarity
        formData.append("request_amt", amount_pay);
        formData.append("booking_pay_id", booking_pay_id); 
    } else {
        formData.append("final_amt", final_amt.value);
    }
    formData.append("booking_id",booking);
    formData.append("couple_id",couple_id);
    formData.append("vendor_id",package_owner_id);
    const response = await axios.post(`/home/pack_payment`, formData, config);
    if (response.data.status == 'SAVED') {
        console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
        window.location.href=response.data.s_url;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}




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
                <div ref="transaction_download">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="9"> <v-card-title class="text-h4">All Transactions</v-card-title></v-col>
                        <v-row class="justify-content-between pt-3">
                            <v-col cols="12" md="12" >
                                <v-card elevation="0" class="border bg-lightsecondary">
                                    <v-card-item class="py-4 ">
                                        <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                        <v-row class="justify-end py-5">
                                            <v-col cols="12" md="3">
                                                <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking" hide-details variant="outlined" ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="3" class="">
                                                <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status" hide-details class="" density="compact">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search Price" hide-details variant="outlined" ></v-text-field>
                                            </v-col>
                                            
                                        </v-row>
                                        
                                    </v-card-item>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-row>
                    <v-table class="month-table mt-6">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Vendor/Admin</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>   
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Date</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Type</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment Status</th>
                                <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5" class="month-item">
                                <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td>
                                <td>
                                    <div class="d-flex align-top">
                                        <v-avatar size="40" color="primary"  variant="flat" rounded="sm">
                                            <img :src="item.img" :alt="item.img" width="40"
                                        />
                                        </v-avatar>
                                        <div class="mx-3">
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary"> {{ item.vendorname }}</h4>
                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                {{ item.vendoremail }}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <h5 class="text-no-wrap text-body-1">
                                        {{item.service}}
                                    </h5>
                                </td>
                                <td>
                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            {{ item.transactiondate }}
                                        </h5>
                                       
                                </td>
                                <td>
                                    <h4 class="text-body-1 text-success font-weight-bold">{{ item.payment }}</h4>
                                </td>
                                <td>
                                    <h4 class="text-body-1 text-primary font-weight-bold text-capitalize">{{ item.payment_type }}</h4>
                                </td>
                                <td v-if="item.payment_status === 'done'">
                                    <h4 class="text-body-1 text-success font-weight-bold text-capitalize">{{ item.payment_status }}</h4>
                                </td>
                                <td v-else>
                                    <h4 class="text-body-1 text-error font-weight-bold text-capitalize">{{ item.payment_status }}</h4>
                                </td>
                                <td>
                                    <h4 class="text-body-1 text-error d-flex justify-center font-weight-bold text-center">
                                       
                                        <!-- ................donload btn .................. -->
                                        <!-- <v-tooltip text="Download Invoice">
                                            <template v-slot:activator="{ props }">
                                                <v-btn icon flat v-bind="props">
                                                    <DownloadIcon  @click="downloadContract" stroke-width="2" size="20"
                                                        class="text-secondary" />
                                                </v-btn>
                                            </template>
                                        </v-tooltip> -->


                                        <v-btn flat v-bind="props" :to="item.btn_link" color="primary" size="small" class="rounded-sm mr-1">
                                            View
                                        </v-btn>

                                        <!-- :to="item.pay_req" -->
                                        <h5 v-if=" item.payment_status != 'done'" class="text-no-wrap text-body-1">
                                                <v-btn color="success"  @click="booking_payment('request_payment',item.payment,item.booking_id,item.id,item.couple_id,item.vendor_id)" variant="flat" size="small" class="rounded-sm ">
                                                Pay 
                                                </v-btn>
                                        </h5>
                                    </h4>
                                </td>
                            </tr>
                            <tr v-if="paginatedList.length === 0"> 
                                <td colspan="8">
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
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-table>
                <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-card-item>
            </div>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}
label.v-label.v-field-label {
    color: #002642;
    font-size: 12px;
    font-weight: 500;
}
</style>