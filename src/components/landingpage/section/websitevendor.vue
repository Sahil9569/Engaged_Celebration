<script setup lang="ts">
import { ref, computed } from 'vue';
import { Carousel, Slide } from "vue3-carousel";
import axios from '@/stores/axios'
import BASE_URL from '@/stores/myVar';
/*vendor business image Section*/
import review1 from '@/assets/images/customer/makeUp.png';
import review2 from '@/assets/images/customer/photography.webp';
import review3 from '@/assets/images/customer/catering.jpg';
import review4 from '@/assets/images/wedding/decorate.jpg';
/*vendor business image Section*/
import vendorimg from '@/assets/images/profile/defaultuserimg.png';
const vendorprofilecard = ref([]);
const vendorrating = ref(5);
/*Vendor Slider*/
const vendorSettings = {
    snapAlign: "start",
    // itemsToShow: 1,
    slideToShow: 1,
};
const vendorBreakpoints = {
    310: { itemsToShow: 1, snapAlign: 'start'},
    767: { itemsToShow: 2, snapAlign: 'start' },
    1024: { itemsToShow: 3, snapAlign: 'start' },
    1200: { itemsToShow: 4, snapAlign: 'start' },
    1300: { itemsToShow: 5, snapAlign: 'start' },
};
const carouselRef = ref(null);
const nextSlide = () => {   carouselRef.value && carouselRef.value.next();  };
const prevSlide = () => {   carouselRef.value && carouselRef.value.prev();  };

