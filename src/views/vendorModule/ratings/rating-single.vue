<script setup lang="ts">
import { ref, computed } from 'vue';

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

import user1 from "@/assets/images/profile/defaultuserimg.png";

const sindlerating = ref(4);
const dialogreply = ref({});
const editdialogreply = ref(false);
const editreplyfield = ref('Thankyou @Sumit')
const rplyreview = ref('')

const tab4 = ref(true);

import packageimg from "@/assets/images/customer/bride-groom.jpg";
const businessname = ref();
const iratings = ref();
const vendorname = ref();
const depositpercent = ref();
const packagelocation = ref();
const packageprice = ref();
const packagecategory = ref();
const path = window.location.pathname;
const serviceId = path.split('/').pop();

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
const reviewsdata = ref([]);


async function service_listing() {
    const formData = new FormData();
    formData.append("user_current_role", "vendor");
    formData.append("package_id",serviceId);

    const response = await axios.post(`/home/show_all_reviews`, formData, config);
    console.log(response.data, "hi responce for single_all_reviews")
    if (response.data.status == 'SAVED') {
        reviewsdata.value = response.data.single_all_reviews.map((elem: any) => {
            return {
                "coupleimgphoto": (elem.user.profile_pic) ? BASE_URL + elem.user.profile_pic : user1,
                "ownerimgphoto":elem.package.vendor ? ((elem.package.vendor.userprofile.profile_pic) ? BASE_URL + elem.package.vendor.userprofile.profile_pic : user1 ): ((elem.package.admin.userprofile.profile_pic) ? BASE_URL + elem.package.admin.userprofile.profile_pic : user1),
                "posteddate": formatDate(elem.created_at),
                "customername": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                "customeremail": `${elem.user.user.email}`,
                "rating": elem.rating, // Use this rating for each review item
                "review": elem.comment, // Use this rating for each review item
                "id": elem.id,
                "reply": elem.reply,
                "updated_at": formatDate(elem.updated_at),
            
            };
        }).reverse();
        if(response.data.single_package){
            const pack:any = response.data.single_package
            console.log(pack)
            businessname.value = pack.name
            iratings.value = pack.iratings
            vendorname.value= (pack.vendor) ? pack.vendor.userprofile.fullname : pack.admin.userprofile.fullname
            packagecategory.value = pack.category.name
            packageprice.value= pack.price
            depositpercent.value= parseInt(parseFloat(pack.price) * (parseFloat(pack.advance_payment)/100))
            packagelocation.value=pack.cities.map((a: any) => (a.city)).join(', ')
        }
    fullpageloader.value=false;
    }
}
service_listing();

const goBack = () => {
  window.history.back();
};


