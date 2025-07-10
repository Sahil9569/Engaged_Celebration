<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import serviceimg1 from "@/assets/images/customer/catering.jpg";
const bookingData = ref([]);
const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Requested', 'Accepted', 'Rejected', 'Paid']);
const searchcat = ref('All');
const searchcats = ref(['All']);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchbudget = ref('All');
const searchbudgets = ref(['All']);
const search = ref('');
const showAll = ref(false);

const filteredList = computed(() => {
    console.log("searchdate____", bookingData.value)
    const isearch = search.value.toLowerCase()
    function checkbudget(input:any, range:any){
        console.log(input, range)
        if (range.includes('Below')){return input<=parseInt(range.replace(/\$/g,"").replace(/Below /g,""))}
        return (input >= parseInt(range.replace(/\$/g, "").split(" - ")[0]) && input <= parseInt(range.replace(/\$/g, "").split(" - ")[1]))
    }
    return bookingData.value.filter((i:any) => (
        i.name.toLowerCase().includes(isearch) ||
        i.description.toLowerCase().includes(isearch) ) &&
        ([undefined, null, 0, '', 'All'].includes(searchbudget.value) || checkbudget(parseInt(i.price),searchbudget.value))
        && ['All', i.category.name].includes(searchcat.value)
    );
});


async function package_listing() {
  try {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
    const response = await axios.post(`/home/package_listing`, {}, config);
    console.log(response.data,"response.dataresponse.dataresponse.data.....")
    if (response.data.package_data) {
        bookingData.value = response.data.package_data
        searchcats.value = response.data.cats
        searchbudgets.value = response.data.budget 
        fullpageloader.value=false;
    }
    else{ fullpageloader.value=false;}
  } catch (error) { console.error("Error fetching data:", error); }
}
package_listing();


// New add for toggle
const clickFunModal     =   (pack: any) => {  pack.dialog = true  }
async function pack_status_toggle(pack=null,pack_status=null){

    const formdata = new FormData()
   
    formdata.append('pid', pack.id         )
    formdata.append('ppack_status', pack_status)
    // formdata.append('ppack_status', pack_status === true ? 'true' : 'false')
    formdata.append('update_package_Status', 'update_package_Status')
       
    const response = await axios.post('home/get_catsnpacks', formdata)
    console.log("response_____________", response.data)
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }   
    if (response.data.status == 'SENT' || response.data.status == 'UPDATED'){
        CustomPackage.value  =   response.data.map((a:any)=>({
            id          :   a.id,
            name        :   a.name,
            price       :   a.price,
            description :   a.description,
            pack_status  :   a.pack_status, 
        }))
    fullpageloader.value=false;
    }
    else{
        fullpageloader.value=false;
    }
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
        <v-alert type="error" v-show="showErrorMessage"
         density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="3"> <v-card-title class="text-h4">My Packages </v-card-title></v-col>
                        <v-col cols="12" md="9" class="d-flex gap-2 align-center flex-wrap">
                            <v-row>
                                <v-col cols="12" md="3" class="pe-0">
                                    <v-text-field density="compact" color="secondary" v-model="search" label="Search Package" hide-details variant="outlined" ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pe-0">
                                    <!-- <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search Price" hide-details variant="outlined" ></v-text-field> -->
                                    <v-select v-model="searchbudget" :items="searchbudgets" item-text="text" item-value="value" label="Select Budget" single-line variant="outlined" hide-details return-object  density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="3" class="pe-0">
                                    <v-select v-model="searchcat" :items="searchcats" item-text="text" item-value="value" label="Select Categories" single-line variant="outlined" density="compact" hide-details return-object></v-select>
                                </v-col>
                                <v-col cols="12" md="3" class="pe-0">
                                    <v-btn color="secondary" variant="flat" hide-details class=""
                                        :to="'/admin-add-package'">
                                        <PlusIcon stroke-width="1.5" size="15" class="mr-2" />
                                        Add Package
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" lg="4" md="6" sm="6" xl="3" v-for="item in filteredList" :key="item">
                            <v-card elevation="10" class="vendor-card-hover h-100">
                                <v-card-item class="pa-4">

                                    <div class="position-relative d-flex overflow-hidden">
                                        <!-- <img :src="item.vendorserviceimg" class="rounded vendormainimg"> -->

                                        <router-link class="d-flex w-100 img_div" v-if="item.package_logo !== '/media/default.jpg'" :to="'/admin-edit-package/' + item.id">
                                            <img :src="BASE_URL + item.package_logo"
                                            class="rounded vendormainimg"
                                            />
                                        </router-link>

                                        <router-link class="d-flex w-100 img_div" v-else :to="'/admin-edit-package/' + item.id">
                                            <img  :src="BASE_URL + item.package_logo"  class="rounded vendormainimg" />
                                            
                                        </router-link>
                                       
                                        <v-chip v-if="item.category" rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>
                                            {{ item.category.name }}
                                        </v-chip>
                                        <!-- <div class="d-flex align-items-center on_div">
                                                <v-switch 
                                                    :id="'ss-' + item.id" 
                                                    color="secondary" 
                                                    v-model="item.availability" 
                                                    hide-details 
                                                    @change="pack_status_toggle(item, item.availability)" 
                                                        /> -->
                                                <!-- <v-label :for="'ss-' + item.id" class="ml-2">
                                                Pack Status
                                                </v-label> -->
                                        <!-- </div> -->
                                      
                                        <div class="d-flex align-items-center on_div">
                                            <div class="tooltip-wrapper">
                                                <v-switch 
                                                    :id="'ss-' + item.id" 
                                                    color="secondary" 
                                                    v-model="item.availability" 
                                                    hide-details 
                                                    @change="pack_status_toggle(item, item.availability)" 
                                                />
                                                <span class="tooltip-text">{{ item.availability ? 'Available' : 'Not Available' }}</span>
                                            </div>
                                        </div>

  

                                        <div class="viewServiceBtn d-md-flex d-block">

                                            <v-btn color="success" :to="'/admin-edit-package/' + item.id" variant="flat" class="me-2"
                                                size="small">
                                                <PencilIcon stroke-width="1.5" size="18" class="mr-2" />
                                                Edit 
                                            </v-btn>

                                            <!-- <v-btn color="error" variant="flat" class=" "
                                                size="small" :to="'/del-package/' + item.id">
                                                <TrashIcon stroke-width="1.5" size="18" class="mr-2" />
                                                Delete
                                            </v-btn> -->
                                        </div>
                                    </div>

                                    <div class="d-flex justify-space-between align-center mt-2">
                                        <div >
                                            <v-rating half-increments disabled v-model="item.iratings" density="compact" color="warning" size="small"></v-rating>
                                        </div>
                                        <div>
                                            
                                            
                                        </div>
                                        <div>
                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                            ${{ item.price }}
                                            </h4>
                                        </div>
                                    </div>

                                    <div >
                                        <router-link class="text-decoration-none text-black" :to="'/admin-edit-package/' + item.id">
                                                <h4 class="text-subtitle-1 text-ellipsis font-weight-semibold textSecondary mb-0">
                                                {{ item.name }}
                                                </h4>
                                            </router-link>
