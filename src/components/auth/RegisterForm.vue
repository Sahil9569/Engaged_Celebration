<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import 'v-calendar/dist/style.css';
import { useAuthStore } from '@/stores/auth';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
const authStore = useAuthStore();
import { useRoute } from 'vue-router'
const route: any = useRoute()
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { router } from '@/router';
import { FormWizard, TabContent } from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'
import imagePath from '@/assets/images/wedding/dummyProfile.webp'
import dummyLogo from '@/assets/images/website/packageIcon.png'
import packageIcon from '@/assets/images/website/packageIcon.png'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { SearchIcon, CircleXIcon } from 'vue-tabler-icons';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
const clickFunModal = (pack: any) => { pack.dialog = true }
const otpInput = ref(null);
const usertype = ref('vendor');
const extraPackage = ref('');

const free_trial = ref("");
const newfree_trial = ref("");
onMounted(() => {

    if (route.query.free_trial) {
        
        free_trial.value=route.query.free_trial
        newfree_trial.value=route.query.free_trial

        
        console.log(free_trial.value,"free_trial.value.................")
        
    }

    if (route.query.as) {usertype.value = route.query.as; i.value = (route.query.as == 'vendor') ? 0 : 1 }
    else { usertype.value = "customer"; i.value = 1 }
    (async function () {

        const response = await axios.get('home/signup')
        if (response.data.status == 'SENT') {
            console.log("init response_________________", response.data)
            countryitem.value = response.data.countries
            catItems.value = response.data.cats.map((a: any) => (a.name))
            allstateItems.value = response.data.allstates

            console.log('check the price of one year data ---',response.data.packs.yearly_price)
            packages.value = response.data.packs.map((a: any) => ({ 
                id: a.id,
                free_trial:a.free_trial ,
                lifetime_membership:a.lifetime_membership,
                yearly_price:a.yearly_price,
                description: a.description,
                package_logo: BASE_URL + a.package_logo,
                subscrption_toggle: a.subscrption_toggle,
                onetime_toggle: a.onetime_toggle,
                name: a.name,
                yearly_toggle:a.yearly_toggle,
                lifetime_pack_status:a.lifetime_pack_status,
                show_hide:a.show_hide,
                wallet_toggle:a.wallet_toggle,




                one_time_price: String(parseFloat(a.one_time_price)),
                price: String(parseFloat(a.price)),
                lifetime_price:String(parseFloat(a.lifetime_price)

                )}))
            if (route.query.pid) { package_select(true, route.query.pid) }

            const relevantPack = response.data.packs.find(pack => pack.show_hide === true && pack.lifetime_pack_status === true);
            extraPackage.value = !!relevantPack;
        }
    })();   
});


// const password2 = ref('');
// const passwordRules = ref([(v: string) => !!v || 'Password is required']);
// const passwordRules2 = ref([ (v: string) => !!v || 'Confirm Password is required',  (v: string) => v === password1.value || 'Passwords do not match' ]);
// const password1 = ref('');
// const handleOnComplete = (value: string) => { u_otp.value = value; };
// const handleOnChange = (value: string) => {  console.log('OTP changed: ', value); };
// const clearInput = () => { otpInput.value?.clearInput(); i.value = 2; };
const countrynameIssuanceOpt = ['+1-USA',
    // '+93-AFG', '+355-ALB', '+213-DZA', '+376-AND', '+244-AGO', '+1-ATG', '+54-ARG', '+374-ARM', '+297-AABW', '+61-AUS', '+43-AUT', '+994-AZE', '+1-BHS', '+973-BHR', '+880-BGD', '+1-BRB', '+375-BLR', '+32-BEL', '+501-BLZ', '+229-BEN', '+975-BTN', '+591-BOL', '+387-BIH', '+267-BWA', '+55-BRA', '+673-BRN', '+359-BGR', '+226-BFA', '+257-BDI', '+855-KHM', '+237-CMR', '+1-CAN', '+238-CPV', '+236-CAF', '+235-TCD', '+56-CHL', '+86-CHN', '+57-COL', '+269-COM', '+242-COG', '+682-COK', '+506-CRI', '+225-CIV', '+385-HRV', '+53-CUB', '+357-CYP', '+420-CZE', '+45-DNK', '+253-DJI', '+1-DMA', '+1-DOM', '+593-ECU', '+20-EGY', '+503-SLV', '+240-GNQ', '+291-ERI', '+372-EST', '+251-ETH', '+500-FLK', '+298-FRO', '+679-FJI', '+358-FIN', '+33-FRA', '+689-PYF', '+241-GAB', '+220-GMB', '+995-GEO', '+49-DEU', '+233-GHA', '+350-GIB', '+30-GRC', '+299-GRL', '+1-GRD', '+502-GTM', '+224-GIN', '+245-GNB', '+592-GUY', '+509-HTI', '+504-HND', '+852-HKG', '+36-HUN', '+354-ISL', '+91-IND', '+62-IDN', '+98-IRN', '+964-IRQ', '+353-IRL', '+44-IMN', '+972-ISR', '+39-ITA', '+1-JAM', '+81-JPN', '+962-JOR', '+7-KAZ', '+254-KEN', '+686-KIR', '+383-XKX', '+850-PRK', '+82-KOR', '+965-KWT', '+996-KGZ', '+856-LAO', '+371-LVA', '+961-LBN', '+266-LSO', '+231-LBR', '+218-LBY', '+423-LIE', '+370-LTU', '+352-LUX', '+853-MAC', '+389-MKD', '+261-MDG', '+265-MWI', '+60-MYS', '+960-MDV', '+223-MLI', '+356-MLT', '+692-MHL', '+222-MRT', '+230-MUS', '+262-REU', '+52-MEX', '+691-FSM', '+373-MDA', '+377-MCO', '+976-MNG', '+382-MNE', '+1-MSR', '+212-MAR', '+258-MOZ', '+95-MMR', '+264-NAM', '+674-NRU', '+977-NPL', '+31-NLD', '+599-NLD', '+687-NCL', '+64-NZL', '+505-NIC', '+227-NER', '+234-NGA', '+683-NIU', '+672-NFK', '+47-NOR', '+968-OMN', '+92-PAK', '+680-PLW', '+970-PSE', '+507-PAN', '+675-PNG', '+595-PRY', '+51-PER', '+63-PHL', '+48-POL', '+351-PRT', '+1-PRK', '+974-QAT', '+40-ROU', '+7-RUS', '+250-RWA', '+590-BLM', '+290-SHN', '+1-KNA', '+1-LCA', '+590-MFA', '+508-SPM', '+1-VCT', '+685-WSM', '+378-SMR', '+239-STP', '+966-SAU', '+221-SEN', '+381-SRB', '+248-SYC', '+232-SLE', '+65-SGP', '+599-SXM', '+421-SVK', '+386-SVN', '+677-SLB', '+252-SOM', '+27-ZAF', '+211-SSD', '+34-ESP', '+94-LKA', '+249-SDN', '+597-SUR', '+268-SWZ', '+46-SWE', '+41-CHE', '+963-SYR', '+886-TWN', '+992-TJK', '+255-TZA', '+66-THA', '+670-TLS', '+228-TGO', '+690-TKL', '+676-TON', '+868-TTO', '+216-TUN', '+90-TUR', '+993-TKM', '+688-TUV', '+256-UGA', '+380-UKR', '+971-ARE', '+44-GBR', '+1-USA', '+598-URY', '+998-UZB', '+678-VUT', '+39-VA', '+58-VEN', '+84-VNM', '+681-WLF', '+212-ESH', '+967-YEM', '+260-ZMB', '+263-ZWE'
];
const valid = ref(true);
const show2 = ref(false);
const show3 = ref(false);
const f_NameRules = ref([(v: string) => !!v || 'Please Enter Your First Name']);
const l_NameRules = ref([(v: string) => !!v || 'Please Enter Your Last Name']);
const reqrules = ref([(v: string) => !!v || 'This field is required']);
// const zipcodeRules = ref([(v: string) => {
//     if (!v) { return 'Please enter zipcode.'; }
//     else { return (v.length === 5) ? true : 'Must be 5 digits'; }
// }]);
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

