<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { useRoute } from 'vue-router';
const route = useRoute()


const bookingData = ref([]);
const depositvalue = ref('All');
const deposititem = ref([ 'All', 'Completed', 'Active', 'New',]);
const itemsPerPage = 5;
const currentPage = ref(1);
const filteredList = computed(() => {
    if ((depositvalue.value.length === 0 || depositvalue.value.includes('All'))
    ) {
        return bookingData.value;
    } else {
        return bookingData.value.filter(item =>
            (depositvalue.value.length === 0 || depositvalue.value.includes('All') || depositvalue.value.includes(item.statustext))
        );
    }
});
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});

const showSuccessMessage    = ref(false)
const fullpageloader        = ref(false)
const showErrorMessage      = ref(false)
const myerrors              = ref('')
const couple_uprofile_id              = ref('')
const couple_active              = ref('')


const iuser = ref({"pic": '', "name": '', "email": '', "phone": '', "country": '', "state": '', "city": '', "chat":''})
async function initlisting(){
    const response = await axios.post('/home/list_cnv', {cid:route.params.id})
    if (response.data.status == 'SENT'){
        console.log("response_____________________", response.data)

        const uip = response.data.cp[0].userprofile
        couple_uprofile_id.value = uip.id
        couple_active.value          =   uip.user.is_active
        iuser.value.pic         =   (uip.profile_pic) ? BASE_URL + uip.profile_pic : '/src/assets/images/profile/user-1.jpg'
        iuser.value.name        =    `${uip.user.first_name} ${uip.user.last_name}`,
        iuser.value.email       =   uip.user.email
        iuser.value.phone       =   uip.phone
        iuser.value.country     =   (uip.country)     ? (uip.country.country)   : '',
        iuser.value.state       =   (uip.state)       ? (uip.state.state)       : '',
        iuser.value.city        =   (uip.city)        ? (uip.city.city)         : '',
        iuser.value.chat        =   response.data.cp[0].chatid,



        bookingData.value = response.data.bk.map((a:any, index) =>({
            // img             :  '',
            sno             :   index + 1,
            bookid          :   a.id,
            bookingdate     :   a.created,
            eventlocation   :   `${(a.city) ? (a.city.city) : ''}, ${(a.state) ? (a.state.state) : ''}`,
            package         :   (a.package) ? a.package.name : '',
            statuscolor     :   a.status == 'requested' ? 'warning' : 'success',// warning or pending
            statustext      :   a.status,
            seldate         :   a.seldate,
            // fromdate        :   a.fromdate,
            // todate          :   a.todate,
            blink           :   `/booking-single/${a.id}`,
            clink           :   (a.cid) ? `/contract-single/${a.cid}`: null,
            // budget
        }));
    }
}
initlisting()

const goBack = () => {
  window.history.back();
};



