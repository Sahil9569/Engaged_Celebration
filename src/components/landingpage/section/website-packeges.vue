<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
const bookingData = ref([]);
const clickFunModalbookin = (item: any) => { item.dialogbooking = true }

const p_role                      = ref('');
const package_paid = ref(false);
const lockDialog = ref(false);
const owner = ref();
const is_cust = ref( (['customer'].includes(localStorage.getItem('role'))) ? true : false);
const is_valid = ref( (['vendor','admin'].includes(localStorage.getItem('role'))) ? true : false );


// (async function(){
//     const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({pad:''})}`)
//     if (response.data.status == "SENT"){
//         console.log('bookingData-------',response.data);
//         console.log('bookingData-p_role------',response.data.p_role);
//         p_role.value    = response.data.p_role
//         console.log('bookingData-p_role datatype------',typeof p_role.value);
//         bookingData.value = response.data.popular_adm.map((a:any)=>({

//             package_paid: a.paid_status,
//             owner: a.package_owner_type, 


//             serviceservice: a.name,
//             category: a.category.name,
//             vendorserviceimg: BASE_URL + a.package_logo,
//             // serviceprovidername: a.vendor.business_name,
//             vendorserviceprice: `${a.price}`,
//             vendorfullprice: `${a.full_price}`,
//             vid: a.admin.id,
//             vendorname: a.admin.userprofile.fullname,
//             vendoremail: a.admin.userprofile.user.email,
//             // vendortype: `${a.vendor.v_role} Vendor`,
//             rating: a.iratings,
//             link: "/cpackage_pub/" + a.id + "?booknow",
//             v_link: "/cpackage_pub/" + a.id,
//             n_link: "/vendor-single/" + a.id,
//             log_link: "/login",
//             deposit: a.advance_payment,
//             cities: a.cities.map((a:any)=>(a.city)).join(', '),
//             states: a.states.map((a:any)=>(a.state)).join(', '),
            
//         }))
//     }
// })();

