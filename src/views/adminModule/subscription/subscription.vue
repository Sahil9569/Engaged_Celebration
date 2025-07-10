    <script setup lang="ts">
import { ref } from 'vue';

import packageIcon from '@/assets/images/website/packageIcon.png' 
import axios from '@/stores/axios'
import BASE_URL from '@/stores/myVar';
const editorvalue                   = ref('')
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';


const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
const subscriptCategory = ref([])
const itemCategory  = ref(['List one', 'List two', 'List threee', 'List Four', 'List Fiv', 'List Six', 'List seven'])
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
import type { Settings } from 'v-slick-carousel'
import { SubscriptIcon } from 'vue-tabler-icons';


const settingsss: Settings = {
    arrows: false,
    dots: false,
    infinite: true, 
    groupsToShow: 1, 
    groupsToScroll: 1,
    slidesPerGroup: 1,
    swipe: true, 
    swipeToSlide: true,
    ignorePrefersReducedMotion: true,
    autoplay: true,
    autoplaySpeed: 2500, 
    speed: 2500,
    vertical: true,
    verticalSwiping: true
}


const packages              =   ref([])
const lifetime_toggle       =   ref(true) 
const subscrption_toggle    =   ref(true) 


const yearly_toggle         =   ref(true) 
const onetime_toggle        =   ref(true) 
const wallet_toggle         =   ref(true)
// new code add


const lifetime_pack_status  =   ref('') 


const pid                   =   ref('') 
const package_name          =   ref('') 
const packgeprice           =   ref('') 
const yearly_price           =   ref('') 



const lifetime_price           =   ref('') 
const free_trail_days           =   ref('') 
const package_free_trial    =   ref('') 
const onetimePrice           =   ref('3243') 
const onetimepackgeprice           =   ref('') 
const packagedes            =   ref('')
const updatepack            =   ref(false)
const clickFunModal     =   (pack: any) => {  pack.dialog = true  }



async function free_trial_toggle(pack=null,pack_status=null,p_type=null){

    const formdata = new FormData()
   
    formdata.append('pid', pack.id)
    formdata.append('pfree_trial', pack_status)
    formdata.append('p_type', 'update_freetrial_Status')
    formdata.append(p_type,pack_status)
       
    const response = await axios.post('home/vensubscription', formdata)
    console.log("response_____________", response.data)
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }   
    if (response.data.status == 'SENT' || response.data.status == 'UPDATED'){
        packages.value  =   response.data.packs.map((a:any)=>({
            id          :   a.id,
            name        :   a.name,
            price       :   a.price,
            description :   a.description,
            free_trial  :   a.free_trial, 
            lifetime_toggle  :   a.lifetime_membership, 
            lifetime_pack_status  :   a.lifetime_pack_status, 
            show_hide  :   a.show_hide, 
            subscrption_toggle:a.subscrption_toggle,
            onetime_toggle:a.onetime_toggle,
            yearly_toggle:a.yearly_toggle,
            wallet_toggle:a.wallet_toggle,

        }))
    fullpageloader.value=false;
    }
    else{
        fullpageloader.value=false;
    }
}

const pack_id = ref();
const single_time_price = ref();
const month_price = ref();
const only_month_price = ref();
const couple_package = ref();
const description  = ref();
const description2  = ref();
const description3  = ref();
const couple_one_month_toggle = ref();
const couple_one_time_toggle  = ref();
const couple_single_toggle = ref();




