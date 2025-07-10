<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
//How it works components
import OurPackages from '@/components/landingpage/section/our-packages.vue';
// import VueYouTubeEmbed from 'vue-youtube-embed';

import { useMeta } from 'vue-meta';
useMeta({
  title: 'my vendor page',
  meta: [
    { name: 'description', content: 'my vendor page content' },
    { property: 'og:title', content: 'my vendor page MySite' },
    // add other tags as needed
  ]
});


import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const imageUrl      = ref()
const imageUrl1      = ref()
const imageUrl2      = ref()
const imageUrl3      = ref()
const imageUrl4      = ref()
const imageUrl5      = ref()

// const tcontent     = ref([]);
const tcontent     = ref({});
(async function(){
   let apple = 'vendor management,onboarding options,dashboard overview,booking system,revenue management,pricing,calendar,chats,vendor banner video'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'vendor'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
         // if (data) { tcontent.value.push({imageUrl:data.image1,imageUrl1:data.image1,imageUrl2:data.image1,imageUrl3:data.image1,imageUrl4:data.image1,imageUrl5:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs, splitcontent:data.splitcontent}) }
         if (data) { tcontent.value[i] = {imageUrl:data.image1,imageUrl1:data.image1,imageUrl2:data.image1,imageUrl3:data.image1,imageUrl4:data.image1,imageUrl5:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs, splitcontent:data.splitcontent, bvideo:data.bvideo} }
      })
   }
})();



const showOverlay = ref(true);

const toggleOverlay = () => {
   showOverlay.value = !showOverlay.value;
   const player = youtubePlayer.value.player;
   if (player) {
      if (showOverlay.value) {
         player.playVideo();
      } else {
         player.pauseVideo();
      }
   }
};

const page = ref({ title: 'For Vendors' });
const breadcrumbs = ref([
   {
      text: 'Home',
      disabled: false,
      href: '/'
   },
   {
      text: 'For Vendors',
      disabled: true,
      href: '#'
   }
]);

</script>