async function updatevstatus(){
    fullpageloader.value = true
    const response = await axios.post('home/updatevstatus', {"couple_uprofile_id": couple_uprofile_id.value})
    if (response.data.status == "SUCCESS"){
        showSuccessMessage.value    = true;
        myerrors.value              = response.data.msg;
        setTimeout(() => { showSuccessMessage.value = false; }, 2000); 
        fullpageloader.value = false
        initlisting()
       
    }
   
}
</script>
<template>
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


    <div class="d-flex justify-start">
        <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
            <ChevronLeftIcon size="13" class="me-1" />Back 
        </v-btn>
    </div>

    <v-row class="mb-4">
        <v-col cols="12" md="4">
            <div class="profile_card rounded overflow-hidden mb-4">
                <div class="background-gradient px-3 py-4">
                    
                    <div class="d-flex justify-start align-center  ">  
                        <div class="d-flex align-center gap-2 w-100">
                            <div class="avatar">
                                <img :src="iuser.pic" class="rounded-circle" width="60" />
                            </div>
    
                            <div>
                                <h5 class="text-h6 mb-1">{{iuser.name}}</h5>
                                <p class="text-subtitle-2 mb-1">{{iuser.email}}</p>
                                <p class="text-subtitle-2 mb-1">{{iuser.phone}}</p>
                            </div>
                        </div>
                        <div class="chat_bttn">
                            <v-btn variant="flat" color="success" class="rounded-sm mb-2" size="small" :to="'/achats?march=' + iuser.chat">
                                <Message2Icon stroke-width="1.5" size="18" class="mr-1" />Chat
                            </v-btn>
                            <v-btn variant="flat" color="success" class="rounded-sm" size="small" @click="updatevstatus()" > Change status</v-btn>
                        </div>
                    </div>
                    <div class="d-block mb-3">
                        <v-chip rounded="lg" class="font-weight-semibold  bg-success" size="small" label v-if="couple_active">Current status: Active</v-chip>
                        <v-chip rounded="lg" class="font-weight-semibold bg-error" size="small" label v-else>Current status: Suspended</v-chip>
                    </div>
                    
                </div>
                
                
                <div class="mb-8 mt-4 px-3">
                    <h4 class="text-h6 text-Darklight mb-3 font-weight-medium">Personal Information</h4>
                    <div>
                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                            <span class="text-Darklight d-flex align-center me-1 ">
                                <UserIcon size="18" stroke-width="2" class="me-1" />
                            </span>
                            <span class="">{{iuser.name}}</span>
                        </p>
                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                            <span class="text-Darklight d-flex align-center me-1 ">
                                <GlobeIcon size="18" stroke-width="2" class="me-1" />
                            </span>
                            <span class="">{{iuser.country}}</span>
                        </p>
                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                            <span class="text-Darklight d-flex align-center me-1 ">
                                <MapPinIcon size="18" stroke-width="2" class="me-1" />
                            </span>
                            <span class="">{{iuser.state}}</span>
                        </p>
                        <p class="text-subtitle-1 d-flex align-center font-weight-medium mb-3">
                            <span class="text-Darklight d-flex align-center me-1 ">
                                <BuildingIcon size="18" stroke-width="2" class="me-1" />
                            </span>
                            <span class="">{{iuser.city}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </v-col>
        <v-col cols="12" md="8">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item>
                    <div class="v-card-title text-h6 mb-4">Services</div>
                    <v-table class="month-table text-nowrap">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">bookid</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">bookingdate</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">eventlocation</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">package</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">statustext</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold">fromdate</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">todate</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">booking</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">contract</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="item.bookid" :currentPage="currentPage" :pageSize="5" :class="{ 'newBooking': item.statustext === 'New' }" class="month-item">
                                    <td> <h5 class="text-no-wrap text-body-2"> {{ item.sno }} </h5> </td>
                                    <td> <h5 class="text-no-wrap text-body-2"> {{ item.bookid }} </h5> </td>
                                    <td> <h5 class="text-no-wrap text-body-2"> {{ item.seldate }} </h5> </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1"> {{ item.eventlocation }} </h5>
                                        <!-- <div class="d-flex align-center">
                                            <v-avatar size="40" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" /></v-avatar>
                                            <div class="mx-3">
                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{
                                                    item.customername }}</h4>
                                                <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    {{ item.customeremail }}</h6>
                                            </div>
                                        </div> -->
                                    </td>
                                    <td> <h5 class="text-no-wrap text-body-2"> {{ item.package }} </h5> </td>
                                    <td>
                                        <v-chip rounded="md" class="font-weight-semibold" :color="item.statuscolor"
                                        size="small" label>{{ item.statustext }}</v-chip>
                                    </td>
                                    <!-- <td> <h5 class="text-no-wrap text-body-2"> {{ item.fromdate }} </h5> </td> -->
                                    <!-- <td> <h5 class="text-no-wrap text-body-2"> {{ item.todate }} </h5> </td> -->
                                    <td> 
                                        <v-btn icon flat size="small" v-bind="props" :to="item.blink"><EyeIcon stroke-width="2.5" size="18" class="text-primary"/></v-btn> 
                                    </td>
                                    <td>
                                        <div v-if="item.clink">
                                            <v-btn icon flat size="small" v-bind="props" :to="item.clink"><EyeIcon stroke-width="2.5" size="18" class="text-primary"/></v-btn> 
                                        </div>
                                        <div v-else><h5 class="text-no-wrap text-body-2"> Not generated yet. </h5></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="6">
                                        <v-col cols="12" v-if="paginatedList.length === 0">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                    <h5 class="text-h5 pt-3 text-error">No booking found!</h5>
                                                    <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                        Search again with another Bookings<br> temporary error.
                                                    </h6> -->
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                    <v-pagination color="primary" v-model="currentPage"
                        :length="Math.ceil(filteredList.length / itemsPerPage)" rounded="circle"></v-pagination>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
    <v-row>

    </v-row>

</template>

<style scoped lang="scss">
.text-Darklight {
    color: #647588;
}

.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #002642;
    font-size: 12px;
    font-weight: 500;
}

.newBooking td {
    background-color: rgb(255 174 31 / 13%);
}

.background-gradient {
    // background-image: url(@/assets/images/website/bgbanner.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #f2f6fa;
}
.profile_card{
    box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px !important;
}
</style>