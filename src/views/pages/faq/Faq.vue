<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';


import { useMeta } from 'vue-meta';
useMeta({
  title: 'my faqqqqqqq page',
  meta: [
    { name: 'description', content: 'my faqqqqqqq page content' },
    { property: 'og:title', content: 'my faqqqqqqq page MySite' },
    // add other tags as needed
  ]
});


const imageUrl      = ref()
const imageUrl1      = ref()

const tcontent     = ref({});
(async function(){
   let apple = 'faqven,faqcst'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'faq'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
        //  if (data) { tcontent.value.push({imageUrl:data.image1,imageUrl1:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}) }
        if (data) {tcontent.value[i] = {imageUrl:data.image1,imageUrl1:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}}
      })
   }
})();


// const faqPage =  ref([
//     {
//         question: 'What does a wedding planner do?',
//         answer: 'A wedding planner is a professional who assists couples in planning and executing their wedding day. They can help with everything from venue selection and vendor coordination to budget management and timeline creation.'
//     },
//     {
//         question: 'Why should I hire a wedding planner?',
//         answer: 'Hiring a wedding planner can save you time, reduce stress, and ensure that your special day runs smoothly. They bring expertise, industry connections, and creative ideas to help bring your vision to life while staying within your budget.'
//     },
//     {
//         question: 'How far in advance should I book a wedding planner?',
//         answer: 'Its advisable to book your wedding planner as soon as you have a date and venue secured. Popular wedding planners may get booked up quickly, especially during peak wedding season, so booking early ensures you get the best choice.'
//     },
//     {
//         question: 'What is the cost of hiring a wedding planner?',
//         answer: 'The cost of hiring a wedding planner varies depending on factors such as their experience, location, and the level of service you require. Wedding planners typically offer a range of packages to suit different budgets, from full-service planning to day-of coordination.'
//     },
//     {
//         question: 'Do wedding planners only work with certain vendors?',
//         answer: 'While some wedding planners may have preferred vendors they frequently work with, they should be open to considering any vendors that align with your vision and budget. Ultimately, the choice of vendors should be yours.'
//     }
// ]);

// const customer =  ref([
//     {
//         question: 'What services do you offer, and what is included in your packages?',
//         answer: 'We offer comprehensive wedding planning services tailored to your needs. Our packages typically include venue selection, vendor coordination, budget management, timeline creation, and day-of coordination.'
//     },
//     {
//         question: 'Can you help us stay within our budget?',
//         answer: 'Absolutely. We understand the importance of budget management. We work closely with you to prioritize expenses, negotiate with vendors, and find creative solutions to keep costs in check while still achieving your vision.'
//     },
//     {
//         question: 'How do you handle vendor selection and coordination?',
//         answer: 'We have an extensive network of trusted vendors that we recommend based on your preferences and budget. We handle all communication with vendors, negotiate contracts, and ensure seamless coordination leading up to and on the wedding day.'
//     },
//     {
//         question: 'Do you assist with venue selection?',
//         answer: 'Yes, we can help you find the perfect venue that aligns with your vision, guest count, and budget. Well schedule site visits, negotiate contracts, and assist with any logistical considerations.'
//     },
//     {
//         question: 'Can you provide recommendations for other wedding professionals, such as photographers, florists, and caterers?',
//         answer: 'Absolutely. We have established relationships with top-quality vendors in the industry and can recommend photographers, florists, caterers, and other professionals who match your style and preferences.'
//     }
// ]);