<template>
   <div class="lp-wraper">
      <!--Header-->
      <Header />
      <div class="position-relative">
         <v-card class="elevation-0 rounded-md mb-8">
            <div class="background-video">
               <!-- <video autoplay loop muted v-if="tcontent['vendor banner video']?.bvideo">
                 <source :src="BASE_URL + tcontent['vendor banner video']?.bvideo.video" type="video/mp4">
               </video> -->
               <video v-if="tcontent['vendor management']?.bvideo" autoplay loop muted>
                 <source :src="BASE_URL + tcontent['vendor management']?.bvideo.video" type="video/mp4">
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
                              <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
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
      <div class="pb-16 baner-scn">
         <v-container class="container-width" id="demos">
            <v-row class="justify-center pt-1">
               <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                  <div class="d-sm-flex align-center text-center justify-center">
                     <span class="about_heading font-weight-bold"> Pricing </span>
                  </div>
                  <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold">
                     <!-- Wedding <span class=""> Packages </span> -->
                     {{tcontent['pricing']?.title}}<span class="text-primary">{{tcontent['pricing']?.ctitle}}</span>
                  </h2>
                  <!-- <div class="section-title-img text-center" bis_skin_checked="1">
                     <img src="@/assets/images/website/section-title.png" alt="">
                  </div> -->
               </v-col>
            </v-row>
         </v-container>
         <v-container class="container-width">
            <OurPackages />
         </v-container>
      </div>
    <div class="for-couple mt-1">
      <v-container class="container-width">
              <v-card class="elevation-0 rounded-md mb-8">
                  <v-row>
                      <v-col cols="12" md="12" class="d-flex align-center pt-12">
                          <div class="">
                              <div class="mt-8 mt-lg-0 pe-4">
                                  <span class="about_heading font-weight-bold text-center justify-content-center"> Vendor Management </span>
                                  <h2 class="pt-2 mb-3 font-weight-bold sailFont ctm_h2 for-heading" data-aos="fade-up"
                                      data-aos-duration="500">
                                      {{tcontent['vendor management']?.title}}<span class="text-primary">{{tcontent['vendor management']?.ctitle}}</span>
                                  </h2>
                                  <p class="p_text for-text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{tcontent['vendor management']?.content}}</p>
                              </div>
                          </div>
      
                      </v-col>
                      <v-col cols="12" md="12" class="d-flex align-center">
                          <div class="about-right vendor-right w-100" bis_skin_checked="1">
                              <p class="pt-16 mt-1 pb-4 p_text for-text font-weight-regular"  data-aos="fade-up" data-aos-duration="800"> {{tcontent[0]?.splitcontent}} </p>
                          </div>
                      </v-col>

                  </v-row>

                  <v-row>
                      <v-col cols="12" md="6" class="align-center">
                          <div class="custom-order">
                              <div class="mt-1 mt-lg-0 pe-lg-4 couple-left">
                                 <h4 class="onboar-ding font-bold pb-2"> Onboarding Options: </h4>
                                 <p class="text-body-1"> {{tcontent['onboarding options']?.content}} </p>
                              </div>
                              <div class="pe-lg-4 mt-lg-n5 cplim">
                                 <img v-if="tcontent['onboarding options']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['onboarding options']?.imageUrl" class="w-100 scr-image">

                                 
                                 <img v-else  src="@/assets/images/website/packages-img.png" alt="" class="cplcstm">
                                 <!-- <img  @wheel="handleWheel" :src="BASE_URL + tcontent[0]?.imageUrl" class="w-100 scr-image"> -->
                              </div>
                          </div>
      
                      </v-col>
                     <v-col cols="12" md="6" class="d-flex align-center">
                        <div class="ms-auto">
                           <div class="custom-order">
                              <div class="pe-lg-4 cplim">
                                 <img v-if="tcontent['dashboard overview']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['dashboard overview']?.imageUrl" class="w-100 scr-image">
                                 <img v-else src="@/assets/images/website/newpackages.png" alt="" class="w-100">
                             
                             </div>
                              <div class="mt-1 mt-lg-n9 pe-lg-4 couple-left">
                                 <h4 class="onboar-ding font-bold pb-2"> Dashboard Overview: </h4>
                                 <p class="text-body-1">{{tcontent['dashboard overview']?.content}}</p>
                              </div>
                           </div>
                        </div>
                     </v-col>
                  </v-row>
                  <v-row>
                     <v-col cols="12" md="6" class="align-center mt-16">
                         <div class="custom-order">
                             <div class="pe-4 couple-left chatsystem">
                            <h4 class="onboar-ding font-bold pb-2"> Booking System: </h4>
                             <p class="text-body-1"> {{tcontent['booking system']?.content}}
                           </p>
                             </div>
                             <div class="pe-lg-4 mt-lg-n5 cplim">
                              <img v-if="tcontent['booking system']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['booking system']?.imageUrl" class="w-100 scr-image">
                              <img v-else src="@/assets/images/website/bookingimg.png" alt="" class="w-100">
                          
                         </div>
                         </div>
     
                     </v-col>
                     <v-col cols="12" md="6" class="d-flex align-center">
                        <div class="ms-auto">
                           <div class="custom-order">
                              <div class="pe-4  cplim">
                                 <img v-if="tcontent['revenue management']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['revenue management']?.imageUrl" class="w-100 scr-image">
                                 <img v-else src="@/assets/images/website/revimg.png" alt="" class="w-100">
                             </div>
                             <div class="mt-1 mt-lg-n9 pe-lg-4 couple-left">
                                 <h4 class="onboar-ding font-bold pb-2"> Revenue Management: </h4>
                                 <p class="text-body-1"> {{tcontent['revenue management']?.content}}</p>
                             </div>
                           </div>
                        </div>
                    </v-col>
                 </v-row>
              </v-card>
      </v-container>
  </div>
      

      <div class="position-relative container-width vendor-section bg-vendors ms-auto me-auto overflow-hidden mb-10">
         <v-container class="container-width">
            <v-row>
               <v-col cols="12" class="py-md-16 py-10 px-10">
                  <v-row>
                     <v-col cols="12" md="5" lg="5" sm="12" class="video-sec-design position-relative">

                        



                        <img v-if="tcontent['calendar']?.imageUrl"  @wheel="handleWheel"  :src="BASE_URL + tcontent['calendar']?.imageUrl" class="w-100 h-100 object-fit rounded">
                        <img v-else src="@/assets/images/website/mobile-cl.png" class="w-100 h-100 object-fit rounded">
                        <div class="vi-icon">
                           <!-- <v-btn variant="flat">
                              <PlayerPlayIcon stroke-width="1.5" size="40" />
                              <v-dialog v-model="dialog1" activator="parent" class="dialog-mw">
                                 <v-card class="px-4 py-4">
                                    <v-card-actions class="ctm-close">
                                       <v-btn icon color="" @click="dialog1 = false" flat variant="outlined"
                                          size="x-small" class="bg-error">
                                          <XIcon width="20" />
                                       </v-btn>
                                    </v-card-actions>
                                    <v-card-text class="rounded">
                                       <iframe width="100%" height="315"
                                          src="https://www.youtube.com/embed/B0TjyJIIWLA?si=9cLoF7OgzsqRPxQW"
                                          title="YouTube video player" frameborder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowfullscreen></iframe>
                                    </v-card-text>
                                 </v-card>
                              </v-dialog>
                           </v-btn> -->
                        </div>
                     </v-col>
                     <v-col cols="12" md="7" lg="7" sm="12" class="ps-md-10 pt-16">
                       <div class='cal-ender position-relative'>
                        <img src="@/assets/images/website/clndr.png" class="position-absolute clndrimg">
                     </div>
                        <span class="about_heading font-weight-bold"> Calendar </span>
                        <h2 class="sailFont ctm_h2 font-weight-bold text-capitalize"><span
                              class="">Calendar Management</span>
                        </h2>
                        <p class="py-5 cl-endr">{{tcontent['calendar']?.content}}
                        </p>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-container>
      </div>
      <div class="position-relative bg-color container-width vendor-section bg-vendors ms-auto me-auto mt-10 mb-12 overflow-hidden">
         <v-container class="container-width">
            <v-row>
               <v-col cols="12" class="py-md-16 py-10 px-10">
                  <v-row>

                     <v-col cols="12" md="7" lg="7" sm="12" class="pr-md-10">
                        <span class="about_heading font-weight-bold">Chats </span>
                        <h2 class="sailFont ctm_h2 font-weight-bold text-capitalize"><span
                              class=""> Chat Management </span>
                              </h2>
                        <p class="py-5 cl-endr"> {{tcontent['chats']?.content}}</p>
                     </v-col>
                     <v-col cols="12" md="5" lg="5" sm="12" class="pl-0 position-relative">
                        <img v-if="tcontent['chats']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['chats']?.imageUrl" class="w-100 scr-image">
                        <img v-else src="@/assets/images/website/new-chatimg.png" class="w-100 h-100 object-fit rounded">
                        <div class="vid-icon">
                           <!-- <v-btn variant="flat">
                              <PlayerPlayIcon stroke-width="1.5" size="40" />
                              <v-dialog v-model="dialog" activator="parent" class="dialog-mw">
                                 <v-card class="px-4 py-4">
                                    <v-card-actions class="ctm-close">
                                       <v-btn icon color="" @click="dialog = false" flat variant="outlined"
                                          size="x-small" class="bg-error">
                                          <XIcon width="20" />
                                       </v-btn>
                                    </v-card-actions>
                                    <v-card-text class="rounded">
                                       <iframe width="100%" height="315"
                                          src="https://www.youtube.com/embed/D0UnqGm_miA?si=aNyyYymq3B3Tz4xt"
                                          title="YouTube video player" frameborder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowfullscreen></iframe>
                                    </v-card-text>

                                 </v-card>
                              </v-dialog>
                           </v-btn> -->
                        </div>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-container>
      </div>