const allValid = computed(() => {
    const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    const isValidfname = f_NameRules.value.every((rule) => rule(f_name.value) === true);
    const isValidlname = l_NameRules.value.every((rule) => rule(l_name.value) === true);

    return isValidEmail && isValidfname && isValidlname;
});

const totalSeconds = ref(10);
const minutes = ref('');
const seconds = ref('');
const showResend = ref(false);
const formatTime = (value: any) => { return value < 10 ? `0${value}` : value; };
const updateTime = () => {
    let mins = Math.floor(totalSeconds.value / 60);
    let secs = totalSeconds.value % 60;

    minutes.value = formatTime(mins);
    seconds.value = formatTime(secs);
};
// jufvghj
const countdown = () => {
    if (totalSeconds.value > 0) {
        totalSeconds.value--;
    } else {
        showResend.value = true;
        clearInterval(interval);
        // Optionally, you can perform any action when the countdown finishes here
    }
};
let interval;
watch(totalSeconds, () => { updateTime(); });

// start anchan code from here .....................................

// const user_id                       = ref('');
// const isc                           = ref('');
// const showMobile                    = ref(true);
// const editorvalue                   = ref('')
const fullpageloader = ref(false)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);






const paymentType = ref('subscription');
const f_name = ref();
const l_name = ref();
const u_email = ref();
const u_phone = ref();
const ccode = ref('');
const profile_img = ref();
const business_logo = ref();
const brandValue = ref('')
const cats = ref([]);
const catItems = ref(['Mumbai', 'Delhi',]);
const city = ref();
const state = ref();
const country = ref();
const zipcode = ref();
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const zipcodeitem = ref([])
const eventno = ref(0)
const businesslocation = ref('')
const allstateItems = ref([{ 'title': 'abc', 'value': 'cba' },]);
const statevalues = ref();
const izipcode = ref();
const showsearch = ref(false);

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

function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}








