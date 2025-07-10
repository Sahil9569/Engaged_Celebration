<script setup lang="ts">
import { ref } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { router } from '@/router';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import user1 from "@/assets/images/admin/userimg.jpg";
import serviceimg from "@/assets/images/customer/djs.jpg";


const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)

const path = window.location.pathname;
const serviceId:any = path.split('/').pop();
const parts = path.split('/'); 
const vendorSegment = parts[parts.length - 2];

const category_name = ref('')
const pkg_img = ref('')
const pkg_name = ref('')
const cities = ref([])
const pkg_price = ref('')
const pkg_totalbook = ref('')
const pkg_rembook = ref('')
const pkg_deposit = ref('')
const pkg_deposit_amt = ref('')
const srvc_budget = ref('')
const srvc_terms = ref('')
const req_date = ref('2024-06-01')
const srvc_location = ref('')
const srvc_bookingdate = ref('')
const srvc_bookingtime = ref('')
const link = ref('')
const ven_name = ref('')
const ven_email = ref('')
const ven_profile = ref('')
const couple_id = ref('')
const package_owner_id = ref('')
const view_contract = ref(false)
const view_link=ref("");
const c_sign=ref("");
const v_sign=ref("");
const ibid          =   (localStorage.getItem('itodo_bid'))
const anonbooking   =   ref( ibid ? ((parseInt(ibid) == parseInt(serviceId))?true:false) : false );
const deposit_payemt_status= ref("");
const full_pay_status= ref("");
const remianing_status= ref("");
const booking_status= ref("");
const msglink = ref("/login");
const canmsg = ref(true)
const check_role= ref("customer");
const bookingData = ref([ ]);
const contract_type = ref();
const radioStatus = ref();
const show_hide_data = ref();



    const updatepack            =   ref(false)
    const clickFunModal     =   (pack: any) => {  pack.dialog = true  }

   async function gettoupdate(){
    updatepack.value        =   true
}


