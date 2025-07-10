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


// onMounted(() => {
//     fullpageloader.value = true;
//     (async function(){
//         const sid       = route.query.sid
//         const tip       = route.query.tip
//         if (tip == 'subs'){
//             const response  = await axios.post('home/check_pay', {sid:route.query.sid, tip:route.query.tip}, {headers:{'Content-Type':'application/json'}, withCredentials:true})
//             console.log('response________', response.data)
//             if (response.data.status == 'VERIFIED'){

//                 fullpageloader.value = false;
//                 authStore.user = JSON.stringify(response.data.cuser);
//                 localStorage.setItem('user', JSON.stringify(response.data.cuser));
//                 localStorage.setItem('role', response.data.role);
//                 localStorage.setItem('vpack', response.data.vpack);
//                 localStorage.setItem('vpackname', response.data.vpackname);
                
//                 try{localStorage.setItem('access_token', response.data.access_token);}catch{}
//                 // to be removed after live

//                 console.log("verified_________________________________")
//                 // return router.push( ((localStorage.getItem('role') == "customer")) ? '/customer-dashboard' : '/onboard' );
//                 showSuccessMessage.value = true;
//                 myerrors.value = 'Vendor profile created successfully and password has been sent to your mail.';
//                 setTimeout(() => { showSuccessMessage.value = false; }, 6000);

//                 vid.value   =   response.data.vid
                
//             }
//             if (response.data.status == 'INVALID'){ vid.value   =   response.data.vid;  fullpageloader.value = false;  }
//             else{ fullpageloader.value = false; }
//         }
//     })();

// })




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
                                Excited to have you on board! Let's work together to make every wedding a magical and memorable celebration.
                            </p>
                            
                            <div class="d-sm-flex align-center justify-center gap-3 mt-5 mb-5">
                                <v-btn color="primary" class="rounded-sm"  variant="outlined" @click="questionone = true">Skip & go to dashboard</v-btn>
                                <v-btn color="primary"  class="mt-4 mt-sm-0 rounded-sm" to="/profile-settings">Complete your profile</v-btn>
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

/* .v-overlay__scrim{
    opacity: 0.9;
    background: rgb(255 255 255) !important;
} */
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