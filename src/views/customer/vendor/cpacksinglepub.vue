<script setup lang="ts">
import { ref, computed,onMounted } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import { Calendar } from '@progress/kendo-vue-dateinputs';
import { Carousel, Slide } from "vue3-carousel";
import WebsiteVendor from '@/components/landingpage/section/websitevendor.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import userimg from "@/assets/images/profile/defaultuserimg.png";

import { useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

const route = useRoute();
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);

const userRole = localStorage.getItem('role') || '';
const is_valid_role = ref(userRole !== 'customer');



const is_valid = ref( (['vendor','admin'].includes(localStorage.getItem('role'))) ? false : true );
const selectedDate = ref([]);
const rating = ref(5);
const ratingreview = ref(0);
const tab4 = ref(null);
const dialog = ref(false);
const dialogreview = ref(false);
const dialogenquiry = ref(false);
const bookingdialog = ref(false);
const availability = ref(false);
import image1 from '@/assets/images/customer/decorator.jpeg';
import user1 from "@/assets/images/profile/user-1.jpg";


// Don't remove this. this is used allpackagelisting when click Read More in comment section then direct review tab open
onMounted(() => {
  if (history.state?.tab) {
    tab4.value = history.state.tab;
  }
});


//Fancybox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgs = ref([]); // Empty array to store dynamic images
const fullpageloader = ref(true)
// Function to show images in lightbox
const showImg = (index, imageList) => {
    imgs.value = imageList.map(img => BASE_URL + img.image); // Assign images dynamically
    indexRef.value = index;
    visibleRef.value = true;
};

const onHide = () => visibleRef.value = false;
const moveDisabled = ref(true);

const reviewCard = ref([
    {
        coupleimgphoto: user1,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Deepak Sajxcv;kl;wan"
    },

]);

/*--Booking table data --*/
import serviceimg1 from "@/assets/images/website/decoration1.jpg";

const bookingData = ref([
    {
        includeervice: "",
        vendorserviceimg: serviceimg1,
        serviceprovidername: " ",
        vendorserviceprice: "",
        vendorname: "",
        link: "/",
        states:"",
    },
]);

/*Vendor category Slider*/
const vendorslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 3, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,

};
const vendorslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 4 },
    2200: { itemsToShow: 5 },
};
const carouselfirstRef = ref(null);

const nextfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.next();
};

const prevfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.prev();
};

const wishList = ref(true)
const fucToggle = () => {
    wishList.value = !wishList.value
}
const valuecity = ref(['Select a city']);
const itemss = ref(['Bangalore', 'Chennai', 'Delhi', 'Mumbai']);

const galleryimages = ref([{ image: image1, },]);
const productImages = ref([]);

const reqrules   = ref([(v: string) => !!v || 'This field is required']);
const allgallimages = ref([{ image: image1, },]);
const album = ref([{ albumimg: image1, albumtitle: "mumbai", images: [] },]);
const vid = ref(route.params.id)
const vendormainimg = ref('')
const vendorid = ref()
const is_vendor = ref()
const vendorname = ref('')
const bookavail = ref(false)
const location = ref([])
const country_name = ref();
const prov_services = ref()
const iratings = ref('')
const business_name = ref('')
const res_id = ref('')
const cancel_policy = ref('')
const showAll = ref(false);

const pckg_intro = ref()
const weblinks = ref([])
const deadline_time = ref()
const price_data = ref()
const category = ref('')

const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'custom-tiptap-style',
        }
    },
    extensions: [StarterKit],
    content: ``
});