<!-- 
                                        <h6 v-if="item.states && item.states.length > 0" class="text-body-2 text-13"><span class="font-weight-semibold">Locations
                                            :</span> 
                                            <span v-for="(c, index) in item.states" :key="c.id">
                                                {{ c.state }}
                                                <span v-if="index !== item.states.length - 1">,</span>
                                            </span>
                                        </h6> -->

                                        
                                        <h6 v-if="item.states && item.states.length > 0" class="text-body-2 text-13">
                                            <span class="font-weight-semibold">Locations :</span>


                                            <span v-if="item.states.length <=3">
                                                <span v-for="(state,index) in item.states" :key="index">
                                                    {{ state.state }}<span v-if="index !== item.states.length -1"> ,</span>
                                                </span>
                                            </span>
                                            
                                            <span v-else>
                                                <span v-for="(state, index) in (item.showAll ? item.states : item.states.slice(0, 3))" :key="index">
                                                    {{ state.state }}<span v-if="index !== (item.showAll ? item.states.length - 1 : 4)">, </span>
                                                </span>

                                             
                                                <span class="text-primary cursor-pointer" @click="item.showAll = !item.showAll">
                                                    {{ item.showAll ? '  Hide' : '  View All' }}
                                                </span>
                                            </span>

                                        </h6>


                                        <!-- <h6 v-if="item.deposit_amount" class="text-body-2 text-13"><span   class="font-weight-semibold">Deposit
                                            :</span> $ {{ item.deposit_amount }}    
                                        </h6> -->
                                        <p v-if="item.advance_payment">
                                            <h6 v-if="item.advance_payment" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit
                                                    :</span>$ {{parseInt(item.advance_payment/100*item.price)}} ({{ item.advance_payment }}% of $ {{ item.price}})
                                                    
                                                    <!-- {{ item.advance_payment }}% ({{parseInt(item.advance_payment/100*item.price)}})  -->
                                                
                                                </h6>
                                        </p>
                                        <p v-else="item.full_price">
                                            <h6 v-if="item.full_price" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit 
                                                    :</span>$ {{ parseInt(item.full_price) }} 
                                                    ({{ ((item.full_price / item.price) * 100).toFixed(2) }}% of $ {{ item.price }})
                                                    
                                                    <!-- {{ item.advance_payment }}% ({{parseInt(item.advance_payment/100*item.price)}})  -->
                                                
                                                </h6>
                                        </p>
                                    </div>

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
.dates-card ul {
    list-style-type: none;
}


.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #171718;
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
.d-flex.align-items-center.on_div {
    position: absolute;
    left: 5px;
    top: 0px;
    color: #000;
    font-weight: 600;
    z-index: 2;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #171718;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-state-selected .k-link,
.k-calendar .k-calendar-td.k-state-selected .k-link:hover {
    background-color: #171718;
}
.img_div{
    position: relative;
}
.img_div:before{
    position: absolute;
    content:'';
    background-color: #000;
    top:0;
    left:0;
    opacity:0.2;
    width: 100%;
    height: 100%;
    z-index: 1;
}


.tooltip-text {
    visibility: hidden;
    width: 120px;
    background-color: #333;
    color: #fff;
    text-align: center;
    font-size: 12px; 
    border-radius: 4px;
    padding: 5px;
    position: absolute;
    top: 35px; 
    left: 60%;
    transform: translate(-40%, 5%); 
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1; 
}

.on_div:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}


</style>