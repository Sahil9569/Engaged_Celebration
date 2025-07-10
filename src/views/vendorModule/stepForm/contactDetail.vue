<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';


const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }


  import imagePath from '@/assets/images/wedding/dummyProfile.webp'
  import dummyLogo from '@/assets/images/wedding/weddingPlannerDummy.png'
  const psnfNameModal = ref();
  const psnlNameModal = ref();
  const LoginEmailModal = ref();
  const LoginPhoneModal = ref('');
  const anotherModal = ref('');
  const URLModel = ref(''); 
  const buttonDis =ref(false)
  const alertnateNumber = ref(false);
  const duplicateInput = () => {
    alertnateNumber.value = true
    buttonDis.value = true
  };
const imageUrl = ref<string | null>(null);
const profile = ref({
  profileImage:imagePath,
  logo:dummyLogo
})
const profile_img = ref();
const business_logo = ref();
const user_id = ref();
const  user = localStorage.getItem('user');
       user_id.value = user
const stepnumver =ref('SecondNextStep')


const handleImageUpload = (event: InputEvent, type: string) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'profile_pic') {
        profile_img.value = input.files[0]; // Assuming profile_img is a ref
        profile.value.profileImage = reader.result as string;

      } else if (type === 'business_logo') {
        business_logo.value = input.files[0]; // Assuming business_logo is a ref
        profile.value.logo = reader.result as string;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};


async function vendor_second_step(emitNext: () => void)
{
    var formdata= new FormData();
    formdata.append("SecondNextStep",stepnumver.value,)
    formdata.append("first_name",psnfNameModal.value,)
    formdata.append("last_name",psnlNameModal.value,)
    formdata.append("email",LoginEmailModal.value,)
    formdata.append("phone",LoginPhoneModal.value)
    formdata.append("location_url",URLModel.value)
    formdata.append("profile_pic",profile_img.value); // Append File object
    formdata.append("business_logo",business_logo.value); // Append File object
  
    var response = await axios.post(`/home/create_vendor`,formdata,{ headers:{ "Content-Type": "multipart/form-data" }, withCredentials: true });
    console.log("Responce data >>>>", response.data)
    if (response.data.status=="SAVED"){
        localStorage.setItem('BasicProfileSteps',stepnumver.value);
        emitNext();
    }
}

async function basic_detailfirst() {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
        const response = await axios.post(`/home/vendor_onboard_data`, {}, { headers:{ "Content-Type": "multipart/form-data" }, withCredentials: true });

        console.log(response.data,"response.data in 2nd step");
        if (response.data.u_profile_data) {
            psnfNameModal.value=response.data.u_profile_data.user.first_name
            psnlNameModal.value=response.data.u_profile_data.user.last_name
            LoginEmailModal.value=response.data.u_profile_data.user.email
            LoginPhoneModal.value = response.data.u_profile_data.phone
        }

        if (response.data.v_profile_data) {
            URLModel.value = response.data.v_profile_data.location_link;
            console.log(response.data.v_profile_data.profile_pic,"response.data.v_profile_data.profile_pic")
            if(response.data.v_profile_data.profile_pic != "/media/default.jpg"){
              profile.value.profileImage = BASE_URL + response.data.v_profile_data.profile_pic;
              profile_img.value = response.data.v_profile_data.profile_pic;

            }
            if(response.data.v_profile_data.business_logo != "/media/default.jpg"){
              profile.value.logo = BASE_URL + response.data.v_profile_data.business_logo;
              business_logo.value=response.data.v_profile_data.business_logo;
            
            }
          
        }

    } catch (error) {
        console.error("Error fetching data:", error);
       
    }
}
basic_detailfirst();


</script>
<template>

    <div class="">
      <div class="mb-6">
        <h2 class="text-center text-secondary py-3 text-h2">Contact Detail</h2>
        <p class="text-center">You will get all communications from weddingPlanner and customers on email address & mobile numbers you add here. To change your login email and/or login phone number, contact us here care@weddingplanner.com</p>
      </div>

      <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Contact Person First Name</v-label>
          <VTextField v-model="psnfNameModal"  hide-details="auto" class="mb-3" required placeholder="Enter First Name"></VTextField>
      </div>

      <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Contact Person Last Name</v-label>
          <VTextField v-model="psnlNameModal"  hide-details="auto" class="mb-3" required placeholder="Enter Last Name"></VTextField>
      </div>

      <div class="mb-3">
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Login Email</v-label>
    <VTextField v-model="LoginEmailModal" hide-details="auto" class="mb-3" required placeholder="Enter Email"></VTextField>
</div>

      <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Login Phone number</v-label>
          <VTextField v-model="LoginPhoneModal"  hide-details="auto" class="mb-3" required placeholder="Enter Phone Number"></VTextField>
      </div>
      <div class="mb-3" v-if="alertnateNumber">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number (Another Number)</v-label>
          <VTextField v-model="anotherModal"  hide-details="auto" class="mb-3" required placeholder="Enter Phone Number"></VTextField>
      </div>
      <div class="">
        <button type="button" :disabled="buttonDis" class="text-primary font-weight-bold" @click="duplicateInput">+ Add Another Number</button>
      </div>
     
      <div class="mt-6 mb-4 pa-3 bg-primary">
        <v-row>
                <v-col cols="12" md="6">
                  <div class="text-center">
                    <h3 class="text-h5 text-white pb-4">Your Profile Image</h3>
                    <div class="imageGroupMain profileGroup">
                      <label for="profilePicInput" class="labelStImgPro">
                        <input type="file" id="profilePicInput" class="d-none" @change="handleImageUpload($event, 'profile_pic')" accept="image/*">
                      </label>
                      <div class="imageSizeMain">
                        <img :src="profile.profileImage" alt="Uploaded Image" style="max-width: 300px;">
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-center">
                    <h3 class="text-h5 text-white pb-4">Your Business Logo</h3>
                    <div class="imageGroupMain businessGroup">
                      <label for="businessLogoInput" class="labelStImgPro">
                        <input type="file" id="businessLogoInput" class="d-none" @change="handleImageUpload($event, 'business_logo')" accept="image/*">
                      </label>
                      <div class="imageSizeMain">
                        <img :src="profile.logo" alt="Uploaded Image" style="max-width: 300px;">
                      </div>
                    </div>
                  </div>
                </v-col>
          </v-row>
</div>

      <div class="">
        <h4 class="text-h4 pb-2">Business location/address</h4>
        <p class="text-subtitle-1 line-height-1-5 mb-3">The more online profiles you link, the stronger and more trustworthy your WeddingPlanner profile becomes</p>
        <VTextField v-model="URLModel"  hide-details="auto" class="mb-3" required placeholder="My Website URL"></VTextField>
      </div>
      <!-- Your step content here -->
      <div class="justify-end mt-3 d-flex gap-2">
        <v-btn color="secondary" class="px-6" size="large" variant="outlined" @click="$emit('prev')">Previous</v-btn>
        <v-btn color="secondary" class="px-6" size="large" @click="vendor_second_step(() => $emit('next'))" >Next</v-btn>


      </div>
      
    </div>
  </template>
  
