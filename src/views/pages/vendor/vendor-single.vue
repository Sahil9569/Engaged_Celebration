<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import vendormainimg from "@/assets/images/website/decoration1.jpg";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
const rating = ref(5);
const ratingreview = ref(0);
const tab4 = ref(null);
const dialog = ref(false);
const dialogreview = ref(false);
import image1 from '@/assets/images/customer/decorator.jpeg';
import image3 from '@/assets/images/customer/catering.jpg';
import image4 from '@/assets/images/customer/catering2.jpg';
import image5 from '@/assets/images/customer/decorator.jpeg';
import image6 from '@/assets/images/customer/destination.webp';
import image7 from '@/assets/images/customer/makeUp.png';
import image8 from '@/assets/images/customer/djs.jpg';
import image9 from '@/assets/images/customer/photography.webp';


import user1 from "@/assets/images/profile/user-1.jpg";
import user2 from "@/assets/images/profile/user-2.jpg";
import user3 from "@/assets/images/profile/user-3.jpg";
import user4 from "@/assets/images/profile/user-4.jpg";

import { Calendar } from '@progress/kendo-vue-dateinputs';
import serviceimg from "@/assets/images/customer/destination.webp";


const clickFunModal = (item: any) => {
    item.dialog = true
}

const selectedDate = ref([]);

const clickFunModalbookin = (item: any) => { item.dialogbooking = true }

const wishList = ref(true)
const fucToggle = () => {
    wishList.value = !wishList.value
}

const galleryimages = ref([
    {
        image: image1,
    },
    {
        image: image3,
    },
    {
        image: image4,
    },
    {
        image: image5,
    },
    {
        image: image6,
    },
    {
        image: image7,
    },
    {
        image: image8,
    },
    {
        image: image9,
    },
]);
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


const album = ref([
    {
        albumimg: image1,
        albumtitle: "mumbai",
    },
    {
        albumimg: image2,
        albumtitle: "Delhi",
    },
    {
        albumimg: image3,
        albumtitle: "chandigarh",
    },
    {
        albumimg: image4,
        albumtitle: "Hydrabaad",
    },
]);

const reviewCard = ref([
    {
        coupleimgphoto: user1,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Deepak Sajwan"
    },
    {
        coupleimgphoto: user2,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Palvi Sharma"
    },
    {
        coupleimgphoto: user3,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Gurikaran Singh"
    },
    {
        coupleimgphoto: user4,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Sahil Thakur"
    },
]);


const servicefaq = ref([
    {
        question: "First Question",
        answer: " lorem dolor in the first part of the first part of the first part of the first part of the first part of   the first ",
    },
    {
        question: "First Question",
        answer: " lorem dolor in the first part of the first part of the first part of the first part of the first part of   the first ",
    }
])





/*--Booking table data --*/
import serviceimg1 from "@/assets/images/website/decoration1.jpg";
import serviceimg2 from "@/assets/images/website/decoration2.jpg";
import serviceimg3 from "@/assets/images/website/decoration3.jpg";
import serviceimg4 from "@/assets/images/website/decoration4.jpg";
import serviceimg5 from "@/assets/images/website/decoration5.jpg";
import serviceimg6 from "@/assets/images/website/decoration6.jpeg";
import serviceimg7 from "@/assets/images/website/decoration7.jpg";
import serviceimg8 from "@/assets/images/website/decoration8.jpg";
const bookingData = ref([
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg1,
        serviceprovidername: "Empire Decoration",
        vendorserviceprice: "$450",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg2,
        serviceprovidername: "Squad Decoration And Dj",
        vendorserviceprice: "$200",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg3,
        serviceprovidername: "Aesthetic Stories ",
        vendorserviceprice: "$150",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg4,
        serviceprovidername: "Empire Restaurant",
        vendorserviceprice: "$450",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg5,
        serviceprovidername: "Dewdrop Events",
        vendorserviceprice: "$800",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg6,
        serviceprovidername: "Empire Restaurant",
        vendorserviceprice: "$450",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg7,
        serviceprovidername: "Squad Entertainment And Dj",
        vendorserviceprice: "$200",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },
    {
        serviceservice: "Decoration",
        vendorserviceimg: serviceimg8,
        serviceprovidername: "Aesthetic Stories ",
        vendorserviceprice: "$150",
        vendorname: "Sunil Joshi",
        vendortype: "Open Vendor",
        link: "/single-vendor",
    },

]);

