<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Carousel, Slide } from "vue3-carousel";
import { Calendar } from '@progress/kendo-vue-dateinputs';
import BASE_URL from '@/stores/myVar';


import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }





const clickFunModal = (item: any) => {
  item.dialog = true
}

const selectedDate = ref([]);


const clickFunModalbookin = (item: any) => { item.dialogbooking = true }

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
  991: { itemsToShow: 3 },
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



/*--Booking table data --*/
import serviceimg1 from "@/assets/images/website/decoration1.jpg";
import serviceimg2 from "@/assets/images/website/decoration2.jpg";
import serviceimg3 from "@/assets/images/website/decoration3.jpg";
import serviceimg4 from "@/assets/images/website/decoration4.jpg";
import serviceimg5 from "@/assets/images/website/decoration5.jpg";
import serviceimg6 from "@/assets/images/website/decoration6.jpeg";
import serviceimg7 from "@/assets/images/website/decoration7.jpg";
import serviceimg8 from "@/assets/images/website/decoration8.jpg";




// const bookingData = ref([
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg1,
//         serviceprovidername: "Empire Decoration",
//         vendorserviceprice: "$450",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg2,
//         serviceprovidername: "Squad Decoration And Dj 9999",
//         vendorserviceprice: "$200",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg3,
//         serviceprovidername: "Aesthetic Stories ",
//         vendorserviceprice: "$150",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg4,
//         serviceprovidername: "Empire Restaurant",
//         vendorserviceprice: "$450",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg5,
//         serviceprovidername: "Dewdrop Events",
//         vendorserviceprice: "$800",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg6,
//         serviceprovidername: "Empire Restaurant",
//         vendorserviceprice: "$450",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg7,
//         serviceprovidername: "Squad Entertainment And Dj",
//         vendorserviceprice: "$200",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },
//     {
//         serviceservice: "Decoration",
//         vendorserviceimg: serviceimg8,
//         serviceprovidername: "Aesthetic Stories ",
//         vendorserviceprice: "$150",
//         vendorname: "Sunil Joshi",
//         vendortype: "Open Vendor",
//         link: "/single-vendor",
//     },

// ]);

const bookingData = ref([
  {
    serviceservice: "",
    vendorserviceimg: "",
    serviceprovidername: "",
    vendorserviceprice: "",
    vendorname: "",
    vendortype: "",
    link: ".",
  },
]);
async function showcontracts() {
  try {
    const formData = new FormData();
    const response = await axios.post(`/home/website_data`, formData, config);
    console.log(response.data, "hi responce booking vendor")
    if (response.data.status == 'SAVED') {
      bookingData.value = response.data.packages
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showcontracts()


</script>





<template>



  <v-container class="container-width">
    <v-row class='d-block'>
      <div class="vission_section d-flex">
        <v-col cols="3 pb-16" class="position-relative packs text-left">
          <h4><span>Tailored </span> <br><span> Packages</span></h4>
          <p>Our tailored packages offer personalized solutions,<br> ensuring every aspect of your wedding reflects your
            vision.</p>
          <div class="read-icon">
            <img src="@/assets/images/website/icon-5.png" class="mt-3">
            <v-btn class="read">Read More</v-btn>
          </div>


        </v-col>
        <v-col cols="6" class="position-relative passion text-center">
          <h5 class="text-white pt-12">Your Vision, Our Passion:</h5>
          <h4 class="text-white"> Start Planning Your Perfect Wedding Today</h4>
          <p class="text-white pt-3 pb-4">Let our unwavering passion be the spark that ignites your<br> vision for the perfect wedding. </p>
            <v-btn class="headin_g contact_head w-100 text-white">Contact Us</v-btn>



        </v-col>
        <v-col cols="3 pb-16" class="position-relative  packs text-left">
          <h4><span>Destination</span> <br><span>  Weddings  </span></h4>
          <p>Destination weddings offer couples the opportunity to<br> exchange vows in breathtaking locations.</p>
          <div class="read-icon">
            <img src="@/assets/images/website/icon-5.png" class="mt-3">
            <v-btn class="read">Read More</v-btn>
          </div>


        </v-col>
      </div>
    </v-row>

    <v-row class='d-block'>
      <div class="vission_section d-flex">
        <v-col cols="12 pb-16" class="position-relative packs img-content text-left">
          <div class="img_content d-flex">
            <div class="img_inner">
              <h4><span>Vendor </span> <br><span> Coordination </span></h4>
          <p> Our experienced team excels at managing all aspects <br>of vendor coordination, from initial contact to
            final execution. </p>
          <div class="read-icon">
            <img src="@/assets/images/website/icon-5.png" class="mt-3">
            <v-btn class="read">Read More</v-btn>
          </div>
            </div>

            <div class="screen-img">
              <img src="@/assets/images/website/vendor-s.jpg" class="">
            </div>

          </div>


        </v-col>


        <!-- <v-col cols="6 pb-16" class="position-relative img-content packs text-left">
          <h4><span>Vendor </span> <br><span> Coordination </span></h4>
          <p> Our experienced team excels at managing all aspects <br>of vendor coordination, from initial contact to
            final execution.</p>
          <div class="read-icon">
            <img src="@/assets/images/website/icon-5.png" class="mt-3">
            <v-btn class="read">Read More</v-btn>
          </div>


        </v-col> -->
      </div>
    </v-row>
  </v-container>
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";
.vission_section {
  justify-content: center;
}
.img_inner{
  width:40%;
}
.screen-img{
  width:60%;
}
.screen-img img {
  border: 24px solid transparent;
  box-shadow: 0px 0px 30px 0px rgb(116 110 124 / 18%);
  border-image: linear-gradient(to right, #000000, #c7aa74);
  border-image-slice: 1;
  position: absolute;
  right: -43px;
  height: 137%;
  animation: up-down linear 4s;
  animation-iteration-count: infinite;
  transform-origin: 50% 50%;
  -webkit-animation: up-down linear 4s;
  -webkit-animation-iteration-count: infinite;
  -webkit-transform-origin: 50% 50%;
  -moz-animation: up-down linear 4s;
  -moz-animation-iteration-count: infinite;
  -moz-transform-origin: 50% 50%;
}
.vission {
  margin-bottom: 140px;
}
.passion {
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  background-position: center;
  background-image: url(/src/assets/images/website/image_2024.png);
  margin: 0 25px;
  padding: 25px;
}

.passion h4 {
  font-size: 20px;
  letter-spacing: 0.1px;
  padding-top: 9px;
}

.packs {
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgb(116 110 124 / 18%);
  border-radius: 10px;
  padding: 25px;
}

.packs p {
  font-size: 15px;
  line-height: 23px;
  padding: 10px 0;
}

.packs h4 {
  font-size: 20px;
  letter-spacing: 0.1px;
  padding-top: 9px;
}

.read-icon:before {
  position: absolute;
  content: '';
  background: #fff1d6b0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  left: 10px;
  top: 2px;
  z-index: -1;
}

.read-icon {
  position: relative;
  z-index: 1;
}

.read {
  margin-top: -23px;
  background: transparent;
}

.read:hover {
  background: transparent !important;
  box-shadow: none !important;
}

.img-content {
  margin-top: 30px;
  max-height: 300px;
  margin-right: 40px;
}
@keyframes up-down{
  0% {
    transform: translate(1px, 20px);
}

24% {
    transform: translate(1px, 40px);
}
50% {
    transform: translate(1px, 12px);
}
74% {
    transform: translate(1px, 22px);
}
100% {
    transform: translate(1px, 20px);
}
}
.contact_head {
  max-width: 32%;
  margin-top: 14px;
}
</style>
