<script setup lang="ts">
import { ref, computed } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import user1 from "@/assets/images/profile/user-1.jpg";


const fullpageloader = ref(true)


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const path = window.location.pathname;
const serviceId = path.split('/').pop();
const couple_name = ref("");
const vendor_name = ref("");
const admin_name = ref("");
const cus_email = ref("");
const vendor_email = ref("");
const admin_email = ref("");
const c_address = ref("");
const v_address = ref("");
const a_address = ref("");
const update_date = ref("");
const updated_at = ref("");
const package_name = ref("");
const paymentdate = ref("");
const paymenttype = ref("");
const paymentstatus = ref("");
const statuscolor = ref("");
const amount = ref("");
const pkg_owner = ref("");

const invoice_id = ref("00");

async function singletransactions() {
  try {
    const formData = new FormData();
    formData.append("single_transaction",'single_transaction');
    formData.append("current_role",'vendor');
    formData.append("transaction_id",serviceId);
    fullpageloader.value = true
    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    
    if (response.data.status == 'SAVED') {
        const book:any =response.data.single_booking_data

        couple_name.value =book.couple ? book.couple.userprofile.user.first_name + "" + book.couple.userprofile.user.last_name : "",

        vendor_name.value = book.vendor ? book.vendor.userprofile.user.first_name + "" + book.vendor.userprofile.user.last_name : "", 

        admin_name.value = book.admin ? book.admin.userprofile.user.first_name + "" + book.admin.userprofile.user.last_name : "", 

        // booking_link=book.admin ? ``

        vendor_email.value = book.vendor ? book.vendor.userprofile.user.email : "",
        cus_email.value =book.couple ? book.couple.userprofile.user.email : "", 
        admin_email.value =book.admin ? book.admin.userprofile.user.email : "",

        c_address.value =book.couple ? book.couple.userprofile.city.city+ "," + book.couple.userprofile.state.state+ "," + book.couple.userprofile.country.country : "",

        v_address.value =book.vendor ? book.vendor.userprofile.city.city+ "," + book.vendor.userprofile.state.state+ "," + book.vendor.userprofile.country.country : "",

        a_address.value =book.admin ? book.admin.userprofile.city.city+ "," + book.admin.userprofile.state.state+ "," + book.admin.userprofile.country.country : "",

        update_date.value =  formatDate(book.created_at)
        updated_at.value =  formatDate(book.updated_at)
        invoice_id.value = book.id
        package_name.value = book.booking.package.name
        pkg_owner.value= book.booking.package.admin ? book.booking.package.admin.userprofile.user.email : book.booking.package.vendor.userprofile.user.email
        paymentdate.value = formatDate(book.updated_at)
        paymentstatus.value = book.status
        paymenttype.value = book.payment_type
        statuscolor.value = book.status == 'done' ? 'success' : 'error'
        amount.value = '$' + book.total_amt

    fullpageloader.value=false
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
singletransactions()


const bookingData = ref([
    {
        vendorname: 'Deepak',
        img: user1,
        vendortype: 'Vendor',
        vendoremail: 'sajwan@123@gamil.com',
        amount: '$500',
        bookingdate: '12-06-2024',
        bookingprice: 'Card',
        bookingpayment: 'Done',
        statuscolor: 'success',
    },

]);
import html2pdf from 'html2pdf.js'; // Import html2pdf
const transaction_download = ref<HTMLElement | null>(null);
const downloadContract = () => {
  if (transaction_download.value) {
    const element = transaction_download.value as HTMLElement; // Ensure the correct type
    const options = {
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  }
};
const goBack = () => {
  window.history.back();
};
</script>
<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <v-row>
        <v-col cols="12">
            <div >
                <div class="d-flex justify-start">
                    <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                        <ChevronLeftIcon size="13" class="me-1" />Back 
                    </v-btn>
                </div>

                 <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="justify-content-between ">
                        <v-col cols="12" md="5"> <v-card-title class="text-h4">Invoice Details</v-card-title></v-col>
                        <v-col cols="12" md="7" class="d-flex justify-end">
                            <v-btn class="rounded-sm me-1" color="secondary" @click="downloadContract"  variant="flat" size="small">
                                <DownloadIcon size="16" class="me-1"/>Download
                            </v-btn>

                            <!-- <a :href="'mailto:'+ pkg_owner" >
                                <v-btn flat size="small"  color="secondary" class="rounded-sm me-1"> <MailIcon size="16" class="me-1"/>Send Email </v-btn>
                            </a> -->
                            <!-- <v-btn flat size="small"  color="secondary" class="rounded-sm me-1"> <EyeIcon size="16" class="me-1"/>
                                View Booking </v-btn> -->
                        </v-col>
                    </v-row>
                    <v-row class="justify-content-between">
                        <v-col cols="12" md="12">
                            <v-card elevation="10">
                                <v-card-item class="pa-0">
                                    <div ref="transaction_download" class="position-relative forFooter">
                                        <div class="invoice-table overflow-x-auto">
                                            <table width="100%">
                                                <thead  >
                                                    <tr>
                                                        <th style="padding:0px 0px;" colspan="2" class="">
                                                            <img src="@/assets/images/customer/invoice.png" style="width:100%;" class=" mb-4">
                                                        </th>
                                                    </tr> 
                                                    <tr>
                                                        <td style="padding:0px 0px 0px 0px;text-align:center;" colspan="2">
                                                            <img src="@/assets/images/logos/Logo-a13.png"
                                                                class="cutom-size">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        
                                                        <td style="text-align:right;padding:0px 20px 0px 0px" colspan="2">
                                                            <p style="color:#000"><strong>Invoice#{{ invoice_id }}</strong></p>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colspan="2">
                                                            <table width="100%" style="padding: 20px 20px 0;">
                                                                <tr>
                                                                    <td>
                                                                        <p style="color:#000;font-size: 20px;"><strong>Bill From:</strong>
                                                                        </p>

                                                                        <template v-if="(couple_name && vendor_name) || (couple_name && admin_name)">

                                                                            <p style="font-size:16px;color:#000;font-weight:500">Customer Info</p>
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{ couple_name }}
                                                                            </p>
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{ cus_email }}
                                                                            </p>
        
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{c_address}}</p>

                                                                        </template>

                                                                        <template v-else>
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;font-weight:500">Admin Info</p>
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{ admin_name }}
                                                                            </p>
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{ admin_email }}
                                                                            </p>
        
                                                                            <p style="font-weight: 500;font-size:14px;color:#000;">{{a_address}}</p>
                                                                        </template>
                                                                    </td>
    
                                                                    <td style="text-align:right;">
                                                                        <p style="color:#000;font-size: 20px;"><strong>Bill To:</strong></p>

                                                                        <template v-if="(couple_name && vendor_name) || (vendor_name && admin_name)">
                                                                        <p style="font-size:16px;color:#000;font-weight:500">Vendor Info</p>

                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{ vendor_name }}
                                                                        </p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{ vendor_email }}
                                                                        </p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{v_address}}</p>
                                                                        </template>

                                                                        <template v-if="(couple_name && admin_name)">
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;font-weight:500">Admin Info</p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{ admin_name }}
                                                                        </p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{ admin_email }}
                                                                        </p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">{{a_address}}</p>
                                                                        </template>

                                                                       
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <table width="100%" style="padding: 20px 20px 0px;">
                                                                <tr>
                                                                    <td>
                                                                        <p style="color:#000; margin-bottom: 5px;font-size: 20px;">
                                                                            <strong>Payment Method:</strong>
                                                                        </p>



                            <p v-if="paymenttype == 'offline'" style="font-size:16px;color:#000;font-weight:500">Offline Mode</p>
                            <p v-else style="font-size:16px;color:#000;font-weight:500">By Card </p>


                                                                        <p v-if="(couple_name && vendor_name) || (couple_name && admin_name)" style="font-weight: 500;font-size:14px;color:#000;">From : {{ couple_name }}
                                                                        </p>
                                                                        <p v-else style="font-weight: 500;font-size:14px;color:#000;">From : {{ admin_name }}
                                                                        </p>
                                                                    </td>
                                                                    <td style="text-align:right;">
                                                                        <p style="color:#000; margin-bottom: 5px;font-size: 20px;">
                                                                            <strong>Generated On:</strong>
                                                                        </p>
                                                                        <p style="font-weight: 500;font-size:14px;color:#000;">
                                                                            {{ update_date }} </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="(paymenttype != 'offline' && paymenttype != 'pending')&&(paymentstatus == 'done')">
                                                        <td colspan="2">
                                                            <table width="100%" style="padding: 20px 20px;">
                                                                <tr>
                                                                    <td colspan="2" >
                                                                      
                                                                        <p style="color:#000; margin-bottom: 5px;">
                                                                            <strong>Paid On:</strong>
                                                                        </p>
                                                                        <p style="font-size:12px;color:#000;">
                                                                            {{updated_at}} </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
    
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="mt-4" style="padding:0px 20px 0px 20px">
                                            <p style="color:#000; margin-bottom: 5px;font-size: 20px;">
                                                <strong>Payment Summary</strong>
                                            </p>
                                            <v-card elevation="10" class="border">
                                                <v-card-item class="pa-0">
                                                    <v-table class="month-table border-bottom">
                                                        <template v-slot:default>
                                                            <thead>
                                                                <tr>
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Sno</th>
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Package Name</th>
                                                                    
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Payment Date
                                                                    </th>
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Payment Type
                                                                    </th>
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Payment Status
                                                                    </th>
                                                                    <th
                                                                        class="text-subtitle-1 textPrimary font-weight-bold text-no-wrap">
                                                                        Amount</th>
    
    
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr 
                                                                    class="month-item">
                                                                    <td>
                                                                            <div>
                                                                                <h6
                                                                                    class="font-weight-semibold text-body-1 text-no-wrap textSecondary mt-1">
                                                                                    1</h6>
                                                                            </div>
                                                                    </td>
                                                                    <td>
                                                                            <div>
                                                                                <h6
                                                                                    class=" font-weight-semibold text-subtitle-1 text-no-wrap textSecondary mt-1">
                                                                                    {{ package_name }}</h6>
                                                                            </div>
                                                                    </td>
                                                                    
                                                                    <td>
                                                                        <h5 class="font-weight-semibold text-no-wrap text-body-1">
                                                                            {{ paymentdate }}
                                                                        </h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 class="font-weight-semibold text-no-wrap text-body-1">
                                                                            {{ paymenttype }}
                                                                        </h5>
                                                                    </td>
                                                                    <td>
                                                                        <v-chip rounded="md" class="ma-2 font-weight-medium text-capitalize" :color="statuscolor"
                                                                          size="small" label >
                                                                         {{ paymentstatus }}
                                                                        </v-chip>
                                                                    </td>
                                                                    <td>
                                                                        <h5 class="font-weight-bold text-no-wrap text-body-1">
                                                                            {{ amount }}
                                                                        </h5>
                                                                    </td>
    
                                                                </tr>
                                                            </tbody>
                                                        </template>
                                                    </v-table>
                                                    <table width="100%" style="padding: 0px 15px 0px;" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:0px;width:60%">
                                                                
                                                            </td>
                                                            <td style="padding:0px 15px;">
                                                                <table width="100%" cellspacing="0" style="padding:10px 25px 10px 10px;">
                                                                    <tr>
                                                                        <td style="padding:10px 0px;font-size:14px;color:#000;border-bottom:1px solid #cccccc4f;font-weight: 600;" >Subtotal</td>
                                                                        <td style="padding:10px 0px;font-size:14px;color:#000;border-bottom:1px solid #cccccc4f;font-weight: 600;text-align:right;" >{{amount}} </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:10px 0px;font-size:14px;color:#000;font-weight:600;">Total</td>
                                                                        <td style="padding:10px 0px;font-size:14px;color:#000;text-align:right;font-weight:600;" >{{amount}} </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </v-card-item>
                                            </v-card>
                                        </div>
                                        <div class="footerInvoice mt-2">
                                            <table width="100%">
                                                <tr>
                                                    <td style="background: #000;padding: 20px;text-align:center;color: #fff;">
                                                        <p style="font-size: 16px;text-transform:uppercase">Notes To Customer</p>
                                                        <p style="font-size: 14px;">Thankyou</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>


                </v-card-item>
                </v-card>
           </div>
        </v-col>
       


    </v-row>
</template>
<style>
.forFooter {
    padding-bottom: 160px;
}
.footerInvoice {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    right: 0px;
}
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}
.cutom-size {
    width: 250px;
}

</style>