async function create_profile() {

    fullpageloader.value = true;


    if (newfree_trial.value){
        free_trial.value = newfree_trial.value

    }


    console.log(free_trial.value,"signup free_trial.value ..........")

    var formdata = new FormData();
    formdata.append('utype', usertype.value);
    formdata.append('pid', sel_package.value.id);
    formdata.append('free_trial', free_trial.value);
    formdata.append('pkg_paymentType', paymentType.value);
    formdata.append('first_name', f_name.value);
    formdata.append('last_name', l_name.value);
    formdata.append('email', u_email.value);
    formdata.append('phone', u_phone.value);
    // formdata.append('ccode', ccode.value);
    formdata.append('ppic', profile_img.value);
    formdata.append('bpic', business_logo.value);
    formdata.append('cats', cats.value);
    formdata.append('bname', brandValue.value);
    formdata.append('country', country.value['value']);
    formdata.append('state', state.value['value']);
    formdata.append('city', city.value['value']);
    formdata.append('zipcode', zipcode.value);
    formdata.append('bdesc', getEditorText());
    formdata.append('wedstates', statevalues.value);
    formdata.append('wedloc', businesslocation.value);
    formdata.append('eventno', eventno.value);


    try {
      
        const response = await axios.post(`/home/signup`, formdata, { headers: { 'Content-type': 'multipart/form-data' }, withCredentials: true });

        if (response.data.status === 'SAVED') {
            showSuccessMessage.value = true;
            myerrors.value = 'Your Profile created successfully.';
            
            authStore.user = JSON.stringify(response.data.cuser);
            try { localStorage.setItem('access_token', response.data.access_token); } catch { }
            localStorage.setItem('user', JSON.stringify(response.data.cuser));
            localStorage.setItem('role', response.data.role);
            
            setTimeout(() => { 
                showSuccessMessage.value = false; 
                if (localStorage.getItem('itodo_bid') && response.data.role == "customer") { router.push(`/booking-single/${localStorage.getItem('itodo_bid')}`); }
                else { return router.push(((localStorage.getItem('role') == "customer")) ? '/customer-dashboard' : '/onboard'); }
            }, 3000);

        } else if (response.data.venPackages === 'FreeTrial') {

            
            authStore.user = JSON.stringify(response.data.cuser);
            localStorage.setItem('user', JSON.stringify(response.data.cuser));
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('vpack', response.data.vpack);
            localStorage.setItem('vpackname', response.data.vpackname);
            localStorage.setItem('vpackactive', response.data.vpackactive);
            
            try{localStorage.setItem('access_token', response.data.access_token);}catch{}
            // to be removed after live

            console.log("verified_________________vendor-dashboard________________")
            showSuccessMessage.value = true;
            myerrors.value = 'Vendor profile created successfully and password has been sent to your mail.';
            setTimeout(() => {return router.push( ((localStorage.getItem('role') == "customer")) ? '/customer-dashboard' : '/vendor-dashboard' ); }, 4000);


        } else if (response.data.status === 'TOPAY') {
            return window.location.href = response.data.s_url
        } else if(response.data.status === 'wallet'){

            authStore.user = JSON.stringify(response.data.cuser);
            localStorage.setItem('user', JSON.stringify(response.data.cuser));
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('vpack', response.data.vpack);
            localStorage.setItem('vpackname', response.data.vpackname);
            localStorage.setItem('vpackactive', response.data.vpackactive);
            // new add for Wellet pack detail
            localStorage.setItem('well_pack', response.data.well_pack); 
            
            try{localStorage.setItem('access_token', response.data.access_token);}catch{}
            // to be removed after live

            console.log("verified_________________vendor-dashboard________________")
            showSuccessMessage.value = true;
            myerrors.value = 'Vendor profile created successfully and password has been sent to your mail.';
            setTimeout(() => {
                console.log("Navigating to vendor dashboard...");
                return router.push( ((localStorage.getItem('role') == "customer")) ? '/customer-dashboard' : '/profile-settings/' ); }, 4000)
            
        } else if (response.data.status === 'SAMEUSER') {
            showErrorMessage.value = true;
            myerrors.value = 'User with this Email already exists. To get new password try forgot password.';
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
            fullpageloader.value = false;
        } else {
            showErrorMessage.value = true;
            myerrors.value = 'Something went wrong. Please try again';
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
            fullpageloader.value = false;
        }
    } catch (error) { console.error('Error:', error); }
    finally {console.log("fgt") }
}






// const updated_at = ref(false);
// const created_at = ref(false);
// const request_status = ref('resend_otp');
// const edit_user = ref('edit_user');
// const u_otp = ref();





const i = ref(999);
const packages = ref([]);
const sel_package = ref({ id: 1, name: "", price: "",one_time_price:"55",lifetime_membership:'',yearly_toggle
:'',lifetime_price:'',yearly_price:'', package_logo: '', description: "" ,subscrption_toggle:'',onetime_toggle:'',lifetime_pack_status:'' , wallet_toggle: ''});



// function package_select(increment = true, pid = null, trial = null) {
//     if (increment) {
//         let sel = packages.value.find((a: any) => a.id === parseInt(pid));
//         if (sel) {
//             console.log(sel, '----hello----');
//             console.log(sel.subscrption_toggle, 'hello1111');

//             if (sel.subscrption_toggle) {
//                 console.log(sel.subscrption_toggle, 'hello222222');
//                 paymentType.value = 'subscription';
//             } else {
//                 if (sel.yearly_toggle) {
//                     paymentType.value = 'one_time_payment_yearly';
//                 } else if (sel.onetime_toggle) {
//                     paymentType.value = 'one_time_payment';
//                 } else if (sel.lifetime_membership) {
//                     paymentType.value = 'lifetime_membership';
//                 }
//             }
//         }
//         sel_package.value = sel;
//         i.value = 1;
//         free_trial.value = trial;
//     } else {
//         i.value = 0;
//     }
// }

function package_select(increment = true, pid = null, trial = null) {
    if (increment) {
        let sel = packages.value.find((a) => a.id === parseInt(pid));
        if (sel) {
            console.log(sel, '----hello----');
            console.log(sel.subscrption_toggle, 'hello1111');

            if (trial === 'FreeSubscription') {
                sel.wallet_toggle = false; // Ensure wallet feature is disabled for Free Trial
            }

            if (sel.subscrption_toggle) {
                console.log(sel.subscrption_toggle, 'hello222222');
                paymentType.value = 'subscription';
            } else if (sel.yearly_toggle) {
                paymentType.value = 'one_time_payment_yearly';
            } else if (sel.onetime_toggle) {
                paymentType.value = 'one_time_payment';
            } else if (sel.lifetime_membership) {
                paymentType.value = 'lifetime_membership';
            } else if (sel.wallet_toggle) {
                paymentType.value = 'wallet_type';
            }
            else {
                // All toggles are false
                paymentType.value = null;
            }
        } else {
            // No package found
            sel_package.value = null;
            paymentType.value = null;
        }

        sel_package.value = sel;
        i.value = 1;
        free_trial.value = trial;
    } else {
        i.value = 0;
        sel_package.value = null; // Reset package on decrement
        paymentType.value = null; // Reset payment type on decrement
    }
}






