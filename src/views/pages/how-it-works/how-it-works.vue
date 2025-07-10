<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
//How it works components
// import  from '@/components/pages/how-it-works/how-it-works.vue';

import { useMeta } from 'vue-meta';
useMeta({
  title: 'my how-itworks page',
  meta: [
    { name: 'description', content: 'my how-itworks page content' },
    { property: 'og:title', content: 'my how-itworks page MySite' },
    // add other tags as needed
  ]
});


// theme breadcrumb
const page = ref({ title: 'How It Works' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/'
    },
    {
        text: 'How It Works',
        disabled: true,
        href: '#'
    }
]);



const imageUrl      = ref()
const imageUrl1      = ref()
const imageUrl2      = ref()

const tcontent     = ref({});
(async function(){
   let apple = 'how it works,step1,step2,step3'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'how_it_works'})}`)
   console.log('---data-->>>>>>>>',response.data)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
         // if (data) { tcontent.value.push({imageUrl:data.image1,imageUrl1:data.image1,imageUrl2:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}) }
         if (data) {tcontent.value[i] = {imageUrl:data.image1,imageUrl1:data.image1,imageUrl2:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}}
      })
   }
})();

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
                     <div class="">
                        <h3 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}</h3>
                        <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-medium pa-0 d-flex justify-center">
                           <template v-slot:divider>
                              <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                           </template>
                           <template v-slot:title="{ item }">
                              <h6 class="text-white">{{ item.title }}</h6>
                           </template>
                        </v-breadcrumbs>
                        <div class="sideimg">
                          <img src="@/assets/images/landingpage/background/c2a.png">
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </v-card>
      </div>
      <div class="position-relative how-it-work">
         <!-- <HowItWorks/> -->
         <div class="py-md-16 py-10 overflow-hidden how_it_works">
            <v-container class="container-width">
                  <div class="how_work text-center">
                  <span class="text-secondary about_heading font-weight-bold">How It Works</span>
                  <h2 class="font-weight-bold text-center sailFont mb-6 ctm_h2" data-aos="fade-up" data-aos-duration="500">
                     <!-- How Wedding <span class="">Planner Works</span> -->
                     {{tcontent['how it works']?.title}}<span class="text-primary">{{tcontent['how it works']?.ctitle}}</span>
                  </h2>
                  <p class="py-2 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{ tcontent['how it works']?.content }}</p>
                  
               </div>
                  <v-row>
                     <v-col cols="12" md="6" class="d-flex align-center">
                        <div class="wpo-about-wrap" bis_skin_checked="1">
                              <div class="p-0" bis_skin_checked="1">
                                 <img v-if="tcontent['step1']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['step1']?.imageUrl" class="w-100 scr-image">
                                 <img v-else src="@/assets/images/website/budget-planning.png" alt="" class="w-100">
                              </div>
                        </div>
                     </v-col>
                     <v-col cols="12" md="6" class="d-flex align-center step-onect">
                        
                        <div class="mt-8 mt-lg-0">
                              <span class="text-secondary about_heading font-weight-bold">Step 01</span>
                              <h4 class="font-weight-bold text-left ctm-h4 sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                                 <span> {{tcontent['step1']?.title}}: </span><span class="text-primary">{{tcontent['step1']?.ctitle}}</span>
                              </h4>
                              <p class="py-2 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{ tcontent['step1']?.content }}</p>
                              <div class="mt-4 d-sm-flex gap-3">
                                 <v-btn to="/register?as=vendor"  size="default" class="m-btn-full headin_g text-white btn-custom-lg" flat>Register Now</v-btn>
                              </div>
                        </div>
                     </v-col>
                     
                  </v-row>   

                  <v-row class="left-txt step-onect step-order">
                     <v-col cols="12" md="6" class="d-flex align-center order_property">
                        
                        <div class="mt-8 mt-lg-0">
                              <span class="text-secondary  about_heading font-weight-bold">Step 02</span>
                              <h4 class="font-weight-bold text-left ctm-h4 sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                                 <span> {{tcontent['step2']?.title}}: </span><span class="text-primary">{{tcontent['step2']?.ctitle}}</span>
                              </h4>
                              <p class="py-2 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{ tcontent['step2']?.content }}</p>
                              <div class="mt-4 d-sm-flex gap-3">
                                 <v-btn to="/register?as=vendor"  size="default" class="m-btn-full headin_g text-white btn-custom-lg" flat>Register Now</v-btn>
                              </div>
                        </div>
                     </v-col>
                     <v-col cols="12" md="6" class="d-flex align-center order_propertyct">
                        <div class="wpo-about-wrap" bis_skin_checked="1">
                              <div class="p-0" bis_skin_checked="1">
                                 <img v-if="tcontent['step2']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['step2']?.imageUrl" class="w-100 scr-image">
                                 <img v-else src="@/assets/images/website/vendor-ss.png" alt="" class="w-100">
                              </div>
                        </div>
                     </v-col>
                  
                     
                  </v-row> 

                  <v-row class="left-txt">
                     <v-col cols="12" md="6" class="d-flex align-center">
                        <div class="wpo-about-wrap" bis_skin_checked="1">
                              <div class="p-0" bis_skin_checked="1">
                                 <img v-if="tcontent['step3']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['step3']?.imageUrl" class="w-100 scr-image">
                                 <img v-else src="@/assets/images/website/revenues.png" alt="" class="w-100">
                              </div>
                        </div>
                     </v-col>
                     <v-col cols="12" md="6" class="d-flex align-center">
                        
                        <div class="mt-8 mt-lg-0">
                              <span class="text-secondary about_heading font-weight-bold">Step 03</span>
                              <h4 class="font-weight-bold text-left ctm-h4 sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                                 <span> {{tcontent['step3']?.title}}: </span><span class="text-primary">{{tcontent['step3']?.ctitle}}</span>
                              </h4>
                              <p class="py-2 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{ tcontent['step3']?.content }}</p>
                              <div class="mt-4 d-sm-flex gap-3">
                                 <v-btn to="/register?as=vendor"  size="default" class="m-btn-full headin_g text-white btn-custom-lg" flat>Register Now</v-btn>
                              </div>
                        </div>
                     </v-col>
                     
                  </v-row>   
            </v-container>
         </div>
      </div>
      <!-- <div class="pb-16">
         <v-container class="container-width">
            <VendorFAQ />
         </v-container>
      </div> -->
       <!--Footer-->
      <Footer/>
    </div>
    
    
</template>
<style scoped>
.sideimg img {
   width: 37%;
}
.sideimg {
   position: absolute;
   top: -99px;
   right: -463px;
}
.how_it_works{
    background-image: url(@/assets/images/website/bg-1.webp);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
.ctm-h4 {
    font-size: 30px;
}
.left-txt {
    margin-top: -85px !important;
}
</style>