// theme breadcrumb
const page = ref({ title: 'Frequently Asked Question ' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/'
    },
    {
        text: 'FAQ',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <div class="lp-wraper">
      <!--Header-->
      <Header />
      <div class="position-relative mainbanner">
         <v-card class="elevation-0 rounded-md mb-8">
            <div class="px-8 py-8 py-lg-0 d-flex justify-center">
               <div class="d-flex justify-space-between">
                  <div class="d-flex py-0 align-center">
                     <div>
                        <h3 class="ctm_h2 mb-2 text-white text-center sailFont">{{ page.title }}</h3>
                        <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-medium pa-0 d-flex justify-center">
                           <template v-slot:divider>
                              <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                           </template>
                           <template v-slot:title="{ item }">
                              <h6 class="text-white">{{ item.title }}</h6>
                           </template>
                        </v-breadcrumbs>
                        <div class="faqimgs">
                            <img src="@/assets/images/website/home4_faq.png">
                          </div>
                       </div>
                  </div>
               </div>
            </div>
         </v-card>
      </div>
      <div class="pt-16 pb-8 pt-10">
            <v-container class="container-width">
                <v-row class="justify-center">
                    <!--Questions-->
                    <v-col cols="12" md="6" class="pe-md-8 faq"> 
                        <div class="mb-8">
                            <v-row>
                                <v-col cols="12" md="8" data-aos="fade-up" data-aos-duration="500" class="faq-center">
                                    <!-- <span>
                                        <img src="@/assets/images/website/shape-two.png" alt="">
                                    </span>  -->
                                    <span class="about_heading font-weight-bold"> FAQ </span>
                                    <h2 class="mt-4 sailFont ctm_h2 font-weight-bold text-capitalize">
                                 <!-- For <span class="text-secondary"> Vendor </span> -->
                                    {{tcontent['faqven']?.title}}<span class="text-primary">{{tcontent['faqven']?.ctitle}}</span>
                                    </h2>
                                </v-col>
                            </v-row>
                        </div>
                        <v-expansion-panels elevation="10">
                            <v-expansion-panel elevation="10" v-for="item in tcontent['faqcst']?.faqs" :key="item.question">
                                <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
                                <v-divider></v-divider>
                                <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2">
                                    {{ item.answer }}
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                    <v-col cols="12" md="6" class="faq-col"> 
                        <div class="rounded p-2 vendor-faq-image h-100">
                            <img v-if="tcontent['faqven']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['faqven']?.imageUrl" class="w-100 scr-image">
                            <img v-else src="@/assets/images/website/ipad-mokeup.png" alt="" class="">
                        </div>
                    </v-col>
                </v-row>
            </v-container>
      </div>
      <!-- <CallToAction /> -->
    <div class="pb-16 pb-10">
            <v-container class="container-width">
                <v-row class="justify-center">
                    <v-col cols="12" md="4" class="faq-col"> 
                        <div class="rounded p-2 customer-faq-image h-100">
                            <img v-if="tcontent['faqcst']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['faqcst']?.imageUrl" class="w-100 scr-image">
                            <img v-else src="@/assets/images/website/laptopmockup2.png" alt="" class="">
                        </div>
                    </v-col>
                    <v-col cols="12" md="8" class="ps-md-16 faq"> 
                        <div class="text-left mb-8">
                            <v-row>
                                <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500" class="faq-center">
                                    <!-- <span>
                                        <img src="@/assets/images/website/shape-two.png" alt="">
                                    </span> -->
                                    <span class="about_heading font-weight-bold"> FAQ </span>
                                    <h2 class="mt-0 sailFont ctm_h2 font-weight-bold text-capitalize">
                                        <!-- For <span class="text-secondary"> Customer </span> -->
                                        {{tcontent['faqcst']?.title}}<span class="text-primary">{{tcontent['faqcst']?.ctitle}}</span>
                                    </h2>
                                </v-col>
                            </v-row>
                        </div>
                        <v-expansion-panels elevation="10">
                            <v-expansion-panel elevation="10" v-for="item in tcontent['faqcst']?.faqs" :key="item.question">
                                <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
                                <v-divider></v-divider>
                                <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2">
                                    {{ item.answer }}
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                    <!--Stil Have Questions-->
                </v-row>
            </v-container>
      </div>
       <!--Footer-->
      <Footer/>
    </div>
</template>

<style>

.faqimgs img {
    width: 75%;
 }
 .faqimgs {
    position: absolute;
    top: -76px;
    right: -39px;
}
.vendor-faq-image img {
    width:100%;
}
.customer-faq-image img {
    width: 164%;
    margin-left: -135px;
    margin-top: 35px;
}



@media only screen and (max-width: 767px) {
    .faqimgs{
        display:none;
    }
}
@media only screen and (max-width: 1024px) {
    .faqimgs img {
        width: 50%;
    }
    .faqimgs {
        position: absolute;
        top: 87px;
        right: -172px;
    }
    .vendor-faq-image img {
        width: 85%;
    }
    .customer-faq-image img {
        width: 85%;
        margin-left: 50px;
    }
}
</style>