(async function(){
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({pad:''})}`);
    if (response.data.status == "SENT") {
        console.log('bookingData-------', response.data);
        console.log('bookingData-p_role------', response.data.p_role);
        p_role.value = response.data.p_role;
        console.log('bookingData-p_role datatype------', typeof p_role.value);

        const allStates = response.data.all_stat_data.map((s:any) => s.state); // Extract all state names
        console.log('allStates',allStates)

        bookingData.value = response.data.popular_adm.map((a:any) => {
            const packageStates = a.states.map((s:any) => s.state);
            console.log('packageStates---',packageStates)
            const isAllStates = allStates.every(state => packageStates.includes(state)); // Check if package has all states

            return {
                package_paid: a.paid_status,
                owner: a.package_owner_type,
                serviceservice: a.name,
                category: a.category.name,
                vendorserviceimg: BASE_URL + a.package_logo,
                vendorserviceprice: `${a.price}`,
                vendorfullprice: `${a.full_price}`,
                vid: a.admin.id,
                vendorname: a.admin.userprofile.fullname,
                vendoremail: a.admin.userprofile.user.email,
                rating: a.iratings,
                link: "/cpackage_pub/" + a.id + "?booknow",
                v_link: "/cpackage_pub/" + a.id,
                n_link: "/vendor-single/" + a.id,
                log_link: "/login",
                deposit: a.advance_payment,
                country: a.country.country, 
                cities: a.cities.map((c:any) => c.city).join(', '),
                // states: isAllStates ? "All States" : packageStates.join(', '), // Display "All States" if all are covered
                states: isAllStates ? ["All States"] : packageStates, 

            };
        });
    }
})();



const showAll = ref(false);


const fullpageloader                = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

const name                          = ref();
const email_id                      = ref();
const phone_no                      = ref();
const msg                           = ref();
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
      formData.append("user_type",'admin');
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
    } catch (error) {   console.error("Error fetching data:", error);   }
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
            <v-col cols="12" md="6" lg="4"  class="position-relative" v-for="item in bookingData.slice(0, 6)" :key="item.vendorname">
                <v-card class="customer-card vendor-card-hover" elevation="0">


                    <v-card-item class="pa-4">
                        <div v-if="item.package_paid && !is_cust">
                            <router-link :to="item.log_link" >
                            <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                <v-chip rounded="sm"
                                    class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                    label>{{ item.category }}</v-chip>
                            </div>
                            </router-link>
                        </div>

                
                        <div v-else>
                            <router-link :to="item.v_link" >
                            <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                <v-chip rounded="sm"
                                    class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                    label>{{ item.category }}</v-chip>
                            </div>
                            </router-link>
                        </div>


                        <!-- <router-link :to="item.v_link" >
                            <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                <v-chip rounded="sm"
                                    class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                    label>{{ item.category }}</v-chip>
                            </div>
                        </router-link> -->
                        <div class="top-ctsection">
                        <div class="d-flex justify-space-between align-start mt-2 w-100">
                            <div class="w-100">
                                <div class="d-flex justify-space-between w-100" >
                                    <v-rating half-increments disabled v-model="item.rating" density="compact" color="warning" size="small"></v-rating> 
                                    <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold text-black mt-1 text-start"> ${{ item.vendorserviceprice }}</h4>
                                </div>
                                

                            
                                <h4 class="text-subtitle-1 text-ellipsis font-weight-semibold text-black text-start mb-2"> {{ item.serviceservice }}</h4>  


                                <h6 class="text-subtitle-1 text-no-wrap font-weight-semibold text-black text-start"> {{ item.serviceprovidername }}</h6>
                                
                            </div>
                        </div>
                        <div class="text-start">
                            <p v-if="item.vendorfullprice > 0">
                                <h6 class="text-body-2  mb-0 mt-3 font-weight-medium"><span class="font-weight-semibold">Deposit :</span>$ {{ parseInt(item.vendorfullprice) }} 
                                                    ({{ ((item.vendorfullprice / item.vendorserviceprice) * 100).toFixed(2) }}% of $ {{ item.vendorserviceprice }})

                                </h6>
                            </p>
                            <p v-else="item.vendorserviceprice ">
                                <h6 class="text-body-2  mb-0 mt-3 font-weight-medium"><span class=" font-weight-semibold">Deposit :</span> $ {{parseInt(item.vendorserviceprice/100*item.deposit)}} ({{ item.deposit }}% of $ {{ item.vendorserviceprice}})</h6>
                                

                            </p>

                            <!-- <h6 class="text-body-2 mb-0 font-weight-medium"><span class="font-weight-semibold">Location :</span> {{ item.states }}</h6> -->


                            <h6 class="text-body-2 mb-0 font-weight-medium">
                                <span class="font-weight-semibold">Location:</span>

                                <!-- If "All States", display only "All States" -->
                                <span v-if="item.states.includes('All States')">
                                    {{ item.country }}: All States
                                </span>

                                <!-- If 5 or fewer states, display all -->
                                <span v-else-if="item.states.length <= 5">
                                    {{ item.country }}: {{ item.states.join(', ') }}
                                </span>

                                <!-- If more than 5 states, show first 5 initially and all on click -->
                                <span v-else>
                                    <span>
                                        {{ item.country }}: 
                                        <span>
                                            {{ item.showAll ? item.states.join(', ') : item.states.slice(0, 3).join(', ') }}
                                        </span>

                                        <span 
                                            class="text-primary cursor-pointer" 
                                            @click="item.showAll = !item.showAll"
                                        >
                                            {{ item.showAll ? ' Hide' : '  View All' }}
                                        </span>
                                    </span>
                                </span>
                            </h6>





                            <h6 class="text-body-2  mb-0 font-weight-medium"><span class="font-weight-semibold">Offered by :</span> {{ item.vendorname }} </h6>
                            
                        </div>
                        <v-row  class="mt-2">
                            <v-col cols="6">
                                <!-- If package is paid -->
                                <div v-if="item.package_paid">
                                    <!-- Condition 1: If the user is  a customer -->
                                    <div v-if="is_cust">
                                        <v-btn 
                                            color="secondary" 
                                            variant="flat" 
                                            class="d-block py-1" 
                                            @click="lockDialog = true"
                                            size="small" 
                                            :to="item.n_link">
                                            <LockIcon stroke-width="2" size="20" class="mr-1" />
                                            Book now
                                        </v-btn>
                                    </div>

                                    <!-- Condition 2: If the user is not a customer is_valid-->
                                    <div v-else >
                                        <v-btn 
                                            color="secondary" 
                                            variant="flat" 
                                            class="d-block py-1" 
                                            size="small" 
                                            :to="item.log_link">
                                            <LockIcon stroke-width="2" size="20" class="mr-1" />
                                            Book now
                                        </v-btn>
                                    </div>
                                </div>

                            <div v-else>
                                <!-- Condition 1: If the user is a customer -->
                                <div v-if="is_cust">
                                    <v-btn 
                                        color="secondary" 
                                        variant="flat" 
                                        class="d-block py-1" 
                                        size="small" 
                                        @click="lockDialog = true"
                                        :to="item.n_link">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Book now
                                    </v-btn>
                                </div>

                                <!-- Condition 2: If the user is valid but NOT a customer -->
                                <div v-else-if="is_valid">
                                    <v-btn 
                                        color="secondary" 
                                        variant="flat" 
                                        class="d-block py-1" 
                                        @click="lockDialog = true"
                                        size="small" 
                                        :to="item.log_link">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Book now
                                    </v-btn>
                                </div>

                                <!-- If package is NOT paid -->
                                <div v-else>
                                        <v-btn 
                                            color="secondary" 
                                            variant="flat" 
                                            class="d-block py-1" 
                                            size="small" 
                                            :to="item.v_link">
                                            <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                            Book now
                                        </v-btn> 
                                </div>
                            </div>
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
                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold text-dark">
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
                                            <VTextField type="email" maxlength="100" v-model="email_id" placeholder="Email" hide-details :rules="emailRules" @keyup="checklength()"></VTextField>
                                        </v-col>
                                        <v-col cols="12">
                                            <VTextField type="text" maxlength="10" v-model="phone_no" placeholder="Phone No" hide-details :rules="phonenoRules" @keyup="checklength()"></VTextField>
                                        </v-col>
                                        <v-col cols="12">
                                            <VTextarea v-model="msg" auto-grow placeholder="Message" rows="5" color="primary" row-height="25" shaped
                                                hide-details></VTextarea>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                            <v-btn @click="send_inquiry('Package_User',item.vid)" flat class="submit_btn bg-dark text-white mb-5">Send An enquiry</v-btn>
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
                                            <p>The most popular Packages are on the way. Stay tuned for amazing offers!</p>
                                            
                                        </div>
                                    </v-card-item>
                            
                            </v-card>
                    </v-col>
                </v-row>
        <div class="d-flex justify-center mt-4">
            <v-btn color="primary" to="/allpackagelisting?rol=Admin" class="rounded-sm">View All </v-btn>
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
        background: #edf1f4;
    padding: 20px;
    margin-top: -49px;
    z-index: 999;
    margin: -44px 10px 0 10px;
    border-radius: 10px;
    position: relative;
    z-index: 1;
    box-shadow: 0px 0px 10px #00000012;
}
.vendorsc-section {
    z-index: -1;
}

</style>
