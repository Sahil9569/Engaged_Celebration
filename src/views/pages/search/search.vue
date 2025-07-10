<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import { Calendar } from '@progress/kendo-vue-dateinputs';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router';
import BASE_URL from '@/stores/myVar';
const route = useRoute()
import 'aos/dist/aos.css';
import AOS from 'aos';
onMounted(() => {
    AOS.init();
});


const clickFunModal = (item: any) => { item.dialog = true }
const selectedDate = ref([]);
const clickFunModalbookin = (item: any) => { item.dialogbooking = true } 
const rating = ref(5);
const wishList = ref(true)
const fucToggle = () => { wishList.value = !wishList.value }
/*--mehndi table data --*/
import service1 from "@/assets/images/website/mehndi1.jpg";
import service2 from "@/assets/images/website/mehndi2.jpg";
import service3 from "@/assets/images/website/mehndi3.jpg";
import service4 from "@/assets/images/website/mehndi4.jpg";
import service5 from "@/assets/images/website/mehndi5.webp";
import service6 from "@/assets/images/website/mehndi6.jpg";
import service7 from "@/assets/images/website/mehndi7.jpg";
import service8 from "@/assets/images/website/mehndi8.jpg";

async function category_listing() {

    const response = await axios.post(`/home/search_service`, {searchquery:route.query.query});
     console.log(response.data.data,"response.data.dataresponse.data.data")
        if (response.data.status == 'SAVED') {
           
        bookingmehndiData.value = response.data.data.map((elem: any) => ({
            serviceservice: elem.category.name,
            vendorserviceimg: elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + elem.package_logo,
            serviceprovidername: elem.name,
            vendorserviceprice: '$' + elem.price,
            vendorname: `${elem.user.first_name} ${elem.user.last_name}`,
            vendortype: "Open Vendor",
            link: `/cpackage_pub/${elem.id}`,
            //  "deposit": elem.advance_payment,
            //  "location": elem.Cities,
        }));
    }
}
category_listing();

const bookingmehndiData = ref([
]);

</script>

