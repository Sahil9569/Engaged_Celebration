<script setup lang="ts">
import { ref } from 'vue';
import imageAbout from '@/assets/images/website/th-img-couple.png'
const imageUrl = ref(imageAbout)
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
const showOverlay = ref(true);
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';


import { useMeta } from 'vue-meta';
useMeta({
  title: 'my about page',
  meta: [
    { name: 'description', content: 'my about page content' },
    { property: 'og:title', content: 'my about page MySite' },
    // add other tags as needed
  ]
});



const tcontent     = ref({});
(async function(){
   let apple = 'about us,about banner video'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'about'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
         console.log('about---page---------',data)
         if (data) { tcontent.value[i] = {imageUrl:data.image1,title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs, splitcontent:data.splitcontent, bvideo:data.bvideo} }
      })
   }
})();





const toggleOverlay = () => {
   showOverlay.value = !showOverlay.value;
   const player = youtubePlayer.value.player;
   if (player) {
      if (showOverlay.value) {
         player.playVideo();
      } else {
         player.pauseVideo();
      }
   }
};
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
const page = ref({ title: 'About us' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/'
    },
    {
        text: 'About us',
        disabled: true,
        href: '#'
    }
]);
</script>
<template>
    <Header/>
    <div class="position-relative">
         <v-card class="elevation-0 rounded-md mb-8 position-relative" style="min-width:100px;overflow:hidden;">
            <div class="background-video">
               <!-- <video  autoplay loop muted v-if="tcontent['about banner video']?.bvideo">
                 <source :src="BASE_URL + tcontent['about banner video']?.bvideo.video" type="video/mp4">
               </video> -->
               <video v-if="tcontent['about us']?.bvideo" autoplay loop muted>
                 <source :src="BASE_URL + tcontent['about us']?.bvideo.video" type="video/mp4">
               </video>
    
               <video v-else autoplay loop muted>
                 <source src="@/assets/images/website/file_bg.mp4" type="video/mp4">
               </video>
           
               <div class='position-absolute bannerContentMn'>
                <h3 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}<!-- {{ tcontent['about banner video']?.title }} --></h3>
                <div class="for_breadcrumbs">
                <v-breadcrumbs :items="breadcrumbs"
                    class="text-h6 font-weight-medium pa-0 justify-center">
                    <template v-slot:divider>
                        <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                    </template>
                    <template v-slot:title="{ item }">
                        <h6 class="text-white">{{ item.title }}</h6>
                    </template>
                </v-breadcrumbs>
            </div>
                </div>
             </div>
            <!-- <div class="px-8 py-8 py-lg-0 justify-center">
               <div class="justify-space-between">
                  <div class="py-0 align-center position-relative">
                     <div class='position-absolute for_couple'>
                        <h3 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}</h3>
                        <v-breadcrumbs :items="breadcrumbs"
                           class="text-h6 font-weight-medium pa-0 justify-center">
                           <template v-slot:divider>
                              <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                           </template>
                           <template v-slot:title="{ item }">
                              <h6 class="text-white">{{ item.title }}</h6>
                           </template>
                        </v-breadcrumbs>
                     </div>
                  </div>
               </div>
            </div> -->
         </v-card>
      </div>
    <div class="overflow-hidden about_us mb-8">
        <v-container class="container-width">
            <v-row>
                <v-col cols="12" lg="6" class="d-flex align-center pt-md-12 pt-8">
                    <div class="ms-auto">
                        <div class="mt-lg-0 pe-md-4">
                            <span class="about_heading font-weight-bold"> About Us </span>
                            <h2 class="pt-4 font-weight-bold sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500"> {{ tcontent['about us']?.title }}<span class="text-primary">{{tcontent['about us']?.ctitle}}</span>
                            </h2>
                            <p class="pt-6 pb-4 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">
                                {{tcontent['about us']?.content}}
                            </p>
                            
                        </div>
                    </div>

                </v-col>
                <v-col cols="12" lg="6" class="d-flex align-center">
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
                <v-col cols="12">
                    <p class="pb-4 p_text font-weight-regular" data-aos="fade-up" data-aos-duration="800">{{tcontent['about us']?.splitcontent}}
                    </p>
                </v-col>
            </v-row>

        </v-container>
    </div>
    <div class="">
        <v-container>
            <section class="callto-action mt-5">
                <div class="calltoaction rounded">
                    <div class="position-relative">
                    <img src="@/assets/images/website/work.png" class="workimg position-absolute">
                    </div>
                <h2 class="text-center sailFont ctm_h2 font-weight-bold position-relative getst">
                    Get Started <span class="text-secondary">Today!</span>
                </h2>
                <h4 class="text-center pt-5 pb-5 mx-auto" style="max-width:800px;">Get started today and let us help you turn your wedding vision into a stunning reality with our expert planning and personalized services.</h4>
                <div class="d-flex gap-3 justify-center flex-md-row flex-column align-center" data-aos="fade-up" data-aos-duration="1000">
                    <v-btn  target="_blank" to="/register?as=customer" size="x-large" color="primary" variant="flat">
                        Hire a Vendor
                    </v-btn>
                    <v-btn  target="_blank"  to="/register?as=vendor" size="x-large" color="primary" variant="outlined">
                        Register as a Vendor
                    </v-btn>
                </div>
                </div>
            </section>
        </v-container>
    </div>
    <Footer/>
    <!-- <v-container class="container-width count-section mb-12 pb-3">
        <div class="dsh_brd">
            <v-row class="align-center">
                <v-col cols="12" md="6" class="d-flex align-center">
                   
                    <div class="about-right about-content w-100" bis_skin_checked="1">
                        <div class="cta-one_card position-relative">
                            <img src="@/assets/images/website/animation.png" alt="Awesome Image" class="cta-img position-absolute">
                        </div>
                        <span class="about_headings font-weight-bold">Customer Breeze</span>
                        <h2 class="pt-4 font-weight-bold sailFont ctm_h2" data-aos="fade-up" data-aos-duration="500">
                            Let Engaged Celebration 
                            <span class="">elevate your business.</span>
                        </h2>
                        <p class="pt-6 pb-4 p_text text-justify  font-weight-regular  text-subtitle-1 line-height-1-5" data-aos="fade-up" data-aos-duration="800">
                            With over 21 million unique visitors every month, platforms like The Knot and WeddingWire constantly connect engaged couples with businesses like yours. Whether you specialize in venue management, catering, photography, or other wedding services, our wedding planner website ensures you reach local couples actively seeking your expertise. By partnering with us, you gain visibility and access to a targeted audience, making it easier to showcase your offerings and connect with potential clients who are eager to bring their wedding visions to life. Join our platform and capitalize on the opportunity to thrive in the competitive wedding industry by reaching couples where they are actively searching for services like yours.
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
    </v-container> -->


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
.customlgbtn{
    border-color: #b4801c !important;
    color: #b4801c !important;
}
.custombtn{
    background: #b4801c !important; 
}

