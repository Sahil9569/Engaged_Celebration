<script setup lang="ts">
import { ref } from 'vue';
import { Carousel, Slide } from "vue3-carousel";



const categoryValue = ref('Select Vendor Category');
const categoryItems = ref(["Phographer", "Decorators", "DJ", "Makeup Artist"]);

const cityValue = ref('Select Vendor City');
const cityItems = ref(["Chandigarh", "Mohali", "Ambala"]);


const cap_value1 = ref([]);
const vendorcategory = ref([
    'DJ',
    'Photographer',
    'Decorator',
    'Mehndi Artist',
    'Caterer',
    'Jewellary',
    'Gifts'
]);

const cap_value2 = ref([]);
const items = ref([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7'
]);

const cap_value3 = ref([]);
const vendorcity = ref([
    'Chandigarh',
    'Mohali',
    'Ambala'
]);


const cap_value4 = ref([]);
const vendorprice = ref([
    '0-10k',
    '11-20k',
    '30-70k'
]);





/*User Review Section*/
import review1 from '@/assets/images/website/tab2.png';
import review2 from '@/assets/images/website/tab4.png';
import review3 from '@/assets/images/website/tab3.png';
import review4 from '@/assets/images/website/tab1.png';

const userReview = ref([
    {
        img: review1,
        titlewhite: 'Decoration Booking for ',
        titletheme: 'Your Special Occasion',
        subheaeding: 'Transform Your Event into an Unforgettable Experience',
        url: '/hello',
        btntext: "Book now",
    },
    {
        img: review2,
        titlewhite: 'Flower Booking for ',
        titletheme: 'Your Special Occasion',
        subheaeding: 'Enhance Your Event with the Beauty of Fresh Blooms',
        url: '/hello',
        btntext: "Book now",
    },
    {
        img: review3,
        titlewhite: 'DJ Booking for ',
        titletheme: 'Your Special Occasion',
        subheaeding: 'Set the Mood and Keep the Party Alive with Expert DJ Services',
        url: '/hello',
        btntext: "Book now",
    },
    {
        img: review4,
        titlewhite: 'Catering Booking for ',
        titletheme: 'Your Special Occasion',
        subheaeding: 'Elevate Your Event with Exquisite Cuisine and Impeccable Service',
        url: '/hello',
        btntext: "Book now",
    },
]);

/*Testimonials Slider*/
const bannerslider = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 1, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,
};
const bannerslidersetting = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 1 },
    991: { itemsToShow: 1 },
    1500: { itemsToShow: 1 },
    1800: { itemsToShow: 1 },
    2200: { itemsToShow: 1 },
};
const carouselRef = ref(null);

const nextSlide = () => {
    carouselRef.value && carouselRef.value.next();
};

const prevSlide = () => {
    carouselRef.value && carouselRef.value.prev();
};

//dummycode





const slides =ref([1,2,3,4])