async function couple_submit(pack_id='',action = null){
    try {
        if (
            single_time_price.value < 0 ||
            month_price.value < 0 ||
            only_month_price.value < 0
        ) {
            showErrorMessage.value = true;
            myerrors.value = 'Price must be greater than or equal to zero.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 2000); 
            return; // Stop the function execution
        }
        if (!description.value || !description2.value || !description3.value) {
            showErrorMessage.value = true;
            myerrors.value = 'All description fields must be filled.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 2000);
            return; // Stop the function execution if descriptions are empty
        }

       
        fullpageloader.value = true;
        const formdata = new FormData();
        console.log('---hhhhhhhh-----')
       
        // const formdata = new FormData();
        formdata.append('one_time_price', single_time_price.value);
        formdata.append('price', month_price.value);
        formdata.append('one_month_price', only_month_price.value);
        formdata.append('description', description.value)
        formdata.append('description2', description2.value)
        formdata.append('description3', description3.value)
        formdata.append('pack_id', pack_id);
        formdata.append('couple_one_month_toggle', couple_one_month_toggle.value);
        formdata.append('couple_one_time_toggle', couple_one_time_toggle.value);
        formdata.append('couple_single_toggle', couple_single_toggle.value);
        formdata.append('couple_package','couple_package')
        formdata.append('action',action);
        
       



        const response = await axios.post('/home/vensubscription', formdata);
        if (response.data.status === 'UPDATED') {
            console.log('---datauuuuuuuuuu--',response.data)
            showSuccessMessage.value = true;
            myerrors.value = 'Data Update successfully.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);   
        } 
        else if (response.data.status === 'SENT') {
            console.log('---datasenttttttttt--',response.data)
            showSuccessMessage.value = true;
            myerrors.value = 'Data save successfully.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);   
        } else {
            myerrors.value = 'Failed to create the data.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);
        }

    } catch (error) {
        console.error("Error for data store:", error);
        myerrors.value = 'An error occurred while data create.';
        setTimeout(() => {
            showSuccessMessage.value = false;
            fullpageloader.value = false;
        }, 3000);
    } finally {
        fullpageloader.value = false;
    }
}




async function update_me(update=false){
    const fd = new FormData()

    if (update){
        updatepack.value        =   false
        fullpageloader.value    =   true
        fd.append('pid'         , pid.value         )
        fd.append('pname'       , package_name.value)
        fd.append('pprice'      , packgeprice.value )
        fd.append('pdes'        , getEditorText()   )
        fd.append('pfree_trial' , package_free_trial.value) 
        fd.append('onetimepackgeprice' , onetimepackgeprice.value) 
        fd.append('yearly_price' , yearly_price.value) 


        
        fd.append('lifetime_price' , lifetime_price.value) 
        fd.append('free_trail_days' , free_trail_days.value) 
        fd.append('lifetime_toggle' , lifetime_toggle.value) 
        fd.append('onetime_toggle' , onetime_toggle.value) 
        fd.append('yearly_toggle' , yearly_toggle.value) 
        fd.append('subscrption_toggle' , subscrption_toggle.value) 
        fd.append('wallet_toggle', wallet_toggle.value)
        
    }
    const response = await axios.post('home/vensubscription', fd)
    console.log("response_____________package", response.data)
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }
    if (response.data.cpacks){
        console.log(response.data.cpacks,'----cccdata--------')
        pack_id.value = response.data.cpacks['id']
        single_time_price.value = response.data.cpacks['one_time_price'];
        month_price.value       = response.data.cpacks['price']
        only_month_price.value  = response.data.cpacks['one_month_price']
        description.value       = response.data.cpacks['description']
        description2.value      = response.data.cpacks['description2']
        description3.value      = response.data.cpacks['description3']
        couple_one_month_toggle.value = response.data.cpacks['couple_one_month_toggle']
        couple_one_time_toggle.value  = response.data.cpacks['couple_one_time_toggle']
        couple_single_toggle.value     = response.data.cpacks['couple_single_toggle']

    }   
    if (response.data.status == 'SENT' || response.data.status == 'UPDATED'){
        packages.value  =   response.data.packs.map((a:any)=>({
            id          :   a.id,
            name        :   a.name,
            price       :   a.price,
            one_time_price       :   a.one_time_price,
            description :   a.description,
            free_trial  :   a.free_trial, 
            lifetime_price  :   a.lifetime_price, 
            yearly_price  :   a.yearly_price, 
            free_trail_days  :   a.free_trail_days, 
            lifetime_toggle  :   a.lifetime_membership, 
            lifetime_pack_status  :   a.lifetime_pack_status, 
            show_hide  :   a.show_hide, 
            subscrption_toggle:a.subscrption_toggle,
            onetime_toggle:a.onetime_toggle,
            yearly_toggle:a.yearly_toggle,
            wallet_toggle:a.wallet_toggle,

            
        }
    ))
    fullpageloader.value=false;
    }
    else{
        fullpageloader.value=false;
    }
}
update_me()

const maxLengthRule = (value: any) => {
  return value?.toString().length <= 30 || 'Must be 30 digits or less';
};

