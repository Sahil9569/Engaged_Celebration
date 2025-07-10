<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue'
import Footer from '@/components/landingpage/layout/Footer.vue';
import { Carousel, Slide } from "vue3-carousel";
import { Calendar } from '@progress/kendo-vue-dateinputs';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
import type { Settings } from 'v-slick-carousel'

import WebsitePackages from '@/components/landingpage/section/website-packeges.vue';

import { useMeta } from 'vue-meta';
useMeta({
  title: 'my customer page',
  meta: [
    { name: 'description', content: 'my customer page content' },
    { property: 'og:title', content: 'my customer page MySite' },
    // add other tags as needed
  ]
});


const settingsss: Settings = {
    arrows: false,
    dots: false,
    infinite: true, 
    groupsToShow: 5, 
    groupsToScroll: 1,
    slidesPerGroup: 1,
    swipe: true, 
    swipeToSlide: true,
    ignorePrefersReducedMotion: true,
    autoplay: true,
    autoplaySpeed: 500, 
    speed: 1500,
    cssEase: 'ease-in-out', 
  "responsive": [
    {
      "breakpoint": 480,
      "settings": {
        "groupsToShow": 1
      }
    },
    {
      "breakpoint": 680,
      "settings": {
        "groupsToShow": 2
      }
    },
    {
      "breakpoint": 1080,
      "settings": {
        "groupsToShow": 3
      }
    },
    {
      "breakpoint": 1400,
      "settings": {
        "groupsToShow": 5
      }
    }
  ]
}


const imageUrl      = ref()
const imageUrl1      = ref()
const imageUrl2      = ref()
const imageUrl3      = ref()
const tcontent     = ref({});
(async function(){
    let apple = 'get to know us,all vendors,most popular vendor packages,packages,couple banner video'
    const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'customer'})}`)
    if (response.data.status=="SENT"){
        apple.split(',').forEach((i:any)=>{
            var data = response.data.data.find((a:any)=>(a.section.section == i))
            console.log('Customer data---',data)
            if (data) { tcontent.value[i] = {imageUrl:data.image1,imageUrl1:data.image2,imageUrl2:data.image3,imageUrl3:data.image4,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs, bvideo:data.bvideo} }
        })
    }
})();



const clickFunModal = (item: any) => { item.dialog = true }
const selectedDate = ref([]);
const clickFunModalbookin = (item: any) => { item.dialogbooking = true }
/*User Review Section*/
import review1 from '@/assets/images/customer/bakers.jpg';

import 'aos/dist/aos.css';
import AOS from 'aos';
onMounted(() => { AOS.init(); });
const page = ref({ title: 'For Couple' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/'
    },
    {
        text: 'For Couple',
        disabled: true,
        href: '#'
    }
]);
const userReview = ref([]);
/*Vendor Slider*/


/*Vendor category Slider*/
const vendorslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 3, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,
};
const vendorslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 3 },
    2200: { itemsToShow: 4 },
};
const carouselfirstRef = ref(null);
const nextfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.next(); };
const prevfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.prev(); };
/*--second slider button --*/
const carouselsecondRef = ref(null);
const nextsecondSlide = () => { carouselsecondRef.value && carouselsecondRef.value.next(); };
const prevsecondSlide = () => { carouselsecondRef.value && carouselsecondRef.value.prev(); };
/*--Third slider button --*/
const carouselthirdRef = ref(null);
const nextthirdSlide = () => { carouselthirdRef.value && carouselthirdRef.value.next(); };
const prevthirdSlide = () => { carouselthirdRef.value && carouselthirdRef.value.prev(); };
const rating = ref(5);
const wishList = ref(true)
const fucToggle = () => { wishList.value = !wishList.value }


const bookingData = ref([]);

(async function(){
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({cat:'', pvn:''})}`)
    if (response.data.status == "SENT"){
        userReview.value = response.data.cats.map((a:any)=>({
            titles:a.name,
            img: (a.pic) ? BASE_URL + a.pic : review1,
            title: a.name,
            packages_count: a.packages_count,
            link: `/allpackagelisting?cat=${a.id}`,
        }))
        bookingData.value = response.data.popular_ven.map((a:any)=>({
            id: a.id,
            vid: a.vendor.id,
            serviceservice: a.name,
            category: a.category.name,
            vendorserviceimg: BASE_URL + a.package_logo,
            serviceprovidername: a.vendor.business_name,
            vendorserviceprice: `${a.price}`,
            vendorname: a.vendor.userprofile.fullname,
            vendortype: `${a.vendor.v_role} Vendor`,
            rating: a.iratings,
            vlink: "/cpackage_pub/" + a.id,
            link: "/cpackage_pub/" + a.id + "?booknow",
            deposit: a.advance_payment,
            cities: a.cities.map((a:any)=>(a.city)).join(', '),
            states: a.states.map((a:any)=>(a.state)).join(', '),
        }))
    }
})();



