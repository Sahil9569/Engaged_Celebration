<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserCircleIcon,ArticleIcon } from 'vue-tabler-icons';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { SearchIcon, CircleXIcon } from 'vue-tabler-icons';



const adminValue            = ref();
const adminPacks            = ref([]);
const vendorValue           = ref();
const vendorPacks           = ref([]);

const categorySortadmin     = ref([]);
const categorySortvendor    = ref([]);
const categoryItems         = ref([]);
const config                = { headers:{'Content-Type':'application/json'}, withCredentials:true }
const ipic                  = JSON.parse(localStorage.getItem('user')).profile_pic
const upic                  = (ipic) ? BASE_URL + ipic : '/src/assets/images/profile/user-1.jpg'

const fullpageloader        = ref(false)
const showSuccessMessage    = ref(false)
const showErrorMessage      = ref(false)
const myerrors              = ref('')
const currentpwd            = ref('');
const newpwd                = ref('');
const confirmpwd            = ref('');
const show2                 = ref(false);
const show3                 = ref(false);
const show4                 = ref(false);
const tab                   = ref(null);
const imagePreview          = ref<HTMLImageElement | null>(null);
const izipcode = ref();
const showsearch = ref(false);

const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
        if (imagePreview.value) {
            imagePreview.value.src = reader.result as string;
        }
    };
    reader.readAsDataURL(file);
    changepic({pic:file})
  }
};
const resetImagePreview = async () => {
    if (imagePreview.value) { imagePreview.value.src = upic; }
    const input = document.getElementById('imageInput') as HTMLInputElement;
    if (input) { input.value = ''; }
    changepic({reset:true})
};
async function changepic(data){
    const response = await axios.post('home/update_pic', data, {headers:{'Content-Type':'multipart/form-data'}, withCredentials:true})
    fullpageloader.value = true
    if (response.data.status == 'SAVED'){ 
        localStorage.setItem('user',JSON.stringify(response.data.user)); 
        showSuccessMessage.value = true;
        myerrors.value = 'Image updated.';
        setTimeout(() => {window.location.reload();}, 1500); 
    }
}
async function changep(){
    if (!(ivalidate('B'))){return null}
    const response = await axios.post('home/change_password', {password0:currentpwd.value, password1:newpwd.value, password2:confirmpwd.value}, config)
    console.log("response_________________hi", response.data)
    if (response.data.status == 'DONE'){
        showSuccessMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showSuccessMessage.value = false; }, 3000); 
    }else{
        showErrorMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showErrorMessage.value = false; }, 3000); 
    }
}
async function changebd(){
    if (!(ivalidate('A'))){return null}
    fullpageloader.value = true
    var fd = new FormData()
    fd.append('f_name', f_name.value)
    fd.append('l_name', l_name.value)
    fd.append('u_email', u_email.value)
    // fd.append('ccode', ccode.value) //zipcode not needed to send
    fd.append('u_phone', u_phone.value)
    fd.append('country', country.value['value'])
    fd.append('state', state.value['value'])
    fd.append('city', city.value['value'])
    fd.append('zipcode', zipcode.value)


    const response = await axios.post('home/profileupdate', fd, config)
    console.log("response_________________", response.data)
    if (response.data.status == 'DONE') {
        localStorage.setItem('user', JSON.stringify(response.data.cuser));
        showSuccessMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showSuccessMessage.value = false; window.location.reload() }, 3000);
    } else {
        fullpageloader.value= false
        showErrorMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
    }
}


function ivalidate(section=null){
    myerrors.value = 'Please fill all required fields!';
    var rslt = false
    if (section == 'A'){
        const isValidphone = phonenoRules.value.every((rule:any) => rule(u_phone.value) === true);
        const checkemail = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(u_email.value)
        rslt = (f_name.value && l_name.value && u_email.value && checkemail && isValidphone && country.value && state.value && city.value)
    }else if(section == 'B'){
        if (!(currentpwd.value && newpwd.value && confirmpwd.value)){ myerrors.value = 'Please fill all required fields!'; rslt = false }
        else if (newpwd.value != confirmpwd.value){ myerrors.value = 'Passwords not matching!'; rslt = false }
        else rslt = true
    }
    if (!(rslt)){ showErrorMessage.value = true; setTimeout(() => {  showErrorMessage.value = false; }, 3000); }
    return rslt
}



