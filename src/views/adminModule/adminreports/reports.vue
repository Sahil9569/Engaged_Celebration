<script setup lang="ts">
import { ref, computed  } from 'vue';
import axios from '@/stores/axios'
import BASE_URL from '@/stores/myVar';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js'; // Import html2pdf
/*--transaction table data --*/
import userimg from "@/assets/images/profile/defaultuserimg.png";
import user1 from "@/assets/images/profile/defaultuserimg.png";
/*--all transaction --*/

const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);



const dataTable = ref<HTMLElement | null>(null);
const reportstab = ref(null);
const itemsPerPage  = 5;
function chdate(a:any, b:any) { 
    const i = new String(a).split("-"); 
    const j = new String(b).split("/"); 
    return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
}

// transactions data __________________________________________
const recentTransaction = ref ([]);
const search_trx = ref('');
const search_date_trx = ref('');
const filteredList_trx = computed(() => { 
    return recentTransaction.value.filter((i:any) => (
        (i.customername.toLowerCase().includes(search_trx.value) ||
        i.vendorname.toLowerCase().includes(search_trx.value) ||
        i.providedservice.toLowerCase().includes(search_trx.value)) &&
        ([undefined, null, 0, ''].includes(search_date_trx.value) || chdate(search_date_trx.value, i.transactiondate))
    )); 
});
const currentPage_trx = ref(1);
const paginatedList_trx = computed(() => {
    const start = (currentPage_trx.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList_trx.value.slice(start, end);
});
// vendor data __________________________________________
const vendordata = ref([]);
const search_ven = ref('');
const search_date_ven = ref('');
const filteredList_ven = computed(() => {
    return vendordata.value.filter((i:any) => (
        (i.vendorname.toLowerCase().includes(search_ven.value) ||
        i.vendoremail.toLowerCase().includes(search_ven.value) ||
        String(i.vendornumber).includes(search_ven.value) ||
        i.businessname.toLowerCase().includes(search_ven.value) ||
        i.categoryname.includes(search_ven.value)) &&
        ([undefined, null, 0, ''].includes(search_date_ven.value) || chdate(search_date_ven.value, i.joiningdate))
    )); 
});
const currentPage_ven = ref(1);
const paginatedList_ven = computed(() => {
    const start = (currentPage_ven.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList_ven.value.slice(start, end);
});
// couple data __________________________________________
const coupledata = ref([]);
const search_cup = ref('');
const search_date_cup = ref('');
const filteredList_cup = computed(() => {
    return coupledata.value.filter((i:any) => (
        (i.couplename.toLowerCase().includes(search_cup.value) ||
        i.coupleemail.toLowerCase().includes(search_cup.value) ||
        String(i.couplenumber).includes(search_cup.value)) &&
        ([undefined, null, 0, ''].includes(search_date_cup.value) || chdate(search_date_cup.value, i.joiningdate))
      )); 
});
const currentPage_cup = ref(1);
const paginatedList_cup = computed(() => {
    const start = (currentPage_cup.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList_cup.value.slice(start, end);
});
// subscription data __________________________________________
const subscriptiondata = ref([]);
const search_sub = ref('');
const search_date_sub = ref('');
const filteredList_sub = computed(() => {
    return subscriptiondata.value.filter((i:any) => (
        (i.vendorname.toLowerCase().includes(search_sub.value) ||
        i.vendoremail.toLowerCase().includes(search_sub.value)) &&
        ([undefined, null, 0, ''].includes(search_date_sub.value) || chdate(search_date_sub.value, i.subsdate))
      )); 
});
const currentPage_sub = ref(1);
const paginatedList_sub = computed(() => {
    const start = (currentPage_sub.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList_sub.value.slice(start, end);
});


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

(async function() {
    const response = await axios.post('home/admin_reports');
    console.log("response__________", response.data)
    if (response.data.status == 'SENT'){
        //userimg default user image
        recentTransaction.value = response.data.bookings.map((a:any, index) => ({ 
           sno                  :   index + 1,
           img                  :   (a.vendor) ? BASE_URL + a.vendor.userprofile.profile_pic : user1,
           vendorname           :   (a.vendor) ? a.vendor.userprofile.fullname :  'N/A',
           vendoremail          :   (a.vendor) ? a.vendor.userprofile.user.email :  'N/A',
           customername         :   (a.couple) ? a.couple.userprofile.fullname : 'N/A',
           cimg                 :   (a.couple) ? BASE_URL + a.couple.userprofile.profile_pic : user1,
           person               :   (a.couple) ? a.couple.userprofile.role : 'N/A',
           providedservice      :   a.booking.package.name,
           transactiondate      :   formatDate(a.booking.created),
           amount                : '$ ' + a.total_amt,
           payment              :   a.payment_type
        }))
        // vendordata.value = response.data.vendors.map((a:any, index) => ({
        //     sno                 :   index + 1,
        //     contractid          :   a.id,
        //     vendorimg           :   BASE_URL + a.userprofile.profile_pic,
        //     vendorname          :   a.userprofile.fullname,
        //     vendoremail         :   a.userprofile.user.email,
        //     vendornumber        :   a.userprofile.phone,
        //     joiningdate         :   formatDate(a.userprofile.created_at),
        //     businessname        :   a.business_name,
        //     categoryname        :   a.category.map((a:any)=>(a.name)),
        //     statuscolor         :   (a.is_active && a.pk_active) ? "success" : "error",
        //     statustext          :   (a.is_active) ? 'Active user' : 'Suspended user',
        //     activepackagename   :   a.v_role + ` (${(a.pk_active) ? 'Active' : 'Expired'})`,
        //     link                :   "/vendor-profile/" + String(a.id),
        //     linkchat            :   `/achats?march=${a.chatid}`,
        // }))
        // coupledata.value = response.data.couples.map((a:any, index) => ({
        //     sno                 :   index + 1,
        //     contractid          :   a.id,
        //     coupleimg           :   BASE_URL + a.userprofile.profile_pic,
        //     couplename          :   a.userprofile.fullname,
        //     coupleemail         :   a.userprofile.user.email,
        //     couplenumber        :   a.userprofile.phone,
        //     joiningdate         :   formatDate(a.userprofile.created_at),
        //     couplestate         :   (a.userprofile.state  ) ? a.userprofile.state.state   : null,
        //     couplecity          :   (a.userprofile.city   ) ? a.userprofile.city.city     : null,
        //     registerdate        :   a.userprofile.created_at,
        //     linkchat            :   `/achats?march=${a.chatid}`,
        //     // link                :    "/couple-single",
        // }))
        // subscriptiondata.value = response.data.subscriptions.map((a:any, index) => ({
        //     sno                 :   index + 1,
        //     subid               :   a.id,
        //     subcoupleimg        :   (a.vpic) ? BASE_URL + a.vpic : user1,
        //     vendorname          :   (a.user) ? (a.user.first_name + a.user.last_name) : '--',
        //     vendoremail         :   (a.user) ? (a.user.email) : '--',
        //     subscriptionname    :   a.package.name,
        //     recamount           :   a.total_price,
        //     subsdate            :   formatDate(a.created_at.split('T')[0]),
        // }))

    fullpageloader.value=false;
    }
    else{ fullpageloader.value=false;}
})();


async function get_list(action='null'){
    try {

        fullpageloader.value = true;
        const formdata = new FormData();
        
        formdata.append(action,action);
        const response = await axios.post('home/admin_reports',formdata);
        
        if (response.data.status == 'SENT'){
            if (response.data.vendors){
                vendordata.value = response.data.vendors.map((a:any, index) => ({
                    sno                 :   index + 1,
                    contractid          :   a.id,
                    vendorimg           :   BASE_URL + a.userprofile.profile_pic,
                    vendorname          :   a.userprofile.fullname,
                    vendoremail         :   a.userprofile.user.email,
                    vendornumber        :   a.userprofile.phone,
                    joiningdate         :   formatDate(a.userprofile.created_at),
                    businessname        :   a.business_name,
                    categoryname        :   a.category.map((a:any)=>(a.name)),
                    statuscolor         :   (a.is_active && a.pk_active) ? "success" : "error",
                    statustext          :   (a.is_active) ? 'Active user' : 'Suspended user',
                    activepackagename   :   a.v_role + ` (${(a.pk_active) ? 'Active' : 'Expired'})`,
                    link                :   "/vendor-profile/" + String(a.id),
                    linkchat            :   `/achats?march=${a.chatid}`,
                }))
            }
            if (response.data.couples){
                coupledata.value = response.data.couples.map((a:any, index) => ({
                    sno                 :   index + 1,
                    contractid          :   a.id,
                    coupleimg           :   BASE_URL + a.userprofile.profile_pic,
                    couplename          :   a.userprofile.fullname,
                    coupleemail         :   a.userprofile.user.email,
                    couplenumber        :   a.userprofile.phone,
                    joiningdate         :   formatDate(a.userprofile.created_at),
                    couplestate         :   (a.userprofile.state  ) ? a.userprofile.state.state   : null,
                    couplecity          :   (a.userprofile.city   ) ? a.userprofile.city.city     : null,
                    registerdate        :   a.userprofile.created_at,
                    linkchat            :   `/achats?march=${a.chatid}`,
                    // link                :    "/couple-single",
                }))
            }
            if (response.data.subscriptions){
                subscriptiondata.value = response.data.subscriptions.map((a:any, index) => ({
                    sno                 :   index + 1,
                    subid               :   a.id,
                    subcoupleimg        :   (a.vpic) ? BASE_URL + a.vpic : user1,
                    vendorname          :   (a.user) ? (a.user.first_name + a.user.last_name) : '--',
                    vendoremail         :   (a.user) ? (a.user.email) : '--',
                    subscriptionname    :   a.package.name,
                    recamount           :   a.total_price,
                    subsdate            :   formatDate(a.created_at.split('T')[0]),
                }))
            }





  
        } 

    } catch (error) {
        console.error("Error for data store:", error);
    } finally {
        fullpageloader.value = false;
    }
}


function exportToExcel(itable:any=null) {
    const tableWrapper = document.getElementById(itable);
    if (!tableWrapper) { console.error('Table wrapper element not found'); return; } //table wrapper exists or not
    const table = tableWrapper.querySelector('table');
    if (!table) { console.error('Table element not found inside the wrapper'); return; } //table exists or not

    const worksheet = XLSX.utils.table_to_sheet(table); //Convert table to worksheet
    const workbook = XLSX.utils.book_new(); //new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Append the worksheet to the workbook
    XLSX.writeFile(workbook, `data_${itable}.xlsx`); // Generate Excel file and download it
}

function downloadData(itable:any=null){
    const tableWrapper = document.getElementById(itable);
    if (!tableWrapper) { console.error('Table wrapper element not found'); return; } //table wrapper exists or not

    const options = {
    margin: 1,
    filename: `data_${itable}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
    };
    html2pdf().from(tableWrapper).set(options).save();
}


const tab:any = window.location.pathname.split('/').pop()
  console.log("route.params.tab_______________", tab)
  if (["transaction", "vendordata", "customerdata", "subscriptionpayment"].includes(tab)) reportstab.value = tab

  
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
            <v-tabs v-model="reportstab" color="primary" align-tabs="start">
                <v-tab value="transaction">All Transaction</v-tab>
                <v-tab  @click="get_list('vendordata')" value="vendordata">Vendors  </v-tab>
                <v-tab @click="get_list('customerdata')" value="customerdata">Customers  </v-tab>
                <v-tab @click="get_list('subscriptionpayment')" value="subscriptionpayment">Subscription Payments  </v-tab>
            </v-tabs>


            <v-window v-model="reportstab">
                <v-window-item value="transaction">
                    <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                        <v-card-item class="pa-sm-6 pa-3">
                            <v-row class="justify-content-between pt-3">
                                <v-col cols="12" md="4"> <v-card-title class="text-h4">All Transactions</v-card-title></v-col>
                                <v-col cols="12" md="8" class="d-flex gap-2 justify-end">
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search_trx" label="Search Vendor" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field variant="outlined" hide-details type="date" label="Filter by Date" density="compact" v-model="search_date_trx"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu open-on-hover>
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center py-5 custom-btn-width">
                                                        Download Report
                                                        <CaretDownIcon stroke-width="1"/>
                                                    </v-btn>
                                                </template>
                                                <v-list class="pa-3">
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('trxtable')"> Pdf </v-btn>
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('trxtable')"> Excel </v-btn>
                                                </v-list>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-table class="month-table mt-6" id="trxtable">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th> -->
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Customer</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>   
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Date/Time</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment Amount</th>   
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in paginatedList_trx" :key="index" :currentPage="currentPage_trx" :pageSize="5" class="month-item">
                                            <!-- <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td> -->
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
                                                <div class="d-flex align-top">
                                                    <v-avatar size="40" color="primary"  variant="flat" rounded="sm">
                                                        <img :src="item.cimg" :alt="item.cimg" width="40"
                                                    />
                                                    </v-avatar>
                                                    <div class="mx-3">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary"> {{ item.customername }}</h4>
                                                        <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                            {{ item.person }}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    {{item.providedservice}}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">{{ item. transactiondate }}</h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 text-success font-weight-medium">{{ item. amount }}</h5>
                                            </td>
                                            <td>
                                                <h4 class="text-body-1 text-primary font-weight-semibold text-capitalize">{{ item.payment }}</h4>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                            <v-pagination v-model="currentPage_trx" :length="Math.ceil(filteredList_trx.length / itemsPerPage)" rounded="circle"></v-pagination>
                        </v-card-item>
                    </v-card>
                </v-window-item>
                <v-window-item value="vendordata">
                    <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                        <v-card-item class="pa-sm-6 pa-3">
                            <v-row class="justify-content-between pt-3">
                                <v-col cols="12" md="4"> <v-card-title class="text-h4">All Vendors</v-card-title></v-col>
                                <v-col cols="12" md="8" class="d-flex gap-2">
                                    <v-row class="d-flex justify-end">
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search_ven" label="Search Vendor" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field variant="outlined" hide-details type="date" label="By Joining Date" density="compact" v-model="search_date_ven"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu open-on-hover>
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center py-5 custom-btn-width">
                                                        Download Report
                                                        <CaretDownIcon stroke-width="1"/>
                                                    </v-btn>
                                                </template>
                                                <v-list class="pa-3">
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('ventable')">Pdf</v-btn>
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('ventable')"> Excel </v-btn>
                                                </v-list>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-table class="month-table mt-6 border rounded" id="ventable">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor Info</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Business Name</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Joining Date</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package/status</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in paginatedList_ven" :key="index" :currentPage="currentPage_ven" :pageSize="5" class="month-item">
                                            <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    {{ item.contractid }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    <div class="d-flex align-start">
                                                        <v-avatar size="50" class="rounded-sm"><img :src="item.vendorimg" :alt="item.img" width="50" /></v-avatar>
                                                        <div class="mx-3">
                                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.vendorname}}</h4>
                                                            <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.vendoremail}}</h6>
                                                            <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.vendornumber }}</h6>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    <div class="">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.businessname}}</h4>
                                                        <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.categoryname}}</h6>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    <div class="">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.joiningdate}}</h4>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <v-chip size="small" color="info" class="font-weight-semibold">
                                                    <DiamondIcon class="mr-2" start size="17" />
                                                    {{ item.activepackagename }}                                               
                                                </v-chip>
                                                <v-chip rounded="md" class="ma-2 font-weight-semibold" :color="item.statuscolor"
                                                    size="small" label>({{ item.statustext }})</v-chip>

                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="View Vendor">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                    <v-tooltip text="Chat">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.linkchat">
                                                                <Message2Icon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4">
                                                <v-col cols="12" v-if="paginatedList_ven.length === 0">
                                                    <v-card elevation="0" class=" mt-6 border-0" color="">
                                                        <v-card-item class="text-center">
                                                            <AlertCircleIcon stroke-width="1.5" size="50"
                                                                class="mr-2 text-error" />
                                                            <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                            <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                                Search again with another Contract<br> temporary error.
                                                            </h6> -->
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                            <v-pagination v-model="currentPage_ven" :length="Math.ceil(filteredList_ven.length / itemsPerPage)" rounded="circle"></v-pagination>
                        </v-card-item>
                    </v-card>
                </v-window-item>
                <v-window-item value="customerdata">
                    <v-card elevation="10" class="bg-grey100">
                        <v-card-item class="pa-sm-6 pa-3">
                            <v-row class="justify-content-between pt-3">
                                <v-col cols="12" md="4"> <v-card-title class="text-h4">All Couples</v-card-title></v-col>
                                <v-col cols="12" md="8" class="d-flex gap-2">
                                    <v-row class="d-flex justify-end">
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search_cup" label="Search Couple" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field variant="outlined" hide-details type="date" label="By Joining Date" density="compact" v-model="search_date_cup"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu open-on-hover>
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center py-5 custom-btn-width">
                                                        Download Report
                                                        <CaretDownIcon stroke-width="1"/>
                                                    </v-btn>
                                                </template>
                                                <v-list class="pa-3">
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('cuptable')">Pdf</v-btn>
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('cuptable')">Excel</v-btn>
                                                    
                                                </v-list>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-table class="month-table mt-6 border rounded" id="cuptable">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Couple Name</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Phone Number</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Address</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Joining Date</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in paginatedList_cup" :key="index" :currentPage="currentPage_cup" :pageSize="5"
                                        class="month-item">
                                            <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    {{ item.contractid }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    <div class="d-flex align-start">
                                                        <v-avatar size="50" class="rounded-sm">
                                                            <img :src="item.coupleimg" :alt="item.img" width="50"
                                                        /></v-avatar>
                                                        <div class="mx-3">
                                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.couplename}}</h4>
                                                            <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.coupleemail}}</h6>  
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    <div class="">
                                                        <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplenumber }}</h6>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <div>
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplestate}}</h6>
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplecity}}</h6>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.registerdate}}</h6>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex justify-center">
                                                    <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="Chat">
                                                       <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.linkchat">
                                                                <Message2Icon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip> 
                                                </h5>
                                                <!-- <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="View Contract">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5> -->
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4">
                                                <v-col cols="12" v-if="paginatedList_cup.length === 0">
                                                    <v-card elevation="0" class=" mt-6 border-0" color="">
                                                        <v-card-item class="text-center">
                                                            <AlertCircleIcon stroke-width="1.5" size="50"
                                                                class="mr-2 text-error" />
                                                            <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                            <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                                Search again with another Contract<br> temporary error.
                                                            </h6> -->
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                            <v-pagination v-model="currentPage_cup" :length="Math.ceil(filteredList_cup.length / itemsPerPage)" rounded="circle"></v-pagination>
                        </v-card-item>
                    </v-card>
                </v-window-item>
                <v-window-item value="subscriptionpayment">
                    <v-card elevation="10" class="bg-grey100">
                        <v-card-item class="pa-sm-6 pa-3">
                            <v-row class="justify-content-between pt-3">
                                <v-col cols="12" md="4"> <v-card-title class="text-h4">All Subscription Payments</v-card-title></v-col>
                                <v-col cols="12" md="8" class="d-flex gap-2 justify-end">
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search_sub" label="Search Vendor" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field variant="outlined" hide-details type="date" label="Filter by Date" density="compact" v-model="search_date_sub"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu open-on-hover>
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center py-5 custom-btn-width">
                                                        Download Report
                                                        <CaretDownIcon stroke-width="1"/>
                                                    </v-btn>
                                                </template>
                                                <v-list class="pa-3">
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('subtable')">Pdf</v-btn>
                                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('subtable')">Excel</v-btn>
                                                    
                                                </v-list>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                    
                                </v-col>
                            </v-row>
                            <v-table class="month-table mt-6 border rounded" id="subtable">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor Name</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Subscription Name</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Subscription Date</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Received Payments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in paginatedList_sub" :key="index" :currentPage="currentPage_sub" :pageSize="5"
                                        class="month-item">
                                            <td><h5 class="text-no-wrap text-body-1">{{item.sno}}</h5></td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    {{ item.subid }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    <div class="d-flex align-start">
                                                        <v-avatar size="50" class="rounded-sm">
                                                            <img :src="item.subcoupleimg" :alt="item.img" width="50"
                                                        /></v-avatar>
                                                        <div class="mx-3">
                                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.vendorname}}</h4>
                                                            <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.vendoremail}}</h6>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    <div class="">
                                                        <v-chip size="small" color="info" class="font-weight-semibold">
                                                            <DiamondIcon class="mr-2" start size="17" />
                                                            {{ item.subscriptionname }}
                                                        </v-chip>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td>
                                                <div>
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.subsdate}}</h6>
                                                </div>
                                            </td>
                                             <td>
                                                <div>
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">${{ item.recamount}}</h6>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4">
                                                <v-col cols="12" v-if="paginatedList_sub.length === 0">
                                                    <v-card elevation="0" class=" mt-6 border-0" color="">
                                                        <v-card-item class="text-center">
                                                            <AlertCircleIcon stroke-width="1.5" size="50"
                                                                class="mr-2 text-error" />
                                                            <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                            <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                                Search again with another Contract<br> temporary error.
                                                            </h6> -->
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                            <v-pagination v-model="currentPage_sub" :length="Math.ceil(filteredList_sub.length / itemsPerPage)" rounded="circle"></v-pagination>
                        </v-card-item>
                    </v-card>
                </v-window-item>
            </v-window>
            
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
.cumulative thead th,
.cumulative tbody td,
.cumulative tbody td h6
{
    font-size: 14px !important;
}

@media only screen and (max-width: 991px) {
    .custom-btn-width{
        width: 100%;
    }
}

</style>