<!-- 5
      <CallToAction /> -->
      <!-- <div class="pb-md-16 pb-10">
         <v-container class="container-width">
            <VendorFAQ />
         </v-container>
      </div> -->

      <!--Footer-->
      <Footer />
   </div>


</template>
<style scoped>

.clndrimg{
    opacity: 0.4;
    width: 25%;
    left: 520px;
    top: -133px;
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

.bg-vendors{
   background:#f7f6ff !important;
   border-radius: 45px;
   box-shadow: 0 0 5px #00000014 !important;
}
.cplim img {
   margin-left: -30px;
}
.cl-endr{
   text-align: justify;
}
.onboar-ding{
   margin-left: 41px;
   position: relative;
}
.onboar-ding:before {
   content: "";
   width: 32px;
   height: 2px;
   position: absolute;
   top: 35%;
   left: -38px;
   background: #d2a957 !important;
}
.chatsystem {
   margin: -62px 0 0 0;
}
.ytp-cued-thumbnail-overlay:after {
   content: '';
   width: 100%;
   height: 100%;
   position: absolute;
   top: 0;
   left: 0;
   background: gray;
   z-index: 58;
}
.overlay-image {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 1;
   opacity: 1;
}
.contracts-sec {
   background-color: #002642;
   padding: 70px 0;
}

.contracts-sec .v-row {
   z-index: 99;
   position: relative;
}

.contracts-sec:after {
   content: '';
   position: absolute;
   top: 18px;
   right: 0px;
   background-image: url(/src/assets/images/website/flower-shape2.svg);
   background-position: center;
   background-size: contain;
   background-repeat: no-repeat;
   z-index: 1;
   width: 232px;
   height: 503px;
   transform: rotate(155deg);
   filter: brightness(0.7);
   opacity: 0.5;
}

@keyframes bounce {
   0% {
      -webkit-transform: translateY(0) translateX(0);
      transform: translateY(0) translateX(0);
   }

   50% {
      -webkit-transform: translateY(15px) translateX(7px);
      transform: translateY(15px) translateX(7px);
   }

   100% {
      -webkit-transform: translateY(0) translateX(0);
      transform: translateY(0) translateX(0);
   }
}

.vi-icon {
   position: absolute;
   top: 50%;
   right: -20px;
   transform: translateY(-50%);
   transition: all 0.38s ease-in-out 0s;
}

.vi-icon button,
.vid-icon button {
   height: 100%;
   background: #fff;
   padding: 15px;
   width: auto;
   box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
}

.vid-icon {
   position: absolute;
   top: 50%;
   left: -35px;
   transform: translateY(-50%);
   box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
   transition: all 0.38s ease-in-out 0s;
}

.vi-icon button svg,
.vid-icon button svg {
   color: #b4801c;
}
.for_couple {
   top: -279px;
   z-index: 999;
   left: 44%;
   }

  .for_couple h3 {
       font-size: 55px;
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
</style>