const f_name = ref('');
const l_name = ref('');
const u_email = ref('');
const u_phone = ref('');
const zipcode = ref();
const city = ref();
const state = ref();
const country = ref();
const packname = ref();
const zipcodeitem = ref([])
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const matchrules          = ref([ (v: string) => {
    if (!v) { return 'This field is required.'; } else {  return (v === newpwd.value) ? true : 'Passwords does not match';  }
}]);
const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const reqrules   = ref([(v: string) => !!v || 'This field is required']);
const reqrulese = ref([
    (v) => !!v || 'This field is required',
    (v) => /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(v) || 'Please enter a valid email'
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

(async function(){
    fullpageloader.value = true
    const response = await axios.post('home/profileupdate', {"getdata":true})
    console.log("response___________", response.data)
    if (response.data.status == 'SENT') {

        packname.value=response.data.user_package.package.name
        const iuser = response.data.cuser

        countryitem.value   = response.data.countries
        stateitem.value     = response.data.states
        cityitem.value      = response.data.cities
        zipcodeitem.value   = iuser.city.zipcode.map((a:any)=>(a.code))
        
        f_name.value    =   iuser.user.first_name
        l_name.value    =   iuser.user.last_name
        u_email.value   =   iuser.user.email
        u_phone.value   =   iuser.phone
        zipcode.value   =   iuser.zipcode.code
        city.value      =   { text: iuser.city.city, value: iuser.city.id }
        state.value     =   { text: iuser.state.state, value: iuser.state.id }
        country.value   =   { text: iuser.country.country, value: iuser.country.id }
        fullpageloader.value = false
    }
})();

const showcancel = ref(false)

async function updatepackage(pid:any,pkg_type:None) {
  fullpageloader.value = true
  const response = await axios.post('home/updatepackage', { 'pid': pid ,'pkg_type':pkg_type,'couplepackageSub':'couplepackageSub'}, config)
  console.log("response_________________", response.data)
  if (response.data.status == 'TOPAY') {
    window.location.href = response.data.s_url
   
  }
  else if (response.data.status == 'CANCELLED') {

    localStorage.setItem('cpackname','');
    localStorage.setItem('cpackactive', '');

    showSuccessMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showSuccessMessage.value = false; window.location.reload() }, 3000);
    fullpageloader.value = false
    showcancel.value = false
  } else {
    fullpageloader.value = false
    showErrorMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showErrorMessage.value = false; }, 3000);
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
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-row class="justify-center">
        <!--Account Settings tabs-->
        <v-col cols="12" md="12">
            <v-card elevation="10" class="bg-grey100" rounded="md">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8"> <v-card-title class="text-h4">Account Settings</v-card-title></v-col>
                    </v-row>
                    
                    <v-tabs v-model="tab" bg-color="transparent" min-height="60" height="60" color="secondary" class="d-flex justify-end mt-3">
                        <v-tab value="Account" class="text-medium-emphasis text-11 font-weight-medium" ><UserCircleIcon class="mr-2" size="20"/> Account</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="mt-3">
                        <v-window-item value="Account">
                            <v-row class="ma-sm-n2 ma-n1" >
                                <v-col cols="12" sm="6">
                                    <v-card elevation="10"  class="h-100">
                                        <v-card-item>
                                            <h5 class="text-h5 ">Change Profile</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">Change your profile picture from here</div>
                                            <div class="text-center mt-6 mb-6 d-flex align-center justify-center">
                                                <div class="position-relative">
                                                    <v-avatar size="120" >
                                                        <img ref="imagePreview" :src="upic" height="120" alt="image" />
                                                    </v-avatar>
                                                    <label for="imageInput" class="labelStImgPro2 d-flex align-center justify-center">
                                                        <p variant="flat" icon size="small" color="grey200">
                                                            <v-tooltip activator="parent" location="top">Edit Logo</v-tooltip>
                                                            <PencilIcon stroke-width="2" size="16" class="text-white" />
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-center">
                                                <input type="file" id="imageInput"  accept="image/*" class="d-none" @change="handleImageUpload" />
                                                <v-btn color="error" class="mx-2" variant="outlined" flat @click="resetImagePreview" size="small">Reset</v-btn>
                                            </div>

                                            <div v-if="packname" class="d-flex justify-center mb-5 bg-lightsecondary mt-4" style=" border-radius: 10px;border: 1px solid #b4801c87 !important;">
                                                <div elevation="10" class="h-100">
                                                    <v-card-item class="pb-2">
                                                        <label class="d-flex align-center justify-center">
                                                        Your Selected Subscription
                                                        </label>
                                                        <div class="text-center">
                                                        <p class="text-theme mr-3" style="color: rgb(180, 128, 28);
                                                             font-weight: 600;" >{{packname}}.</p>

                                                        <v-btn color="error" variant="flat" class="py-1 mt-3 rounded-sm textPrimary" size="small" @click="showcancel=!showcancel">Cancel Subscription</v-btn>
                                                        </div>
                                                    </v-card-item>

                                                       
                                            <v-col cols="2" lg="" class="mb-md-0 mb-10" v-if="packname">
                                                    <v-dialog v-model="showcancel" class="dialog-mw on-top" max-width="500">
                                                        <v-card class="postion-relative overflow-hidden" elevation="10">
                                                        <v-card-item class="">
                                                            <div class="d-flex justify-space-between  border-bottom border-danger">
                                                            <h4 class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">Cancel package subscription</h4>
                                                            <v-btn icon color="" @click="showcancel = false" flat variant="outlined" size="x-small"
                                                                class="bg-error">
                                                                <XIcon width="20" />
                                                            </v-btn>
                                                            </div>
                                                            <p class="text-subtitle-1 font-weight-medium py-5">Are you sure you want to cancel your subscription? You will lose your access to our services. </p>
                                                            <div class="d-flex justify-end pb-5">
                                                            <v-btn color="error" class="rounded-sm" @click="updatepackage('cancelit','pkg_type')">Yes, I'm sure</v-btn>
                                                            <v-btn color="primary" class="rounded-sm mx-3" @click="showcancel = false">No, take me back</v-btn>
                                                            </div>
                                                        </v-card-item>
                                                        </v-card>
                                                    </v-dialog>
                                            </v-col>
                                                </div >
                                            </div>

                                        </v-card-item>
                                    </v-card>
                                </v-col>                              
                                <v-col cols="12" sm="6"><!--universal password update section-->
                                    <v-card elevation="10" class="h-100">
                                        <v-card-item>
                                            <h5 class="text-h5 ">Change Password</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">To change your password please confirm here</div>
                                            <div class="mt-5">
                                                <v-label class="mb-2 font-weight-medium ">Current Password<span class="text-error ma-1">*</span></v-label>
                                                <v-text-field
                                                    color=""
                                                    class="mb-4"
                                                    variant="outlined"
                                                    :type="show2 ? 'text' : 'password'"
                                                    hide-details
                                                    :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show2 = !show2"
                                                    v-model="currentpwd"
                                                    :rules="reqrules"
                                                />
                                                <v-label class="mb-2 font-weight-medium ">New Password<span class="text-error ma-1">*</span></v-label>
                                                <v-text-field
                                                    color=""
                                                    class="mb-4"
                                                    variant="outlined"
                                                    :type="show3 ? 'text' : 'password'"
                                                    hide-details
                                                    :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show3 = !show3"
                                                    v-model="newpwd"
                                                    :rules="reqrules"
                                                />
                                                <v-label class="mb-2 font-weight-medium ">Confirm Password<span class="text-error ma-1">*</span></v-label>
                                                <v-text-field
                                                    color=""
                                                    class="mb-4"
                                                    variant="outlined"
                                                    :type="show4 ? 'text' : 'password'"
                                                    hide-details
                                                    :append-inner-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show4 = !show4"
                                                    v-model="confirmpwd"
                                                    :rules="matchrules"
                                                />
                                            </div>
                                            <v-btn color="secondary" class="mr-4" flat @click="changep()">Update password</v-btn>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                                <v-col cols="12"><!--couple profile update section-->
                                    <v-card elevation="10">
                                        <v-card-item>
                                            <h5 class="text-h5">Personal Details</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">To change your personal detail , edit and save from here</div>
                                            <div class="mt-5">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">First Name<span class="text-error ma-1">*</span></v-label>

                                                            <VTextField v-model="f_name" hide-details="auto" class="mb-3" :rules='reqrules' required type="text" maxlength="30" placeholder="Enter First Name"></VTextField>
                                                            
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Last Name<span class="text-error ma-1">*</span></v-label>
                                                            <VTextField v-model="l_name" hide-details="auto" class="mb-3" :rules='reqrules' required type="text" maxlength="30" placeholder="Enter Last Name"></VTextField>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                            <div>
                                                                <v-row class="align-center justify-space-between">
                                                                <v-col cols="9"> <v-label
                                                                    class="text-subtitle-1 font-weight-medium pb-2">Email<span class="text-error ma-1">*</span></v-label></v-col>
                                                                </v-row>
                                                                <VTextField v-model="u_email" type="email" maxlength="100"  hide-details="auto" class="mb-3" :rules='reqrulese' required placeholder="Enter Email" @keyup="checklength()">
                                                                </VTextField>
                                                            </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number<span class="text-error ma-1">*</span></v-label>
                                                            <v-row class="mt-0">
                                                                <!-- <v-col cols="5" class="pt-0">
                                                                <v-select v-model="ccode" :items="countrynameIssuanceOpt" item-title="state" item-value="abbr"
                                                                    label="Select" return-object single-line variant="outlined"></v-select>
                                                                </v-col> -->
                                                                <v-col cols="12" class="pt-0 ps-0">
                                                                <VTextField type="text" maxlength="10" v-model="u_phone" hide-details="auto" class="mb-3" :rules='phonenoRules' required placeholder="Enter Phone" @keyup="checklength()"></VTextField>
                                                                </v-col>
                                                            </v-row>
                                                            </v-col>
                                                        </v-row>
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                            <div class="">
                                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                                <v-select v-model="country" :items="countryitem" item-title="text" item-value="value"
                                                                label="Select Country" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                                                                @update:modelValue="getstate()"></v-select>
                                                            </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                            <div class="">
                                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">State<span class="text-error ma-1">*</span></v-label>

                                                                <v-select v-model="state" :items="stateitem" item-title="text" item-value="value"
                                                                label="Select State" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                                                                @update:modelValue="getcity()">
                                                                </v-select>
                                                            </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">City<span class="text-error ma-1">*</span></v-label>
                                                                    <v-select v-model="city" :items="cityitem" item-title="text" item-value="value"
                                                                    label="Select City" single-line variant="outlined" hide-details return-object :rules='reqrules' required @update:modelValue="setzipcode()">
                                                                    </v-select>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6" class="pb-0" v-if="showsearch">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Search zipcode</v-label><span @click="showsearch = !showsearch" class="text-error ma-1"><CircleXIcon width="18" class="v-icon--start" /></span>
                                                                    <VTextField v-model="izipcode" required placeholder="Enter zipcode to search" hide-details @keyup="fetch_add()" maxlength="5"></VTextField>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6" class="pb-0" v-else>
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Zipcode<span
                                                                            class="text-error ma-1">*</span></v-label><span @click="showsearch = !showsearch" class="text-error ma-1"><SearchIcon width="18"/></span>
                                                                    <!-- <VTextField v-model="zipcode" type="number" hide-details="auto" class="mb-3" required
                                                                        placeholder="Must be 5 digits" 
                                                                        @input=fetch_add()
                                                                        ></VTextField> -->
                                                                    <v-select v-model="zipcode" :items="zipcodeitem" label="Select Zipcode" single-line variant="outlined" hide-details required :rules="reqrules">
                                                                    </v-select>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-end mt-5">
                                <v-btn size="large" color="secondary" class="mr-4" flat @click="changebd()">Save</v-btn>
                                <v-btn size="large" class="bg-error" flat to="/customer-dashboard">Cancel</v-btn>
                            </div>
                        </v-window-item>
                    </v-window>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-selection-control .v-label{
    color:#002642;
}
label.v-label.v-field-label {
    color: #002642;
}
.labelStImgPro2 {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  width: 30px;
  height: 30px;
  background: #b4801c;
  border-radius: 50%;
}
</style>