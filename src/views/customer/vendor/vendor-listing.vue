<script setup lang="ts">
import { ref, computed } from 'vue';
import { Calendar } from '@progress/kendo-vue-dateinputs';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


import 'v-calendar/dist/style.css';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
const clickFunModal = (item: any) => { item.dialog = true }
const clickFunModalbookin = (item: any) => { item.dialogbooking = true }
const selectedDate = ref([]);
const valuecity = ref(['Select a city']);
const itemss = ref([
    'Bangalore',
    'Chennai',
    'Delhi',
    'Mumbai',
]);
const rating = ref(5);
const value = ref([]);
const items = ref([
    'All',
    'Caterers',
    'Photographers',
    'Decorators',
    'DJs',
]);
const locationitems = ref([
    'All',
    'Delhi',
    'Banglore',
    'Chandigardh',
]);
const depositvalue = ref([]);
const deposititem = ref([
    'All',
    '30%',
    '40%',
    '50%',
    '60%',
    '70%',
    '80%',
]);
const pricevalue = ref([]);
const priceitem = ref([
    'All',
    '$0 - 100$',
    '$100 - 200$',
    '$200 - 300$',
    '$300 - 400$',
    '$400 - 500$',
    '$500 - more',
]);

/*--Booking table data --*/
import serviceimg1 from "@/assets/images/customer/catering.jpg";


// const searchbudget = ref();
// const search = ref('');

// const filteredList = computed(() => {
//     console.log("searchdate____", bookingData.value)
//     const isearch = search.value.toLowerCase()
//     return bookingData.value.filter((i:any) => (
//         i.description.toLowerCase().includes(isearch) ||
//         i.name.includes(isearch) ||
//         String(i.price).includes(isearch) ) && 
//         ([undefined, null, 0, ''].includes(searchbudget.value) || String(i.price).includes(String(searchbudget.value)))
//         && ['All', i.category.name].includes(searchcat.value)
//     );
// });

// search searchbudget locationvalue

const bookingData = ref([]);
const search = ref('');
const searchbudget = ref('All');
const searchbudgets = ref(['All']);
const searchlocation = ref();
const filteredData = computed(() => {
    const isearch = search.value.toLowerCase()
    function checkbudget(input:any, range:any){
        console.log(input, range)
        if (range.includes('Below')){return input<=parseInt(range.replace(/\$/g,"").replace(/Below /g,""))}
        return (input >= parseInt(range.replace(/\$/g, "").split(" - ")[0]) && input <= parseInt(range.replace(/\$/g, "").split(" - ")[1]))
    }
    return bookingData.value.filter((i:any) => (
        i.business_name.toLowerCase().includes(isearch) ||
        i.serviceprovidername.toLowerCase().includes(isearch) ) && 
        ([undefined, null, 0, '', 'All'].includes(searchbudget.value) || checkbudget(parseInt(i.vendorserviceprice.replace(/\$/g, "")),searchbudget.value))&&
        ([undefined, null, ''].includes(searchlocation.value) || String(i.location.toLowerCase()).includes(String(searchlocation.value.toLowerCase())))
    );
});


const wishList = ref(true)
const fucToggle = () => { wishList.value = !wishList.value }
const range = ref({ start: new Date(2020, 0, 1), end: new Date(2020, 0, 5) });

const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
});

const path = window.location.pathname;
const categoryId = path.split('/').pop();
const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);