.calltoaction{
    padding: 85px 0 100px 0;
    border-radius: 45px !important;
    background: linear-gradient(62deg, #afdff2, #ffc8fe, #a9e4fa, #ffcdfe);
    animation:  gradient 15s ease infinite;
    background-size: 400% 400%;
    position: relative;
    top: 43px;
    z-index: 999;
}
@-webkit-keyframes gradient{
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
  @keyframes gradient{
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
  .workimg {
    opacity: .8;
    width: 22%;
    top: -218px;
    left: 476px;
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
.bannerContentMn{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    flex-wrap: wrap;
    flex-direction: column;
}
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
.sideimg img {
   width: 60%;
}
.sideimg {
   position: absolute;
   top: -67px;
   right: -119px;
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
/* .for_couple {
    top: -279px;
    z-index: 999;
    left: 44%;
} */
 .for_breadcrumbs{
    display:block;
 }
.for_breadcrumbs a {
    color: #fff;
    z-index: 999;
    font-size: 18px;
}
.for_breadcrumbs h3 {
    font-size: 55px;
}
.background-video {
      position: relative;
      max-height: 470px;
      min-height:100px;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      justify-content: center;
  }
  
    .background-video::before{
      content: "";
      position: absolute;
      background-color: rgb(0 0 0 / 39%);
      z-index: 1; 
        top: 0;
        left: 0;
        width: 102%;
        height: 100%;
    }


@media screen and (min-width:960px) {
    .v-container {
        max-width: 1200px !important;
    }
}
</style>