// Exporting for usage

async function gettoupdate(pack:any=null){
  
    updatepack.value        =   true
    pid.value               =   pack.id
    package_name.value      =   pack.name
    packgeprice.value       =   pack.price
    onetimepackgeprice.value    =   pack.one_time_price
    yearly_price.value    =   pack.yearly_price
    lifetime_price.value    =   pack.lifetime_price
    free_trail_days.value    =   pack.free_trail_days
    lifetime_toggle.value  =  pack.lifetime_toggle,
    subscrption_toggle.value  =  pack.subscrption_toggle,
    onetime_toggle.value  =  pack.onetime_toggle,
    yearly_toggle.value  =  pack.yearly_toggle,
    wallet_toggle.value  =  pack.wallet_toggle,
    lifetime_pack_status.value = pack.lifetime_pack_status
    package_free_trial.value  = pack.free_trial 
    // packagedes.value        =   pack.description

    window.setTimeout(() => { if (document.querySelector('.tiptap')) { window.setTimeout(() => { document.querySelector('.tiptap').innerHTML = pack.description }, 100) } } , 200)
}

function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}

const editor = useEditor({
    editorProps: {attributes: {class: 'custom-tiptap-style',}},
    extensions: [StarterKit],
    content: ``
});


// function redirectToQuickBooks() {
//   window.location.href = "http://127.0.0.1:8000/home/quickbooks/login/";
// }
</script>
<template>
  
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4"><div>{{ myerrors }}</div>
            <template v-slot:prepend><v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4"> <div>{{ myerrors }}</div>
            <template v-slot:prepend> <v-icon class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">Subscriptions</v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2 justify-sm-end">
                            <v-btn size="small" color="primary" flat to="/admin-reports/subscriptionpayment">All Vendors subscriptions</v-btn>
                            <!-- <v-btn size="small" color="primary" flat @click="redirectToQuickBooks">Pay with QuickBooks</v-btn> -->
                        </v-col>
                    </v-row>
                    <v-row class="justify-content-between align-center pt-3 newBorderS mb-7">
                        <v-col cols="12">
                            <v-card-title class="text-h4 text-center text-primary">For Couples</v-card-title>
                        </v-col>
                        <v-col cols="12">
                            <v-card elevation="10" class="border bg-lightprimary border-primary">
                                <v-card-item>
                                    <v-row >

                                        <v-col cols="12" md="4">
                                            <div class="mt-3 mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium">Display Monthly Subscription</v-label>
                                                <v-switch 
                                                    color="primary" 
                                                    v-model="couple_one_month_toggle" 
                                                    hide-details 
                                                    @click="couple_submit(pack_id,'click_one_month')">
                                                </v-switch>
                                                
                                            </div>
                                            <v-label class="mb-2 font-weight-medium">Monthly Subscription</v-label>
                                            <!-- <p class="mt-1 mb-2 text-subtitle-1">A flat rate for unlimited bookings across all packages.</p> -->
                                            <v-text-field v-model="month_price" type="number" class="" variant="outlined" hide-details="auto" placeholder="Enter Monthly Prices" color="primary"></v-text-field>
                                            <v-label class="mb-2 font-weight-medium mt-3">Description<span style="color: red; font-size: 16px;">*</span></v-label>
                                            <v-textarea v-model="description2" hide-details></v-textarea>
                                            
                                            
             
                                        </v-col>
                                        
                                        <v-col cols="12" md="4">
                                            <div class="mt-3 mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium">Display One Time Payment</v-label>
                                                <v-switch 
                                                    color="primary" 
                                                    v-model="couple_one_time_toggle" 
                                                    hide-details 
                                                    @click="couple_submit(pack_id,'click_one_time')">
                                                </v-switch>
                                                
                                            </div>
                                            <v-label class="mb-2 font-weight-medium">One Time Payment</v-label>
                                            <!-- <p class="mt-1 mb-2 text-subtitle-1">A one-time payment per package.</p> -->
                                            <v-text-field v-model="only_month_price" type="number" class="" variant="outlined" hide-details="auto" placeholder="Enter Only One Month Price" color="primary"></v-text-field>
                                            <v-label class="mb-2 font-weight-medium mt-3">Description<span style="color: red; font-size: 16px;">*</span></v-label>
                                            <v-textarea v-model="description3" hide-details></v-textarea>

                                            
                                        
                                        </v-col>

                                        
                                        <v-col cols="12" md="4">
                                            <div class="mt-3 mb-3">
                                                <v-label class="text-subtitle-1 font-weight-medium">Display Single Package Payment</v-label>
                                                <v-switch 
                                                    color="primary" 
                                                    v-model="couple_single_toggle" 
                                                    hide-details 
                                                    @click="couple_submit(pack_id,'click_single')">
                                                </v-switch>
                                                
                                            </div>
                                            <v-label class="mb-2 font-weight-medium">Single Package Payment</v-label>
                                            <!-- <p class="mt-1 mb-2 text-subtitle-1">A one-time payment per package.</p> -->
                                            <v-text-field v-model="single_time_price" type="number" class="" variant="outlined" hide-details="auto" placeholder="Enter One Time Price" color="primary"></v-text-field>

                                            

                                            <v-label class="mb-2 font-weight-medium mt-3">Description<span style="color: red; font-size: 16px;">*</span>
                                            </v-label>
                                            <v-textarea v-model="description" hide-details></v-textarea>

                                            
                                            
                                        </v-col>


                                        <!-- <v-col cols="12" md="4">
                                            <div class="v-card-title text-h5">Category</div>
                                            <p class="mt-1 mb-2 text-subtitle-1">Select your category for paid</p>
                                            <v-select v-model="subscriptCategory" :items="itemCategory" item-title="text" item-value="value" multiple chips  ></v-select>
                                        </v-col> -->
                                        <v-col cols="12" class="text-center">
                                            <v-btn  color="primary" size="large" flat class="px-12"  @click="couple_submit(pack_id)">Save</v-btn>
                                        </v-col>
                                       
                                    </v-row>
                                    
                                    
                                    <!-- <v-btn  color="primary" flat to="/admin-reports/subscriptionpayment" @click="couple_submit(pack_id)">Save</v-btn> -->
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-card-title class="text-h4 text-center text-primary">For Vendors</v-card-title>
                        </v-col>
                    </v-row>
                    <v-row justify="center" class="mt-14 packageDesign mb-10 px-sm-0 px-4">
                        <v-col v-for="pack in packages" :key="pack.id" cols="12"  md="3" sm="6" class="mb-md-0 mb-10 cardPrice" >
                            <div class="h-100">
                            <v-card class="pricing-card pricing-card-new pb-8 overflow-hidden bg-lightprimary border border-primary h-100" elevation="10" :class="{ 'bg-dark activePack': pack.status === 'active' }">
                                <div class="wpo-pricing-itemm">
                                    <div class="wpo-pricing-top signUp">
                                        <div class="d-flex justify-space-between">
                                            <div class="wpo-pricing-img signUp ">
                                                <img :src="packageIcon" alt="" class="w-100">
                                            </div>

                                            <div v-if="pack.lifetime_pack_status" class="toggleFloat">
                                                <v-switch :id="'hs-' + pack.id" color="primary" 
                                                v-model="pack.show_hide"  hide-details
                                                @click="free_trial_toggle(pack,pack.show_hide,'show_hide')"></v-switch>
                                                <v-label  :for="'hs-' + pack.id" class="text-subtitle-1 font-weight-medium ">Display
                                                </v-label>
                                            </div>
                                          
                                        </div>
                                        <div class="">
                                        <h4 class="text-subtitle-3 font-weight-semibold textSecondary mt-1 forCenter" :class="{ 'text-primary': pack.status === 'active' }">{{ pack.name }}</h4>
                                        <div class="position-relative">
                                            <div class="my-3">
                                                <div v-if="pack.lifetime_pack_status" class="carousel">
                                                    <VSlickCarousel v-bind="settingsss">
                                                            <!-- <h2 class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                                                            </h2>
                                                            <h2 class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                                                            </h2> -->
                                                            <h2 v-if="pack.lifetime_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Membership : ${{ pack.lifetime_price }} </span>
                                                            </h2>
                                                    </VSlickCarousel>
                                                </div>
                                                <div v-else class="carousel">
                                                    <VSlickCarousel v-bind="settingsss">
                                                            <h2 class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                                                            </h2>
                                                            <h2 class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                                                            </h2>
                                                            <h2 v-if="pack.lifetime_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Membership : ${{ pack.lifetime_price }} </span>
                                                            </h2>
                                                    </VSlickCarousel>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>

                                            <v-switch :id="'ss-' + pack.id" color="primary" 
                                            v-model="pack.free_trial"  hide-details
                                            @click="free_trial_toggle(pack,pack.free_trial,'update_freetrial_Status')"></v-switch>
                                            <v-label  :for="'ss-' + pack.id" class="text-subtitle-1 font-weight-medium ">Free Trial
                                            </v-label>
                                        </div>

                                        <div class="py-3 d-flex justify-start">
                                            <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary" size="small" @click="gettoupdate(pack)" >
                                                Edit Package
                                            </v-btn>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="border-bottom px-5 py-3 pack-des font-weight-medium ">
                                        <div v-html="pack.description" class="styleforEditorcode forCenter"></div>
                                    </div>
                                    
                                </div>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-card-item>
            <v-dialog v-model="updatepack" scrollable class="dialog-mw" :max-width="600">
                <v-card class="pa-6">
                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                        <h4
                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                            Edit Subscription Package</h4>
                        <v-btn icon color="" @click="updatepack=!updatepack" flat variant="outlined" size="x-small" class="bg-error">
                            <XIcon width="13" />
                        </v-btn>
                    </div> 
                    <div class="pa-0  pt-10 ">
                        <v-row>
                            <v-col cols="12" sm="12">
                                <div class="mb-3">
                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Subscription Name
                                    </v-label>
                                    <VTextField hide-details="auto" v-model="package_name" class="mb-3" required
                                        placeholder="Enter Your Package Name" color="secondary"></VTextField>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <div class="">
                                 
                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Free Trial Days
                                    </v-label>
                                    <VTextField v-model="free_trail_days" hide-details="auto"
                                     required placeholder="Enter Free Trial days" color="secondary"
                                    
                                    :rules="[maxLengthRule]"
                                      type="number"></VTextField>
                                    
                                </div>
                            </v-col> 


                            <v-col v-model="wallet_toggle" cols="12" sm="12">   
                                <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">
                                        Wallet Feature
                                    </v-label>
                                    <v-switch v-model="wallet_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                </div>
                            </v-col>

                            
                            <v-col cols="12" sm="12">
                                <div class="">
                                    <div class="d-flex">
                                        <v-label class="text-subtitle-1 font-weight-medium mr-5">Lifetime Membership Price
                                        </v-label>
                                        <v-switch v-model="lifetime_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                    </div>
                                    <VTextField v-model="lifetime_price" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number"></VTextField>
                                </div>
                            </v-col>

                            <v-col v-if="lifetime_pack_status" cols="12" sm="12">   
                            </v-col>
                            <v-col v-else v-model="yearly_toggle" cols="12" sm="12">   
                                <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">
                                        Annual Subscription Price
                                    </v-label>
                                    <v-switch v-model="yearly_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                </div>
                                <VTextField v-model="yearly_price" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number"></VTextField>
                            </v-col>
                           
                            <v-col v-if="lifetime_pack_status" cols="12" sm="12">   
                            </v-col>
                            <v-col v-else v-model="subscrption_toggle" cols="12" sm="12">   
                                <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">Subscription Monthly Price
                                    </v-label>
                                    <!-- <v-switch v-model="subscrption_toggle"  color="primary" class="justify-content-end" hide-details></v-switch> -->
                                    <v-switch v-model="subscrption_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                </div>
                                <VTextField v-model="packgeprice" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number"></VTextField>
                            </v-col>
                            
                            

                            <v-col v-if="lifetime_pack_status" cols="12" sm="12">
                                <!-- <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">One Time Payment
                                    </v-label>
                                    <v-switch v-if="lifetime_pack_status" v-model="onetime_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                </div>
                                <VTextField v-model="onetimepackgeprice" hide-details="auto" required placeholder="Enter Package One Time Price" color="secondary" type="number"></VTextField> -->
                            </v-col>


                            <v-col v-else v-model="onetime_toggle" cols="12" sm="12">
                                <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">One Time Payment for Month
                                    </v-label>
                                    <v-switch  v-model="onetime_toggle"  color="primary" class="justify-content-end" hide-details></v-switch>
                                </div>
                                <VTextField v-model="onetimepackgeprice" hide-details="auto" required placeholder="Enter Package One Time Price" color="secondary" type="number"></VTextField>
                            </v-col>

                            <!-- <v-col v-else cols="12" sm="12">
                                <div class="d-flex">
                                    <v-label class="text-subtitle-1 font-weight-medium mr-5">One Time Payment for Month
                                    </v-label>
                                </div>
                                <VTextField v-model="onetimepackgeprice" hide-details="auto" required placeholder="Enter Package One Time Price" color="secondary" type="number"></VTextField>
                            </v-col> -->



                            <v-col cols="12" sm="12">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Features</v-label>
                                <!-- <div class="">
                                    <v-textarea v-model="packagedes" outlined name="Note" placeholder="Subscription Features" hide-details
                                    color="secondary"></v-textarea>
                                </div> -->
                                <div class="border rounded">
                                    <div v-if="editor"> <EditorMenubar :editor="editor" /> </div>
                                    <editor-content :editor="editor" ref="editorContentRef" />
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <v-card-actions class="px-0 d-flex justify-end w-100 mt-8">
                        <v-btn class="bg-error rounded-sm" text @click="updatepack=!updatepack" flat>
                            Close
                        </v-btn>
                        <v-btn class="bg-success rounded-sm" text flat @click="update_me(true)">
                            Update
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
    .modal-header-border {
        border-bottom: 2px solid #cccccc61;
    }
    .imageSizeMain {
        width: 90px;
        height: 90px;
    }
   .wpo-pricing-img.signUp {
      width: 50px;
    height: 50px;
    padding: 4px;
    position: relative;
    background: #131314;
    box-shadow: 0 0 30px #0000001f;
    overflow: hidden;
}

    .wpo-pricing-img.signUp img,
    .packselectimg img {
        height: 100%;
        object-fit: cover;
    }

    .wpo-pricing-top.signUp {
        padding: 25px;
    }
    .custom-size-font {
        font-size: 25px;
    }

    .custom-size-font span {
        font-size: 14px;
    }
    .pack-des p{
        font-size: 12px;
        line-height: 1.6em;
    }
    /* .pack-des li {
        font-size: 13px;
        border-bottom: 1px solid #cccccc42;
        padding: 4px 0px;
    } */
    .activePack .pack-des li {
        color: rgb(var(--v-theme-primary)) !important;
        border-bottom : 1px solid #00000017;
    }
    .activePack .wpo-pricing-top {
        border-bottom : 1px solid #00000017;
    }

    

