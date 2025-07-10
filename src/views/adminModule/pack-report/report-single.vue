<script setup lang="ts">
import { ref, computed } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import userimg from "@/assets/images/profile/defaultuserimg.png";
import { useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

import 'v-slick-carousel/style.css';
import { VSlickCarousel } from 'v-slick-carousel';
import type { Settings } from 'v-slick-carousel';

const reportSetting: Settings = {
    arrows: true,
    dots: true,
    infinite: false, 
    groupsToShow: 4, 
    groupsToScroll: 1,
    slidesPerGroup: 1,
    swipe: false, 
    swipeToSlide: false,
    ignorePrefersReducedMotion: true,
    autoplay: false,
    touchThreshold: 5
}



const route = useRoute();
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);


const rating = ref(5);
const ratingreview = ref(0);
const tab4 = ref(null);
const dialog = ref(false);
const bookingdialog = ref(false);
import image1 from '@/assets/images/customer/decorator.jpeg';

import image3 from '@/assets/images/customer/catering.jpg';
import image4 from '@/assets/images/customer/catering2.jpg';
import image5 from '@/assets/images/customer/decorator.jpeg';
import image6 from '@/assets/images/customer/destination.webp';
import image7 from '@/assets/images/customer/makeUp.png';
import image8 from '@/assets/images/customer/djs.jpg';
import image9 from '@/assets/images/customer/photography.webp';


import user1 from "@/assets/images/profile/user-1.jpg";

//Fancybox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgs = [
    image1,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9
]
const showImg = (index: number) => {
    indexRef.value = index
    visibleRef.value = true
}

const onHide = () => visibleRef.value = false;
const moveDisabled = ref(true);

const reviewCard = ref([
    {
        coupleimgphoto: user1,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Deepak Sajxcv;kl;wan"
    },

]);



const galleryimages = ref([{ image: image1, },]);
const productImages = ref([]);

const vendormainimg = ref('')
const vendorid = ref()
const is_vendor = ref()
const vendorname = ref('')
const package_toggle = ref('')
const bookavail = ref(false)
const location = ref([])
const iratings = ref('')
const business_name = ref('')
const cancel_policy = ref('')

const pckg_intro = ref()
const weblinks = ref([])
const deadline_time = ref()
const price_data = ref()
const category = ref('')

const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'custom-tiptap-style',
        }
    },
    extensions: [StarterKit],
    content: ``
});

const action = ref('Single_servicePage')
const path = window.location.pathname;
const serviceId = path.split('/').pop();
const atbook:any = ref('')
const package_id = ref('')
const advance_payment = ref('');
const price = ref('');
const full_price = ref('');
const package_paid = ref()

const reports_data = ref([]);
const report_pack = ref('');


