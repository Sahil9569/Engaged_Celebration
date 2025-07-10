<script setup lang="ts">
import Logo from '@/layouts/full/logo/Logo.vue';
/* Login form */
import LoginForm from '@/components/auth/LoginForm.vue';
import google from '@/assets/images/svgs/google-icon.svg';
const goBack = () => {
  window.history.back();
};
</script>
<template>
    <div class="authentication bgImageAuth">
        <v-container fluid class="pa-3">
            <v-card rounded="md" elevation="10" class="px-sm-0 px-0  mx-auto" max-width="1000">
                <v-card-item class="pa-0">
                    <v-row class="">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="imageSizeAccount">
                                <img src="@/assets/images/wedding/couples.jfif" style="max-width:100%;">
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="">
                            <div class="d-flex justify-sm-start justify-center mb-6 mb-sm-0">
                                <v-btn class="rounded-sm mt-3 text-white ms-md-0 ms-4 " color="grey200" @click="goBack" flat size="small">
                                    <ChevronLeftIcon size="13" class="me-1" />Back 
                                </v-btn>
                            </div>
                            <div class="px-4 ps-md-4 py-3 pe-md-9 cardStyleAccount">
                                    <div class="d-flex justify-center py-4 mb-4 loginLogoSize "><Logo />
                                    </div>
                                <!-- <div class="text-h6 text-medium-emphasis text-center mb-6">Your Social Campaigns</div> -->
                                <LoginForm/>
                                <div class="d-flex align-center text-center mt-5">
                                    <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                                        <span class="bg-surface px-5 py-3 position-relative">Or</span>
                                    </div> 
                                </div>
                                <v-row class="mt-3">
                                    <v-col cols="12" sm="7" >
                                        <v-btn variant="outlined" to="/register?as=customer" size="large" class="border text-subtitle-1" block>
                                            <UserIcon size="18" class="me-1"/>
                                            <span class="d-sm-flex mr-1">View our vendors & packages</span>
                                        </v-btn>
                                        
                                    </v-col>
                                    <v-col cols="12" sm="5" >
                                        <v-btn variant="outlined" to="/register?as=vendor" size="large" class="border text-subtitle-1" block>
                                            <UserIcon size="18" class="me-1"/>
                                            <span class="d-sm-flex mr-1"> Become a vendor</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-container>
    </div>
</template>
