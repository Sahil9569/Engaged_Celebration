<script setup lang="ts">
import { ref, computed } from 'vue';
import { Calendar } from '@progress/kendo-vue-dateinputs';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


/*--Booking table data --*/
import serviceimg1 from "@/assets/images/customer/catering.jpg";



// search searchbudget locationvalue


import { Carousel, Slide } from "vue3-carousel";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'custom-tiptap-style',
        }
    },
    extensions: [StarterKit],
    content: ``
});

const filteredData = ref([
    {
        link: '/service/1',
        vendorserviceimg: '/assets/images/customer/catering.jpg',
        serviceservice: 'Photography',
        iratings: 4.5,
        vendorserviceprice: '$500',
        serviceprovidername: 'John Doe Photography',
        location: 'New York, USA',
        deposit: 100,
        a_payemnt: 20,
        first_price: 400,
        full_price: 500,
        business_name: 'gfg',
        vendorname: 'John Doe'
    }
]);



const bookingDatamultiple = ref({
    package_paid: false,
    user_package: '',
    user_package_sub: '',
    user_package_onemonth: '',
    lockDialog: false,

    subRadioChange: '',

    couple_one_month_toggle: true,
    couple_one_time_toggle: true,
    couple_single_toggle: true,

    subscription_price: 0,
    subscription_description: '',

    onemonth_price: 0,
    onemonth_description: '',

    onetime_price: 0,
    onetime_description: '',

    booking_payment: () => { },
});





const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);


const package_id = ref('');
const cart_data = ref([]);






const bookingdialog = ref(false);
const bookingDialogTop = ref(false);
const bookingData = ref([]);

const advance_payment = ref('')
const budget = ref('')
const initial_budget = ref()
const city = ref();
const state = ref();
const country = ref();
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])








interface Day {
    date: string;
}

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





async function service_listing(package_id) {
console.log("Sending package_id:", package_id)
const formData = new FormData();
formData.append("serviceId", package_id);
fullpageloader.value   = true;

const response = await axios.post(`/home/single_service`, formData, config);
console.log(response.data, "hi responce")

if (response.data.status == 'SAVED') {
   
if (response.data.data) {
    const res: any = response.data.data
    initial_budget.value = res.advance_payment
    vendorid.value = res.vendor ? res.vendor.id : null
    superbookedSlots.value = (res.vendor) ? res.vendor.available : res.admin.available
    
    superbookedSlots.value.forEach(function(a:any) {
        let i = a.ondate.split('-')
        if ( a.timings.length == 24 ){ attributesBook.value[1].dates.push(new Date(i[0], parseInt(i[1])-1, i[2])); }
    });
    fullpageloader.value=false;
}
}}

// service_listing()



const availableDates = ref<string[]>(genavail().map((a:any)=>(String(a)))); // Fill with available dates


const attributes = ref([
    {

        highlight: {
            color: 'bg-success',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            // new Date(2024, 0, 1),
            // new Date(2024, 0, 2),
            // new Date(2024, 0, 4),
            // new Date(2024, 0, 5),
            // new Date(2024, 0, 3),
            // new Date(2024, 0, 7),
            // new Date(2024, 0, 8),
            // new Date(2024, 0, 9),
            // new Date(2024, 0, 11),
            // new Date(2024, 0, 12),
            // new Date(2024, 0, 19),
            // new Date(2024, 0, 20),
            // new Date(2024, 0, 21),
            // new Date(2024, 0, 22),
            // new Date(2024, 0, 23),
            // new Date(2024, 0, 24),
            // new Date(2024, 0, 25),
            // new Date(2024, 0, 26),
            // new Date(2024, 0, 27),
            // new Date(2024, 0, 28),
        ],
    },
    {
        highlight: {
            color: 'bg-primary',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            // new Date(2024, 0, 6),
            // new Date(2024, 0, 10),
            // new Date(2024, 0, 13),
            // new Date(2024, 0, 14),
            // new Date(2024, 0, 15),
            // new Date(2024, 0, 16),
            // new Date(2024, 0, 17),
            // new Date(2024, 0, 18),
            // new Date(2024, 0, 29),
            // new Date(2024, 0, 30),
            // new Date(2024, 0, 31),
        ],
    },
]);

// const attributesBook = ref([
//     {

