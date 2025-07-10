<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/stores/axios';
import imageAbout from '@/assets/images/website/th-img-couple.png'
import OurPackages from '@/components/landingpage/section/our-packages.vue';
const imageUrl      = ref(imageAbout)
import BASE_URL from '@/stores/myVar';
const tcontent     = ref({});
(async function(){
//    let apple = 'about us,customer breeze'
   let apple = 'about us,customer breeze'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'homepage'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
         console.log('jhs------',data)
         if (data) { tcontent.value[i] = { imageUrl:data.image1,title:data.title, content:data.content, ctitle:data.ctitle }}

      })
   }
})();





// const  marginTop =ref(0) 
// const handleWheel = (event)=> {
//       // Calculate the new margin top based on the scroll direction
//       const deltaY = event.deltaY;
//       const scrollSpeed = 10; // Adjust scroll speed as needed
//       marginTop.value += deltaY > 0 ? scrollSpeed : -scrollSpeed;

//       // Ensure the image stays within bounds
//       const containerHeight = $refs.value.container.clientHeight;
//       const imageHeight = $refs.value.image.clientHeight;
//       marginTop.value = Math.min(0, Math.max(containerHeight - imageHeight, marginTop.value));
//       console.log(imageHeight + 'imageHeightShowData')
//       // Prevent default scrolling behavior
//       event.preventDefault();
//     }