async function write_review(comment_id=null) {
    try {
        const formData = new FormData();
        formData.append("comment_id", comment_id);
        formData.append("rplyreview", rplyreview.value);
        formData.append('Comment_repLies','Comment_repLies');
        fullpageloader.value = true
        const response = await axios.post(`/home/write_review`, formData, config);

        if (response.data.status == 'ReplySAVED') {
            showSuccessMessage.value = true;
            myerrors.value = 'reply to review succesfully done';
            setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            fullpageloader.value = false;
            dialogreply.value[comment_id]=false
            rplyreview.value = ''
            service_listing()
            
        }

        if (response.data.status == 'SAVED') {
            showSuccessMessage.value = true;
            myerrors.value = 'review published sucessfully!';
            setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            fullpageloader.value = false;
            ratingreview.value = 0
            comment.value=''
            service_listing()   
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}









</script>
<template>

 <div class="d-flex justify-start">
                <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
            </div>
     <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage"
         density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <!-- <v-row class="justify-content-between pt-3">
        <v-col cols="12" md="12"> <v-card-title class="text-h4 mb-3 ps-0">Review/Rating Single</v-card-title></v-col>
    </v-row> -->
    <v-card elevation="10" class="bg-grey100">
        
        <v-card-item class="pa-sm-6 pa-3">
            <v-card-title class="text-sm-h4 text-h6 mb-3">Review/Rating Single</v-card-title>
            <v-card class="" elevation="10">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row>
                        <v-col cols="12" md="12">
                            <div class="position-relative">
                                <img :src="packageimg" class="main-img-vendor rounded mb-2">
                                <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                    label> {{ packagecategory }}</v-chip>
                            </div>
                            <div class="d-flex justify-space-between align-start">
                                <div class="">
                                    <v-rating half-increments v-model="iratings" density="compact" color="warning" size="small"></v-rating>
                                    <h2 class="text-no-wrap font-weight-semibold textSecondary">{{ businessname }} </h2>

                                    <h6
                                        class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                        <span class="font-weight-semibold">Vendor: </span> <router-link
                                            class="text-dark text-decoration-none text-capitalize"
                                            to="">{{ vendorname }}</router-link>
                                    </h6>


                                    <h6
                                        class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                        <span class="font-weight-semibold">Deposit : </span> $ {{ depositpercent }}
                                    </h6>

                                    <!-- <h6 v-if="remaining_booking"
                                        class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                        <span class="font-weight-semibold">Bookings left: {{ remaining_booking }} </span>
                                    </h6> -->

                                    <h6
                                        class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                        <span class="font-weight-semibold">Location : </span>{{ packagelocation }}
                                    </h6>
                                    <v-btn color="secondary" to="/packages" flat size="small" class="rounded-sm mt-4"> View Package </v-btn>




                                </div>
                                <div class="pa-4">
                                    <h2 class="text-no-wrap font-weight-semibold textSecondary">${{ packageprice }}</h2>
                                </div>
                            </div>

                            <div class="py-4">

                                <!-- tab section  -->

                                <v-card class="border-top border-bottom stickynavbar" elevation="0">
                                    <v-card-item class="pa-0 rounded-0">

                                        <v-tabs v-model="tab4" color="primary" class="">
                                            <v-tab value="reviews" color="secondary">
                                                <QuoteIcon stroke-width="1.5" width="20" class="v-icon--start" /> Reviews
                                            </v-tab>
                                        </v-tabs>

                                    </v-card-item>
                                </v-card>


                                <v-card-text  class="bg-light border pa-4">
                                    <v-window v-model="tab4">
                                        <v-window-item value="reviews">
                                            <h2
                                                class="mb-4 text-body-2 text-uppercase pb-2 font-weight-bold text-secondary">
                                                Package Reviews</h2>
                                            <div class="px-3">
                                                <v-row v-for="item in reviewsdata"  class="mb-3 bg-grey100 px-sm-5 px-0  border rounded">
                                                    <v-col cols="12" md="12" class="py-sm-8 py-2">
                                                        <div class="d-flex align-center pb-4">
                                                            <v-avatar rounded="md" size="50">
                                                                <img contain :src="item.coupleimgphoto" height="50"/>
                                                            </v-avatar>
                                                            <div class="pl-2">
                                                                <h5 class="text-h6 mb-1">{{  item.customername }}</h5>
                                                                <h6 class="text-Darklight mb-0 text-subtitle-2">{{  item.customeremail }}</h6>
                                                            </div>
                                                        </div>

                                                        <p class="d-flex align-center gap-2 text-Darklight mb-0 text-subtitle-1 font-weight-medium">
                                                            <v-rating half-increments disabled v-model="item.rating" density="compact" color="warning" size="small"></v-rating>
                                                            {{ item.posteddate }}
                                                        </p>
                                                        <p class="text-body-2 font-weight-semibold mt-3 mb-2 text-13"> {{ item.review  }}</p> 

                                                        
                                                        <!-- reply review  -->

                                                        <div>
                                                            <v-dialog v-model="dialogreply[item.id]" persistent
                                                                class="dialog-mw" :max-width="500">

                                                                <template  v-if="item.reply && item.reply.trim() !== ''" v-slot:activator="{ props }">
                                                                    <v-btn color="secondary" v-bind="props" flat size="small" variant="outlined" class="rounded-sm">Edit Reply </v-btn>
                                                                </template>
                                                                <template v-else v-slot:activator="{ props }">
                                                                    <v-btn color="secondary" v-bind="props" flat size="small" variant="outlined" class="rounded-sm"> Reply </v-btn>
                                                                </template>

                                                                <v-card class="pa-6">
                                                                    <div class="d-flex justify-space-between">
                                                                        <h4
                                                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                             Reply on Review </h4>
                                                                        <v-btn icon color=""
                                                                            @click="dialogreply[item.id] = false" flat
                                                                            variant="outlined" size="x-small"
                                                                            class="bg-error">
                                                                            <XIcon width="20" />
                                                                        </v-btn>
                                                                    </div>
                                                                    <v-row>
                                                                        <v-col cols="12">
                                                                            <v-label
                                                                                class="font-weight-medium mb-2 text-secondary">Reply</v-label>
                                                                            <v-textarea auto-grow variant="outlined"
                                                                                placeholder="Repy Here!"
                                                                                v-model="rplyreview"
                                                                                rows="4" color="secondary"
                                                                                row-height="25" shaped hide-details>
                                                                                <template v-slot:prepend-inner>
                                                                                    <Message2Icon stroke-width="1.5"
                                                                                        size="22"
                                                                                        class="text-medium-emphasis mr-3" />
                                                                                </template>
                                                                            </v-textarea>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-card-actions class="px-0 pt-5">
                                                                        <v-spacer></v-spacer>
                                                                        <v-btn class="bg-error" text
                                                                            @click="dialogreply = false" flat>
                                                                            Close
                                                                        </v-btn>
                                                                        <v-btn @click="write_review(item.id)" class="bg-secondary" text flat>
                                                                            Save 
                                                                        </v-btn>
                                                                    </v-card-actions>
                                                                </v-card>

                                                            </v-dialog>
                                                        </div>


                                                        <div  v-if="item.reply && item.reply.trim() !== ''" class="d-flex align-center pt-4 ps-4">
                                                            <v-avatar rounded="md" size="50">
                                                                <img contain :src="item.ownerimgphoto" height="50"/>
                                                            </v-avatar>
                                                            <div class="pl-2">
                                                                <h5 class="text-subtitle-2 font-weight-medium mb-1">You</h5>
                                                                <h6 class="text-Darklight font-weight-medium mb-0 text-subtitle-2">{{item.reply}} </h6>
                                                                {{ item.updated_at }}
                                                        </div>
                                                        </div>

                                                        <!-- end reply  -->
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-window-item>
                                    </v-window>
                                </v-card-text>
                            </div>
                        </v-col>
                    </v-row>

                    
                </v-card-item>
            </v-card>
        </v-card-item>
    </v-card>
    
</template>
<style>
.border-end-custom {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}
.main-img-vendor {
    width: 100%;
    height: 400px;
    object-fit: cover;
}
</style>