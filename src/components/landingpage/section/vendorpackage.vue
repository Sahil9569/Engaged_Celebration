<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const is_valid = ref( (['vendor','admin'].includes(localStorage.getItem('role'))) ? true : false );
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
const bookingData = ref([]);
const clickFunModalbookin = (item: any) => {item.dialogbooking = true }

// (async function(){
//     const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({pvn:''})}`)
//     if (response.data.status == "SENT"){
//         bookingData.value = response.data.popular_ven.map((a:any)=>({
//             serviceservice: a.name,
//             category: a.category.name,
//             vendorserviceimg: BASE_URL + a.package_logo,
//             serviceprovidername: a.vendor.business_name,
//             vendorserviceprice: `${a.price}`,
//             vendorname: a.vendor.userprofile.fullname,
//             id: a.vendor.id,
//             email: a.vendor.userprofile.user.email,
//             vendortype: `${a.vendor.v_role} Vendor`,
//             rating: a.iratings,
//             link: "/cpackage_pub/" + a.id + "?booknow",
//             v_link: "/cpackage_pub/" + a.id,
//             log_link: "/login",
//             deposit: a.advance_payment,
//             cities: a.cities.map((a:any)=>(a.city)).join(', '),
//             states: a.states.map((a:any)=>(a.state)).join(', '),
//         }))
//     }
// })();