</script>
<template>
    <div class="overflow-hidden about_us mb-8">
        <v-container class="container-width">
            <v-row>
                <v-col cols="12" md="6" class="d-flex align-center py-md-12 py-8">
                    <div class="ms-auto">
                        <div class="mt-lg-0 pe-md-4">
                            <span class="about_heading font-weight-bold"> About Us </span>
                            <h2 class="pt-4 font-weight-bold sailFont ctm_h2" data-aos="fade-up"
                                data-aos-duration="500">{{tcontent['about us']?.title}}</h2><span class="text-primary">{{tcontent['about us']?.ctitle}}</span>
                            <p class="pt-6 pb-4 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">
                                {{ tcontent['about us']?.content }}
                                <!-- We play a significant role in bridal shows, where our eye for design and organization
                            shines. Our virtual Bridal Show is always a popular destination for couples seeking wedding
                            vendors, inspiration and guidance. Our expertise in selecting top-notch DJs contributes to
                            an unforgettable celebration, creating the perfect atmosphere on the dance floor. Our
                            approachability and passion for creating dream weddings resonate with engaged couples, who
                            appreciate our ability to turn their ideas into reality. Our wedding planners are dedicated
                            to making each couple's wedding day a memorable and joyous experience. -->
                            </p>
                            <router-link to="/about" class="mt-md-4 mb-md-8 d-inline-block py-3 px-5 text-decoration-none rounded-sm bg-dark text-white">Read more</router-link>
                        </div>
                    </div>

                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                    <div class="about-right w-100" bis_skin_checked="1">


                        <img v-if="tcontent['about us']?.imageUrl" @wheel="handleWheel" :src="BASE_URL + tcontent['about us']?.imageUrl" class="w-100 scr-image">

                        <img v-else @wheel="handleWheel" :src="imageUrl" class="w-100 scr-image">

                        


                        <!-- <div class="" ref="container" @wheel="handleWheel">
                            <img :src="imageUrl" alt="Scrollable Image" ref="image" :style="{ marginTop: marginTop + 'px' }">
                          </div> -->
                        <div class="make_right d-flex">
                            <img src="@/assets/images/website/ring-bg-black.png">
                            <p>We Make Any Idea & <br>Wish Come True</p>
                        </div>
                    </div>

                </v-col>
            </v-row>

        </v-container>
    </div>
    

    <!-- Package code start here  -->

    <div class="pb-16 baner-scn">
         <v-container class="container-width" id="demos">
            <v-row class="justify-center pt-1">
               <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                  <div class="d-sm-flex align-center text-center justify-center">
                     <span class="about_heading font-weight-bold"> Choose your pricing plan </span>
                  </div>
                  <h2 class="text-center  sailFont ctm_h2 font-weight-bold">
                     Connect with us
                  </h2>
                  <!-- <div class="section-title-img text-center" bis_skin_checked="1">
                     <img src="@/assets/images/website/section-title.png" alt="">
                  </div> -->
               </v-col>
            </v-row>
         </v-container>
         <v-container class="container-width">
            <OurPackages />
         </v-container>
      </div>

    <!-- Package code end here  -->


    <v-container class="container-width count-section mt-14 mb-12 pb-3">
        <div class="dsh_brd">
            <v-row class="align-center">
                <v-col cols="12" md="6" class="d-flex align-center">
                   
                    <div class="about-right about-content w-100" bis_skin_checked="1">
                        <div class="cta-one_card position-relative">
                            <img src="@/assets/images/website/animation.png" alt="Awesome Image" class="cta-img position-absolute">
                        </div>
                        <span class="about_headings font-weight-bold">Customer Breeze</span>
                        <h2 class="pt-4 font-weight-bold sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                            <!-- Let Engaged Celebration <span class="">elevate your business.</span> -->
                             {{ tcontent['customer breeze']?.title }}<span class="text-primary">{{tcontent['customer breeze']?.ctitle}}</span>
                        </h2>
                        <p class="pt-6 pb-4 p_text text-justify  font-weight-regular  text-subtitle-1 line-height-1-5" data-aos="fade-up" data-aos-duration="800">
                            {{tcontent['customer breeze']?.content}}
                        </p>
                    </div>


                </v-col>
                <v-col cols="12" md="6" class="align-center dashboar-d position-relative py-md-12 py-8">
                    <div class="count-icon">
                        <div class="mt-8 mt-lg-0 pe-4 dashboard_img">
                            <div class="d-flex chat-icon">
                                <div class="img-ic">
                                   <img src="@/assets/images/website/chat.png">
                                </div>
                                <div class="ct-mil">
                                    <h5 class="">25M</h5>
                                    <p class="">leads delivered to <br> pros annually</p>
                                 </div>
                            </div>
                            <div class="d-flex chat-icon">
                                <div class="img-ic">
                                   <img src="@/assets/images/website/click.png">
                                </div>
                                <div class="ct-mil">
                                    <h5 class="">25K+</h5>
                                    <p class="">pros on the knot <br> and wedding</p>
                                 </div>
                            </div>
                            <div class="d-flex chat-icon">
                                <div class="img-ic">
                                   <img src="@/assets/images/website/sign.png">
                                </div>
                                <div class="ct-mil">
                                    <h5 class="">8K</h5>
                                    <p class="">Connect <br> Engaged Couples </p>
                                 </div>
                            </div>
                            <div class="d-flex chat-icon">
                                <div class="img-ic">
                                   <img src="@/assets/images/website/confetti.png">
                                </div>
                                <div class="ct-mil">
                                    <h5 class="">40+</h5>
                                    <p class="">years of industry <br>  experience</p>
                                 </div>
                            </div>
                    

                        </div>
                    </div>

                </v-col>
              
            </v-row>
          
        </div>
    </v-container>


    <!-- <v-container class="container-width">
        <div class="dsh_brd">
            <v-row>
                <v-col cols="12" md="6" class="d-flex align-center dashboar-d position-relative py-md-12 py-8">
                    <div class="ms-auto">
                        <div class="mt-8 mt-lg-0 pe-4 dashboar_img">
                            <img src="@/assets/images/website/dash_gif.gif" class="w-100">

                        </div>
                    </div>

                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                    <div class="about-right about-content w-100" bis_skin_checked="1">
                        <span class="about_heading font-weight-bold">Customer Breeze</span>
                        <h2 class="pt-4 font-weight-bold sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                            Make customer inquiries
                            <span class="">a breeze</span>
                        </h2>
                        <p class="pt-6 pb-4 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">
                            When a couple is ready to inquire about your services, all
                            they need to do is fill out the contact form on your
                            Storefront. Once they submit, you’ll have all of
                            the info you need to respond and book them faster.

                        </p>
                    </div>


                </v-col>
            </v-row>
        </div>
    </v-container> -->



