

<script setup lang="ts">
import { ref, onMounted ,computed } from 'vue';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

const fullpageloader = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage            = ref(false);


const name                    = ref();
const email_id                          = ref();
const phone_no                         = ref();
const msg                       = ref();
function checklength(){
    if(name.value) name.value = (name.value.length > 50) ? name.value.slice(0,50) : name.value
    if(phone_no.value) phone_no.value = (phone_no.value.length > 10) ? phone_no.value.slice(0,10).replace(/\D/g, "") : phone_no.value.replace(/\D/g, "");
    if(email_id.value) email_id.value = (email_id.value.length > 100) ? email_id.value.slice(0,100) : email_id.value
}

const showSuccess = ref(false);

const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const emailRules = ref([(v: string) => { if (!v) { return 'Please enter email'; } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { return true; } else { return 'Enter a Valid Email'; } } ]);
async function send_inquiry(action = 'null', receiver_email = 'null') {
  try {
    const checkemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id.value)
    if (  !(name.value && email_id.value && phone_no.value && msg.value && checkemail && (phone_no.value.length == 10))){
        showErrorMessage.value = true;
        myerrors.value = 'Please fill all required fields!';
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
        return null
    }
    const formData = new FormData();
    formData.append("action", action);
    formData.append("receiver_email", receiver_email);
    formData.append("name", name.value);
    formData.append("email", email_id.value);
    formData.append("phone_no", phone_no.value);
    formData.append("msg", msg.value);
    
    fullpageloader.value = true;

    const response = await axios.post(`/home/send_inquiry`, formData, config);

    if (response.data.status === 'SAVED') {
      showSuccess.value = true;
      setTimeout(() => {    showSuccess.value = false;  }, 4000);
      // window.location.reload();
      name.value = "";
      email_id.value = "";
      phone_no.value = "";
      msg.value = "";
    }

  } catch (error) { console.error("Error sending enquiry:", error); 
  } finally { fullpageloader.value = false; }
}
</script>
<template>
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
      <div class="position-relative z-custom contact-us rounded px-0 py-0">
        <v-container>
        <v-row>
            <v-col cols="12" md="6" class="d-flex align-center px-0 py-0 logins-img">
                <div class="w-95" bis_skin_checked="1">
                    <img src="@/assets/images/website/budget-planning.png" class="log-img">
                </div>
             
            </v-col>
   <v-col cols="12" md="6" class="d-flex align-center mid_form ">
                <div class="align-center form-ct">
                    
                        <v-col cols="12" lg="12" sm="10" data-aos="fade-up" data-aos-duration="500" class="contact_hd">
                            <div class="ring_img">
                                <img src="">
                            </div>
                            <div class="text-black text-center font-weight-bold pt-1">Contact Us</div>
                            <h2 class="text-black text-center sailFont ctm_h2 pb-0 font-weight-bold heading_style">
                                Make An <span class="about_heading_inquiry">Enquiry</span>
                            </h2>
                            <p class="text-center text-subtitle-1 line-height-1-5 mb-4">Join us and let's bring your vision to life, ensuring every detail of your special day reflects your love story and exceeds your expectations.
                            </p>
                        </v-col>

                    <v-row>
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="6">
                                    <VTextField type="text" maxlength="50" v-model="name" placeholder="Name" hide-details @keyup="checklength()"></VTextField>
                                </v-col>
                                <v-col cols="6">
                                    <VTextField type="email" maxlength="100" v-model="email_id" placeholder="Email" hide-details @keyup="checklength()" :rules="emailRules"></VTextField>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <VTextField type="text" maxlength="10" v-model="phone_no" placeholder="Phone No" hide-details :rules="phonenoRules" @keyup="checklength()"></VTextField>
                        </v-col>
                        <v-col cols="12">
                            <VTextarea v-model="msg" auto-grow placeholder="Message" rows="5" color="primary" row-height="25" shaped
                                hide-details></VTextarea>
                        </v-col>
                        <v-col cols="12" v-if="showSuccess">
                            <v-alert type="success" variant="flat" density="compact" class="py-3 d-flex align-center">
                                <template v-slot:prepend>
                                    <v-icon size="20">mdi-checkbox-marked-circle-outline</v-icon>
                                </template>
                                <div>Your enquiry sent successfully!</div>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn @click="send_inquiry('Platform_Admin','ec_admin@yopmail.com')" flat class="submit_btn bg-dark text-white mb-5">Send An Enquiry</v-btn>
                        </v-col>
                    </v-row>
                </div>
      

            </v-col>
         
        </v-row>
    </v-container>
        </div>
