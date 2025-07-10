<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import BASE_URL from '@/stores/myVar'
import user1 from "@/assets/images/profile/user-1.jpg";
import html2pdf from 'html2pdf.js'; // Import html2pdf

const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

const bookingData = ref([]);
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


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


const path = window.location.pathname;
const serviceId = path.split('/').pop();

const pay_req = ref();
const offline_pay_link = ref();
const end_con = ref();
const view_link = ref();
const con_status = ref();
const total_amount = ref(0);



const pkg_owner_name = ref();
const pkg_owner_email = ref();
const pkg_owner_profile = ref();
async function singlebooking() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",(localStorage.getItem('role')));
    formData.append("serviceId",serviceId);
    const response = await axios.post(`/home/single_booking`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    if (response.data.status == 'SAVED') {
        if (response.data.c_contract_data){
            const con: any = response.data.c_contract_data
            con_status.value  = response.data.c_contract_data.action_status
            view_link.value = `/vendor-contract-single/${con.id}`
        }else{
            const con : any = response.data.contract_data
            con_status.value  = response.data.contract_data.action_status
            view_link.value = `/vendor-contract-single/${con.id}`
        }
        const res: any = response.data.booking_data
        if (res.package.admin){
            pay_req.value =`/admin-booking-single-action/payment_request/${res.id}`
            offline_pay_link.value = `/admin-booking-single-action/offline_payments/${res.id}`
            end_con.value = `/admin-booking-single-action/end_contract/${res.id}`
            pkg_owner_name.value=res.package.admin.userprofile.user.first_name + ' ' + res.package.admin.userprofile.user.last_name 
            pkg_owner_email.value=res.package.admin.userprofile.user.email
            pkg_owner_profile.value=res.package.admin.userprofile.profile_pic ? BASE_URL + res.package.admin.userprofile.profile_pic : user1

        }else{
            pay_req.value =`/vendor-booking-single-action/payment_request/${res.id}`
            offline_pay_link.value = `/vendor-booking-single-action/offline_payments/${res.id}`
            end_con.value = `/vendor-booking-single-action/end_contract/${res.id}`

            pkg_owner_name.value=res.package.vendor.userprofile.user.first_name + ' ' + res.package.vendor.userprofile.user.last_name 
            pkg_owner_email.value=res.package.vendor.userprofile.user.email
            pkg_owner_profile.value=res.package.vendor.userprofile ? BASE_URL + res.package.vendor.userprofile.profile_pic : user1

        }
        bookingData.value = response.data.pay_booking_data.map((elem:any) => ({
            "service": elem.booking.package.name,
            "bookingdate": formatDate(elem.created_at),
            "bookingpayment":'$' + elem.total_amt, 
            "statustext":elem.status,
            "statuscolor": elem.status === "done" ? "success" : "primary",
            "payment_type":elem.payment_type,
            "btn_link": `/vendor-invoice/` + elem.id,
        }));

        total_amount.value = response.data.pay_booking_data.reduce((sum:any, elem:any) => sum + parseFloat(elem.total_amt), 0);
        
    fullpageloader.value=false;
    }
    else{
        fullpageloader.value=false;

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
singlebooking()
const goBack = () => {
  window.history.back();
};
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
            <div class="d-flex justify-start">
                <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
            </div>
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <div class="pa-5">
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-card elevation="10" rounded="md" class="border border-primary">
                                        <v-card-item class="text-start pa-4">
                                           
                                            <v-avatar size="60" rounded="xl">
                                                <img :src="pkg_owner_profile" width="60" />
                                            </v-avatar>
                                            <div class="mt-5">
                                                <h5 class="text-h5 font-weight-semibold text-secondary">{{pkg_owner_name}}
                                                </h5>
                                                <h5 class="text-body-2 font-weight-medium  text-Darklight">
                                                   {{pkg_owner_email}}</h5>
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="9">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-card elevation="10" rounded="md" class="h-100 border">
                                        <!-- <v-chip color="success" class="rounded-sm paymentStatusFloat font-weight-semibold">
                                            Accepted
                                        </v-chip> -->

                                        <v-card-item class="text-start">
                                            <h5 class="text-h3 mb-2 font-weight-bold">$ {{total_amount}}</h5>
                                            <h5 class="text-body-3 mb-4 text-Darklight font-weight-semibold">Total
                                                Payments
                                            </h5>

                                            <v-btn v-if="con_status == 'complete'" disabled :href="pay_req" color="success" variant="flat" size="small"
                                                class="rounded-sm mr-1 mb-1">
                                                <CashIcon size="16" class="me-1 mb-1" />
                                                Generate Invoice 
                                            </v-btn>
                                            <v-btn v-else :href="pay_req" color="success" variant="flat" size="small"
                                                class="rounded-sm mr-1 mb-1">
                                                <CashIcon size="16" class="me-1 mb-1" />
                                                Generate Invoice 
                                            </v-btn>

                                            <v-btn v-if="con_status == 'complete'" :href="offline_pay_link"  color="success" disabled
                                                variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                <CashIcon size="16" class="me-1" />
                                                Offline Payment
                                            </v-btn>
                                            <v-btn v-else :href="offline_pay_link"  color="success"
                                                variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                <CashIcon size="16" class="me-1" />
                                                Offline Payment
                                            </v-btn>
                                               
                                               
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card elevation="10" rounded="md" class="h-100 border">
                                        <v-chip v-if="con_status == 'complete'" color="error" class="rounded-sm paymentStatusFloat font-weight-semibold">
                                            End Contract
                                        </v-chip>
                                        <v-chip v-else color="success" class="rounded-sm paymentStatusFloat font-weight-semibold">
                                            Active Contract
                                        </v-chip>
                                        <v-card-item class="text-start">
                                            <h5 class="text-h3 mb-2 font-weight-bold">Contracts</h5>
                                            <h5 class="text-body-3 mb-4 text-Darklight font-weight-semibold">View & Download Contract                                             </h5>
                                            <v-btn  :href="view_link" flat size="small" color="primary"
                                                class="rounded-sm me-1">
                                                <EyeIcon size="16" class="me-1 " /> View Contract
                                            </v-btn>
                                           
                                            <v-btn :href="end_con" flat size="small" color="error"
                                                class="rounded-sm mr-1">
                                                <PlaystationCircleIcon size="16" class="me-1" /> End
                                                Contract
                                            </v-btn>
                                               

                                            
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-card elevation="10" class="bg-lightprimary border border-primary">
                                <v-card-item class="pa-2 ">
                                    <div ref="transaction_download">
                                        <v-table class="month-table ">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Details</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount
                                                </th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Date</th>

                                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                                    Type</th>


                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Status</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Action 
                                                </th>
                                            </tr>
                                        </thead>
                                    

                                    
                                        <tbody v-if="bookingData.length != 0" >
                                            <tr v-for="item in bookingData" :key="item.id" class="month-item">
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.service }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.bookingpayment }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.bookingdate }}
                                                    </h5>
                                                    <!-- <p class="text-body-2">{{ item.bookingtime }}</p> -->
                                                </td>

                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.payment_type }}

                                                    </h5>
                                                </td>

                                                <td>
                                                    <v-chip rounded="md" class="ma-2 font-weight-semibold"
                                                        :color="item.statuscolor" size="small" label>{{
                                                        item.statustext }}</v-chip>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        <v-tooltip text="View">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20"
                                                                    class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                        </v-tooltip>


                                                        <v-tooltip text="Download">
                                                            <template v-slot:activator="{ props }">
                                                                <v-btn icon flat v-bind="props">
                                                                    <DownloadIcon  @click="downloadContract" stroke-width="2" size="20"
                                                                        class="text-secondary" />
                                                                </v-btn>
                                                            </template>
                                                        </v-tooltip>

                                                    </h5>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else >
                                            <tr  class="month-item">
                                                <td colspan="6">
                                                    <p class="text-center center py-2 mt-0 text-error">No data found yet</p>
                                                </td>
                                                
                                            </tr>
                                        </tbody>
                                    

                                    </template>
                                </v-table>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
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

    .radiofloat {
        position: absolute;
        right: 0px;
        top: 0;
    }

    .paymentStatusFloat {
        position: absolute;
        right: 0px;
        top: 0px;
    }
</style>