const fullpageloader        = ref(false)
const myerrors              = ref('');
const showSuccessMessage    = ref(false);
const showErrorMessage      = ref(false);
const name                  = ref();
const email_id              = ref();
const phone_no              = ref();
const msg                   = ref();
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
      const response = await axios.post(`/home/send_inquiry`, formData);
      if (response.data.status == 'SAVED') {
          myerrors.value="Your enquiry sent successfully!"
          showSuccessMessage.value    = true;
          setTimeout(() => {showSuccessMessage.value=false;}, 3000);
         
          setTimeout(() => { window.location.reload();}, 1200);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

    
</script>

<template>
    <!--Header-->
    <Header />
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
    <div class="position-relative">
        <v-card class="elevation-0 rounded-md mb-8 bgvideo">
            <div class="background-video">
               <!-- <video autoplay loop muted v-if="tcontent['couple banner video']?.bvideo">
                 <source :src="BASE_URL + tcontent['couple banner video']?.bvideo.video" type="video/mp4">
               </video> -->
               <video v-if="tcontent['get to know us']?.bvideo" autoplay loop muted>
                 <source :src="BASE_URL + tcontent['get to know us']?.bvideo.video" type="video/mp4">
               </video>

               <video v-else autoplay loop muted>
                 <source src="@/assets/images/website/file_bg.mp4" type="video/mp4">
               </video>
              </div>
            <div class="px-8 py-8 py-lg-0 justify-center">
                <div class="justify-space-between">
                    <div class="py-0 align-center position-relative">
                        <div class='position-absolute for_couple'>
                            <h3 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}</h3>
                            <v-breadcrumbs :items="breadcrumbs"
                                class="text-h6 font-weight-medium pa-0 justify-center">
                                <template v-slot:divider>
                                    <div class="align-center text-h3 mt-n4 text-white">.</div>
                                </template>
                                <template v-slot:title="{ item }">
                                    <h6 class="text-white">{{ item.title }}</h6>
                                </template>
                            </v-breadcrumbs>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>

