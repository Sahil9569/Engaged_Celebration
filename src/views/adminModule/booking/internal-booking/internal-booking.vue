<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import BASE_URL from '@/stores/myVar'
import user1 from "@/assets/images/profile/user-1.jpg";

const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)

const strp_status = ref("");
const c_stripe_dialog = ref(false)
const connect_stripe = () => {c_stripe_dialog.value = true;};

const bookingData = ref([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Requested', 'Accepted', 'Paid']);
const searchtime = ref('All');
const timeitem = ref(['All', 'Past', 'Present', 'Future']);
const searchbudget = ref();
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');
const menu = ref(false);


const filteredList = computed(() => {
    const isearch = search.value.toLowerCase()
    const ilist = bookingData.value.filter((i:any) => (
        i.customername.toLowerCase().includes(isearch) ||
        i.customeremail.toLowerCase().includes(isearch) ||
        i.vendorname.toLowerCase().includes(isearch) ||
        i.vendoremail.toLowerCase().includes(isearch) ||
        String(i.price).includes(isearch) ))

    function chdate(a:any, b:any) { 
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
function compareDates(idate:any) {
    const a = new Date(idate);
    const b = new Date();
    const input = new Date(`${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`)
    const today = new Date(`${b.getFullYear()}-${b.getMonth()+1}-${b.getDate()}`)
    return  ( input > today) ? 'Future' : (  (input < today) ? 'Past' : 'Present'  )
}
async function booking_req(action='null',booking_id=null) {
  try {
    const formData = new FormData();
    formData.append("action",action);
    formData.append("booking_id",booking_id);
    fullpageloader.value = true
    const response = await axios.post(`/home/booking_action`, formData, config);
    if (response.data.status == 'SENT') {
        myerrors.value="Booking request accepted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.href=response.data.link_btn;
    }
    if (response.data.status == 'Delete') {
        myerrors.value="Booking request deleted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.reload();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function showbooking() {
  try {
    const formData = new FormData();
    formData.append("ViewAllBopking", 'ViewAllBopking');
    formData.append("user_role", 'admin');
    const response = await axios.post(`/home/makebooking`, formData, config);
    console.log(response.data, "hi responce booking vendor");
    fullpageloader.value = true

    if (response.data.status == 'SAVED') {
      const res = response.data.ven_profile;
      strp_status.value = res.stripe_status;

      bookingData.value = response.data.booking_data.map((elem: any, index) => {
        // Initialize customer data
        const customerData = {
          "img": (elem.couple.userprofile.profile_pic) ? BASE_URL + elem.couple.userprofile.profile_pic : user1,
          "customername": `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
          "customeremail": elem.couple.userprofile.user.email,
        };

        // Initialize vendor data
        let vendorData = {
          "vimg": user1,
          "vendorname": "",
          "vendoremail": "",
        };

        // Check if assign_vendor exists and has at least one entry
        if (elem.assign_vendor && elem.assign_vendor.length > 0) {
          const vendor = elem.assign_vendor[0]; // Get the first entry

          vendorData = {
            "vimg": (vendor.userprofile.profile_pic) ? BASE_URL + vendor.userprofile.profile_pic : user1,
            "vendorname": `${vendor.userprofile.user.first_name} ${vendor.userprofile.user.last_name}`,
            "vendoremail": vendor.userprofile.user.email,
          };
        }

       
        return {
          ...customerData,
          ...vendorData,
          "service": elem.package.name,
          "id": elem.id,
          "bookingdate": formatDate(elem.seldate),
          "bookingpayment": elem.budget,
          "price": elem.package.price,
          "statuscolor": elem.status === "accepted" ? "success" : "primary",
          "statustime": compareDates(elem.seldate),
          "statustext": elem.status,
          "link": `/admin-booking-single-action/view/${elem.id}`,
          "a_link": `/admin-booking-single-action/view/${elem.id}`,
          "r_link": `/admin-booking-single-action/view/${elem.id}`,
          "contract": elem.contract,
          "status": elem.status,
          "strp_status": (elem.package.admin) ? elem.package.admin.stripe_status : elem.package.vendor.stripe_status,
          "sno": index + 1,
        };
       
      });
      fullpageloader.value = false
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


showbooking();
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
                <v-card-item class="pa-sm-6 pa-3"><v-card-title class="text-h4 text- ps-0 mb-2">All Bookings</v-card-title>
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightCustom">
                                <v-card-item class="py-4">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking/Price" hide-details variant="outlined" ></v-text-field>
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
                                            <v-select :items="timeitem" v-model="searchtime" label="Filter By Time"
                                                hide-details class="" density="compact">
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
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Assign Vendor Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Event Date</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold">Base Price</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Deposit</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Booking Status</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5"
                                    :class="{ 'newBooking': item.statustext === 'New' }" class="month-item">
                                    <td><h5 class="text-no-wrap text-body-1">{{ item.sno }}</h5></td>
                                    <td>
                                        <router-link :to="item.link" class="text-decoration-none text-dark">
                                            <div class="d-flex align-center">
                                                <v-avatar size="40" variant="flat" rounded="sm">
                                                    <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                                <div class="mx-3">
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                            item.customername }}</h4>
                                                    <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                        {{ item.customeremail }}</h6>
                                                </div>
                                            </div>
                                        </router-link>
                                    </td>
                                    <td>
                                        <router-link :to="item.link" class="text-decoration-none text-dark">

                                            <div v-if="item.vendoremail" class="d-flex align-center">
                                                <v-avatar size="40" variant="flat" rounded="sm">
                                                    <img :src="item.vimg" :alt="item.vimg" width="40" /></v-avatar>
                                                <div class="mx-3">
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                            item.vendorname }}</h4>
                                                    <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                        {{ item.vendoremail }}</h6>
                                                </div>
                                            </div>
                                            <div v-else class="text-center">
                                                <strong>--</strong>
                                            </div>
                                        </router-link>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.service }}
                                        </h5>
                                    </td>
                                    <td>
                                        
                                        <h5 class="text-no-wrap text-body-2">
                                            <CalendarIcon size="12" color="secondary" stroke-width="2.5" class="mr-1" />
                                            {{ item.bookingdate }}
                                        </h5>
                                      
                                    </td>
                                    <!-- <td>
                                        <h5 class="text-no-wrap text-body-2">
                                            ${{item.price}}
                                        </h5>
                                    </td> -->
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                           $ {{ item.bookingpayment }} 
                                        </h5>
                                    </td>
                                    <td>
                                        <v-chip rounded="md" class="font-weight-semibold text-capitalize"  :color="item.statuscolor"
                                            size="small" label>{{ item.statustext }}</v-chip>
                                    </td>



                                    <td>
                                        <h5 v-if="item.contract.length && item.statustext !='requested' " class="text-no-wrap text-body-1">
                                            <v-tooltip location="end" text="View Booking" >
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </h5>


                                        <h5 v-else class="text-no-wrap text-body-1">
                                           
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>

                                            <template v-if="strp_status == 'verified' ">


                                                <v-tooltip v-if="((item.status == 'requested') &&  (item.strp_status == 'verified'))"  text="Accept">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" @click="booking_req('accept',item.id)"  v-bind="props"
                                                            ><CheckIcon stroke-width="2.5" size="18" class="text-success" 
                                                        /></v-btn>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip v-if="((item.status == 'requested') &&  (item.strp_status == 'verified'))" text="Decline">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props" @click="booking_req('reject',item.id)"
                                                            ><XIcon stroke-width="2.5" size="18" class="text-error"
                                                        /></v-btn>
                                                    </template>
                                                </v-tooltip>

                                                <v-tooltip v-if="item.status == 'accepted'" text="Create Contract">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn  icon flat  size="small" v-bind="props" :to="item.link"
                                                            ><FilePencilIcon stroke-width="1.5" size="20" class="text-success" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>

                                            </template>

                                            <template v-else>
                                           
                                                <v-tooltip  text="Accept">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small"  @click="connect_stripe()"  v-bind="props"
                                                            ><CheckIcon stroke-width="2.5" size="18" class="text-success" 
                                                        /></v-btn>
                                                    </template>
                                                </v-tooltip>

                                                <v-tooltip v-if="item.status == 'requested'" text="Decline">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props" @click="booking_req('reject',item.id)"
                                                            ><XIcon stroke-width="2.5" size="18" class="text-error"
                                                        /></v-btn>
                                                    </template>
                                                </v-tooltip>
                                            
                                                <v-dialog v-model="c_stripe_dialog" class="dialog-mw" :max-width="600">
                                                    <v-card class="pa-6">
                                                        <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                            <h4
                                                                class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                                Connect to stripe   </h4>
                                                            <v-btn icon color="" @click="c_stripe_dialog = false" flat variant="outlined" size="x-small"
                                                                class="bg-error">
                                                                <XIcon width="13" />
                                                            </v-btn>
                                                        </div>
                                                        <div class="py-4">
                                                            <p>
                                                                Before you can accept booking requests, you need to link up with Stripe.
                                                            </p>
                                                            
                                                        </div>
                                                        <v-card-actions class="px-0 d-flex justify-end w-100">

                                                            <v-btn class="bg-error rounded-sm" text @click="c_stripe_dialog = false" flat>
                                                                Close
                                                            </v-btn>

                                                            <v-btn class="bg-secondary rounded-sm" to="/admin-account-setting" text flat >
                                                                Connect to Stripe
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>

                                            </template>






                                            </h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="6">
                                        <v-col cols="12" v-if="paginatedList.length === 0">
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
                    <v-pagination color="primary" v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-card-item>
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
</style>