async function handle_anonbooking(send:any=true){
    fullpageloader.value = true
    const response = await axios.post('/home/handle_anonbooking', {'ibid':ibid, 'send':send})
    console.log("response_____________________", response.data)
    localStorage.removeItem('itodo_bid')
    anonbooking.value               = false;
    myerrors.value                  = response.data.msg;
    fullpageloader.value=false;
    if (response.data.status == 'SENT'){
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
    }
    if (response.data.status == 'DELETED'){
        showErrorMessage.value      = true;
        setTimeout(() => {showErrorMessage.value=false; router.push('/all-bookings')}, 1000);
    }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
async function singlebooking() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'customer');
    formData.append("serviceId",serviceId);
    formData.append("package_role", vendorSegment);

    fullpageloader.value = true

    const response = await axios.post(`/home/single_booking`, formData, config);
    console.log(response.data,"hi responce all booking customer ")

    if (response.data.status == 'SAVED') {
        const contract: any = response.data.contract_data
        if ((contract.length == 0)){ view_contract.value = false         }
        else{
            view_contract.value = true
            view_link.value=contract.id
            v_sign.value = contract.vendor_sign
            c_sign.value = contract.couple_sign
            final_amt.value = contract.final_budget
            final_deposit_amt.value = contract.deposit_amt
            remaining__amt.value = parseInt(contract.final_budget) - parseInt(contract.deposit_amt)
            contract_type.value=contract.contract_users
            radioStatus.value=contract.action_status
            
        
        }

        const res: any = response.data.booking_data
        console.log(res,"ressssssssssss")
        category_name.value = res.package.category.name
        pkg_img.value = res.package.package_logo === '/media/default.jpg' ? serviceimg : BASE_URL +  res.package.package_logo 
        pkg_name.value = res.package.name
        cities.value = res.package.cities
        pkg_price.value = res.package.price
        pkg_deposit.value = res.package.advance_payment
        pkg_deposit_amt.value = res.deposit_amount
        pkg_rembook.value = res.package.no_of_booking
        pkg_totalbook.value = res.package.no_of_booking
        srvc_bookingdate.value = res.seldate
        srvc_bookingtime.value = res.seltimes.join(', ');
        if (res.city){srvc_location.value = res.city.city + ' , ' + res.state.state + ' , ' + res.country.country}
        srvc_terms.value = res.requirement
        srvc_budget.value = res.budget
        link.value = res.package.id
        ven_name.value = res.package.user.first_name + ' ' + res.package.user.last_name
        ven_email.value = res.package.user.email
        couple_id.value=(res.couple) ? res.couple.id : null
        booking_status.value = res.status
        show_hide_data.value = contract.package ? contract.package.show_hide : null
        msglink.value = `/${(localStorage.getItem('role').toLowerCase() == 'admin') ? 'achats' : 'cchats'}?march=${response.data.march}`
        canmsg.value = response.data.march

        if(res.package.vendor){
            ven_profile.value = (res.package.vendor.userprofile.profile_pic) ? BASE_URL + res.package.vendor.userprofile.profile_pic : BASE_URL + user1
            package_owner_id.value=res.package.vendor.id
        }
        else{
            if(res.package.admin){
                ven_profile.value = (res.package.admin.userprofile.profile_pic) ? BASE_URL + res.package.admin.userprofile.profile_pic : BASE_URL + user1
            }
            else{ ven_profile.value =  BASE_URL + user1 }
            package_owner_id.value=res.package.admin.id
        } 

        bookingData.value = response.data.pay_booking_data.map((elem) => ({
            "id":elem.id,
            "service": elem.booking.package.name,
            "bookingdate": formatDate(elem.created_at),
            "bookingpayment":'$' + elem.total_amt, 
            "statustext":elem.status,
            "notes":elem.notes,
            "statuscolor": elem.status === "done" ? "success" : "error",
            "payment_type":elem.payment_type,
            "btn_link": `/vendor-invoice/` + elem.id,
            "show_hide" : elem.booking.package.show_hide,
            "chat_link" : '/cchats?march=adminchat',
        }));

        deposit_payemt_status.value=response.data.deposit_pay_status
        full_pay_status.value=response.data.full_pay_status
        remianing_status.value=response.data.remaining_pay_status
        check_role.value=response.data.admin_role



    fullpageloader.value=false;
    }
  } catch (error) { console.error("Error fetching data:", error); }
}
singlebooking()

const paymentreq = ref(false);
const final_amt = ref('');
const final_deposit_amt = ref('');
const remaining__amt = ref(0);



