<script setup lang="ts">
import { ref, onMounted} from 'vue';
import LogoLight from "@/assets/images/logos/Logo-a13.png";
import LogoDark from "@/assets/images/logos/Logo-a12.png";
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { useRoute } from 'vue-router';
const route = useRoute();
import { router } from '@/router';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar'

const fullpageloader = ref(false)

const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
const vid                           = ref('');
const booking_id                    = ref('');
const couple_package_id                    = ref('');


const encrypt = (text: string): string => btoa(text);
// Base64 Decode (Simple decryption)
const decrypt = (text: string): string => {
  try {
    return atob(text);
  } catch {
    return 'basicdetails'; // Default if decoding fails
  }
};





onMounted(() => {
    fullpageloader.value = true;
    (async function(){
        const sid       = route.query.sid
        const tip       = route.query.tip
        console.log("sid___________", sid, tip)

        if (tip == 'couplesubs'){
            const response  = await axios.post('home/check_payment', {sid:route.query.sid, tip:route.query.tip,'couple_subscription':'couple_subscription'}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response________', response.data)
            console.log('response-couple_package_id',couple_package_id)

            couple_package_id.value = response.data.couplepackage

            if (response.data.status == 'RefreshPage'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'VERIFIED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")

                localStorage.setItem('cpackname', response.data.package_name);
                localStorage.setItem('cpackactive', response.data.cpackactive);

                showSuccessMessage.value = true;
                myerrors.value = 'Your payment has been done successfully.';
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
            }
            else{ fullpageloader.value = false; }
        }
        if (tip == 'couplesmonth'){
            const response  = await axios.post('home/check_payment', {sid:route.query.sid, tip:route.query.tip,'couple_one_month':'couple_one_month'}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response________', response.data)

            couple_package_id.value = response.data.couplepackage

            console.log('response-couple_package_id',couple_package_id)

            if (response.data.status == 'RefreshPage'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'VERIFIED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")

                localStorage.setItem('cpackname', response.data.package_name);
                localStorage.setItem('cpackactive', response.data.cpackactive);

                showSuccessMessage.value = true;
                myerrors.value = 'Your payment has been done successfully.';
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
            }
            else{ fullpageloader.value = false; }
        }

        if (tip == 'couplesinglepack'){
            const response  = await axios.post('home/check_payment', {sid:route.query.sid, tip:route.query.tip,'couple_single_pack':'couple_single_pack'}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response________', response.data)

            couple_package_id.value = response.data.couplepackage

            if (response.data.status == 'RefreshPage'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'VERIFIED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")

                localStorage.setItem('cpackname', response.data.package_name);
                localStorage.setItem('cpackactive', response.data.cpackactive);

                showSuccessMessage.value = true;
                myerrors.value = 'Your payment has been done successfully.';
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
            }
            else{ fullpageloader.value = false; }
        }
       
    //    this run cuspayment
        if (tip == 'cus_payment'){
            const response  = await axios.post('home/check_payment', {sid:route.query.sid, tip:route.query.tip}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response___cus_payment_____', response.data)

            booking_id.value = response.data.booking
            if (response.data.status == 'VERIFIED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                showSuccessMessage.value = true;
                myerrors.value = 'Your payment has been done successfully.';
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            }
            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
            }
            else{ fullpageloader.value = false; }
        }
        if (tip == 'resubs' || tip == 'onetime'){

            console.log("sid___________", sid, tip)
            const response  = await axios.post('home/updatepackage', {sid:route.query.sid, tip:route.query.tip, resubs:true}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response________', response.data)

            booking_id.value = response.data.booking
            if (response.data.status == 'UPDATED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                showSuccessMessage.value = true;
                myerrors.value = response.data.msg;
                setTimeout(() => { router.push('/profile-settings')}, 1500);
            }
            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
            }
            else{ fullpageloader.value = false; }
        }
        if (tip == 'wallet_payment_success'){

            console.log("sid___________", sid, tip)
            const response  = await axios.post('home/check_payment', {sid:route.query.sid, tip:route.query.tip, resubs:true,'wallet_top_up':'wallet_top_up'}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
            console.log('response________', response.data)

            if (response.data.status == 'VERIFIED'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                showSuccessMessage.value = true;
                myerrors.value = 'Your has been successfully added amount to your wallet.';
                const encryptedTab = encrypt('user_wallet');

                setTimeout(() => { 
                    router.push(`/profile-settings/${encryptedTab}`);
                }, 3000);
            }
            




            if (response.data.status == 'INVALID'){ 
                fullpageloader.value = false;
                console.log("invalid________________________________")
                showSuccessMessage.value = true;
                myerrors.value ='Something went wrong please try again';
                setTimeout(() => { router.push('/profile-settings/user_wallet')}, 1500);

            }
            if (response.data.status == 'RefreshPage'){
                fullpageloader.value = false;
                console.log("verified_________________________________")
                setTimeout(() => { showSuccessMessage.value = false; }, 3000);
                setTimeout(() => { router.push('/profile-settings/user_wallet')}, 1500);
            }
            else{ fullpageloader.value = false; }
        }




    
    })();

})


function view_booking() { 
    console.log("booking_id:", booking_id.value);
    console.log("couple_package_id:", couple_package_id.value);

    const role = localStorage.getItem('role')

    console.log(couple_package_id,"couple_package_id")
    console.log(couple_package_id.value,"couple_package_id value")


    // if (role =='customer' && couple_package_id){
    if (role =='customer' && couple_package_id.value){
      
       
        window.location.href = `vendor-single/${couple_package_id.value}`;
       

        // window.location.href = window.location.href =`vendor-single/${couple_package_id.value}`

    }else if(role == 'customer'){
        window.location.href = window.location.href =`vendor-single/${booking_id.value}`

    }
    else
    {
        window.location.href = (localStorage.getItem('role') == 'admin') ? `/admin-booking-single-action/view/${booking_id.value}` :  window.location.href =`booking-single/${booking_id.value}`

    }
     }

const questionone = ref(false);
const questiontwo = ref(false);
const questionthree = ref(false);

const dialog = ref(false);
</script>
<template>
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

    <v-dialog v-model="questionone" persistent transition="dialog-bottom-transition"  class="dialog-mw on-top" max-width="700">
                <v-row class="justify-center">
                    <v-col cols="8" class="d-flex align-center">
                        <v-card class="cardDark animateCard postion-relative overflow-hidden" elevation="10" >
                            <v-card-item class="">
                                <div class="px-4 py-6">
                                    <div class="px-4 text-center">
                                        <img :src="LogoDark" class="mb-4 logoImgSize">
                                    </div>
                                    <div class="">
                                        <img class="mx-auto d-block" src="@/assets/images/wedding/handQus.png" alt="" style="max-width:100px;">
                                    </div>
                                    <h3 class="text-center mb-6  font-weight-semibold text-h4 text-white" style="line-height: 1.5;">Do you want to <br> create <span class="text-primary">packages?</span></h3>
                                    <div class="d-flex justify-center">
                                        <v-btn color="success" class="mr-2" flat to="/add-package">
                                            <CheckIcon size="18" class="me-1"/>Yes, I'm excited
                                        </v-btn>
                                        <v-btn  color="error" flat class="rounded-sm" text @click="questiontwo = true, questionone = false">
                                            <XIcon size="18" class="me-1"/>No do it later
                                        </v-btn>
                                    </div>
                                </div>
                            </v-card-item>
                        </v-card>   
                    </v-col>
                </v-row>
            
    </v-dialog>


    <v-dialog v-model="questiontwo" persistent transition="dialog-bottom-transition"  class="dialog-mw on-top" max-width="700">
        <v-row class="justify-center">
            <v-col cols="8" class="d-flex align-center">
                <v-card class="cardDark animateCard postion-relative overflow-hidden" elevation="10" >
                    <v-card-item class="">
                        <div class="px-4 py-6">
                            <div class="px-4 text-center">
                                <img :src="LogoDark" class="mb-4 logoImgSize">
                            </div>
                            <div class="">
                                <img class="mx-auto d-block" src="@/assets/images/wedding/handQus.png" alt="" style="max-width:100px;">
                            </div>
                            <h3 class="text-center mb-6  font-weight-semibold text-h4 text-white" style="line-height: 1.5;">Would you like to see your <br>  <span class="text-primary">Public profile?</span></h3>
                            <div class="d-flex justify-center">
                                <v-btn color="success" class="mr-2" flat :to="'/vendor-profile/' + vid">
                                    <CheckIcon size="18" class="me-1"/>Yes sure
                                </v-btn>
                                <v-btn  color="error" flat class="rounded-sm" text @click="questionthree = true, questiontwo = false">
                                    <XIcon size="18" class="me-1"/>Not now
                                </v-btn>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>   
            </v-col>
        </v-row>
    </v-dialog>
    <v-dialog v-model="questionthree" persistent transition="dialog-bottom-transition"  class="dialog-mw on-top" max-width="700">
        <v-row class="justify-center">
            <v-col cols="8" class="d-flex align-center">
                <v-card class="cardDark animateCard postion-relative overflow-hidden" elevation="10" >
                    <v-card-item class="">
                        <div class="px-4 py-6">
                            <div class="px-4 text-center">
                                <img :src="LogoDark" class="mb-4 logoImgSize">
                            </div>
                            <div class="">
                                <img class="mx-auto d-block" src="@/assets/images/wedding/handQus.png" alt="" style="max-width:100px;">
                            </div>
                            <h3 class="text-center mb-6  font-weight-semibold text-h4 text-white" style="line-height: 1.5;">Do you want to <br> Add  <span class="text-primary">portfolio?</span></h3>
                            <div class="d-flex justify-center">
                                <v-btn color="success" class="mr-2" flat to="/profile-settings">
                                    <CheckIcon size="18" class="me-1"/>Yes, I'm excited
                                </v-btn>
                                <v-btn  color="error" flat class="rounded-sm" text to="/vendor-dashboard">
                                    <XIcon size="18" class="me-1"/>No do it later
                                </v-btn>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>   
            </v-col>
        </v-row>
    </v-dialog>


    <div class="h-100 bg-white">
        <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
        <v-row class="justify-center align-center h-100">
            <v-col cols="5">
                <div class="d-flex justify-center pb-14">
                    <img :src="LogoLight" class="logoImgSize">
                </div>
                <v-card elevation="10" class="border ctm-thankyou">
                    <v-card-item>
                        <div class="tick">
                            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <div class="pt-14 pb-10">
                            <h1 class="text-h3 text-center kaushan-script-regular mb-10 text-primary">Thankyou</h1>
                            <!-- <h3 class="text-h5 text-center mb-0">For Your Purchase</h3> -->
                            <p class="text-body-1 mb-6 text-13 text-center font-weight-medium text-white">
                                We are pleased to inform you that your payment has been successfully processed. Thank you for your prompt payment and for choosing our services.
                            </p>

                            
                            
                            <div class="d-sm-flex align-center justify-center gap-3 mt-5 mb-5" v-if="booking_id ">
                                <v-btn color="primary"  class="mt-4 mt-sm-0 rounded-sm" @click="view_booking()">View Booking</v-btn>
                            </div>
                           
                            <div class="d-sm-flex align-center justify-center gap-3 mt-5 mb-5" v-if="couple_package_id ">
                                <v-btn color="primary"  class="mt-4 mt-sm-0 rounded-sm" @click="view_booking()">View Package</v-btn>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<style>
 @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');
/* .circle{
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: rgb(0 0 0 / 66%);
  position: absolute;
  z-index: 1;
}
.circle-container {
  position: relative;
  height: 70px;
  width: 70px;
} */

.v-overlay__scrim{
    opacity: 0.9;
    background: rgb(255 255 255) !important;
}
/* .on-top .v-overlay__content{
    top:0px;
} */

.ctm-thankyou{
    /* background-image: url(@/assets/images/website/black-bg1.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover; */
    background-color: #000;
}
.cardDark{
    background-color: #000;
}

.back-question {
    background: url(@/assets/images/website/question.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 300px;
}
.back-question1 {
    background: url(@/assets/images/website/photograph8.webp);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 300px;
}



.kaushan-script-regular {
  font-family: "Kaushan Script", cursive !important;
  font-weight: 400;
  font-size: 50px !important;
}

/* .circle-progress {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border: 5px solid #ACCAFF36;
  border-radius: 50%;
}

.circle-progress::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border: 5px solid transparent;
  border-top-color: #ACCAFF;
  top: 0px;
  left: 0px;
  animation: spin 1s linear infinite;
} */


.checkmark {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: block;
    stroke-width: 3;
    stroke: #b4801c;
    stroke-miterlimit: 10;
    margin: 30px auto;
    box-shadow: inset 0px 0px 0px #dfc594;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}
/* 
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
} */
   


.logoImgSize {
    width: 280px;
}
.font-size-20 {
    font-size: 20px !important;
}
/* .cardDark{
    background: linear-gradient(226deg, rgb(93 82 62), rgb(0 0 0));
} */
    .kaushan-script-regular {
    font-family: "Kaushan Script", cursive !important;
    font-weight: 400;
    font-size: 50px !important;
    }

    .tick {
        width: 80px;
        height: 80px;
        position: absolute;
        top: -40px;
        background: #000000;
        border: 5px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        left: 50%;
        transform: translateX(-50%);
    }
    .checkmark__circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 3;
        stroke-miterlimit: 10;
        stroke: #b4801c;
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: block;
        stroke-width: 3;
        stroke: #b4801c;
        stroke-miterlimit: 10;
        margin: 30px auto;
        box-shadow: inset 0px 0px 0px #7ac142;
        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }

    .checkmark__check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes scale {

        0%,
        100% {
            transform: none;
        }

        50% {
            transform: scale3d(1.1, 1.1, 1);
        }
    }

    @keyframes fill {
        100% {
            box-shadow: inset 0px 0px 0px 30px #00000000;
        }
    }



    .animateCard:before {
            content: "";
            position: absolute;
            left: -50%;
            height: 3px;
            width: 40%;
            background-color: rgb(var(--v-theme-secondary)) !important;
            -webkit-animation: lineAnim 2s linear infinite;
            -moz-animation: lineAnim 2s linear infinite;
            animation: lineAnim 2s linear infinite;
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            border-radius: 20px;
            bottom: 0;
        }

        @keyframes lineAnim {
            0% {
                left: -40%;
            }
            50% {
                left: 20%;
                width: 80%;
            }
            100% {
                left: 100%;
                width: 100%;
            }
        }
</style>