</template>

<style lang="scss" scoped>

.contact-inner {
    position: relative;
    max-width: 750px;
    margin: 0 auto;
    padding: 10px;
    box-shadow: 0px 2px 16.8px 3.2px rgba(0, 0, 0, 0.08);
    background: #fff;
    border-radius: 10px;
}

.vector-1 {
    position: absolute;
    left: -52%;
    bottom: 0;
    z-index: 111;
}

.vector-2 {
    position: absolute;
    right: -38%;
    top: 0;
    z-index: -1;
}
.submit_btn span {
    color: #fff;
}
.z-custom {
    z-index: 0;
}

.contact-us input {
    border: none !important;
    border-bottom: 1px solid #000 !important;
}

.contact-us .v-input {
    background-color: #fff;
    border-radius: 10px;
}

.submit_btn {
    padding: 12px 30px;
    height: auto;
    border-radius: 5px;
    font-size: 16px;
}

.ring_img {
    position: relative;
    z-index: 1;
}

.ring_img:before{
    content: "";
    position: absolute;
    background-image: url(/src/assets/images/website/packageIconsd.png);
    background-size: contain;
    height: 381%;
    width: 66%;
    right: -33px;
    top: -150px;
    z-index: -1;
    transform: rotate(325deg);
    opacity: 1;
    animation: scale2 1s alternate infinite;
    -webkit-animation: scale2 1s alternate infinite;
}

@keyframes scale2 {
    0% {
        transform: scale(1) rotate(325deg);
        -webkit-transform: scale(1) rotate(325deg);
    }

    100% {
        transform: scale(1.07) rotate(325deg);
        -webkit-transform: scale(1.07) rotate(325deg);
    }
}

.contact-us{
     margin-top: 45px;
     margin-bottom: 45px;
}

.sideWidth.me-auto.py-md-6.align-center {
    text-align: center;
    margin-top: -80px;
}

//.background-videos::before {
  //  top: 0;
  //  left: 0;
  //  width: 102%;
  //  height: 99%;
//}

//.background-videos video {
 //   width: 100vw;
 //   left: 50%;
 //   right: 50%;
 //   height: 580px;
 //   object-fit: cover;
 //   margin-left: -50vw;
 //   margin-right: -50vw;
 //   position: relative;
//}
//.background-videos {
 //   width: 100vw;
 //   left: 50%;
 //   z-index: -1;
 //   right: 50%;
  //  margin-left: -50vw;
  //  margin-right: -50vw;
  //  position: relative;
  //}

.about_heading_inquiry{
    position:relative;
    color: rgb(210 169 87) !important;
}

.about_heading_inquiry:before{
    content: "";
    width: 32px;
    height: 1px;
    position: absolute;
    top: 51%;
    left: -196px;
    background: rgb(210, 169, 87) !important;
}

span.about_heading_inquiry:after {
    content: "";
    width: 32px;
    height: 1px;
    position: absolute;
    top: 59%;
    right: -39px;
    background: rgb(210, 169, 87) !important;
}

.log-img {
    width: 100%;
}

.mid_form{
    border-radius: 10px;
    animation: changeBackgroundColor 7s infinite;
    position: relative;
    top: 98px;
    z-index: 999;
    justify-content: center;
}

.form-ct {
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, .05);
    background: #f8f3ff;
}
.logins-img img {
    width: 95% !important;
}

</style>
