<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import user1 from "@/assets/images/profile/defaultuserimg.png";
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';


const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);



const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const zipcodeitem = ref([])
const city = ref();
const state = ref();
const country = ref();
const zipcode = ref();
const cats = ref([]);
const pack_data = ref();
const profile_img = ref();
const f_name = ref();
const l_name = ref();
const u_email = ref();
const u_phone = ref();
const showsearch = ref(false);
const usertype = ref('vendor');
const agree = ref(false);
const business_logo = ref();
const brandValue = ref('')
const catItems = ref(['Mumbai', 'Delhi',]);
const pack_Items = ref([]);
const izipcode = ref();
import imagePath from '@/assets/images/wedding/dummyProfile.webp'
import dummyLogo from '@/assets/images/website/packageIcon.png'
const updatevendor            =   ref(false)



const vendordata    = ref([]);
const searchdate    = ref()
const statusvalue   = ref('All');
const statusitem    = ref(['All', 'Active', 'Inactive']);
const searchpack    = ref('All');
const packitem      = ref(['All','open','close','both']);
const searchbudget  = ref();
const search        = ref('');
const itemsPerPage  = 5;
const currentPage   = ref(1);



const filteredList = computed(() => {
    console.log("searchdate____", searchdate.value)
    const isearch = search.value.toLowerCase()
    const ilist = vendordata.value.filter((i:any) => (
        i.vendorname.toLowerCase().includes(isearch) ||
        String(i.vendornumber).includes(isearch) ||
        i.businessname.toLowerCase().includes(isearch) ||
        i.categoryname.toLowerCase().includes(isearch) ||
        i.vendoremail .toLowerCase().includes(isearch) ))
        // i.couplenumber.includes(isearch) ||
        // String(i.couplenumber).includes(isearch) 

    return ilist.filter((item:any) =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || (statusvalue.value.toLowerCase() == item.statustext.toLowerCase())) &&
            (searchpack.value.length === 0 || searchpack.value.includes('All') || searchpack.value.toLowerCase().includes(item.activepackagetype.toLowerCase())) &&
            ([undefined, null, ''].includes(searchdate.value) || (searchdate.value == item.registerdate))
        )
    );
});
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});
const clickFunModal = (item: any) => {  item.dialog = true }
const range = ref({ start: new Date(2024, 8, 1),    end: new Date(2024, 8, 5)   });


const total_count = ref(0);
async function initlisting(){
    const response = await axios.post('/home/list_cnv')
   
    if (response.data.status == 'SENT') {
        console.log("response_____________________", response.data);
        countryitem.value = response.data.countries
        catItems.value = response.data.cats.map((a: any) => (a.name))
        pack_Items.value = response.data.packs.map((a:any) =>(a.name))
        total_count.value = response.data.vp.length;
        vendordata.value = response.data.vp.map((a:any, index) => ({
            sno                 :   index + 1,
            vid                 :   a.id,
            vendorimg           :   (a.userprofile.profile_pic) ? BASE_URL + a.userprofile.profile_pic : '/src/assets/images/profile/user-1.jpg',
            vendorname          :   `${a.userprofile.user.first_name} ${a.userprofile.user.last_name}`,
            vendoremail         :   a.userprofile.user.email,
            vendornumber        :   a.userprofile.phone,
            businessname        :   a.business_name,
            categoryname        :   (a.category) ? a.category.map((i:any) => (i.name)).join(' ,') : 'No Category',
            statuscolor         :   (a.is_active && a.pk_active) ? "success" : "error",
            statustext          :   (a.is_active) ? 'Active user' : 'Suspended user',
            activepackagetype   :   a.v_role + ` (${(a.pk_active) ? 'Active' : 'Expired'})`,
            registerdate        :   a.userprofile.created_at,
            link                :   `/vendor-profile/${a.id}`,
            chat                :   `/achats?march=${a.chatid}`
        }));

        fullpageloader.value = false;
    } else {
        fullpageloader.value = false;
    }

}
initlisting()



const file_id       =   ref();
const vendor_csv    = ref();

