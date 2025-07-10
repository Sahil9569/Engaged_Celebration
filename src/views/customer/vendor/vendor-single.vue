<script setup lang="ts">
import { ref, computed, watch  } from 'vue';
import { Calendar } from '@progress/kendo-vue-dateinputs';
import { Carousel, Slide } from "vue3-carousel";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import userimg from "@/assets/images/profile/defaultuserimg.png";
const iscuouple = (localStorage.getItem('role')=='customer') ? true : false

import { useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

const route = useRoute();
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);


const selectedDate = ref([]);

const ratingreview = ref('1');
const tab4 = ref(null);
const dialog = ref(false);
const dialogreview = ref(false);
const dialogenquiry = ref(false);
const bookingdialog = ref(false);
const bookingdialogs= ref(false);
const availability = ref(false);
import image1 from '@/assets/images/customer/decorator.jpeg';
import image3 from '@/assets/images/customer/catering.jpg';
import image4 from '@/assets/images/customer/catering2.jpg';
import image5 from '@/assets/images/customer/decorator.jpeg';
import image6 from '@/assets/images/customer/destination.webp';
import image7 from '@/assets/images/customer/makeUp.png';
import image8 from '@/assets/images/customer/djs.jpg';
import image9 from '@/assets/images/customer/photography.webp';


import user1 from "@/assets/images/profile/user-1.jpg";


//Fancybox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgs = ref([]);
const showImg = (index: number) => {
    imgs.value = imageList.map(img => BASE_URL + img.image); // Assign images dynamically
    indexRef.value = index;
    visibleRef.value = true;
}

const onHide = () => visibleRef.value = false;
const moveDisabled = ref(true);


/*--Booking table data --*/
import serviceimg1 from "@/assets/images/website/decoration1.jpg";

const bookingData = ref([
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

const allgallimages = ref([{ image: image1, },]);
const album = ref([{ albumimg: image1, albumtitle: "mumbai", images: [] },]);
const vid = ref(route.params.id)
const reqrules   = ref([(v: string) => !!v || 'This field is required']);
const vendormainimg = ref('')
const location = ref([])
const timedcost = ref([])
const package_paid = ref()
const vendorid = ref()
const vendorname = ref('')
const bookavail = ref(false)
const prov_services = ref()
const business_name = ref('')
const iratings = ref('')
const cancel_policy = ref('')
const remaining_booking = ref('')

const pckg_intro = ref()
const weblinks = ref([])
const price_data = ref()
const deadline_time = ref()

const category = ref('')
const lockDialog = ref(false)
const reportDialog = ref(false)
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

const parts = path.split('/');
const vendorSegment = parts[parts.length - 2];
const atbook = ref('')
const package_id = ref('')
const chat_link = ref('')
const d_per = ref('')
const avldate = ref('')
const from_date = ref('')
const to_date = ref('')



const onetime_price = ref('')
const subscription_price = ref('')
const onemonth_price = ref('')
const onetime_description = ref('')
const subscription_description = ref('')
const onemonth_description = ref('')
const couple_one_month_toggle = ref('')
const couple_one_time_toggle = ref('')
const couple_single_toggle = ref('')



const rating = ref(3);
const reviewCard = ref([]);
const fullpageloader = ref(false)
const subRadioChange = ref('couple_subscription')


const user_package = ref()
const user_package_sub = ref()
const user_package_onemonth = ref()


const inCart = ref(false);

async function service_listing() {
    
    const formData = new FormData();
    formData.append("Single_servicePage", action);
    formData.append("serviceId", serviceId);
    formData.append("package_role", vendorSegment);
    fullpageloader.value   = true;
    
    const response = await axios.post(`/home/single_service`, formData, config);
    console.log(response.data, "hi responce")
  
    if (response.data.status == 'SAVED') {
        inCart.value = response.data.in_cart;
    }

    if (response.data.status == 'SAVED') {
        bookingData.value = response.data.similar_pkg.map((elem: any) => ({
            "serviceservice": elem.category.name,
            "vendorserviceimg": elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + elem.package_logo,
            "serviceprovidername": elem.name,
            "vendorserviceprice": '$' + elem.price,
            "vendorname": `${elem.user.first_name} ${elem.user.last_name}`,
            "deposit": elem.advance_payment,
            "iratings": elem.iratings,
            "location": elem.cities.map((a: any) => (a.city)).join(', '),
            // "link": elem.vendor ? `/vendor-single/${elem.id ?? ''}` : `/vendor-single_admin/${elem.id ?? ''}`,
            "open_link": `/vendor-single/${elem.id}`,
            "full_price":elem.full_price
            

        }));
        fullpageloader.value=false;
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
        fullpageloader.value=false;
    }

    if (response.data.cpacks) {
        onetime_price.value = response.data.cpacks['one_time_price']
        subscription_price.value = response.data.cpacks['price']
        onemonth_price.value  = response.data.cpacks['one_month_price']
        onetime_description.value = response.data.cpacks['description']
        subscription_description.value = response.data.cpacks['description2']
        onemonth_description.value   = response.data.cpacks['description3']
        couple_one_month_toggle.value = response.data.cpacks['couple_one_month_toggle']
        couple_one_time_toggle.value = response.data.cpacks['couple_one_time_toggle']
        couple_single_toggle.value = response.data.cpacks['couple_single_toggle']

    }

    if (response.data.couple_package) {
        console.log('ddddddddddddddttttt---1-',response.data)
        user_package.value = response.data.couple_package
    }
    if (response.data.couple_subscription) {
        console.log('ddddddddddddddttttt---2-',response.data)
        user_package_sub.value = response.data.couple_subscription
    }
    if (response.data.couple_onemonth) {
        console.log('ddddddddddddddttttt--3--',response.data)
        user_package_onemonth.value = response.data.couple_onemonth
    }


    if (response.data.data) {
        const res: any = response.data.data
        location.value = res.cities.map((a: any) => (a.city)).join(', ')
        timedcost.value = res.timedcost
        package_paid.value = res.paid_status
        

        vendormainimg.value = BASE_URL + res.package_logo
        price_data.value = res.price
        deadline_time.value = res.deadline_time

        
        category.value = res.category.name
        business_name.value = res.name
        iratings.value = res.iratings
        cancel_policy.value = res.terms_and_conditions
        pckg_intro.value = res.description
        weblinks.value = res.weblinks.map((a:any)=>(a.url))
        atbook.value = res.deposit_amount
        d_per.value = res.advance_payment
        galleryimages.value = response.data.serialized_albums.image_urls
        package_id.value = res.id
        vendorid.value = res.vendor ? res.vendor.id : null
        vendorname.value = `${res.user.first_name} ${res.user.last_name}`
        bookavail.value = res.user.is_active
        remaining_booking.value = res.no_of_booking
        productImages.value = response.data.serialized_albums
        countryitem.value = response.data.countries
        chat_link.value = response.data.march
        from_date.value = response.data.from_date
        to_date.value = response.data.to_date
        budget.value = res.deposit_amount
        initial_budget.value = res.advance_payment
        superbookedSlots.value = (res.vendor) ? res.vendor.available : res.admin.available
        superbookedSlots.value.forEach(function(a:any) {
            let i = a.ondate.split('-')
            if ( a.timings.length == 24 ){ attributesBook.value[1].dates.push(new Date(i[0], parseInt(i[1])-1, i[2])); }
        });

        fullpageloader.value=false;
    }
    

}
service_listing();



const budget = ref('')
const initial_budget = ref()
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
        // zipcodeitem.value   = iuser.city.zipcode.map((a:any)=>(a.code))
        
        // f_name.value    =   iuser.user.first_name
        // l_name.value    =   iuser.user.last_name
        // u_email.value   =   iuser.user.email
        // u_phone.value   =   iuser.phone
        // zipcode.value   =   iuser.zipcode.code
        city.value      =   { text: iuser.city.city, value: iuser.city.id }
        state.value     =   { text: iuser.state.state, value: iuser.state.id }
        country.value   =   { text: iuser.country.country, value: iuser.country.id }
        fullpageloader.value = false
    }
})();