const profile = ref({ profileImage: imagePath, logo: dummyLogo })
const handleImageUpload = (event: InputEvent, type: string) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'profile_pic') {
                profile_img.value = input.files[0]; // Assuming profile_img is a ref
                profile.value.profileImage = reader.result as string;

            } else if (type === 'business_logo') {
                business_logo.value = input.files[0]; // Assuming business_logo is a ref
                profile.value.logo = reader.result as string;
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};
const editor = useEditor({
    editorProps: { attributes: { class: 'custom-tiptap-style', } },
    extensions: [StarterKit],
    content: ``
});

// const v$ = useVuelidate();'
// const isValidfname = v$.$model.f_name.$error === false;
// const isValidlname = v$.$model.l_name.$error === false;
// const isValidEmail = v$.$model.u_email.$error === false;
// console.log('ivalid____________', v$)
function fill_req_error(rslt = true) {
    if (!(rslt)) {
        showErrorMessage.value = true;
        myerrors.value = 'Please fill all required fields!';
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
    }
    return rslt
}
function fill_req_check(rslt = true) {
    if (!(rslt)) {
        showErrorMessage.value = true;
        myerrors.value = 'Please check the box to accept our Privacy Policy.';
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
    }
    return rslt
}

function ivalidate_1() {
    const isValidfname = f_NameRules.value.every((rule) => rule(f_name.value) === true);
    const isValidlname = l_NameRules.value.every((rule) => rule(l_name.value) === true);
    const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    const isValidphone = phonenoRules.value.every((rule) => rule(u_phone.value) === true);
    // const isCheckboxChecked = agree === true;
    // return fill_req_error((isValidfname && isValidlname && isValidEmail && isValidphone ) ? true : false)
    // return fill_req_check((isCheckboxChecked) ? true : false)


    const isAllFieldsValid = fill_req_error(isValidfname && isValidlname && isValidEmail && isValidphone);
    const isCheckboxValid = fill_req_check(agree.value);

    return isAllFieldsValid && isCheckboxValid;

}
function ivalidate_2() {
    // const isValidCode = zipcodeRules.value.every((rule) => rule(zipcode.value) === true);
    // let a = profile_img.value && country.value && state.value && city.value 
    // let a = country.value && state.value && city.value 
    // && isValidCode

    let a;
    if (usertype.value === 'vendor') {
        a = profile_img.value && country.value && state.value && city.value;
    } else {
        a = country.value && state.value && city.value;
    }
    return fill_req_error(((usertype.value == 'vendor')) ? ((brandValue.value && cats.value.length && business_logo.value && a) ? true : false) : ((a) ? true : false))
}
function ivalidate_3() {
    // businesslocation.value && eventno.value
    return fill_req_error((getEditorText(false) && statevalues.value) ? true : false)
}
const goBack = () => { window.history.back(); };



const selectMonthType = ref('1');

// New add for packages slider
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
import type { Settings } from 'v-slick-carousel'


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


// onMounted(() => {
//   const queryParams = new URLSearchParams(window.location.search);
//   const freeTrial = queryParams.get('freeTrial');

//   if (freeTrial) {
//     alert('Free Trial mode activated!');
//     free_trial.value='freeTrial';
//     alert(free_trial.value) 
//   }
//     // free_trial == 'freeTrial'
//  });