//         highlight: {
//             color: 'text-success',
//             fillMode: 'bg-lightsuccess',
//             contentClass: 'italic',
//         },
//         dates: genavail(),
//         // dates: [ // available dates here
//             // new Date(2024, 0, 1), new Date(2024, 0, 2), new Date(2024, 0, 4), new Date(2024, 0, 5), new Date(2024, 0, 3), new Date(2024, 0, 7), new Date(2024, 0, 8), new Date(2024, 0, 9), new Date(2024, 0, 11), new Date(2024, 0, 12), new Date(2024, 0, 19), new Date(2024, 0, 20), new Date(2024, 0, 21), new Date(2024, 0, 22), new Date(2024, 0, 23), new Date(2024, 0, 24), new Date(2024, 0, 25), new Date(2024, 0, 26), new Date(2024, 0, 27), new Date(2024, 0, 28),
//         // ]
//     },
//     {
//         highlight: {
//             color: 'text-secondary',
//             fillMode: 'bg-lighterror',
//             contentClass: 'italic',
//         },
//         // dates: [ //unavailable dates here
        
//         // new Date(2024, 0, 6),new Date(2024, 0, 10),new Date(2024, 0, 13),new Date(2024, 0, 14),new Date(2024, 0, 15),new Date(2024, 0, 16),new Date(2024, 0, 17),new Date(2024, 0, 18),new Date(2024, 0, 29),new Date(2024, 0, 30),new Date(2024, 0, 31),
//         // ],
//         dates: genavail(false),
//     },
// ]);





const selectedDateBook = ref<string | null>(null);
const selectedTimes = ref<string[]>([]); // Array to hold multiple selected times
const superbookedSlots = ref([])
const no_dates = ref('Select any date to see time slots')

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
    no_dates.value = 'No slots available for this date. Please choose another date or check back later.'
    // console.log("level_handleDayClick", availableDates.value, superbookedSlots.value, day.date)
    const ide = new Date(day.date);
    const newdate = `${ide.getFullYear()}-${String(ide.getMonth() + 1).padStart(2, '0')}-${String(ide.getDate()).padStart(2, '0')}`
    
    let a:any = superbookedSlots.value.filter((a: any) => String(a.ondate) == String(newdate))
    bookedSlots.value = (a.length) ? a[0].timings : []
    console.log("AFTER  bookedslots for ", newdate, " are -", bookedSlots.value)
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


function ivalidate(section=null){
    // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    // return fill_req_error( (isValidfname && isValidlname && isValidEmail && u_phone.value) ? true : false )
    myerrors.value = 'Please fill all required fields!';
    var rslt = false
  
    // rslt = ( budget.value && selectedDateBook.value && selectedTimes.value.length && country.value && state.value && city.value && getEditorText(false) )
    rslt = ( budget.value && selectedDateBook.value && selectedTimes.value.length && country.value && state.value && city.value)
  
    if (!(rslt)){
        showErrorMessage.value = true;
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
}


const bookingdialogs= ref(false);
const dialogStates = ref({});

function closeDialog(packageId) {
    dialogStates.value[packageId] = false;  // Update state correctly
}


// const bookavail = ref(false)
const iscuouple = (localStorage.getItem('role')=='customer') ? true : false

const path = window.location.pathname;

const action = ref('Single_servicePage')
const serviceId = path.split('/').pop();
const vendorid = ref()
const vendorname = ref('')



const today = new Date();
const attributesBook = ref([
  {
    // Highlight for today and upcoming dates
    dates: [],
    highlight: {
      fillMode: 'bg-lightsuccess',
      color: 'text-success',
      contentClass: 'bold-text',
    }
  },
  {
    // Past dates styling
    dates: [],
    highlight: {
      fillMode: 'bg-lighterror',
      color: 'text-secondary',
      contentClass: 'past-text',
    }
  },
  {
    // Highlight today's date with stronger color
    dates: [today],
    highlight: {
      fillMode: 'solid',
      color: '#28a745', // Stronger green for today
      contentClass: 'today-highlight',
    }
  }
]);



// Generate dates for upcoming (including today) and past
const generateDateHighlights = () => {
  const upcomingDates = [];
  const pastDates = [];
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30); // 30 days ahead

  for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
    upcomingDates.push(new Date(d));
  }

  for (let d = new Date(today); d >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30); d.setDate(d.getDate() - 1)) {
    pastDates.push(new Date(d));
  }

  attributesBook.value[0].dates = upcomingDates;  // Apply background to upcoming dates
  attributesBook.value[1].dates = pastDates;      // Apply outline to past dates
};

