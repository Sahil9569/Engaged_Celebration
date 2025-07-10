<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import BASE_URL from '@/stores/myVar'



import user1 from "@/assets/images/profile/user-1.jpg";

const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Weekly', 'Monthly', 'Yearly']);
const searchtime = ref('All');
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');


// const filteredList = computed(() => {
//     const isearch = search.value.toLowerCase()
//     const ilist = WalletHistory.value.filter((i: any) => (
//         i.ven_name.toLowerCase().includes(isearch) ||
//         i.email.toLowerCase().includes(isearch) ||
//         String(i.amount).includes(isearch)))

//     function chdate(a: any, b: any) {
//         const i = new String(a).split("-");
//         const j = new String(b).split("/");
//         return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
//     }

//     return ilist.filter(item =>
//     (
//         (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.statustext.toLowerCase())) &&
//         (searchtime.value.length === 0 || searchtime.value.includes('All') || searchtime.value.toLowerCase().includes(item.statustime.toLowerCase())) &&
       
//         // ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.bookingdate))
//         ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.created_at))
//     )
//     );
// });




const filteredList = computed(() => {
    const isearch = search.value.toLowerCase();
    const today = new Date();
    
    let startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    
    let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
    let startOfYear = new Date(today.getFullYear(), 0, 1); // First day of the year

    console.log("Start of Week:", startOfWeek.toISOString());
    console.log("Start of Month:", startOfMonth.toISOString());
    console.log("Start of Year:", startOfYear.toISOString());

    const ilist = WalletHistory.value.filter((i) => (
        i.ven_name.toLowerCase().includes(isearch) ||
        i.email.toLowerCase().includes(isearch) ||
        String(i.amount).includes(isearch)
    ));

    return ilist.filter((item) => {
        let itemDate = new Date(item.created_at.split("/").reverse().join("-")); // Convert 'dd/mm/yyyy' to 'yyyy-mm-dd'
        
        let dateMatch = true; // Default to true if no date filter is applied
        if (searchdate.value) {
            let selectedDate = new Date(searchdate.value);
            dateMatch = itemDate.toDateString() === selectedDate.toDateString();
        }

        let weeklyMatch = itemDate >= startOfWeek;
        let monthlyMatch = itemDate >= startOfMonth;
        let yearlyMatch = itemDate >= startOfYear;

        if (statusvalue.value === "Weekly") {
            console.log("Filtering by Weekly:", itemDate.toISOString(), "Match:", weeklyMatch);
        }
        if (statusvalue.value === "Monthly") {
            console.log("Filtering by Monthly:", itemDate.toISOString(), "Match:", monthlyMatch);
        }
        if (statusvalue.value === "Yearly") {
            console.log("Filtering by Yearly:", itemDate.toISOString(), "Match:", yearlyMatch);
        }

        return (
            (statusvalue.value === 'All' || 
            (statusvalue.value === 'Weekly' && weeklyMatch) ||
            (statusvalue.value === 'Monthly' && monthlyMatch) ||
            (statusvalue.value === 'Yearly' && yearlyMatch)) &&
            (searchtime.value === 'All' || searchtime.value.toLowerCase().includes(item.statustime.toLowerCase())) &&
            dateMatch // Ensure the date matches if selected
        );
    });
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

const WalletHistory = ref([]);
const Top_Wallet_Users = ref([]);

const weekly_topup = ref('');
const monthly_topup = ref('');
const yearly_topup = ref('');
const total_wallet_balance = ref('');


async function show_Whistory() {
    const formData = new FormData();
    fullpageloader.value = true;
    try {
        const response = await axios.post(`/home/wallet_transactions`, formData, config);
        console.log("response.data______________", response.data);
        if (response.data.status == 'SAVED') {

            weekly_topup.value = response.data.weekly_topup_balance
            monthly_topup.value = response.data.monthly_topup_balance
            yearly_topup.value = response.data.yearly_topup_balance
            total_wallet_balance.value = response.data.total_wallet_balance

            if (response.data.wallet_transactions) {
                WalletHistory.value = response.data.wallet_transactions.map((a, index) => ({
                    "sno": index + 1,
                    "vendor_img": a.user.profile_pic ? BASE_URL + a.user.profile_pic : user1,
                    "ven_name": `${a.user.user.first_name} ${a.user.user.last_name}`,
                    "email": a.user.user.email,
                    "id": a.id,
                    "created_at": formatDate(a.created_at),
                    "amount": a.amount % 1 === 0 ? Math.floor(a.amount) : parseFloat(a.amount).toFixed(2),
                    "total_amount": a.wallet?.total_amount 
                        ? (a.wallet.total_amount % 1 === 0 ? Math.floor(a.wallet.total_amount) : parseFloat(a.wallet.total_amount).toFixed(2)) 
                        : "0.00",
                    "vendor_id": a.vendor_profile_id ? a.vendor_profile_id : null,
                    "btn_link": a.vendor_profile_id ? `/vendor-profile/${a.vendor_profile_id}` : "#", // Avoid broken links
                    // "btn_link": `/booking-single/${a.id}`
                    // "link"                :   `/vendor-profile/${a.user.id}`,
                    
                })).reverse();
            }
            if (response.data.all_wallet_users){
                console.log(response.data.all_wallet_users,"success ...........")
                Top_Wallet_Users.value = response.data.all_wallet_users.map((a:any,index)=>({
                "sno": index + 1,
                "vendor_img": a.user.profile_pic ? BASE_URL + a.user.profile_pic : user1,
                'ven_name': a.user.user.first_name +a.user.user.last_name,
                'email': a.user.user.email,
                'id': a.id,
                "total_amount": a.total_amount % 1 === 0 ? Math.floor(a.total_amount) : a.total_amount.toFixed(2),
                }));
            }
        }
        fullpageloader.value = false;
    } catch (error) {
        console.error(error);
        showErrorMessage.value = true;
        fullpageloader.value = false;
    }
}
onMounted(() => {
    show_Whistory();
});




</script>
<template>
    <div class="loader" v-if="fullpageloader">
        <span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
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
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="4"><v-card-title class="text-h4">Wallet Payments </v-card-title></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" lg="3" md="3" sm="3">
                            <v-card elevation="10" class="bg-color-tab">
                                <v-card-item class="cust_omers">
                                    <div class="pt-2">
                                        <v-avatar class="bg-secondary" size="50"><img
                                                src="@/assets/images/admin/booking-img.svg" height="25" alt="icon" />
                                        </v-avatar>
                                    </div>
                                    <h4 class="text-h4 mt-1 text-primary">$ {{ weekly_topup }}</h4>
                                    <h6 class="text-subtitle-1  text-secondary font-weight-bold mb-2">Weekly Top-Up
                                        Balance
                                    </h6>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" lg="3" md="3" sm="3">
                            <v-card elevation="10" class="bg-color-vendors">
                                <v-card-item class="cust_omers">
                                    <div class="pt-2">
                                        <v-avatar class="bg-arrow-color" size="50"><img
                                                src="@/assets/images/admin/booking-img.svg" height="25" alt="icon" />
                                        </v-avatar>
                                    </div>
                                    <h4 class="text-h4 mt-1">$ {{ monthly_topup }}</h4>
                                    <h6 class="text-subtitle-1  text-vendors font-weight-bold mb-2">Monthly Top-Up
                                        Balance
                                    </h6>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" lg="3" md="3" sm="3">
                            <v-card elevation="10" class="bg-color-tab">
                                <v-card-item class="cust_omers">
                                    <div class="pt-2">
                                        <v-avatar class="bg-secondary" size="50"><img
                                                src="@/assets/images/admin/booking-img.svg" height="25" alt="icon" />
                                        </v-avatar>
                                    </div>
                                    <h4 class="text-h4 mt-1 text-primary">${{ yearly_topup }}</h4>
                                    <h6 class="text-subtitle-1  text-secondary font-weight-bold mb-2">Yearly Top-Up
                                        Balance
                                    </h6>
                                </v-card-item>

                            </v-card>
                        </v-col>
                        <v-col cols="12" lg="3" md="3" sm="3">
                            <v-card elevation="10" class="bg-color-vendors">
                                <v-card-item class="cust_omers">
                                    <div class="pt-2">
                                        <v-avatar class="bg-arrow-color" size="50">
                                            <WalletIcon size="30" color="#fff" />
                                        </v-avatar>
                                    </div>
                                    <h4 class="text-h4 mt-1">$ {{ total_wallet_balance }}</h4>
                                    <h6 class="text-subtitle-1  text-vendors font-weight-bold mb-2">Total Wallet Balance
                                    </h6>
                                </v-card-item>

                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row class="justify-content-between ">

                        <v-col cols="12" md="12">
                            <v-card elevation="0" class="border bg-lightCustom">
                                <v-card-item class="py-4">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">
                                        Filters
                                    </p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search"
                                                label="Search Name" hide-details variant="outlined"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details
                                                type="date" label="Filter By date" density="compact"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status"
                                                hide-details class="me-2" density="compact">
                                            </v-select>
                                        </v-col>
                                       

                                    </v-row>

                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="9">
                            <v-table class="month-table mt-6 text-nowrap">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Vendor Info
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Top-up Amount
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Purchased Date
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Available Balance
                                            </th>
                                            <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">Action</th> -->
                                        </tr>
                                    </thead>
                                   
                                    <tbody v-if="paginatedList.length > 0">
                                        <tr v-for="(item, index) in paginatedList" :key="index"
                                            :currentPage="currentPage" :pageSize="5" class="month-item">
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">{{ item.sno }}</h5>
                                            </td>
                                            <td>
                                                <router-link :to="item.btn_link" class="text-decoration-none text-dark">
                                                    <div class="d-flex align-center">
                                                        <v-avatar size="40" variant="flat" rounded="sm">
                                                            <img :src="item.vendor_img" :alt="item.vendor_img"
                                                                width="40" /></v-avatar>
                                                        <div class="mx-3">
                                                            <h4
                                                                class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                                {{item.ven_name }}</h4>
                                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                                {{ item.email }}</h6>
                                                        </div>
                                                    </div>
                                                </router-link>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    $ {{ item.amount }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-1">
                                                    {{ item.created_at }}
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 class="text-no-wrap text-body-2">
                                                   $ {{ item.total_amount }}
                                                </h5> 
                                            </td>
                                            <!-- <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <v-tooltip text="View Booking">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat v-bind="props" :to="item.link">
                                                            <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip> 
                                            </h5>
                                        </td> -->

                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                      <tr>
                                        <td colspan="5">
                                            <p class="text-center text-h6 text-medium-emphasis">No data found</p>

                                        </td>
                                      </tr>
                                       
                                       
                                    </tbody>
                                </template>
                            </v-table>
                            <v-pagination color="primary" v-model="currentPage"
                                :length="Math.ceil(filteredList.length / itemsPerPage)" rounded="circle"></v-pagination>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-row v-if="Top_Wallet_Users.length > 0">
                                <v-col cols="12" class="pb-0"><v-card-title class="text-h5 mt-5 mb-0">Top Spending
                                        User</v-card-title></v-col>
                                <v-col cols="12" class="spending-user">
                                    <v-row>
                                       
                                        <v-col  v-for="(item,index) in Top_Wallet_Users" :key="item.id" cols="12">
                                            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                                                <v-card-item class="pt-4 pb-4 pe-0 overflow-hidden">
                                                    <v-row class="align-center">
                                                        <v-col cols="9">
                                                            <div class="d-flex align-center">
                                                                <v-avatar size="40" variant="flat" rounded="sm">
                                                                    <img :src="item.vendor_img" :alt="item.vendor_img" width="40" /></v-avatar>
                                                                <div class="mx-4">
                                                                    <h4
                                                                        class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                                        {{ item.ven_name }}</h4>
                                                                    <h6
                                                                        class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                                        {{ item.email }}</h6>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <h4 class="text-align-end">${{ item.total_amount }}</h4>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>

                            </v-row>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col cols="12" md="3" lg="3">
                            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                                <v-card-item class="pt-4 pb-4 pe-0 overflow-hidden">

                                    <div class="d-flex align-center">
                                        <v-avatar size="40" variant="flat" rounded="sm">
                                            <img :src="user1" width="40" /></v-avatar>
                                        <div class="mx-3">
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                Palvi Sharma</h4>
                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                palvi@123gmail.com</h6>
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3" lg="3">
                            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                                <v-card-item class="pt-4 pb-4 pe-0 overflow-hidden">

                                    <div class="d-flex align-center">
                                        <v-avatar size="40" variant="flat" rounded="sm">
                                            <img :src="user1" width="40" /></v-avatar>
                                        <div class="mx-3">
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                Palvi Sharma</h4>
                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                palvi@123gmail.com</h6>
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3" lg="3">
                            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                                <v-card-item class="pt-4 pb-4 pe-0 overflow-hidden">

                                    <div class="d-flex align-center">
                                        <v-avatar size="40" variant="flat" rounded="sm">
                                            <img :src="user1" width="40" /></v-avatar>
                                        <div class="mx-3">
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                Palvi Sharma</h4>
                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                palvi@123gmail.com</h6>
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3" lg="3">
                            <v-card elevation="0" rounded="md" class="bg-color-tab border-0">
                                <v-card-item class="pt-4 pb-4 pe-0 overflow-hidden">

                                    <div class="d-flex align-center">
                                        <v-avatar size="40" variant="flat" rounded="sm">
                                            <img :src="user1" width="40" /></v-avatar>
                                        <div class="mx-3">
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                Palvi Sharma</h4>
                                            <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                palvi@123gmail.com</h6>
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row> -->
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

.newBooking td {
    background-color: rgb(255 174 31 / 13%);
}

.bg-color-tab {
    background-color: rgb(255 235 195) !important;
}

.bg-color-vendors {
    background-color: rgb(130 238 54 / 31%) !important;
}

.text-vendors {
    color: rgb(15 133 109) !important;
}

.bg-arrow-color {
    background-color: rgb(16 176 147) !important;
}

.bg-lightCustom {
    background: #f2e8d2;
}
</style>