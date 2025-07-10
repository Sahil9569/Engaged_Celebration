<script setup lang="ts">
import { ref } from 'vue';
import userimg from "@/assets/images/profile/defaultuserimg.png";




// const reviews = ref([
//     {
//         customerimg : userimg,
//         customername : "Deepak Sajwan",
//         customeremail : "deepaksajwan@gmail.com",
//         packagename : "MakeUp Matrial",
//         reviews : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.   ",
//     }
// ])

const rating = ref(4);
const dialogreply = ref(false);
const editdialogreply = ref(false);

const editreplyfield = ref('Thankyou @Sumit')
const rplyreview = ref('')
</script>
<template>
    <v-row class="justify-content-between pt-3">
        <v-col cols="12" md="12"> <v-card-title class="text-h4 mb-3 ps-0">Review/Rating Single</v-card-title></v-col>
    </v-row>
    <v-card elevation="10" class="bg-grey100">
        <v-card-item>
            <v-card class="" elevation="10">
                <v-card-item>
                    
                    <div class="px-3">
                        <v-row class="mb-3 bg-grey100 px-5 border rounded">
                            <v-col cols="12" md="4" class="py-8 border-end-custom">
                                <div class="d-flex align-center border-bottom pb-4">
                                    <v-avatar rounded="md" size="50">
                                        <img contain :src="userimg" height="50"/>
                                    </v-avatar>
                                    <div class="pl-2">
                                        <h5 class="text-h6 mb-1">John</h5>
                                        <h6 class="text-Darklight mb-0 text-subtitle-2">John22@gmail.com</h6>
                                    </div>
                                </div>
                                <div class="pt-4">
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Name :
                                        <span class="text-Darklight ">Makeup Mania</span>
                                    </p>
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Category :
                                        <span class="text-Darklight ">Makeup Artist</span>
                                    </p>
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Price :
                                        <span class="text-Darklight ">$500</span>
                                    </p>
                                </div>
                            </v-col>
                            <v-col cols="12" md="8" class="py-8">
                                <p class="d-flex flex-wrap align-center gap-2 text-Darklight mb-0 text-subtitle-1 font-weight-medium">
                                    <v-rating half-increments v-model="rating" density="compact" color="warning" size="small"></v-rating>
                                   <p> 24-10-2023</p>
                                </p>
                                <p class="text-body-2 font-weight-semibold mt-3 mb-2 text-13">I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.</p>
                                <div>
                                   
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="mb-3 bg-grey100 px-5 border rounded">
                            <v-col cols="12" md="4" class="py-8 border-end-custom">
                                <div class="d-flex align-center border-bottom pb-4">
                                    <v-avatar rounded="md" size="50">
                                        <img contain :src="userimg" height="50"/>
                                    </v-avatar>
                                    <div class="pl-2">
                                        <h5 class="text-h6 mb-1">John</h5>
                                        <h6 class="text-Darklight mb-0 text-subtitle-2">john22@gmail.com</h6>
                                    </div>
                                </div>
                                <div class="pt-4">
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Name :
                                        <span class="text-Darklight ">Makeup Mania</span>
                                    </p>
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Category :
                                        <span class="text-Darklight ">Makeup Artist</span>
                                    </p>
                                    <p class=" mb-2 text-subtitle-2 font-weight-medium">
                                        Package Price :
                                        <span class="text-Darklight ">$500</span>
                                    </p>
                                </div>
                            </v-col>
                            <v-col cols="12" md="8" class="py-8">
                                <div class="border-bottom">
                                    <p class="d-flex flex-wrap align-center gap-2 text-Darklight mb-0 text-subtitle-1 font-weight-medium">
                                        <v-rating half-increments v-model="rating" density="compact" color="warning" size="small"></v-rating>
                                        <p> 24-10-2023</p>
                                    </p>
                                    <p class="text-body-2 font-weight-semibold mt-3 mb-2 text-13">I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.</p>
                                </div>
                                <div class="d-flex align-center pt-4 ps-4">
                                    <v-avatar rounded="md" size="50">
                                        <img contain :src="userimg" height="50"/>
                                    </v-avatar>
                                    <div class="pl-2">
                                        <h5 class="text-subtitle-2 font-weight-medium mb-1">Sumit</h5>
                                        <h6 class="text-Darklight font-weight-medium mb-0 text-subtitle-2">Thankyou <strong>@John</strong></h6>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-item>
            </v-card>
        </v-card-item>
    </v-card>
    
</template>
<style>
.border-end-custom {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}
@media only screen and (max-width: 767px) {
    .border-end-custom{
        border-right: none;
    }
}
</style>