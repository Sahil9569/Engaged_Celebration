<script setup lang="ts">
import { ref } from 'vue';
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


/*User Review Section*/
import review1 from '@/assets/images/website/banner_img.jpg'; 
import review2 from '@/assets/images/website/wedding.jpg';
import review3 from '@/assets/images/website/gift.webp';
import review4 from '@/assets/images/customer/djs.jpg';
import review5 from '@/assets/images/website/mehndi1.jpg';
import review6 from '@/assets/images/website/jwellary.jpg';


const carouselRef = ref(null);

const nextSlide = () => { carouselRef.value && carouselRef.value.next(); };
const prevSlide = () => { carouselRef.value && carouselRef.value.prev(); };

import folderName from '@/assets/images/wedding/No_Image_Available.jpg'
const userReview = ref([]);

async function showcontracts() {
  try {
    const formData = new FormData();
    const response = await axios.post(`/home/website_data`, formData, config);
    console.log(response.data,"hi responce booking vendor")
    if (response.data.status == 'SAVED') {
        userReview.value = response.data.category
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showcontracts()

</script>

<template>
    <div class="vendor-ctg">
        <v-container class="container-width">
            <v-row>
                <v-col cols="12 py-0 pt-12">
                    <div class="text-center">
                        <span class="text-secondary about_heading font-weight-bold">Top Categories</span>
                        <h2 class="ctm_h2 vendor-t sailFont font-weight-bold ri-font-size-2 text-center mb-5">Let's Plan Your Perfect <span class="">Wedding</span> </h2>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <div class="v-col v-col-12 position-relative" bis_skin_checked="1">
                    <div class="wedding_ring">
                        <img src="@/assets/images/website/wedding-ring.jpg">
                    </div>
                    <v-row class="planColsSet">
                        <v-col v-for="(card, index) in userReview" :key="card.img" cols="12" md="4" class="px-8">
                            <div  class="vendor_category">
                                <router-link :to="'/allpackagelisting?cat=' + card.id" class="w-100 text-decoration-none position-relative">
                                    <div class="text-left text-black category_text">
                                        <h3 class="text-no-wrap cate_gry font-weight-semibold text-black">
                                            {{ index + 1 }} <!-- Adding 1 to index to start from 1 instead of 0 -->
                                        </h3>
                                        <h4 class="text-no-wrap pt-4 font-weight-semibold text-black">{{ card.name }}</h4>
                                        <p v-if="card.packages_count >= 1"  class="text-no-wrap categry_para font-weight-semibold text-black">
                                            ({{ card.packages_count }})
                                        </p>
                                    </div>
                                    <div elevation="10" class="rounded vendor-card-background d-flex align-end overflow-hidden"
                                        :style="{backgroundImage: card.pic ? `url(${BASE_URL + card.pic})` : `url(${folderName})`}">
                                    </div>
                                </router-link>
                                <div v-if="index === 1" class="mt-4 rounded text-black text-center slogan">
                                    "Explore our curated vendor category, offering a diverse range of services to make your wedding day unforgettable." 
                                    
                                    <v-btn class="form-btn w-100 pt-3 view_btn text-black" to="/allpackagelisting" > <p>View All</p> </v-btn>
                                </div>
                            </div>
                        </v-col>
 


                        <!-- <v-col cols="4" class="px-8">
                            <div v-for="card in userReview2" :key="card.img" class="v_cat">
                                <router-link to="/vendor-single-category"
                                    class="w-100  text-decoration-none position-relative">
                                    <div class="text-left text-black category_text textctgr_s">

                                        <h3
                                            class="text-no-wrap cate_gry font-weight-semibold text-black">
                                            {{ card.number }}
                                        </h3>

                                        <h4
                                            class="text-no-wrap pt-4 font-weight-semibold text-black">
                                            {{ card.title }}
                                        </h4>
                                       
                                        <p
                                            class="text-no-wrap categry_para font-weight-semibold text-black">
                                            ({{ card.vendors }})
                                        </p>
                                      
                                    </div>

                                    <div elevation="10"
                                        class="rounded vendor-card-background  d-flex align-end overflow-hidden"
                                        :style="{ backgroundImage: `url(${card.img})` }">
                                        
                                    </div>
                                    c 
                                </router-link>
                                <div class="bg-dark py-7 px-5 mt-4 rounded text-white text-center slogan">"Explore our curated vendor category, offering a diverse range of services to make your wedding day unforgettable." 
                                    <v-btn class="form-btn bg-dark w-100 pt-3 view_btn text-white"> <p>View All</p></v-btn>
                                </div>
                                
                                
                                

                            </div>

                        </v-col>
                        <v-col cols="4" class="px-8">
                            <div v-for="card in userReview3" :key="card.img" class="vendor_category" >
                                <router-link to="/vendor-single-category"
                                    class="w-100  text-decoration-none position-relative">
                                    <div class="text-left text-black category_text">

                                        <h3
                                            class="text-no-wrap cate_gry font-weight-semibold text-black">
                                            {{ card.number }}
                                        </h3>
                                        <h4
                                            class="text-no-wrap pt-4 font-weight-semibold text-black">
                                            {{ card.title }}
                                        </h4>
                                       
                                        <p
                                            class="text-no-wrap categry_para font-weight-semibold text-black">
                                            ({{ card.vendors }})
                                        </p>
                                      
                                    </div>
                                    <div elevation="10"
                                        class="rounded vendor-card-background  d-flex align-end overflow-hidden"
                                        :style="{ backgroundImage: `url(${card.img})` }">
                                    </div>
                                </router-link>

                            </div>

                        </v-col> -->
                    </v-row>
                    <!-- <v-row>
                        <v-col cols="4">
                            <div v-for="card in userReview4" :key="card.img">
                                <router-link to="/vendor-single-category"
                                    class="w-100  text-decoration-none position-relative">
                                    <div elevation="10"
                                        class="rounded vendor-card-background  d-flex align-end overflow-hidden"
                                        :style="{ backgroundImage: `url(${card.img})` }">
                                        <div class="text-center text-white position-absolute category_text">
                                            <h3
                                                class="text-subtitle-1 text-no-wrap cate_gry font-weight-semibold text-white">
                                                {{ card.title }}
                                            </h3>
                                            <p
                                                class="text-subtitle-2 text-no-wrap categry_para font-weight-semibold text-white">
                                                ({{ card.vendors }})
                                            </p>
                                        </div>
                                    </div>
                                </router-link>

                            </div>

                        </v-col>
                        <v-col cols="4">
                            <div v-for="card in userReview5" :key="card.img">
                                <router-link to="/vendor-single-category"
                                    class="w-100  text-decoration-none position-relative">
                                    <div elevation="10"
                                        class="rounded vendor-card-background  d-flex align-end overflow-hidden"
                                        :style="{ backgroundImage: `url(${card.img})` }">
                                        <div class="text-center text-white position-absolute category_text">
                                            <h3
                                                class="text-subtitle-1 text-no-wrap cate_gry font-weight-semibold text-white">
                                                {{ card.title }}
                                            </h3>
                                            <p
                                                class="text-subtitle-2 text-no-wrap categry_para font-weight-semibold text-white">
                                                ({{ card.vendors }})
                                            </p>
                                        </div>
                                    </div>
                                </router-link>

                            </div>

                        </v-col>
                        <v-col cols="4">
                            <div v-for="card in userReview6" :key="card.img">
                                <router-link to="/vendor-single-category"
                                    class="w-100  text-decoration-none position-relative">
                                    <div elevation="10"
                                        class="rounded vendor-card-background  d-flex align-end overflow-hidden"
                                        :style="{ backgroundImage: `url(${card.img})` }">
                                        <div class="text-center text-white position-absolute category_text">
                                            <h3
                                                class="text-subtitle-1 text-no-wrap cate_gry font-weight-semibold text-white">
                                                {{ card.title }}
                                            </h3>
                                            <p
                                                class="text-subtitle-2 text-no-wrap categry_para font-weight-semibold text-white">
                                                ({{ card.vendors }})
                                            </p>
                                        </div>
                                    </div>
                                </router-link>

                            </div>

                        </v-col>
                    </v-row> -->

                </div>
            </v-row>
        </v-container>
    </div>
</template>
<style lang="scss" scoped>

.vendor-ctg {
    background-image:url(@/assets/images/website/hero-bg.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.vendor-card-background:hover:after {
    left: 0;
    right: 0;
    opacity: 1;
    visibility: visible;
}

.category_text {
    z-index: 5;
}

.vendor-card-background {
    min-height: 320px;
    box-shadow: rgba(0, 0, 0, 0.12);
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

.carousel__track li {
    width: 417px !important;
}

.categry_para {
    padding-top: 1px !important;
    color: #b4801c !important;
}

.vendor_category {
    position: relative;
    margin-top: 10%;
}

span.text-no-wrap.categry_para.font-weight-semibold.text-black {
    color: #000;
}

.category_text {
    position: absolute;
    top: -136px
}

.category_text h3 , .category_text p , .category_text h4  {
    color: #000;
}

.vendor-t {
    margin-bottom: 11% !important;
}

.cate_gry {
    font-size: 25px !important;
}

.category_text h3 {
    position:relative;
}

.cate_gry:before {
    content: "";
    width: 81px;
    height: 2px;
    position: absolute;
    top: 120%;
    left: 4px;
    background: #000;
}

.vendor-card-background:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 37%, rgb(255 255 255 / 0%) 80%) !important;
    left: 0;
    top: 0;
    opacity: 0.6;
}

.textctgr_s {
    top: -136px;
}  

.v_cat {
    margin-top: -48px;
}

.slogan {
    letter-spacing: 0.1px;
}

.view_btn p {
    border: 1px solid #000000;
    padding: 8px 23px;
    margin-top: 5px;
    border-radius: 5px;
}

.wedding_ring img {
    position: absolute;
    top: -292px;
    height: 200px;
    width: 200px;
    opacity: 0.1;
    right: -121px;
    rotate: 330deg;
    animation: up-down-f99d3b5f linear 4s;
    animation-iteration-count: infinite;
    transform-origin: 50% 50%;
    -webkit-animation: up-down-f99d3b5f linear 4s;
    -webkit-animation-iteration-count: infinite;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: up-down linear 4s;
    -webkit-animation-iteration-count: infinite;
    -webkit-transform-origin: 50% 50%;
    -moz-animation: up-down linear 4s;
    -moz-animation-iteration-count: infinite;
    -moz-transform-origin: 50% 50%;
    -o-animation: up-down linear 4s;
    -o-animation-iteration-count: infinite;
    -o-transform-origin: 50% 50%;
    -ms-animation: up-down linear 4s;
    -ms-animation-iteration-count: infinite;
    -ms-transform-origin: 50% 50%;
}

@keyframes up-down{
    0% {
      transform:  translate(1px,20px)  ;
    }
    24% {
      transform:  translate(1px,30px)  ;
    }
    50% {
      transform:  translate(1px,12px)  ;
    }
    74% {
      transform:  translate(1px,22px)  ;
    }
    100% {
      transform:  translate(1px,22px)  ;
    }
  }
  
  @-moz-keyframes up-down{
    0% {
      -moz-transform:  translate(1px,20px)  ;
    }
    24% {
      -moz-transform:  translate(1px,30px)  ;
    }
    50% {
      -moz-transform:  translate(1px,12px)  ;
    }
    74% {
      -moz-transform:  translate(1px,22px)  ;
    }
    100% {
      -moz-transform:  translate(1px,22px)  ;
    }
  }
  
  @-webkit-keyframes up-down {
    0% {
      -webkit-transform:  translate(1px,20px)  ;
    }
    24% {
      -webkit-transform:  translate(1px,30px)  ;
    }
    50% {
      -webkit-transform:  translate(1px,12px)  ;
    }
    74% {
      -webkit-transform:  translate(1px,22px)  ;
    }
    100% {
      -webkit-transform:  translate(1px,22px)  ;
    }
  }
  
  @-o-keyframes up-down {
    0% {
      -o-transform:  translate(1px,20px)  ;
    }
    24% {
      -o-transform:  translate(1px,30px)  ;
    }
    50% {
      -o-transform:  translate(1px,12px)  ;
    }
    74% {
      -o-transform:  translate(1px,22px)  ;
    }
    100% {
      -o-transform:  translate(1px,22px)  ;
    }
  }
  
  @-ms-keyframes up-down {
    0% {
      -ms-transform:  translate(1px,20px)  ;
    }
    24% {
      -ms-transform:  translate(1px,30px)  ;
    }
    50% {
      -ms-transform:  translate(1px,12px)  ;
    }
    74% {
      -ms-transform:  translate(1px,22px)  ;
    }
    100% {
      -ms-transform:  translate(1px,22px)  ;
    }
  }

.wedding_ring {
    position: relative;
}

.v-row.planColsSet .v-col:nth-child(1), .v-row.planColsSet .v-col:nth-child(3) {
    margin-top: 10%;
}

.vendor_category h4 {
    font-size: 28px ;
    font-weight: 300;
}

.slogan {
    background: rgb(243 234 255);
    padding: 28px 20px;
    
}

.view_btn {
    background: none !important;
    position: static !important;
}

.view_btn:hover{
    background: none !important;
    box-shadow: none !important;
}

</style>