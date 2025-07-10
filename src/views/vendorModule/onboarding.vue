<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

import { router } from '@/router';
import packages from '@/components/landingpage/section/our-packages.vue'
const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
import Step1 from './stepForm/basic_detail.vue';
import Step2 from './stepForm/contactDetail.vue';
import Step3 from './stepForm/serviceOffered.vue';
import Step4 from './stepForm/Step4.vue';

const currentStepIndex = ref(0);
const previousStepIndex = ref(-1);
const steps = [
    { component: Step1, data: {} },
    { component: Step2, data: {} },
    { component: Step3, data: {} },
    { component: Step4, data: {} }
];

const currentStep = computed(() => steps[currentStepIndex.value]);
// Computed property to get the current step

const isStepActive = (index: number) => {
    return index <= currentStepIndex.value;
};
// Function to move to the next step

const nextStep = () => {
    console.log(currentStepIndex.value, "step")
    if (currentStepIndex.value < steps.length - 1) {
        previousStepIndex.value = currentStepIndex.value;
        currentStepIndex.value++;
    }
};

// Function to move to the previous step
const prevStep = () => {
    if (currentStepIndex.value > 0) {
        previousStepIndex.value = currentStepIndex.value;
        currentStepIndex.value--;
    }
};

// Computed property to calculate the progress bar width
const progressBarWidth = computed(() => {
    return `${(currentStepIndex.value) / (steps.length - 1) * 100}%`;
});


const showSuccessMessage= ref(false)
const showErrorMessage  = ref(false)
const myerrors          = ref('')

const category = ref();
const city = ref();
const state = ref();
const country = ref();
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const categoryitem = ref([])
const brandValue = ref('')
const emailValue = ref('')
const phoneValue = ref('')
const accountForm = ref(true)
const createAccount = ref(true)
const packagesTemp = ref(true)
const i = ref(1)
const msgg = ref(false)

const createStepBasic = () => {
    let storedStep = parseInt(localStorage.getItem('currentStepProfile')) || 0;
    console.log(storedStep + 'tgrestgsertgse grfrfgsrftsrstgsrgtrstg');
    if (storedStep == 1) {
        storedStep += 1;
        localStorage.setItem('currentStepProfile', storedStep);
        createAccount.value = false
    }
};


const getActionClass = (index: number) => {
    var classList = '';
    classList += index == currentStepIndex.value ? 'active ' : ' ';
    classList += index < currentStepIndex.value ? 'done ' : ' ';
    return classList;
}


onMounted(() => {

    const storedStep = localStorage.getItem('currentStepProfile');
    if (storedStep == 0) {
        packagesTemp.value = false
        accountForm.value = true

        // myerrors.value="Payment done successfully."
        //  showSuccessMessage.value = true;
        // setTimeout(() => {
        //     showSuccessMessage.value=false;
        // }, 4000);
        // localStorage.setItem('payment_msg',msgg.value);

    }
    if (storedStep == 1) {
        packagesTemp.value = false
        accountForm.value = false
       
    }
    if (storedStep == 2) {
        
        createAccount.value = false
    }
});
const user_id = ref('')

const user = localStorage.getItem('user');
const email = localStorage.getItem('u_email');
user_id.value = user
emailValue.value = email



async function create_vendor_profile() {
    var formdata = new FormData();
    // formdata.append("category", category.value['value'])
    formdata.append("country", country.value['value'])
    formdata.append("state", state.value['value'])
    formdata.append("city", city.value['value'])
    //formdata.append("phone"   ,phoneValue.value)
    formdata.append("business_name", brandValue.value)
    formdata.append("email", emailValue.value)

    var response = await axios.post(`/home/create_vendor`, formdata,config);
    console.log("Responce data >>>>", response.data)
    if (response.data.status == "SAVED") {
        localStorage.setItem('currentStepProfile', i.value);
        accountForm.value = false
    }
}