async function Vendor_file_data(event: InputEvent) {
    console.log('------aaa')
    const input = event.target as HTMLInputElement;
    console.log('------aaa',input.files)
    if (input.files && input.files[0]) {
        console.log('Selected file:', vendor_csv.value);
        vendor_csv.value = input.files[0]
        console.log('Selected file:', vendor_csv.value);
        const reader = new FileReader();

    }
    const formdata = new FormData()
   
      
        formdata.append('vendor_filecsv', vendor_csv.value)
        fullpageloader.value = true;     
        const response = await axios.post('/home/vendor_csv',formdata)    
        console.log("response_____________package", response.data)
        
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
        setTimeout(() => { window.location.reload();}, 800);
        // initlisting()
    }
    if (response.data.status == 'all_fields'){
        showSuccessMessage.value = true;
        myerrors.value = 'Oops! All fields are required. Please fill them in to continue.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }
    if (response.data.status == 'Email_FAILED'){
        showSuccessMessage.value = true;
        myerrors.value = 'This email is already in use. Please use a different email or log in.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }
        
    };
   


function exportToExcel(itable:any=null) {
    const tableWrapper = document.getElementById(itable);
    if (!tableWrapper) { console.error('Table wrapper element not found'); return; } //table wrapper exists or not
    const table = tableWrapper.querySelector('table');
    if (!table) { console.error('Table element not found inside the wrapper'); return; } //table exists or not

    const worksheet = XLSX.utils.table_to_sheet(table); //Convert table to worksheet
    const workbook = XLSX.utils.book_new(); //new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Append the worksheet to the workbook
    XLSX.writeFile(workbook, `data_${itable}.xlsx`); // Generate Excel file and download it
}

function downloadData(itable:any=null){
    const tableWrapper = document.getElementById(itable);
    if (!tableWrapper) { console.error('Table wrapper element not found'); return; } //table wrapper exists or not

    const options = {
    margin: 1,
    filename: `data_${itable}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
    };
    html2pdf().from(tableWrapper).set(options).save();
}

// start today code

const f_NameRules = ref([(v: string) => !!v || 'Please Enter Your First Name']);
const l_NameRules = ref([(v: string) => !!v || 'Please Enter Your Last Name']);
const reqrules = ref([(v: string) => !!v || 'This field is required']);

const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const emailRules = ref([
    (v: string) => {
        if (!v) {
            return 'Please enter email';
        } else if (/^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(v)) {
            return true; // Valid email format with specified domain extensions
        } else {
            return 'Enter a Valid Email';
        }
    }
]);
function checklength(){
    if(u_phone.value) u_phone.value = (u_phone.value.length > 10) ? u_phone.value.slice(0,10).replace(/\D/g, "") : u_phone.value.replace(/\D/g, "");
    if(u_email.value) u_email.value = (u_email.value.length > 100) ? u_email.value.slice(0,100) : u_email.value
}



async function getstate(sel_sid=null) {
    fullpageloader.value = true
    const response = await axios.post('home/getstate', { cid: country.value })
    if (response.data.status == 'SAVED') {
        stateitem.value = response.data.states
        cityitem.value = []
        state.value = (sel_sid) ? stateitem.value.find((a:any)=>(a.value===sel_sid)) : null
        city.value = null
        if (!(sel_sid)) zipcode.value = null
        fullpageloader.value = false
        showsearch.value = false
    }
}
async function getcity(sel_cid=null) {
    fullpageloader.value = true
    const response = await axios.post('home/getcity', { sid: state.value })
    if (response.data.status == 'SAVED') {
        cityitem.value = response.data.cities
        city.value = (sel_cid) ? cityitem.value.find((a:any)=>(a.value===sel_cid)) : null
        if (!(sel_cid)) zipcode.value = null
        fullpageloader.value = false
        showsearch.value = false
    }
}
function setzipcode() { zipcodeitem.value = city.value['zipcode'], zipcode.value= city.value['zipcode'][0]}
                        // zipcodeitem


const profile = ref({ profileImage: imagePath, logo: dummyLogo })
const handleImageUpload = (event: InputEvent, type: string) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'profile_pic') {
                profile_img.value = input.files[0]; // Assuming profile_img is a ref
                profile.value.profileImage = reader.result as string;

            } 
        };
        reader.readAsDataURL(input.files[0]);
    }
};                    


async function fetch_add(){
    if ((izipcode.value.length == 5) && (/^\d+$/.test(izipcode.value))){
        fullpageloader.value = true
        const response = await axios.post('home/get_location', { zip: izipcode.value })
        if (response.data.status == 'SENT') {
            if (response.data.selcity){
                country.value = response.data.selcountry
                stateitem.value = response.data.states
                cityitem.value = response.data.cities
                state.value = response.data.selstate
                city.value = response.data.selcity
                zipcodeitem.value = city.value['zipcode'], zipcode.value= izipcode.value
                showsearch.value = false
                izipcode.value = null
            } fullpageloader.value = false
        }else{
            showErrorMessage.value = true;
            myerrors.value = 'No cities found!';
            setTimeout(() => { showErrorMessage.value = false; }, 1500);
            fullpageloader.value = false
            izipcode.value = null
        }
    }else {city.value = null; state.value = null; country.value = null; cityitem.value = []; stateitem.value = []; zipcodeitem.value = [], zipcode.value=null}
}



async function create_vendor(){
    fullpageloader.value = true
    if (
        !f_name.value ||
        !l_name.value ||
        !u_email.value ||
        !u_phone.value ||
        !country.value?.value ||
        !state.value?.value ||
        !city.value?.value ||
        !zipcode.value ||
        !brandValue.value ||
        !cats.value ||
        !pack_data.value
    ) {
        showErrorMessage.value = true;
        myerrors.value = 'Please fill in all required fields.';
        setTimeout(() => { showErrorMessage.value = false; fullpageloader.value = false; }, 1000);
        return;
    }
    var formdata = new FormData();
    formdata.append('utype', usertype.value);
    formdata.append('first_name', f_name.value);
    formdata.append('last_name', l_name.value);
    formdata.append('email', u_email.value);
    formdata.append('phone', u_phone.value);
    formdata.append('ppic', profile_img.value);
    formdata.append('cats', cats.value);
    formdata.append('bname', brandValue.value);
    formdata.append('country', country.value['value']);
    formdata.append('state', state.value['value']);
    formdata.append('city', city.value['value']);
    formdata.append('zipcode', zipcode.value);
    formdata.append('package', pack_data.value);

    try{
        const response =  await axios.post(`/home/Create_vendor_form`, formdata, { headers: { 'Content-type': 'multipart/form-data' }, withCredentials: true }
        )
        
        console.log('create_vendor__',response.data)
        if (response.data.status === 'UPDATED') {
            updatevendor.value = false;
            showSuccessMessage.value = true;
            myerrors.value = 'Vendor Profile created successfully.';
            setTimeout(() => {
                showSuccessMessage.value = false; 
            }, 3000);
            setTimeout(() => { window.location.reload();}, 800);
            
        }else if (response.data.status === 'all_fields'){
        showErrorMessage.value = true;
        myerrors.value = 'Oops! All fields are required. Please fill them in to continue.';
        setTimeout(() => { showErrorMessage.value = false; fullpageloader.value = false; }, 3000);
    }
    else if (response.data.status === 'Email_FAILED'){
        showErrorMessage.value = true;
        myerrors.value = 'This email is already in use. Please use a different email or log in.';
        setTimeout(() => { showErrorMessage.value = false; fullpageloader.value = false; }, 3000);
    }else {
            showErrorMessage.value = true;
            myerrors.value = 'Something went wrong. Please try again';
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
            fullpageloader.value = false;
        }
    }catch (error) { 
        console.error('Error:', error); 
    }finally {
        fullpageloader.value = false;  
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
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">All Vendors ({{ total_count }})</v-card-title></v-col>


                        <v-col cols="12" md="5" class="d-md-flex d-block gap-2 justify-end">
                        
                        <v-btn color="secondary" variant="outlined"  hide-details class="rounded-sm d-flex align-center mb-screen"  @click="updatevendor = true"> Create Vendor </v-btn>
                        <v-dialog v-model="updatevendor" scrollable class="dialog-mw" :max-width="600">
                        <v-card class="pa-6">
                        <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                        <h4
                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                            Create Vendor </h4>
                        <v-btn icon color="" @click="updatevendor=!updatevendor" flat variant="outlined" size="x-small" class="bg-error">
                            <XIcon width="13" />
                        </v-btn>
                    </div> 
                    <div>
                        <v-row>
                            
                        <v-col cols="12" md="12">
                            <div class="text-center bg-lightprimary pa-5 rounded">
                                <h3 class="text-h6 text-primary pb-4">Your Profile Image</h3> 
                                <div class="imageGroupMain profileGroup">
                                    <label for="profilePicInput" class="labelStImgPro">
                                        <input type="file" id="profilePicInput" class="d-none"
                                            @change="handleImageUpload($event, 'profile_pic')" accept="image/*"
                                            :rules="reqrules">
                                        <p class="floatPlus">+</p>
                                    </label>
                                    <div class="imageSizeMain">
                                        <img :src="profile.profileImage" alt="Uploaded Image" style="max-inline-size: 300px;">
                                    </div>
                                </div>
                            </div>
                            </v-col>
                       
                            <v-col cols="12" md="6" class="pb-0">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">First Name<span
                                        class="text-error ma-1"><sup>*</sup></span></v-label>
                                <VTextField v-model="f_name" :rules="f_NameRules" hide-details="auto"
                                    class="mb-0 is-invalid" required placeholder="Enter First Name" type="text" maxlength="30"></VTextField>

                            </v-col>
                            
                            <v-col cols="12" md="6" class="pb-0">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Last Name <span
                                        class="text-error ma-1"><sup>*</sup></span></v-label>
                                <VTextField v-model="l_name" :rules="l_NameRules" hide-details="auto" class="mb-0"
                                    required placeholder="Enter Last Name" type="text" maxlength="30"></VTextField>
                            </v-col>
                            <v-col cols="12" md="12" class="pb-0">
                               
                                 <v-label class="text-subtitle-1 font-weight-medium pb-2">Email
                                                <span class="text-error ma-1"><sup>*</sup></span></v-label>
                                   
                                    <VTextField v-model="u_email" type="email" maxlength="100" :rules="emailRules" hide-details="auto" class="mb-0" required placeholder="Enter Email" @keyup="checklength()"></VTextField>
                               
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number <span
                                        class="text-error ma-1"><sup>*</sup></span></v-label>
                            
                                    <VTextField v-model="u_phone" hide-details="auto" :rules="phonenoRules" class="mb-0"
                                        required placeholder="Enter Phone" type="text" maxlength="10" @keyup="checklength()"></VTextField>
                                
                            </v-col>
                            <v-col>
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Category<span class="text-error ma-1"><sup>*</sup></span></v-label>


                                
                                <v-select multiple v-model="cats" :items="catItems" item-text="text" item-value="value"
                                    label="Select Categories" single-line variant="outlined" hide-details return-object
                                    required :rules="reqrules">
                                </v-select>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Your Brand/Business Name<span
                                        class="text-error ma-1"><sup>*</sup></span></v-label>
                                <VTextField v-model="brandValue" required placeholder="Enter Brand name" hide-details
                                    :rules="reqrules"></VTextField>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span
                                    class="text-error ma-1"><sup>*</sup></span></v-label>
                            <v-select v-model="country" :items="countryitem" item-title="text" item-value="value"
                                label="Select Country" single-line variant="outlined" hide-details
                                @update:modelValue="getstate()" return-object required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">State<span
                                    class="text-error ma-1"><sup>*</sup></span></v-label>

                            <v-select v-model="state" :items="stateitem" item-title="text" item-value="value"
                                label="Select State" single-line variant="outlined" hide-details
                                @update:modelValue="getcity()" return-object required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">City<span class="text-error ma-1"><sup>*</sup></span></v-label>
                            <v-select v-model="city" :items="cityitem" item-title="text" item-value="value"
                                label="Select City" single-line variant="outlined" hide-details return-object required @update:modelValue="setzipcode()" :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-if="showsearch">
                        <div class="">
                            <div class="d-flex justify-space-between">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Search zipcode</v-label>
                                <span @click="showsearch = !showsearch" class="text-error ma-1">
                                    <CircleXIcon width="18" class="v-icon--start" /></span>
                            </div>
                            <VTextField v-model="izipcode" required placeholder="Enter zipcode to search" hide-details @keyup="fetch_add()" maxlength="5"></VTextField>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6" class="pb-0" v-else>
                        <div class="">
                            <div class="d-flex justify-space-between">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Zipcode<span
                                        class="text-error ma-1"><sup>*</sup></span></v-label><span @click="showsearch = !showsearch" class="text-primary cursor-pointer ma-1 d-flex align-center"><SearchIcon width="14"/><span class="ms-1 text-body-2">
                                            Enter Zipcode
                                        </span></span>
                            </div>
                            <v-select v-model="zipcode" :items="zipcodeitem" label="Select Zipcode" single-line variant="outlined" hide-details required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Package<span
                                    class="text-error ma-1"><sup>*</sup></span></v-label>
                            <v-select v-model="pack_data" :items="pack_Items" item-title="text" item-value="value"
                                label="Select Package" single-line variant="outlined" hide-details
                               return-object required >
                            </v-select>
                        </div>
                    </v-col>
                    </v-row>
                </div>
                    <v-card-actions class="px-0 d-flex justify-end w-100 mt-8">
                        <v-btn class="bg-error rounded-sm" text @click="updatevendor=!updatevendor" flat>
                            Close
                        </v-btn>
                        <v-btn class="bg-success rounded-sm" text flat @click="create_vendor()">
                            Save
                        </v-btn>
                    </v-card-actions>
                        </v-card>
                </v-dialog>

                        






                        <label class="v-btn v-theme--BLUE_THEME text-secondary v-btn--density-default v-btn--size-default v-btn--variant-outlined rounded-sm d-flex align-center mb-screen cursor-pointer mr-2" for="file">Upload CSV
                        <input @change="Vendor_file_data" class="d-none" type="file" id="file" ref="file"/>
                        </label>



                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center mb-screen"> Download Report <CaretDownIcon stroke-width="1"/> </v-btn>
                                </template>
                                <v-list class="pa-3">
                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('itable')"> Pdf </v-btn>
                                    <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('itable')"> Excel </v-btn>
                                </v-list>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightsecondary">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Vendor" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="packitem" v-model="searchpack" label="Filter By package" hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status" hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>                                        
                                        <v-col cols="12" md="3" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By Joining date" density="compact"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div id="itable">
                        <v-table class="month-table mt-6 border rounded">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor Info</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Business Name</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Joining Date</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Status</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5"
                                        class="month-item">
                                        <td><h5 class="text-no-wrap text-body-1 font-weight-medium">{{ item.sno }}</h5></td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            # {{ item.vid }}
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                <div class="d-flex align-start">
                                                    <v-avatar size="50" class="rounded-sm">
                                                        <img :src="item.vendorimg" :alt="item.img" width="50"
                                                    /></v-avatar>
                                                    <div class="mx-3">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.vendorname}}</h4>
                                                        <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.vendoremail}}</h6>
                                                        <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.vendornumber }}</h6>
                                                    </div>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <div class="">
                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.businessname}}</h4>
                                                    <h6 class="text-subtitle-2 text-wrap text-Darklight font-weight-medium mt-1">{{ item.categoryname}}</h6>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <v-chip size="small" color="info" class="font-weight-semibold">
                                                <DiamondIcon class="mr-2" start size="17" />
                                                {{ item.activepackagetype }}
                                            </v-chip>
                                        </td>
                                        <td><h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.registerdate }}</h6></td>   
                                        <td>
                                            <v-chip rounded="md" class="ma-2 font-weight-semibold" :color="item.statuscolor"
                                                size="small" label>{{ item.statustext }}</v-chip>

                                        </td>
                                        <td>
                                            <div class="d-flex gap-1">
                                                <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="Chat">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.chat">
                                                                <Message2Icon stroke-width="2.5" size="18" class="text-success"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5>
                                                <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="View Vendor">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <v-col cols="12" v-if="paginatedList.length === 0">
                                                <v-card elevation="0" class=" mt-6 border-0" color="">
                                                    <v-card-item class="text-center">
                                                        <AlertCircleIcon stroke-width="1.5" size="50"
                                                            class="mr-2 text-error" />
                                                        <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                        <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                            Search again with another Contract<br> temporary error.
                                                        </h6> -->
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </div>
                    <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}
.custom-border {
    border: 1px solid #bcc3c9;
}
.menuBar {
    border-bottom: 1px solid #bcc3c9;
}
.modal-header-border {
    border-bottom: 2px solid #ccc;
}
.labelStImgPro {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.imageGroupMain {
    position: relative;
    display: inline-block;
}
.imageSizeMain {
    width: 220px;
    height: 220px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #fff;
    background-color: #e1e7ed;
    display: flex;
    justify-content: center;
    align-items: center;
}
.imageSizeMain {
    inline-size: 70px;
    block-size: 70px;
}
.floatPlus {
    position: absolute;
    inset-inline-end: -10px;
    inset-block-end: 3px;
    transform: translate(-50%);
    inline-size: 25px;
    block-size: 25px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #b4801c;
    font-weight: 700;
}
</style>