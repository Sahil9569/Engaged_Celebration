<script setup lang="ts">
import Logo from '@/layouts/full/logo/Logo.vue';
/* Register form */
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>
<template>
    <div class="authentication bgImageAuth">
        <v-container fluid class="pa-3">
            <v-card rounded="md" elevation="10" class="px-sm-0 px-0  mx-auto" max-width="1100">
                <v-card-item class="pa-0">
                    <v-row class="">
                        <!-- <v-col cols="12" md="5" class="d-flex align-center">
                            <div class="imageSizeAccount">
                                <img src="@/assets/images/wedding/couples.jfif" style="max-width:100%;">
                            </div>
                        </v-col> -->
                        <v-col cols="12"  class="">
                            <div class="px-4 py-8 px-14 pb-14 cardStyleAccount">
                                    <div class="d-flex justify-center py-4 mb-0 packLogoSize">
                                        <Logo />
                                    </div>
                                <!-- <div class="text-h6 text-medium-emphasis text-center mb-6">Your Social Campaigns</div> -->
                                <RegisterForm />
                                
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-container>
    </div>
</template>