const action = ref('Single_servicePage')
const path = window.location.pathname;
const serviceId = path.split('/').pop();
const atbook:any = ref('')
const package_id = ref('')
const advance_payment = ref('');
const price = ref('');
const full_price = ref('');
const package_paid = ref()
async function service_listing() {



    if ('booknow' in route.query){ bookingdialog.value = true;setTimeout(() => {  window.scrollTo(0,0);}, 100); }
    try {
        const formData = new FormData();
        formData.append("Single_servicePage", action);
        formData.append("serviceId", serviceId);
        console.log("start function ")
        const response = await axios.post(`/home/single_service`, formData, config);
        console.log(response.data, "hi responce ")
        console.log("response.data.random_similar_pkg",response.data.similar_pkg)
        if (response.data.status == 'SAVED') {
            bookingData.value = response.data.similar_pkg.map((elem: any) => {
                // Handle states, default to empty string if no cities or invalid data
                const firstCity = elem.cities?.[0]; // Get the first city if exists
                const state = firstCity?.state?.state || ''; // Extract the state name or default to an empty string

                return {
                    serviceservice: elem.category.name,
                    vendorserviceimg: elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + elem.package_logo,
                    serviceprovidername: elem.name,
                    vendorserviceprice: `$${elem.price}`,
                    vendorname: `${elem.user.first_name} ${elem.user.last_name}`,
                    deposit: elem.advance_payment,
                    link: `/cpackage_pub/${elem.id}`,
                    ratings: elem.iratings,
                    states: state,
                    // states: a.states.map((a:any)=>(a.state)).join(', '),
                };
                fullpageloader.value        = false; 
            });
        }
        if (response.data.data) {
            const res: any = response.data.data
            console.log('check the response datdsdsa ______________',res)
            // if (res.cities && res.cities.length > 0) {
            // location.value = res.cities.map((a: any) => a.city).join(', ');
            // } else if (res.states && res.states.length > 0) {
            //     location.value = res.states.map((a: any) => a.state).join(', ');
            // }
            if (res.cities && res.cities.length > 0) {
            location.value = res.cities.map((a: any) => a.city);
            } else if (res.states && res.states.length > 0) {
                location.value = res.states.map((a: any) => a.state);
            }
            // location.value = res.cities.map((a: any) => (a.city)).join(', ')
            country_name.value = res.country.country;
            vendormainimg.value = BASE_URL + res.package_logo
            price_data.value = res.price
            category.value = res.category.name
            iratings.value = res.iratings
            business_name.value = res.name
            res_id.value        = res.id
            cancel_policy.value = res.terms_and_conditions
            pckg_intro.value = res.description
            deadline_time.value = res.deadline_time
            weblinks.value = res.weblinks.map((a:any)=>(a.url))
            atbook.value = res.deposit_amount
            advance_payment.value = res.advance_payment
            price.value = res.price
            full_price.value = res.full_price
            is_vendor.value = (res.vendor) ? true : false
            
            galleryimages.value = response.data.serialized_albums.image_urls
            package_id.value = res.id
            vendorid.value = (res.vendor) ? res.vendor.id : res.admin.id
            vendorname.value = `${res.user.first_name} ${res.user.last_name}`
            bookavail.value = res.user.is_active
            productImages.value = response.data.serialized_albums
            countryitem.value = response.data.countries
            budget.value = res.deposit_amount
            initial_budget.value = res.advance_payment
            package_paid.value = res.paid_status

            superbookedSlots.value = (res.vendor) ? res.vendor.available : res.admin.available

            superbookedSlots.value.forEach(function(a:any) {
                let i = a.ondate.split('-')
                if ( a.timings.length == 24 ){ attributesBook.value[1].dates.push(new Date(i[0], parseInt(i[1])-1, i[2])); }
            });
            fullpageloader.value        = false; 
        }
        if (response.data.status == 'SAVED') {
            reviewCard.value = response.data.all_reviews.map((elem: any) => {
                return {
                    "coupleimgphoto": (elem.user.profile_pic) ? BASE_URL + elem.user.profile_pic : user1,
                    "reviewtext": elem.comment,
                    "reviewppostedtime": '$' + elem.created_at,
                    "coupleName": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                    "rating": elem.rating, // Use this rating for each review item
                    "id": elem.id,
                };
            });
            fullpageloader.value        = false; 
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        fullpageloader.value        = false; 
    }
}
service_listing();

function redirectToService() {
    setTimeout(() => {
        window.location.reload();
    }, 500); // 2000 milliseconds = 2 seconds
}
const range = ref({
    start: new Date(2024, 8, 1),
    end: new Date(2024, 8, 5)
});
const budget = ref('')
const initial_budget = ref('')
const city = ref();
const state = ref();
const country = ref();
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])


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

function getEditorText(html=true) {
    var a =''
    try {a = (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;
    }
    catch (e) { console.log("got error in editor________________________", e); a= '' }
    
    return a
}
async function makebooking() {
    if (!(ivalidate())){return null}

    try {
        const formData = new FormData();

        formData.append("package_id", package_id.value);
        formData.append("budget", budget.value);
        formData.append("startDate", range.value.start.toISOString()); // Add start date
        formData.append("endDate", range.value.end.toISOString());
        formData.append('seldate', selectedDateBook.value);
        formData.append('seltime', selectedTimes.value);
        formData.append('booking_desc', getEditorText());
        formData.append('country', country.value['value']);
        formData.append('state', state.value['value']);
        formData.append('city', city.value['value']);
        formData.append('AnonmousBooking', true);

        fullpageloader.value = true
        const response = await axios.post(`/home/makebooking`, formData, config);
        if (response.data.status == 'SAVED') {
            bookingdialog.value = false
            showSuccessMessage.value = true;
            myerrors.value = 'Booking request has been send sucessfully!';
            setTimeout(() => { router.push(`/booking-single/${response.data.bid}`) }, 3000);
            console.log("response_____________________", response.data)
        }
        if (response.data.status == 'BOOKEDANON') {
            bookingdialog.value = false
            setTimeout(() => { router.push(`/booking_success`) }, 3000);
            localStorage.setItem('itodo_bid', response.data.bid)
            console.log("response_____________________", response.data)
        }
        else{ fullpageloader.value = false; }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


const attributes = ref([
    {

        highlight: {
            color: 'bg-success',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            new Date(2018, 0, 1),
            new Date(2018, 0, 2),
            new Date(2018, 0, 4),
            new Date(2018, 0, 5),
            new Date(2018, 0, 3),
            new Date(2018, 0, 7),
            new Date(2018, 0, 8),
            new Date(2018, 0, 9),
            new Date(2018, 0, 11),
            new Date(2018, 0, 12),
            new Date(2018, 0, 19),
            new Date(2018, 0, 20),
            new Date(2018, 0, 21),
            new Date(2018, 0, 22),
            new Date(2018, 0, 23),
            new Date(2018, 0, 24),
            new Date(2018, 0, 25),
            new Date(2018, 0, 26),
            new Date(2018, 0, 27),
            new Date(2018, 0, 28),
        ],
    },
    {
        highlight: {
            color: 'bg-primary',
            fillMode: 'light',
            contentClass: 'italic',
        },
        dates: [
            new Date(2018, 0, 6),
            new Date(2018, 0, 10),
            new Date(2018, 0, 13),
            new Date(2018, 0, 14),
            new Date(2018, 0, 15),
            new Date(2018, 0, 16),
            new Date(2018, 0, 17),
            new Date(2018, 0, 18),
            new Date(2018, 0, 29),
            new Date(2018, 0, 30),
            new Date(2018, 0, 31),
        ],
    },
]);

/*vendor business image Section*/
import review1 from '@/assets/images/customer/makeUp.png';
import review2 from '@/assets/images/customer/photography.webp';
import review3 from '@/assets/images/customer/catering.jpg';
import review4 from '@/assets/images/wedding/decorate.jpg';

/*vendor business image Section*/
import vendorimg from '@/assets/images/profile/defaultuserimg.png';
import { LayoutAlignCenterIcon } from 'vue-tabler-icons';

const vendorprofilecard = ref([]);
const vendorrating = ref(5);
/*Vendor Slider*/

const vendorSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 1,
};
const vendorBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 4 },
    1500: { itemsToShow: 4 },
    1800: { itemsToShow: 4 },
    2200: { itemsToShow: 5 },
};
const carouselRef = ref(null);
const nextSlide = () => {   carouselRef.value && carouselRef.value.next();  };
const prevSlide = () => {   carouselRef.value && carouselRef.value.prev();  };