/*Slider*/
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
    991: { itemsToShow: 2 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 3 },
    2200: { itemsToShow: 4 },
};
const carouselfirstRef = ref(null);

const nextfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.next();
};

const prevfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.prev();
};


const action = ref('Single_servicePage')
const path = window.location.pathname;
const serviceId = path.split('/').pop();



async function category_listing() {
  try {
   
    const formData = new FormData();
    formData.append("Single_servicePage", action);
    formData.append("serviceId", categoryId);

    const response = await axios.post(`/home/single_service`, formData, config);
     console.log(response.data.data,"response.data.dataresponse.data.data")
        if (response.data.status == 'SAVED') {
           
        bookingData.value = response.data.data.map((elem: any) => ({

            "serviceservice": elem.category.name,
            "vendorserviceimg": elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + elem.package_logo,
            "serviceprovidername": elem.name,
             "vendorserviceprice": '$' + elem.price,
            "vendorname": `${elem.user.first_name} ${elem.user.last_name}`,
             "deposit": elem.advance_payment,
             "link": `/vendor-single/${elem.id}`,
             "location": elem.Cities,
        }));
        items.value = response.data.services.map((a: any) => (a.name))
        locationitems.value = response.data.cities.map((a: any) => (a.city))
    }
       
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

category_listing();






</script>


<template>
    <Header />
    <v-container class="container-width mt-16 pt-10">
        <v-row>
            <v-col cols="12">
                <v-row>
                    <div class="position-relative w-100">
                        <img :src="vendormainimg" class="main-img-vendor rounded mb-2">
                        <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                            label>Decorators</v-chip>
                    </div>
                    <v-col cols="12" md="8">

                        <div class="d-flex justify-space-between align-start">
                            <div class="">
                                <h2 class="text-no-wrap font-weight-semibold textSecondary">$600</h2>
                                <h2 class="text-no-wrap font-weight-semibold textSecondary">Dewdrop Events</h2>
                                <h6 class="text-subtitle-2 font-weight-semibold text-no-wrap textSecondary mt-1">Wedding
                                    Decorators in Location Name</h6>
                            </div>
                            <div>
                                <v-card class="bg-secondary rating-card" elevation="10">
                                    <v-card-item class="d-flex justify-center align-center text-center py-2 px-3">
                                        <p class="text-12">5/5</p>
                                        <v-rating half-increments v-model="rating" density="compact" color="warning"
                                            size="x-small"></v-rating>

                                        <p class="text-10 text-capitalize">Rating</p>
                                    </v-card-item>
                                </v-card>
                            </div>
                        </div>
                        <div class="py-4">
                            <v-card class="border-top border-bottom stickynavbar" elevation="0">
                                <v-card-item class="pa-0 rounded-0">
                                    <v-tabs v-model="tab4" color="primary" class="">
                                        <v-tab value="0000" color="secondary">
                                            <Receipt2Icon stroke-width="1.5" width="20" class="v-icon--start" /> Pricing
                                        </v-tab>
                                        <v-tab value="1111" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> About
                                        </v-tab>
                                        <v-tab value="2222" color="secondary">
                                            <PhotoIcon stroke-width="1.5" width="20" class="v-icon--start" /> Gallery
                                        </v-tab>
                                        <v-tab value="3333" color="secondary">
                                            <AlbumIcon stroke-width="1.5" width="20" class="v-icon--start" /> Albums
                                        </v-tab>
                                        <v-tab value="4444" color="secondary">
                                            <QuoteIcon stroke-width="1.5" width="20" class="v-icon--start" /> Reviews
                                        </v-tab>
                                        <v-tab value="5555" color="secondary">
                                            <QuoteIcon stroke-width="1.5" width="20" class="v-icon--start" /> FAQ
                                        </v-tab>
                                    </v-tabs>
                                </v-card-item>
                            </v-card>
                            <v-divider></v-divider>
                            <v-card-text class="bg-light border pa-4">
                                <v-window v-model="tab4">
                                    <v-window-item value="0000">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Pricing Information</h2>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Standard Indoor Decor Price
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                $500
                                            </p>
                                        </div>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Standard Outdoor Decor Price
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                $1000
                                            </p>
                                        </div>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Payment Policy
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                60% - At the Time of booking
                                            </p>
                                            <p class="text-body-1 text-13 text-primary">
                                                20% - On Event date
                                            </p>
                                            <p class="text-body-1 text-13 text-primary">
                                                20% - After deliverables are delivered
                                            </p>
                                        </div>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Concellation Policy
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                Before one week of the event and 50percent of the amount will be
                                                refunded by 60 percent of the advance
                                            </p>
                                        </div>
                                    </v-window-item>
                                    <v-window-item value="1111">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Vendor Information</h2>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Introduction
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                Dewdrop Events, based in Bangalore. My team and myself have been working
                                                since 2015 & have covered more than 50 weddings. Our mission is to add
                                                colours to your dreams and your events and turn them into your favourite
                                                memories. While you look for beautiful places, we are here to make your
                                                places look beautiful. We follow your vision and innovation. We help in
                                                making your wedding dream a beautiful reality by customizing the decor
                                                according to your wishes.
                                            </p>
                                        </div>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Working Since
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                2015
                                            </p>
                                        </div>
                                        <div class="mb-5">
                                            <h2
                                                class="text-secondary text-body-1 mb-1 font-weight-medium text-capitalize">
                                                Core Speciality
                                            </h2>
                                            <p class="text-body-1 text-13 text-primary">
                                                Flowers, Banner Prints, Audio Visuals, Decorative Draping, Event concept
                                                & Design, Lighting, Sounds, Mandap, Car Decoration, Fireworks, Tents,
                                                Home Decoration, Table Decoration, Venue Entrances
                                            </p>
                                        </div>
                                    </v-window-item>
                                    <v-window-item value="2222">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            All Gallery Images</h2>
                                        <v-row class="pa-2">
                                            <v-col class="pa-2" cols="12" md="4" sm="6"
                                                v-for="(card, index) in galleryimages" :key="index">


                                                <v-card elevation="10" class="card-hover overflow-hidden"
                                                    @click="() => showImg(index)">

                                                    <v-avatar size="150" class="rounded w-100 ">
                                                        <img :src="card.image" alt="gallery" width="450" class="" />
                                                    </v-avatar>
                                                </v-card>

                                                <vue-easy-lightbox :visible="visibleRef" :moveDisabled="moveDisabled"
                                                    :imgs="imgs" :index="indexRef" @hide="onHide" />

                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                    <v-window-item value="3333">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            All Albums</h2>
                                        <v-row class="pa-2">
                                            <v-col cols="12" md="3" v-for="item in album" :key="albumtitle">
                                                <v-dialog v-model="dialog" fullscreen :scrim="false"
                                                    transition="dialog-bottom-transition">
                                                    <template v-slot:activator="{ props }">
                                                        <v-card elevation="10" v-bind="props"
                                                            class="album-card-img d-flex align-end"
                                                            :style="{ backgroundImage: `url(${item.albumimg})` }">
                                                            <v-card-item class="position-relative pa-3 w-100">
                                                                <h3
                                                                    class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize">
                                                                    {{ item.albumtitle }}</h3>
                                                                <p
                                                                    class="text-subtitle-2 text-no-wrap font-weight-semibold text-white">
                                                                    (200) </p>
                                                            </v-card-item>
                                                        </v-card>
                                                    </template>
                                                    <v-card>
                                                        <div dark
                                                            class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                                            color="">
                                                            <v-toolbar-title
                                                                class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                                                Images from Mumbai
                                                                album</v-toolbar-title>
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
                                                                        <img :src="card.image" alt="gallery" width=""
                                                                            class="albumsingleimg rounded" />
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
                                    <v-window-item value="4444">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Post Reviews</h2>
                                        <v-row class="pa-2">
                                            <v-col cols="12">
                                                <v-card elevation="0 border-0 bg-lightprimary">
                                                    <v-card-item>
                                                        <v-row class="">
                                                            <v-col cols="12" md="6">
                                                                <div class="v-card-title text-h1 text-secondary pa-0">
                                                                    4.9</div>
                                                                <v-rating dssabled half-increments v-model="rating" density="compact"
                                                                    color="secondary" size="small"></v-rating>
                                                                <div class="v-card-title text-h5 text-secondary pa-0">
                                                                    Latest Reveiws</div>

                                                            </v-col>
                                                            <v-col cols="12" md="6"
                                                                class="d-flex justify-end align-center">
                                                                <v-dialog v-model="dialogreview" persistent
                                                                    class="dialog-mw" size="small">
                                                                    <template v-slot:activator="{ props }">
                                                                        <v-btn v-bind="props" variant="flat"
                                                                            color="secondary">
                                                                            <PencilIcon stroke-width="2" size="18"
                                                                                class="mr-2" />Write Review
                                                                        </v-btn>
                                                                    </template>
                                                                    <v-card class="pa-6">
                                                                        <div class="d-flex justify-space-between">
                                                                            <h4
                                                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                                Rate and Review - Dewdrop Events</h4>
                                                                            <v-btn icon color=""
                                                                                @click="dialogreview = false" flat
                                                                                variant="outlined" size="x-small"
                                                                                class="bg-error">
                                                                                <XIcon width="20" />
                                                                            </v-btn>
                                                                        </div>
                                                                        <v-row>
                                                                            <v-col cols="12">
                                                                                <v-label
                                                                                    class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                                                <v-text-field color="secondary"
                                                                                    variant="outlined" type="text"
                                                                                    placeholder="John Deo" hide-details>
                                                                                    <template v-slot:prepend-inner>
                                                                                        <UserIcon stroke-width="1.5"
                                                                                            size="22"
                                                                                            class="text-medium-emphasis mr-3" />
                                                                                    </template>
                                                                                </v-text-field>
                                                                            </v-col>
                                                                            <v-col cols="12">
                                                                                <v-label
                                                                                    class="font-weight-medium mb-2 text-secondary">Review</v-label>
                                                                                <v-textarea auto-grow variant="outlined"
                                                                                    placeholder="Hi, Do you  have a review fot our service?"
                                                                                    rows="3" color="secondary"
                                                                                    row-height="25" shaped hide-details>
                                                                                    <template v-slot:prepend-inner>
                                                                                        <Message2Icon stroke-width="1.5"
                                                                                            size="22"
                                                                                            class="text-medium-emphasis mr-3" />
                                                                                    </template>
                                                                                </v-textarea>
                                                                            </v-col>
                                                                            <v-col cols="12">
                                                                                <v-label
                                                                                    class="font-weight-medium mb-2 text-secondary">Review</v-label>
                                                                                <div>
                                                                                    <v-rating disabled half-increments v-model="ratingreview"
                                                                                        density="compact"
                                                                                        color="warning"
                                                                                        size="large"></v-rating>
                                                                                </div>

                                                                            </v-col>
                                                                        </v-row>
                                                                        <v-card-actions class="px-0 pt-5">
                                                                            <v-spacer></v-spacer>
                                                                            <v-btn class="bg-error" text
                                                                                @click="dialogreview = false" flat>
                                                                                Close
                                                                            </v-btn>
                                                                            <v-btn class="bg-secondary" text flat>
                                                                                Save
                                                                            </v-btn>
                                                                        </v-card-actions>
                                                                    </v-card>
                                                                </v-dialog>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="12">
                                                <h2
                                                    class="mb-4 text-body-2 text-uppercase font-weight-bold text-secondary">
                                                    All Reviews</h2>
                                                <v-card elevation="10" class="mb-4" v-for="item in reviewCard"
                                                    :key="item.coupleName">
                                                    <v-card-item class="d-flex pa-4">
                                                        <div>
                                                            <div class="d-flex align-center">
                                                                <v-avatar size="60" color="primary" variant="flat"
                                                                    rounded="sm">
                                                                    <img :src="item.coupleimgphoto" :alt="item.img"
                                                                        width="60" />
                                                                </v-avatar>
                                                                <div class="ms-2">
                                                                    <v-rating half-increments v-model="rating" density="compact"
                                                                        color="warning" size="small"></v-rating>
                                                                    <h4
                                                                        class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary ms-1">
                                                                        {{
                            item.coupleName }}</h4>
                                                                    <p class="text-body-2 text-13 ms-1">{{
                            item.reviewppostedtime }}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="">
                                                            <p class="text-body-1 mt-3 mb-6 text-13">
                                                                {{ item.reviewtext }}
                                                            </p>
                                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                    <v-window-item value="5555">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Frequently Asked
                                            Questions</h2>
                                        <v-row class="px-2 py-4">
                                            <v-col>
                                                <v-expansion-panels v-for="item in servicefaq" :key="item.question">
                                                    <v-expansion-panel elevation="10" class="mb-2">
                                                        <v-expansion-panel-title
                                                            class="text-body-1 py-3 font-weight-bold text-secondary">{{
                            item.question
                        }}</v-expansion-panel-title>
                                                        <v-expansion-panel-text
                                                            class="text-body-1 text-13 text-primary"> {{ item.answer
                                                            }}</v-expansion-panel-text>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                </v-window>
                            </v-card-text>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card elevation="10" class="bg-primary stick-info-card ">
                            <v-card-item>
                                <h2 class="textSecondary text-center">
                                    Welcome
                                </h2>
                                <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary text-center">
                                    Secure Your Wedding
                                    Vendors for <br> a Picture-Perfect Day!</p>
                                <div class="mt-4 text-center">
                                    <div class="">
                                        <v-btn flat color="secondary" variant="outlined" class="mb-3">
                                            <Message2Icon stroke-width="1.5" size="18" class="mr-2 " />Chat Vendor
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="secondary" variant="flat">
                                            <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                            Send Enquiry
                                        </v-btn>
                                    </div>

                                </div>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>

                <div class="mt-5">
                    <v-card elevation="10" class="border-0 bg-lightprimary">
                        <v-card-item>
                            <v-row class="py-6">
                                <v-col cols="12">
                                    <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 ">Similar
                                        <span class="text-secondary">Packages</span>
                                    </h3>
                                    <p class="text-13 text-body-1 text-primary">Choosing the Perfect Decorators for Your
                                        Wedding</p>
                                </v-col>
                                <v-col cols="12" class="position-relative">
                                    <carousel ref="carouselfirstRef" :settings="vendorslideSettings"
                                        :breakpoints="vendorslideBreakpoints"
                                        class="overflow-hidden slider-reset  pe-3">
                                        <slide v-for="item in bookingData" :key="item.vendorname"
                                            class="pt-2 pb-5 px-2">
                                            <v-card elevation="10" class="vendor-card-hover">
                                                <v-card-item class="pa-4">
                                                    <div class="position-relative d-flex overflow-hidden">
                                                        <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                                        <v-avatar class="bg-lighterror wishlist-icon" size="28"
                                                            @click="fucToggle">
                                                            <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'"
                                                                class="mdi text-error"></i>
                                                        </v-avatar>
                                                        <v-chip rounded="sm"
                                                            class="ma-2 font-weight-semibold bg-secondary badge-service"
                                                            size="small" label>{{ item.serviceservice }}</v-chip>
                                                        <v-btn color="secondary" variant="flat" to="/single-vendor"
                                                            class="viewServiceBtn d-block py-1" size="small">
                                                            <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                                            View Service
                                                        </v-btn>
                                                    </div>
                                                    <div class="d-flex justify-space-between align-start mt-2">
                                                        <div class="text-start">
                                                            <v-rating half-increments v-model="rating" density="compact" color="warning"
                                                                size="small"></v-rating>
                                                            <h4
                                                                class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary text-start">
                                                                {{ item.serviceprovidername }}</h4>
                                                        </div>
                                                        <div>
                                                            <h4
                                                                class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1 text-start">
                                                                {{ item.vendorserviceprice }}</h4>
                                                        </div>
                                                    </div>
                                                    <div class="text-start">
                                                        <h6 class="text-body-2 text-13 mb-0 mt-2"><span
                                                                class="font-weight-semibold">Vendor Name :</span> {{
                            item.vendorname }}
                                                        </h6>
                                                        <h6 class="text-body-2 text-13"><span
                                                                class="font-weight-semibold ">Vendor Type
                                                                :</span> {{ item.vendortype }}</h6>

                                                    </div>
                                                    <v-row class="mt-2">
                                                        <v-col>
                                                            <v-btn color="secondary" @click="clickFunModal(item)"
                                                                variant="flat" size="small" class="w-100 d-block">
                                                                <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                                                Send Enquiry
                                                            </v-btn>
                                                        </v-col>
                                                        <v-col>
                                                            <v-btn color="secondary" variant="flat" size="small"
                                                                class="w-100 d-block"
                                                                @click="clickFunModalbookin(item)">
                                                                <CalendarIcon stroke-width="1.5" size="18"
                                                                    class="mr-2" />
                                                                Book Now
                                                            </v-btn>
                                                        </v-col>
                                                        <v-dialog v-model="item.dialog" persistent class="dialog-mw"
                                                            size="small">
                                                            <v-card class="pa-6">
                                                                <div class="d-flex justify-space-between">
                                                                    <h4
                                                                        class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                        Send Enquiry - {{ item.serviceprovidername }}
                                                                    </h4>
                                                                    <v-btn icon color="" @click="item.dialog = false"
                                                                        flat variant="outlined" size="x-small"
                                                                        class="bg-error">
                                                                        <XIcon width="20" />
                                                                    </v-btn>
                                                                </div>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                                        <v-text-field color="secondary"
                                                                            variant="outlined" type="text"
                                                                            placeholder="John Deo" hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <UserIcon stroke-width="1.5" size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">Email</v-label>
                                                                        <v-text-field color="secondary"
                                                                            variant="outlined" type="text"
                                                                            placeholder="johndeo123@gmail.com"
                                                                            hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <MailIcon stroke-width="1.5" size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">Message</v-label>
                                                                        <v-textarea auto-grow variant="outlined"
                                                                            placeholder="Hi, Do you  have a review fot our service?"
                                                                            rows="3" color="secondary" row-height="25"
                                                                            shaped hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <Message2Icon stroke-width="1.5"
                                                                                    size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-textarea>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-card-actions class="px-0 pt-5">
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn class="bg-error" text
                                                                        @click="item.dialog = false" flat>
                                                                        Close
                                                                    </v-btn>
                                                                    <v-btn class="bg-secondary" text flat>
                                                                        Send Enquiry
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>
                                                        <v-dialog v-model="item.dialogbooking" persistent
                                                            class="dialog-mw" size="small">
                                                            <v-card class="pa-6">
                                                                <div class="d-flex justify-space-between">
                                                                    <h4
                                                                        class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                        Booking - {{ item.serviceprovidername }}</h4>
                                                                    <v-btn icon color=""
                                                                        @click="item.dialogbooking = false" flat
                                                                        variant="outlined" size="x-small"
                                                                        class="bg-error">
                                                                        <XIcon width="20" />
                                                                    </v-btn>
                                                                </div>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                                        <v-text-field color="secondary"
                                                                            variant="outlined" type="text"
                                                                            placeholder="John Deo" hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <UserIcon stroke-width="1.5" size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">Email</v-label>
                                                                        <v-text-field color="secondary"
                                                                            variant="outlined" type="text"
                                                                            placeholder="johndeo123@gmail.com"
                                                                            hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <MailIcon stroke-width="1.5" size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary">City</v-label>
                                                                        <v-autocomplete v-model="valuecity"
                                                                            :items="itemss" color="primary"
                                                                            variant="outlined"
                                                                            placeholder="Wedding City" hide-details>
                                                                            <template v-slot:prepend-inner>
                                                                                <LocationIcon stroke-width="1.5"
                                                                                    size="22"
                                                                                    class="text-medium-emphasis mr-3" />
                                                                            </template>
                                                                        </v-autocomplete>
                                                                    </v-col>
                                                                    <v-col cols="12">
                                                                        <v-label
                                                                            class="font-weight-medium mb-2 text-secondary d-block">Select
                                                                            Date</v-label>
                                                                        <div class="example-config">
                                                                            <v-chip color="secondary" variant="outlined"
                                                                                size="x-small"
                                                                                class="mr-1 mb-2 font-weight-bold"
                                                                                v-for="date in selectedDate">
                                                                                <span>{{
                            new Date(date).getDate() + '-' +
                            ((new
                                Date(date).getMonth() + 1) < 10
                                ? '0' + (new
                                    Date(date).getMonth() + 1) :
                                                                                        (new Date(date).getMonth() + 1))
                                                                                        + '-' + new
                                                                                        Date(date).getFullYear()
                                                                                        }}</span>
                                                                            </v-chip>
                                                                        </div>
                                                                        <calendar v-model="selectedDate"
                                                                            :mode="'multiple'" />



                                                                    </v-col>
                                                                </v-row>
                                                                <v-card-actions class="px-0 pt-5">
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn class="bg-error" text
                                                                        @click="item.dialogbooking = false" flat>
                                                                        Close
                                                                    </v-btn>
                                                                    <v-btn class="bg-secondary" text flat>
                                                                        Submit
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>
                                                    </v-row>
                                                </v-card-item>
                                            </v-card>
                                        </slide>
                                    </carousel>
                                    <div class="carousel-arrows ctm_crousel">
                                        <button @click="prevfirstSlide" class="arrow-button prev">
                                            <span>
                                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                        stroke-linejoin="round"></g>
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
                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                        stroke-linejoin="round"></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path
                                                            d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                            fill="#b4801c"></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-item>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </v-container>

    <!--Footer-->
    <Footer />
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
    position: sticky;
    top: 65px;
    z-index: 1;
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
    color: #b4801c;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-selected span.k-link,
.k-calendar .k-calendar-td.k-selected span.k-link:hover {
    background-color: #b4801c;
    color: #fff;
}
</style>