async function booking_payment(action='null',amount_pay=null,booking_pay_id=null) {
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
    formData.append("remaining__amt",remaining__amt.value);
    formData.append("booking_id",serviceId);
    formData.append("couple_id",couple_id.value);
    formData.append("vendor_id",package_owner_id.value);
    const response = await axios.post(`/home/pack_payment`, formData, config);
    if (response.data.status == 'SAVED') {
        console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
        window.location.href=response.data.s_url;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
const goBack = () => {
  window.history.back();
};

const welcomedialog = ref(false);
const bookinreqdialogs = ref(false);
async function mark_welcome(mark = false) {
    const response = await axios.post(`/home/mark_welcome`, { 'mark': mark }, config);
    if (response.data.status == 'DONE') { welcomedialog.value = false } else { welcomedialog.value = true }
    // if (mark) { welcomedialog.value = false; bookinreqdialogs.value = true }
    // else { welcomedialog.value = true; bookinreqdialogs.value = false }
}
mark_welcome()


 
const messageVisibles = ref(false);  

async function toggleMessage() {
messageVisibles.value = true
}



</script>
<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>

    

    
    <div class="d-flex justify-start">
        <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
            <ChevronLeftIcon size="13" class="me-1" />Back 
        </v-btn>
    </div>
    <v-card elevation="10" class="bg-grey100">
        <v-card-item class="pa-sm-6 pa-3">
            <v-row>
                <v-col cols="12" md="4">
                    <v-card elevation="10" class="vendor-card-hover mb-5">
                        <v-card-item class="pa-4">

                            <div class="position-relative d-flex overflow-hidden">
                                <img :src="pkg_img" class="rounded vendormainimg imgheight">
                                <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service"
                                    size="small" label>
                                    {{ category_name }}
                                </v-chip>
                                <div class="viewServiceBtn d-md-flex d-block">


                                    <v-btn color="primary" :to="'/vendor-single/' + link" variant="flat" class=" "
                                        size="small">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        View Package
                                    </v-btn>
                                </div>
                            </div>

                            <div class="d-flex justify-space-between align-center mt-4">
                                <div>
                                    <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary mb-0">
                                        {{ pkg_name }}
                                    </h4>
                                </div>
                                <div>
                                    <h4
                                        class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                        ${{ pkg_price }}
                                    </h4>
                                </div>
                            </div>

                            <div class="pb-5">

                                <h6 v-if="cities && cities.length > 0" class="text-body-2 text-13"><span
                                        class="font-weight-semibold">Location
                                        :</span>
                                    <span v-for="(c, index) in cities" :key="c.id">
                                        {{ c.city }}
                                        <span v-if="index !== cities.length - 1">,</span>
                                    </span>
                                </h6>

                                <!-- <h6  v-if="pkg_totalbook" class="text-body-2 text-13"><span class="font-weight-semibold">Total Bookings
                                        :</span> {{ pkg_totalbook }}</h6>
                                <h6 v-if="pkg_rembook" class="text-body-2 text-13"><span class="font-weight-semibold">Remaining Bookings
                                        :</span> {{pkg_rembook}}</h6> -->
                                <h6 v-if="pkg_deposit_amt" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit :
                                    </span>${{ pkg_deposit_amt }} ({{ pkg_deposit }}% of ${{pkg_price}})</h6>
                            </div>

                        </v-card-item>
                    </v-card>
                    <v-card elevation="10" class=" border d-flex mb-4">
                        <v-card-text class="">
                            <v-row v-if="final_amt">
                                <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                                    <h6  v-if="final_amt" class="text-h4 mb-1 ">$ {{final_amt}}</h6>
                                    <span class="font-weight-semibold text-body-2">Final Price
                                    </span>
                                </v-col>
                                <v-col cols="6" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1">$ {{final_deposit_amt}} </h6>
                                    <span class="font-weight-semibold text-body-2">Final Deposit 
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                                    <h6  v-if="final_amt" class="text-h4 mb-1 ">$ {{final_amt}}</h6>
                                    <h6  v-else class="text-h4 mb-1 ">$ {{pkg_price}}</h6>
                                    <span class="font-weight-semibold text-body-2">Base Price
                                    </span>
                                </v-col>
                                <v-col cols="6" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1">$ {{pkg_deposit_amt}} </h6>
                                    <span class="font-weight-semibold text-body-2">Deposit Amount
                                    </span>
                                </v-col>
                            </v-row>
                                   
                                   
                        </v-card-text>
                    </v-card>

                </v-col>
                <v-col col="12" md="8">
                    <div class="">
                        <div class="mb-4" >
                            <v-dialog v-model="welcomedialog" class="dialog-mw" :max-width="560" persistent transition="dialog-top-transition">
                                <v-card elevation="0" rounded="md" class="bg-lightprimary mt-6 py-12 bg-welcome ">
                                    <v-card-item class="pt-0 position-relative">
                                        <v-row>
                                            <v-col cols="12" sm="12" class="pa-6 text-center">
                                                <img src="@/assets/images/logos/ringlogo.png" class="sizeLogoWelcome" />
                                                <h5 class="text-h4 mb-2">Welcome to Engaged Celebration</h5>
                                                <h6 class="text-subtitle-1 mb-3 text-13  textSecondary font-weight-medium">Congratulations on joining. Our platform is dedicated to making your special day memorable and seamless. You're now part of a vibrant community committed to unforgettable experiences for couples, vendors, and their guests.</h6>
                                                <v-btn flat color="primary" @click="mark_welcome(true)">Start Journey</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-item>
                                </v-card>
                            </v-dialog>
                            <!-- <v-dialog v-model="bookinreqdialogs" transition="dialog-top-transition" class="dialog-mw" :max-width="450">
                                <v-card class="bg-lighterror">
                                    <v-card-item class="py-10">
                                        <p class="font-weight-semibold text-center ">This request was not confirmed, <br> Do you want to send this booking request?</p>
                                        <div class="d-flex justify-center mt-5">
                                            <v-btn flat class="bg-primary me-3" @click="handle_anonbooking()">Send</v-btn>
                                            <v-btn flat class="bg-error" @click="handle_anonbooking(false)"> Delete</v-btn>
                                        </div>
                                    </v-card-item>
                                </v-card>
                            </v-dialog> -->
                            <v-row class="justify-center" v-if="anonbooking">
                                <v-col cols="12">
                                    <v-alert class="mb-3 py-6 pa-3 customAlert border border-primary" color="">
                                        <div class="d-flex justify-center flex-wrap align-center">
                                            <p class=" text-h5 w-100 text-center">This request was not confirmed, <br> Do you want to send this booking request?</p>
                                            <div class="d-flex justify-center mt-3">
                                                <v-btn size="small" class="bg-primary me-3" @click="handle_anonbooking()"><SendIcon size="14" class="me-1"/> Send</v-btn>
                                                <v-btn size="small" class="bg-error" @click="handle_anonbooking(false)"> <TrashIcon  size="14" class="me-1"/> Delete</v-btn>
                                            </div>
                                        </div>
                                    </v-alert>                
                                </v-col> 
                            </v-row>
                        </div>
                        <v-card-text class="pa-0">
                            <v-row>
                                <v-col cols="12" class="pt-0">
                                    <v-alert v-if="booking_status  == 'requested'"
                                        border="start"
                                        variant="outlined"
                                        close-label="Close Alert"
                                        color="success"
                                        title="Booking Request"
                                        class="mb-3"
                                        >
                                        <p class="text-Darklight font-weight-semibold ">
                                            Your booking is awaiting confirmation. We will notify you once it is confirmed.
                                        </p>
                                        </v-alert>
                                    <v-card elevation="10" class=" border d-flex mb-4 position-relative">
                                                                 
                                        <v-card-text class="pa-4">
                                            <div class="">
                                                <div class="d-flex gap-2">
                                                    <div v-if="ven_profile">
                                                        <img :src="ven_profile" width="40" class="customerImg" />
                                                    </div>
                                                    <div v-else>
                                                        
                                                    </div>
                                                    <div class="">
                                                        <h6 class="text-h6 ">{{ ven_name }}</h6>
                                                        <span class="text-truncate d-flex align-center gap-2">
                                                            <span class="text-truncate font-weight-medium">{{ven_email}}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="d-flex  align-center mt-2">
                                                    <div v-if="view_contract">
                                                        <v-btn v-if="contract_type == 'AC'" flat size="small" :to="'/admin-contract-single/' + view_link"
                                                            color="secondary" class="rounded-sm mr-1">
                                                            <SignatureIcon size="16" class="me-1"/>
                                                            View Contract</v-btn>
                                                        <v-btn v-else flat size="small" :to="'/vendor-contract-single/' + view_link"
                                                        color="secondary" class="rounded-sm mr-1">
                                                        <SignatureIcon size="16" class="me-1"/>
                                                        View Contract</v-btn>
                                                    </div>
                                                    <v-btn flat size="small" color="secondary" class="rounded-sm mr-1"   :to="msglink" v-if="canmsg">
                                                        <MessageIcon size="16" class="me-1"/>
                                                        Message
                                                    </v-btn>

                                            
                                                    <v-btn v-if="booking_status  == 'requested'" flat size="small" color="bg-grey200" class=" rounded-sm mr-1 " disabled>
                                                        <ClockHour8Icon size="16" class="me-1"/>
                                                        Requested
                                                    </v-btn>
                                                    
                                                    
                                                    
                                                    <v-dialog v-model="paymentreq" class="dialog-mw" size="small" :max-width="600">

                                                        <template v-if="remianing_status ==='no' && full_pay_status === 'no'" v-slot:activator="{ props }">

    <!---------------------------- dont delete it ................................................. -->
                                                            <!-- <v-btn color="success" variant="flat"  @click="paymentreq= true" size="small" class="rounded-sm mr-1" v-if="v_sign && c_sign">
                                                                <CashIcon size="16" class="me-1"/>
                                                                Payment
                                                            </v-btn> -->
                                                        </template>


                                                        <v-card class="pa-6">
                                                            <div class="d-flex justify-space-between border-bottom mb-5">
                                                                <h4
                                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                    Request Payment</h4>
                                                                <v-btn icon color="" @click="paymentreq = false" flat variant="outlined"
                                                                    size="x-small" class="bg-error">
                                                                    <XIcon width="20" />
                                                                </v-btn>
                                                            </div>

                                                            <div v-if="deposit_payemt_status === 'no'">
                                                                <v-card elevation="10" class="mb-4 rounded-lg bg-grey100 border-b-lg border-info">
                                                                    <v-card-item class="py-2">
                                                                        <v-row class="py-5">
                                                                            <v-col cols="7">
                                                                                <h6 class="text-h3 mb-1">$ {{ final_deposit_amt }}</h6>
                                                                                <p class="mb-0 font-weight-medium ">
                                                                                    Deposit
                                                                                </p>
                                                                                
                                                                            </v-col>
                                                                            <v-col cols="5" class="text-end">
                                                                                <v-btn color="success"  @click="booking_payment('deposit_payment')" variant="flat"  class="rounded-sm mr-1">
                                                                                    Pay Deposit
                                                                                </v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-card-item>
                                                                </v-card>
                                                                <v-card elevation="10" class="mb-4 rounded-lg bg-grey100 border-b-lg border-info">
                                                                    <v-card-item class="py-2">
                                                                        <v-row class="py-5">
                                                                            <v-col cols="7">
                                                                                <h6 class="text-h3 mb-1">$ {{ final_amt }}</h6>
                                                                                <p  class="mb-0 font-weight-medium ">

                                                                                    Full Payment
                                                                                </p>
                                                                            </v-col>
                                                                            <v-col cols="5" class="text-end">
                                                                                <v-btn color="success"  @click="booking_payment('full_payment')" variant="flat" class="rounded-sm mr-1">
                                                                                    Pay Full Payment
                                                                                </v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-card-item>
                                                                </v-card>
                                                            </div>
                                                            <div v-else>
                                                                <v-card elevation="10" class="mb-4 rounded-lg bg-grey100 border-b-lg border-info">
                                                                    <v-card-item class="py-2">
                                                                        <v-row class="py-5 align-center">
                                                                            <v-col cols="7">
                                                                                    <h6 class="text-h3 mb-1">$ {{ remaining__amt }}</h6>
                                                                                <p  class="mb-0 font-weight-medium ">
                                                                                    Remaining Payment
                                                                                </p>
                                                                            </v-col>
                                                                            <v-col cols="5" class="text-end">
                                                                                <v-btn color="success"  @click="booking_payment('remaing_payment')" variant="flat"  class="rounded-sm mr-1">
                                                                                    Pay Remaing payment
                                                                                </v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-card-item>
                                                                </v-card>
                                                                
                                                            </div>

                                                        </v-card>
                                                        
                                                    </v-dialog>
                                                </div>
                                            </div>
                                        </v-card-text>

                                        <template v-if="radioStatus == 'complete'">
                                            <v-btn  size="x-small" color="error"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                            Complete Contract
                                             <v-tooltip activator="parent" location="top">Contract status: Completed</v-tooltip>
                                            </v-btn>

                                        </template>
                                        <template v-else>

                                        <template v-if="((view_contract) && (v_sign && c_sign))">
                                                <v-btn  size="x-small" color="success"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                Active Contract
                                                <v-tooltip activator="parent" location="top">Contract has been signed by both parties.</v-tooltip>
                                                </v-btn>
                                            </template>
                                            <template v-else>
                                                <template v-if="view_contract">
                                                    <v-btn v-if="view_contract" size="x-small" color="primary"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                    Inprogress
                                                    <v-tooltip activator="parent" location="top">Awaiting signature from both parties.</v-tooltip>
                                                    </v-btn>
                                                </template>
                                                <template v-else>

                                                    <v-btn v-if="booking_status  == 'accepted'" flat  color="" class=" text-dark rounded-sm text-success float-accept cursor-default" :ripple="false" variant="tonal" >
                                                    <CircleCheckIcon size="16" class="me-1"/>
                                                    Request Accepted
                                                    </v-btn>
                                                </template>
                                            </template>

                                        </template>



                                    </v-card>
                                    <v-card elevation="10" class="mb-5">
                                        <v-card-item class="pa-sm-6 pa-3">
                                            <v-row>
                                                <v-col cols="12" md="6" class="order-sm-1 order-2">
                                                    <div class="d-flex mb-3">
                                                        <div>
                                                            <p
                                                                class="v-list-item-title text-h6 mb-1 d-flex align-center font-weight-medium ">
                                                                Event Date
                                                            </p>
                                                            <p
                                                                class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium maxwidthSet">
                                                                {{ srvc_bookingdate }}
                                                            </p>

                                                            <!-- <p  v-for="item in srvc_bookingtime" :key="index"  -->
                                                            <p  class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium maxwidthSet">
                                                                {{ srvc_bookingtime }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <!-- <div class="mb-3">
                                                            <p
                                                                class="v-list-item-title text-h6 mb-1 d-flex align-center font-weight-medium ">
                                                                Requested Date
                                                            </p>
                                                            <p
                                                                class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium">
                                                                {{req_date}}
                                                            </p>
                                                        </div> -->
                                                        <div class="mb-3">
                                                            <p
                                                                class="v-list-item-title text-h6 mb-1 d-flex align-center font-weight-medium ">
                                                                Location
                                                            </p>
                                                            <p
                                                                class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium">
                                                                {{srvc_location}}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" md="6" class=" d-flex text-sm-end text-start order-sm-2 order-1 flex-column ">
                                                    <h2
                                                        class=" mb-0 text-h2 text-secondary font-weight-bold text-capitalize">
                                                        $ {{srvc_budget}} 
                                                    </h2>
                                                    <span
                                                        class="v-list-item-title text-body-1 mb-1 font-weight-medium text-capitalize text-secondary">
                                                        Deposit Amount
                                                    </span>
                                                </v-col>
                                            </v-row>
                                            <div>
                                                <div class="mb-3">
                                                    <h2
                                                        class="v-list-item-title text-h6 mb-1 font-weight-medium text-capitalize">
                                                        Description
                                                    </h2>
                                                    <div class="body-text-5 border pa-3 rounded content-style contentHeight contentHeightExtra"
                                                        v-html="srvc_terms"
                                                        v-bind:class="{ 'addedRequestAlert': booking_status == 'requested' }">
                                                    </div>
                                                </div>

                                            </div>
                                        </v-card-item>
                                    </v-card>


                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="12">
                    <div class="">
                        <h3 class="text-h5 mb-3">Contract Payments </h3>
                    </div>
                    <v-card elevation="10" class="bg-lightprimary border border-primary">
                        <v-card-item class="pa-2">
                            <v-table class="month-table ">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                   
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                            Details</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name
                                                </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Amount
                                            </th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                                Date</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                                Type</th>

                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                                Status</th>
                                            <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="bookingData.length != 0">
                                        <tr  v-for="(item,index) in bookingData" :key="item.id" class="month-item">
                                            <td><h5 class="text-no-wrap text-body-1">{{ index + 1}}</h5></td>
                                            <td>
                                                <div class="d-flex align-center">
                                                    <v-avatar size="40">
                                                        <img :src="ven_profile" width="40" /></v-avatar>
                                                    <div class="mx-3">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                            {{ ven_name }}</h4>
                                                        <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                           {{ven_email}}</h6>
                                                        
                                                        <v-btn v-if="item.notes && item.notes !== 'undefined' " color="grey200" class="mt-1 rounded-sm" size="small" @click="gettoupdate" >
                                                            Note 
                                                            <!-- <v-tooltip activator="parent" location="top">
                                                                {{ item.notes}}
                                                            </v-tooltip> -->
                                                        </v-btn>
                                                        <v-dialog v-model="updatepack" scrollable class="dialog-mw" :max-width="600">
                                                        <v-card class="pa-6">
                                                        <div class="">
                                                            <!-- <p>abcd</p> -->
                                                            {{ item.notes}}
                                                        </div> 
                                                        <v-card-actions class="px-0 pb-0  d-flex justify-end w-100 mt-8">
                                                            <v-btn class="bg-error rounded-sm" text @click="updatepack=!updatepack" flat>
                                                                Close
                                                            </v-btn>
                                                        </v-card-actions>
                                                        </v-card>
                                                        </v-dialog>
                                                    </div>
                                                </div>
                                            </td>
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
                                                <h5 class="text-no-wrap text-body-1 font-weight-medium text-capitalize">
                                                    {{ item.payment_type }} 
                                                </h5>
                                            </td>
                                            <td>

                                            
                                                <v-chip v-if="item.statustext == 'done'" rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                                    :color="item.statuscolor" size="small" label>{{
                                                    item.statustext }} </v-chip>
                                                <v-chip v-else rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                                    :color="item.statuscolor" size="small" label>
                                                    <p v-if="item.statustext == 'pending'">pending</p>
                                                    <p v-else> {{item.statustext }} </p>
                                                </v-chip>

                                            </td>
                                         
                                            <td v-if="check_role ==='admin'">
                                                <h5  class="text-no-wrap text-body-1">
                                                    <v-tooltip text="View Booking">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip> 
                                                </h5>
                                            </td>
                                            <td v-else>
                                                <div>  
                                                    <h5 v-if="!item.show_hide">
                                                        <v-btn  color="success" class="mt-1 rounded-sm" size="small" @click="toggleMessage" >
                                                                Pay      
                                                        </v-btn>
                                                        <v-dialog v-model="messageVisibles" scrollable class="dialog-mw" :max-width="600">
                                                        <v-card class="pa-6">
                                                            <div  class="tab-box">
                                                            <p class="text-error mt-2">
                                                            <!-- This Package has been blocked by your administrator. -->
                                                            Oops! Blocked:
                                                            This package isn’t available right now. Your administrator has restricted access.


                                                            </p>
                                                            </div>
                                                        <v-card-actions class="px-0 pb-0  d-flex justify-end w-100 mt-8">
                                                            <v-btn class="bg-error rounded-sm" text flat
                                                                :to="item.chat_link">
                                                                <!-- Chat with Admin -->
                                                                💬 Connect with Admin
                                                            </v-btn>
                                                            <v-btn class="bg-error rounded-sm" text @click="messageVisibles=!messageVisibles" flat>
                                                                Close
                                                            </v-btn>
                                                        </v-card-actions>
                                                        </v-card>
                                                        </v-dialog>
                                                    </h5>

                                                                                    
                                                <!-- <h5 v-if="!item.show_hide">
                                                <v-btn @click="toggleMessage(index)" color="primary" variant="flat" size="small">
                                                    Not Pay
                                                </v-btn>
                                                <p v-if="messageVisibles[index]" class="text-error mt-2">
                                                    This Package has been blocked by your administrator.
                                                </p>
                                                </h5> -->
                                                
                                                <h5 v-else-if=" item.statustext != 'done' && item.payment_type != 'offline'" class="text-no-wrap text-body-1">
                                                    <v-btn color="success"  @click="booking_payment('request_payment',item.bookingpayment,item.id)" variant="flat" size="small" class="rounded-sm mr-1">
                                                                Pay 
                                                    </v-btn>
                                                </h5>

                                                <h5 v-else class="text-no-wrap text-body-1">
                                                    <v-tooltip text="View Booking">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20" class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip> 
                                                </h5>      
                                               
                                            </div>
                                            </td>
                                        </tr>
                                        <!-- <tr>
                                            <td colspan="number of column about row">No data yet</td>
                                        </tr> -->
                                    </tbody>
                                    <tbody v-else >
                                        <tr  class="month-item">
                                            <td colspan="7">
                                                <p class="text-center text-error py-2 mt-0">No data found yet</p>
                                            </td>
                                            
                                        </tr>
                                    </tbody>
                                </template>
                            </v-table>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

</template>
<style>




.tab-box {
  background-color: #fdf3f3;
  padding: 16px 24px; /* Increased padding */
  border: 2px solid #ffcccc;
  border-radius: 10px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100px; /* Slightly taller box */
  width: 100%;
  max-width: 600px; /* Optional for controlling the width */
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow for aesthetics */
}








img.sizeLogoWelcome {
    width: 90px;
}

.bg-welcome {
    background: url("@/assets/images/wedding/wedding-stage.jpeg");
    background-size: cover;
    background-position: center;
}

.bg-welcome:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.7;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
}
.vendormainimg {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
.vendormainimg.imgheight {
    height: 250px;
}
.booking-card:hover  .float-btn-book{
    bottom: 10px;
}
.float-btn-book {
    position: absolute !important;
    left: 50%;
    transform: translatex(-50%);
    bottom: -30px;
    transition: 0.38s ease-in-out 0s all;
}
.service-img-booking {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

label.v-label.v-field-label {
    color: #002642;
    font-weight: 600;
}

.height-set {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.contract-style {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 200px;
    border: 4px solid #ccc;
    position: relative;
}

.contract-style:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 41%, #fff 65%);
    left: 0;
    top: 0;
    opacity: 0.8;
}

.radio-tick {
    position: absolute;
    top: 10px;
    right: 10px;
}

.edit-contract-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.contentHeight.contentHeightExtra{
    height: 170px;

}
.float-accept {
    position: absolute;
    top: 0px;
    right: 0px;
}
.cursor-default {
    cursor: default;
}
.v-overlay__scrim {
    pointer-events: auto;
    background: rgb(0 0 0 / 43%) !important;
    border-radius: inherit;
    bottom: 0;
    left: 0;
    position: fixed;
    opacity: 1;
    right: 0;
    top: 0;
    backdrop-filter: blur(3px);
}
.customAlert {
    background: rgb(180 128 28 / 6%) !important;
    border-radius: 20px!important;
    position: relative;
}
.customAlert:before {
    content: "";
    width: 55px;
    height: 55px;
    background: #b4801c;
    border-radius: 50%;
    position: absolute;
    left: -5%;
    top: -12%;
}

.customAlert:after {
    content: "";
    width: 55px;
    height: 55px;
    background: #b4801c;
    border-radius: 50%;
    position: absolute;
    right: -5%;
    bottom: -12%;
}
.addedRequestAlert {
    height: 65px !important;
}
</style>