(async function () {
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({fvn:''})}`)
    vendorprofilecard.value = response.data.feat_vend.map((a:any) => ({
        avatar          : (a.avatar) ? BASE_URL + a.avatar : vendorimg,
        businesscover   : BASE_URL + a.businesscover,
        vendornamecard  : a.vendornamecard,
        businessname    : a.businessname,
        link            : a.link,
    }))
})();


async function refreshPage() {
    setTimeout(() => {
        window.location.reload();
    }, 10000); 
}



//________calendar__________
interface Day { date: string; }

const generateTimeSlots = () => {
    const slots = [];
    const hours = 24;
    for (let i = 0; i < hours; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const period = i < 12 ? 'AM' : 'PM';
        const timeSlot = `${hour.toString().padStart(2,'0')}:00 ${period}`;
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
            // new Date(2024, 0, 1), new Date(2024, 0, 2), new Date(2024, 0, 4), ..........
        // ]
    },
    {
        highlight: {
            color: 'text-secondary',
            fillMode: 'bg-lighterror',
            contentClass: 'italic',
        },
        // dates: [ //unavailable dates here
        // new Date(2024, 0, 6),new Date(2024, 0, 10),new Date(2024, 0, 13)........
        // ],
        dates: genavail(false),
    },
]);

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
//________calendar__________


const errors = ref([]);
const isButtonDisabled = ref(false);


const validateAndCorrectBudget = (event:any) => {
const MIN_BUDGET = parseInt(atbook.value);
const MAX_BUDGET = 10000000000;


  const input = event.target as HTMLInputElement;
  let value = Number(input.value);
    console.log("iiyo___________", value, MAX_BUDGET, MIN_BUDGET, initial_budget.value)


  if (value >= MAX_BUDGET) {
    isButtonDisabled.value = true;
    } else {
    isButtonDisabled.value = false;
   }

  if (isNaN(value)) {
    value = 0;
    errors.value = ['This field is requried.'];
    isButtonDisabled.value = true;
    
  } else {
    errors.value = []; 
    isButtonDisabled.value = false;
  }

  if (value < MIN_BUDGET) {
    value = MIN_BUDGET;
    errors.value.push(`Value cannot be less than ${MIN_BUDGET}.`);
    isButtonDisabled.value = true;
  } else if (value > MAX_BUDGET) {
    value = MAX_BUDGET;
    // errors.value.push(`Value cannot be greater than ${MAX_BUDGET}.`);
    errors.value.push(`Value too large.`);
    isButtonDisabled.value = true;
  }

  input.value = value.toString();
};





function ivalidate(section=null){
    // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    // return fill_req_error( (isValidfname && isValidlname && isValidEmail && u_phone.value) ? true : false )
    myerrors.value = 'Please fill all required fields!';
    var rslt = false
  
    rslt = ( budget.value && selectedDateBook.value && selectedTimes.value.length && country.value && state.value && city.value)
  
    if (!(rslt)){
        showErrorMessage.value = true;
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
}



const savedPackages = ref(new Set());

async function fetchSavedPackages() {
    try {
        const response = await axios.get(`/home/save_for_later`);
        if (response.data.status === "Done") {
            savedPackages.value = new Set(response.data.data);  // Store package IDs
        }
    } catch (error) {
        console.error("Error fetching saved packages:", error);
    }
}

onMounted(fetchSavedPackages);

async function save_package(itemId) {
    try {
       
        fullpageloader.value = true;
        const formData = new FormData();
        formData.append("package_id", itemId);

        const response = await axios.post(`/home/save_for_later`, formData);

        if (response.data.status === "Saved") { 
            myerrors.value = 'Package added to wishlist successfully!';
            savedPackages.value.add(itemId);
            showSuccessMessage.value = true;
            setTimeout(() => {  showErrorMessage.value = false;  }, 3000); 
           
        } 
        else if (response.data.status === "Removed") {
            myerrors.value = 'Package successfully removed from wishlist!';
            savedPackages.value.delete(itemId);
            showSuccessMessage.value = true;
            setTimeout(() => {  showErrorMessage.value = false;  }, 3000);
      
        } 
        else { 
            console.error("Failed to save package"); 
        }

        setTimeout(() => { showSuccessMessage.value = false; }, 3000); 
        fullpageloader.value = false;

    } catch (error) {
        console.error("Error saving package:", error);
    } 
}



async function edirectToLogin(){
            window.location.href = "/login"; 
        }


</script>
<template>
    <Header />
    <v-container class="py-6 container-width">
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

        <v-row>
            <v-col cols="12">
                <v-row>
                    <v-col cols="12" md="12">
                        <div class="position-relative">
                            <img :src="vendormainimg" class="main-img-vendor rounded mb-2">
                            <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service"
                                size="small" label>{{ category }}</v-chip>
                        </div>

                        
                        <div class="d-flex justify-space-between align-start">
                            <div class="">
                                <v-rating half-increments disabled v-model="iratings" density="compact" color="warning" size="small"></v-rating>
                                <h2 class="font-weight-semibold textSecondary">{{ business_name }}</h2>
                                
                                <p v-if="advance_payment">
                                    <h6 v-if="advance_payment" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit
                                            :</span>$ {{parseInt(advance_payment/100*price)}} ({{ advance_payment }}% of $ {{ price}})
                                        </h6>
                                </p>
                                <p v-else="full_price">
                                    <h6 v-if="full_price" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit 
                                            :</span>$ {{ parseInt(full_price) }} 
                                            ({{ ((full_price / price) * 100).toFixed(2) }}% of $ {{ price }})
                                         
                                        
                                        </h6>
                                </p>


                                <!-- <h6 class="text-subtitle-1 font-weight-medium textSecondary mt-1 d-flex align-center"> -->
                                    <!-- <span class="font-weight-semibold">Deposit: </span>$ {{ atbook }} </h6> -->




                                <!-- <h6 class="text-subtitle-1 font-weight-medium textSecondary mt-1 d-flex align-top">
                                    <span class="font-weight-semibold">Location: </span>{{country_name}} :{{ location }}
                                </h6> -->


                                <h6 class="text-subtitle-1 font-weight-medium textSecondary mt-1 d-flex align-top">
                                    <span class="font-weight-semibold">Location: </span>
                                    <!-- {{country_name}} : -->
                                    <span class="font-weight-semibold">
                                        {{country_name}}:
                                        </span>

                                    <span v-if="location.length <=3">
                                        <span v-for="(loc,index) in location" :key="index">
                                            {{ loc }} <span v-if="index !== location.length -1"> ,</span>
                                        </span>
                                    </span>

                                    <span v-else>
                                        <span v-for="(loc,index) in (showAll ? location : location.slice(0,3))" :key="index">
                                            {{ loc }} <span v-if="index !== (showAll ? location.length -1 : 2)"> ,</span>
                                        </span>
 
                                        <span class="text-primary cursor-pointer" @click="showAll = !showAll">
                                            {{ showAll ? '  Hide' : '  View All' }}
                                        </span>
                                    </span>
                                </h6>



                                <!-- <h6 class="text-subtitle-1 font-weight-medium textSecondary mt-1 d-flex align-center">
                                    <span class="font-weight-semibold">Remaining Booking: 11 </span>
                                </h6> -->
                                <!-- <h6 class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center"> <span class="font-weight-semibold">Offered by: </span> 
                                    <span v-if="is_vendor"> <router-link :to="`/vendor-profile/${vendorid}`">{{ vendorname }}</router-link> </span>
                                    <span v-else>{{ vendorname }}</span>
                                </h6> -->

                                <h6 class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center"> <span class="font-weight-semibold">Offered by: </span> 
                                    <span v-if="is_vendor"> {{ vendorname }}<strong v-if="!(bookavail)">  (Unavailable)</strong></span>
                                    <span v-else>{{ vendorname }}</span>
                                </h6>



                                <template v-if ="package_paid">
                                    <v-btn color="secondary" variant="flat" size="small" class="mt-3"
                                    :href="`/vendor-single/${package_id}`">
                                        <LockIcon stroke-width="2" size="20" class="mr-1" />
                                                Book Now
                                    </v-btn>


                                    <!-- <v-dialog v-model="bookingdialog" persistent class="dialog-mw bookingModalStyle" size="small" v-if="bookavail">
                                    <template v-slot:activator="{ props }" v-if="is_valid">
                                        <v-btn v-bind="props" color="secondary" variant="flat" size="small"
                                            class="mt-3">
                                            <LockIcon stroke-width="2" size="20" class="mr-1" />
                                            Book Now
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
                                                    :error-messages="errors"
                                                    variant="outlined"
                                                    type="number"
                                                    placeholder="Enter Deposit"
                                                    hide-details
                                                    @input="validateAndCorrectBudget"
                                                    :rules='reqrules' required
                                                    ></v-text-field>
                                                    <span class="text-error text-body-1 mt-1" v-if="errors.length > 0">
                                                    {{ errors[errors.length - 1] }}
                                                    </span>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label
                                                        class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                    <v-select  @input="validateAdress" v-model="country" :items="countryitem" item-title="text"
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
                                                <div class="calendermain-style">
                                                    <v-row>
                                                        <v-col cols="12" md="7" >
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select Date<span class="text-error ma-1">*</span></v-label>

                                                                    <VCalendar class="calender" :attributes="attributesBook"
                                                            :available-dates="availableDates" @dayclick="handleDayClick"
                                                            :time-available="timeAvailable"
                                                            @timeclick="handleTimeClick"  /> 
                                                                <div>
                                                                    
                                                                </div>
                                                              
                                                        </v-col>
                                                        <v-col cols="12" md="5" v-if="timeSlotMain && currentDateTimeSlots.length">
                                                            <v-label class="font-weight-medium mb-2 d-block">Time
                                                                Slots<span class="text-error ma-1">*</span></v-label>
                                                            <v-card elevation="10">
                                                                <v-card-item class="pa-2">
                                                                    <v-row class="ma-n1 timeSlotScroll scroll-style py-5 px-2">
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
                                            <v-btn to="/login" class="bg-secondary" text flat>Submit </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog> -->

                                </template>
                                <template v-else>
                                    <v-dialog v-model="bookingdialog" persistent class="dialog-mw bookingModalStyle" size="small" v-if="bookavail">
                                    <template v-slot:activator="{ props }" v-if="is_valid">
                                        <v-btn v-bind="props" color="secondary" variant="flat" size="small"
                                            class="mt-3">
                                            <CalendarIcon stroke-width="1.5" size="16" class="mr-1" />
                                            Book Now
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
                                                    :error-messages="errors"
                                                    variant="outlined"
                                                    type="number"
                                                    placeholder="Enter Deposit"
                                                    hide-details
                                                    @input="validateAndCorrectBudget"
                                                    :rules='reqrules' required
                                                    ></v-text-field>
                                                    <span class="text-error text-body-1 mt-1" v-if="errors.length > 0">
                                                    {{ errors[errors.length - 1] }}
                                                    </span>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label
                                                        class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                    <v-select  @input="validateAdress" v-model="country" :items="countryitem" item-title="text"
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
                                                <div class="calendermain-style">
                                                    <v-row>
                                                        <v-col cols="12" md="7" >
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select Date<span class="text-error ma-1">*</span></v-label>

                                                                    <VCalendar class="calender" :attributes="attributesBook"
                                                            :available-dates="availableDates" @dayclick="handleDayClick"
                                                            :time-available="timeAvailable"
                                                            @timeclick="handleTimeClick"  /> 
                                                                <!-- <v-col cols="auto">
                                                                    <div class="d-flex align-center justify-end gap-2">
                                                                        <span class="text-success text-subtitle-1 font-weight-semibold">
                                                                            <PointIcon size="14" color="success" />
                                                                            Available
                                                                        </span>
                                                                        <span class="text-error text-subtitle-1 font-weight-semibold">
                                                                            <PointIcon size="14" color="error" />
                                                                            Booked
                                                    
                                                                        </span>
                                                                    </div>
                                                                </v-col> -->
                                                                <div>
                                                                    
                                                                </div>
                                                              
                                                        </v-col>
                                                        <v-col cols="12" md="5" v-if="timeSlotMain && currentDateTimeSlots.length">
                                                            <v-label class="font-weight-medium mb-2 d-block">Time
                                                                Slots<span class="text-error ma-1">*</span></v-label>
                                                            <v-card elevation="10">
                                                                <v-card-item class="pa-2">
                                                                    <v-row class="ma-n1 timeSlotScroll scroll-style py-5 px-2">
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
                                            <v-btn :disabled="isButtonDisabled" class="bg-secondary" @click="makebooking()" text flat>Submit</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                </template>




                                
                                

                                

                                <v-btn v-bind="props" to="/login" color="secondary" variant="flat" size="small" class="mt-3 ms-2" v-if="is_valid && bookavail">
                                    <Message2Icon stroke-width="1.5" size="18" class="mr-2 " />Chat Vendor
                                </v-btn>
                                <!-- availability  -->
                                <!-- <v-dialog persistent class="dialog-mw" size="small">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" to="/login" color="secondary" variant="flat"
                                            size="small" class="mt-3 ms-2">
                                            <Message2Icon stroke-width="1.5" size="18" class="mr-2 " />Chat Vendor
                                        </v-btn>
                                    </template>
                                </v-dialog> -->
                                <div>
                                    <!-- <div v-if="!is_valid_role">
                                    <v-col cols="6">
                                        <v-btn color="secondary" variant="flat" class=" d-block py-1" size="small"
                                            @click="save_package(res_id)">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        {{ savedPackages.has(res_id) ? 'Unsave' : 'Save For Later' }}
                                        </v-btn>
                                    </v-col>
                                    </div> -->
                                    
                                </div>



                            </div>
                            <div class="pa-4">
                                <div class="position-relative">
                                    <div v-if="!is_valid_role" class="d-flex justify-end mb-2">
                                        <!-- Unsave Button (Shown if the package is already saved) -->
                                        <div
                                            v-if="savedPackages.has(res_id)" 
                                            class="ctm-save" 
                                            @click="save_package(res_id)">
                                            
                                            <svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="#fff"  class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
                                        </div>

                                        <!-- Save Button (Shown if the package is NOT saved) -->
                                        <div 
                                            v-else 
                                            class="ctm-save ctm-single-save" 
                                            @click="save_package(res_id)">
                                            <HeartIcon stroke-width="1.5" size="18" color="#fff"/>
                                                
                                        </div>

                                    </div>

                                    <div v-else class="ctm-save" @click="edirectToLogin">
                                        <HeartIcon stroke-width="1.5" size="18" color="#fff" />
                                    </div>
                                </div>
                                <h2 class="font-weight-semibold textSecondary">${{ price_data }}</h2>
                            </div>
                        </div>


                        <div class="py-4">

                            <!-- tab section  -->

                            <v-card class="border-top border-bottom stickynavbar" elevation="0">
                                <v-card-item class="pa-0 rounded-0">

                                    <v-tabs v-model="tab4" color="primary" class="">
                                        <v-tab value="about" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> About
                                        </v-tab>
                                        <v-tab value="policies" color="secondary">
                                            <NotesIcon stroke-width="1.5" width="20" class="v-icon--start" /> Terms &
                                            Conditions
                                        </v-tab>
                                        <v-tab value="album" color="secondary">
                                            <AlbumIcon stroke-width="1.5" width="20" class="v-icon--start" /> Albums
                                        </v-tab>
                                        <v-tab value="reviews" color="secondary">
                                            <QuoteIcon stroke-width="1.5" width="20" class="v-icon--start" /> Reviews
                                        </v-tab>
                                    </v-tabs>

                                </v-card-item>
                            </v-card>




                            <v-divider></v-divider>
                            <v-card-text class="bg-light border pa-4">
                                <v-window v-model="tab4">

                                    <v-window-item value="about">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Description
                                        </h2>

                                        <div class="mb-5" v-if="deadline_time">
                                        <p class="" >
                                            <span class="text-body-1 font-weight-bold">
                                                Cut Off Days : 
                                            </span>
                                            <span v-if="deadline_time == 1" class="text-">{{ deadline_time }} Day</span>
                                            <span v-else class="text-">{{ deadline_time }} Days</span>
                                        </p>
                                        <p class="text-body-2 text-Darklight font-weight-semibold">Cut-off days refer to the number of days in advance that you need to book before the event date.</p>
                                    </div> 




                                        <div class="mb-5" v-if="weblinks.length">
                                        <p class="text-body-1 font-weight-bold" >
                                            Weblinks :
                                        </p>
                                        <div v-for="url in weblinks" class="text-body-1 editorcodestyle" >
                                            <a class="text-info" :href="url" target='blank'>{{ url }}</a><br>    
                                        </div> 
                                    </div> 
                                        <div class="mb-5"> 
                                            <p class="text-body-1 font-weight-bold" >
                                            Package Description :
                                        </p>
                                            <div v-html="pckg_intro" class="text-body-1 editorcodestyle" ></div> 
                                        </div>
                                    </v-window-item>

                                    <v-window-item value="policies">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            Terms & Policies</h2>
                                        <div class="mb-5">
                                            <!-- <p class="text-body-1 text-13 textSecondary">
                                                {{ cancel_policy }}
                                            </p> -->
                                            <!-- <div v-html="cancel_policy" class="text-body-1 editorcodestyle" ></div>  -->
                                            <div v-if="cancel_policy && cancel_policy.trim().replace(/<p><br.*?><\/p>/g, '') !== ''" 
                                                v-html="cancel_policy" 
                                                class="text-body-1 editorcodestyle">
                                            </div>
                                            <div v-else>                                         
                                                <v-card elevation="0" class="text-center mt-6 border" color="">
                                                <v-card-item class="mx-auto">
                                                    <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                    <h5 class="pt-2 text-error font-weight-semibold">Currently, there are no Terms & Policies available for this package!</h5>
                                                </v-card-item>
                                                </v-card>                                   
                                            </div>
                                        </div>
                                    </v-window-item>


                                    <v-window-item value="album">
                                        <h2
                                            class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                            All Albums</h2>
                                        <v-row class="pa-2">
                                            <v-col v-if=" !productImages || productImages.length === 0">
                                                <v-card elevation="0" class="text-center mt-6 border" color="">
                                                <v-card-item class="mx-auto">
                                                    <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                    <h5 class="pt-2 text-error font-weight-semibold">Currently, there are no albums available for this package!</h5>
                                                </v-card-item>
                                                </v-card>
                                            </v-col>
                                            <v-col v-else cols="12" md="3" v-for="item in productImages" :key="item.id">
                                                <v-dialog v-model="dialog" fullscreen :scrim="false"
                                                    transition="dialog-bottom-transition">
                                                    <template v-slot:activator="{ props }">
                                                        <v-card elevation="10" v-bind="props"
                                                            class="album-card-img d-flex align-end"
                                                            :style="{ backgroundImage: `url(${BASE_URL + item.background_image})` }"
                                                            @click='galleryimages = item.image_urls'>
                                                            
                                                            <v-card-item class="position-relative pa-3 w-100">
                                                                <h3
                                                                    class="text-subtitle-1  font-weight-semibold text-white text-capitalize">
                                                                    {{ item.name }} </h3>
                                                            </v-card-item>
                                                        </v-card>
                                                    </template>
                                                    <v-card>
                                                        <div dark
                                                            class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                                            color="">
                                                            <v-toolbar-title
                                                                class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                                                Images from
                                                                this album</v-toolbar-title>
                                                            <v-btn icon color="" @click="dialog = false" flat
                                                                variant="outlined" class="bg-error" size="small">
                                                                <XIcon width="20" />
                                                            </v-btn>
                                                        </div>
                                                        <v-card-item>
                                                            <v-row class="pa-2">
                                                                <v-col class="pa-2" cols="12" md="4" sm="6"
                                                                    v-for="(card, index) in galleryimages" :key="index">
                                                                    <v-card elevation="10" class="card-hover overflow-hidden" @click="showImg(index, galleryimages)">
                                                                       
                                                    <template v-if="/\.(jpeg|jpg|png|gif|webp)$/i.test(card.image.split('?')[0])">
                                                        <img :src="BASE_URL + card.image" alt="gallery" class="albumsingleimg rounded" />
                                                    </template>
                                                    <template v-else-if="/\.(mp4|mov|avi|mkv|webm)$/i.test(card.image.split('?')[0])">
                                                        <video :src="BASE_URL + card.image" controls class="albumsingleimg rounded"></video>
                                                    </template>

                                                                        <!-- <img :src="BASE_URL + card.image" alt="gallery" class="albumsingleimg rounded" /> -->



                                                                    </v-card>
                                                                    <vue-easy-lightbox :visible="visibleRef"
                                                                        :moveDisabled="moveDisabled" :imgs="imgs"
                                                                        :index="indexRef" @hide="onHide" />
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-item>
                                                    </v-card>
                                                </v-dialog>
                                            </v-col>

                                        </v-row>
                                    </v-window-item>
                                    <v-window-item value="reviews">
                                        <v-row class="pa-2">
                                            <v-col v-if=" !reviewCard || reviewCard.length === 0">
                                                <v-card elevation="0" class="text-center mt-6 border" color="">
                                                <v-card-item class="mx-auto">
                                                    <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                    <h5 class="pt-2 text-error font-weight-semibold">Currently, there are no reviews available for this package!</h5>
                                                </v-card-item>
                                                </v-card>
                                            </v-col>

                                            <v-col v-if="reviewCard.length !== 0 " cols="12" md="12">
                                                <h2 class="mb-4 text-body-2 text-uppercase font-weight-bold text-secondary">
                                                    All Reviews</h2>
                                                    <v-card elevation="10" class="mb-4" v-for="item in reviewCard" :key="item.id">
                                                    <v-card-item class="d-flex pa-4">
                                                        <div>
                                                            <div class="d-flex align-center">
                                                                <v-avatar size="60" color="primary" variant="flat" rounded="sm">
                                                                    <img :src="item.coupleimgphoto" :alt="item.coupleName" width="60" />
                                                                </v-avatar>
                                                                <div class="ms-2">
                                                                    <v-rating half-increments v-model="item.rating" density="compact" color="warning" size="small"></v-rating>
                                                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary ms-1">
                                                                        {{ item.coupleName }}
                                                                    </h4>
                                                                    <p class="text-body-2 text-13 ms-1">
                                                                        {{ item.reviewppostedtime }}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="border-bottom">
                                                            <p class="text-body-1 mt-3 mb-6 text-13">
                                                                {{ item.reviewtext }}
                                                            </p>
                                                        </div>
                                                        <!--...................... DONT DELETE THIS............................. -->
                                                        <!-- <div class="d-flex align-center pt-3 ps-10">
                                                            <v-avatar rounded="md" size="50">
                                                                <img contain :src="userimg" height="50" />
                                                            </v-avatar>
                                                            <div class="pl-2">
                                                                <h5 class="text-subtitle-1 font-weight-medium mb-1">You</h5>
                                                                <h6 class="text-Darklight font-weight-medium mb-0 text-subtitle-1">
                                                                    Thankyou <strong>@deepak_sajwan</strong>
                                                                </h6>
                                                            </div>
                                                        </div> -->
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                    <!-- <v-window-item value="5555">
                                    <h2
                                        class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                        Frequently Asked
                                        Questions</h2>
                                    <v-row class="px-2 py-4">
                                        <v-col>
                                            <v-expansion-panels v-for="item in servicefaq" :key="item.question">
                                                <v-expansion-panel elevation="10" class="mb-2">
                                                    <v-expansion-panel-title
                                                        class="text-body-1 py-3 font-weight-bold text-secondary">{{
                                                            item.question
                                                        }}</v-expansion-panel-title>
                                                    <v-expansion-panel-text class="text-body-1 text-13 text-primary"> {{
                                                        item.answer
                                                        }}</v-expansion-panel-text>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                        </v-col>
                                    </v-row>
                                </v-window-item> -->
                                </v-window>
                            </v-card-text>
                        </div>
                    </v-col>
                    <!-- <v-col cols="12" md="4">
                        <v-card elevation="10" class="bg-primary stick-info-card ">
                            <v-card-item>
                                <h2 class="text-white text-center">
                                    Welcome
                                </h2>
                                <p class="text-subtitle-2 font-weight-medium text-white text-center">
                                    Secure Your Wedding
                                    Vendors for <br> a Picture-Perfect Day!</p>
                                <div class="mt-4 text-center">
                                    <div class="">
                                        <v-btn flat color="secondary" variant="outlined" class="mb-3" to="/login">
                                            <Message2Icon stroke-width="1.5" size="18" class="mr-2 " />Chat Vendor
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-dialog persistent class="dialog-mw" size="small">
                                            <template v-slot:activator="{ props }">
                                                <v-btn to="/login" v-bind="props" color="secondary" variant="flat">
                                                    <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                                    Send Enquiry
                                                </v-btn>
                                            </template>

                                        </v-dialog>
                                    </div>

                                </div>
                            </v-card-item>
                        </v-card>
                    </v-col> -->
                </v-row>


            </v-col>
        </v-row>
    </v-container>
    <div class="mt-5 bg-grey100 py-10">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 ">Similar
                        <span class="text-secondary">Packages</span>
                    </h3>
                    <p class="text-13 text-body-1 text-primary">Choosing the Perfect Decorators for Your
                        Wedding</p>
                </v-col>
                <v-col cols="12" class="position-relative">
                    <carousel ref="carouselfirstRef" :settings="vendorslideSettings"
                        :breakpoints="vendorslideBreakpoints" class="overflow-hidden slider-reset  pe-3">
                        <slide v-for="item in bookingData" :key="item.id" class="pt-2 pb-5 px-2">
                            <v-card @click="refreshPage" elevation="0" class="customer-card vendor-card-hover bg-grey100">
                                <v-card-item class="pa-4">
                                    
                                    <router-link :to="item.link">
                                        <div class="position-relative d-flex overflow-hidden">
                                            <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                            <v-avatar class="bg-lighterror wishlist-icon" size="28" @click="fucToggle">
                                                <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'"
                                                    class="mdi text-error"></i>
                                            </v-avatar>



                                            <v-chip rounded="sm"
                                                class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                                label>{{ item.serviceservice }}</v-chip>
                                        </div>
                                    </router-link>
                                    <div class="top-ctsection">
                                        <div class="mt-2 w-100">
                                           <div class="d-flex justify-space-between">
                                                <v-rating half-increments disabled v-model="item.ratings" density="compact" color="warning"
                                                    size="small"></v-rating>
                                                    <h4
                                                    class="text-subtitle-4 text-18  font-weight-bold textSecondary mt-1 text-start">
                                                    {{ item.vendorserviceprice }}</h4>
                                                
                                            </div>
                                            <h4 class="text-subtitle-1  font-weight-semibold textSecondary text-start text-ellipsis">
                                                {{ item.serviceprovidername }}</h4> 
                                        </div>
                                        <div class="text-start">



                                            <!-- <h6 class="text-body-2  mb-0 mt-3 font-weight-semibold"><span class="font-weight-medium">Deposit :</span> ${{ parseInt(parseFloat(item.vendorserviceprice) * (parseFloat(item.deposit)/100)) }} ({{item.deposit}}%)</h6> -->
                                            <p v-if="item.deposit">
                                                <h6 v-if="item.deposit" class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Deposit
                                                        :</span>$ {{ parseInt((item.deposit / 100) * parseFloat(item.vendorserviceprice.replace('$', ''))) }} 
                                                        ({{ item.deposit }}% of $ {{ item.vendorserviceprice }})
                                                        </h6>
                                            </p>
                                            <p v-else="item.full_price">
                                                <h6 v-if="item.full_price" class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Deposit
                                                            :</span>$ {{ parseInt(item.full_price) }} 
                                                            ({{ ((parseFloat(item.full_price) / parseFloat(item.vendorserviceprice.replace('$', ''))) * 100).toFixed(2) }}% of $ {{ item.vendorserviceprice }})
                                                        </h6>
                                            </p>
                                            
                                            <p v-if="item.states != ''">
                                                <h6 class="text-body-2  mb-0 font-weight-semibold"><span class="font-weight-medium">Location :</span> {{ item.states }}</h6>
                                            </p>
                                            <h6 class="text-body-2 text-13 mb-0 font-weight-semibold"><span
                                                class="font-weight-medium">Offered by :</span> {{item.vendorname }}
                                            </h6>
    
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </slide>
                    </carousel>
                    <div class="carousel-arrows ctm_crousel">
                        <button @click="prevfirstSlide" class="arrow-button prev">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                            fill="#b4801c"></path>
                                    </g>
                                </svg>
                            </span>
                        </button>
                        <button @click="nextfirstSlide" class="arrow-button next">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                            fill="#b4801c"></path>
                                    </g>
                                </svg>
                            </span>
                        </button>
                    </div>
                </v-col>
            </v-row>
           
        </v-container>
    </div>
        <div class=" py-10  website-vendor">
               <v-container>
                <v-row>
                    <v-col cols="12">
                        <h2 class="font_32 sailFont  ri-font-size-2 text-center text-sm-start">Featured<span
                                class="text-secondary"> Vendor</span></h2>
                                <p class="text-13 text-body-1 font-weight-medium">Meet our featured vendors, handpicked for their exceptional quality, creativity, and dedication to making your wedding day truly unforgettable.</p>
                                
                    </v-col>
                </v-row>
                <WebsiteVendor/>
               </v-container>
            </div>
    
    <Footer />
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";

.main-img-vendor {
    width: 100%;
    height: 400px;
    object-fit: cover;
}

.badge-service {
    position: absolute;
    right: 0px;
    top: 0px;
}
.ctm-save {
    background-color: #bd8f38 !important;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
}
.stickynavbar {
    position: relative;
    top: 0px;
    z-index: 1;
}
.bg-grey150{
    background-color: #f2eeef;
}
.stick-info-card {
    position: sticky;
    top: 80px;
    background: url(../../../assets/images/website/calltoaction.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.album-card-img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 150px;
    position: relative;
    overflow: hidden;
}

.album-card-img:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 37%, #000000fc 80%);
    left: 0;
    top: 0;
    opacity: 0.6;
}

.v-card-item {
    z-index: 1;
}

.albumsingleimg, .albumsingleimg video{
    width: 100%;
    height: 250px;
    object-fit: cover;
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
}

.vendor-card-background {
    min-height: 150px;
}

.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
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
.vc-day-content.vc-focus:focus-within {
    outline: 0;
    box-shadow: none;
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
.timeSlotScroll {
    max-height: 430px;
    overflow-y: auto;
}

.top-ctsection {
        background: #edf1f4;
    padding: 20px;
    margin-top: -49px;
    z-index: 999;
    margin: -44px 10px 0 10px;
    border-radius: 10px;
    position: relative;
    z-index: 1;
    box-shadow: 0px 0px 10px #00000012;
}
.vendorsc-section {
    z-index: -1;
}

.calendermain-style .calender {
    width: 100% !important;
}
.vc-weekday, .vc-day {
    padding: 12px !important;
}
.vc-highlight-content-bg-lighterror.vc-day-content[tabindex="0"]{
    background-color: rgb(235 235 235) !important;
    color: rgb(145 141 141) !important;
}
.ctm-save.ctm-single-save {
    bottom: 0 !important;
    top: auto;
}

</style>