const agree = ref(false);
</script>
<template>


    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="inset-block-start: 30px">
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
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <v-form v-if="i == 0 && usertype == 'vendor'">
        <v-row justify="center" class="mt-3">
            <v-col cols="12" class="mb-12 text-center pa-0">
                <h3>Select Your Package </h3>
            </v-col>



            
            <v-col cols="12">
                <v-row class="packageDesign ">
                    <v-col v-for="pack in packages" :key="pack.id" cols="12" :md="extraPackage ? 3 : 4" :class="extraPackage ? 'mb-md-0 mb-10 cardPrice extrapackageStyle' : 'mb-md-0 mb-10 cardPrice'"
                        class="mb-md-0 mb-10 cardPrice">
                        <div  v-if="pack.show_hide" >
                            <v-card class="pricing-card pricing-card-new bg-lightprimary border border-primary" elevation="0">
                                <div class="wpo-pricing-item">
                                    <div class="wpo-pricing-top signUp  rounded">
                                        <div class="wpo-pricing-img signUp">
                                            <img :src="packageIcon" alt="" class="w-100">
                                        </div>
                                        <div class="">
                                            <h4
                                                class="text-subtitle-3 font-weight-semibold textSecondary mt-3 text-start forCenter">
                                                {{ pack.name }}
                                            </h4>
                                            <!-- <h2
                                                class="custom-size-font text-no-wrap  font-weight-semibold textSecondary text-start forCenter">
                                                ${{ pack.price }}
                                            </h2> -->
                                            <!-- ${{ pack.yearly_price }} -->
                                            <div class="my-3">                                         
                                                <div class="carousel">
                                                    <VSlickCarousel v-bind="settingsss">
                                                    <h2 v-if="pack.onetime_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                                                    </h2>
                                                    <h2 v-if="pack.subscrption_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                                                    </h2>
                                                    <h2 v-if="pack.yearly_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.yearly_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Annual Subscription price</span>
                                                    </h2>
                                                    <!-- <h2 v-if="pack.lifetime_membership == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Yearly Membership                                                        : ${{ pack.lifetime_price }} </span>
                                                    </h2> -->
                                                    <h2 v-if="pack.lifetime_membership == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Membership                                                        : ${{ pack.lifetime_price }} </span>
                                                    </h2>

                                                    </VSlickCarousel>
                                                </div>                   
                                            </div>
                                                
                                                
                                            <!-- <span class="text-10">/Monthly</span> -->
                                                
                                                <!-- <p class="text-body-2 text-dark font-weight-semibold RecuText ">Automatically charged ${{ pack.price }} /month.</p> -->
                                            <div class="py-4 d-flex gap-2">
                                                <v-btn color="primary" size="small" variant="flat" class="d-block  rounded-sm btnNormal"
                                                   @click="package_select(true, pack.id)">
                                                    Buy Now
                                                </v-btn>
                                              
                                                <!-- <v-btn v-if="pack.free_trial" color="primary" variant="flat" class="d-block  rounded-sm btnNormal"
                                                   @click="package_select(true, pack.id,'freeTrial')">
                                                   Try Free Trial
                                                </v-btn> -->

                                                <v-btn v-if="pack.free_trial" size="small" color="primary" variant="flat" class="d-block  rounded-sm btnNormal"
                                                   @click="package_select(true, pack.id,'FreeSubscription')">
                                                   Try Free Trial
                                                </v-btn>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div
                                        class="border-bottom px-5 py-3 pack-des font-weight-medium text-start forCenter">
                                        <div v-html="pack.description" class="styleforEditorcode"></div>
                                    </div>
                                    
                                </div>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- @click="package_select(false)" -->
        <v-btn class="rounded-sm text-white" color="grey200" @click="goBack()" flat ><ChevronLeftIcon size="13" class="me-1" />Back </v-btn>


      


    </v-form>
    <div class="" v-if="i == 1">
        <form-wizard class="custom-wizard" @on-complete="create_profile()">
            <!-- :before-change="ivalidate(1)" -->
            <tab-content title="" :before-change="ivalidate_1">
                <v-form ref="form" v-model="valid" lazy-validation action="/pages/boxedlogin" class="mt-5">
                    <div class="mb-3">
                        <v-row class="justify-start mb-3" v-if="usertype == 'vendor'">
                            <v-col cols="12">
                                <v-card elevation="10" rounded="md" class="bg-lightsecondary">
                                    <v-card-item class="py-2 ">
                                        <div class="d-flex align-center justify-space-between">
                                            <div class="d-flex align-center">
                                                <span
                                                    class="checkPackage bg-primary d-flex align-center justify-center me-4">
                                                    <ChecksIcon stroke-width="2" size="17" class="" />
                                                </span>
                                                <div class="position-relative py-2">
                                                    <v-avatar size="60" rounded="md" variant="flat"
                                                        class="packselectimg bg-dark">
                                                        <img :src="packageIcon" alt="" class="w-100">
                                                    </v-avatar>
                                                </div>

                                                <div class="pl-4 mt-n1">
                                                    <h5
                                                        class="text-subtitle-4 font-weight-semibold text-no-wrap textSecondary">
                                                        {{ sel_package.name }}
                                                       
                                                        <v-chip color="" v-if="free_trial == 'freeTrial' || free_trial == 'FreeSubscription' || newfree_trial == 'FreeSubscription'" size="x-small" class="bg-primary font-weight-semibold text-darkIn"> Free Trial  </v-chip>
                                                    </h5>

                                                    <h3 class="font-weight-semibold text-no-wrap mt-1 textSecondary">
                                                        <span v-if="sel_package && paymentType === 'subscription'">
                                                            ${{ sel_package.price }}
                                                        </span>
                                                        <span v-else-if="sel_package && paymentType === 'lifetime_membership'">
                                                            ${{ sel_package.lifetime_price }}
                                                        </span>
                                                        <span v-else-if="sel_package && paymentType === 'one_time_payment_yearly'">
                                                            ${{ sel_package.yearly_price }}
                                                        </span>
                                                        <span v-else-if="sel_package && paymentType === 'one_time_payment'">
                                                            ${{ sel_package.one_time_price }}
                                                        </span>
                                                        <span v-else-if="sel_package && paymentType === 
                                                        'wallet_type'">
                                                            
                                                        </span>
                                                        <span v-else>
                                                            Currently, we do not have any packages available.
                                                        </span>
                                                    </h3>

                                                    
                                                    <!-- <h3
                                                        class=" font-weight-semibold text-no-wrap mt-1 textSecondary">
                                                        
                                                        <span v-if="paymentType == 'subscription'">
                                                            ${{ sel_package.price }}
                                                        </span>
                                                        <span v-else-if="paymentType == 'lifetime_membership'">
                                                            ${{ sel_package.lifetime_price }}
                                                        </span>
                                                        <span v-else-if="paymentType == 'one_time_payment_yearly'">
                                                            ${{ sel_package.yearly_price }}
                                                        </span>
                                                        <span v-else>
                                                            ${{ sel_package.one_time_price }}
                                                        </span>
                                                        

                                                    </h3> -->


                                                    
                                                </div>

                                            </div>

                                            <div>
                                                <v-btn color="secondary" flat v-bind="props" size="small"
                                                    @click="package_select(false)">
                                                    <PencilIcon stroke-width="2" size="18" class="" />
                                                    Change Package
                                                </v-btn>
                                            </div>

                                        </div>

                                    </v-card-item>
                                </v-card>
                            </v-col>
                        </v-row>


                        <!-- <template v-if="free_trial === 'freeTrial' || free_trial == 'FreeSubscription' || newfree_trial === 'FreeSubscription'"> -->
                            <!-- <p>Free Trial is active</p> -->                      
                             <!-- <p><strong>value of Free trial is :</strong> {{ free_trial }} </p> -->

                        <!-- </template> -->

                        <!-- <template v-else> -->

                           

                            <v-radio-group  v-if="i != 1 || usertype == 'vendor'" v-model="paymentType" inline class="mb-4">
                            
                                <v-row v-if="sel_package.lifetime_pack_status">
                                    <!-- <template v-if="sel_package.lifetime_membership === true">
                                        <v-col cols="12"  md="4">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                One-Time Payment</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed payment with no recurring charges. Ideal for those who prefer a one-time cost.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <template v-else>
                                        <v-col cols="12"  md="6">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                One-Time Payment</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed payment with no recurring charges. Ideal for those who prefer a one-time cost.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <template v-if="sel_package.lifetime_membership === true">
                                        <v-col cols="12" md="4">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelOne" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelOne" color="primary" value="subscription"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Monthly Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">This option will deduct a monthly fee from your account. Ideal for those who prefer a regular, ongoing payment plan.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <template v-else >
                                        <v-col cols="12" md="6">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelOne" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelOne" color="primary" value="subscription"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Monthly Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">This option will deduct a monthly fee from your account. Ideal for those who prefer a regular, ongoing payment plan.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template> -->
                                    <template v-if="sel_package.lifetime_membership === true">
                                        <v-col cols="12" md="12">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    <label for="labeThree" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labeThree" color="primary" value="lifetime_membership"></v-radio>
                                                        <div class="mt-2">
                                                            <!-- <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Lifetime Yearly Membership </h2>
                                                            <p class="text-body-2 font-weight-medium">This option grants you unlimited access with a single, upfront payment. Perfect for those who prefer long-term benefits without recurring fees.</p> -->
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Lifetime Membership </h2>
                                                            <p class="text-body-2 font-weight-medium">This option provides unlimited access with a one-time, upfront payment—no recurring charges.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                </v-row>
                                    <!-- start new code----- -->

                                <v-row v-else>
                                    <template v-if="sel_package.onetime_toggle === true">
                                        <v-col cols="12"  md="4">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                One-Time Payment</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed payment with no recurring charges. Ideal for those who prefer a one-time cost for one month.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <!-- <template v-else>
                                        <v-col cols="12"  md="6">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                One-Time Payment</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed payment with no recurring charges. Ideal for those who prefer a one-time cost for month.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template> -->

                                     
                                    <template v-if="sel_package.yearly_toggle === true">
                                        <v-col cols="12"  md="4">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment_yearly"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">Annual Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed annual payment with no recurring monthly charges. Perfect for those who prefer the convenience of a yearly subscription</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <!-- <template v-else>
                                        <v-col v-if="sel_package.yearly_toggle" cols="12"  md="6">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelTwo" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelTwo" color="primary" value="one_time_payment_yearly"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Annual Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">Make a single, fixed annual payment with no recurring monthly charges. Perfect for those who prefer the convenience of a yearly subscription</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template> -->
                                   
                                   
                                   
                                   
                                    <template v-if="sel_package.subscrption_toggle === true">
                                        <v-col cols="12" md="4">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelOne" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelOne" color="primary" value="subscription"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Monthly Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">This option will deduct a monthly payment from your account, making it ideal for those who prefer a regular, ongoing payment plan.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <!-- <template v-else >
                                        <v-col cols="12" md="6">
                                            <v-card  elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    
                                                    <label for="labelOne" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labelOne" color="primary" value="subscription"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Monthly Subscription</h2>
                                                            <p class="text-body-2 font-weight-medium">This option will deduct a monthly payment from your account, making it ideal for those who prefer a regular, ongoing payment plan.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template> -->
                                    <template v-if="sel_package.lifetime_membership === true">
                                        <v-col cols="12" md="4">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    <label for="labeThree" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labeThree" color="primary" value="lifetime_membership"></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Lifetime Yearly Membership </h2>
                                                            <p class="text-body-2 font-weight-medium">This option grants you unlimited access with a single, upfront payment. Perfect for those who prefer long-term benefits without recurring fees.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>

                                 


                                    <template v-if="sel_package.wallet_toggle === true && newfree_trial != 'FreeSubscription'">
                                        <v-col cols="12" md="4">
                                            <v-card elevation="10" class="border border bg-grey200 position-relative h-100">
                                                <v-card-item class="pa-2 py-4"> 
                                                    <label for="labeThree" class="custom-label d-flex align-start">
                                                        <v-radio class="radioClick" id="labeThree" color="primary" value="wallet_type" ></v-radio>
                                                        <div class="mt-2">
                                                            <h2 class="text-h6 font-weight-semibold mb-1">
                                                                Wallet Feature</h2>
                                                            <p class="text-body-2 font-weight-medium">With the Wallet feature, you can sign up for free, add credits to your wallet, and unlock package bookings.</p>
                                                        </div>
                                                    </label>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </template>
                                </v-row>




                            </v-radio-group>
                        <!-- </template> -->

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">First Name<span
                                        class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                                <VTextField v-model="f_name" :rules="f_NameRules" hide-details="auto"
                                    class="mb-3 is-invalid" required placeholder="Enter First Name" type="text" maxlength="30"></VTextField>
                                <!-- :class="{'is-invalid': v$.form.personal1.branchName.$error} -->
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Last Name <span
                                        class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                                <VTextField v-model="l_name" :rules="l_NameRules" hide-details="auto" class="mb-3"
                                    required placeholder="Enter Last Name" type="text" maxlength="30"></VTextField>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div>
                                    <v-row class="align-center justify-space-between">
                                        <v-col cols="9"> <v-label class="text-subtitle-1 font-weight-medium pb-2">Email
                                                <span class="text-error ma-1"><sup>*Requried</sup></span></v-label></v-col>
                                    </v-row>
                                    <VTextField v-model="u_email" type="email" maxlength="100" :rules="emailRules" hide-details="auto" class="mb-3" required placeholder="Enter Email" @keyup="checklength()"></VTextField>
                                </div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number <span
                                        class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                                <!--<v-col cols="4" class="pt-0">
                                        <v-select
                                            v-model="ccode"
                                            :items="countrynameIssuanceOpt"
                                            item-title="state"
                                            item-value="abbr"
                                            label="Select"
                                            return-object
                                            single-line
                                            variant="outlined"
                                        ></v-select>
                                    </v-col>-->
                                <v-col cols="12" class="pt-0 ps-0">
                                    <VTextField v-model="u_phone" hide-details="auto" :rules="phonenoRules" class="mb-3"
                                        required placeholder="Enter Phone" type="text" maxlength="10" @keyup="checklength()"></VTextField>
                                            <div class="d-flex gap-4 align-items-start">
                                                <v-checkbox
                                                v-model="agree"
                                                color="primary"
                                                id="agreeCheckbox"
                                                />
                                                <label for="agreeCheckbox" class="text-body-2 ">
                                                    By checking this box, you agree to receive text messages from Engaged Celebration. You can reply "stop" to opt-out at any time. This is our 
                                                    <router-link to="/privacy-policy" class="privacy-link">Privacy Policy</router-link>.
                                                </label>
                                            </div>
                                </v-col>
                            </v-col>
                        </v-row>
                    </div>
                    <v-btn class="mt-2 rounded-sm btncustomback" color="primary" v-bind="props" @click="package_select(false)" v-if="i != 1 || usertype == 'vendor'">Back</v-btn>
                    <v-btn class="rounded-sm text-white  btncustomback" color="primary" @click="goBack()" flat v-else>Back</v-btn>                    
                </v-form>
            </tab-content>
            <tab-content title="" :before-change="ivalidate_2">
                <div class=" rounded pb-6 pt-0">
                    <v-row class="justify-center">
                        <v-col cols="12" md="6" class="pb-0" v-if="usertype == 'customer'">
                            <div class="text-center bg-lightprimary pa-5 rounded">
                                <!-- <h3 class="text-h6 text-primary pb-4">Your Profile Image<span
                                        class="text-error ma-1"><sup>*Requried</sup></span></h3> -->
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
                        <v-col cols="12" md="6" class="pb-0" v-else>
                            <div class="text-center bg-lightprimary pa-5 rounded">
                                <h3 class="text-h6 text-primary pb-4">Your Profile Image<span
                                        class="text-error ma-1"><sup>*Requried</sup></span></h3>
                                
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
                        <v-col cols="12" md="6" class="pb-0" v-if="usertype == 'vendor'">
                            <div class="text-center bg-lightprimary pa-5 rounded">
                                <h3 class="text-h6 text-primary pb-4">Your Business Logo<span
                                        class="text-error ma-1"><sup>*Requried</sup></span></h3>
                                <div class="imageGroupMain businessGroup">
                                    <label for="businessLogoInput" class="labelStImgPro ">
                                        <input type="file" id="businessLogoInput" class="d-none"
                                            @change="handleImageUpload($event, 'business_logo')" accept="image/*"
                                            :rules="reqrules">
                                        <p class="floatPlus">+</p>
                                    </label>
                                    <div class="imageSizeMain">
                                        <img :src="profile.logo" alt="Uploaded Image" style="max-inline-size: 300px;">
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <v-row class="mb-4">
                    <v-col cols="12" md="6" class="pb-0" v-if="usertype == 'vendor'">
                        <div class="">
                            <!-- <v-select v-model="category" :items="categoryitem" item-title="text"
                                item-value="value" label="Select Category" single-line
                                variant="outlined" hide-details return-object required>
                            </v-select> -->
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Category<span class="text-error ma-1"><sup>*Requried</sup></span></v-label>


                                
                                <v-select multiple v-model="cats" :items="catItems" item-text="text" item-value="value"
                                    label="Select Categories" single-line variant="outlined" hide-details return-object
                                    required :rules="reqrules">
                                </v-select>


                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-if="usertype == 'vendor'">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Your Brand/Business Name<span
                                    class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                            <VTextField v-model="brandValue" required placeholder="Enter Brand name" hide-details
                                :rules="reqrules"></VTextField>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span
                                    class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                            <v-select v-model="country" :items="countryitem" item-title="text" item-value="value"
                                label="Select Country" single-line variant="outlined" hide-details
                                @update:modelValue="getstate()" return-object required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">State<span
                                    class="text-error ma-1"><sup>*Requried</sup></span></v-label>

                            <v-select v-model="state" :items="stateitem" item-title="text" item-value="value"
                                label="Select State" single-line variant="outlined" hide-details
                                @update:modelValue="getcity()" return-object required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">City<span class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                            <!-- <v-autocomplete v-model="city" :items="cityitem" item-title="text" item-value="value" variant="outlined" color="primary" hide-details return-object required @update:modelValue="setzipcode()" :rules="reqrules" label="Select City">
                                <template v-slot:chip>
                                    <v-chip label color="secondary" size="large" class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
                                </template>
                            </v-autocomplete> -->
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
                                        class="text-error ma-1"><sup>*Requried</sup></span></v-label><span @click="showsearch = !showsearch" class="text-primary cursor-pointer ma-1 d-flex align-center"><SearchIcon width="14"/><span class="ms-1 text-body-2">
                                            Enter Zipcode
                                        </span></span>
                            </div>
                            <!-- <VTextField v-model="zipcode" type="number" hide-details="auto" class="mb-3" required
                                placeholder="Must be 5 digits" 
                                @input=fetch_add()
                                ></VTextField> -->
                            <v-select v-model="zipcode" :items="zipcodeitem" label="Select Zipcode" single-line variant="outlined" hide-details required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                </v-row>
            </tab-content>
            <tab-content title="" :before-change="ivalidate_3" v-if="usertype == 'vendor'">
                <v-row class="mb-4">
                    <v-col cols="12" md="12">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Business Description <span
                                    class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                            <div class="border rounded">
                                <div v-if="editor">

                                    <EditorMenubar :editor="editor" />
                                </div>
                                <editor-content :editor="editor" ref="editorContentRef" />
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="12">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">States you've planned weddings
                                in<span class="text-error ma-1"><sup>*Requried</sup></span></v-label>
                            <v-autocomplete v-model="statevalues" :items="allstateItems" item-value="value"
                                item-title="text" variant="outlined" color="primary" multiple hide-details
                                closable-chips :rules="reqrules">
                                <template v-slot:chip>
                                    <v-chip label color="secondary" size="large" class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
                                </template>
                            </v-autocomplete>
                        </div>
                    </v-col>
                </v-row>
            </tab-content>
        </form-wizard>
    </div>
