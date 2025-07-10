<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import user1 from "@/assets/images/profile/defaultuserimg.png";
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';


const coupledata = ref([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Requested', 'Accepted', 'Rejected', 'Paid']);
const searchbudget = ref();
const searchlocation = ref();
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');



const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const zipcodeitem = ref([])
const city = ref();
const state = ref();
const country = ref();
const zipcode = ref();
const profile_img = ref();
const f_name = ref();
const l_name = ref();
const u_email = ref();
const u_phone = ref();
const showsearch = ref(false);
const usertype = ref('customer');
const agree = ref(false);
const izipcode = ref();
import imagePath from '@/assets/images/wedding/dummyProfile.webp'
import dummyLogo from '@/assets/images/website/packageIcon.png'
const updatecouple            =   ref(false)


const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);


const filteredList = computed(() => {
    console.log("searchdate____", searchdate.value)
    const isearch = search.value.toLowerCase()
    const ilist = coupledata.value.filter((i:any) => (
        i.couplename.toLowerCase().includes(isearch) ||
        i.coupleemail .toLowerCase().includes(isearch) ))
        // i.couplenumber.includes(isearch) ||
        // String(i.couplenumber).includes(isearch) 

    return ilist.filter((item:any) =>
        (   
            // (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.status.toLowerCase())) &&
            ([undefined, null, ''].includes(searchbudget.value) || String(item.couplenumber).includes(String(searchbudget.value))) &&
            ([undefined, null, ''].includes(searchlocation.value) || String(item.couplecity).includes(String(searchlocation.value)) || String(item.couplestate).includes(String(searchlocation.value))) &&
            ([undefined, null, ''].includes(searchdate.value) || (searchdate.value == item.registerdate))
        )
    );
});
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});



const clickFunModal = (item: any) => { item.dialog = true }
const range = ref({ start: new Date(2024, 8, 1), end: new Date(2024, 8, 5) });

const total_count = ref(0);
async function initlisting(){
    const response = await axios.post('/home/list_cnv')
   
    if (response.data.status == 'SENT'){
        console.log("response_____________________", response.data)
        countryitem.value = response.data.countries
        total_count.value=response.data.cp.length;
        coupledata.value = response.data.cp.map((a:any, index:any) =>({
            sno             :   index + 1,
            cid             :   a.id,
            coupleimg       :   (a.userprofile.profile_pic) ? BASE_URL + a.userprofile.profile_pic : '/src/assets/images/profile/user-1.jpg',
            couplename      :   `${a.userprofile.user.first_name} ${a.userprofile.user.last_name}`,
            coupleemail     :   a.userprofile.user.email,
            couplenumber    :   a.userprofile.phone,
            coupletype      :   a.created_by,
            couplestate     :   (a.userprofile.state)   ? (a.userprofile.state.state)   : '',
            couplecity      :   (a.userprofile.city)    ? (a.userprofile.city.city)     : '',
            registerdate    :   a.userprofile.created_at,
            link            :   `/couple-single/${a.id}`,
            linkchat        :   `/achats?march=${a.chatid}`
        }))
        fullpageloader.value = false;
    }
    else{
        fullpageloader.value = false;
    }
}
initlisting()

const file_id       =   ref();
const couple_csv    = ref();

