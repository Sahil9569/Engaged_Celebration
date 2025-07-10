<script setup lang="ts">
import { ref, onMounted ,computed } from 'vue';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import user1 from "@/assets/images/profile/user-1.jpg";
import serviceimg from "@/assets/images/customer/djs.jpg";
import contractImg from "@/assets/images/vendor/contract.png";
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';
import html2pdf from 'html2pdf.js'; // Import html2pdf
const dialog = ref(false);
const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
}); 


const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

const bookingData = ref([]);
const package_name = ref('');
const category = ref();
const categoryitem = ref([]);
const multipleValues = ref([]);
const multipleItems = ref([]);
const pacakgeprice = ref('');
const advancepayment = ref('')
const bookingavailable = ref('');
const termconditions = ref('');
const files = ref([]);
const path = window.location.pathname;
const serviceId = path.split('/').pop();
const category_name = ref('')
const pkg_img = ref('')
const pkg_name = ref('')
const package_id = ref('')
const cities = ref([])
const pkg_price = ref('')
const pkg_totalbook = ref('')
const pkg_rembook = ref('')
const pkg_deposit = ref('')
const pkg_deposit_amt = ref('')
const srvc_budget = ref('')
const srvc_terms = ref('')
const req_date = ref('2024-06-01')
const srvc_location = ref('')
const srvc_bookingdate = ref('')
const srvc_bookingtime = ref('')
const link = ref('')
const couple_name = ref('')
const couple_email = ref('')
const couple_profile = ref('')
const couple_id = ref('')
const package_owner_id = ref('')
const view_contract = ref(false)
const c_sign=ref("");
const v_sign=ref("");
const click_accept = () => {dialog.value = true;};
const c_stripe_dialog = ref(false)
const connect_stripe = () => {c_stripe_dialog.value = true;};
if (path.includes('accept')) {click_accept();}
async function getstate(){
    fullpageloader.value = true
    const response = await axios.post('home/getstate', {cid:country.value})
    if (response.data.status=='SAVED'){
        console.log('response_______________________', response)
        stateitem.value = response.data.states
        state.value = null
        city.value = null
        fullpageloader.value = false
    }
}
async function getcity(){
    fullpageloader.value = true
    const response = await axios.post('home/getcity', {sid:state.value})
    if (response.data.status=='SAVED'){
        console.log('response_______________________', response)
        cityitem.value = response.data.cities
        city.value = null
        fullpageloader.value = false
    }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const strp_status = ref("");
const booking_status = ref("");
const msglink = ref('/vchats?march=');
const final_deposit_amt = ref("");
const deposit_payemt_status= ref("");
const full_pay_status= ref("");
const remianing_status= ref("");
const remaining__amt = ref();
const assign_vendor_id = ref("");
const assign_price = ref("");
const assign_deposit = ref("");
const assign_deposit_amt = ref();


async function singlebooking() {
  try {

    const formData = new FormData();
    formData.append("user_current_role",'vendor');
    formData.append("admin_id",couple_id.value);
    formData.append("user_current_role_type",'close_vendor');
    formData.append("serviceId",serviceId);
    const response = await axios.post(`/home/single_booking`, formData, config);
    console.log(response.data,"hi responce all booking customer ")

    if (response.data.status == 'SAVED') {
        const res: any = response.data.booking_data
    msglink.value = `/vchats?march=${response.data.march}`
    category_name.value = res.package.category.name
        pkg_img.value = res.package.package_logo === '/media/default.jpg' ? serviceimg : BASE_URL +  res.package.package_logo 
        pkg_name.value = res.package.name
        cities.value = res.package.cities
        pkg_price.value = res.package.price
        pkg_deposit.value = res.package.advance_payment
        pkg_deposit_amt.value = res.deposit_amount
        pkg_rembook.value = res.package.no_of_booking
        pkg_totalbook.value = res.package.no_of_booking
        package_id.value=res.package.id
        assign_deposit.value=res.assign_deposit
        assign_price.value=res.assign_price
        assign_deposit_amt.value=  (res.assign_price) * (res.assign_deposit/100)
        srvc_bookingdate.value = res.seldate
        srvc_bookingtime.value = res.seltimes.join(', ');
        booking_status.value = res.vendor_status
        if (res.city){srvc_location.value = res.city.city + ' , ' + res.state.state + ' , ' + res.country.country}
        srvc_terms.value = res.requirement
        advancepayment.value = res.package.advance_payment
        finaldeposit.value = res.package.advance_payment
        srvc_budget.value = res.budget
        link.value = res.package.id
        couple_name.value = res.package.admin.userprofile.user.first_name + ' ' + res.package.admin.userprofile.user.last_name
        couplename.value=res.package.admin.userprofile.user.first_name + ' ' + res.package.admin.userprofile.user.last_name
        couple_email.value = res.package.admin.userprofile.user.email
        couple_profile.value = (res.package.admin.userprofile.profile_pic) ? BASE_URL + res.package.admin.userprofile.profile_pic : user1
        couple_id.value=res.package.admin.id
        strp_status.value=res.package.vendor ? res.package.vendor.stripe_status : ''

        if ((res.package.admin) && localStorage.getItem('role')=='vendor'){
            strp_status.value = res.assign_vendor[0].stripe_status
        }

        package_owner_id.value=res.package.vendor ? res.package.vendor.id : res.package.admin.id
        const first_vendor = res.assign_vendor.length > 0 ? res.assign_vendor[0] : null;
        assign_vendor_id.value = first_vendor ? first_vendor.id : null;
    package_name.value=res.package.name
    pacakgeprice.value =res.package.price

    // BOOKING DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    countryitem.value       = response.data.countries
    const contract: any = response.data.contract_data
    if ((contract.length == 0)){
        view_contract.value = false
        finalprice.value=pkg_price.value
       
    }
    else{
        view_contract.value = true
        view_link.value=contract.id
        radioStatus.value=contract.action_status
        finalprice.value=contract.final_budget
        v_sign.value = contract.vendor_sign
        c_sign.value = contract.couple_sign
        final_deposit_amt.value = contract.deposit_amt
        retainer.value = contract.retainer
        contracted_services.value = contract.contracted
        expiration.value = contract.expiration
        documentation.value = contract.documentation
        hotel_accommodations.value = contract.hotel_accom
        destination.value = contract.destination
        cancellation_policy.value = contract.cancellation
        postponement_policy.value = contract.postponement
        responsibility.value = contract.responsibility
        overtime.value = contract.overtime
        attire.value = contract.attire
        liability.value = contract.liability
        contracted_vendor_payments.value = contract.contracted_payments
        damage_loss_accessories.value = contract.damage
        schedule_method.value = contract.schedule
        attorney.value=contract.attorney
        appropriate_conduct.value = contract.safe_working

        let a       = new Date(contract.seldate)
        availableDates.value.push( String(new Date(a.getFullYear(), a.getMonth(), a.getDate())) )
        const eli   = document.querySelector(`[aria-label="${  a.toLocaleDateString('en-US',{ weekday:'long',year:'numeric',month:'short',day:'numeric'})  }"]`);
        if (eli) { eli.click() } else { console.log('Element not found'); }
        setTimeout(() => {  selectedTimes.value = contract.seltimes;    }, 500);






        remaining__amt.value = parseInt(contract.final_budget) - parseInt(contract.deposit_amt)

        if(contract.country){
            country.value={'text':contract.country.country, 'value':contract.country.id}
        }
        if(contract.state){
            state.value= {'text':contract.state.state, 'value':contract.state.id}
        }
        if(contract.city){
            city.value={'text':contract.city.city, 'value':contract.city.id}
        }
        advancepayment.value=contract.deposit_amt
        termconditions.value=contract.termconditions


        if (contract.additional_srvcs != 'undefined '){
            document.addEventListener("DOMContentLoaded", function() {
            const tiptapElement = document.querySelector('.tiptap');
            if (tiptapElement) {tiptapElement.innerHTML = contract.additional_srvcs;} 
            else {console.error("Element with class 'tiptap' not found");}
        });}
    }

    bookingData.value = response.data.pay_booking_data.map((elem:any) => ({
        "service": elem.booking.package.name,
        "bookingdate": formatDate(elem.created_at),
        "bookingpayment":'$' + elem.total_amt, 
        "statustext":elem.status,
        "statuscolor": elem.status === "done" ? "success" : "primary",
        "payment_type":elem.payment_type,
        "notes":elem.notes ? elem.notes : "undefined",
        "btn_link": `/vendor-invoice/` + elem.id,

        }));

    deposit_payemt_status.value=response.data.deposit_pay_status
    full_pay_status.value=response.data.full_pay_status
    remianing_status.value=response.data.remaining_pay_status
    fullpageloader.value = false
    }
    else{ fullpageloader.value = false}
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


const finalprice                    = ref();
const city                          = ref();
const state                         = ref();
const country                       = ref();
const cityitem                      = ref([])
const stateitem                     = ref([])
const countryitem                   = ref([])
const availability = ref(false);
const requestpayment = ref();
const detailreq = ref();
function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}
 
const handleFileChange = (event) => {
      files.value = Array.from(event.target.files); // Correctly set files array
      console.log(files.value, "filesssssssssssss2");
    };

const retainer = ref();
const contracted_services = ref();
const expiration = ref();
const documentation = ref();
const hotel_accommodations = ref();
const destination = ref();
const attire = ref();
const liability = ref();
const cancellation_policy = ref();
const postponement_policy = ref();
const responsibility = ref();
const overtime = ref();
const contracted_vendor_payments = ref();
const damage_loss_accessories = ref();  
const schedule_method = ref();  
const attorney = ref();  
const appropriate_conduct = ref(); 
const view_link=ref("");
const reqrules   = ref([(v: string) => !!v || 'This field is required']);
function checklength(){
    if(requestpayment.value) requestpayment.value = (requestpayment.value.length > 10) ? requestpayment.value.slice(0,10).replace(/\D/g, "") : requestpayment.value.replace(/\D/g, "");
  

    }

async function booking_payment(action='null') {
  try {
    const formData = new FormData();
    formData.append("action",action);
    formData.append("request_amt",requestpayment.value);
    formData.append("detailreq",detailreq.value);
    formData.append("booking_id",serviceId);
    formData.append("assign_vendor_id",assign_vendor_id.value);
    formData.append("admin_idd",package_owner_id.value);
    formData.append("requestpaymentradio",requestpaymentradio.value);
    formData.append("vendor_admin_payment","vendor_admin_payment");
    
    if (action =='request_payment'){
        if (!(requestpayment.value)){
            showErrorMessage.value = true;
            myerrors.value = 'Please fill all required fields!';
            setTimeout(() => {  showErrorMessage.value = false; }, 3000);
            return
        }
    }
    fullpageloader.value=true;
    
    const response = await axios.post(`/home/request_payment`, formData, config);
    if (response.data.status == 'SENT') {
        availability.value = false
        fullpageloader.value=false;
        myerrors.value = 'Payment request sent successfully.';
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 3000);
        window.location.reload();
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const couplename = ref('Loreal');
const finaldeposit = ref();


async function booking_req(action='null',booking_id=null) {
  try {
 
    const formData = new FormData();
    formData.append("action",action);
    formData.append("booking_id",booking_id);
    formData.append("radioStatus",radioStatus.value);
    formData.append("close_booking_request",action);

    fullpageloader.value = true
    const response = await axios.post(`/home/booking_action`, formData, config);
    if (response.data.status == 'SENT') {
        myerrors.value="Booking request accepted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.href=response.data.link_btn;
    }
    if (response.data.status == 'Rejected') {
        myerrors.value="Booking request has been rejected successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.href=response.data.link_btn;
    }
    if (response.data.status == 'Delete') {
        myerrors.value="Booking request deleted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.reload();
    }
    if (response.data.status == 'Saved_Contract') {
        myerrors.value="Contract status saved successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.reload();
    }
    
    

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
const endcontract = ref(false);



const transaction_download = ref<HTMLElement | null>(null);
const downloadContract = () => {
  if (transaction_download.value) {
    const element = transaction_download.value as HTMLElement; // Ensure the correct type
    const options = {
      margin: 1,
      filename: 'transactions.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  }
};

const requestpaymentradio = ref('Add_On');

const isRequestPaymentDisabled = computed<boolean>(() => {
      return requestpaymentradio.value === 'Deposit' || requestpaymentradio.value === 'remaining' || requestpaymentradio.value === 'Full_Payment';
    });

const handlePaymentRadioChange = () => {

    
    if (requestpaymentradio.value === 'Deposit') {
    requestpayment.value = final_deposit_amt.value;
    } 
    else if (requestpaymentradio.value === 'remaining') {
        requestpayment.value = remaining__amt.value; 
    }
    
    else if (requestpaymentradio.value === 'Full_Payment') {

        if(finalprice.value){requestpayment.value = finalprice.value;}
        else{requestpayment.value = pkg_price.value;}

    } else {
    requestpayment.value = null; 
    }
};
 

onMounted(() => {
      handlePaymentRadioChange(); 
      singlebooking();
    });



const menu = ref(false);
const radioStatus = ref('inprogress');


const generateTimeSlots = () => {
    const slots = [];
    const hours = 24;
    for (let i = 0; i < hours; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const period = i < 12 ? 'AM' : 'PM';
        const timeSlot = `${hour.toString().padStart(2, '0')}:00 ${period}`;
        if ( !(bookedSlots.value.includes(timeSlot)) ) {slots.push(timeSlot)}
    }
    return slots;
};

function genavail(avail=true){
    let dateArray           = [];
    if (avail){
        const startDate:any     = new Date();
        const endDate:any       = (new Date()).setFullYear(startDate.getFullYear() + 3);
        while (startDate <= endDate) {
            dateArray.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            // dateArray.push(startDate);
            startDate.setDate(startDate.getDate() + 1);
        }
    }else{
        const endDate:any       = new Date();
        const startDate:any     = new Date((new Date()).setFullYear(endDate.getFullYear() - 3))
        while (startDate < endDate) {
            dateArray.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            // dateArray.push(startDate);
            startDate.setDate(startDate.getDate() + 1);
        }
    }
    // console.log(dateArray)
    return dateArray;
}  

const availableDates = ref<string[]>(genavail().map((a:any)=>(String(a)))); // Fill with available dates

const attributesBook = ref([
    {
        highlight: {
            color: 'text-success',
            fillMode: 'bg-lightsuccess',
            contentClass: 'italic',
        },
        dates: genavail(),
        // dates: [ // available dates here
            // new Date(2024, 0, 1), new Date(2024, 0, 2), new Date(2024, 0, 4), new Date(2024, 0, 5), new Date(2024, 0, 3), new Date(2024, 0, 7), new Date(2024, 0, 8), new Date(2024, 0, 9), new Date(2024, 0, 11), new Date(2024, 0, 12), new Date(2024, 0, 19), new Date(2024, 0, 20), new Date(2024, 0, 21), new Date(2024, 0, 22), new Date(2024, 0, 23), new Date(2024, 0, 24), new Date(2024, 0, 25), new Date(2024, 0, 26), new Date(2024, 0, 27), new Date(2024, 0, 28),
        // ]
    },
    {
        highlight: {
            color: 'text-secondary',
            fillMode: 'bg-lighterror',
            contentClass: 'italic',
        },
        // dates: [ //unavailable dates here
        
        
        
        
        
        // new Date(2024, 0, 6),new Date(2024, 0, 10),new Date(2024, 0, 13),new Date(2024, 0, 14),new Date(2024, 0, 15),new Date(2024, 0, 16),new Date(2024, 0, 17),new Date(2024, 0, 18),new Date(2024, 0, 29),new Date(2024, 0, 30),new Date(2024, 0, 31),
        // ],
        dates: genavail(false),
    },
]);

const selectedDateBook = ref<any | null>(null);
const selectedTimes = ref<string[]>([]); // Array to hold multiple selected times
const superbookedSlots = ref([])
const no_dates = ref('Select any date to see  time slots')

const bookedSlots = ref([]); // Example booked times
let currentDateTimeSlots = ref<string[]>(generateTimeSlots()); // Initialize with generated time slots
const timeSlotMain = ref(false)
const timeAvailable = (date: string): boolean => {
    console.log("level_timeAvailable")
    // Here you can define the logic to determine if the time slots are available for a given date
    // For simplicity, this example assumes all available dates have available time slots
    return availableDates.value.includes(date);
};

const handleDayClick = (day: { date: string }) => {
    no_dates.value = 'Sorry, date not available'
    // console.log("level_handleDayClick", availableDates.value, superbookedSlots.value, day.date)
    const ide = new Date(day.date);
    const newdate = `${ide.getFullYear()}-${String(ide.getMonth() + 1).padStart(2, '0')}-${String(ide.getDate()).padStart(2, '0')}`
    
    let a:any = superbookedSlots.value.filter((a: any) => String(a.ondate) == String(newdate))
    bookedSlots.value = (a.length) ? a[0].timings : []
    console.log("AFTER  bookedslots for ", newdate, " are -", bookedSlots.value)
    
    // currentDateTimeSlots.value = generateTimeSlots()
    // selectedTimes.value = []
    // selectedDateBook.value = ide;
    console.log("selectedDateBook.value = day.date.day;__", selectedDateBook.value, '---', day.date,'---',  newdate, '---', ide, '---', selectedTimes.value)
    console.log("avl___________________", availableDates.value, day.date)
    
    if (availableDates.value.includes(String(day.date))) {
        console.log("__________in the available__________")
        timeSlotMain.value =  true;
        selectedDateBook.value = ide;
        selectedTimes.value = []; // Reset the selected times when a new date is selected
        // Example: Update time slots based on the selected date
        currentDateTimeSlots.value = generateTimeSlots();
    } else {
        selectedDateBook.value  = null;
        timeSlotMain.value      = false;
    }
};

const handleTimeClick = (time: { time: string }) => {
    console.log("level_handleTimeClick")
    // Handle time click if needed
};

const isBooked = (time: string) => {
    // console.log("bookedSlots______________", bookedSlots.value)
    return bookedSlots.value.includes(time);
};

const updateEvent = (time: string) => {
    // Placeholder function to demonstrate where to handle the event logic
    console.log("Selected data: ", selectedDateBook.value, selectedTimes.value);
};


const Adminname = ref('Deepak Sajwan')
const Adminemail = ref('ec_admin@yopmail.com')

const goBack = () => {
  window.history.back();
};
</script>
<template>

<div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="d-flex justify-start">
        <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
            <ChevronLeftIcon size="13" class="me-1" />Back 
        </v-btn>
    </div>
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

    <v-card elevation="10" class="bg-grey100">
        <v-card-item class="pa-sm-6 pa-3">
            <v-row class="mb-4">
                <v-col cols="12" md="4">

                    <!-- <v-card elevation="10"  rounded="md" class="mb-4">
                        <v-card-item>
                            <v-avatar size="80" rounded="xl">    
                                <img :src="user1" width="80"/>
                            </v-avatar>
                            <div class="mt-6">
                                <h5 class="text-h6 mb-2"> {{ Adminname }}</h5>
                                <p class="text-body-2 text-Darklight d-flex align-center mb-0">
                                  Administration
                                </p>
                                <p class="text-body-1 text-Darklight d-flex align-center mb-0">
                                  <MailIcon width="15" class="me-1"/>  {{ Adminemail  }}
                                </p>
                                
                            </div>   
                        </v-card-item>
                    </v-card> -->

                
                    
                    <v-card elevation="10" class=" border d-flex ">
                        <v-card-text class="">
                           
                            <v-row v-if="final_deposit_amt">
                                <v-col cols="12" md="6" class="text-center border-e-md border-primary">
                                    <h6  class="text-h4 mb-1 ">$ {{finalprice}}</h6>
                                    <span class="font-weight-semibold text-body-2">Final Price
                                    </span>
                                </v-col>
                                <v-col cols="12" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1"> $ {{final_deposit_amt}} </h6>
                                    <span class="font-weight-semibold text-body-2">Final Deposit 
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row v-else>

                                <v-col cols="12" md="6" class="text-center border-e-md border-primary">
                                    <h6  class="text-h4 mb-1 ">${{assign_price}}</h6>
                                    <span class="font-weight-semibold text-body-2">Offer price 
                                    </span>
                                </v-col>
                                <v-col cols="12" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1"> $ {{assign_deposit_amt}}</h6>
                                    <span class="font-weight-semibold text-body-2">Up-front Amount<br>
                                    </span>
                                </v-col>

                            </v-row>
                                   
                                   
                        </v-card-text>
                    </v-card>

                </v-col>
                <v-col cols="12" md="8">
                    
                    <div class="">
                        <v-card-text class="pa-0">
                            <v-row>
                                <v-col cols="12">
                                    <v-card elevation="10" class=" border d-flex">
                                        <v-card-text class="pa-4">
                                                    <div class="">
                                                <div class="d-flex gap-2">
                                                    <div>
                                                        <img :src="couple_profile" width="40" class="customerImg"/>
                                                    </div>
                                                    <div class="">
                                                        <h6 class="text-h6 ">{{ couple_name }} </h6>
                                                        <span class="text-truncate d-flex align-center gap-2">
                                                            <span class="text-truncate font-weight-medium">{{couple_email}}</span>
                                                        </span>

                                                            <div class="d-flex  align-center mt-2">
                                                                <template v-if="view_contract" >
                                                                    <v-btn  flat size="small" :to="'/admin-contract-single/' + view_link" color="secondary" class="rounded-sm mr-1">
                                                                        <SignatureIcon size="16" class="me-1"/>
                                                                        View Contract</v-btn>

                                                                    <v-dialog v-if="v_sign && c_sign" v-model="availability" class="dialog-mw" size="small" :max-width="600">

                                                                        <template  v-slot:activator="{ props }">
                                                                            <v-btn v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1 ">
                                                                                <CashIcon size="16" class="me-1"/>
                                                                                Generate Invoice
                                                                            </v-btn>
                                                                        </template>

                                                                        <v-card class="pa-6">
                                                                            <div class="d-flex justify-space-between border-bottom">
                                                                                <h4
                                                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                                    Generate Invoice</h4>
                                                                                <v-btn icon color="" @click="availability = false" flat variant="outlined"
                                                                                    size="x-small" class="bg-error">
                                                                                    <XIcon width="20" />
                                                                                </v-btn>
                                                                            </div>
                                                                            <v-row class="py-5">
                                                                                <v-col cols="12">
                                                                                <div class="d-flex align-center flex-column flex-sm-row">
                                                                                <v-radio-group 
                                                                                    hide-details 
                                                                                    v-model="requestpaymentradio" 
                                                                                    inline 
                                                                                    class="w-100" 
                                                                                    @change="handlePaymentRadioChange"
                                                                                >
                                                                            <v-row>
                                                                                
                                                                                <v-col cols="4" v-if="deposit_payemt_status === 'no' && full_pay_status === 'no'" >
                                                                                    <div>
                                                                                        <label for="depositRadio">
                                                                                            <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                                                <v-card-item class="position-relative pa-3">
                                                                                                    <p class="text-Darklight font-weight-semibold">
                                                                                                        Deposit
                                                                                                    </p>
                                                                                                    <p v-if="final_deposit_amt" class="text-Darklight font-weight-medium">
                                                                                                        $ {{final_deposit_amt}}
                                                                                                    </p>
                                                                                                    <p v-else class="text-Darklight font-weight-medium">
                                                                                                        $ {{pkg_deposit_amt}}
                                                                                                    </p>
                                                                                                    <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                                                    <v-radio id="depositRadio" color="primary" value="Deposit" class="radiofloat"></v-radio >
                                                                                                </v-card-item>
                                                                                            </v-card>
                                                                                        </label>
                                                                                    </div>
                                                                                </v-col>

                                                                            
                                                                                <v-col v-if="deposit_payemt_status === 'yes'" cols="4">
                                                                                    <div >
                                                                                        <label for="depositRadio">
                                                                                            <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                                                <v-card-item class="position-relative pa-3">
                                                                                                    <p class="text-Darklight font-weight-semibold">
                                                                                                        Remaining
                                                                                                    </p>
                                                                                                    <p class="text-Darklight font-weight-medium">
                                                                                                        ${{remaining__amt}}
                                                                                                    </p>
                                                                                                    <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                                                    <v-radio id="depositRadio" color="primary" value="remaining" class="radiofloat"></v-radio >
                                                                                                </v-card-item>
                                                                                            </v-card>
                                                                                        </label>
                                                                                    </div>
                                                                                </v-col>

                                                                                <v-col v-if="full_pay_status === 'no' && deposit_payemt_status === 'no'" cols="4">
                                                                                    <div >
                                                                                        <label for="Full_Payment">
                                                                                            <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                                                <v-card-item class="position-relative pa-3">
                                                                                                    <p class="text-Darklight font-weight-semibold">
                                                                                                        Full Payment
                                                                                                    </p>
                                                                                                    <p v-if="final_deposit_amt" class="text-Darklight font-weight-medium">
                                                                                                        $ {{finalprice}}
                                                                                                    </p>
                                                                                                    <p v-else class="text-Darklight font-weight-medium">
                                                                                                        $ {{pkg_price}}
                                                                                                    </p>
                                                                                                    <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                                                    <v-radio id="Full_Payment" color="primary" value="Full_Payment" class="radiofloat"></v-radio>
                                                                                                </v-card-item>
                                                                                            </v-card>
                                                                                        </label>
                                                                                    </div>
                                                                                </v-col>
                                                                                <v-col cols="4">
                                                                                    <div>
                                                                                        <label for="Add_On">
                                                                                            <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                                                <v-card-item class="position-relative pa-3">
                                                                                                    <p class="text-Darklight font-weight-semibold">
                                                                                                        Additional 
                                                                                                    </p>
                                                                                                    <p class="text-Darklight font-weight-medium">
                                                                                                    Payment
                                                                                                    </p>
                                                                                                    <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                                                    <v-radio id="Add_On" color="primary" value="Add_On" class="radiofloat"></v-radio>
                                                                                                </v-card-item>
                                                                                            </v-card>
                                                                                        </label>
                                                                                    </div>
                                                                                </v-col>
                                                                            </v-row>

                                                                                  
                                                                                </v-radio-group>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div>
                                                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Amount</v-label>
                                                                                <span class="text-error ma-1">*</span>
                                                                                <v-text-field 
                                                                                    v-model="requestpayment" 
                                                                                    variant="outlined" 
                                                                                    @keyup="checklength()"
                                                                            :rules="reqrules"
                                                                            color="secondary"
                                                                            type="text" 
                                                                            maxlength="10"
                                                                                    placeholder="Enter payment amount" 
                                                                                    hide-details
                                                                                    :disabled="isRequestPaymentDisabled"
                                                                                >
                                                                                </v-text-field>
                                                                                </div>
                                                                            </v-col>
                                                                                <v-col cols="12" sm="12">
                                                                                    <div>
                                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Note</v-label>
                                                                                        <v-textarea v-model="detailreq"  variant="outlined" placeholder="" rows="3" color="secondary" row-height="25" shapedhide-details></v-textarea>
                                                                                    </div>
                                                                                </v-col>

                                                                               

                                                                                <v-col cols="12" class="d-flex justify-end">
                                                                                    <v-btn v-bind="props" color="error" variant="flat" class="mt-3 ms-2 rounded-sm" @click="availability = false">
                                                                                        Cancel
                                                                                    </v-btn>
                                                                                    <v-btn v-bind="props" @click="booking_payment('request_payment')" color="primary" variant="flat" class="mt-3 ms-2 rounded-sm">
                                                                                        Send
                                                                                    </v-btn>
                                                                                </v-col>
                                                                            </v-row>
                                                                        </v-card>
                                                                    </v-dialog>
                                                                </template>

                                                                <div v-else >
                                                                   
                                                                    <div v-if="strp_status == 'verified' ">
                                                                        <div v-if="booking_status == 'accepted'">
                                                                            <v-btn flat size="small" color="success" class="rounded-sm mr-1">{{booking_status}}</v-btn>
                                                                        </div>
                                                                        <div v-else>
                                                                            <v-btn  flat size="small" color="success" @click="booking_req('accept',serviceId)" class="rounded-sm mr-1"><CheckIcon size="16" class="me-1"/>Accept</v-btn>
                                                                            <v-btn flat size="small" color="error"
                                                                            @click="booking_req('reject',serviceId)" class="rounded-sm mr-1"><XIcon size="16" class="me-1"/>Decline</v-btn>
                                                                        </div>
                                                                    </div>
                                                                    <div v-else >
                                                                        <div v-if="booking_status == 'accepted'">
                                                                        </div>
                                                                        <div v-else>
                                                                            <v-btn flat size="small" color="success"  @click="connect_stripe()" class="rounded-sm mr-1"><CheckIcon size="16" class="me-1"/>Accept</v-btn>
                                                                            <v-btn flat size="small"  @click="connect_stripe()" color="error" class="rounded-sm mr-1"><XIcon size="16" class="me-1"/>Decline </v-btn>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                        <v-btn flat size="small" color="secondary" class="rounded-sm mr-1" :to="msglink"><MessageIcon size="16" class="me-1"/>Message</v-btn>
                                                    
                                                        <v-dialog v-model="c_stripe_dialog" class="dialog-mw" :max-width="600">
                                                            <v-card class="pa-6">
                                                                <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                                    <h4
                                                                        class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                                        Connect to stripe   </h4>
                                                                    <v-btn icon color="" @click="c_stripe_dialog = false" flat variant="outlined" size="x-small"
                                                                        class="bg-error">
                                                                        <XIcon width="13" />
                                                                    </v-btn>
                                                                </div>
                                                                <div class="py-4">
                                                                    <p>
                                                                        Before you can accept booking requests, you need to link up with Stripe.
                                                                    </p>
                                                                    
                                                                </div>
                                                                <v-card-actions class="px-0 d-flex justify-end w-100">

                                                                    <v-btn class="bg-error rounded-sm" text @click="c_stripe_dialog = false" flat>
                                                                        Close
                                                                    </v-btn>

                                                                    <v-btn class="bg-secondary rounded-sm" to="/profile-settings/payments" text flat >
                                                                        Connect to Stripe
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>

                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                               
                                            </div>
                                        </v-card-text>
                                        <div v-if="booking_status == 'accepted'">
                                            <v-btn flat size="small" color="success" class="rounded-sm mr-1">{{booking_status}}</v-btn>
                                        </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-col>
            </v-row>
            <v-row   class="mt-0 pa-4">
                    <div class="">
                        <h3 class="text-h5 mb-3">Contract Payments</h3>
                    </div>
                    <v-card elevation="10" class="bg-lightprimary border border-primary">
                        <v-card-item class="pa-2">
                            <div ref="transaction_download">
                                <v-table class="month-table ">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Details</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount
                                                </th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Date</th>
                                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                                    Type</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Status</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Action 
                                                </th>
                                            </tr>
                                        </thead>
                                    
                                        <tbody v-if="bookingData.length != 0" >
                                            <tr v-for="(item, index) in bookingData" :key="item.id" class="month-item">
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">{{ index+1 }}</h5>
                                                </td>
                                                <td>
                                                   
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.service }}
                                                    </h5>
                                                
                                                    <v-btn v-if="item.notes && item.notes !='undefined'" color="grey200" class="mt-1 rounded-sm" size="small" >
                                                            Note <QuestionMarkIcon size="15"/>
                                                            <v-tooltip activator="parent" location="top">
                                                                {{ item.notes}}
                                                            </v-tooltip>
                                                        </v-btn>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.bookingpayment }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.bookingdate }}
                                                    </h5>
                                                </td>

                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.payment_type }}

                                                    </h5>
                                                </td>

                                                <td>
                                                    <v-chip rounded="md" class="ma-2 font-weight-semibold"
                                                        :color="item.statuscolor" size="small" label>{{
                                                        item.statustext }}</v-chip>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        <v-tooltip text="View Invoice">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20"
                                                                    class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                        </v-tooltip>
                                                        <v-tooltip text="Download Invoice">
                                                            <template v-slot:activator="{ props }">
                                                                <v-btn icon flat v-bind="props">
                                                                    <DownloadIcon  @click="downloadContract" stroke-width="2" size="20"
                                                                        class="text-secondary" />
                                                                </v-btn>
                                                            </template>
                                                        </v-tooltip>

                                                    </h5>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else >
                                            <tr  class="month-item">
                                                <td colspan="6">
                                                    <p class="text-center center py-2 mt-0 text-error">No data found yet</p>
                                                </td>
                                                
                                            </tr>
                                        </tbody>
                                    

                                    </template>
                                </v-table>
                            </div>
                        </v-card-item>
                    </v-card>
                
               
            </v-row>
        </v-card-item>
    </v-card>
    
</template>
<style>
.contentHeightnew {
    overflow-y: auto;
    height: 170px;
}
.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}
.booking-card:hover  .float-btn-book{
    bottom: 10px;
}
.float-btn-book {
    position: absolute !important;
    left: 50%;
    transform: translatex(-50%);
    bottom: -30px;
    transition: 0.38s ease-in-out 0s all;
}
.service-img-booking {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

label.v-label.v-field-label {
    color: #002642;
    font-weight: 500;
}

.height-set {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.contract-style {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 200px;
    border: 4px solid #ccc;
    position: relative;
}

.contract-style:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 41%, #fff 65%);
    left: 0;
    top: 0;
    opacity: 0.8;
}

.radio-tick {
    position: absolute;
    top: 10px;
    right: 10px;
}

.edit-contract-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

.v-field--disabled .v-field__outline{
        color: rgb(139 142 148);
}


/* datepicker code start here */
.bookingModalStyle .v-card-item__content {
    overflow: visible;
}

.dp__input {
    background-color: transparent;
    padding: 10px 40px;
    border: 1px solid #bcc3c9;
}

.dp__action_row {
    padding: 18px 10px;
}

.dp__action_buttons .dp__action_cancel,
.dp__action_buttons .dp__action_select
 {
    padding: 12px !important;
}

.dp__action_buttons .dp__action_select {
    padding: 14px !important;
}

.dp__action_buttons .dp__action_select {
    background: rgb(var(--v-theme-success)) !important;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
    background: rgb(var(--v-theme-secondary)) !important;
}

.dp__today {
    border: 1px solid rgb(var(--v-theme-secondary)) !important;
}
.dp__input {
    color: #000000b8;
}
.dp__selection_preview {
    display: none;
}
.radiofloat {
    position: absolute;
    right: 0px;
    top: 0;
}
.vc-day-content.vc-focus:focus-within {
    outline: 0;
    box-shadow: none;
}
[tabindex="0"].vc-highlight-content-bg-lightsuccess {
    border: 2px solid #52bf11!important;
}

[tabindex="0"].vc-highlight-content-bg-lighterror {
    border: 2px solid #fa896b!important;
}
.vc-highlight-content-bg-lighterror {
    background-color: rgb(235 235 235) !important;
    color: rgb(145 141 141) !important;
}

.vc-highlight-content-bg-lightsuccess {
    background-color: rgb(230 255 214) !important;
    color: rgb(53 110 18) !important
}
.disabled {
    opacity: 0.8;
    cursor: no-drop;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #002642 !important;
    font-weight: 600;
}

.k-calendar .k-calendar-td.k-state-selected .k-link,
.k-calendar .k-calendar-td.k-state-selected .k-link:hover {
    background-color: #002642;
}

.vc-day-content[tabindex~="0"] {
    background: rgb(var(--v-theme-secondary)) !important;
    color: #fff !important;
}
[tabindex="0"].vc-highlight-content-bg-lighterror,
[tabindex="0"].vc-highlight-content-bg-lightsuccess  {
    border: none !important;
}   

</style>