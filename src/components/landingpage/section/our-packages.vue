<script setup lang="ts">
import { ref , onMounted} from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import packageIcon from '@/assets/images/website/packageIcon.png'
import { router } from '@/router';
import { useRoute } from 'vue-router'
const route: any = useRoute()
const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
const user = localStorage.getItem('user')
const usertype = ref('vendor');

const user_id = ref('')

// onMounted(() => {
//     if (route.query.as) { usertype.value = route.query.as; i.value = (route.query.as == 'vendor') ? 0 : 1 }
//     else { usertype.value = "customer"; i.value = 1 }
//     (async function () {
//         const response = await axios.get('home/signup')
//         if (response.data.status == 'SENT') {
//             console.log("init response_________________", response)
//             // countryitem.value = response.data.countries
//             // catItems.value = response.data.cats.map((a: any) => (a.name))
//             // allstateItems.value = response.data.allstates
//             packages.value = response.data.packs.map((a: any) => ({ id: a.id,free_trial:a.free_trial , description: a.description, package_logo: BASE_URL + a.package_logo, name: a.name,one_time_price: String(parseFloat(a.one_time_price)), price: String(parseFloat(a.price)) }))
//             if (route.query.pid) { package_select(true, route.query.pid) }
//         }
//     })();   
// });


interface Package {
    id: number;
    name: string;
    price: number;
    description: string;
}


// const i         = ref(0);
const i = ref(999);
const packages  = ref([]);
const mypack    = ref(0);
const extraPackage = ref('');



