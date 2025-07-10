<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue'
import Footer from '@/components/landingpage/layout/Footer.vue';
import LogoLight from "@/assets/images/logos/Logo-a13.png";





</script>

<template>
    <Header />

    <div class="h-100 bg-white py-14 my-10">
        <!-- <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div> -->
        <v-row class="justify-center align-center h-100">
            <v-col cols="5">
                <!-- <div class="d-flex justify-center pb-14">
                    <img :src="LogoLight" class="logoImgSize">
                </div> -->
                <v-card elevation="10" class="border ctm-thankyou mb-5">
                    <v-card-item>
                        <div class="tick">
                            <svg class="checkmarkk" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <div class="pt-14 pb-10">
                            <h1 class="text-body-2 text-center kaushan-script-regularnew mb-4 text-primary">Thank You for Choosing Us!</h1>
                            <!-- <h3 class="text-h5 text-center mb-0">For Your Purchase</h3> -->
                            <p class="text-body-1 mb-6 text-13 text-center font-weight-medium text-white"> Embark on an unforgettable journey as we create the event of your dreams; please sign up or log in to continue your booking.</p>
                            <div class="text-center mt-5 mb-5">
                                <v-btn color="primary" to="/register?as=customer"  class="mt-4 mt-sm-0 rounded-sm" >Click here Sign-up</v-btn>
                                <p class="text-white text-body-1 mt-2">Have an account?
                                    <router-link to="/login" class="text-primary">
                                        Sign In
                                    </router-link>
                                </p>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>
                <!-- <v-card elevation="10" class="bg-grey200 border">
                    <v-card-item class="text-center">
                        <v-btn size="large" color="primary" class="rounded-sm">
                            Connect with stripe
                        </v-btn>
                    </v-card-item>
                </v-card> -->
            </v-col>
        </v-row>
    </div>

    <Footer />
</template>
<style>
 @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');


.kaushan-script-regularnew {
  font-family: "Kaushan Script", cursive !important;
  font-weight: 400;
  font-size: 25px !important;
}


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


.checkmarkk {
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

    .checkmarkk {
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