async function onbarding_data_get() {
    try {

        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
        const response = await axios.post(`/home/vendor_onboard_data`, {}, config);


        countryitem.value = response.data.country
        if (response.data.category) {
            categoryitem.value = response.data.category
        }
        if (response.data.u_profile_data) {
            // Handle response data here if needed
            //country.value = response.data.u_profile_data.country.country
            // state.value = response.data.u_profile_data.state.state
            // city.value = response.data.u_profile_data.city.city
            // phoneValue.value= response.data.u_profile_data.phone
            emailValue.value = response.data.u_profile_data.user.email
        }
        if (response.data.v_profile_data) {
            category.value = response.data.v_profile_data.category.category
            brandValue.value = response.data.v_profile_data.business_name
        }
        if (response.data.package_buy_status){
            accountForm.value = true
            createAccount.value = true
            packagesTemp.value = false
            const storedStep = localStorage.getItem('currentStepProfile');
            if (storedStep == 0) {
                
                const showmsg = localStorage.getItem('payment_msg');
                accountForm.value = true
                createAccount.value = true
                packagesTemp.value = false
                    if (showmsg == 'true'){
                        // myerrors.value="Payment done successfully."
                        //  showSuccessMessage.value = true;
                        // setTimeout(() => {
                        //     showSuccessMessage.value=false;
                        // }, 4000);
                        // localStorage.setItem('payment_msg',msgg.value);
                    }
                }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error if needed
    }
}
onbarding_data_get();
async function getstate() {
    fullpageloader.value = true
    const response = await axios.post(`/home/getstate`, { cid: country.value })
    if (response.data.status = "SAVED") {
        stateitem.value = response.data.states
        state.value = null
        city.value = null
        fullpageloader.value = false
    }
}
async function getcity() {
    fullpageloader.value = true
    const response = await axios.post(`/home/getcity`, { sid: state.value })
    if (response.data.status = "SAVED") {
        cityitem.value = response.data.cities
        city.value = null
        fullpageloader.value = false
    }
}
function createAccountStep(id:any)
{
    packagesTemp.value = false;
    accountForm.value = true
}
</script>


<template>
        
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top:30px;">
        <v-alert type="success" v-show="showSuccessMessage"  density="" class="mb-4">
            <div>{{myerrors}}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage"  density="" class="mb-4">
            <div>{{myerrors}}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template> 
        </v-alert>
    </div>

    
    <main>
        <v-card elevation="10" class="bg-lightprimary pt-lg-7 pb-lg-12 py-4">
            <v-card-item>
                <template v-if="createAccount">
                    <template v-if="packagesTemp">
                        <div class="">
                            <div class="d-sm-flex align-center text-center justify-center">
                                <h6 class="text-h6 ml-2 text-primary">Pricing</h6>
                            </div>
                            <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold">
                                Vendor Packages
                            </h2>
                            <div class="section-title-img text-center" bis_skin_checked="1">
                                <img src="@/assets/images/website/section-title.png" alt="">
                            </div>
                            <div class="pt-12">
                                <packages @next="createAccountStep($event)"/>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <h1 class="sailFont text-center line-height-1-2 text-capitalize " style="font-size:48px;">
                            <template v-if="accountForm">
                                Great! Let's create your <br> amazing profile
                                <div class="section-title-img text-center mt-2" bis_skin_checked="1">
                                    <img src="@/assets/images/website/section-title.png" alt="">
                                </div>
                            </template>
                            <template v-else>
                                Welcome to Wedding Planner
                                <div class="section-title-img text-center mt-2" bis_skin_checked="1">
                                    <img src="@/assets/images/website/section-title.png" alt="">
                                </div>
                            </template>
                        </h1>
                        <template v-if="accountForm">
                            <div class="mx-auto my-8 " style="max-width: 600px;">
                                <v-card elevation="10" class="">
                                    <v-card-item>
                                        <v-form>

                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Category</v-label>
                                                <v-select v-model="category" :items="categoryitem" item-title="text"
                                                    item-value="value" label="Select Category" single-line
                                                    variant="outlined" hide-details return-object required>
                                                </v-select>
                                            </div>

                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Country</v-label>
                                                <v-select v-model="country" :items="countryitem" item-title="text"
                                                    item-value="value" label="Select Country" single-line variant="outlined"
                                                    hide-details @update:modelValue="getstate()" return-object required>
                                                </v-select>
                                            </div>

                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">State</v-label>

                                                <v-select v-model="state" :items="stateitem" item-title="text"
                                                    item-value="value" label="Select State" single-line variant="outlined"
                                                    hide-details @update:modelValue="getcity()" return-object required>
                                                </v-select>
                                            </div>

                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label>

                                                <v-select v-model="city" :items="cityitem" item-title="text"
                                                    item-value="value" label="Select State" single-line variant="outlined"
                                                    hide-details return-object required>
                                                </v-select>
                                            </div>


                                            <!-- <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label>
                                        <v-autocomplete v-model="cityValues" :items="cityItems" density="comfortable" color="primary" variant="outlined" hide-details></v-autocomplete>
                                    </div> -->

                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Your Brand/Business
                                                    Name</v-label>
                                                <VTextField v-model="brandValue" required placeholder="Enter Brand name"
                                                    hide-details></VTextField>
                                            </div>
                                            <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Email Address</v-label>
                                                <VTextField v-model="emailValue" readonly placeholder="Enter Email Address" hide-details></VTextField>
                                            </div>

                                            <!-- <div class="mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number</v-label>
                                                <VTextField v-model="phoneValue"  required  placeholder="Enter Phone Number" hide-details></VTextField>
                                            </div> -->

                                            <div class="text-center">
                                                <!-- <v-btn color="secondary" @click="welcomeFuc" size="large" class="px-8">Create My Profile</v-btn> -->
                                                <v-btn color="secondary" @click="create_vendor_profile()" size="large"
                                                    class="px-8">Create My Profile</v-btn>
                                            </div>

                                        </v-form>
                                    </v-card-item>
                                </v-card>
                            </div>
                        </template>
                        <template v-else>
                            <div class="">
                                <div class="section-title-img text-center">
                                    <img src="@/assets/images/wedding/section-title.png" alt="title" style="max-width:60px">
                                </div>
                                <p class="mt-2 pb-6 text-center">2 steps away from getting new customers:</p>
                                <div class="mx-auto my-8" style="max-width: 500px;">
                                    <v-card elevation="10" class="mb-3">
                                        <v-card-item class="pa-3 pe-md-9 p-relative">
                                            <span class="countNumber text-secondary">1</span>
                                            <h2 class="mb-2 v-card-title text-secondary">Complete your profile</h2>
                                            <p class="line-height-1-5 font-weight-light text-subtitle-1">Input all your
                                                important information, upload photos and videos of your past work and
                                                complete your profile to attract customers and get lot of leads</p>
                                        </v-card-item>
                                    </v-card>
                                    <v-card elevation="10" class="mb-3">
                                        <v-card-item class="pa-3 pe-md-9 p-relative">
                                            <span class="countNumber text-secondary">2</span>
                                            <h2 class="mb-2 v-card-title text-secondary">Approval of profile within 12-24
                                                working hours</h2>
                                            <p class="text-subtitle-1 font-weight-light line-height-1-5">After you input all
                                                the necessary information, our vendor team will get in touch with you and
                                                approve your profile within 12-24 working hours!</p>
                                        </v-card-item>
                                    </v-card>
                                    <div class="text-center mt-8">
                                        <v-btn color="light" @click="createStepBasic" size="large"
                                            class="text-secondary font-weight-bold px-8">Complete My Profile</v-btn>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>


                <template v-else>
                    <div class="mx-auto" style="max-width:1000px;">
                        <h1 class="sailFont text-center line-height-1-2 text-capitalize" style="font-size:48px;">
                            Hey User {{ emailValue }}
                        </h1>
                        <div class="section-title-img text-center">
                            <img src="@/assets/images/wedding/section-title.png" alt="title" style="max-width:60px">
                        </div>
                        <p class="mt-2 pb-lg-12 pb-sm-8 pb-6 text-center">You are now 4 steps away from submitting your
                            profile for approval</p>
                        <v-card elevation="10">
                            <v-card-item class="pa-3 py-md-6 px-md-8">
                                <div class="progress-container">
                                    <ul class="listStyleStep">
                                        <li v-for="(step, index) in steps" :key="index" :class="getActionClass(index)">
                                            <span class="innerSpanStep">
                                                <template v-if="index < currentStepIndex">
                                                    <CheckIcon />
                                                </template>
                                                <template v-else>
                                                    {{ index + 1 }}
                                                </template>
                                            </span>
                                        </li>
                                    </ul>
                                    <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
                                </div>
                                <h2 v-for="(step, index) in steps" :key="index">{{ step.listDataName }}</h2>
                                <component :is="currentStep.component" :data="currentStep.data" @next="nextStep"
                                    @prev="prevStep" />
                            </v-card-item>
                        </v-card>
                    </div>
                </template>

            </v-card-item>
        </v-card>
    </main>
</template>
<style scoped>
.progress-bar {
    background-color: rgb(var(--v-theme-secondary));
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    /* centers the line vertically along the y-axis */
    height: 4px;
    width: 0%;
    z-index: -1;
    transition: .4s ease;
    max-width: 99%;
}

.progress-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 30px;
    max-width: 100%;
    width: 100%;
}

.progress-container::before {
    content: '';
    background-color: rgb(var(--v-theme-primary));
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 4px;
    width: 99%;
    z-index: -1;
}
</style>