<!-- for couple code start -->

    <!-- All Packages List -->
    <div>
        <v-container class="maxWidth " id="demos">
                <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500" class="">
                        <div class="text-center">
                            <span class="text-secondary about_heading font-weight-bold">Packages</span>
                            <h2 v-if="tcontent['packages']" class="text-center sailFont ctm_h2 text-black font-weight-bold">{{tcontent['packages']?.title}}</h2>
                            <h2 v-else class="text-center sailFont ctm_h2 text-black font-weight-bold">
                                Our <span class="">Packages</span>
                            </h2>
                        </div>

                    </v-col>
                </v-row>
            </v-container>
        <v-container class="container-width">
            <WebsitePackages />
            
        </v-container>
    </div>

    <div class="for-couple mt-1">
        <v-container class="container-width">
                <v-card class="elevation-0 rounded-md mb-8">
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center pt-12">
                            <div class="ms-auto">
                                <div class="mt-8 mt-lg-0 pe-4">
                                    <span class="about_heading font-weight-bold"> Get To Know Us  </span>
                                    <h2 class="pt-2 font-weight-bold sailFont ctm_h2 for-heading" data-aos="fade-up"
                                        data-aos-duration="500">
                                        {{tcontent['get to know us']?.title}}<span class="text-primary">{{tcontent['get to know us']?.ctitle}}</span>
                                    </h2>
                                
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="about-right customerpara w-100" bis_skin_checked="1">
                                <p class="pt-16 mt-1 pb-4 p_text for-text font-weight-regular" data-aos="fade-up"  data-aos-duration="800">
                                    {{ tcontent['get to know us']?.content }}
                                </p>
                                
                            </div>
        
                        </v-col>
                    </v-row>    
                     
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center py-8">
                            <div class="">
                                <div class="mt-1 mt-lg-0 pe-4 couple-left">
                                    
                                    <img v-if="tcontent['get to know us']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['get to know us']?.imageUrl" class="w-100 scr-image">

                                    <img v-else src="@/assets/images/website/insta-9.jpg" alt="">
                                
                                </div>
                            </div>
        
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="ms-auto">
                                <div class="pe-4 cplim cpl_imgcst">
                                    
                                    <img v-if="tcontent['get to know us']?.imageUrl1"  @wheel="handleWheel" :src="BASE_URL + tcontent['get to know us']?.imageUrl1" class="w-100 scr-image">
                                    <img   v-else src="@/assets/images/website/couple-bgg.png" alt="">
                                
                               </div>
                               <div class="d-flex">
                                 <div class="mt-4 mt-lg-0 pe-4 cpl-im">
                                   
                                    <img v-if="tcontent['get to know us']?.imageUrl2"   @wheel="handleWheel" :src="BASE_URL + tcontent['get to know us']?.imageUrl2" class="w-100 scr-image">
                                     <img v-else src="@/assets/images/website/couple-bg-imgs.png" alt="">
                                
                                 </div>
                                 <div class="mt-4 mt-lg-0 pe-4 cpl-im">
                                   <div class="bg-couple">
                                     
                                        <img v-if="tcontent['get to know us']?.imageUrl3"    @wheel="handleWheel" :src="BASE_URL + tcontent['get to know us']?.imageUrl3" class="w-100 scr-image">
                                        <img v-else src="@/assets/images/website/heart-imgs.png" alt="">
                                        <p> "Life's a dance you learn as you go, sometimes you lead sometimes you follow, don't worry about what you don't know" </p>
                                   </div>
                                
                                 </div>
                                </div>
                            </div>           
                        </v-col>
                    </v-row>
                </v-card>
        </v-container>
    </div>
    
    <!-- vendor category code start -->
    <div class="vendorct-list">
        <v-container class="container-width">
            <v-row>
                <v-col cols="12 py-0 px-8">
                    <!-- <div class="section-title" bis_skin_checked="1">
                        <img src="@/assets/images/website/section-title.png" alt="">
                    </div> -->
                    <span class="about_heading font-weight-bold"> All Vendors </span>
                    <h2 class="text-h2 sailFont pt-3 ri-font-size-2 text-sm-start line-height-1-5"> {{tcontent['all vendors']?.title}}<span class="text-primary">{{tcontent['all vendors']?.ctitle}}</span></h2>
                    <!-- <p class="text-13 text-body-1 text-white text-center text-sm-start">Exceptional Service, Every
                        Vendor,
                        Every Time</p> -->
                </v-col>
            </v-row>
            
            

          
            <v-row>
                <div class="v-col v-col-12 position-relative" bis_skin_checked="1">
                    <v-row>
                        
                        <v-col cols="12">
                            <div class="carousel customAutoslider">
                                <VSlickCarousel v-bind="settingsss">
                                    <div v-for="card in userReview" :key="card.img">
                                        <router-link :to="card.link" class="w-100 ma-2 text-decoration-none">
                                            <v-card elevation="10"
                                                class="ma-4 vendor-card-background vendor-category-card  d-flex align-end overflow-hidden"
                                                :style="{ backgroundImage: `url(${card.img})` }">
                                                <div class="fplogo"><h2 class="text-subtitle-1 font-weight-semibold text-white">
                                                    {{ card.titles }}</h2></div>
            
                                                <div class="pa-6 text-left text-white fptext position-relative">
                                                    <h3
                                                        class="text-subtitle-1 mb-2 text-center font-weight-semibold text-black">
                                                        {{ card.title }}
                                                    </h3>
                                                    <p class="text-subtitle-2  text-center font-weight-semibold text-black">
                                                        ({{ card.packages_count }})
                                                    </p>
                                                </div>
                                            </v-card>
                                        </router-link>

                                    </div>
                                </VSlickCarousel>

                            </div>
                            
                        </v-col>
                    </v-row>
                </div>
            </v-row>
        </v-container>
        <!-- top decorator code satrt here -->
        <v-container class="container-width">
            <v-row class="py-6">
                <v-col cols="12 py-0 px-8">

                    <!-- <div class="section-title" bis_skin_checked="1">
                        <img src="@/assets/images/website/section-title.png" alt="">
                    </div> -->
                    <span class="about_heading font-weight-bold mb-4"> Most popular vendor packages </span>
                    <h3 class="text-h2 pb-0 mb-0 font-weight-bold ri-font-size-2 line-height-1-5 text-sm-start">{{tcontent['most popular vendor packages']?.title}}<span class="text-primary">{{tcontent['most popular vendor packages']?.ctitle}}</span>
                    </h3>
                    <!-- <p class="text-13 text-body-1 text-white text-center text-sm-start">Choosing the Perfect
                        Decorators
                        for Your Wedding</p> -->
                </v-col>
                <v-col cols="12" class="position-relative">
                    <carousel ref="carouselfirstRef" :settings="vendorslideSettings"
                        :breakpoints="vendorslideBreakpoints" class="overflow-hidden slider-reset row">
                        <slide v-for="item in bookingData" :key="item.vendorname" class="pt-2 pb-5 px-2">
                            <v-card class="customer-card vendor-card-hover">
                                <v-card-item class="pa-4">
                                    <router-link :to="`/cpackage_pub/${item.id}`" class="w-100 text-decoration-none position-relative">
                                    <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                            <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                        <v-avatar class="bg-lighterror wishlist-icon" size="28" @click="fucToggle">
                                            <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'" class="mdi text-error"></i>
                                        </v-avatar>
                                        <v-chip rounded="sm"
                                            class="ma-2 font-weight-semibold bg-secondary badge-service" size="small">
                                            <label>{{ item.serviceservice }}</label></v-chip>
                                    </div>
                                </router-link>
                                    <div class="top-ctsection">
                                    <div class="mt-2 w-100">
                                        <div class="d-flex justify-space-between">
                                            <v-rating half-increments v-model="item.rating" density="compact" color="warning" size="small" disabled></v-rating>
                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold text-black mt-1 text-start"> ${{ item.vendorserviceprice }}</h4>
                                        </div>
                                        <h4 class="text-subtitle-1 text-ellipsis font-weight-semibold text-black text-start"> {{ item.serviceservice }}</h4>
                                    </div>
                                    <div class="text-start">
                                        <h6 class="text-body-2  mb-0 mt-3 font-weight-semibold"><span class="font-weight-medium">Deposit :</span> ${{ parseInt(parseFloat(item.vendorserviceprice) * (parseFloat(item.deposit)/100)) }} ({{item.deposit}}%)</h6>
                                        <h6 class="text-body-2  mb-0 font-weight-semibold"><span class="font-weight-medium">Location :</span> {{ item.states }}</h6>
                                        <h6 class="text-body-2  mb-0 font-weight-semibold"><span class="font-weight-medium">Offered by :</span> {{ item.vendorname }} ({{ item.vendortype }})</h6>
                                        <!-- <h6 class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Name :</span> {{ item.serviceservice }}</h6>
                                        <h6 class="text-body-2 text-13"><span class="font-weight-semibold ">Vendor Type :</span> {{ item.vendortype }}</h6> -->

                                    </div>
                                    <v-row class="mt-2">
                                        <v-col>
                                            <v-btn color="secondary" variant="flat" class="d-block py-1" size="small" :to="item.link">
                                                <CalendarIcon stroke-width="1.5" size="18" class="mr-2" /> Book Now
                                            </v-btn>
                                        </v-col>
                                        <!-- <v-col>
                                            <v-btn color="secondary" variant="flat" class="d-block py-1" size="small" :to="item.vlink">
                                                <CalendarIcon stroke-width="1.5" size="18" class="mr-2" /> Send Enquiry
                                            </v-btn>
                                        </v-col> -->
                                        <v-col cols="6">
                                            <v-btn color="secondary" variant="flat" size="small" class="w-100 d-block"
                                                @click="clickFunModalbookin(item)">
                                                <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />Send Enquiry
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
                                                        <v-btn @click="send_inquiry('Package_User',item.vid)" flat class="submit_btn bg-dark text-white mb-5">Send An Enquiry</v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-dialog>
                                    </v-row>
                                </div>
                                </v-card-item>
                            </v-card>
                        </slide>
                    </carousel>
                    <div class="carousel-arrows ctm_crousel">
                        <button @click="prevfirstSlide" class="arrow-button prev">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                            fill="#b4801c"></path>
                                    </g>
                                </svg>
                            </span>
                        </button>
                        <button @click="nextfirstSlide" class="arrow-button next">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
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
        </v-container>

        <!-- call to action section -->
    
        <v-container>
            <section class="callto-action mt-5">
            <div class="calltoaction rounded">
                <div class="position-relative">
                  <img src="@/assets/images/website/work.png" class="workimg position-absolute">
                </div>
            <h2 class="text-center sailFont ctm_h2 font-weight-bold position-relative getst">
                Get Started <span class="text-secondary">Today!</span>
            </h2>
            <h4 class="text-center pt-5 pb-5 mx-auto" style="max-width:800px;">Get started today and let us help you turn your wedding vision into a stunning reality with our expert planning and personalized services.</h4>
            <div class="d-flex gap-3 justify-center flex-md-row flex-column align-center" data-aos="fade-up" data-aos-duration="1000">
                <v-btn  target="_blank" to="/register?as=customer" size="x-large" color="primary" variant="flat">
                    Hire a Vendor
                    </v-btn>
                    <v-btn  target="_blank"  to="/register?as=vendor" size="x-large" color="primary" variant="outlined">
                        Register as a Vendor
                    </v-btn>
            </div>
            </div>
        </section>
        </v-container>
 

    </div>
    <!-- vendor category code End -->

    <!--Footer-->
    <Footer />
    <!----------->
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";

