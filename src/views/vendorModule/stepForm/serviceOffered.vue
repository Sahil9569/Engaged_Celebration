<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
const priceModel = ref('')
const detailModel = ref('')
const advanceBokking = ref('')
const eventDate = ref('')
const paymentDelivery = ref()
const cancelPolicy = ref('')
const colorChecked = ref(false)
const stepnumver =ref('ThirdNextStep')
const serializedServicesIn = ref([]); 
const serializedServicesOut = ref([]); 
const selectedInHouseServices = ref({});  // to store selected in-house services in 
const selectedOfferedServices = ref({}); 
const user_id = ref();



async function vendor_third_step(emitNext: () => void)
{
    var formdata= new FormData();
    formdata.append("ThirdNextStep",stepnumver.value,)
    formdata.append("priceModel",priceModel.value,)
    formdata.append("detailModel",detailModel.value,)
    formdata.append("advanceBokking",advanceBokking.value,)
    formdata.append("eventDate"   ,eventDate.value)
    formdata.append("paymentDelivery"   ,paymentDelivery.value)
    formdata.append("cancelPolicy"   ,cancelPolicy.value)
    const selectedInHouseServicesJSON = JSON.stringify(Object.keys(selectedInHouseServices.value));
    const selectedOfferedServicesJSON = JSON.stringify(Object.keys(selectedOfferedServices.value));
    formdata.append("selectedInHouseServices", selectedInHouseServicesJSON);
    formdata.append("selectedOfferedServices", selectedOfferedServicesJSON);
    var response = await axios.post(`/home/create_vendor`, formdata,config);
    console.log("Responce data >>>>", response.data)
    if (response.data.status=="SAVED"){
        localStorage.setItem('BasicProfileSteps',stepnumver.value);
        emitNext();
    }
}
async function basic_detailfirst() {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
        const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
        console.log(response.data,"final all data>>>>>>>>>>>>>>>>>",response.data.service_youoffer)
        if (response.data.service_youoffer) {
            serializedServicesIn.value = response.data.service_inhouse;
            serializedServicesOut.value = response.data.service_youoffer;
        }
        console.log(response.data.vendor_inservices,"response.datesponse.data.v_profile_data data>>>")
        if (Array.isArray(response.data.vendor_outservices)) {
            response.data.vendor_outservices.forEach(service => {
                if (service.value) {
                    selectedOfferedServices.value[service.value] = true;
                }
            });
        }
        if (Array.isArray(response.data.vendor_inservices)) {
            response.data.vendor_inservices.forEach(service => {
                if (service.value) {
                  selectedInHouseServices.value[service.value] = true;
                }
            });
        }
        if (response.data.v_profile_data) {
            priceModel.value = response.data.v_profile_data.starting_package_price;
            detailModel.value = response.data.v_profile_data.package_detail;
            advanceBokking.value = response.data.v_profile_data.advance_payment;
            eventDate.value = response.data.v_profile_data.on_event_payment;
            paymentDelivery.value = response.data.v_profile_data.on_delivery_payment;
            cancelPolicy.value = response.data.v_profile_data.cancellation_policy;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
basic_detailfirst();
</script>

<template>
    <div>
      <div class="mb-6">
        <h2 class="text-center text-secondary py-3 text-h2">My Service & Pricing</h2>
        <p class="text-center">Choose all the services you offer & fill your starting package price</p>
      </div>
      <div class="">
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Starting Package Price</v-label>
            <VTextField v-model="priceModel"  hide-details="auto" class="mb-3" required placeholder="Enter Starting Package Price"></VTextField>
        </div>
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Detail</v-label>
            <VTextField v-model="detailModel"  hide-details="auto" class="mb-3" required placeholder="Enter Package Detail"></VTextField>
        </div>
      </div>
      <div class="mt-8">
      <h3 class="text-h5 mb-4 text-secondary">Services you Offer</h3>
      <div>
        <v-row class="pa-n1">
          <v-col cols="12" sm="6" md="4" class="pa-1" v-for="service in serializedServicesOut" :key="service.value">
            <v-checkbox-btn :label="service.name" color="secondary" hide-details v-model="selectedOfferedServices[service.value]"></v-checkbox-btn>
          </v-col>
        </v-row>
      </div>
    </div>
     
      <div class="mt-8">
      <h3 class="text-h5 mb-4 text-secondary">Your in-house Service</h3>
      <div>
        <v-row class="pa-n1">
          <v-col cols="12" sm="6" md="4" class="pa-1" v-for="service in serializedServicesIn" :key="service.value">
            <v-checkbox-btn :label="service.name"  color="secondary" hide-details v-model="selectedInHouseServices[service.value]"></v-checkbox-btn>
          </v-col>
        </v-row>
      </div>
    </div>
      <div class="mt-8">
        <h3 class="text-h5 mb-4 text-secondary">Payment & Cancellation Policy</h3>
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Advance for booking (%)</v-label>
            <VTextField v-model="advanceBokking"  hide-details="auto" class="mb-3" required placeholder="Enter Starting Package Price"></VTextField>
        </div>
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment on event date (%)</v-label>
            <VTextField v-model="eventDate"  hide-details="auto" class="mb-3" required placeholder="Enter Starting Package Price"></VTextField>
        </div>
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment on delivery (%)</v-label>
            <VTextField v-model="paymentDelivery"  hide-details="auto" class="mb-3"  placeholder="Enter Starting Package Price"></VTextField>
        </div>
        <div class="mb-3">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Cancellation Policy</v-label>
            <v-textarea outlined name="Note" placeholder="Enter Your Bio" v-model="cancelPolicy" hide-details></v-textarea>

        </div>
      </div>
      <div class="justify-end mt-6 d-flex gap-2">
        <v-btn color="secondary" class="px-6" size="large" variant="outlined" @click="$emit('prev')">Previous</v-btn>
        <v-btn color="secondary" class="px-6" size="large" @click="vendor_third_step(() => $emit('next'))" >Next</v-btn>

        
      </div>
    </div>
  </template>
  