</template>


<style>
.minWdthAuto {
    min-inline-size: auto !important;
}

.otp-input {
    inline-size: 40px;
    block-size: 40px;
    padding: 5px;
    margin: 0 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
}

.otp-input.is-complete {
    background-color: #ebf4fb;
}

.otp-input.error {
    border: 1px solid red !important;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
}

.error-popup {
    position: fixed;
    inset-inline-end: 20px;
    inset-block-start: 10px;
}

.wpo-pricing-img.signUp {
      inline-size: 50px;
    block-size: 50px;
    padding: 4px;
    position: relative;
    background: #131314;
    box-shadow: 0 0 30px #0000001f;
    overflow: hidden;
}

.wpo-pricing-img.signUp img,
.packselectimg img {
    block-size: 100%;
    object-fit: cover;
}

.wpo-pricing-top.signUp {
    padding: 20px 20px 10px 20px;
}

.checkPackage {
    inline-size: 25px;
    block-size: 25px;
    border-radius: 50%;
}

.pricing-card-new {
    /* border: 1px solid #b8bcc0; */
    box-shadow: 0 0 30px #0000001f !important;
    border-radius: 15px !important;
}


.custom-size-font {
    font-size: 25px;
}

.custom-size-font span {
    font-size: 14px;
}

.pack-des {
    font-size: 13px;
}

