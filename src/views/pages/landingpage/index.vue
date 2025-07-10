<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
// import TopHeader from '@/components/landingpage/section/topbar.vue';
import MainBanner from '@/components/landingpage/section/mainBanner.vue';
import WebsiteBanner from '@/components/landingpage/section/websitebanner.vue';
import Vission from '@/components/landingpage/section/vission.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import VendorCategory from '@/components/landingpage/section/vendor-category.vue';
import PlannerSection from '@/components/landingpage/section/planner-section.vue';
import AboutSection from '@/components/landingpage/section/about.vue';
import CallToAction from '@/components/landingpage/section/calltoaction.vue';
import Blog from '@/components/landingpage/section/blog.vue';
import VendorFAQ from '@/components/landingpage/section/vendor-faq.vue';
import ContactUs from '@/components/landingpage/section/contact-us.vue';
import WebsitePackages from '@/components/landingpage/section/website-packeges.vue';
import WebsitePackagesvendor from '@/components/landingpage/section/vendorpackage.vue';
import WebsiteVendor from '@/components/landingpage/section/websitevendor.vue';
import headerfilter from '@/components/landingpage/section/headerfilter.vue';


import 'aos/dist/aos.css';
import AOS from 'aos';
import axios from '@/stores/axios';

import { useMeta } from 'vue-meta';
useMeta({
  title: 'my index page',
  meta: [
    { name: 'description', content: 'my index page content' },
    { property: 'og:title', content: 'my index page MySite' },
    // add other tags as needed
  ]
});


onMounted(() => {   AOS.init(); });


// stop inspect element code  here 
// stop inspect element code  here 



const tcontent     = ref({});
(async function(){
    let apple = 'packages'
    const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'customer'})}`)
    if (response.data.status=="SENT"){
        apple.split(',').forEach((i:any)=>{
            var data = response.data.data.find((a:any)=>(a.section.section == i))
            // if (data) { tcontent.value.push({title:data.title}) }
            if (data) { tcontent.value[i] = {title:data.title}}
        })
    }
})();




</script>

<template >
    <div class="lp-wraper">
        <!--Header-->
        <!-- <TopHeader /> -->
         <div class="noshadow">
             <Header /> 
         </div>
        <headerfilter />
        

        <!--Content-->
        <WebsiteBanner />
        <!-- <MainBanner /> -->
        <AboutSection />
        <!-- <CallToAction /> -->
        <div class="package pt-4">
            <div class="package_s"></div>
            <v-container class="maxWidth " id="demos">
                <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500" class="">
                        <div class="text-center">
                            <span class="text-secondary about_heading font-weight-bold">Packages</span>
                            <!-- <h2 v-if="tcontent[0]" class="text-center sailFont ctm_h2 text-black font-weight-bold">{{tcontent[0]?.title}}</h2> -->
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
        
        <div class="pt-3 website-vendor">
            <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                        <div class="text-center">
                            <span class="text-secondary about_heading font-weight-bold">Vendors</span>
                            <h2 class="text-center sailFont ctm_h2 text-black font-weight-bold">
                                Most Popular <span class="">Vendors  </span>
                            </h2>
                        </div>

                    </v-col>
                </v-row>
            <WebsiteVendor/><!-- admin packages -->
        </div>


        <div class="package pt-4">
            <div class="package_s"></div>
            <v-container class="maxWidth " id="demos">
                <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500" class="">
                        <div class="text-center">
                            <span class="text-secondary about_heading font-weight-bold">Packages</span>
                            <h2 class="text-center sailFont ctm_h2 text-black font-weight-bold">
                                Vendor <span class="">Packages</span>
                            </h2>
                        </div>

                    </v-col>
                </v-row>
            </v-container>
            <v-container class="container-width">
                <WebsitePackagesvendor /><!-- vendor packages -->
                
            </v-container>
        </div>

        <VendorCategory />
        
      
 

      
        <!-- <div class="mt-sm-9 vission">
            <div class="vissi-on"></div>
            <v-container class="maxWidth " id="demos">
                <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                        <div class="text-center mt-8">
                            <span class="text-secondary about_heading font-weight-bold">Your Vision, Our Passion:</span>
                            <h2 class="text-center sailFont ctm_h2 text-black font-weight-bold">
                                Where Your Vision Meets <span class=""> Our Passion</span>
                            </h2>
                        </div>

                    </v-col>
                </v-row>
            </v-container>
            <v-container class="container-width">
                <Vission />
            </v-container>
        </div> -->
     
        <!-- <div class="v-category">
            <PlannerSection />
        </div> -->

        
        <div class="home_faq">
            <VendorFAQ />
        </div>

        <!-- <Blog /> -->
        <div class="my-3 mt-8">
            <ContactUs />
        </div>
        <!-- <HowToRegister /> -->

        <!--Footer-->
        <Footer />
        <!----------->
    </div>
</template>
<style>
.container-width {
    width: 100% !important;
}

@media screen and (min-width:960px) { .v-container { max-width: 1200px !important; } }
</style>