async function Couple_file_data(event: InputEvent) {
    console.log('------aaa')
    const input = event.target as HTMLInputElement;
    console.log('------aaa',input.files)
    if (input.files && input.files[0]) {
        console.log('Selected file:', couple_csv.value);
        couple_csv.value = input.files[0]
        console.log('Selected file:', couple_csv.value);
        const reader = new FileReader();

    }
    const formdata = new FormData()
   
      
        formdata.append('couple_filecsv', couple_csv.value)  
        fullpageloader.value = true;   
        const response = await axios.post('/home/couple_csv',formdata)    
      
        console.log("response_____________package", response.data)
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
        setTimeout(() => { window.location.reload();}, 800);
        
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




async function sendEmail(email="") {
    const response = await axios.post('/home/send_email', { 'email': email, })
    if (response.data.status == 'DONE') {
      
        alert("email send")
    }
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
                profile_img.value = input.files[0]; 
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


async function create_couple(){
    fullpageloader.value = true
    if (
        !f_name.value ||
        !l_name.value ||
        !u_email.value ||
        !u_phone.value ||
        !country.value?.value ||
        !state.value?.value ||
        !city.value?.value ||
        !zipcode.value
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
    formdata.append('country', country.value['value']);
    formdata.append('state', state.value['value']);
    formdata.append('city', city.value['value']);
    formdata.append('zipcode', zipcode.value);

    try{
        const response =  await axios.post(`/home/Create_couple_form`, formdata, { headers: { 'Content-type': 'multipart/form-data' }, withCredentials: true }
        )
        
        console.log('create_couple__',response.data)
        if (response.data.status === 'UPDATED') {
            updatecouple.value = false;
            showSuccessMessage.value = true;
            myerrors.value = 'Couple Profile created successfully.';
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
                    <v-row class="justify-space-between  pt-3 test gap-2 ma-1">
                        <v-col cols="12" md="4"> <v-card-title class="text-h4 ">All Couples ({{total_count}})</v-card-title> </v-col>


                       
                        <!-- <label for="file">Upload CSV  
                            <input  @click="Couple_file_data" type="file" id="file" ref="file" />
                        </label> -->

                        <div class="d-flex">  

                        <v-btn color="secondary" variant="outlined"  hide-details class="rounded-sm d-flex me-2 align-center mb-screen"  @click="updatecouple = true"> Create Couple </v-btn>
                        <v-dialog v-model="updatecouple" scrollable class="dialog-mw" :max-width="600">
                        <v-card class="pa-6">
                        <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                        <h4
                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                            Create Couple </h4>
                        <v-btn icon color="" @click="updatecouple=!updatecouple" flat variant="outlined" size="x-small" class="bg-error">
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
                            <v-col cols="12" md="6" class="pb-0">
                               
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

                    </v-row>
                </div>
                    <v-card-actions class="px-0 d-flex justify-end w-100 mt-8">
                        <v-btn class="bg-error rounded-sm" text @click="updatecouple=!updatecouple" flat>
                            Close
                        </v-btn>
                        <v-btn class="bg-success rounded-sm" text flat @click="create_couple()">
                            Save
                        </v-btn>
                    </v-card-actions>
                        </v-card>
                </v-dialog>


                        <input @change="Couple_file_data" class="d-none" type="file" id="file" ref="file"/>
                        <label class="v-btn v-theme--BLUE_THEME text-secondary v-btn--density-default v-btn--size-default v-btn--variant-outlined rounded-sm d-flex align-center mb-screen cursor-pointer mr-2" for="file">Upload CSV</label>

                        <v-menu open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn color="secondary" variant="outlined" v-bind="props"  hide-details class="rounded-sm d-flex align-center mb-screen">Download Report <CaretDownIcon stroke-width="1"/> </v-btn>
                            </template>
                            <v-list class="pa-3">
                                <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 mb-3 rounded-sm d-flex align-center" @click="downloadData('itable')"> Pdf </v-btn> 
                                <v-btn color="secondary" variant="flat" size="small"  hide-details class="w-100 rounded-sm d-flex align-center" @click="exportToExcel('itable')"> Excel </v-btn>
                            </v-list>
                        </v-menu>
                    </div>
                       
                    </v-row>
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightsecondary">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Couple" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search Phone" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                            <v-col cols="12" md="3">
                                                <v-text-field density="compact" color="secondary" v-model="searchlocation" label="Search City/State" hide-details variant="outlined" ></v-text-field>
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
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Couple Name</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Created By</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Phone Number</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Address</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Joining Date</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5"
                                        class="month-item">
                                        <td><h5 class="text-no-wrap text-body-1 font-weight-medium">{{ item.sno }}</h5></td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            #  {{ item.cid }}
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                <div class="d-flex align-start">
                                                    <v-avatar size="50" class="rounded-sm">
                                                        <img :src="item.coupleimg" :alt="item.img" width="50"
                                                    /></v-avatar>
                                                    <div class="mx-3">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.couplename}}</h4>
                                                        <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.coupleemail}}</h6>
                                                    </div>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <div class="">
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.coupletype }}</h6>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <div class="">
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplenumber }}</h6>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <div>
                                                <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplestate}}</h6>
                                                <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.couplecity}}</h6>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.registerdate}}</h6>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex justify-center">
                                            <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                <v-tooltip text="Chat">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props"  :to="item.linkchat">
                                                            <Message2Icon stroke-width="2.5" size="18" class="text-success"/>
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </h5>
                                            <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                <v-tooltip text="View Couple">
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
                                            <v-col cols="12" v-if="filteredList.length === 0">
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