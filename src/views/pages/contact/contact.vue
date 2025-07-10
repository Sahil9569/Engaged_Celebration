<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import Banner from '@/components/landingpage/section/bannersection.vue';
import axios from '@/stores/axios';
import 'aos/dist/aos.css';
import AOS from 'aos';


import { useMeta } from 'vue-meta';
useMeta({
  title: 'my contactme page',
  meta: [
    { name: 'description', content: 'my contactme page content' },
    { property: 'og:title', content: 'my contactme page MySite' },
    // add other tags as needed
  ]
});

import addressicon from "@/assets/images/website/address.svg";
import callicon from "@/assets/images/website/call.svg";
import mailicon from "@/assets/images/website/mail.svg";
const tcontent     = ref({});
const agree = ref('false');

const facebook_or_vendors       = ref();
const twitter_or_couples        = ref();
const whatsapp                  = ref();
const pinterest                  = ref("");
const indeed                     = ref("");
const youtube                    = ref("");
const discord                    = ref("");
const tiktok                     = ref("");
const instgram                  = ref();





onMounted(() => {
      AOS.init();
      
      (async function(){
         let apple = 'contact detail,send a message'
         const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'contact'})}`)
         if (response.data.status=="SENT"){
            console.log('data-----//',response.data.footer_data)
            apple.split(',').forEach((i:any)=>{
               var data = response.data.data.find((a:any)=>(a.section.section == i))
               if (data) { tcontent.value[i] = {title:data.title, content:data.content, ctitle:data.ctitle, 
                  faqs:data.faqs.map((a:any, index:any)=>({question:a.question, answer:a.answer, icon:[addressicon, mailicon, callicon][index]})
               )}}



            })
            facebook_or_vendors.value   = response.data.footer_data['facebook_or_vendors']
            twitter_or_couples.value    = response.data.footer_data['twitter_or_couples']
            whatsapp.value              = response.data.footer_data['whatsapp']
            pinterest.value = response.data.footer_data['pinterest'];
            indeed.value = response.data.footer_data['indeed'];
            youtube.value = response.data.footer_data['youtube'];
            discord.value = response.data.footer_data['discord'];
            tiktok.value = response.data.footer_data['tiktok'];
            instgram.value              = response.data.footer_data['instgram']
         }
      })();
      
});

const page = ref({ title: 'Contact Us' });
const breadcrumbs = ref([
      {
         text: 'Home',
         disabled: false,
         href: '/'
      },
      {
         text: 'Contact',
         disabled: true,
         href: '#'
      }
]);

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


const fullpageloader = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage            = ref(false);

const checkboxdata = ref('termsLabel');
const name                       = ref();
const email_id                  = ref();
const phone_no                  = ref();
const msg                       = ref();
const showSuccess = ref(false);
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
async function send_inquiry(action = 'null') {
   // console.log('----value----',agree.value)
   // alert(agree.value)
   try {
      if (agree.value == 'false') {
         // console.log('-----New value-----',agree.value)
         showErrorMessage.value = true;
         myerrors.value = 'Please check the box to agree to receive text messages before proceeding.';
         setTimeout(() =>  { showErrorMessage.value = false; }, 3000);
        
      }
      else{

      const checkemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id.value)
      if (  !(name.value && email_id.value && phone_no.value && msg.value && checkemail && (phone_no.value.length == 10))){
         showErrorMessage.value = true;
         myerrors.value = 'Please fill all required fields!';
         setTimeout(() => { showErrorMessage.value = false; }, 3000);
         return null
      }
      if ( !( agree.value)){
         showErrorMessage.value = true;
         myerrors.value = 'Please check the box to agree to receive text messages before proceeding.';
         setTimeout(() =>  { showErrorMessage.value = false; }, 3000);
         return null
      }

      const formData = new FormData();
      formData.append("action", action);
      //  formData.append("receiver_email", receiver_email);
      formData.append("name", name.value);
      formData.append("email", email_id.value);
      formData.append("phone_no", phone_no.value);
      formData.append("msg", msg.value);
      
      fullpageloader.value = true;

      const response = await axios.post(`/home/send_inquiry`, formData, config);

      if (response.data.status === 'SAVED') {
         showSuccess.value = true;
         setTimeout(() => {
         showSuccess.value = false;
         }, 4000);
         // window.location.reload();
         name.value = "";
         email_id.value = "";
         phone_no.value = "";
         msg.value = "";
      }

   }

  } catch (error) {
    console.error("Error sending enquiry:", error);
  } finally {
    fullpageloader.value = false;
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
   <div class="lp-wraper">
      <!--Header-->
      <Header />
      <div class="position-relative mainbanner">
         <v-card class="elevation-0 rounded-md mb-8">
            <div class="px-8 py-8 py-lg-0 d-flex justify-center">
               <div class="d-flex justify-space-between">
                  <div class="d-flex py-0 align-center text-center">
                     <div>
                        <h3 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}</h3>
                        <v-breadcrumbs :items="breadcrumbs"
                           class="text-h6 font-weight-medium pa-0 d-flex justify-center">
                           <template v-slot:divider>
                              <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                           </template>
                           <template v-slot:title="{ item }">
                              <h6 class="text-white">{{ item.title }}</h6>
                           </template>
                        </v-breadcrumbs>
                        <div class="sideimgs">
                           <img src="@/assets/images/website/bg-remove.png">
                         </div>
                     </div>
                  </div>
               </div>
            </div>
         </v-card>
      </div>
      <div class="bg-color custom-form">
         <v-container class="position-relative z-custom container-width py-md-16 py-10">
            <v-row>
               <v-col cols="12" md="6">
                  <v-card class="bg-contact px-md-8 px-4 py-md-5 py-3 h-100" elevation="0">
                     <v-card-item>
                        <v-row>
                           <v-col cols="12" lg="12" sm="12" data-aos="fade-up" data-aos-duration="500">
                              <h2 class="mt-0 mb-1 text-white sailFont font_28 font-weight-bold">
                                 {{tcontent['contact detail']?.title}}<span class="text-primary">{{tcontent['contact detail']?.ctitle}}</span>
                              </h2>
                              <p class="mb-4 text-white">{{tcontent['contact detail']?.content}}</p>
                              <div class="contact-box" v-for="item in tcontent['contact detail']?.faqs" :key="item.question"   >
                                 <div class="contact-icon text-secondary">
                                    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                       stroke-linejoin="round"
                                       class="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                       <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                       <path d="M3 7l9 6l9 -6" />
                                    </svg> -->
                                    <img :src="item.icon">
                                 </div>
                                 <div class="contact-content">
                                    <h4 class="sailFont text-white">{{ item.question }}</h4>
                                    <p class="text-white">{{ item.answer }}</p>
                                 </div>
                              </div>
                              <!-- <div class="contact-box">
                                 <div class="contact-icon text-secondary">
                                    <img :src="addressicon" >
                                 </div>
                                 <div class="contact-content">
                                    <h4 class="sailFont text-white">Our Address</h4>
                                    <p class="text-white">Rubin Residence Hall, NY 10003, USA </p>
                                 </div>
                              </div>
                              <div class="contact-box">
                                 <div class="contact-icon text-secondary">
                                    <img :src="callicon" >
                                 </div>
                                 <div class="contact-content">
                                    <h4 class="sailFont text-white">Our Email</h4>
                                    <p class="text-white"> party@engagedcelebration.com</p>
                                 </div>
                              </div>
                              <div class="contact-box">
                                 <div class="contact-icon text-secondary">
                                    <img :src="mailicon" >
                                 </div>
                                 <div class="contact-content">
                                    <h4 class="sailFont text-white">Our Phone</h4>
                                    <p class="text-white">(757) 325-0583</p>
                                 </div>
                              </div> -->
                              <div>
                                 <ul class="d-flex social-icon social_contact flex-wrap">
                                    <li v-if="facebook_or_vendors" class="px-2 py-2">
                                    <a v-if="facebook_or_vendors" 
                                       :href="`https://www.facebook.com/${encodeURIComponent(facebook_or_vendors)}`" 
                                       target="_blank" 
                                       class="text-secondary">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-facebook">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                             <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                       </svg>
                                    </a>
                                    <a v-else href="https://www.facebook.com" target="_blank" class="text-secondary">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-facebook">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                             <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                       </svg>
                                    </a>
                                 </li>

                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-facebook">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                             <path
                                                d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                          </svg>
                                       </a>
                                    </li> -->

                                    <li v-if="twitter_or_couples" class="px-2 py-2">
                                    <a v-if="twitter_or_couples" 
                                       :href="`https://www.twitter.com/${encodeURIComponent(twitter_or_couples)}`" 
                                       target="_blank" 
                                       class="text-secondary">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                             <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                       </svg>
                                    </a>
                                    <a v-else href="https://www.twitter.com" target="_blank" class="text-secondary">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                             <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                       </svg>
                                    </a>
                                 </li>


                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="#fff" />
                                             <path
                                                d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                          </svg>
                                       </a>
                                    </li> -->

                                    <li v-if="instgram" class="px-2 py-2">
                                       <a v-if="instgram" 
                                          :href="`https://www.instagram.com/${encodeURIComponent(instgram)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                <path d="M16.5 7.5l0 .01" />
                                          </svg>
                                       </a>
                                       <a v-else href="https://www.instagram.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                <path d="M16.5 7.5l0 .01" />
                                          </svg>
                                       </a>
                                    </li>



                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
                                             <path stroke="none" d="M0 0h24v24H0z" fill="#fff" />
                                             <path
                                                d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                             <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                             <path d="M16.5 7.5l0 .01" />
                                          </svg>
                                       </a>
                                    </li> -->

                                    <li v-if="pinterest" class="px-2 py-2">
                                       <a v-if="pinterest" 
                                          :href="`https://www.pinterest.com/${encodeURIComponent(pinterest)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-pinterest">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M8 20l4 -9" />
                                                <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                          </svg>
                                       </a>
                                       <a v-else href="https://www.pinterest.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-pinterest">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M8 20l4 -9" />
                                                <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                          </svg>
                                       </a>
                                    </li>

                                    
                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-pinterest">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="#fff"/>
                                                <path d="M8 20l4 -9"/>
                                                <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"/>
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                                          </svg>
                                       </a>
                                    </li> -->

                                    <li v-if="indeed" class="px-2 py-2">
                                       <a v-if="indeed" 
                                          :href="`https://www.indeed.com/${encodeURIComponent(indeed)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 11v5"/>
                                                <path d="M8 8v.01"/>
                                                <path d="M12 16v-5"/>
                                                <path d="M16 16v-3a2 2 0 1 0 -4 0"/>
                                                <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/>
                                          </svg>
                                       </a>
                                       <a v-else href="https://www.indeed.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 11v5"/>
                                                <path d="M8 8v.01"/>
                                                <path d="M12 16v-5"/>
                                                <path d="M16 16v-3a2 2 0 1 0 -4 0"/>
                                                <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/>
                                          </svg>
                                       </a>
                                    </li>


                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 11v5"/>
                                                <path d="M8 8v.01"/>
                                                <path d="M12 16v-5"/>
                                                <path d="M16 16v-3a2 2 0 1 0 -4 0"/>
                                                <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/>
                                          </svg>
                                       </a>
                                    </li> -->


                                    <li v-if="youtube" class="px-2 py-2">
                                       <a v-if="youtube" 
                                          :href="`https://www.youtube.com/${encodeURIComponent(youtube)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"/>
                                                <path d="M10 9l5 3l-5 3z"/>
                                          </svg>
                                       </a>
                                       <a v-else href="https://www.youtube.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"/>
                                                <path d="M10 9l5 3l-5 3z"/>
                                          </svg>
                                       </a>
                                    </li>


                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"/>
                                                <path d="M10 9l5 3l-5 3z"/>
                                          </svg>
                                       </a>
                                    </li> -->


                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discord">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"/>
                                                <path d="M7 16.5c3.5 1 6.5 1 10 0"/>
                                          </svg>
                                       </a>
                                    </li> -->

                                    <li v-if="discord" class="px-2 py-2">
                                       <a v-if="discord" 
                                          :href="`https://discord.com/${encodeURIComponent(discord)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discord">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"/>
                                                <path d="M7 16.5c3.5 1 6.5 1 10 0"/>
                                          </svg>
                                       </a>
                                       <a v-else href="https://discord.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-discord">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                                <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"/>
                                                <path d="M7 16.5c3.5 1 6.5 1 10 0"/>
                                          </svg>
                                       </a>
                                    </li>


                                    <!-- aa -->
                                    <!-- <li class="px-2 py-2">
                                       <a href="#" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>
                                          </svg>
                                       </a>
                                    </li> -->
                                    <li v-if="tiktok" class="px-2 py-2">
                                       <a v-if="tiktok" 
                                          :href="`https://www.tiktok.com/${encodeURIComponent(tiktok)}`" 
                                          target="_blank" 
                                          class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>
                                          </svg>
                                       </a>
                                       <a v-else href="https://www.tiktok.com" target="_blank" class="text-secondary">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>
                                          </svg>
                                       </a>
                                    </li>




                                 </ul>
                              </div>
                           </v-col>
                        </v-row>
                     </v-card-item>
                  </v-card>
               </v-col>
               <v-col cols="12" md="6">
                  <v-card class="px-md-8 py-md-5 px-4 py-3 h-100" elevation="0">
                     <v-card-item>
                        
                        <v-row>
                           <v-col cols="12">
                              <v-row>
                                 <v-col cols="12" lg="12" sm="12" data-aos="fade-up" data-aos-duration="500">
                                    <h2 class="mt-0 mb-1 sailFont fontheading font-weight-bold">
                                       {{tcontent['send a message']?.title}}<span class="text-primary">{{tcontent['send a message']?.ctitle}}</span>
                                    </h2>
                                    <p class="mb-1">{{tcontent['send a message']?.content}}</p>
                                 </v-col>
                                 <v-col cols="6">
                                       <VTextField type="text" maxlength="50" v-model="name" placeholder="Name" hide-details  @keyup="checklength()"></VTextField>
                                 </v-col>
                                 <v-col cols="6">
                                       <VTextField type="email" maxlength="100" v-model="email_id" placeholder="Email" hide-details :rules="emailRules" @keyup="checklength()"></VTextField>
                                 </v-col>
                              </v-row>
                           </v-col>
                           <v-col cols="12">
                              <VTextField type="text" maxlength="10" v-model="phone_no" placeholder="Phone No" hide-details   :rules="phonenoRules" @keyup="checklength()"></VTextField>
                           </v-col>
                           <v-col cols="12" class="pa-0 pb-2">
                              <div class="d-flex gap-4 align-items-start">
                                 <v-checkbox
                                 v-model="agree"
                                 color="primary"
                                 id="agreeCheckbox"
                                 />
                                 <label for="agreeCheckbox">
                                    By checking this box I agree to receive SMS communication from Engaged Celebration.
                                    <router-link to="/privacy-policy" class="privacy-link">Privacy Policy</router-link>.
                                 </label>
                              </div>
                              
                           </v-col>

                           
                           <v-col cols="12">
                              <VTextarea v-model="msg" auto-grow placeholder="Message" rows="5" color="primary" row-height="25" shaped
                                 hide-details></VTextarea>
                           </v-col>
                           
                           <v-col cols="12" v-if="showSuccess">
                              <v-alert type="success" variant="flat" density="compact" class="py-3 d-flex align-center">
                                 <template v-slot:prepend>
                                       <v-icon size="20">mdi-checkbox-marked-circle-outline</v-icon>
                                 </template>
                                 <div>Your enquiry sent successfully!</div>
                              </v-alert>
                           </v-col>
                           <v-col cols="12" class="text-start">
                              <v-btn @click="send_inquiry('Platform_Admin')" flat color="primary" class="submit_btn text-white mb-5">Send An enquiry</v-btn>
                           </v-col>

                           
                           
                     </v-row>
                     </v-card-item>
                  </v-card>

               </v-col>
            </v-row>
         </v-container>
      </div>
      <!-- <div class="map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.933267627407!2d-76.39713518913075!3d36.98752605700253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89ba9cf109e41565%3A0x1da11bb506cf05a!2s65%20Buxton%20Ave%2C%20Newport%20News%2C%20VA%2023607%2C%20USA!5e0!3m2!1sen!2sin!4v1728279839324!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div> -->
      <Footer />
   </div>
</template>
<style lang="scss" scoped>
.sideimgs img {
   width: 60%;
}
.sideimgs {
   position: absolute;
   top: -67px;
   right: -119px;
}
   .map{
   margin-bottom: -5px;
   }
   .bg-contact{
      background: linear-gradient(45deg, #6573ff, rgb(209 137 188 / 82%), #6a79e6, #b9a9fa, #6775e0, #707ce2);
      background-size: 600% 100%;
   }
   .contact-icon svg {
      position: absolute;
      left: 9px;
      top: 9px;
      height: 24px;
      width: 24px;
  }

  .contact-icon{
      background: #fff;
      border-radius: 50%;
      padding: 10px;
      height: 41px;
      width: 41px;
      position: relative;
  }
  .contact-icon {
      background: #fff;
      border-radius: 50%;
      padding: 10px;
      height: 41px;
      width: 41px;
  }
  .contact-icon img{
      width : 20px;
      height : 20px;
  }
</style>