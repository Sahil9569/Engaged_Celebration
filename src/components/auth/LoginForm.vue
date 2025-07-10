<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const authStore = useAuthStore();
import { router } from '@/router';
/*Social icons*/
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/facebook-icon.svg';

const checkbox = ref(false);
const valid = ref(false);
const show = ref(false);
const password = ref('');
const username = ref('');
const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
]);
const emailRules = ref([
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    (v: string) => !/[A-Z]/.test(v) || 'E-mail must not contain uppercase letters',
]);


// ANCHAN CODE START
const showSuccessMessage= ref(false)
const showErrorMessage  = ref(false)
const myerrors          = ref('')

const u_email = ref();
const user_id = ref('');
const fullpageloader =   ref(false)     

async function login_user() {
    if (!(username.value && password.value)) {
        showErrorMessage.value = true;
        myerrors.value = 'Credentials required!' 
    }
    else{
        fullpageloader.value = true
        authStore.login(username.value, password.value).catch((error) => {
        console.log('error________________', error)
        fullpageloader.value = false
        showErrorMessage.value = true;
        myerrors.value = (error.response.data.message) ? error.response.data.message : 'Something went wrong!' 
        });
    }
    setTimeout(() => { showErrorMessage.value = false; }, 3000); 
}


</script>


<template>

  



    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div v-show="showSuccessMessage" class="mt-2"> <v-alert color="success">{{myerrors}}</v-alert> </div>
    <div v-show="showErrorMessage" class="mt-2 error-popup"> <v-alert color="error">{{myerrors}}</v-alert> </div>
    <Form @submit="login_user" v-slot="{ errors, isSubmitting }" class="mt-5">
        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Email</v-label>
        <VTextField
            v-model="username"
            :rules="emailRules"
            class="mb-4"
            required
            hide-details="auto"
        ></VTextField>
        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Password</v-label>
        <VTextField
            v-model="password"
            :rules="passwordRules"
            required
            hide-details="auto"
            class="pwdInput"
            color="primary"
            variant="outlined"
            placeholder="*********"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="show = !show"
        ></VTextField>
        <div class="d-flex flex-wrap align-center my-3 ml-n2">
            <v-checkbox v-model="checkbox" :rules="[(v:any) => !!v || 'You must agree to continue!']" required hide-details color="primary">
                <template v-slot:label class="">Remember this Device </template>
            </v-checkbox>
            <div class="ml-sm-auto">
                <RouterLink to="/forgot-password" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">Forgot Password ?</RouterLink>
            </div>
        </div>
        <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>Sign In</v-btn>
        <div v-if="errors.apiError" class="mt-2">
            <v-alert color="error">{{ errors.apiError }}</v-alert>
        </div>
    </Form>
</template>