.customlgbtn{
    border-color: #b4801c !important;
    color: #b4801c !important;
}
.custombtn{
    background: #b4801c !important; 
}

.calltoaction{
    padding: 85px 0 100px 0;
    border-radius: 45px !important;
    background: linear-gradient(62deg, #afdff2, #ffc8fe, #a9e4fa, #ffcdfe);
    animation:  gradient 15s ease infinite;
    background-size: 400% 400%;
    position: relative;
    top: 43px;
    z-index: 999;
}
@-webkit-keyframes gradient{
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
       background-position: 0% 50%;
    }
  }
  @keyframes gradient{
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
       background-position: 0% 50%;
    }
  }
.fplogo h2 {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-57%, -50%);
    z-index: 1;
    font-weight: 600 !important;
    letter-spacing: 0.1px !important;
    color: #fff !important;
    font-size: 16px !important;
    transition: all 0.3s;
}
.vendor-card-background:before {
    content: "";
    background-image: linear-gradient(201deg, #000000d4 24%, rgb(195 101 101) 80%) !important;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0.6;
}
.vendor-card-background:hover after{
    background-color: rgba(22, 22, 22, 0.3);
}

.fptext {
    background: #ebd2dd9c;
    top: 50%;
    left: 50%;
    padding: 51px 12px !important;
    display: none;
    font-size: 16px;
    position: absolute !important;
    text-align: center;
    color: #000 !important;
    transform: translate(-49%, -104%);
    border-radius: 50%;
    transition: all 0.3s ease 0s;
    width: 150px;
    z-index: 1;
    transform: translate(-50%, -50%);
    height: 150px;
}
.fptext p {
    margin: 0px;
}
.vendor-card-background:hover .fptext {
    display: block;
}
.vendor-card-background:hover {
    box-shadow: 0 0 0 14px rgb(255 154 255) inset !important; 
}
.vendor-card-background:hover .fplogo {
    display: none;
}
.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}