async function onboardingDataGet() {
    try {
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
        const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({pck:'', myp:''})}`, config)
        console.log(response.data,'--nnnnnnn')

        packages.value = response.data.packs;

        const relevantPack = response.data.packs.find(pack => pack.show_hide === true && pack.lifetime_pack_status === true);
        extraPackage.value = !!relevantPack;
        mypack.value = response.data.mypack;
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


onboardingDataGet();


// New add for packages slider
import 'v-slick-carousel/style.css'
// import { VSlickCarousel } from 'v-slick-carousel'
import type { Settings } from 'v-slick-carousel'

// import "v-slick-carousel/dist/v-slick-carousel.css";
// import "v-slick-carousel/dist/v-slick-carousel-theme.css";
import { VSlickCarousel } from "v-slick-carousel";

const settingsss: Settings = {
    arrows: false,
    dots: false,
    infinite: true, 
    groupsToShow: 1, 
    groupsToScroll: 1,
    slidesPerGroup: 1,
    swipe: true, 
    swipeToSlide: true,
    ignorePrefersReducedMotion: true,
    autoplay: true,
    autoplaySpeed: 2500, 
    speed: 2500,
    vertical: true,
    verticalSwiping: true
}

</script>

<template>
    <div class="pricing-section mt-10">
      <v-row justify="center">
        <v-col cols="12">
          <v-row justify="center" class="packageDesign px-md-0 px-4">
            <v-col v-for="pack in packages" :key="pack.id" cols="12" :md="extraPackage ? 3 : 4" :class="extraPackage ? 'mb-md-0 mb-10 cardPrice extrapackageStyle' : 'mb-md-0 mb-10 cardPrice'">

              <div v-if="pack.show_hide" class="h-100">
                <v-card class="pricing-card pricing-card-new border overflow-hidden  bg-lightprimary border border-primary h-100" elevation="10">
                  <div class="wpo-pricing-itemm">
                    <div class="wpo-pricing-top signUp">
                        <div class="">
                          <div class="wpo-pricing-img signUp">
                              <img :src="packageIcon" alt="" class="w-100">
                          </div>
                            <h4 class="text-subtitle-3 font-weight-semibold textSecondary mt-3 text-start pack-name forCenter">{{ pack.name }}</h4> 

                          <div class="my-3">
                            <div class="carousel">
                              <VSlickCarousel v-bind="settingsss">

                               <h2 v-if="pack.onetime_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                               </h2>
                               <h2 v-if="pack.subscrption_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                               </h2>
                               <h2 v-if="pack.yearly_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.yearly_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Annual Subscription</span>
                               </h2>
                                <h2 v-if="pack.lifetime_membership == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime charged ${{ pack.lifetime_price }} </span>
                                </h2>

                              </VSlickCarousel>
                            </div>                  
                          </div>
                        </div>

                        <div class="mt-3 d-flex justify-start"> 
                          <div v-if="user">
                              <div v-if="mypack == pack.id">
                                  <v-btn color="grey100" variant="flat" class="textPrimar rounded-sm" disabled> Active Package </v-btn>
                              </div>
                              <div v-else>
                                  <v-btn  variant="flat" class="pkgbtn py-1 text-white rounded-sm" :to="'/profile-settings/mypackage'"> Buy Now </v-btn> 
                                 
                              </div>
                          </div>
                          <div v-else>
                              <v-btn  variant="flat" class="pkgbtn text-white rounded-sm me-2" :to="'/register?as=vendor&pid='+pack.id"> Buy Now </v-btn>
                              <v-btn v-if="pack.free_trial"
                                  variant="flat" 
                                  class="pkgbtn text-white rounded-sm me-2" 
                                  :to="'/register?as=vendor&pid=' + pack.id + '&free_trial=FreeSubscription'"
                                >
                                Try Free Trial
                              </v-btn>

                            </div>                                                                  
                        </div>
                        
                    </div> 
                    <div class="border-bottom pack-des font-weight-medium text-start forCenter">
                        <div v-html="pack.description" class="styleforEditorcode"></div>
                    </div>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
  </div>
</template>
<style scoped>
.pack-name {
  font-size: 24px;
}
.extrapackageStyle .pack-name {
  font-size: 20px;
}
.pricing-card{
      box-shadow: 0 0 30px #00000024 !important;
    border-radius: 15px !important;
}
.pkgbtn {
    background: #131314 !important;
}
.imageSizeMain {
  width: 90px;
  height: 90px;
}

.wpo-pricing-img.signUp {
    width: 60px;
    height: 60px;
    padding: 4px;
    position: relative;
    background: #131314;
    box-shadow: 0 0 30px #0000001f;
    overflow: hidden;
}

.wpo-pricing-img.signUp img,
.packselectimg img {
  height: 100%;
  object-fit: cover;
}

.wpo-pricing-top.signUp {
  padding: 25px;
}



.custom-size-font {
  font-size: 35px;
}

.custom-size-font span {
  font-size: 14px;
}

.pack-des p {
  font-size: 13px;
}

.pack-des {
  font-size: 13px;
  border-bottom: 1px solid #cccccc42;
  padding: 25px !important;
}

.activePack .pack-des {
  color: rgb(var(--v-theme-primary)) !important;
  border-bottom: 1px solid #00000017;
}

.activePack .wpo-pricing-top {
  border-bottom: 1px solid #00000017;
}



.packageDesign .cardPrice:nth-child(2) .pricing-card-new {
  background: #131314 !important;
    transform: scale(1.1);
    position: relative;
    z-index: 1;
}
.packageDesign .cardPrice.extrapackageStyle:nth-child(2) .pricing-card-new{
  transform: scale(1);
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .pkgbtn{
   background: rgb(var(--v-theme-primary)) !important; 
}
.packageDesign .cardPrice:nth-child(2) .wpo-pricing-top {
    border-bottom: 1px solid #cccccc42;
}
.packageDesign .cardPrice:nth-child(2) .forCenter {
    color: #fff !important;
}
.styleforEditorcode {
  font-size: 13px;
}
.extrapackageStyle .styleforEditorcode {
  font-size: 12px;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .wpo-pricing-img.signUp{
  background: #353535 !important;
}
.packageDesign .cardPrice:nth-child(2) .RecuText{
  color: #fff !important;
  font-weight: 500;
}
.dabbe {
    font-size: 20px;
    border-radius: 6px;
}
.dabbe span {
    font-size: 12px;
}
.packageDesign .cardPrice:nth-child(2) label.v-label.text-subtitle-1 {
    color: #fff;
}


</style>