</template>

<style>
.cta-img {
    opacity: 0.8;
    width: 100%;
    max-width:200px;
    position: absolute;
    animation-name: float-bob-y;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    -webkit-animation-name: float-bob-y;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-name: float-bob-y;
    -moz-animation-duration: 2s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-timing-function: linear;
    -ms-animation-name: float-bob-y;
    -ms-animation-duration: 2s;
    -ms-animation-iteration-count: infinite;
    -ms-animation-timing-function: linear;
    -o-animation-name: float-bob-y;
    -o-animation-duration: 2s;
    -o-animation-iteration-count: infinite;
    -o-animation-timing-function: linear;
}
@keyframes float-bob-y {
    
    0% {
        -webkit-transform: translateY(-20px);
        transform: translateY(-20px);
    }
    50% {
        -webkit-transform: translateY(-10px);
        transform: translateY(-10px);
    }
    100% {
        -webkit-transform: translateY(-20px);
        transform: translateY(-20px);
    }
}
.count-icon{
    margin-right: 20px;
}

.about-content {
    margin-left: 20px;
    position: relative;
}

.count-section {
    border-radius: 45px;
    animation: changeBackgroundColor 7s infinite;
}

@keyframes changeBackgroundColor {
    0% {
        background-color: #fbeeff;
    }
    50% {
        background-color: #c6edff;
    }
    100% {
        background-color: #ffe2f7;
    }
}

.mt-8 {
    position: relative;
}

.dashboard_img {
   display: flex;
   flex-wrap: wrap;
   justify-content: space-between;
}

.ct-mil h5 {
    font-size: 40px;
    padding-left: 16px;
}

.ct-mil p {
    font-size: 15px;
    margin-left: 16px;
    margin-bottom: 35px;
}

.dsh_brd {
    border-radius: 10px;
    margin: 45px 0;
}

.dashboar_img img {
    height: 100%;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    border: 16px solid;
}

.make_right {
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12);
    max-width: 55%;
    border-radius: 40px;
    position: absolute;
    top: 42px;
    right: 12px;
    animation: up-down linear 4s;
    animation-iteration-count: infinite;
    transform-origin: 50% 50%;
    -webkit-animation: up-down linear 4s;
    -webkit-animation-iteration-count: infinite;
    -webkit-transform-origin: 50% 50%;
}

.make_right img {
    height: 50px;
    width: 50px;
    margin: 15px;
}

.make_right p {
    line-height: 26.1px;
    margin-left: 0px;
    padding-top: 13px;
    font-size: 17px;
    margin-right: 20px;
}

.about-right {
    position: relative;
}

span.about_headings.font-weight-bold, span.about_heading.font-weight-bold {
    position: relative;
    padding-left: 44px;
}

span.about_headings:before {
    content: "";
    width: 32px;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    background: rgb(0, 0, 0) !important;
}
span.about_heading:before {
    content: "";
    width: 32px;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    background:#d2a957 !important;
}
span.about_headings.font-weight-bold:after , span.about_heading.font-weight-bold:after {
    content: "◆";
    position: absolute;
    left: 24px;
    line-height: 1;
    top: 14%;
}
.cta-one_card {
    left: -50%;
    bottom: 135px;
    right: 0px !important;
    height:auto !important;
    text-align: center !important;
    background-repeat: no-repeat !important;
}
.make_right:hover img {
    transform: rotate3d(15, 15, 15, 360deg);
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}

.about_headings {
    color: rgb(0, 0, 0) !important;
}
.about_heading {
    color: #d2a957 !important;
}
.about_us p {
    text-align: justify;
}
</style>