async function service_listing() {
    if ('booknow' in route.query){ bookingdialog.value = true;setTimeout(() => {  window.scrollTo(0,0);}, 100); }
    try {
        const formData = new FormData();
        formData.append("Single_servicePage", action);
        formData.append("serviceId", serviceId);
        console.log("start function ")
        const response = await axios.post(`/home/single_service`, formData, config);
        console.log(response.data, "hi responce ")
        console.log("response.data.random_similar_pkg",response.data.similar_pkg)
        if (response.data.status == 'SAVED') {
            
        }
        if (response.data.data) {
            const res: any = response.data.data
            console.log('check the response datdsdsa ______________',res)
            if (res.cities && res.cities.length > 0) {
                location.value = res.cities.map((a: any) => a.city).join(', ');
            } else if (res.states && res.states.length > 0) {
                location.value = res.states.map((a: any) => a.state).join(', ');
            }
            // location.value = res.cities.map((a: any) => (a.city)).join(', ')
            vendormainimg.value = BASE_URL + res.package_logo
            price_data.value = res.price
            category.value = res.category.name
            iratings.value = res.iratings
            business_name.value = res.name
            cancel_policy.value = res.terms_and_conditions
            pckg_intro.value = res.description
            deadline_time.value = res.deadline_time
            weblinks.value = res.weblinks.map((a:any)=>(a.url))
            atbook.value = res.deposit_amount
            advance_payment.value = res.advance_payment
            price.value = res.price
            full_price.value = res.full_price
            is_vendor.value = (res.vendor) ? true : false
            package_toggle .value= res.show_hide
            galleryimages.value = response.data.serialized_albums.image_urls
            package_id.value = res.id
            vendorid.value = (res.vendor) ? res.vendor.id : res.admin.id
            vendorname.value = `${res.user.first_name} ${res.user.last_name}`
            bookavail.value = res.user.is_active
            productImages.value = response.data.serialized_albums
            countryitem.value = response.data.countries
            budget.value = res.deposit_amount
            initial_budget.value = res.advance_payment
            package_paid.value = res.paid_status

            superbookedSlots.value = (res.vendor) ? res.vendor.available : res.admin.available

            superbookedSlots.value.forEach(function(a:any) {
                let i = a.ondate.split('-')
                if ( a.timings.length == 24 ){ attributesBook.value[1].dates.push(new Date(i[0], parseInt(i[1])-1, i[2])); }
            });
        }
        if (response.data.status == 'SAVED') {
            reviewCard.value = response.data.all_reviews.map((elem: any) => {
                return {
                    "coupleimgphoto": (elem.user.profile_pic) ? BASE_URL + elem.user.profile_pic : user1,
                    "reviewtext": elem.comment,
                    "reviewppostedtime": '$' + elem.created_at,
                    "coupleName": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                    "rating": elem.rating, // Use this rating for each review item
                    "id": elem.id,
                };
            });
        }
        if (response.data.status == 'SAVED'){
            if (response.data.report_data.length > 0) {
                report_pack.value = response.data.report_data[0].report_package;
            }

            reports_data.value = response.data.report_data.map((item,index) => ({
                
                sno:   index + 1,
                status: item.status,
                report_package: item.report_package,
                user: item.user.fullname,
                report_reason: item.report_reason,
                // report_reason: item.report_reason.length > 40 
                // ? item.report_reason.substring(0, 40) + '...'
                // : item.report_reason,
                // created_at: item.created_at,
                created_at: item.created_at,
                show_hide: item.report_package.show_hide,
                
            }))
            console.log('report_data----', response.data.report_data);
            fullpageloader.value = false;
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
service_listing();


const range = ref({
    start: new Date(2024, 8, 1),
    end: new Date(2024, 8, 5)
});
const budget = ref('')
const initial_budget = ref('')
const countryitem = ref([])
const fullpageloader = ref(true);



const attributes = ref([
    {

        highlight: {
            color: 'bg-success',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            new Date(2018, 0, 1),
            new Date(2018, 0, 2),
            new Date(2018, 0, 4),
            new Date(2018, 0, 5),
            new Date(2018, 0, 3),
            new Date(2018, 0, 7),
            new Date(2018, 0, 8),
            new Date(2018, 0, 9),
            new Date(2018, 0, 11),
            new Date(2018, 0, 12),
            new Date(2018, 0, 19),
            new Date(2018, 0, 20),
            new Date(2018, 0, 21),
            new Date(2018, 0, 22),
            new Date(2018, 0, 23),
            new Date(2018, 0, 24),
            new Date(2018, 0, 25),
            new Date(2018, 0, 26),
            new Date(2018, 0, 27),
            new Date(2018, 0, 28),
        ],
    },
    {
        highlight: {
            color: 'bg-primary',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            new Date(2018, 0, 6),
            new Date(2018, 0, 10),
            new Date(2018, 0, 13),
            new Date(2018, 0, 14),
            new Date(2018, 0, 15),
            new Date(2018, 0, 16),
            new Date(2018, 0, 17),
            new Date(2018, 0, 18),
            new Date(2018, 0, 29),
            new Date(2018, 0, 30),
            new Date(2018, 0, 31),
        ],
    },
]);


/*vendor business image Section*/
import vendorimg from '@/assets/images/profile/defaultuserimg.png';

const vendorprofilecard = ref([]);


(async function () {
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({fvn:''})}`)
    vendorprofilecard.value = response.data.feat_vend.map((a:any) => ({
        avatar          : (a.avatar) ? BASE_URL + a.avatar : vendorimg,
        businesscover   : BASE_URL + a.businesscover,
        vendornamecard  : a.vendornamecard,
        businessname    : a.businessname,
        link            : a.link,
    }))
})();


//________calendar__________
interface Day { date: string; }


function genavail(avail=true){
    let dateArray           = [];
    if (avail){
        const startDate:any     = new Date();
        const endDate:any       = (new Date()).setFullYear(startDate.getFullYear() + 3);
        while (startDate <= endDate) {
            dateArray.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            // dateArray.push(startDate);
            startDate.setDate(startDate.getDate() + 1);
        }
    }else{
        const endDate:any       = new Date();
        const startDate:any     = new Date((new Date()).setFullYear(endDate.getFullYear() - 3))
        while (startDate < endDate) {
            dateArray.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            // dateArray.push(startDate);
            startDate.setDate(startDate.getDate() + 1);
        }
    }
    // console.log(dateArray)
    return dateArray;
}  



const attributesBook = ref([
    {

        highlight: {
            color: 'text-success',
            fillMode: 'bg-lightsuccess',
            contentClass: 'italic',
        },
        dates: genavail(),
     
    },
    {
        highlight: {
            color: 'text-secondary',
            fillMode: 'bg-lighterror',
            contentClass: 'italic',
        },
        // dates: [ //unavailable dates here
        // new Date(2024, 0, 6),new Date(2024, 0, 10),new Date(2024, 0, 13)........
        // ],
        dates: genavail(false),
    },
]);


const superbookedSlots = ref([])



// Delete extra code now

const blockpackage = ref(false)

const userFeedback = ref('');

async function pack_send_mail(item, index) {
  try {
    if (!userFeedback.value) {
        showErrorMessage.value = true;
        myerrors.value = 'Please provide a reason before submitting.';
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
        return;
        }

    fullpageloader.value = true;
    const formdata = new FormData();
    formdata.append('userFeedback', userFeedback.value);
    formdata.append('packageId', item.report_package.id);
   

    const response = await axios.post("home/send_emails_for_package", formdata);
    
    if (response.data.status === 'SENT') {
      showSuccessMessage.value = true;
      myerrors.value = 'Status changed successfully.';
      reports_data.value[index].show_hide = true;
      service_listing()

      setTimeout(() => { showSuccessMessage.value = false; }, 3000);
      blockpackage.value = false; // Close dialog on success
      userFeedback.value = ''; // Clear the textarea
      fullpageloader.value = false;
    } else {
      console.log('Mail not sent.');
      fullpageloader.value = false;
    }
  } catch (error) {
    console.error('Error:', error);
    fullpageloader.value = false;
  }
}




</script>
<template>
    <!-- <Header /> -->
    <v-container class="py-6 container-width">
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

        <v-row>
            <v-col cols="12">
                <v-row>
                    <v-col cols="12" md="12">
                        <div class="position-relative">
                            <img :src="vendormainimg" class="main-img-vendor rounded mb-2">
                            <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service"
                                size="small" label>{{ category }}</v-chip>
                        </div>
                        <div class="d-flex justify-space-between align-start">
                            <div class="">
                                <v-rating half-increments disabled v-model="iratings" density="compact" color="warning" size="small"></v-rating>
                                <h2 class="font-weight-semibold textSecondary">{{ business_name }} </h2>
                                
                                <p v-if="advance_payment">
                                    <h6 v-if="advance_payment" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit
                                            :</span>$ {{parseInt(advance_payment/100*price)}} ({{ advance_payment }}% of $ {{ price}})
                                        </h6>
                                </p>
                                <p v-else="full_price">
                                    <h6 v-if="full_price" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit 
                                            :</span>$ {{ parseInt(full_price) }} 
                                            ({{ ((full_price / price) * 100).toFixed(2) }}% of $ {{ price }})                                    
                                        </h6>
                                </p>
                                <h6 class="text-subtitle-1 font-weight-medium textSecondary mt-1 d-flex align-top">
                                    <span class="font-weight-semibold">Location: </span> {{ location }}
                                </h6>
                           
                                <h6 class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center"> <span class="font-weight-semibold">Offered by: </span> 
                                    <span v-if="is_vendor"> {{ vendorname }}<strong v-if="!(bookavail)">  (Unavailable)</strong></span>
                                    <span v-else>{{ vendorname }}</span>
                                </h6>
                               
                                
                            </div>
                            
                        </div>

                        <!-- Addd New code:--- -->

                        <div class="mb-3">
                           
                            <div v-if="reports_data.length">
                                <v-btn v-if="reports_data[0].show_hide" color="error" variant="flat" @click="blockpackage = true" class="my-3">
                                    <LockIcon stroke-width="2" size="20" class="mr-1" />
                                    Block
                                </v-btn>
                                <v-btn v-else color="success" variant="flat" @click="blockpackage = true" class="my-3">
                                    <LockOpenIcon stroke-width="2" size="20" class="mr-1" />
                                    Unblock
                                </v-btn>
                                </div>
                            <v-dialog v-model="blockpackage" persistent class="bookingModalStyle" size="small" style="max-width:600px;">
                                <v-card class="pa-6">
                                    <div class="d-flex justify-space-between">
                                        
                                        <h4 class="text-subtitle-3 mb-2 text-no-wrap font-weight-semibold textSecondary">
                                            {{report_pack.name}} Package 
                                        </h4>
                               
                                        <v-btn icon color="" @click="blockpackage = false" flat variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="20" />
                                        </v-btn>
                                    </div>
                                    <div class="mt-4">
                                        <v-textarea
                                            v-model="userFeedback"
                                            label="Note"
                                            placeholder="Please provide the reason or additional information here..."
                                            rows="4"
                                            outlined
                                            dense
                                            hide-details
                                        ></v-textarea>
                                    </div>
                                    <v-card-actions  class="text-end border-top mt-4 pa-0 d-flex justify-end">
                                    <v-btn class="bg-secondary" text flat @click="pack_send_mail(reports_data[0], 0)">
                                        Send
                                    </v-btn>
                                    </v-card-actions>
                                </v-card>                     
                            </v-dialog>
                          

                            <v-card class="border-top border-bottom stickynavbar" elevation="0">
                                <v-card-item class="pa-0 rounded-0">

                                    <v-tabs v-model="tab4" color="primary" class="">
                                        <!-- <v-tab value="about" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> All Reports
                                        </v-tab> -->
                                        <v-tab value="reports" color="secondary" @click="service_listing">
                                        <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> All Reports
                                    </v-tab>

                                        <v-tab value="about" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> About
                                        </v-tab>
                                        <v-tab value="policies" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> Terms &
                                            Conditions
                                        </v-tab>
                                        <v-tab value="album" color="secondary">
                                            <AlbumIcon stroke-width="1.5" width="20" class="v-icon--start" /> Albums
                                        </v-tab>
                                        <v-tab value="reviews" color="secondary">
                                            <QuoteIcon stroke-width="1.5" width="20" class="v-icon--start" /> Reviews
                                        </v-tab>
                                        
                                    </v-tabs>

                                </v-card-item>
                            </v-card>

                            <v-card-text class="bg-light border pa-4">
                                <v-window v-model="tab4">


                                    <v-window-item value="reports">

                                        <div class="position-relative reportSlider">
                                            <div class="carousel">
                                               
                                                <VSlickCarousel v-bind="reportSetting">
                                                        <v-card elevation="10" class="border border-error bg-lighterror h-100" v-for="(item, index) in reports_data" :key="index">
                                                            <v-card-item>
                                                                <div class="mb-2">
                                                                    <h6 class="text-subtitle-1 mb-1  font-weight-medium text-error">Couple Name : </h6>
                                                                    <span class="text-subtitle-2 font-weight-medium text-Darklight">{{ item.user }}</span>
                                                                </div>
                                                                <div class="mb-2">
                                                                    <h6 class="text-subtitle-1 mb-1 font-weight-medium text-error">Report : </h6>
                                                                    <span class="text-subtitle-2 font-weight-medium text-Darklight reportHeightset scroll-style">{{ item.report_reason }}</span>
                                                                </div>
                                                                <div class="mb-2">
                                                                    <h6 class="text-subtitle-1 mb-1  font-weight-medium text-error">Reported Date : </h6>
                                                                    <span class="text-subtitle-2 font-weight-medium text-Darklight">
                                                                        {{ item.created_at.split('T')[0].split('-').reverse().join('-') }}
                                                                    </span>
                                                                </div>
                                                            </v-card-item>
                                                        </v-card>
                                                </VSlickCarousel>
                                            </div>
                                        </div>
                                    </v-window-item>
                              

                                    <v-window-item value="about">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Description
                                        </h2>

                                        <div class="mb-5" v-if="deadline_time">
                                        <p class="" >
                                            <span class="text-body-1 font-weight-bold">
                                                Cut Off Days : 
                                            </span>
                                            <span v-if="deadline_time == 1" class="text-">{{ deadline_time }} Day</span>
                                            <span v-else class="text-">{{ deadline_time }} Days</span>
                                        </p>
                                        <p class="text-body-2 text-Darklight font-weight-semibold">Cut-off days refer to the number of days in advance that you need to book before the event date.</p>
                                    </div> 

                                        <div class="mb-5" v-if="weblinks.length">
                                        <p class="text-body-1 font-weight-bold" >
                                            Weblinks :
                                        </p>
                                        <div v-for="url in weblinks" class="text-body-1 editorcodestyle" >
                                            <a class="text-info" :href="url" target='blank'>{{ url }}</a><br>    
                                        </div> 
                                    </div> 
                                        <div class="mb-5"> 
                                            <p class="text-body-1 font-weight-bold" >
                                            Package Description :
                                        </p>
                                            <div v-html="pckg_intro" class="text-body-1 editorcodestyle" ></div> 
                                        </div>
                                    </v-window-item>

                                    <v-window-item value="policies">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Terms & Policies</h2>
                                        <div class="mb-5">
                                            <div v-html="cancel_policy" class="text-body-1 editorcodestyle" ></div> 
                                        </div>
                                    </v-window-item>


                                    <v-window-item value="album">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            All Albums</h2>
                                        <v-row class="pa-2">
                                            <v-col cols="12" md="3" v-for="item in productImages" :key="item.id">
                                                <v-dialog v-model="dialog" fullscreen :scrim="false"
                                                    transition="dialog-bottom-transition">
                                                    <template v-slot:activator="{ props }">
                                                        <v-card elevation="10" v-bind="props"
                                                            class="album-card-img d-flex align-end"
                                                            :style="{ backgroundImage: `url(${BASE_URL + item.background_image})` }"
                                                            @click='galleryimages = item.image_urls'>
                                                            <v-card-item class="position-relative pa-3 w-100">
                                                                <h3
                                                                    class="text-subtitle-1  font-weight-semibold text-white text-capitalize">
                                                                    {{ item.name }} </h3>
                                                            </v-card-item>
                                                        </v-card>
                                                    </template>
                                                    <v-card>
                                                        <div dark
                                                            class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                                            color="">
                                                            <v-toolbar-title
                                                                class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                                                Images from
                                                                this album </v-toolbar-title>
                                                            <v-btn icon color="" @click="dialog = false" flat
                                                                variant="outlined" class="bg-error" size="small">
                                                                <XIcon width="20" />
                                                            </v-btn>
                                                        </div>
                                                        <v-card-item>
                                                            <v-row class="pa-2">
                                                                <v-col class="pa-2" cols="12" md="4" sm="6"
                                                                    v-for="(card, index) in galleryimages" :key="index">
                                                                    <v-card elevation="10"
                                                                        class="card-hover overflow-hidden"
                                                                        @click="() => showImg(index)">
                                                                        <img :src="BASE_URL + card.image" alt="gallery"
                                                                            width="" class="albumsingleimg rounded" />
                                                                    </v-card>
                                                                    <vue-easy-lightbox :visible="visibleRef"
                                                                        :moveDisabled="moveDisabled" :imgs="imgs"
                                                                        :index="indexRef" @hide="onHide" />
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-item>
                                                    </v-card>
                                                </v-dialog>
                                            </v-col>

                                        </v-row>
                                    </v-window-item>
                                    <v-window-item value="reviews">
                                        <v-row class="pa-2">

                                            <v-col v-if="reviewCard.length !=='0'" cols="12" md="12">
                                                <h2 class="mb-4 text-body-2 text-uppercase font-weight-bold text-secondary">
                                                    All Reviews</h2>
                                                    <v-card elevation="10" class="mb-4" v-for="item in reviewCard" :key="item.id">
                                                    <v-card-item class="d-flex pa-4">
                                                        <div>
                                                            <div class="d-flex align-center">
                                                                <v-avatar size="60" color="primary" variant="flat" rounded="sm">
                                                                    <img :src="item.coupleimgphoto" :alt="item.coupleName" width="60" />
                                                                </v-avatar>
                                                                <div class="ms-2">
                                                                    <v-rating half-increments v-model="item.rating" density="compact" color="warning" size="small"></v-rating>
                                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary ms-1">
                                                                        {{ item.coupleName }}
                                                                    </h4>
                                                                    <p class="text-body-2 text-13 ms-1">
                                                                        {{ item.reviewppostedtime }}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="border-bottom">
                                                            <p class="text-body-1 mt-3 mb-6 text-13">
                                                                {{ item.reviewtext }}
                                                            </p>
                                                        </div>
                                                        <div class="d-flex align-items-center justify-center on_div">
                                            
                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                </v-window>
                            </v-card-text>
                        </div>
                    </v-col>
                </v-row>


            </v-col>
        </v-row>
    </v-container>
  
       
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";

.main-img-vendor {
    width: 100%;
    height: 400px;
    object-fit: cover;
}

.badge-service {
    position: absolute;
    right: 0px;
    top: 0px;
}

.stickynavbar {
    position: relative;
    top: 0px;
    z-index: 1;
}
.bg-grey150{
    background-color: #f2eeef;
}
.stick-info-card {
    position: sticky;
    top: 80px;
    background: url(../../../assets/images/website/calltoaction.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.album-card-img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 150px;
    position: relative;
    overflow: hidden;
}

.album-card-img:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 37%, #000000fc 80%);
    left: 0;
    top: 0;
    opacity: 0.6;
}

.v-card-item {
    z-index: 1;
}

.albumsingleimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.vendormainimg {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.badge-service {
    position: absolute;
    right: 0px;
    top: 0px;
}

.vendor-card-background {
    min-height: 150px;
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
    color: #002642 !important;
    font-weight: 600;
}

.k-calendar .k-calendar-td.k-state-selected .k-link,
.k-calendar .k-calendar-td.k-state-selected .k-link:hover {
    background-color: #002642;
}



.k-calendar .k-calendar-td.k-state-selected .k-link,
.k-calendar .k-calendar-td.k-state-selected .k-link:hover {
    background-color: #002642;
}

.vc-day-content[tabindex~="0"] {
    background: rgb(var(--v-theme-secondary)) !important;
    color: #fff !important;
}
[tabindex="0"].vc-highlight-content-bg-lighterror,
[tabindex="0"].vc-highlight-content-bg-lightsuccess  {
    border: none !important;
}
.vc-day-content.vc-focus:focus-within {
    outline: 0;
    box-shadow: none;
}



.vc-highlight-content-bg-lighterror {
    background-color: rgb(235 235 235) !important;
    color: rgb(145 141 141) !important;
}

.vc-highlight-content-bg-lightsuccess {
    background-color: rgb(230 255 214) !important;
    color: rgb(53 110 18) !important
}
.disabled {
    opacity: 0.8;
    cursor: no-drop;
}
.timeSlotScroll {
    max-height: 430px;
    overflow-y: auto;
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

.calendermain-style .calender {
    width: 100% !important;
}
.vc-weekday, .vc-day {
    padding: 12px !important;
}
.vc-highlight-content-bg-lighterror.vc-day-content[tabindex="0"]{
    background-color: rgb(235 235 235) !important;
    color: rgb(145 141 141) !important;
}
.reportHeightset {
    max-height: 100px !important;
    overflow-y: auto;
    display: block;
    padding-right: 10px;
    line-height: 1.5em;
}
.reportSlider .v-slick-slide-group {
    padding-right: 10px;
    text-align: left;
}
.reportSlider .v-slick-arrow:before {
    color: #b4801c;
}
.v-slick-arrow {
    z-index: 9;
}
.v-slick-arrow.prev {
    left: 0;
}
.v-slick-arrow.next {
    right: 0;
}
</style>