(async function () {
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({fvn:''})}`)
    vendorprofilecard.value = response.data.feat_vend.map((a:any) => ({ 
        avatar          : (a.avatar) ? BASE_URL + a.avatar : vendorimg,
        businesscover   : BASE_URL + a.businesscover,
        vendornamecard  : a.vendornamecard,
        businessname    : a.businessname,
        link            : a.link,
        cities          : a.cities,
        // location        : a.location,
        category        : a.category,
    }))
})();

</script>

<template>
    <v-container>
        <v-row>
            <div class="v-col v-col-12 pt-8 position-relative" bis_skin_checked="1">

                <v-row v-if="vendorprofilecard.length > 0">
                    <v-col cols="12">
                        <carousel ref="carouselRef" :settings="vendorSettings" :breakpoints="vendorBreakpoints"
                            class="overflow-hidden">
                            <slide v-for="card in vendorprofilecard" :key="card.title">


                                <router-link :to="card.link" class=" link-sec ma-2 text-decoration-none h-100">
                                    <div class="vendors-section position-relative">
                                        <div class="vendorsimg-section">
                                            <v-img :src="card.businesscover" height="320px" cover
                                                class="rounded align-end text-right">
                                            </v-img>
                                            <v-avatar size="80"
                                                class="mt-n7 mx-6 text-start profile-im position-relative">
                                                <img :src="card.avatar" alt="icon" height="80" />
                                            </v-avatar>
                                        </div>

                                        <div class="vendorstext-section">

                                            <v-card elevation="10" rounded="md" class="vendor-cr h-100"
                                                style="position:static;">
                                                <div class="text-start">

                                                    <v-card-item class="px-3 pt-4 pb-3 ratingcard">
                                                        <div class="rat_ing">
                                                            <div class="d-flex">

                                                                <div class="content-cr">
                                                                    <h5 class="text-h5 text-13 mb-0">{{
                                                                        card.vendornamecard }}</h5>
                                                                    <h6 class="text-body-2 text-13"><span
                                                                            class="titleCardShrt">Business Name:
                                                                        </span><span class="font-weight-semibold">
                                                                            {{card.businessname }}</span></h6>
                                                                    <h6 class="text-body-2 text-13"><span
                                                                            class="titleCardShrt">Category: </span><span
                                                                            class="font-weight-semibold">
                                                                            {{card.category }}</span></h6>
                                                                    <!-- <h6 class="text-body-2 text-13"><span class="titleCardShrt">Cities: </span><span class="font-weight-semibold"> {{card.cities }}</span></h6> -->
                                                                </div>
                                                                <!-- <div class="rating-vr"> <v-rating half-increments disabled v-model="vendorrating"  size="small" density="compact" color="warning"></v-rating> </div>   -->
                                                            </div>
                                                        </div>

                                                    </v-card-item>
                                                </div>
                                            </v-card>
                                        </div>

                                    </div>

                                </router-link>

                            </slide>
                        </carousel>
                        <div class="carousel-arrows ctm_crousel arrowCarouselCustom">
                            <button @click="prevSlide" class="arrow-button prev">

                                <span>
                                    <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                                        </g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                                fill="#b4801c"></path>
                                        </g>
                                    </svg>
                                </span>
                            </button>
                            <button @click="nextSlide" class="arrow-button next">
                                <span>
                                    <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                                        </g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                fill="#b4801c"></path>
                                        </g>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </v-col>
                </v-row>
                <v-row v-else> 
                    <v-col cols="12">

                            <v-card elevation="10" rounded="md" class="coming_card">

                                    <v-card-item class="px-3 py-8">

                                        <div class="coming-soon text-center">
                                            <h2 class="text-center sailFont ctm_h2 text-black font-weight-bold"> Coming Soon!</h2>
                                            <p>The most popular vendors are on the way. Stay tuned for amazing offers!</p>
                                            
                                        </div>
                                    </v-card-item>
                            
                            </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-row>
        
    </v-container>
</template>

<style>
.website-vendor .carousel__track{
    position: relative;
}
.link-sec{
    width:100% !important;
}

.vendors-section {
    transition: width 0.38s ease;
    overflow: hidden;
    width: 100%;
}

.rat_ing {
    transition: transform 0.99s ease;
}

.vendor-cr {
    width: 100%;
    transition: all 0.3s linear;
}

.content-cr h6 {
    display:flex;
    margin-top:5px;
}
.titleCardShrt{
    white-space:nowrap;
    line-height:1.2;
    padding-right:3px;
}
.content-cr h6 > .font-weight-semibold{
    line-height:1.2;
}
.ratingcard {
    position: absolute;
    background: aliceblue;
    border-radius: 9px;
    left: 10px;
    width: calc(100% - 20px);
    transition: 0.38s;
    animation: fadeIn 0.5s ease;
}

.profile-im {
    top: -16px;
}
.vendor-cr {
    background: transparent;
    box-shadow: none !important;
}
.content-cr {
    width: calc(100% - 20px);
}
.rating-vr {
    text-align: end;
    width:20px;
}
.rating-vr .v-rating{
    display:block
}
.rating-vr .v-rating__wrapper{
    display:block;
}
.profile-im > img{
    width:100%;
    height:100%;
    object-fit:cover;
}
.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
}
.ctm_crousel button.arrow-button span {
    display: flex;
    background: #fff;
    width: 30px;
    height: 47px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
}
.carousel-arrows.arrowCarouselCustom button.arrow-button.prev, 
.arrowCarouselCustom.carousel-arrows button.arrow-button.next {
    height: 50px !important;
    width: 30px !important;
}
.carousel-arrows.arrowCarouselCustom button.arrow-button.prev{
    left:2px!important;
}
.carousel-arrows.arrowCarouselCustom button.arrow-button.next {
    right:2px!important;
}
.coming_card{
    background-color: #f0f8ff;
    background-image: url(/src/assets/images/website/hero-bg.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
}
.coming_card:after {
    content: "";
    display: block;
    background: rgba(255, 255, 255, 0);
    border: 2px solid rgba(255, 248, 255, 0.431372549);
    border-radius: 10px;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    position: absolute;
}
@media (min-width:1200px){
    .website-vendor .carousel__slide {
        transform: translateZ(0); 
        width: 100% !important;
        max-width: 20% !important;
        transition: max-width 0.38s;
    }
    .website-vendor .carousel__slide:hover{
        max-width: 35% !important;
        min-width: 400px;
    }
   
    .ratingcard {
        left: -100%;
        transform:translateX(-100%);
    }
    .vendors-section:hover .ratingcard{
        position: absolute;
        background: aliceblue;
        border-radius: 9px;
        left: 10px;
        top: 15%;
        transform:translateX(0%);
        transition-delay: 0.2s; /* Delay transition */
    }
    .vendor-cr {
        width: 100%;
        transition: all 0.3s linear;
        opacity: 0; 
    }

    .vendors-section:hover .vendor-cr{
        opacity: 1;
    }
    .vendors-section {
        transition: width 0.38s ease;
        overflow: hidden;
        width: auto;
    }
    .vendors-section:hover{
        width: 100%; 
    }
    
    .rat_ing {
        transition: transform 0.99s ease;
        transform: translateX(-100%);
        opacity: 0;
    }
    .vendors-section:hover .rat_ing{
        transform: translateX(0px);
        opacity: 1;
    }
    .vendors-section .ratingcard{
        position: absolute;
        background: aliceblue;
        border-radius: 9px;
        left: 10px;
        top: 15%;
        transform:translateX(0%);
        transition-delay: 0.2s;
    }
}
@media (max-width:1199px){
    .vendors-section .ratingcard{
        bottom: calc(10% - -80px);
    }
    .website-vendor .carousel__slide {
        transform: translateZ(0); 
        transition: max-width 0.38s;
    }

    .vendor-cr {
        width: 100%;
        transition: all 0.3s linear;
        opacity: 1; 
    }
    .vendors-section {
        transition: width 0.38s ease;
        overflow: hidden;
        width: 100%;
    }
    .rat_ing {
        transition: transform 0.99s ease;
        transform: translateX(0%);
        opacity: 1;
    }
    .rat_ing > .d-flex{
        flex-wrap: wrap;
    }
    .rating-vr{
        order:1;
        width:100%;
    }
    .rating-vr > .v-rating{
        display:flex;
    }
    .content-cr{
        order:2;
        width:100%;
    }
}

@media (min-width:575px) and (max-width:990px){
    /* .website-vendor .carousel__slide {
        max-width: 33% !important;
    }
    .website-vendor .carousel__slide:hover{
        max-width: 44% !important;
        min-width: 360px;
    } */
}
@media (min-width:320px) and (max-width:574px){
    /* .website-vendor .carousel__slide {
        max-width: 50% !important;
    }
    .website-vendor .carousel__slide:hover{
        max-width: 65% !important;
        min-width: 300px;
    } */
}
</style>