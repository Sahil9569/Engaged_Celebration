<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';

import BASE_URL from '@/stores/myVar';

const fullpageloader = ref(true)
import imageHome from '@/assets/images/website/banner-multi.png'
const imageUrl = ref(imageHome)

import imageHome2 from '@/assets/images/website/banner-multitwo.png'
const imageUrl2 = ref(imageHome2)

const tcontent     = ref({});
(async function(){
   let apple = 'best big day'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'homepage'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
        if (data) {tcontent.value[i] = {imageUrl:data.image1,imageUrl2:data.image2,title:data.title, ctitle:data.ctitle, content:data.content}}
      })
      fullpageloader.value=false;
   }
})();



</script>
<template>
     <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4"><div>{{ myerrors }}</div>
            <template v-slot:prepend><v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4"> <div>{{ myerrors }}</div>
            <template v-slot:prepend> <v-icon class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>
    <div class="overflow-hidden baner-sc">
        <div class="banner-one-shape1" bis_skin_checked="1"></div>
        <div class="banner-one-shape2" bis_skin_checked="1"></div>
        <div class="banner-one-shape3" bis_skin_checked="1"></div>

        <v-container class="py-0">

            <v-row>
                <v-col cols="12"  md="6" class="d-flex align-center py-16">
                    <div class="mt-8 mt-lg-0 mr-5">
                        <span class="text-h6 d-flex align-center gap-2" data-aos="fade-up" data-aos-duration="400">
                            <RocketIcon size="18" class="text-secondary" /> 
                        </span>
                        <h1 class="bannerTitle pt-5 font-weight-bold" data-aos="fade-left" data-aos-duration="500">
                            <!-- Let's Craft the Wedding of Your <span class="text-primary"> Dreams Together </span> -->
                            {{tcontent['best big day']?.title}}<span class="text-primary">{{tcontent['best big day']?.ctitle}}</span>
                        </h1>
                        <p class="pt-8 pb-6 text-h6 font-weight-regular line-height-1-5" data-aos="fade-up" data-aos-duration="1000">
                            {{tcontent['best big day']?.content}}
                        </p>
                        
                        <!-- <div class="vendor-filtr px-2 flex-wrap">
                            <v-col cols="6" md="3" class="px-1">
                                <v-autocomplete v-model="cap_value2" :items="vendorcategory" color="secondary"
                                    label="Service" variant="outlined" density="compact" hide-details>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="6" md="3" class="px-1">
                                <v-autocomplete v-model="cap_value3" :items="vendorcity" color="secondary"
                                    label="Location" variant="outlined" density="compact" hide-details>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3" class="px-1">
                                <v-autocomplete v-model="cap_value4" :items="vendorprice" color="secondary"
                                    label="Budget" variant="outlined" density="compact" hide-details>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3" class="px-1">
                                <v-btn color="secondary" class="form-btn w-100">Get Started</v-btn>
                            </v-col>
                        </div> -->
                    </div>

                </v-col>
                    <v-col cols="12" md="6" class="d-none d-md-block py-0">
                        
                        <div class="bannerSlider">
                            <div class="d-flex flex-row">
                                <div class="rounded-md">
                                    <div class="animateUp">
                                        
                                        <!-- <img  @wheel="handleWheel" :src="BASE_URL + tcontent[0]?.imageUrl2"> -->
                                        <img v-if="tcontent['best big day']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['best big day']?.imageUrl">
                                        <img v-else :src="imageUrl" />
                                    </div>
                                    <div class="animateUp">
                                        <img v-if="tcontent['best big day']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['best big day']?.imageUrl">
                                        <img v-else :src="imageUrl" />
                                    </div>
                                </div>
                                <div class="rounded-md d-none d-lg-block">
                                    <div class="animateDown">
                                        <img v-if="tcontent['best big day']?.imageUrl2" @wheel="handleWheel" :src="BASE_URL + tcontent['best big day']?.imageUrl2">
                                        <img v-else :src="imageUrl2" />
                                    </div>
                                    <div class="animateDown">
                                        <img v-if="tcontent['best big day']?.imageUrl2" @wheel="handleWheel" :src="BASE_URL + tcontent['best big day']?.imageUrl2">
                                        <img v-else :src="imageUrl2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style lang="scss" scoped>