.packageDesign .cardPrice:nth-child(2) .pricing-card-new {
  background: #131314 !important;
    /* transform: scale(1.1); */
    position: relative;
    z-index: 1;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .pkgbtn{
   background: rgb(var(--v-theme-primary)) !important; 
}
.packageDesign .cardPrice:nth-child(2) .wpo-pricing-top {
    border-bottom: 1px solid #cccccc42;
}
.packageDesign .cardPrice:nth-child(2) .forCenter {
    color: #fff !important;
}
.styleforEditorcode {
  font-size: 13px;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .wpo-pricing-img.signUp{
  background: #353535 !important;
}
.pricing-card{
      box-shadow: 0 0 30px #00000024 !important;
    border-radius: 15px !important;
}
.packageDesign .cardPrice:nth-child(2) .RecuText{
  color: #fff !important;
  font-weight: 500;
}
.subsSlider .carousel__slide  {
    justify-content: flex-start;
    padding: 5px 0px !important;
}
.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
}

.ctm_crousel button.arrow-button span {
    display: flex;
    background: #fff;
    width: 30px;
    height: 47px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
}

.ctm_crousel button.arrow-button.next {
    right: 12px;
}
.dabbe {
    font-size: 20px;
    border-radius: 6px;
}
.dabbe span {
    font-size: 12px;
}
.packageDesign .cardPrice:nth-child(2) label.v-label.text-subtitle-1 {
    color: #fff;
}
.newBorderS .v-field--variant-outlined .v-field__outline {
    color: #00000047;
}
.toggleFloat {
    position: absolute;
    right: 10px;
    top: -5px;
}
</style>