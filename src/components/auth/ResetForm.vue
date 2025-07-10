<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@/layouts/full/logo/Logo.vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { router } from '@/router';



const step                  = ref('send');
const otp                   = ref('');
const isc                   = ref('');
const valid                 = ref(true);
const show2                 = ref(true);
const show3                 = ref(true);
const show1                 = ref(false);
const email                 = ref('');
const password              = ref('');
const password2             = ref('');
const fullpageloader        = ref(false)
const showSuccessMessage    = ref (false)
const showErrorMessage      = ref (false)
const myerrors              = ref ('')
const otpRules              = ref([(v: string) => !!v || 'Otp is required']);
const emailRules            = ref([(v: string) => !!v || 'Required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const passwordRules         = ref([(v: string) => !!v || 'Password is required']);
const passwordRules2        = ref([(v: string) => !!v || 'Confirm Password is required',(v: string) => v === password.value || 'Passwords do not match']);


async function useme(act = step.value){
    fullpageloader.value = true
    var params      = {}
    var errorhere   = ""
    if (act == 'edit')      { step.value = 'send' }
    if (act == 'send')      { if (!email.value) {return;} params = { 'username': email.value, 'send': true } }
    if (act == 'verify')    { if (!otp.value) {return;} params = { 'username': email.value, 'otp': otp.value } }
    if (act == 'update')    { if (!password.value) {return;} params = { 'username': email.value, 'isc': isc.value, 'password': password.value, 'password2': password2.value } }
    
    if (!Object.keys(params).length) { fullpageloader.value = false; return }
    const response = await axios.post('/home/forgot_password', params)
    console.log("______", response.data.status, response)

    if (response.data.status == "SENT"){
        step.value="verify"
        showSuccessMessage.value = true;
        myerrors.value = 'An OTP has been sent to your registered Email!';
    }
    if (response.data.status == "NOTFOUND") {
        showErrorMessage.value = true;
        myerrors.value = 'User with this email does not exist!';
    }
    
    if (response.data.status == "VERIFIED") {
        isc.value   = response.data.isc
        step.value  = "update"
       showSuccessMessage.value = true;
        myerrors.value = 'OTP verified!'; 
    }
    if (response.data.status == "OTPEXPIRED") {
        showErrorMessage.value = true;
        myerrors.value = 'OTP was expired!';
        setTimeout(() => { useme('edit')}, 2500); 
    }
    if (response.data.status == "INCORRECT") {
        showErrorMessage.value = true;
        myerrors.value = 'Incorrect OTP';
    }
    if (response.data.status == "DONE") {
        showSuccessMessage.value = true;
        myerrors.value = 'Password reset successfull!.';
        setTimeout(() => { router.push("/login") }, 1500); 
    }
    if (response.data.status == "UIDEXPIRED") {
        showErrorMessage.value = true;
        myerrors.value = 'Request Timeout!';
        setTimeout(() => { useme('edit')}, 2500); 
    }
    setTimeout(() => { showSuccessMessage.value = false; showErrorMessage.value = false; fullpageloader.value = false; }, 3000); 
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
    <v-form ref="form" v-model="valid" lazy-validation action="/dashboards/analytical" class="mt-sm-13 mt-8"
        @submit.prevent="useme()">

        <div v-if="step=='send'">
            <p class="text-subtitle-1 py-4 text-10">
                Please enter the email-address associated with your account and We will email you a verification code to reset your password.
            </p>
            <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Email Address</v-label>
            <VTextField v-model="email" :rules="emailRules" required></VTextField>
            <v-btn size="large" color="primary" block submit flat type="submit">Send</v-btn>
        </div>

        <div v-if="step == 'verify'">
            <p class="text-subtitle-1 mb-2">Please Enter your 4 digits OTP, valid for 10 minutes.</p>
            <p class="text-subtitle-1 d-flex align-center mb-2">
                Sent to <span class="d-inline-block ms-1 me-2 text-underline">{{ email }}</span>
                <button type="button" @click="useme('edit')" class="text-secondary" size="16"><PencilIcon /></button>
            </p>
            <VTextField v-model="otp" :rules="otpRules" required></VTextField>
            <v-btn size="small" color="primary" class="ma-1" @click="useme('send')" >Resend OTP</v-btn>
            <v-btn size="large" color="primary" block submit flat type="submit">Verify</v-btn>
        </div>

        <div v-if="step == 'update'">
            <v-label class="mb-2 font-weight-medium">Password</v-label>
            <v-text-field color="primary" v-model="password" :rules="passwordRules" variant="outlined"
                placeholder="*********" hide-details="auto" class="text-subtitle-1 mb-3"
                :type="show3 ? 'text' : 'password'" :append-inner-icon="show3 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="show3 = !show3">
            </v-text-field>

            <v-label class="mb-2 font-weight-medium">Confirm Password</v-label>
            <v-text-field color="primary" v-model="password2" :rules="passwordRules2" variant="outlined"
                :type="show2 ? 'text' : 'password'" placeholder="*********" hide-details="auto"
                class="text-subtitle-1 mb-6" :append-inner-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="show2 = !show2">
            </v-text-field>
            <v-btn size="large" color="primary" block submit flat type="submit">Submit</v-btn>
        </div>

    </v-form>
</template>