.vendor-category-card {
    border-radius: 50% !important;
    transition: all 0.3s ease 0s;
    width: 200px !important;
    min-height: 200px !important;
}
.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
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

.ctm_crousel button.arrow-button.next {
    right: 12px;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #b4801c;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-selected span.k-link,
.k-calendar .k-calendar-td.k-selected span.k-link:hover {
    background-color: #b4801c;
    color: #fff;
}
.for-heading {
    font-size: 42px;
    line-height: 1.3;
}
.cplim img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
}
.cplim {
    width: 100%;
    margin-top: -3px;
}
.couple-left img{
    margin: 0px 0 0 0;
    border-radius: 10px;
}
.cpl-im img {
    width: 100%;
    border-radius: 10px;
    margin-top: 20px;
    height: 94%;
    object-fit: cover;
}
.cpl-im {
    width: 50%;
}
.bg-couple{
    padding: 22px 30px 76px 30px;
    /* background-color: #FDF2F0; */
    font-size: 22px;
    animation: changeBackgroundColor 7s infinite;
    font-style: italic;
    line-height: 34px;
    text-align: center;
    margin-top: 20px;
    border-radius: 10px;
}
@keyframes changeBackgroundColor {
    0% {
        background-color: #fbeeff;
    }
    50% {
        background-color: #c6edff;
    }
    100% {
        background-color: #ffe2f7;
    }
}
.bg-couple img {
    width: 33%;
    padding-bottom: 20px;
}
.bg-couple p {
    font-size: 16px;
    line-height: 1.6;
}


