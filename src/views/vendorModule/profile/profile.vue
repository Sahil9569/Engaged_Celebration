<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { Carousel, Slide } from "vue3-carousel";

import profileBg from '@/assets/images/website/backBanner.jpg';
import UserImage from '@/assets/images/profile/user-1.jpg';
import businessBanner from '@/assets/images/website/decoration5.jpg';
import packageIcon from '@/assets/images/website/packageIcon.png'

const clickFunModal = (item: any) => { item.dialog = true; galleryimages.value=item.images; }

import axios from'@/stores/axios';
import BASE_URL from'@/stores/myVar';



const f_name            = ref();
const l_name            = ref();
const cdate             = ref();
const u_email           = ref();
const ccode             = ref();
const u_phone           = ref();
const ppic              = ref();
const bpic              = ref();
const zipmodal          = ref();
const city              = ref();
const state             = ref();
const country           = ref();
const vid               = ref();

const mypack            = ref({});
const bdetails          = ref({brandValue : '', wedcities : '', businesslocation : '', EventCovered : '', bdescription : '', blocation : '', bcats: ''});
const weblinks          = ref([])
const pdcounts          = ref([])

async function basic_detailfirst() {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
  const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
  console.log("basic_detailfirst_______________________", response.data)

  if (response.data.status == 'SAVED'){
    let ven = response.data.v_profile_data
    let uen = response.data.u_profile_data


    
    ppic.value                  =   ((uen.profile_pic) ? BASE_URL + uen.profile_pic : '/src/assets/images/profile/user-1.jpg')
    f_name.value                =   uen.user.first_name
    l_name.value                =   uen.user.last_name
    cdate.value                 =   uen.created_at?.split('T')[0]
    u_email.value               =   uen.user.email
    ccode.value                 =   uen.ccode.split('-')[0]
    u_phone.value               =   uen.phone
    city.value                  =   uen.city.city
    state.value                 =   uen.state.state
    country.value               =   uen.country.country
    zipmodal.value              =   uen.zipcode.code
    mypack.value                =   ven.mypackage
    vid.value                   =   ven.id

    
    bpic.value                  =   ((ven.business_logo) ? BASE_URL + ven.business_logo : '/src/assets/images/profile/user-1.jpg')
    bdetails.value.brandValue   =   ven.business_name
    bdetails.value.blocation    =   ven.location_link
    bdetails.value.EventCovered =   ven.wedding_covered_no  
    bdetails.value.bdescription =   ven.business_introduction
    bdetails.value.blocation    =   ven.location_link
    bdetails.value.wedcities    =   ven.weddings_Cities.map( (a) => (a.city) ).join(', ')
    bdetails.value.bcats        =   ven.category.map( (a) => (a.name) ).join(', ')
    weblinks.value              =   ven.weblinks.map( (a) => (a.url) )

    // cats.value                  =   ven.category.map( (a) => ({text:a.name, value:a.id}) )


    portfolio.value             =   response.data.serialized_albums.map((a) => ({ portfolioname: a.name, imgasd: (BASE_URL + a.album_bckpic), images: a.image_urls.map((c)=>({image:`${BASE_URL}/media/${c}`})), imgs: a.image_urls.map((c)=>(`${BASE_URL}/media/${c}`)) }))

    pdcounts.value              =   response.data.profiledata
  }
}
basic_detailfirst();


const portfolio         = ref([])
const galleryimages     = ref([])
const visibleRef        = ref(false)
const indexRef          = ref(0)
const showImg = (index: number) => { indexRef.value = index; visibleRef.value = true; }
const onHide = () => visibleRef.value = false;
const moveDisabled = ref(true);


const rating = ref(3);



const vendorstatus = ref(false);
const statusvalue = ref('Suspended');
const statusitem = ref(['Suspended', 'Active']);

const updateStatus = () => {
  const currentIndex = statusitem.value.indexOf(statusvalue.value);
  const nextIndex = (currentIndex + 1) % statusitem.value.length;
  statusvalue.value = statusitem.value[nextIndex];
  // Here you can add logic to send update request to the server if needed
  vendorstatus.value = false; // Close the menu
}; 

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

/*--Booking table data --*/
import serviceimg1 from "@/assets/images/customer/catering.jpg";
const bookingData = ref([
    {
        serviceservice: "Caterers",
        vendorserviceimg: serviceimg1,
        serviceprovidername: "Empire Restaurant",
        vendorserviceprice: "$450",
        deposit: "30%",
        link: "/",
        location: "Delhi"
    },
]);