.v-container {
    max-width: 1200px !important; 
}
.discover_more {
    background: #fff;
    border-color: #fff;
}
.slide-content h1 {
    font-size: 48px;
    font-weight: 700 !important;
    line-height: 61px;
    margin: 0px 0 0px;
    color: #000;
    font-family: Cormorant;
    text-transform: capitalize;
    margin-bottom: 25px;
    margin-left: -34%;
    text-align: center;
}
.rounded-md img {
    width: 97%;
    min-height: 400px;
    object-fit: cover;
}
.slide-content h1:before {
    content: "";
    position: absolute;
    top: 50px;
    height: 100px;
    left: 324px;
    width: 123px;
    border-bottom: 2px solid #c78766;
}
.bannerSlider {
    padding: 25.6px;
    min-width: 745px !important;
    height: calc(100vh - 100px);
    max-height: 600px;
    overflow: hidden;
    border-radius: 7px;
}
 .baner-sc {
   background-image:url('@/assets/images/website/bgbanner.png');
   background-size:cover;
 }
// .pre_wedding:before {
//     content:'';
//     background-image:url('@/assets/images/landingpage/catring-slid-bg.png');
//     position:absolute;
//     left:50%;
//     top:0;
//     width:100%;
//     height:100%;
// }
// .pre_wedding{
//     position:relative;
// }
.slide-content h6 {
    text-align:center;
    font-size:14px;
    font-weight:500;
    line-height:24px;
    margin-left:-194px;
    padding-top:8px;
}
.slide-content{
    width:50%;
}
.slide-content p {
    font-size:18px;
    text-transform:capitalize;
    color:#c78665;
    font-weight:700;
    margin-left:18%;
    margin-top:21px;
    padding-top:8%;
}
.mt-6.register_button.gap-3 a {
    color: #fff;
    height: 51px !important;
    padding: 0px 21px !important;
    margin-left: 20%;
    margin-top: 11px;
}
.about_us h1:before {
    left: 0px !important;
}
.about_us .mt-6.register_button.gap-3 a {
    margin-left: 0%;
    margin-top: 2px;
}
//.baner-sc {
  // background: #fbf1ea;
//}
.vendor-filtr {
    display: flex;
    // box-shadow: 0px 2px 8px rgba(109, 109, 109, 0.1607843137);
    // background-color: #fff;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
// .banner-one-shape1 {
//     position: absolute;
//     border: 20px solid rgb(180 128 28);
//     width: 150px;
//     height: 150px;
//     border-radius: 100%;
//     top: 20%;
//     left: 2%;
//     opacity: 0.1;
//     animation: zoom-fade 8s infinite linear;
//     z-index: 3;
// }

// .banner-one-shape2 {
//     position: absolute;
//     border: 17px solid rgb(180 128 28);
//     width: 80px;
//     height: 80px;
//     border-radius: 100%;
//     bottom: 100px;
//     right: 100px;
//     opacity: 0.1;
//     // mix-blend-mode: overlay;
//     animation: zoom-fade 3s infinite linear;
//     z-index: 3;
// }
.banner-one-shape3 {
    position: absolute;
    border: 20px solid rgb(180, 128, 28);
    width: 140px;
    height: 140px;
    border-radius: 100%;
    top: 210px;
    left: 4%;
    opacity: 0.1;
    animation: zoom-fade 9s infinite linear;
    z-index: 3;
}

@keyframes zoom-fade {
    0% {
        -webkit-transform: scale(0.6);
        transform: scale(0.6);
    }

    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    100% {
        -webkit-transform: scale(0.6);
        transform: scale(0.6);
    }
}
@media only screen and (max-width:1280px){
    .bannerSlider{
        height:100%;
        max-height: 660px;
    }
}
</style>