.banner_content{
    z-index: 999;
}
.background-video {
    position: relative;
    max-height: 470px;
    min-height:100px;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

  .background-video::before{
    content: "";
    position: absolute;
    background-color: rgb(0 0 0 / 39%);
    z-index: 1; 
      top: 0;
      left: 0;
      width: 102%;
      height: 100%;
  }
  .banner_content{
      z-index: 999;
  }

   .for_couple {
    top: -279px;
    z-index: 999;
    left: 44%;
    }
    .for_couple a {
        color: #fff;
        z-index: 999;
        font-size: 18px;
    }
   .for_couple h3 {
        font-size: 55px;
    }
    .customer-slide .carousel__slide {
        width: 200px !important;
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
    .vendor-card-hover:hover .viewServiceBtn {
        opacity: 1;
        bottom: 100px !important;
    }
   .customer-card.vendor-card-hover {
        background: transparent;
        box-shadow: none;
   }
   .workimg {
    opacity: 0.8;
    width: 22%;
    top: -218px;
    left: 476px;
    animation-name: float-bob-y;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    -webkit-animation-name: float-bob-y;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-name: float-bob-y;
    -moz-animation-duration: 2s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-timing-function: linear;
    -ms-animation-name: float-bob-y;
    -ms-animation-duration: 2s;
    -ms-animation-iteration-count: infinite;
    -ms-animation-timing-function: linear;
    -o-animation-name: float-bob-y;
    -o-animation-duration: 2s;
    -o-animation-iteration-count: infinite;
    -o-animation-timing-function: linear;
}
@keyframes float-bob-y {
    
    0% {
        -webkit-transform: translateY(-20px);
        transform: translateY(-20px);
    }
    50% {
        -webkit-transform: translateY(-10px);
        transform: translateY(-10px);
    }
    100% {
        -webkit-transform: translateY(-20px);
        transform: translateY(-20px);
    }
}
@media screen and (min-width:960px) {
    .v-container {
        max-width: 1200px !important;
    }
}
.customAutoslider button.v-slick-arrow{
    z-index: 99;
    background: #000;
}



</style>