(async function(){
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({pvn:''})}`);
    if (response.data.status == "SENT") {
        console.log('bookingData-------', response.data);

        const allStates = response.data.all_stat_data.map((s) => s.state); // Extract all state names
        console.log('allStates', allStates);

        bookingData.value = response.data.popular_ven.map((a) => {
            const packageStates = a.states.map((s) => s.state);
            console.log('packageStates---', packageStates);
            const isAllStates = allStates.every(state => packageStates.includes(state)); // Check if package has all states
            return {
                serviceservice: a.name,
                category: a.category.name,
                vendorserviceimg: BASE_URL + a.package_logo,
                serviceprovidername: a.vendor.business_name,
                vendorserviceprice: `${a.price}`,
                vendorname: a.vendor.userprofile.fullname,
                id: a.vendor.id,
                email: a.vendor.userprofile.user.email,
                vendortype: `${a.vendor.v_role} Vendor`,
                rating: a.iratings,
                link: "/cpackage_pub/" + a.id + "?booknow",
                v_link: "/cpackage_pub/" + a.id,
                log_link: "/login",
                deposit: a.advance_payment,
                country: a.country.country,
                cities: a.cities.map((c) => c.city).join(', '),
                states: isAllStates ? ["All States"] : packageStates, // Apply "All States" logic
            };
        });
        console.log("Final Booking Data:", bookingData.value); // Debug final structured data
    }
})();


const showAll = ref(false);


const fullpageloader = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage            = ref(false);

const name                    = ref();
const email_id                          = ref();
const phone_no                         = ref();
const msg                       = ref();
function checklength(){
    if(name.value) name.value = (name.value.length > 50) ? name.value.slice(0,50) : name.value
    if(phone_no.value) phone_no.value = (phone_no.value.length > 10) ? phone_no.value.slice(0,10).replace(/\D/g, "") : phone_no.value.replace(/\D/g, "");
    if(email_id.value) email_id.value = (email_id.value.length > 100) ? email_id.value.slice(0,100) : email_id.value
}

const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const emailRules = ref([(v: string) => { if (!v) { return 'Please enter email'; } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { return true; } else { return 'Enter a Valid Email'; } } ]);
async function send_inquiry(action = 'null',user_id="null") {
    try {
      const checkemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id.value)
      if (  !(name.value && email_id.value && phone_no.value && msg.value && checkemail && (phone_no.value.length == 10))){
         showErrorMessage.value = true;
         myerrors.value = 'Please fill all required fields!';
         setTimeout(() => { showErrorMessage.value = false; }, 3000);
         return null
      }
      const formData = new FormData();
      formData.append("action",action);
      formData.append("user_type",'vendor');
      formData.append("user_id", user_id);
      formData.append("name",name.value);
      formData.append("email",email_id.value);
      formData.append("phone_no",phone_no.value);
      formData.append("msg",msg.value);
      fullpageloader.value = true
      const response = await axios.post(`/home/send_inquiry`, formData, config);
      if (response.data.status == 'SAVED') {
          myerrors.value="Your enquiry sent successfully!"
          showSuccessMessage.value    = true;
          setTimeout(() => {showSuccessMessage.value=false;}, 1800);
         
          setTimeout(() => { window.location.reload();}, 800);
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
      <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
               <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
      </v-alert>
   </div>
    <v-container class="container-width">
        <v-row v-if="bookingData.length > 0">
            <v-col cols="12" md="6" lg="4"  class="position-relative " v-for="item in bookingData.slice(0, 6)" :key="item.vendorname">
                <v-card class="customer-card vendor-card-hover" elevation="0">
                    <v-card-item class="pa-4">

                        <router-link :to="item.v_link">
                            <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>{{ item.category }}</v-chip>
                            </div>
                        </router-link>

                        <div class="top-ctsection">
                        


                        <div class="mt-2 w-100">
                                        <div class="d-flex justify-space-between">
                                            <v-rating half-increments disabled v-model="item.rating" density="compact" color="warning" size="small"></v-rating> 
                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold text-black text-start"> ${{ item.vendorserviceprice }}</h4>
                                        </div>
                                        <router-link :to="item.v_link" class="text-dark text-decoration-none">
                                            <h4 class="text-subtitle-1 text-ellipsis font-weight-semibold text-black text-start"> {{ item.serviceservice }}</h4></router-link>
                         </div>





                        <div class="text-start">
                            <h6 class="text-body-2  mb-0 mt-3 font-weight-medium"><span class="font-weight-semibold">Deposit :</span> ${{ parseInt(parseFloat(item.vendorserviceprice) * (parseFloat(item.deposit)/100)) }} ({{item.deposit}}%)</h6>

                            <!-- <h6 class="text-body-2  mb-0 font-weight-medium"><span class="font-weight-semibold">Location :</span> {{ item.states }}</h6> -->

                            <h6 class="text-body-2 mb-0 font-weight-medium">
                                <span class="font-weight-semibold">Location:</span>

                                <!-- If "All States", display only "All States" -->
                                <span v-if="item.states.length === 1 && item.states[0] === 'All States'">
                                    {{ item.country }}: All States
                                </span>

                                <!-- If 5 or fewer states, display all -->
                                <span v-else-if="item.states.length <= 5">
                                    {{ item.country }}: {{ item.states.join(', ') }}
                                </span>

                                <!-- If more than 5 states, show first 5 initially and allow toggle -->
                                <span v-else>
                                    {{ item.country }}: 
                                    <span v-if="!showAll">
                                        {{ item.states.slice(0, 3).join(', ') }} 
                                        <span class="text-primary cursor-pointer" @click="showAll = !showAll">
                                            View All
                                        </span>
                                    </span>

                                    <!-- Show full list when expanded -->
                                    <span v-else>
                                        {{ item.states.join(', ') }}
                                        <span class="text-primary cursor-pointer" @click="showAll = !showAll">
                                             Hide
                                        </span>
                                    </span>
                                </span>
                            </h6>

                            
                            <h6 class="text-body-2  mb-0 font-weight-medium"><span class="font-weight-semibold">Offered by :</span> {{ item.vendorname }} ({{ item.vendortype }})</h6>
                            <!-- <h6 class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Cities :</span> {{ item.cities }}</h6> -->
                            
                        </div>
                        <v-row class="mt-2">
                            <v-col cols="6">
                                <div v-if="is_valid">
                                    <v-btn color="secondary" variant="flat" class=" d-block py-1"
                                        size="small" :to="item.log_link">
                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                    Book now
                                </v-btn>
                                </div>
                                <div v-else>
                                <v-btn color="secondary" variant="flat" class=" d-block py-1"
                                        size="small" :to="item.link">
                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                    Book now
                                </v-btn>
                            </div>
                            <!-- <v-btn color="secondary" variant="flat" class=" d-block py-1"
                                        size="small" :to="item.link">
                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                    Book now
                                </v-btn> -->
                            </v-col>
                            <v-col cols="6">
                                <v-btn color="secondary" variant="flat" size="small" class="w-100 d-block"
                                    @click="clickFunModalbookin(item)">
                                    <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />
                                    Send Enquiry
                                </v-btn>
                            </v-col>
                            <v-dialog v-model="item.dialogbooking" persistent class="dialog-mw"
                                size="small">
                                <v-card class="pa-6">
                                    <div class="d-flex justify-space-between">
                                        <h4
                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold text-dark ">
                                        Send Enquiry - {{ item.serviceprovidername }}</h4>
                                        <v-btn icon color="" @click="item.dialogbooking = false" flat
                                            variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="20" />
                                        </v-btn>
                                    </div>
                                    <v-row>
                                        <v-col cols="6">
                                            <VTextField type="text" maxlength="50" v-model="name" placeholder="Name" hide-details @keyup="checklength()"></VTextField>
                                        </v-col>
                                        <v-col cols="6">
                                            <VTextField type="email" maxlength="100" v-model="email_id" placeholder="Email" hide-details @keyup="checklength()" :rules="emailRules"></VTextField>
                                        </v-col>
                                        <v-col cols="12">
                                            <VTextField type="text" maxlength="10" v-model="phone_no" placeholder="Phone No" hide-details :rules="phonenoRules" @keyup="checklength()"></VTextField>
                                        </v-col>
                                        <v-col cols="12">
                                            <VTextarea v-model="msg" auto-grow placeholder="Message" rows="5" color="primary" row-height="25" shaped
                                                hide-details></VTextarea>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                            <v-btn @click="send_inquiry('Package_User',item.id)" flat class="submit_btn bg-dark text-white mb-5">Send An Enquiry</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-dialog>
                        </v-row>
                    </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
        
        <v-row v-else> 
                    <v-col cols="12">

                            <v-card elevation="10" rounded="md" class="coming_card">

                                    <v-card-item class="px-3 py-8">

                                        <div class="coming-soon text-center">
                                            <h2 class="text-center sailFont ctm_h2 text-black font-weight-bold"> Coming Soon!</h2>
                                            <p>Exciting vendor packages are on the way. Stay tuned for amazing offers!</p>
                                            
                                        </div>
                                    </v-card-item>
                            
                            </v-card>
                    </v-col>
                </v-row>
                <div class="d-flex justify-center mt-4">
            <v-btn color="primary" to="/allpackagelisting?rol=Vendor" class="rounded-sm">View All </v-btn>
        </div>
        
    </v-container>



</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";



.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}
.top-ctsection {
    background: aliceblue;
    padding: 20px;
    margin-top: -49px;
    z-index: 999;
    margin: -44px 10px 0 10px;
    border-radius: 10px;
}
.vendorsc-section {
    z-index: -1;
}
</style>