function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}




async function add_to_cart(){
    try{
        const formData = new FormData();
        formData.append("package_id", package_id.value);
        formData.append("single_package_ids", "single_package_ids");
        formData.append('seldate', selectedDateBook.value);
        formData.append('seltime', selectedTimes.value);
        bookingdialogs.value = false
        const response = await axios.post(`/home/add_cart_package`, formData , config)
        if (response.data.status == 'Done'){
            showSuccessMessage.value = true;
            myerrors.value = 'Package sucessfully added to wishlist!';
            inCart.value = true;
            setTimeout(() => {showSuccessMessage.value = false;
             }, 5000);
             window.location.reload();
    }else if (response.data.status == 'Removed') {
            showSuccessMessage.value = true;
            myerrors.value = 'Package removed from wishlist!';
            inCart.value = false;
            
            setTimeout(() => { showSuccessMessage.value = false;
             }, 5000);
             window.location.reload();
        }
    }catch (error) {
        fullpageloader.value = false;
        console.error("Error adding to cart:", error);
    }
}




async function makebooking() {
    if (!(ivalidate())){return null}
    try {
        console.log(avldate.value,"avldateavldateavldateavldateavldateavldate")
        const formData = new FormData();
        formData.append("package_id", package_id.value);
        formData.append("budget", budget.value);
        formData.append('startDate', avldate.value[0]);
        formData.append('endDate', avldate.value[1]);
        formData.append('seldate', selectedDateBook.value);
        formData.append('seltime', selectedTimes.value);
        formData.append('booking_desc', getEditorText());
        formData.append('country', country.value['value']);
        formData.append('state', state.value['value']);
        formData.append('city', city.value['value']);
        formData.append("package_role", vendorSegment);
        bookingdialog.value = false
        bookingdialogs.value = false
        fullpageloader.value = true
        const response = await axios.post(`/home/makebooking`, formData, config);
        if (response.data.status == 'SAVED') {

            showSuccessMessage.value = true;
            myerrors.value = 'Booking request has been send sucessfully!';
            fullpageloader.value = false;

            if (vendorSegment == 'vendor-single_admin') { setTimeout(() => { router.push(`/booking-single-admin/${response.data.bid}`) }, 3000); }
            else { setTimeout(() => { router.push(`/booking-single/${response.data.bid}`) }, 3000); }

        }
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
function redirectToService() {
    setTimeout(() => {
        window.location.reload();
    }, 500); // 2000 milliseconds = 2 seconds
}


// const format = (date) => {
//   if (Array.isArray(date)) {
//     const startDate = formatSingleDate(date[0]);
//     const endDate = formatSingleDate(date[1]);
//     return `${startDate} to ${endDate}`;
//   } else {
//     return formatSingleDate(date);
//   }
// };

// const formatSingleDate = (date) => {
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };
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

const comment = ref('')
async function write_review() {
    try {
        console.log(avldate.value,"avldateavldateavldateavldateavldateavldate")
        const formData = new FormData();
        formData.append("package_id", package_id.value);
        formData.append("comment", comment.value);
        formData.append('rating', ratingreview.value);
        
        dialogreview.value = false
        fullpageloader.value = true
        const response = await axios.post(`/home/write_review`, formData, config);

        if (response.data.status == 'SAVED') {
            showSuccessMessage.value = true;
            myerrors.value = 'review published sucessfully!';
            setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            fullpageloader.value = false;
            ratingreview.value = 0
            comment.value=''
            service_listing()
            
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

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
  
    // rslt = ( budget.value && selectedDateBook.value && selectedTimes.value.length && country.value && state.value && city.value && getEditorText(false) )
    rslt = ( budget.value && selectedDateBook.value && selectedTimes.value.length && country.value && state.value && city.value)
  
    if (!(rslt)){
        showErrorMessage.value = true;
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
}




async function booking_payment() {
  try {
    const formData = new FormData();
    formData.append("action",subRadioChange.value);
    formData.append("package",package_id.value);
    const response = await axios.post(`/home/couple_booking_payment`, formData, config);
    if (response.data.status == 'SAVED') {
        console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
        window.location.href=response.data.s_url;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


const userFeedback = ref('')


async function report_package() {
  try {
    if (!userFeedback.value) {
        showErrorMessage.value = true;
        myerrors.value = 'Please provide a reason before submitting.';
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
        return;
        }




    fullpageloader.value=true;
    const formData = new FormData();
    formData.append("userFeedback",userFeedback.value);
    formData.append("package",package_id.value);
    const response = await axios.post(`/home/report_package`, formData, config);
    if (response.data.status == 'SENT') {
        console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
        showSuccessMessage.value = true;
        myerrors.value = 'Report send sucessfully!';
        setTimeout(() => { showSuccessMessage.value = false; }, 3000);
        fullpageloader.value = false;
        lockDialog.value=false;
        reportDialog.value=false;
        window.location.reload();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const goBack = () => {
  window.history.back();
};
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
        <div class="d-flex justify-start">
                <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
            </div>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" :md="((iscuouple && bookavail) ? 8 : 12)">
                    <div class="position-relative">
                        <img :src="vendormainimg" class="main-img-vendor rounded mb-2">
                        <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                            label>{{ category }}</v-chip>
                    </div>
                    <div class="d-flex flex-sm-row flex-column justify-space-between align-start">
                        <div class="order-sm-1 order-2">
                            <v-rating half-increments v-model="iratings" density="compact" color="warning" size="small"></v-rating>
                            <h2 class="text-no-wrap font-weight-semibold textSecondary">{{ business_name }} </h2>

                            <h6 v-if="vendorid"
                                class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                <span class="font-weight-semibold">Vendor: </span> <router-link
                                    class="text-dark text-decoration-none text-capitalize"
                                    :to="`/vendor-profile/${vendorid}`">{{ vendorname }}<strong v-if="!(bookavail)">  (Unavailable)</strong></router-link>
                            </h6>

                            <h6
                                class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                <span class="font-weight-semibold">Deposit : </span> $ {{ atbook }} ({{ d_per }}% of ${{ price_data }})
                            </h6>
                            <h6
                                class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                <span class="font-weight-semibold">Location : </span> {{ location }}
                            </h6>
                            <h6 v-if="timedcost != 'undefined'"
                                class="text-subtitle-1 font-weight-medium text-no-wrap textSecondary mt-1 d-flex align-center">
                                <span class="font-weight-semibold">Time duration : </span> {{ timedcost }}
                            </h6>

                            <div class="d-flex gap-2" >
                                <div v-if="package_paid && (user_package == '' && user_package_sub == '' && user_package_onemonth == '' )">
                                    <v-btn  color="secondary" variant="flat" @click="lockDialog = true" size="large" class="mt-3">
                                    <LockIcon stroke-width="2" size="20" class="mr-1" />
                                     Book Now
                                    </v-btn>
                                    <v-dialog v-model="lockDialog" persistent class=" bookingModalStyle" size="small" style="max-width:960px;">
                                    <v-card class="pa-6">
                                        <div class="d-flex justify-space-between">
                                            <h4
                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                Unlock Booking</h4>
                                            <v-btn icon color="" @click="lockDialog = false" flat variant="outlined"
                                                size="x-small" class="bg-error">
                                                <XIcon width="20" />
                                            </v-btn>
                                        </div>
                                        <v-radio-group  v-model="subRadioChange" inline class="mb-4 mt-4">
                                            <v-row>
                                                
                                                <v-col cols="12" md="4" v-if="couple_one_month_toggle">
                                                    <v-card elevation="10" class="border border bg-grey200 position-relative">
                                                        <v-card-item class="pa-2 py-4"> 
                                                            
                                                            <label for="labelOne" class="radioCircleColor custom-label d-flex align-start">
                                                                <v-radio class="radioClick" id="labelOne" name="radioChange" color="primary" value="couple_subscription"></v-radio>
                                                                <div class="mt-2">
                                                                    <div class="">
                                                                        <h2 class="text-h6 font-weight-semibold mb-1">
                                                                            Monthly Subscription</h2>
                                                                        <h3 class="text-h5 text-theme" style="    background-color: #b4801c;padding: 5px 10px;color: #fff;display: inline-flex;border-radius: 5px;">${{ subscription_price }}</h3>
                                                                    </div>
                                                                    <p v-if="subscription_description" class="text-body-2 font-weight-medium">{{subscription_description}}
                                                                    </p>
                                                                    <p v-else class="text-body-2 font-weight-medium">Option for a monthly subscription that automatically deducts a fee from your account, perfect for those who prefer a regular, ongoing payment plan. Enjoy unlimited bookings across all packages.
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4" v-if="couple_one_time_toggle">
                                                    <v-card elevation="10" class="border border bg-grey200 position-relative">
                                                        <v-card-item class="pa-2 py-4"> 
                                                            
                                                           
                                                            <label for="labelTwo" class=" radioCircleColor custom-label d-flex align-start">
                                                                <v-radio class="radioClick" id="labelTwo" name="radioChange" color="primary" value="couple_onemonth_payment"></v-radio>
                                                                <div class="mt-2">
                                                                    <div class="">
                                                                        <h2 class="text-h6 font-weight-semibold mb-1">
                                                                        One Time Payment</h2>
                                                                        <h3 class="text-h5 text-theme"  style="    background-color: #b4801c;padding: 5px 10px;color: #fff;display: inline-flex;border-radius: 5px;">${{ onemonth_price }}</h3>
                                                                    </div>
    
                                                                    
                                                                    <p v-if="onemonth_description" class="text-body-2 font-weight-medium mt-1"> {{onemonth_description}}
                                                                    </p>
    
                                                                    <p v-else class="text-body-2 font-weight-medium mt-1"> Make a single payment to unlock access to all the package’s bookings.
                                                                    30 days of unlimited access to all packages unlocked!.Enjoy exclusive deals and hassle-free bookings today!
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4" v-if="couple_single_toggle">
                                                    <v-card elevation="10" class="border border bg-grey200 position-relative">
                                                        <v-card-item class="pa-2 py-4"> 
                                                            
                                                           
                                                            <label for="labelTwo" class=" radioCircleColor custom-label d-flex align-start">
                                                                <v-radio class="radioClick" id="labelTwo" name="radioChange" color="primary" value="Single_Package_Payment"></v-radio>
                                                                <div class="mt-2">
                                                                    <div class="">
                                                                        <h2 class="text-h6 font-weight-semibold mb-1">
                                                                        Single Package Payment</h2>
                                                                        <h3 class="text-h5 text-theme"  style="    background-color: #b4801c;padding: 5px 10px;color: #fff;display: inline-flex;border-radius: 5px;">${{ onetime_price }}</h3>
                                                                    </div>
    
                                                                    
                                                                    <p v-if="onetime_description" class="text-body-2 font-weight-medium mt-1"> {{onetime_description}}
                                                                    </p>
    
                                                                    <p v-else class="text-body-2 font-weight-medium mt-1"> Make a single payment to unlock access to this package’s bookings. This option provides access solely to this selected package without any recurring commitment.
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </v-card-item>
                                                    </v-card>
                                                </v-col>
                                                
                                            </v-row>
                                            <div v-if="!couple_one_month_toggle && !couple_one_time_toggle && !couple_single_toggle" class="text-center my-4">
                                            <p class="text-h6 font-weight-medium text-secondary">Currently, this package is not available for booking. Please try again later or explore other available services or locations. We appreciate your patience!</p>
                                        </div>
    
                                        </v-radio-group>
                                        <!-- <v-card-action class="text-end border-top">
                                            <v-btn class="bg-secondary" @click="booking_payment()" text flat>Pay & Unlock</v-btn>
                                        </v-card-action> -->
                                        <v-card-action v-if="couple_one_month_toggle || couple_one_time_toggle || couple_single_toggle" class="text-end border-top">
                                            <v-btn class="bg-secondary" @click="booking_payment()" text flat>Pay & Unlock</v-btn>
                                        </v-card-action>
    
                                    </v-card>
                                     </v-dialog>
                                </div>
                                <div v-else>
                                     <v-dialog v-model="bookingdialog" persistent class="dialog-mw bookingModalStyle" size="small" v-if="bookavail">
                                        <template v-slot:activator="{ props }" v-if="iscuouple">
                                            <v-btn v-bind="props" color="secondary" variant="flat" size="large" class="mt-3 me-2" >
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
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
                                                                <v-row>
                                                                    <v-col cols="col">
                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select Event Date<span class="text-error ma-1">*</span></v-label>
                                                                        <VCalendar class="calender" :attributes="attributesBook"
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
                                <v-dialog v-model="bookingdialogs" persistent class="dialog-mw bookingModalStyle" size="small" v-if="bookavail">
                                        <template v-slot:activator="{ props }" v-if="iscuouple">
                                            <!-- <v-btn v-bind="props" color="secondary" variant="flat" size="large" class="mt-3" >
                                                <CalendarIcon stroke-width="2" size="20" class="mr-1" /> 
                                                Add to cart
                                            </v-btn> -->
                                             
                               <v-btn v-if="!inCart" color="secondary"  variant="flat" size="large" v-bind="props"
                               class="mt-3">Add to wishlist</v-btn>
                               <v-btn v-else color="secondary" variant="flat" @click="add_to_cart" size="large" 
                               class="mt-3">Remove from wishlist</v-btn>
                                        </template>
                                        <v-card class="pa-6">
                                            <div class="d-flex justify-space-between">
                                                <h4
                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                    Book Now</h4>
                                                <v-btn icon color="" @click="bookingdialogs = false" flat variant="outlined"
                                                    size="x-small" class="bg-error">
                                                    <XIcon width="20" />
                                                </v-btn>
                                            </div>
                                            <v-row>
                                                
                                                <v-col cols="12">
                                                    <div class="calendermain-style">
                                                        <v-row>
                                                            <v-col cols="12" md="7" >
                                                                <v-row>
                                                                    <v-col cols="col">
                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select Event Date<span class="text-error ma-1">*</span></v-label>
                                                                        <VCalendar class="calender" :attributes="attributesBook"
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
                                                @click="add_to_cart" text flat >
                                                Add to wishlist
                                                </v-btn>
                                                
                                        </v-card>
                                        </v-dialog>
                                </div>

                                <v-btn color="secondary" variant="flat" @click="reportDialog = true" size="large" class="mt-3">
                                    <InfoCircleIcon stroke-width="2" size="20" class="mr-1" />
                                    Report
                                </v-btn>
                                <v-dialog v-model="reportDialog" persistent class="bookingModalStyle" size="small" style="max-width:960px;">
                                    <v-card class="pa-6">
                                        <div class="d-flex justify-space-between">
                                            <h4 class="text-subtitle-3 mb-2 text-no-wrap font-weight-semibold textSecondary">
                                                Report this Package
                                            </h4>
                                            <v-btn icon color="" @click="reportDialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                                <XIcon width="20" />
                                            </v-btn>
                                        </div>
                                        <div class="mt-4">
                                            <v-textarea
                                                v-model="userFeedback"
                                                label="Reason"
                                                placeholder="Please provide the reason or additional information here..."
                                                rows="4"
                                                outlined
                                                dense
                                                hide-details
                                            ></v-textarea>
                                        </div>
                                        <v-card-actions class="text-end border-top mt-4 pa-0 d-flex justify-end">
                                            <v-btn class="bg-secondary" @click="report_package()" text flat>
                                                Submit
                                            </v-btn>
                                            
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                               
                            </div> 

                            <!-- availability  -->
                            <v-dialog v-model="availability" persistent class="dialog-mw" size="small">
                                <template v-slot:activator="{ props }">
                                    <!-- <v-btn v-bind="props" color="secondary" variant="flat" size="small"
                                        class="mt-3 ms-2">
                                        <ClockIcon stroke-width="1.5" size="16" class="mr-1" />
                                        Availability
                                    </v-btn> -->
                                </template>
                                <v-card class="pa-6">
                                    <div class="d-flex justify-space-between">
                                        <h4
                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                            Booking Availability</h4>
                                        <v-btn icon color="" @click="availability = false" flat variant="outlined"
                                            size="x-small" class="bg-error">
                                            <XIcon width="20" />
                                        </v-btn>
                                    </div>
                                    <v-row>
                                        <v-col cols="12">
                                            <div class="d-flex mb-1 justify-end mt-2 me-2">
                                                <p
                                                    class="text-subtitle-2 text-no-wrap font-weight-semibold d-flex align-center text-success me-5">
                                                    <PointIcon /> Availabe Dates
                                                </p>
                                                <p
                                                    class="text-subtitle-2 text-no-wrap font-weight-semibold d-flex align-center text-primary">
                                                    <PointIcon /> Booked Dates
                                                </p>
                                            </div>
                                            <VCalendar expanded :attributes="attributes" class="calendermain-style" />
                                        </v-col>
                                    </v-row>

                                    <!-- <v-card-actions class="px-0 pt-5">
                                        <v-spacer></v-spacer>
                                        <v-btn class="bg-error" text @click="availability = false" flat>
                                            Close
                                        </v-btn>
                                        <v-btn class="bg-secondary" text flat>
                                            Submit
                                        </v-btn>
                                    </v-card-actions> -->
                                </v-card>
                            </v-dialog>

                        </div>

                        <div class="pa-sm-4 mb-4 order-sm-2 order-1">
                            <h2 class="text-no-wrap font-weight-semibold textSecondary">${{ price_data }}</h2>
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
                                    <v-tab v-if="productImages.length" value="album" color="secondary">
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
                                    <h2 class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary"> Description </h2>
                                    

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
                                        <div v-html="cancel_policy" class="text-body-1 editorcodestyle" ></div> 
                                    </div>
                                </v-window-item>


                                <v-window-item value="album">
                                    <h2
                                        class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                        All Albums</h2>
                                    <v-row class="pa-2">
                                        <v-col cols="12" md="3" v-for="item in productImages" :key="item.id">
                                            <v-dialog v-model="dialog" fullscreen :scrim="false"
                                                transition="dialog-bottom-transition">
                                                <template v-slot:activator="{ props }">
                                                    <v-card elevation="10" v-bind="props"
                                                        class="album-card-img d-flex align-end"
                                                        :style="{ backgroundImage: `url(${BASE_URL + item.background_image})` }"
                                                        @click='galleryimages = item.image_urls'>
                                                        <v-card-item class="position-relative pa-3 w-100">
                                                            <h3
                                                                class="text-subtitle-1 text-no-wrap font-weight-semibold text-white text-capitalize">
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
                                                                <v-card elevation="10"
                                                                    class="card-hover overflow-hidden"
                                                                    @click="showImg(index, galleryimages)">

                                                                    <!-- <img :src="BASE_URL + card.image" alt="gallery"
                                                                        width="" class="albumsingleimg rounded" /> -->

                                                                        <template v-if="/\.(jpeg|jpg|png|gif|webp)$/i.test(card.image.split('?')[0])">
                                                                            <img :src="BASE_URL + card.image" alt="gallery" class="albumsingle rounded" />
                                                                        </template>
                                                                        <template v-else-if="/\.(mp4|mov|avi|mkv|webm)$/i.test(card.image.split('?')[0])">
                                                                            <video :src="BASE_URL + card.image" controls class="albumsingle rounded"></video>
                                                                        </template>

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
                                    <h2
                                        class="mb-4 text-body-2 text-uppercase border-bottom pb-2 font-weight-bold text-secondary">
                                        Post Reviews</h2>
                                    <v-row class="pa-2">
                                        <v-col cols="12">
                                            <v-card elevation="0 border-0 bg-lightprimary">
                                                <v-card-item class="pa-sm-6 pa-3">
                                                    <v-row class="">
                                                        <v-col cols="12" md="6">
                                                            <div class="v-card-title text-h1 text-secondary pa-0">{{parseFloat(iratings).toFixed(1)}}
                                                            </div>
                                                            <v-rating half-increments v-model="iratings" density="compact"
                                                                color="secondary" size="small" disabled></v-rating>
                                                            <div class="v-card-title text-h5 text-secondary pa-0">
                                                                Reveiws</div>

                                                        </v-col>
                                                        <v-col cols="12" md="6" class="d-flex justify-sm-end align-center ">
                                                            <v-dialog v-model="dialogreview" persistent class="dialog-mw" size="small" v-if="iscuouple">
                                                                <template v-slot:activator="{ props }">
                                                                    <v-btn v-bind="props" variant="flat"
                                                                        color="secondary">
                                                                        <PencilIcon stroke-width="2" size="18"
                                                                            class="mr-2" />
                                                                        Write Review
                                                                    </v-btn>
                                                                </template>
                                                                <v-card class="pa-6">
                                                                    <div class="d-flex justify-space-between">
                                                                        <h4
                                                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                            Rate and Review - {{ business_name }}</h4>
                                                                        <v-btn icon color=""
                                                                            @click="dialogreview = false" flat
                                                                            variant="outlined" size="x-small"
                                                                            class="bg-error">
                                                                            <XIcon width="20" />
                                                                        </v-btn>
                                                                    </div>
                                                                    <v-row>
                                                                        <v-col cols="12">
                                                                            <v-label
                                                                                class="font-weight-medium mb-2 text-secondary">Rating</v-label>
                                                                            <div>
                                                                                <v-rating v-model="ratingreview"
                                                                                    density="compact" color="warning"
                                                                                    size="large"></v-rating>
                                                                            </div>

                                                                        </v-col>
                                                                       
                                                                        <v-col cols="12">
                                                                            <v-label
                                                                                class="font-weight-medium mb-2 text-secondary">Review</v-label>
                                                                            <v-textarea v-model="comment" auto-grow variant="outlined"
                                                                                placeholder="Hi, Do you  have a review fot our service?"
                                                                                rows="3" color="secondary"
                                                                                row-height="25" shaped hide-details>
                                                                                <template v-slot:prepend-inner>
                                                                                    <Message2Icon stroke-width="1.5"
                                                                                        size="22"
                                                                                        class="text-medium-emphasis mr-3" />
                                                                                </template>
                                                                            </v-textarea>
                                                                        </v-col>
                                                                       
                                                                    </v-row>
                                                                    <v-card-actions class="px-0 pt-5">
                                                                        <v-spacer></v-spacer>
                                                                        <v-btn class="bg-error" text
                                                                            @click="dialogreview = false" flat>
                                                                            Close
                                                                        </v-btn>
                                                                        <v-btn @click="write_review()" class="bg-secondary" text flat>
                                                                            Save
                                                                        </v-btn>
                                                                    </v-card-actions>
                                                                </v-card>
                                                            </v-dialog>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                      

                                        <v-col v-if="reviewCard.length !=='0'" cols="12" md="12">
                                            <h2 class="mb-4 text-body-2 text-uppercase font-weight-bold text-secondary">
                                                All Reviews</h2>
                                                <v-card elevation="10" class="mb-4" v-for="item in reviewCard" :key="item.id">
                                            <v-card-item class="d-flex pa-4">
                                                    <div>
                                                        <div class="d-md-flex d-block align-center">
                                                            <v-avatar size="60" color="primary" variant="flat" rounded="sm">
                                                                <img :src="item.coupleimgphoto" :alt="item.coupleName" width="60" />
                                                            </v-avatar>
                                                            <div class="ms-md-2 mt-md-0 mt-3">
                                                                <!-- <v-rating half-increments v-model="item.rating" density="compact" color="warning" size="small"></v-rating> -->
                                                                <v-rating half-increments disabled v-model="item.rating" density="compact" color="warning" size="small"></v-rating>

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
                <v-col cols="12" md="4" v-if="iscuouple && bookavail">
                    <v-card elevation="10" class="bg-primary stick-info-card ">
                        <v-card-item>
                            <h2 class="textSecondary text-center text-white">
                                Welcome
                            </h2>
                            <p
                                class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary text-center text-white">
                                Secure Your Wedding
                                Vendors for <br> a Picture-Perfect Day!</p>
                            <div class="mt-4 text-center">
                                <div class="">
                                    <v-btn flat color="secondary" variant="outlined" class="mb-3"
                                        :to="'/cchats?march=' + chat_link">
                                        <Message2Icon stroke-width="1.5" size="18" class="mr-2" />Chat
                                    </v-btn>
                                </div>
                                <div>
                                    <v-dialog v-model="dialogenquiry" persistent class="dialog-mw" size="small">
                                        <template v-slot:activator="{ props }">
                                            <!-- <v-btn v-bind="props" color="secondary" variant="flat">
                                                <SendIcon stroke-width="1.5" size="18" class="mr-2" />
                                                Send Enquiry 
                                            </v-btn> -->
                                        </template>
                                        <v-card class="pa-6">
                                            <div class="d-flex justify-space-between">
                                                <h4
                                                    class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                    Send Enquiry - Dewdrop Events</h4>
                                                <v-btn icon color="" @click="dialogenquiry = false" flat
                                                    variant="outlined" size="x-small" class="bg-error">
                                                    <XIcon width="20" />
                                                </v-btn>
                                            </div>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-label
                                                        class="font-weight-medium mb-2 text-secondary">Name</v-label>
                                                    <v-text-field color="secondary" variant="outlined" type="text"
                                                        placeholder="John Deo" hide-details>
                                                        <template v-slot:prepend-inner>
                                                            <UserIcon stroke-width="1.5" size="22"
                                                                class="text-medium-emphasis mr-3" />
                                                        </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-label
                                                        class="font-weight-medium mb-2 text-secondary">Email</v-label>
                                                    <v-text-field color="secondary" variant="outlined" type="text"
                                                        placeholder="johndeo123@gmail.com" hide-details>
                                                        <template v-slot:prepend-inner>
                                                            <MailIcon stroke-width="1.5" size="22"
                                                                class="text-medium-emphasis mr-3" />
                                                        </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-label
                                                        class="font-weight-medium mb-2 text-secondary">Message</v-label>
                                                    <v-textarea auto-grow variant="outlined"
                                                        placeholder="Hi, Do you  have a review fot our service?"
                                                        rows="3" color="secondary" row-height="25" shaped hide-details>
                                                        <template v-slot:prepend-inner>
                                                            <Message2Icon stroke-width="1.5" size="22"
                                                                class="text-medium-emphasis mr-3" />
                                                        </template>
                                                    </v-textarea>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions class="px-0 pt-5">
                                                <v-spacer></v-spacer>
                                                <v-btn class="bg-error" text @click="dialogenquiry = false" flat>
                                                    Close
                                                </v-btn>
                                                <v-btn class="bg-secondary" text flat>
                                                    Send Enquiry
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </div>

                            </div>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>


            <div v-if="bookingData.length" class="mt-5">
                <v-card elevation="10" class="border-0 bg-grey100">
                    <v-card-item>
                        <v-row class="py-6">
                            <v-col cols="12">
                                <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 ">Similar
                                    <span class="text-secondary">Packages</span>
                                </h3>
                                <p class="text-13 text-body-1 text-primary">Choosing the perfect Package for your
                                    Wedding</p>
                            </v-col>
                            <v-col cols="12" class="position-relative">
                                <carousel ref="carouselfirstRef" :settings="vendorslideSettings"
                                    :breakpoints="vendorslideBreakpoints" class="overflow-hidden slider-reset  pe-3">
                                    <slide v-for="item in bookingData" :key="item.id" class="pt-2 pb-5 px-2">
                                        <v-card elevation="10" class="vendor-card-hover">
                                            <v-card-item class="pa-4">
                                                <div class="position-relative d-flex overflow-hidden">
                                                    <router-link :to="item.open_link" class="d-flex w-100">
                                                        <img :src="item.vendorserviceimg" class="rounded vendormainimg">
                                                    </router-link>
                                                    <!-- <v-avatar class="bg-lighterror wishlist-icon" size="28"
                                                        @click="fucToggle">
                                                        <i :class="wishList == true ? 'mdi-heart-outline' : 'mdi-heart'"
                                                            class="mdi text-error"></i>
                                                    </v-avatar> -->
                                                    <v-chip rounded="sm"
                                                        class="ma-2 font-weight-semibold bg-secondary badge-service"
                                                        size="small" label>{{ item.serviceservice }}</v-chip>
                                                    <v-btn color="secondary" @click="redirectToService()" variant="flat"
                                                        :to="item.open_link" class="viewServiceBtn d-block py-1"
                                                        size="small">
                                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                                        View Service
                                                    </v-btn>
                                                </div>
                                                <div class="d-flex justify-space-between align-start mt-2">
                                                    <div class="text-start">
                                                        <v-rating half-increments v-model="item.iratings" density="compact" color="warning" size="small"></v-rating>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 v-if="item.vendorserviceprice"
                                                            class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1 text-start">
                                                            {{ item.vendorserviceprice }}</h4>
                                                    </div>
                                                </div>

                                                <!-- <div v-if="item.vendorname" class="text-start">
                                                    <h6 class="text-body-2 text-13 mb-0 mt-2"><span
                                                            class="font-weight-semibold">Name :</span> {{
                                                        item.vendorname }}
                                                    </h6>
                                                </div> -->
                                                <router-link :to="item.open_link" class="text-dark text-decoration-none">
                                                    <h4
                                                        class="text-subtitle-1 text-ellipsis font-weight-semibold textSecondary text-start">
                                                        {{ item.serviceprovidername }}
                                                    </h4>
                                                </router-link>
                                                <!-- <div class="text-start">
                                                    <h6 class="text-body-2 text-13 mb-0 mt-2"><span
                                                            class="font-weight-semibold">Deposit :</span> $ {{ atbook }} ({{ d_per }}% of ${{ price_data }})
                                                    </h6>
                                                </div> -->
                                                <p v-if="item.deposit" class="text-start">
                                                    <h6 v-if="item.deposit" class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Deposit
                                                        :</span>$ {{ parseInt((item.deposit / 100) * parseFloat(item.vendorserviceprice.replace('$', ''))) }} 
                                                        ({{ item.deposit }}% of $ {{ item.vendorserviceprice }})
                                                        </h6>
                                                </p>
                                                <p v-else="item.full_price" class="text-start">
                                                    <h6 v-if="item.full_price" class="text-body-2 text-13 mb-0 mt-2"><span class="font-weight-semibold">Deposit
                                                            :</span>$ {{ parseInt(item.full_price) }} 
                                                            ({{ ((parseFloat(item.full_price) / parseFloat(item.vendorserviceprice.replace('$', ''))) * 100).toFixed(2) }}% of $ {{ item.vendorserviceprice }})
                                                        </h6>
                                                </p>

                                                <div v-if="item.location" class="text-start">
                                                    <h6 class="text-body-2 text-13 mb-0 mt-2"><span
                                                            class="font-weight-semibold">Location :</span> {{
                                                        item.location }}
                                                    </h6>
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
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                </g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                                        fill="#73add4"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                    <button @click="nextfirstSlide" class="arrow-button next">
                                        <span>
                                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                </g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                        fill="#73add4"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-item>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>
<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";
.radioCircleColor .v-selection-control__input > .v-icon.mdi-checkbox-blank-outline, 
.radioCircleColor .v-selection-control__input > .v-icon.mdi-radiobox-blank {
    color: rgb(180 128 28);
    opacity: 1;
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
.vc-highlight-content-bg-lighterror.vc-day-content[tabindex="0"]{
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
.calendermain-style .calender {
    width: 100% !important;
}
.vc-weekday, .vc-day {
    padding: 12px !important;
}
.timeSlotScroll {
    max-height: 430px;
    overflow-y: auto;
}

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

.stickynavbar {
    position: sticky;
    top: 65px;
    z-index: 1;
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

.albumsingleimg  .albumsingleimg video{
    width: 100%;
    height: 250px;
    object-fit: cover;
}
.albumsingle{
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

.vc-day-content[tabindex~="0"] {
    background: rgb(var(--v-theme-secondary)) !important;
    color: #fff !important;
}
[tabindex="0"].vc-highlight-content-bg-lighterror,
[tabindex="0"].vc-highlight-content-bg-lightsuccess  {
    border: none !important;
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
.dp__action_buttons .dp__action_select {
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

</style>