<template>
    <!--Header-->
    <Header />
    <div class="position-relative mainbanner single-banner">
        <v-card class="elevation-0 rounded-md mb-8">
            <div class="px-8 py-8 py-lg-0 d-flex justify-center">
                <div class="d-flex justify-space-between">
                    <div class="d-flex py-0 align-center">
                        <div>
                            <h3 class="ctm_h2 mb-2 text-white sailFont"></h3>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
    <!-- code start -->
    <div class="pt-sm-16 py-6">
        <v-container class="container-width">
            <v-row class="py-6">
                <v-col cols="12" lg="4" md="6" sm="6" xl="4" class="position-relative"
                    v-for="(item, index) in bookingmehndiData" :key="index">
                    <v-card elevation="10" class="customer-card vendor-card-hover">
                        <v-card-item class="pa-4">
                            <div class="position-relative d-flex overflow-hidden">
                                <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                <v-avatar class="bg-lighterror wishlist-icon" size="28" @click="fucToggle">
                                    <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'"
                                        class="mdi text-error"></i>
                                </v-avatar>
                                <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service"
                                    size="small" label>{{ item.serviceservice }}</v-chip>
                                <v-btn color="secondary" variant="flat" class="viewServiceBtn d-block py-1" size="small"
                                    :to="item.link">
                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                    View Service
                                </v-btn>
                            </div>
                            <div class="d-flex justify-space-between align-start mt-2">
                                <div class="text-start">
                                    <v-rating half-increments disabled v-model="rating" density="compact" color="warning"
                                        size="small"></v-rating>
                                    <h4
                                        class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary text-start">
                                        {{ item.serviceprovidername }}</h4>
                                </div>
                                <div>
                                    <h4
                                        class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1 text-start">
                                        {{ item.vendorserviceprice }}</h4>
                                </div>
                            </div>
                            <div class="text-start">
                                <h6 class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Vendor Name
                                        :</span> {{ item.vendorname }}</h6>
                                <h6 class="text-body-2 text-13"><span class="font-weight-semibold ">Vendor Type :</span>
                                    {{
                                item.vendortype }}</h6>
                            </div>
                            <v-row class="mt-2">
                                <v-col>
                                    <v-btn color="secondary"  href="/login"  variant="flat" size="small"
                                        class="w-100" >
                                        <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Message
                                    </v-btn>
                                </v-col>

                                <v-col>
                                    <v-btn color="secondary" href="/login" variant="flat" size="small" class="w-100"
                                       >
                                        <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Book Now
                                    </v-btn>
                                </v-col>


                                <!-- <v-col>
                                    <v-btn color="secondary" @click="clickFunModal(item)" variant="flat" size="small"
                                        class="w-100 d-block">
                                        <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Send Enquiry
                                    </v-btn>
                                </v-col> -->



                                <!-- <v-col>
                                    <v-btn color="secondary" variant="flat" size="small" class="w-100 d-block"
                                        @click="clickFunModalbookin(item)">
                                        <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Book Now
                                    </v-btn>
                                </v-col> -->




                                <v-dialog v-model="item.dialog" persistent class="dialog-mw" size="small">
                                    <v-card class="pa-6">
                                        <div class="d-flex justify-space-between">
                                            <h4
                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                Send Enquiry - {{ item.serviceprovidername }}</h4>
                                            <v-btn icon color="" @click="item.dialog = false" flat variant="outlined"
                                                size="x-small" class="bg-error">
                                                <XIcon width="20" />
                                            </v-btn>
                                        </div>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                <v-text-field color="secondary" variant="outlined" type="text"
                                                    placeholder="John Deo" hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <UserIcon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary">Email</v-label>
                                                <v-text-field color="secondary" variant="outlined" type="text"
                                                    placeholder="johndeo123@gmail.com" hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <MailIcon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label
                                                    class="font-weight-medium mb-2 text-secondary">Message</v-label>
                                                <v-textarea auto-grow variant="outlined"
                                                    placeholder="Hi, Do you  have a review fot our service?" rows="3"
                                                    color="secondary" row-height="25" shaped hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <Message2Icon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-textarea>
                                            </v-col>
                                        </v-row>
                                        <v-card-actions class="px-0 pt-5">
                                            <v-spacer></v-spacer>
                                            <v-btn class="bg-error" text @click="item.dialog = false" flat>
                                                Close
                                            </v-btn>
                                            <v-btn class="bg-secondary" text flat>
                                                Send Enquiry
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="item.dialogbooking" persistent class="dialog-mw" size="small">
                                    <v-card class="pa-6">
                                        <div class="d-flex justify-space-between">
                                            <h4
                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                Booking - {{ item.serviceprovidername }}</h4>
                                            <v-btn icon color="" @click="item.dialogbooking = false" flat
                                                variant="outlined" size="x-small" class="bg-error">
                                                <XIcon width="20" />
                                            </v-btn>
                                        </div>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                <v-text-field color="secondary" variant="outlined" type="text"
                                                    placeholder="John Deo" hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <UserIcon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary">Email</v-label>
                                                <v-text-field color="secondary" variant="outlined" type="text"
                                                    placeholder="johndeo123@gmail.com" hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <MailIcon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary">City</v-label>
                                                <v-autocomplete v-model="valuecity" :items="itemss" color="primary"
                                                    variant="outlined" placeholder="Wedding City" hide-details>
                                                    <template v-slot:prepend-inner>
                                                        <LocationIcon stroke-width="1.5" size="22"
                                                            class="text-medium-emphasis mr-3" />
                                                    </template>
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 text-secondary d-block">Select
                                                    Date</v-label>
                                                <div class="example-config">
                                                    <v-chip color="secondary" variant="outlined" size="x-small"
                                                        class="mr-1 mb-2 font-weight-bold" v-for="date in selectedDate">
                                                        <span>{{ new Date(date).getDate() + '-' + ((new Date(date).getMonth() + 1) < 10 ? '0' + (new Date(date).getMonth() + 1) : (new Date(date).getMonth() + 1)) + '-' + new Date(date).getFullYear() }}</span>
                                                    </v-chip>
                                                </div>
                                                <calendar v-model="selectedDate" :mode="'multiple'" />



                                            </v-col>
                                        </v-row>
                                        <v-card-actions class="px-0 pt-5">
                                            <v-spacer></v-spacer>
                                            <v-btn class="bg-error" text @click="item.dialogbooking = false" flat>
                                                Close
                                            </v-btn>
                                            <v-btn class="bg-secondary" text flat>
                                                Submit
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-row>

                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>

        </v-container>


    </div>

    <!--Footer-->
    <Footer />
    <!----------->
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";

.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.badge-service {
    position: absolute;
    right: 0px;
    top: 0px;
}

.vendor-card-background {
    min-height: 150px;
}

.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #002642;
    font-size: 12px;
    font-weight: 500;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #002642;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-selected span.k-link,
.k-calendar .k-calendar-td.k-selected span.k-link:hover {
    background-color: #002642;
    color: #fff;
}
</style>
