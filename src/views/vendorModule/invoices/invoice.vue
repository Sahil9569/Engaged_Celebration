<script setup lang="ts">
import { ref, computed } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import html2pdf from 'html2pdf.js'; // Import html2pdf
import contractImg from "@/assets/images/vendor/contract.png";

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
const c_address = ref("");
const v_address = ref("");
const update_date = ref("");
async function singletransactions() {
  try {
    const formData = new FormData();
    formData.append("single_transaction",'single_transaction');
    formData.append("current_role",'vendor');
    formData.append("transaction_id",serviceId);

    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data,"hi responce all booking customer ")
    
    if (response.data.status == 'SAVED') {
        const book:any =response.data.single_booking_data

        couple_name.value = book.couple.userprofile.user.first_name + " " + book.couple.userprofile.user.last_name

        vendor_name.value = book.vendor ? book.vendor.userprofile.user.first_name + " " + book.vendor.userprofile.user.last_name :  book.admin.userprofile.user.first_name + " " + book.admin.userprofile.user.last_name 


        c_address.value =book.couple.userprofile.city.city+ "," + book.couple.userprofile.state.state+ "," + book.couple.userprofile.country.country

        
        v_address.value =book.vendor.userprofile.city.city+ "," + book.vendor.userprofile.state.state+ "," + book.vendor.userprofile.country.country


        update_date.value =  formatDate(book.created_at)

    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
singletransactions()



</script>
<template>
    <v-row class="justify-center">
        <v-col cols="12">
            <div class="d-flex justify-end mb-5">
                <v-btn color="secondary" variant="flat" size="small" class="">
                    <DownloadIcon stroke-width="1.5" size="15" class="mr-2" />
                    Download
                </v-btn>
                
            </div>
            <v-card elevation="10">
                <v-card-item class="pa-0">
                    <div class="invoice-table">
                        <table width="100%" >
                            <thead>
                                <tr>
                                    <th style="padding:0px 0px;">
                                        <img src="../../../assets/images/customer/invoice.png" style="width:100%;">
                                    </th>
                                </tr> 
                                <tr>
                                    <th style="padding: 10px 20px 0px;">
                                        <h2 style="text-align:left; margin-bottom:0px;color:#b4801c;">Invoice</h2>
                                    </th>
                                </tr>                                
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <table width="100%" style="padding: 20px 20px;">
                                            <tr>
                                                <td>
                                                    <p style="color:#000"><strong>From:</strong></p>
                                                    <p style="font-size:13px;color:#000;font-weight:500">Couple Name </p>
                                                    <p style="font-size:12px;color:#000;">{{ couple_name }}</p>
                                                    <p style="font-size:12px;color:#000;">{{c_address}}</p>
                                                </td>
                                                <td style="text-align:right;">
                                                    <img src="../../../assets/images/logos/logo-black1.png">
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" style="padding: 20px 20px;">
                                            <tr>
                                                <td>
                                                    <p style="color:#000"><strong>Bill To:</strong></p>
                                                    <p style="font-size:13px;color:#000;font-weight:500">Vendor Name </p>
                                                    <p style="font-size:12px;color:#000;">{{ vendor_name }}</p>
                                                    <p style="font-size:12px;color:#000;">{{ v_address }}</p>
                                                </td>
                                                <td style="text-align:right;">
                                                    <p style="color:#000"><strong>#27</strong></p>
                                                    <p style="font-size:12px;color:#000;">Generated on: {{ update_date }} </p>
                                                    <!-- <p style="font-size:12px;color:#000;">Due: 10/08/2023</p> -->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" style="padding: 20px 20px;" cellspacing="0">
                                            <tr>
                                                <td style="font-size:14px;background: #b4801c;color:#fff;padding:15px;">
                                                    Service Name 
                                                </td>
                                                <td style="font-size:14px;text-align:right;background: #b4801c;color:#fff;padding:15px;">
                                                    Price
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    DJ/Music
                                                </td>
                                                <td style="font-size:13px;text-align:right;font-weight:500;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    $10
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    Venue Booking
                                                </td>
                                                <td style="font-size:13px;text-align:right;font-weight:500;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    $10
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    Decor
                                                </td>
                                                <td style="font-size:13px;text-align:right;font-weight:500;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    $10
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    Photography
                                                </td>
                                                <td style="font-size:13px;text-align:right;font-weight:500;color:#000;padding:15px;border-bottom:1px solid #cccccc4f;">
                                                    $10
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" style="padding: 0px 20px 40px;" cellspacing="0">
                                            <tr>
                                                <td style="padding:0px;width:60%">
                                                    
                                                </td>
                                                <td style="padding:0px 15px;">
                                                    <table width="100%" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;border-bottom:1px solid #cccccc4f;" >Subtotal</td>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;border-bottom:1px solid #cccccc4f;text-align:right;font-weight:500;" >$40 </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;border-bottom:1px solid #000;" >Tax</td>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;border-bottom:1px solid #000;text-align:right;font-weight:500;" >$10 </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;">Total</td>
                                                            <td style="padding:10px 0px;font-size:13px;color:#000;text-align:right;font-weight:500;" >$50 </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>

</template>
<style type="text/css">
</style>