async function package_listing() {
  try {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
    const response = await axios.post(`/home/package_listing`, {}, config);
    if (response.data.package_data) {
        bookingData.value = response.data.package_data
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
package_listing();

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
    991: { itemsToShow: 4 },
    1500: { itemsToShow: 4 },
    1800: { itemsToShow: 4 },
    2200: { itemsToShow: 4 },
};
const carouselfirstRef = ref(null);
const nextfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.next(); };
const prevfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.prev(); };
const packageslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 3, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,
};
const packageslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 3 },
    2200: { itemsToShow: 3 },
};
const packageref = ref(null);
const nextfirstSlidepack = () => { packageref.value && packageref.value.next(); };
const prevfirstSlidepack = () => { packageref.value && packageref.value.prev(); };

</script>


<template>
    <v-row class="mb-4">
        <v-col cols="12" md="7">
            <v-card elevation="10" class="mb-6 userbackPaper border">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="ps-4 pb-5 pt-2">
                        <v-col cols="12" md="6">
                            <v-avatar  size="100" class="ml-n2 avtar-border mb-3">
                                <img :src="ppic" alt="usericon" height="100"/>
                            </v-avatar>
                            <div>
                                <div class="">
                                    <!-- <div class="d-flex align-center mb-3 gap-2">
                                        <v-chip
                                            rounded="lg"
                                            :class="[statusvalue === 'Active' ? 'font-weight-semibold success' : 'font-weight-semibold error']"
                                            size="small"
                                            :color="[statusvalue === 'Active' ? 'success' : 'error']"
                                            label>{{ statusvalue }}</v-chip>

                                        <v-menu v-model="vendorstatus" :close-on-content-click="false" anchor="top">
                                            <template v-slot:activator="{ props }">
                                            <PencilIcon v-bind="props" class="ml-2" start color="success" size="15" />
                                            </template>
                                            <v-card min-width="300">
                                            <v-list>
                                                <v-list-item>
                                                <div class="my-4 pt-3">
                                                    <v-autocomplete v-model="statusvalue" :items="statusitem" density="compact" label="Change Status" color="primary" variant="outlined" hide-details></v-autocomplete>
                                                </div>
                                                </v-list-item>
                                            </v-list>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>

                                                <v-btn text @click="vendorstatus = false" flat class="rounded-sm bg-error" size="small"> Close </v-btn>
                                                <v-btn color="success" text @click="updateStatus" flat class="rounded-sm bg-success" size="small"> Update </v-btn>
                                            </v-card-actions>
                                            </v-card>
                                        </v-menu>
                                    </div> -->
                                    <h5 class="text-h4 mb-2 text-13 ">{{f_name}} {{l_name}}</h5>
                                    <div class="mb-2">
                                        <div class="text-subtitle-2 d-flex align-center font-weight-semibold ">Logged Since : {{cdate}}</div>
                                    </div>
                                    
                                </div>
                                <div class="d-flex gap-3">
                                    <div class="text-subtitle-2 d-flex align-center font-weight-semibold"><UserExclamationIcon  size="15" stroke-width="2" class="me-1"/>{{mypack.ptype}} Vendor</div>
                                    <div class="text-subtitle-2 d-flex align-center font-weight-semibold"><LocationIcon  size="15" stroke-width="2" class="me-1"/>{{city}}, {{zipmodal}}</div>
                                </div>
                                
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex flex-column justify-end align-md-end align-start">
                            
                            <div class="d-flex align-end justify-start  py-1 gap-2">
                                <!-- <v-btn variant="flat" color="success" class="rounded-sm" size="small" to="/profile-settings/basicdetails"> <MessageIcon stroke-width="1.5" size="15" class="mr-1" />Chat</v-btn> -->
                                <v-btn variant="flat" color="primary" class="rounded-sm" size="small" :to="'/vendor-profile/' + vid"> <EyeIcon stroke-width="1.5" size="15" class="mr-1" />Public Profile</v-btn>
                                <v-btn variant="flat" color="primary" class="rounded-sm" size="small" to="/profile-settings/basicdetails"> <PencilIcon stroke-width="1.5" size="15" class="mr-1" />Edit Profile</v-btn>
                                <!-- <v-menu v-model="vendorstatus" :close-on-content-click="false" anchor="top">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="info" v-bind="props" flat size="small" class="rounded-sm"> 
                                            <ReplaceIcon stroke-width="1.5" size="15" class="mr-1" />
                                            Change Status </v-btn>
                                    </template>

                                    <v-card min-width="300">

                                        <v-list>
                                            <v-list-item >
                                                <div class="my-4 pt-3">
                                                    <v-autocomplete v-model="statusvalue" :items="statusitem" density="compact" label="Change Status" color="primary" variant="outlined" hide-details></v-autocomplete>
                                                </div>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn text @click="vendorstatus = false" flat class="rounded-sm bg-error" size="small"> Close </v-btn>
                                        <v-btn color="success" text @click="vendorstatus = false" flat class="rounded-sm bg-success" size="small"> Update </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu> -->
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>

            <!-- <v-card elevation="10" class="overflow-hidden mb-4 border">
                <div class="background-gradient">
                    <div class="susStyle">
                        <v-chip rounded="lg" class="font-weight-semibold mb-3 bg-error"
                            size="small" label>Suspended</v-chip>
                    </div>
                    <img :src="profileBg" alt="profile" class="w-100 profileBannerImg" />
                </div>
                <div>
                    <v-row class="mt-1 ma-3 py-0">
                        <v-col cols="12" sm="8" class="d-flex justify-start order-sml-first">
                            <div class="text-start top-spacer d-flex align-center gap-3">
                                
                                <div class="avatar-border top-Minus">
                                    <v-avatar size="80" class="userImage">
                                        <img :src="ppic" width="80" alt="Mathew" />
                                    </v-avatar>
                                </div>
                                <div>
                                    <h5 class="text-h4 mb-3 text-13 ">{{f_name}} {{l_name}}</h5>
                                    <div class="d-flex gap-3">
                                        <div class="text-subtitle-2 d-flex align-center font-weight-semibold"><UserExclamationIcon  size="15" stroke-width="2" class="me-1"/>{{mypack.ptype}} Vendor</div>
                                        <div class="text-subtitle-2 d-flex align-center font-weight-semibold"><LocationIcon  size="15" stroke-width="2" class="me-1"/>{{city}}, {{zipmodal}}</div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4" class="d-flex align-start justify-center justify-sm-end order-sm-third">
                            <div class="d-flex align-center justify-end  py-1 gap-2">
                                <v-btn variant="flat" color="success" class="rounded-sm" size="small" to="/profile-settings/basicdetails"> <MessageIcon stroke-width="1.5" size="15" class="mr-1" />Chat</v-btn>
                                <v-menu v-model="vendorstatus" :close-on-content-click="false" anchor="top">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="info" v-bind="props" flat size="small" class="rounded-sm"> 
                                            <ReplaceIcon stroke-width="1.5" size="15" class="mr-1" />
                                            Change Status </v-btn>
                                    </template>

                                    <v-card min-width="300">

                                        <v-list>
                                            <v-list-item >
                                                <div class="my-4 pt-3">
                                                    <v-autocomplete v-model="statusvalue" :items="statusitem" density="compact" label="Change Status" color="primary" variant="outlined" hide-details></v-autocomplete>
                                                </div>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn text @click="vendorstatus = false" flat class="rounded-sm bg-error" size="small"> Close </v-btn>
                                        <v-btn color="success" text @click="vendorstatus = false" flat class="rounded-sm bg-success" size="small"> Update </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-card> -->
            <v-card elevation="10" class="overflow-hidden mb-5 border">
                
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row>
                        <v-col cols="12" class="py-4">
                            <v-row>
                                <v-col cols="12" md="7">
                                    <div class="mb-8">
                                    <h4 class="text-h6 text-Darklight mb-4">Personal Information</h4>
                                    <div>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <UserIcon size="18" stroke-width="2" class="me-1"/> Name :  
                                            </span>
                                            <span class="">{{f_name}} {{l_name}}</span>
                                        </p>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <GlobeIcon size="18" stroke-width="2" class="me-1"/> Country :  
                                            </span>
                                            <span class="">{{country}}</span>
                                        </p>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <MapPinIcon size="18" stroke-width="2" class="me-1"/> State :  
                                            </span>
                                            <span class="">{{state}}</span>
                                        </p>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <BuildingIcon size="18" stroke-width="2" class="me-1"/> City :  
                                            </span>
                                            <span class="">{{city}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <h4 class="text-h6 text-Darklight mb-4">Contacts</h4>
                                    <div>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <MailIcon size="18" stroke-width="2" class="me-1"/> Email :  
                                            </span>
                                            <span class="">{{u_email}}</span>
                                        </p>
                                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                                            <span class="text-Darklight d-flex align-center me-1 ">
                                                <PhoneIcon size="18" stroke-width="2" class="me-1"/> Phone Number :  
                                            </span>
                                            <span class="">{{ccode}} {{u_phone}}</span>
                                        </p>
                                    </div>
                                </div>
                                </v-col>
                                <v-col cols="12" md="5" class="pa-2">
                                    <v-card elevation="10" class="bg-grey100">
                                        <v-card-item>
                                            <div class="text-center">
                                                <div class="v-card-title text-h2 font-weight-semibold pa-0 text-center">4.0
                                                </div>
                                                <v-rating half-increments disabled v-model="rating" density="compact" color="warning" size="small"></v-rating>
                                                <router-link to="/" class="textDark text-center">
                                                    <div class="v-card-title text-h6 pa-0 d-flex justify-center align-center gap-2">Total Reviews
                                                        <ArrowUpRightIcon stroke-width="2   " size="15" />
                                                    </div>
                                                </router-link>
                                                <p class="text-Darklight mb-0 text-subtitle-2">Review From Couples</p>
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
            <h4 class="text-h6 text-Darklight mb-4" >Active Package</h4>
            <v-card elevation="10"  rounded="md" class="bg-lightsecondary border-primary border">
                <v-card-item class="py-5 px-3 px-md-8 ">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center" v-if="mypack.name">
                            <span class="checkPackage bg-primary d-flex align-center justify-center me-md-4 me-2">
                                <ChecksIcon stroke-width="2" size="17" class="" />
                            </span>
                            <div class="position-relative py-2">
                                <v-avatar size="60" rounded="md" variant="flat" class="packselectimg bg-dark">    
                                    <img :src="packageIcon" alt="" class="w-100">
                                </v-avatar>
                            </div>
                            
                            <div class="pl-md-4 pl-2 mt-n1">
                                <h5 class="text-subtitle-4 font-weight-semibold text-no-wrap textSecondary" >{{mypack.name}}
                                </h5>
                                <h6 class="text-subtitle-2 font-weight-semibold text-no-wrap mt-1 textSecondary">
                                    ${{mypack.price}}/Monthly
                                </h6>
                            </div>
                        </div>
                        <div class="d-flex align-center" v-else>
                            <h5 class="text-subtitle-4 font-weight-semibold text-no-wrap textSecondary" >Please select a package.</h5>
                        </div>
                        
                        <div>
                            <v-btn  color="secondary" flat v-bind="props" size="small" to="/profile-settings/mypackage">
                                <PencilIcon stroke-width="2" size="18" class="" />
                                Change Package 
                            </v-btn>
                        </div>
                    </div>
                        
                </v-card-item>
            </v-card>   
        </v-col>
        <v-col cols="12" md="5">
            <v-row class="">
                <v-col cols="12" md="6" class="px-2 py-2">
                    <v-card elevation="10" class="bg-grey200">
                        <v-card-item class="px-5 py-5 ">
                            <div class="v-card-title text-h5 font-weight-semibold pa-0 ">${{pdcounts[0]}}
                            </div>
                            <div  class="textDark">
                                <div class="v-card-title text-subtitle-1 font-weight-semibold pa-0 d-flex align-center gap-2">
                                    Total Paid Amount<ArrowUpRightIcon stroke-width="2" size="15" />
                                </div>
                            </div>
                                <p class="text-Darklight mb-0 text-subtitle-2">Paid to the platform</p>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" class="px-2 py-2">
                    <v-card elevation="10" class="bg-grey200">
                        <v-card-item class="px-5 py-5">
                            <div class="v-card-title text-h5 font-weight-semibold pa-0 ">{{pdcounts[1]}} 
                            </div>
                            <router-link to="/" class="textDark">
                                <div class="v-card-title text-subtitle-1 font-weight-semibold pa-0 d-flex align-center gap-2">
                                        Total Bookings
                                        <ArrowUpRightIcon stroke-width="2   " size="15" />
                                </div>
                            </router-link>
                                <p class="text-Darklight mb-0 text-subtitle-2">Vendor All Bookings</p>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" class="px-2 py-2">
                    <v-card elevation="10" class="bg-grey200">
                        <v-card-item class="px-5 py-5">
                            <div class="v-card-title text-h5 font-weight-semibold pa-0 d-flex align-center gap-2">{{pdcounts[2]}}
                            </div>
                            <router-link to="/" class="textDark">
                                <div class="v-card-title text-subtitle-1 font-weight-semibold pa-0 d-flex align-center gap-2">Total Invoices
                                    <ArrowUpRightIcon stroke-width="2   " size="15" />
                                </div>
                                
                            </router-link>
                            <p class="text-Darklight mb-0 text-subtitle-2">Couples/Admin</p>        
                        </v-card-item>
                    </v-card>
                    
                </v-col>
                <v-col cols="12" md="6" class="px-2 py-2">
                    <v-card elevation="10" class="bg-grey200">
                        <v-card-item class="px-5 py-5">
                            <div class="v-card-title text-h5 font-weight-semibold pa-0 d-flex align-center gap-2">{{pdcounts[3]}}
                            </div>
                            <router-link to="/" class="textDark">
                                <div class="v-card-title text-subtitle-1 font-weight-semibold pa-0 d-flex align-center gap-2">Total Contracts
                                    <ArrowUpRightIcon stroke-width="2   " size="15" />
                                </div>
                                
                            </router-link>
                            <p class="text-Darklight mb-0 text-subtitle-2">All Contracts with Customer</p>        
                        </v-card-item>
                    </v-card>
                    
                </v-col>
                
            </v-row>
            <v-card elevation="10" class="overflow-hidden  mt-6">
                <v-card-item class="pa-sm-6 pa-3">
                    <div class="mb-8">
                        <img :src="bpic" alt="profile" class="w-100 profileBannerImg rounded mb-4" />
                        <h4 class="text-h6 text-Darklight mb-4">Business Information</h4>
                        <div>
                            <p class="text-subtitle-1 d-flex align-md-center align-start font-weight-medium mb-4">
                                <span class="text-Darklight text-no-wrap d-flex align-center me-1 ">
                                    <BriefcaseIcon size="18" stroke-width="2" class="me-1"/>Business Name :  
                                </span>
                                <span class="">{{bdetails.brandValue}}</span>
                            </p>
                            <p class="text-subtitle-1 d-flex align-md-center align-start font-weight-medium mb-4">
                                <span class="text-Darklight text-no-wrap d-flex align-center me-1 ">
                                    <CategoryIcon size="18" stroke-width="2" class="me-1"/> Service Provided
   :  
                                </span>
                                <span class="">{{ bdetails.bcats }}</span>
                            </p>
                            <p class="text-subtitle-1 d-flex align-md-center align-start font-weight-medium mb-4">
                                <span class="text-Darklight text-no-wrap d-flex align-center me-1 ">
                                    <BuildingIcon size="18" stroke-width="2" class="me-1"/> Offered Cities :  
                                </span>
                                <span class="">{{ bdetails.wedcities }}</span>
                            </p>
                            <p class="text-subtitle-1 d-flex align-md-center align-start font-weight-medium mb-4">
                                <span class="text-Darklight text-no-wrap d-flex align-center me-1 ">
                                    <MapPinIcon size="18" stroke-width="2" class="me-1"/> Business Location :  
                                </span>
                                <span class="">{{ bdetails.blocation }}</span>
                            </p>
                            <p class="text-subtitle-1 d-flex align-md-center align-start font-weight-medium mb-4">
                                <span class="text-Darklight text-no-wrap d-flex align-center me-1 ">
                                    <CalendarEventIcon size="18" stroke-width="2" class="me-1"/> Covered Events :  
                                </span>
                                <span class="">{{ bdetails.EventCovered }}</span>
                            </p>
                                <p class="text-subtitle-1 font-weight-medium mb-4">
                                    <span class="text-Darklight text-no-wrap d-flex align-center me-1 mb-2 ">
                                        <FileDescriptionIcon size="18" stroke-width="2" class="me-1"/> Business Description :  
                                    </span>
                                    <div class="setHeightDec scroll-style border pa-2 rounded" style="line-height:1.6em;font-size:13px;" v-html="bdetails.bdescription">
                                    </div>
                                </p>
                        </div>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="12">
            <v-card elevation="0" class="border">
                <v-card-item class="pa-sm-6 pa-3">
                <v-row>
                    <v-col cols="12" sm="8">
                        <h4 class="text-h6 text-Darklight mb-4">Portfolios</h4>
                    </v-col>
                    <v-col cols="12" sm="4" class="d-flex align-center justify-center justify-sm-end order-sm-third">
                        <div class="d-flex align-center justify-end  py-1 gap-3">
                            <v-btn variant="flat" color="primary" class="rounded-sm" size="small" to="/profile-settings/portfolios"> <PlusIcon stroke-width="1.5" size="15" class="mr-1" />Add Portfollio</v-btn>
                        </div>
                    </v-col>
                </v-row>


                    <!-- <v-card elevation="0" class=" mt-6 border-0" color="">
                        <v-card-item class="text-center">
                            <AlertCircleIcon  stroke-width="1.5" size="50" class="mr-2 text-primary" />
                            <h5 class="text-h5 pt-3 text-primary">You haven't added any portfolio yet.</h5>
                            <v-btn class="bg-primary rounded-sm mt-2" size="small">Add Portofolio</v-btn>
                        </v-card-item>
                    </v-card> -->

                    <div v-if="portfolio.length">
                        <div class="position-relative">
                            <carousel ref="carouselfirstRef" :settings="vendorslideSettings" :breakpoints="vendorslideBreakpoints" class="overflow-hidden slider-reset row">
                                <slide v-for="item in portfolio" :key="item.id" class="pt-2 pb-4 px-2">
                                    <v-card elevation="10" @click="clickFunModal(item)" 
                                        class="album-card-img d-flex align-end" :style="{ backgroundImage: `url(${item.imgasd})` }">
                                        <v-card-item class="position-relative pa-3 w-100 ">
                                            <h3
                                                class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize text-start">
                                                {{ item.portfolioname }} </h3>
                                                <h3
                                                class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize text-start">
                                                ({{item.images.length}})</h3>
                                        </v-card-item>
                                    </v-card>
                                    <v-dialog v-model="item.dialog" fullscreen
                                        transition="dialog-bottom-transition">


                                        <v-card>
                                            <div dark
                                                class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                                color="">
                                                <v-toolbar-title
                                                    class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                                    Images from
                                                    this album </v-toolbar-title>
                                                <v-btn icon color="" @click="item.dialog = false" flat
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
                                                            <img :src="card.image" alt="gallery" width=""
                                                                class="albumsingleimg rounded" />
                                                        </v-card>

                                                        <vue-easy-lightbox :visible="visibleRef"
                                                            :moveDisabled="moveDisabled" :imgs="item.imgs"
                                                            :index="indexRef" @hide="onHide" />

                                                    </v-col>
                                                </v-row>
                                            </v-card-item>
                                        </v-card>
                                    </v-dialog>
                                </slide>
                            </carousel>
                        </div>
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
                    </div>
                    <!-- <v-row>
                        <v-col cols="12" md="3" v-for="item in portfolio" :key="item.id">
                            
                            <v-card elevation="10" @click="clickFunModal(item)" 
                                class="album-card-img d-flex align-end" :style="{ backgroundImage: `url(${item.imgasd})` }">
                                <v-card-item class="position-relative pa-3 w-100">
                                    <h3
                                        class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize">
                                        {{ item.portfolioname }} </h3>
                                         <h3
                                        class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize">
                                        ({{item.images.length}})</h3>
                                </v-card-item>
                            </v-card>
                            <v-dialog v-model="item.dialog" fullscreen
                                transition="dialog-bottom-transition">


                                <v-card>
                                    <div dark
                                        class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                        color="">
                                        <v-toolbar-title
                                            class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                            Images from
                                            this album</v-toolbar-title>
                                        <v-btn icon color="" @click="item.dialog = false" flat
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
                                                    <img :src="card.image" alt="gallery" width=""
                                                        class="albumsingleimg rounded" />
                                                </v-card>

                                                <vue-easy-lightbox :visible="visibleRef"
                                                    :moveDisabled="moveDisabled" :imgs="item.imgs"
                                                    :index="indexRef" @hide="onHide" />

                                            </v-col>
                                        </v-row>
                                    </v-card-item>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row> -->
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="12">
            <v-card elevation="0" class="border">
                <v-card-item class="pa-sm-6 pa-3">
                <v-row>
                    <v-col cols="12" sm="8">
                        <h4 class="text-h6 text-Darklight mb-4">Packages</h4>
                    </v-col>
                    <v-col cols="12" sm="4" class="d-flex align-center justify-center justify-sm-end order-sm-third">
                        <div class="d-flex align-center justify-end  py-1 gap-3">
                            <v-btn variant="flat" color="primary" class="rounded-sm" size="small" to="/packages"> <PlusIcon stroke-width="1.5" size="15" class="mr-1" />Add Package</v-btn>
                        </div>
                    </v-col>
                </v-row>
                <div class="position-relative" v-if="bookingData.length">
                    <carousel ref="packageref" :settings="packageslideSettings" :breakpoints="packageslideBreakpoints"
                    class="overflow-hidden slider-reset row">
                        <slide v-for="item in bookingData" :key="item" class="pt-2 pb-4 px-2">
                            <v-card elevation="10" class="vendor-card-hover h-100">
                                <v-card-item class="pa-4">

                                    <div class="position-relative d-flex overflow-hidden">
                                        <!-- <img :src="item.vendorserviceimg" class="rounded vendormainimg"> -->
                                        <img v-if="item.package_logo !== '/media/default.jpg'" :src="BASE_URL + item.package_logo" class="rounded vendormainimg">
                                        <img v-else :src="serviceimg1" class="rounded vendormainimg">
                                        <v-chip v-if="item.category" rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>
                                            {{ item.category.name }}
                                        </v-chip>
                                        <div class="viewServiceBtn d-flex">

                                            <v-btn color="success" :to="'/edit-package/' + item.id" variant="flat" class="me-2"
                                                size="small">
                                                <PencilIcon stroke-width="1.5" size="18" class="mr-2" />
                                                Edit 
                                            </v-btn>

                                            <v-btn color="error" variant="flat" class=" "
                                                size="small" :to="'/del-package/' + item.id">
                                                <TrashIcon stroke-width="1.5" size="18" class="mr-2" />
                                                Delete
                                            </v-btn>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-space-between align-center mt-2">
                                        <div>
                                            <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-0">
                                                ${{ item.price }}
                                            </h4>
                                        </div>
                                        
                                        <div>
                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                            ${{ item.price }}
                                            </h4>
                                        </div>
                                    </div>

                                    <div >
                                        <h6 class="text-body-2 text-13 text-start"><span class="font-weight-semibold"></span> {{ item.name }}    </h6>
                                        <h6 v-if="item.states && item.states.length > 0" class="text-body-2 text-13 text-start"><span class="font-weight-semibold">Locations
                                            : </span> 
                                        
                                            <span v-for="(c, index) in item.states" :key="c.id">
                                                 {{ c.state }}
                                                <span v-if="index !== item.states.length - 1">,</span>
                                            </span>
                                        </h6>
                                        <p v-if="item.advance_payment">
                                            <h6 v-if="item.advance_payment" class="text-body-2 text-13 text-start"><span class="font-weight-semibold">Deposit
                                                :</span>$ {{parseInt(item.advance_payment/100*item.price)}} ({{ item.advance_payment }}% of $ {{ item.price}})</h6>
                                        </p>

                                        <p v-else="item.full_price">
                                            <h6 v-if="item.full_price" class="text-body-2 text-13 text-start"><span class="font-weight-semibold">Deposit 
                                                    :</span>$ {{ parseInt(item.full_price) }} 
                                                    ({{ ((item.full_price / item.price) * 100).toFixed(2) }}% of $ {{ item.price }})
                                            </h6>
                                        </p>
                                       
                                    </div>
                                    
                                </v-card-item>
                            </v-card>
                        </slide>
                    </carousel>
                    <div class="carousel-arrows ctm_crousel">
                        <button @click="prevfirstSlidepack" class="arrow-button prev">
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
                        <button @click="nextfirstSlidepack" class="arrow-button next">
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
                </div>
                <!-- <v-row>
                    <v-col cols="12" lg="4" md="6" sm="6" xl="3" v-for="item in bookingData" :key="item">
                        <v-card elevation="10" class="vendor-card-hover h-100">
                            <v-card-item class="pa-4">

                                <div class="position-relative d-flex overflow-hidden">
                                    <img v-if="item.package_logo !== '/media/default.jpg'" :src="BASE_URL + item.package_logo" class="rounded vendormainimg">
                                    <img v-else :src="serviceimg1" class="rounded vendormainimg">
                                    <v-chip v-if="item.category" rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>
                                        {{ item.category.name }}
                                    </v-chip>
                                    <div class="viewServiceBtn d-md-flex d-block">

                                        <v-btn color="success" :to="'/edit-package/' + item.id" variant="flat" class="me-2"
                                            size="small">
                                            <PencilIcon stroke-width="1.5" size="18" class="mr-2" />
                                            Edit 
                                        </v-btn>

                                        <v-btn color="error" variant="flat" class=" "
                                            size="small" :to="'/del-package/' + item.id">
                                            <TrashIcon stroke-width="1.5" size="18" class="mr-2" />
                                            Delete
                                        </v-btn>
                                    </div>
                                </div>

                                <div class="d-flex justify-space-between align-center mt-2">
                                    <div>
                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-0">
                                            ${{ item.price }}
                                        </h4>
                                    </div>
                                    <div>
                                        <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                        ${{ item.price }}
                                        </h4>
                                    </div>
                                </div>

                                <div >
                                    <h6 v-if="item.cities && item.cities.length > 0" class="text-body-2 text-13"><span class="font-weight-semibold">Cities
                                        :</span> 
                                        <span v-for="(c, index) in item.cities" :key="c.id">
                                            {{ c.city }}
                                            <span v-if="index !== item.cities.length - 1">,</span>
                                        </span>
                                    </h6>
                                    <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Deposit
                                            :</span> {{ item.advance_payment }}%    </h6>
                                </div>

                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row> -->
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="12">
            <v-card elevation="0" class="border" >
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row>
                        <v-col cols="12" sm="8">
                            <h4 class="text-h6 text-Darklight mb-4">Website Links</h4>
                        </v-col>
                        <v-col cols="12" sm="4" class="d-flex align-center justify-center justify-sm-end order-sm-third">
                            <div class="d-flex align-center justify-end  py-1 gap-3">
                                <v-btn variant="flat" color="primary" class="rounded-sm" size="small" to="/profile-settings/portfolios"> <PlusIcon stroke-width="1.5" size="15" class="mr-1" />Add More Links</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="auto" v-for="link in weblinks" v-if="weblinks.length"> 
                            <v-card elevation="10" class="border bg-translate bg-grey100">
                                <v-card-item class="">
                                    <a :href="link" target="_blank" class="gap-3 d-flex align-center text-primary-custom justify-space-between text-decoration-none">
                                        <div class="widthSet1"><p class="text-truncate text-secondary">{{ link }}</p></div>
                                        <div class="widthSet d-flex justify-end align-center"> <ArrowUpRightIcon size="20"/> </div>
                                    </a>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col v-else>
                            No Weblinks added!
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
 
</template>

<style scoped lang="scss">
.border-end-custom {
    border-right: 1px solid rgb(0 0 0 / 9%);
}
.text-Darklight{
    color: #647588;
}
.profileBannerImg {
    height: 150px;
    object-fit: cover;
}
.background-gradient {
    background-image: linear-gradient(rgb(10 10 10), rgb(255 172 12));
    height: 150px;
}
.albumsingleimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}
.avatar-border {
    background-image: linear-gradient(rgb(10 10 10), rgb(255 172 12));
    border-radius: 50%;
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    .userImage {
        border: 2px solid rgb(255, 255, 255);
    }
}
.top-Minus {
    margin-top: -100px;
}
// .top-spacer {
//     margin-top: -95px;
// }

// .profiletab .v-slide-group__content {
//     justify-content: end;
//     .v-btn--variant-text .v-btn__overlay {
//         background: transparent;
//     }
// }

.checkPackage{
    width: 25px;
    height: 25px;
    border-radius: 50%;
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
.textDark {
    color: #000 !important;
    text-decoration: none;
}
.susStyle {
    position: absolute;
    right: 10px;
    top: 10px;
}
.userbackPaper{
    background: url(@/assets/images/wedding/lighting.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.userbackPaper:before {
    width: 100%;
    height: 100%;
    background: #fff;
    content: "";
    position: absolute;
    opacity: 0.9;
    z-index: -1;
}
.setHeightDec {
    height: 100px;
    overflow-y: auto;
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
    z-index: 1;
}

.wishlist-icon {
    position: absolute;
    left: 10px;
    top: 7px;
    z-index: 1;
}



.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
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
.text-primary-custom {
    color: #000;
}
// .widthSet1 {
//     width: 80%;
// }
// .widthSet {
//     width: 20%;
// }
</style>