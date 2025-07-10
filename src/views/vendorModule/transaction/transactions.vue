<script setup lang="ts">
import { ref, computed } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
/*--transaction table data --*/
import userimg from "@/assets/images/profile/defaultuserimg.png";
import html2pdf from 'html2pdf.js'; // Import html2pdf
/*--all transaction --*/
const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Done', 'Pending', 'Failed', 'Requested']);
const searchbudget = ref();
const itemsPerPage = 8;
const currentPage = ref(1);
const search = ref('');

const filteredList = computed(() => {
    console.log("recentTransaction.value_____________", recentTransaction.value)
    const isearch = search.value.toLowerCase()
    const ilist = recentTransaction.value.filter((i:any) => (
        i.customername.toLowerCase().includes(isearch) ||
        i.customeremail.toLowerCase().includes(isearch) ||
        i.service.toLowerCase().includes(isearch) ||
        String(i.payment).includes(isearch) ||
        i.status.toLowerCase().includes(isearch) ))

    function chdate(a:any, b:any) { 
        const i = new String(a).split("-"); 
        const j = new String(b).split("/"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter((item:any) =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.status.toLowerCase())) &&
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

const tab = ref(null);
const total_amt =ref('0');
const monthtable = ref([]);
const recentTransaction = ref([]);
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
    formData.append("user_current_role", 'user_current_role');
    formData.append("user_current_role", 'vendor');
    const response = await axios.post(`/home/all_transactions`, formData, config);
    console.log(response.data, "hi response all booking customer");

    if (response.data.status == 'SAVED') {

      recentTransaction.value = response.data.pay_booking_data.map((elem:Any, index) => {
        return {
          "img": elem.vendor 
            ? (elem.vendor.userprofile.profile_pic ? BASE_URL + elem.vendor.userprofile.profile_pic : user1) 
            : (elem.admin.userprofile.profile_pic ? BASE_URL + elem.admin.userprofile.profile_pic : user1),
          "customername": (elem.couple) ? `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}` : `${elem.vendor.userprofile.user.first_name} ${elem.vendor.userprofile.user.last_name}`,
          "customeremail": (elem.couple) ? `${elem.couple.userprofile.user.email}` : `${elem.vendor.userprofile.user.email}`,
          "service": elem.booking.package.name,
          "transactiondate": formatDate(elem.created_at),
          "payment": parseFloat(elem.total_amt).toFixed(2),
          "btn_link": `/vendor-invoice/` + elem.id,
          "status":elem.status,
          "sno":index + 1,
        };
      });

      monthtable.value  = response.data.monthly_totals
      total_amt.value   = `$${parseFloat(response.data.yearly_total).toFixed(2)}`;

      fullpageloader.value = false
    }else{ fullpageloader.value = false}
  } catch (error) {
    console.error(error);
  }
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
                <v-card-item class="pa-sm-6 pa-3">
                    <v-card-title class="text-h4 text- ps-0 mb-2">All Transactions </v-card-title>
                    <v-row class="justify-content-between pt-3">
                        <!-- <v-col cols="12" md="12"> 
                            <v-card-title class="text-h4 text-secondary">All
                                Bookings
                            </v-card-title>
                        </v-col> -->
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightCustom">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Transactions" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status"
                                                hide-details class="" density="compact">
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
                    <v-row>
                        
                        <v-col cols="12" md="7">
                            <div ref="transaction_download">
                            <v-table class="month-table mt-6">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer/Admin</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Date/Time</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Status</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in paginatedList" :key="index"
                                            :currentPage="currentPage" :pageSize="5" class="month-item">
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    {{ item.sno }}
                                                </h5>
                                            </td>
                                            <td>
                                                <div class="d-flex align-top">
                                                    <v-avatar size="40" color="primary" variant="flat" rounded="sm">
                                                        <img :src="item.img" :alt="item.img" width="40" />
                                                    </v-avatar>
                                                    <div class="mx-3">
                                                        <h4
                                                            class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary">
                                                            {{ item.customername }}</h4>
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
                                            <td>
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                    {{ item.transactiondate }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h4 class="text-body-1 text-success font-weight-bold">$ {{ item.payment }}
                                                </h4>
                                            </td>
                                            <td>
                                                <h4 class="text-body-1 font-weight-bold text-capitalize">{{ item.status  }}
                                                </h4>
                                            </td>
                                            <td>
                                                <h4 class="text-body-1 text-error d-flex justify-center font-weight-bold text-center">
                                                    <v-tooltip text="Download Invoice">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props">
                                                                <DownloadIcon  @click="downloadContract" stroke-width="2" size="20"
                                                                    class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                    <v-tooltip text="View Invoice">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20"
                                                                    class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h4>

                                            </td>
                                        </tr>
                                        <tr v-if="paginatedList.length === 0">
                                            <td colspan="5">
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
                             </div>
                            <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                                rounded="circle"></v-pagination>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                            <v-card-item class="">
                                <!-- <v-card-title class="text-h4 text- ps-0 mb-2">Cumulative Amount</v-card-title> -->
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <!-- <v-card-title class="text-h4">Cumulative Amount</v-card-title> -->
                                        <v-table class="month-table border rounded cumulative">
                                            <thead>
                                                <tr>
                                                    <th class="text-h1 font-weight-bold bg-grey200 text-no-wrap">Month</th>
                                                    <th class="text-h1 text-end font-weight-bold bg-grey200 text-no-wrap">Cumulative Amount ({{new Date().getFullYear()}}) </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="month-item" v-for="item in monthtable" :key="item.mname">
                                                    <td>
                                                        <h6 class="text-h6 font-weight-medium text-medium-emphasis">
                                                            {{ item.mname }}
                                                        </h6>

                                                    </td>
                                                    <td>
                                                        <h6 class="text-h6 font-weight-medium text-medium-emphasis text-end">
                                                            $ {{ item.ctotal }}
                                                        </h6>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th class="text-h6 font-weight-bold">Total</th>
                                                    <th class="text-h6 text-end font-weight-bold"> {{ total_amt }} </th>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-col>
                                </v-row>


                            </v-card-item>
                        </v-card>
                        </v-col>
                    </v-row>


                </v-card-item>
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

.cumulative thead th,
.cumulative tbody td,
.cumulative tbody td h6 {
    font-size: 14px !important;
}

.bg-lightCustom {
    background: #f2e8d2;
}
</style>