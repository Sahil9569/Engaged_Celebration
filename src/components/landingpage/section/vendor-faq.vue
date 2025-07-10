<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/stores/axios';
// import FaqQuestion from '@/components/pages/faq/FaqQuestion.vue';

const tcontent     = ref({});

(async function(){
   let apple = 'faq'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'homepage'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
        if (data) { tcontent.value[i] = {title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}}
      })
   }
})();


</script>
<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
               <div class="d-sm-flex align-center text-center justify-center">
                    <span class="text-secondary about_heading font-weight-bold">Faq</span>
                </div> 
                <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold mb-4">
                    <!-- Frequently Asked <span class="">Questions</span> -->
                    {{tcontent['faq']?.title}}<span class="text-primary">{{tcontent['faq']?.ctitle}}</span>
                </h2>
                <!-- <div class="section-title-img text-center" bis_skin_checked="1">
                    <img src="@/assets/images/website/section-title.png" alt="">
                </div> -->
            </v-col>
        </v-row>
        <v-row class="justify-center ctm-faq align-center">
        <!--Questions-->
        <v-col cols="6" md="6"> 
            <div class="faq-mock">
                <img src="@/assets/images/website/couple-img.png" class="w-100">
                 </div>
       </v-col> 
        <v-col cols="12" md="6" class="faq_section "> 
            <!-- <FaqQuestion/> -->
            <div class="faq">
                <div class="text-center mb-8">
                    <v-row class="justify-center">
                            <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                                <div class="d-sm-flex align-center text-center justify-center">
                                    <h6 class="text-h6 ml-2 text-primary">FAQ</h6>
                                </div>
                                <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold text-capitalize">
                                    Asked by <span class="text-secondary">Vendors</span>
                                </h2>
                                <div class="section-title-img text-center" bis_skin_checked="1">
                                    <img src="@/assets/images/website/section-title.png" alt="">
                                </div>
                            </v-col>
                    </v-row>
                </div>
                <v-expansion-panels elevation="10">
                    <v-expansion-panel elevation="10" v-for="item in tcontent['faq']?.faqs" :key="item.question" class="fq_s">
                        <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
                        <v-divider></v-divider>
                        <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2 tx-fqs">
                            {{ item.answer }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </v-col>
      
    </v-row>
    </v-container>
  </template>
 <style lang="scss" scoped>

.faq-mock img{
     width:80%;
}
 .ctm-faq .text-center.mb-8{
    display:none;
 }
.ctm-faq {
    background: linear-gradient(45deg, #6573ff, #f9a7e2d1, #6a79e6, #b9a9fa, #6775e0, #707ce2);
    background-size: 600% 100%;
    padding: 30px;
    border-radius: 45px;
    position:relative;
}
 .background-videos::before {
    top: 0;
    left: 0;
    width: 102%;
    height: 99%;
}
.ctm-faq:after {
    content: "";
    display: block;
    background: rgba(255, 255, 255, 0);
    border: 2px solid rgba(253, 248, 255, 0.431372549);
    border-radius: 45px;
    top: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    position: absolute;
}

.background-videos video {
    width: 100vw;
    left: 50%;
    right: 50%;
    height: 540px;
    object-fit: cover;
    margin-left: -50vw;
    margin-right: -50vw;
    position: relative;
}
.background-videos {
    width: 100vw;
    left: 50%;
    z-index: -1;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    position: relative;
  }
  .faq_section{
    padding: 20px 0;
    position:relative;
    padding-right: 30px;
  }

    .faq{
        padding-top: 35px;
    }
 </style>
 