</script>
<template>
    <div class="banner-slider banner  position-relative">
        <!-- <div class="blur-1" bis_skin_checked="1">
            <img src="@/assets/images/website/Blur_1.png" alt="bg blur">
        </div>
        <div class="blur-2" bis_skin_checked="1">
            <img src="@/assets/images/website/Blur_2.png" alt="bg blur">
        </div>  -->
        <div class="banner-one-shape1" bis_skin_checked="1"></div>
        <div class="banner-one-shape2" bis_skin_checked="1"></div>
        <div class="banner-one-shape3" bis_skin_checked="1"></div>
        <!-- <div class="banner-one-shape4" bis_skin_checked="1">
            <img src="@/assets/images/website/banner-one-shap4.png">
        </div> -->
     
                <v-card  class="homepagebanner d-flex align-center ">
                    <v-container class="container-width">
                        <v-row class="align-center banner-section">
                       
                            <v-col cols="12" lg="6" md="6" class="mr-10">
                                <h1 class="bannerTitle pt-1 font-weight-bold text-left ctm-heading sailFont"
                                    data-aos="fade-up" data-aos-duration="500">
                                    Book us for Your  Special<br><span class="text-secondary"> Occasion  </span>
                                </h1>
                                <p class="pt-4 pb-4 font-weight-regular paratext text-left" data-aos="fade-up"
                                    data-aos-duration="800">
                                    Find the best wedding vendors with thousands of trusted reviews by relying on the experiences and opinions of others who have used these vendors, couples can make informed decisions about who to trust with their special day.
                                </p>
                                <div class="vendor-filtr">
                                    <v-col cols="4" md="3">
                                        <v-autocomplete v-model="cap_value2" :items="vendorcategory" color="secondary"
                                            label="Service" variant="outlined" hide-details>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="4" md="3">
                                <v-autocomplete v-model="cap_value3" :items="vendorcity" color="secondary"
                                    label="Location" variant="outlined" hide-details>
                                </v-autocomplete>
                            </v-col>
                           <v-col cols="4" md="3">
                                <v-autocomplete v-model="cap_value4" :items="vendorprice" color="secondary"
                                    label="Budget" variant="outlined" hide-details>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn color="secondary" class="form-btn w-100">Get Started</v-btn>
                            </v-col>
                                </div>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" class="">
                                <div class="position-relative">
                                    <img src="@/assets/images/website/tabs.png" class="tab-img">
                                </div>
                                <v-carousel ref="carouselRef" hide-delimiter-background hide-delimiters class="overflow-hidden" height="auto" cycle="true" interval="4000" :show-arrows="false" >
                                <v-carousel-item v-for="card in userReview" :key="card.img">
                                    
                                        <img :src="card.img" class="img-responsive w-100 bn_img">
                                    </v-carousel-item>
                                </v-carousel>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
        <!-- <div class="py-4 custom-banner-form">
            <v-container class="container-width"> -->
                <!-- <div class="home-baner-search d-flex">
                    <v-combobox v-model="categoryValue" :items="categoryItems" hide-details flat class="w-50 style-input me-4"></v-combobox>
                    <v-combobox v-model="cityValue" :items="cityItems" hide-details class="style-input2 me-4"></v-combobox>
                    <button type="button" class="v-btn v-btn--flat v-theme--BLUE_THEME bg-secondary v-btn--density-default v-btn--variant-elevated px-16 py-5 form-btn">
                    <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span><span class="v-btn__content" data-no-activator="">Submit</span>
                    </button>
                    
                </div> -->
                <!-- <v-row>
                <v-col cols="12" md="5" lg="5" sm="5">
                    <v-combobox v-model="categoryValue" :items="categoryItems" hide-details flat class="style-input"></v-combobox>
                </v-col>
                <v-col cols="12" md="4" lg="4" sm="4">
                    <v-combobox v-model="cityValue" :items="cityItems" hide-details class="style-input2"></v-combobox>
                </v-col>
                <v-col cols="12" md="3" lg="3" sm="3">
                    <v-btn color="secondary" class="form-btn w-100">Submit</v-btn>
                </v-col>
               </v-row> -->
                <!-- <v-row class="form-row px-1 py-1 rounded">
                    <v-col cols="12" md="10" class="vendor-filtr">
                        <v-row>
                            <v-col cols="4" md="3">
                                <v-autocomplete v-model="cap_value2" :items="vendorcategory" color="secondary"
                                    label="Service" variant="outlined" hide-details>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="4" md="3">
                                <v-autocomplete v-model="cap_value3" :items="vendorcity" color="secondary"
                                    label="Location" variant="outlined" hide-details>
                                </v-autocomplete>
                            </v-col>
                           <v-col cols="4" md="3">
                                <v-autocomplete v-model="cap_value4" :items="vendorprice" color="secondary"
                                    label="Budget" variant="outlined" hide-details>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-btn color="secondary" class="form-btn w-100">Get Started</v-btn>
                    </v-col>
                </v-row> -->
            <!-- </v-container>
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
img.img-responsive.w-100.bn_img {
    border-radius: 10px;
}
.banner-section {
    flex-wrap: nowrap;
}

.homepagebanner {
       background-image: url(/src/assets/images/website/bgnew-shpee.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        //background: antiquewhite;
        padding: 120px 0px;
        box-shadow: none;
        border-radius: 0 !important;
    }

@-webkit-keyframes gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.carousel__slide .v-card {
    margin: 0px !important;
}

.carousel-arrows button.arrow-button.prev {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 50px;
    z-index: 99;
}

.carousel-arrows button.arrow-button.next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 50px;
    z-index: 99;
}

.carousel-arrows button.arrow-button.prev,
.carousel-arrows button.arrow-button.next {
    background: rgb(255, 255, 255);
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 50%;
    opacity: 0.7;
    text-align: center;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
}
.vendor-filtr {
    display: flex;
    box-shadow: 0px 2px 8px rgba(109, 109, 109, 0.1607843137);
    background-color: #fff;
    border-radius: 6px;
}
// .bn_img{
//     animation: hero-thumb-animation 2s linear infinite alternate;
// }
// @keyframes hero-thumb-animation {
//     0% {
//     transform: translateY(-20px);
// }
// 100% {
//     transform: translateY(0);
// }
// }


.banner-one-shape1 {
    position: absolute;
    border: 20px solid rgb(180 128 28);
    width: 150px;
    height: 150px;
    border-radius: 100%;
    top: 20%;
    left: 2%;
    opacity: 0.1;
    animation: zoom-fade-644644f6 8s infinite linear;
    z-index: 3;
}

.banner-one-shape2 {
    position: absolute;
    border: 17px solid rgb(180 128 28);
    width: 80px;
    height: 80px;
    border-radius: 100%;
    bottom: 20%;
    left: 40%;
    opacity: 0.1;
    // mix-blend-mode: overlay;
    animation: zoom-fade 3s infinite linear;
    z-index: 3;
}

.banner-one-shape3 {
    position: absolute;
    border: 20px solid rgb(180, 128, 28);
    width: 150px;
    height: 150px;
    border-radius: 100%;
    top: 6%;
    right: 2%;
    opacity: 0.1;
    animation: zoom-fade-644644f6 9s infinite linear;
    z-index: 3;
}

.banner-one-shape4 {
    position: absolute;
    bottom: 0;
    right: 0;
    mix-blend-mode: overlay;
    z-index: 3;
}

.blur-1 {
    position: absolute;
    top: -250px;
    left: -250px;
    animation: zoom-fade 4s infinite linear;
    z-index: 3;
}

.blur-2 {
    position: absolute;
    bottom: -250px;
    right: -250px;
    animation: zoom-fade 5s infinite linear;
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
.paratext {
    line-height: 27px;
}
img.tab-img {
    position: absolute;
    left: -80px;
    top: -20px;
    width: 128%;
}
</style>