generateDateHighlights();






async function update_to_cart(package_id){
    try{

        if (!selectedDateBook.value || !selectedTimes.value) {
            myerrors.value = "Please add both date and time before updating the package.";
            showErrorMessage.value = true;
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
            return;
        }

        const formData = new FormData();
        formData.append("package_id", package_id);
        formData.append("Update_package", "Update_package");
        formData.append('seldate', selectedDateBook.value);
        formData.append('seltime', selectedTimes.value);
        bookingdialogs.value = false
        // dialogStates.value   = false
        dialogStates.value[package_id] = false;

        const response = await axios.post(`/home/add_cart_package`, formData , config)
        if (response.data.status == 'Updated'){
            showSuccessMessage.value = true;
            myerrors.value = 'Package sucessfully Updated to wishlist!';
            cart_listing();
            setTimeout(() => {
                showSuccessMessage.value = false;
            }, 3000);
    }
    }catch (error) {
        fullpageloader.value = false;
        console.error("Error adding to cart:", error);
    }
}


const minRequiredDeposit = ref(0);



async function cart_listing() {
    fullpageloader.value = false;
  try {
    const response = await axios.post('/home/cart_data');
    console.log('response cart_data--- ', response.data);
    if (response.data.status === 'Done') {
      fullpageloader.value = false;
       cart_data.value = response.data.cart_items;
    }
    if (response.data.status === 'Done') {
        fullpageloader.value = false;
    bookingData.value = response.data.cart_items.map((a:any)=>({
            package_id : a.package.id,
            serviceservice: a.package.name,
            category: a.package.category.name,
            vendorserviceimg: BASE_URL + a.package.package_logo,
            seldate: a.seldate,
            seltime: a.seltimes,
            budget : a.deposit_amount,
            advance_payment : a.package.advance_payment,
            vendorserviceprice: `${a.package.price}`,
            view_link: "/vendor-single/" + a.package.id,
            book_link: "/vendor-single/" + a.package.id + "?booknow",
            // book_link: "/cpackage_pub/" + a.package.id + "?booknow",
            cart_status : a.package.paid_status,
            business_name: a.package.vendor?.business_name ?? '',
            iratings:a.package.iratings,
            vendorname: `${a.package.user?.first_name ?? ''} ${a.package.user?.last_name ?? ''}`,
            a_payemnt: a.package.advance_payment ? `${a.package.advance_payment}` : '',
            first_price: a.package.first_price ?? '',
            full_price: a.package.full_price ?? '',
            serviceprovidername: a.package.name ?? '',
        }))
        const totalDeposit = response.data.cart_items.reduce((sum: number, item: any) => {
            return sum + (parseInt(item.deposit_amount) || 0);
        }, 0);

        minRequiredDeposit.value = totalDeposit; 
        budget.value = totalDeposit; 


        if (cart_data.value.length > 0) {
        package_id.value = cart_data.value[0].package_id;
      }

    }

    countryitem.value = response.data.countries
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

cart_listing()




const errors = ref([]);
const isButtonDisabled = ref(false);
const validateAndCorrectBudget = (event: any) => {
  const MAX_BUDGET = 10000000000;
  const input = event.target as HTMLInputElement;
  let value = Number(input.value);

  errors.value = []; 

  if (isNaN(value) || value === 0) {
    errors.value.push('This field is required.');
    isButtonDisabled.value = true;
  } else if (value < minRequiredDeposit.value) {
    errors.value.push(`Value cannot be less than ${minRequiredDeposit.value}.`);
    isButtonDisabled.value = true;
  } else if (value >= MAX_BUDGET) {
    errors.value.push('Value too large.');
    isButtonDisabled.value = true;
  } else {
    isButtonDisabled.value = false;
  }


  budget.value = value;
};






const clickFunModalbookin = (item: any) => {item.dialogbooking = true }
const reqrules   = ref([(v: string) => !!v || 'This field is required']);
async function getstate() {
    fullpageloader.value = true
    const response = await axios.post('home/getstate', { cid: country.value })
    if (response.data.status == 'SAVED') {
        console.log('response_______________________', response)
        stateitem.value = response.data.states
        state.value = null
        city.value = null
        fullpageloader.value = false
    }
}
async function getcity() {
    fullpageloader.value = true
    const response = await axios.post('home/getcity', { sid: state.value })
    if (response.data.status == 'SAVED') {
        console.log('response_______________________', response)
        cityitem.value = response.data.cities
        city.value = null
        fullpageloader.value = false
    }
}


(async function(){
    fullpageloader.value = true
    const response = await axios.post('home/profileupdate', {"getdata":true})
    if (response.data.status == 'SENT') {
        
        // packname.value=response.data.user_package.package.name
        const iuser = response.data.cuser
        console.log("response___________ profileupdate", iuser)
        countryitem.value   = response.data.countries
        stateitem.value     = response.data.states
        cityitem.value      = response.data.cities
        city.value      =   { text: iuser.city.city, value: iuser.city.id }
        state.value     =   { text: iuser.state.state, value: iuser.state.id }
        country.value   =   { text: iuser.country.country, value: iuser.country.id }
        fullpageloader.value = false
    }
})();




const avldate = ref('')
const parts = path.split('/');
const vendorSegment = parts[parts.length - 2];
import { router } from '@/router';



function getEditorText(html = true) {
    try {
        let editor = document.querySelector('.tiptap');
        if (!editor) {
            console.log("Editor not found!");
            return '';
        }
        return html ? editor.innerHTML : editor.textContent;
    } catch (e) {
        console.log("got error in editor________________________", e);
        return '';
    }
}



async function makebooking() {
    // if (!(ivalidate())){return null}
    try {
        if (!budget.value ) {
            myerrors.value = "Please enter the package deposite amount.";
            showErrorMessage.value = true;
            setTimeout(() => { showErrorMessage.value = false; }, 2000);
            return;
        }
        console.log(avldate.value, "Selected Dates for Booking");
        
        bookingDialogTop.value = false;
        bookingdialog.value = false;
        fullpageloader.value = true;

        // Collect all package IDs into an array
        let packageIds = cart_data.value.map(item => item.package.id);

        let selectedDates = bookingData.value.map(item => item.seldate);
        let selectedTimes = bookingData.value.map(item => item.seltime);


        // Create FormData and send all package IDs at once
        const formData = new FormData();
        formData.append("Multiple_package_ids", JSON.stringify(packageIds));  // Send as JSON array
        formData.append("budget", budget.value);
        formData.append('startDate', avldate.value[0]);
        formData.append('endDate', avldate.value[1]);
        // formData.append('seldate', selectedDateBook.value);
        // formData.append('seltime', selectedTimes.value);
        formData.append('seldate', selectedDates.join(',')); 
        formData.append('seltime', selectedTimes.map(times => times.join('-')).join(';'));
        formData.append('booking_desc', getEditorText());
        formData.append('country', country.value['value']);
        formData.append('state', state.value['value']);
        formData.append('city', city.value['value']);
        formData.append("package_role", vendorSegment);

        // Send a single request with all package data
        const response = await axios.post(`/home/makebooking`, formData, config);

        fullpageloader.value = false;

        // Check if booking was successful
        if (response.data.status === 'SAVED') {
            showSuccessMessage.value = true;
            myerrors.value = 'Booking request sent successfully!';

            cart_data.value = [];
            bookingData.value = [];

            setTimeout(() => {
                // router.push(vendorSegment === 'vendor-single_admin' 
                //     ? `/booking-single-admin/${response.data.bid}` 
                //     : `/booking-single/${response.data.bid}`
                // );
                showSuccessMessage.value = false; 
            }, 3000);
            window.location.reload();
           
        } else {
            myerrors.value = 'Booking failed. Please try again.';
        }

    } catch (error) {
        console.error("Error while making bookings:", error);
        fullpageloader.value = false;
    }
}



async function removeItem(packageId) {
  try {
    const formData = new FormData();
    formData.append("package_id", packageId);
    const response = await axios.post(`/home/add_cart_package`, formData, config);

    if (response.data.status === 'Removed') {
      showSuccessMessage.value = true;
      myerrors.value = 'Package removed from wishlist!';
      
      // Remove the package from the cart list locally
      bookingData.value = bookingData.value.filter(item => item.package_id !== packageId);
      cart_listing()
      setTimeout(() => { showSuccessMessage.value = false; }, 3000);
      window.location.reload();
    }
    
  } catch (error) {
    fullpageloader.value = false;
    console.error("Error removing package from cart:", error);
  }
}

const openDialog = async (package_id) => {
    try {
        loadingStates[package_id] = true;

        // Fetch data first
         service_listing(package_id);

        // After data is fetched, open the dialog
        dialogStates[package_id] = true;
    } catch (error) {
        console.error('Error fetching service listing:', error);
    } finally {
        // Stop loader after process
        loadingStates[package_id] = false;
    }
};



</script>
<template>
    <v-row>
        <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
            <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
        </div>
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


            <v-card elevation="0" rounded="md" class="bg-grey100 border-0">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8"> <v-card-title class="text-h4 ">Multiple
                                Packages</v-card-title>
                            </v-col>
                        <v-col cols="10" md="4">
                            <div v-if="bookingData.length >= 1 "> 
                                    <div class="d-flex justify-end">
                                     <v-dialog v-model="bookingDialogTop" persistent class="dialog-mw bookingModalStyle" size="small">

                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="secondary" variant="flat" size="large" class="mt-3" >
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
                                                Book Multiple Packages
                                            </v-btn>
                                    </template>                               

                                        <v-card class="pa-6">
                                            <div class="d-flex justify-space-between">
                                                <h4
                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                    Book Now</h4>
                                                <v-btn icon color="" @click="bookingDialogTop = false" flat variant="outlined"
                                                    size="x-small" class="bg-error">
                                                    <XIcon width="20" />
                                                </v-btn>
                                            </div>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-label class="font-weight-medium mb-2 ">Deposit Amount<span class="text-error ma-1">*</span></v-label>
                                                    <v-text-field
                                                        v-model="budget"
                                                        variant="outlined"
                                                        type="number"
                                                        placeholder="Enter Deposit"
                                                        hide-details
                                                        @input="validateAndCorrectBudget"
                                                         :error-messages="errors"
                                                        required
                                                        ></v-text-field>
                                                </v-col>
                                            
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label
                                                            class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                        <v-select  v-model="country" :items="countryitem" item-title="text"
                                                                item-value="value" label="Select Country" single-line
                                                                variant="outlined" hide-details @update:modelValue="getstate()"
                                                                return-object  :rules='reqrules' required>
                                                        </v-select>
                                                        
                                                    </div>
                                                </v-col>
    
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label
                                                            class="text-subtitle-1 font-weight-medium pb-2 ">State<span class="text-error ma-1">*</span></v-label>
                                                        <v-select v-model="state" :items="stateitem" item-title="text"
                                                            item-value="value" label="Select State" single-line
                                                            variant="outlined" hide-details @update:modelValue="getcity()"
                                                            return-object  :rules='reqrules' required>
                                                        </v-select>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 ">City<span class="text-error ma-1">*</span></v-label>
                                                        <v-select v-model="city" :items="cityitem" item-title="text"
                                                            item-value="value" label="Select City" single-line
                                                            variant="outlined" hide-details return-object  :rules='reqrules' required>
                                                        </v-select>
                                                    </div>
                                                </v-col>

                                               
                                                <v-col cols="12">
                                                    <v-label class="font-weight-medium mb-2 d-block">
                                                        Description</v-label>
                                                    <div class="border rounded">
                                                        <div v-if="editor">
                                                            <EditorMenubar :editor="editor" />
                                                        </div>
                                                        <editor-content :editor="editor" ref="editorContentRef" />
                                                    </div>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions class="px-0 pt-5">
                                                <v-spacer></v-spacer>
                                                <v-btn class="bg-error" text @click="bookingDialogTop = false" flat>
                                                    Close
                                                </v-btn>
                                                <v-btn :disabled="isButtonDisabled" class="bg-secondary" @click="makebooking()" text flat>
                                                        Submit
                                                        </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                </v-dialog>
                                </div>
                                </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" lg="6" md="6" sm="12" xl="6" v-for="item in bookingData" :key="item">
                            <v-card elevation="10" class="vendor-card-hover h-100">
                                <v-card-item class="pa-4">
                                    <v-row class="align-center">
                                        <v-col cols="12" lg="4" md="4" sm="12" xl="4">
                                            <div class="position-relative d-flex overflow-hidden">
                                                <router-link :to="item.view_link" class="w-100 d-flex">
                                                    <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                                </router-link>
                                                <v-chip rounded="sm"
                                                    class="ma-2 font-weight-semibold bg-secondary badge-service"
                                                    size="small" label>{{ item.category }}
                                                  
                                                </v-chip>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" lg="8" md="8" sm="12" xl="8">
                                            <div class="d-flex justify-space-between">
                                                <v-rating half-increments v-model="item.iratings" density="compact" color="warning"
                                                    size="small"></v-rating>
                                                    <h4
                                                class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                ${{ item.vendorserviceprice }}</h4>
                                                    
                                            </div>
                                            <div class="mt-2 w-100 ps-2">
                                                <router-link :to="item.view_link" class="text-decoration-none text-dark">
                                                    <h4
                                                        class="text-subtitle-1 text-ellipsis font-weight-semibold textSecondary mb-0">
                                                        {{ item.serviceservice }} </h4>
                                                </router-link>
                                                <!-- <div class="d-flex justify-space-between">
                                                    <h4
                                                        class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                        $ {{ item.vendorserviceprice }}</h4>
                                                </div>  -->
                                            <h6 v-if="item.business_name" class="text-body-2 text-13 mb-0 "><span class="font-weight-semibold">Business
                                            Name :</span> {{ item.business_name }}
                                            </h6>
                                            <h6 class="text-body-2 text-13 mb-0 "><span class="font-weight-semibold">
                                                Offered by :</span> {{ item.vendorname }}
                                            </h6>
                                            
                                                         
                                <v-dialog  v-model="dialogStates[item.package_id]"  persistent class="dialog-mw bookingModalStyle" size="small">
                                <template v-slot:activator="{ props }" v-if="iscuouple">
                                    <v-btn v-bind="props"  @click="openDialog(item.package_id)" color="secondary" variant="flat" size="large" class="mt-3">
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
                                                <strong>Booking date :</strong> {{  item.seldate }}
                                            </v-btn>
                                            <!-- <v-btn v-bind="props"  @click="service_listing(item.package_id)" color="secondary" variant="flat" size="large" class="mt-3">
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
                                                <strong>Booking date :</strong> {{  item.seldate }}
                                            </v-btn> -->
                                </template>
                                        
                                        <v-card class="pa-6">
                                            <div class="d-flex justify-space-between">
                                                <h4
                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                    Book Now</h4>
                                                <v-btn  icon color=""  flat variant="outlined" size="x-small" 
                                                    class="bg-error"
                                                    @click="closeDialog(item.package_id)"  
                                                >
                                                    <XIcon width="20" />
                                                </v-btn>
                                                

                                            </div>
                                            <v-row>
                                                    <h4 class="text-dark ms-3 pt-3 pb-3 ps-5 pe-5 w-100 rounded bg-lightCustom">Booking Date : <strong>{{  item.seldate }}</strong>
                                                        <!-- <p class="mt-4 mb-4 time-container">
                                                        <span v-for="(k, index) in item.seltime" :key="index"  class="time-slot">
                                                            {{ k }}
                                                        </span>
                                                    </p> -->
                                                    <p class="mt-4 mb-4 time-container">
                                                    <span 
                                                        v-for="(k, index) in item.seltime.slice().sort((a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b))" 
                                                        :key="index"  
                                                        class="time-slot"
                                                    >
                                                        {{ k }}
                                                    </span>
                                                    </p>

                                                    </h4>  
                                            </v-row>
                                            <v-row>
                                                
                                                <v-col cols="12">
                                                    <div class="calendermain-style">
                                                        <v-row>
                                                            <v-col cols="12" md="7" >
                                                                <v-row>
                                                                    <v-col cols="col">
                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Update Event Date<span class="text-error ma-1">*</span></v-label>
                                                                        <VCalendar class="calender"
                                                                         
                                                                        :attributes="attributesBook"
                                                                :available-dates="availableDates" @dayclick="handleDayClick"
                                                                :time-available="timeAvailable"
                                                                @timeclick="handleTimeClick" />
                                                                    </v-col>
                                                                </v-row>
                                                                
                                                            </v-col>
                                                            <v-col cols="12" md="5" v-if="timeSlotMain && currentDateTimeSlots.length">
                                                                <v-label class="font-weight-medium mb-2 d-block">Time
                                                                    Slots<span class="text-error ma-1">*</span></v-label>
                                                                <v-card elevation="10">
                                                                    <v-card-item class="pa-2">
                                                                        <v-row class="timeSlotScroll scroll-style pa-4">
                                                                            <v-col cols="auto" md="6"
                                                                                v-for="(timeItem, index) in currentDateTimeSlots"
                                                                                :key="index" class="py-0 px-1">
                                                                                <span class="d-block w-100">
                                                                                    <input :id="'checkLabel' + index"
                                                                                        type="checkbox"
                                                                                        :name="'timeSlot' + index"
                                                                                        :value="timeItem"
                                                                                        v-model="selectedTimes"
                                                                                        :disabled="isBooked(timeItem)"
                                                                                        @change="updateEvent(timeItem)"
                                                                                        style="display: none; opacity: 0;" />
                                                                                    <label :for="'checkLabel' + index"
                                                                                        class="w-100 text-center d-block cursor-pointer mb-2 pa-2 font-weight-semibold text-subtitle-2 rounded-sm w-100"
                                                                                        :class="[selectedTimes.includes(timeItem) ? 'bg-dark text-white' : 'border text-dark',isBooked(timeItem) ? 'bg-dark text-white disabled ' : '']" style="border: 1px solid #171718 !important">
                                                                                        {{ timeItem }}
                                                                                    </label>
                                                                                </span>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-card-item>
                                                                </v-card>
                                                            </v-col>
                                                            <v-col v-else md="5" class="d-flex align-center justify-center pt-12">
                                                                <v-card elevation="10" class="h-100 d-flex align-center justify-center bg-lighterror border border-error dateslotsAnim">
                                                                    <v-card-item class="w-100">
                                                                        <div class="text-center">
                                                                            <AlertCircleIcon stroke-width="1.5" size="50"
                                                                class="mr-2 text-error" />
                                                                            <h2 class="text-error font-weight-medium text-center text-h5">
                                                                                {{no_dates}}
                                                                            </h2>
                                                                        </div>
                                                                    </v-card-item>
                                                                </v-card>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </v-col>
                                               
                                               
                                            </v-row>
                                           
                                            <v-btn                            
                                                color="secondary" 
                                                variant="flat" 
                                                size="large" 
                                                class="mt-3"
                                                @click="update_to_cart(item.package_id)" text flat >
                                                Add to wishlist
                                                </v-btn>
                                      
                                        </v-card>
                                    
                                        </v-dialog>
                                                <div class="d-flex gap-2 mt-2 flex-wrap">
                                                    <!-- View Package Button -->
                                                    <v-btn 
                                                        :to="item.view_link || '#'" 
                                                        :disabled="!item.view_link"
                                                        color="secondary" 
                                                        variant="flat" 
                                                        class="d-block py-1"
                                                        size="small">
                                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                                        View Package
                                                    </v-btn>

                                                    <!-- Book Button -->
                                                    <v-btn 
                                                        :to="item.book_link || '#'" 
                                                        :disabled="!item.book_link"
                                                        color="secondary" 
                                                        variant="flat" 
                                                        class="d-block py-1"
                                                        size="small">
                                                        <CalendarIcon stroke-width="2" size="20" class="mr-1" />
                                                        Book
                                                    </v-btn>

                                            

                                                    <!-- Remove Button -->                       
                                                    <v-btn 
                                                    color="error" 
                                                    variant="flat"
                                                    class="d-block py-1"
                                                    size="small" 
                                                    @click="removeItem(item.package_id)" >                                                 
                                                    <CircleMinusIcon stroke-width="1.5" size="18" class="mr-2" />
                                                    Remove
                                                    </v-btn>                                                
                                                </div>

                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>

                  
                    <div class="d-flex gap-2 justify-center" >
                                <div v-if="bookingData.length >= 1 "> 
                                    <div>
                                     <v-dialog v-model="bookingdialog" persistent class="dialog-mw bookingModalStyle" size="small">

                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="secondary" variant="flat" size="large" class="mt-3" >
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
                                                Book Multiple Packages
                                            </v-btn>
                                    </template>                               

                                        <v-card class="pa-6">
                                            <div class="d-flex justify-space-between">
                                                <h4
                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                    Book Now</h4>
                                                <v-btn icon color="" @click="bookingdialog = false" flat variant="outlined"
                                                    size="x-small" class="bg-error">
                                                    <XIcon width="20" />
                                                </v-btn>
                                            </div>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-label class="font-weight-medium mb-2 ">Deposit Amount<span class="text-error ma-1">*</span></v-label>
                                                    <v-text-field
                                                        v-model="budget"
                                                        variant="outlined"
                                                        type="number"
                                                        placeholder="Enter Deposit"
                                                        hide-details
                                                        @input="validateAndCorrectBudget"
                                                         :error-messages="errors"
                                                        required
                                                        ></v-text-field>
                                                </v-col>
                                            
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label
                                                            class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                        <v-select  v-model="country" :items="countryitem" item-title="text"
                                                                item-value="value" label="Select Country" single-line
                                                                variant="outlined" hide-details @update:modelValue="getstate()"
                                                                return-object  :rules='reqrules' required>
                                                        </v-select>
                                                        
                                                    </div>
                                                </v-col>
    
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label
                                                            class="text-subtitle-1 font-weight-medium pb-2 ">State<span class="text-error ma-1">*</span></v-label>
                                                        <v-select v-model="state" :items="stateitem" item-title="text"
                                                            item-value="value" label="Select State" single-line
                                                            variant="outlined" hide-details @update:modelValue="getcity()"
                                                            return-object  :rules='reqrules' required>
                                                        </v-select>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 ">City<span class="text-error ma-1">*</span></v-label>
                                                        <v-select v-model="city" :items="cityitem" item-title="text"
                                                            item-value="value" label="Select City" single-line
                                                            variant="outlined" hide-details return-object  :rules='reqrules' required>
                                                        </v-select>
                                                    </div>
                                                </v-col>

                                               
                                                <v-col cols="12">
                                                    <v-label class="font-weight-medium mb-2 d-block">
                                                        Description</v-label>
                                                    <div class="border rounded">
                                                        <div v-if="editor">
                                                            <EditorMenubar :editor="editor" />
                                                        </div>
                                                        <editor-content :editor="editor" ref="editorContentRef" />
                                                    </div>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions class="px-0 pt-5">
                                                <v-spacer></v-spacer>
                                                <v-btn class="bg-error" text @click="bookingdialog = false" flat>
                                                    Close
                                                </v-btn>
                                                <v-btn :disabled="isButtonDisabled" class="bg-secondary" @click="makebooking()" text flat>
                                                        Submit
                                                        </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                </v-dialog>
                                </div>
                                </div>
                            </div>
                </v-card-item>
            </v-card>

            <div v-if=" !bookingData.length >= 1 " class="mt-6">
                <v-card class="bg-grey100 ctm-eppt-cart elevation-0 d-flex align-center justify-center">
                <v-card-item>
                    <div class="ctm-empty-cart justify-center">
                        <p class="text-center">
                            <GardenCartIcon stroke-width="2" color="bg-secondary" size="60" class="mr-1 text-secondary" /> 
                        </p>
                        <p class="text-center cart-empty-text">
                            You haven’t added any packages to your wishlist. Explore our packages and book now!
                        </p>
                        <p class="text-center cart-empty-text mt-4">
                            <v-btn class="bg-secondary" text flat to="/vendor-category">
                            Explore packages
                        </v-btn>
                        </p>
                        </div>
                    </v-card-item>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";



.time-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Space between items */
    max-width: 100%; /* Ensures proper wrapping */
}

.time-slot {
    flex: 1 1 calc(20% - 10px); /* 5 items per row (20% each) */
    max-width: calc(20% - 10px);
    text-align: center;
    padding: 8px 12px;
    background-color: #c49e5c !important; /* Equivalent to bg-secondary */
    color: white;
    border-radius: 5px;
    margin-bottom: 5px; /* Space for wrapping */
}


.dates-card ul {
    list-style-type: none;
}
.ctm-eppt-cart{
    height: 250px;
}

.v-field__outline {
    color: #171718;
}
.cart-empty-text{
    font-size: 18px;
    font-weight: 500;
    text-transform: capitalize;
}
label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}
.ctm-empty-cart{
    width: 100%;
}
.vendormainimg {
    width: 100%;
    height: 150px;
    object-fit: cover;
}
.bg-lightCustom{
    background-color: #f2e8d2;

}
.vendormainimg.modalvendorimg {
    width: 100%;
    height: 100px;
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
.removectmbtn{
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0px;
    min-width: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.ctm-time-slot{
    font-size: 14px;
}



.bold-text {
    font-weight: bold;
  color: #7e6969;
  background-color: #e3ffb0;
}

.past-text {
    color: #4d1818f6;
    background-color: #efe8e8e9;
}

.today-highlight {
  font-weight: bold;
  background-color: #28a745 !important; /* Strong green */
  color: white !important;
  border-radius: 50%;
}

.vc-day-content {
    border-radius: 50%; /* Circular date background */
    padding: 5px;
}

</style>