async function category_listing() {
 
    const formData = new FormData();
    formData.append("category_id", categoryId);
    const response = await axios.post(`/home/single_service`, formData, config);
    console.log(response.data.data,"response.data.dataresponse.data.data")
    if (response.data.status == 'SAVED') {
        console.log('this is done with data ----',response.data.data)
        bookingData.value = response.data.data.map((elem: any) => ({
            serviceservice: elem.category?.name ?? '',
            vendorserviceimg: elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + (elem.package_logo ?? '/media/default.jpg'),
            serviceprovidername: elem.name ?? '',
            vendorserviceprice: elem.price ? `$${elem.price}` : '',
            a_payemnt: elem.advance_payment ? `${elem.advance_payment}` : '',
            vendorname: `${elem.user?.first_name ?? ''} ${elem.user?.last_name ?? ''}`,
            business_name: elem.vendor?.business_name ?? '',
            deposit: elem.deposit_amount ?? '',
            first_price: elem.first_price ?? '',
            full_price: elem.full_price ?? '',
            
            role: elem.vendor ? 'vendor' : 'Admin',
            link: `/vendor-single/${elem.id ?? ''}`,
            iratings:elem.iratings,
            // link: elem.vendor ? `/vendor-single/${elem.id ?? ''}` : `/vendor-single_admin/${elem.id ?? ''}`,
            // location: elem.Cities ?? '',
            location: elem.cities.map((a:any)=>(a.city)).join(', '),
        }));
        locationitems.value = (response.data.cities ?? []).map((a: any) => a?.city ?? '');
        searchbudgets.value = response.data.budget
        items.value = (response.data.services ?? []).map((a: any) => a?.name ?? '');
        console.log("finally______________", bookingData.value)
    fullpageloader.value=false;
    }
}
category_listing();
const goBack = () => {
  window.history.back();
};
</script>
<template>
    <v-row>
        <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div> <template v-slot:prepend> <v-icon
                    class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>
        <v-col cols="12">
            <div class="d-flex justify-start">
                <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
            </div>

            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="2"> <v-card-title class="text-h4 ">All
                                Packages</v-card-title></v-col>
                        <v-col cols="12" md="10">
                            <v-row class="justify-end">
                                <v-col cols="12" md="4" class="ps-sm-0">
                                    <v-text-field density="compact" color="secondary" v-model="search" label="Search Package" hide-details variant="outlined" ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="ps-sm-0">
                                    <!-- <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search by Price" hide-details variant="outlined" ></v-text-field> -->
                                    <v-select v-model="searchbudget" :items="searchbudgets" item-text="text" item-value="value" label="Select Budget" single-line variant="outlined" hide-details return-object  density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="ps-sm-0">
                                    <v-text-field density="compact" color="secondary" v-model="searchlocation" label="Search by Location" hide-details variant="outlined" ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" lg="4" md="6" sm="6" xl="3" v-for="item in filteredData" :key="item">
                            <v-card elevation="10" class="vendor-card-hover h-100">
                                <v-card-item class="pa-4">
                                    <div class="position-relative d-flex overflow-hidden">
                                        <router-link :to="item.link" class="w-100 d-flex">
                                            <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                        </router-link>
                                        <!-- <v-avatar class="bg-lighterror wishlist-icon" size="28" @click="fucToggle">
                                            <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'"
                                                class="mdi text-error"></i>
                                        </v-avatar> -->
                                        <v-chip rounded="sm"
                                            class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                            label>{{ item.serviceservice }}</v-chip>

                                            <v-btn color="secondary" variant="flat" class="viewServiceBtn d-block py-1"
                                                size="small" :to="item.link">
                                                <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                                View Package 
                                            </v-btn>
                                           
                                    </div>
                                    
                                        <div class="mt-2 w-100">
                                            <div class="d-flex justify-space-between">
                                                <v-rating half-increments v-model="item.iratings" density="compact" color="warning"
                                                    size="small"></v-rating>
                                                    <h4
                                                class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                {{ item.vendorserviceprice }}</h4>
                                                    
                                            </div>
                                            <router-link :to="item.link" class="text-decoration-none text-dark">
                                                        <h4
                                                            class="text-subtitle-1 text-ellipsis font-weight-semibold textSecondary mb-0">
                                                            {{ item.serviceprovidername }} </h4>
                                                    </router-link>
                                                <h6 class="text-body-2 text-13 mb-0 ">{{ item.location }}</h6>
                                            </div>
                                            <div>
                                        <p v-if="item.deposit">
                                            <h6 class="text-body-2 text-13 mt-2"><span class="font-weight-semibold">Deposit :</span>$ {{ item.deposit }}
                                            ({{item.a_payemnt}}% of {{ item.vendorserviceprice }})
                                            
                                            </h6>
                                            
                                                <!-- <h6 v-if="item.advance_payment" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit
                                                        :</span>$ {{parseInt(item.advance_payment/100*item.price)}} ({{ item.advance_payment }}% of $ {{ item.price}})
                                                        
                                                        {{ item.advance_payment }}% ({{parseInt(item.advance_payment/100*item.price)}}) 
                                                    
                                                    </h6> -->
                                        </p>
                                        <p v-else="item.first_price">
                                            <h6 v-if="item.first_price" class="text-body-2 text-13"><span class="font-weight-semibold">Amount 
                                                    :</span>$ {{ parseInt(item.full_price) }} 
                                                    ({{ ((item.full_price / item.first_price) * 100).toFixed(2) }}% of $ {{ item.first_price }})
                                                    
                                                    <!-- {{ item.advance_payment }}% ({{parseInt(item.advance_payment/100*item.price)}})  -->
                                                
                                                </h6>
                                        </p>


                                        <!-- <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Remaining Booking
                                        :</span> 5</h6> -->

                                        <h6 v-if="item.business_name" class="text-body-2 text-13 mb-0 "><span class="font-weight-semibold">Business
                                                Name :</span> {{ item.business_name }}
                                        </h6>
                                        <h6 class="text-body-2 text-13 mb-0 "><span class="font-weight-semibold">
                                            Offered by :</span> {{ item.vendorname }}
                                        </h6>
                                        <!-- <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Vendor Type
                                                :</span> {{ item.vendortype }}</h6> -->

                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12" v-if="filteredData.length === 0">
                            <v-card elevation="10" class=" mt-6" color="">
                                <v-card-item class="text-center">
                                    <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                    <h5 class="text-h5 pt-3 text-error">No Packages Found!</h5>
                                    <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                        It looks like there are no packages available for this category right now. Try exploring a different location or service, or check back later—this is only temporary! 
                                    </h6>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";

.dates-card ul {
    list-style-type: none;
}


.v-field__outline {
    color: #171718;
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}

.vendormainimg {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.badge-service {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 1;
}

.wishlist-icon {
    position: absolute;
    left: 10px;
    top: 7px;
    z-index: 1;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #000;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-state-selected .k-link,
.k-calendar .k-calendar-td.k-state-selected .k-link:hover {
    background-color: #000;
}
</style>