.pack-des {
    font-size: 13px;
    border-block-end: 1px solid #cccccc42;
    padding: 2px 0px;
}




.vue-form-wizard.md .wizard-nav-pills>li.active>a .wizard-icon {
    font-size: 14px;
    font-style: normal;
}

.wizard-nav.wizard-nav-pills li.active .wizard-icon-container .wizard-icon {
    color: #fff !important;
}

.wizard-icon,
.vue-form-wizard .wizard-icon-circle .wizard-icon {
    color: #b4801c !important;
    font-style: normal;
}

.vue-form-wizard.md .wizard-navigation .wizard-progress-with-circle {
    position: relative;
    inset-block-start: 20px;
    block-size: 4px;
}

.vue-form-wizard.md .wizard-icon-circle {
    inline-size: 30px;
    block-size: 30px;
    font-size: 10px;
    border-color: #b4801c !important;
}

.vue-form-wizard.md .wizard-navigation .wizard-progress-with-circle {
    background-color: #ccc;
}

.wizard-progress-bar {
    background-color: #b4801c !important;
}

.wizard-nav.wizard-nav-pills li.active .wizard-icon-circle {
    border-color: #b4801c !important;
}


.wizard-nav.wizard-nav-pills li.active .wizard-icon-container {
    background-color: #b4801c !important;
}

.vue-form-wizard .wizard-icon-circle {
    border: 3px solid #b4801c;
}

.wizard-footer-right button,
.wizard-footer-left button {
    background-color: #b4801c !important;
    border-color: #b4801c !important;
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

.btncustomback {
    transform: translatey(46px);
}

.packageDesign .cardPrice:nth-child(2) .pricing-card-new {
   background: #131314 !important;
    transform: scale(1.1);
    position: relative;
    z-index: 1;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .wpo-pricing-img.signUp{
  background: #353535 !important;
}
.packageDesign .cardPrice:nth-child(2) .wpo-pricing-top {
    border-block-end: 1px solid #cccccc42;
}

.packageDesign .cardPrice:nth-child(2) .forCenter {
    color: #fff !important;
}
.btnNormal {
    background: #000 !important;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .btnNormal{
    background: rgb(var(--v-theme-primary)) !important;
}
.packageDesign .cardPrice:nth-child(2) .RecuText{
  color: #fff !important;
  font-weight: 500;
}
.radioClick i.mdi-radiobox-marked,
.radioClick i.mdi-radiobox-blank  {
    color: #000 !important;
}
.text-darkIn {
    color: #000;
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
.packageDesign .cardPrice.extrapackageStyle:nth-child(2) .pricing-card-new{
  transform: scale(1);
}
.extrapackageStyle .styleforEditorcode {
  font-size: 12px;
}
.extrapackageStyle .pack-name {
  font-size: 20px;
}
.v-slick-slide-group {
    height: 70px !important;
}
</style>
