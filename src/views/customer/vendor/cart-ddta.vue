<script setup lang="ts">
import { ref } from 'vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios'
import notificationbell from '@/assets/images/website/notification-bell.png'
import { onMounted, computed } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'

// import VueDatePicker from '@vuepic/vue-datepicker';

const iscuouple = (localStorage.getItem('role')=='customer') ? true : false

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);

const package_id = ref('');
const location = ref([])

const cart_data = ref([]);

async function cart_listing() {
  try {
    const response = await axios.post('/home/cart_data');
    console.log('response cart_data--- ', response.data);
    if (response.data.status === 'Done') {
      fullpageloader.value = false;
      cart_data.value = response.data.cart_items.map(item => ({
        id: item.id,
        package_id : item.package.id,
        user: item.user.user,
        package: item.package.name,
        package_price: item.package.price,
        deposit: item.package.advance_payment,
        // location: item.package.states.state,
        location: item.package.states.map(state => state.state).join(', '),
        cart_status: item.status,
        created_at: item.created_at,
        lock_status : item.package.paid_status,
        
      }));
      if (cart_data.value.length > 0) {
        package_id.value = cart_data.value[0].package_id;
      }
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

cart_listing()





// async function package_status() {
//   try {
//     const response = await axios.post('/home/cart_data');
//     console.log(response.data, "Response received");
//     console.log(response.data.couple_package, "Response received couple_package");
//     console.log(response.data.couple_subscription, "Response received couple_subscription");
//     console.log(response.data.couple_onemonth, "Response received couple_onemonth");

//     if (response.data.status === 'Done') {
//       user_package.value = response.data.couple_package || null;
//       user_package_sub.value = response.data.couple_subscription || null;
//       user_package_onemonth.value = response.data.couple_onemonth || null;
//     }
//   } catch (error) {
//     console.error('Error fetching package status:', error);
//   }
// }

// package_status();






async function add_to_cart(packageId) {
  try {
    const formData = new FormData();
    formData.append("package_id", packageId);
    const response = await axios.post(`/home/add_cart_package`, formData, config);

    if (response.data.status === 'Removed') {
      showSuccessMessage.value = true;
      myerrors.value = 'Package removed from cart!';
      
      // Remove the package from the cart list locally
      cart_data.value = cart_data.value.filter(item => item.package_id !== packageId);

      setTimeout(() => { showSuccessMessage.value = false; }, 1000);
    }
  } catch (error) {
    fullpageloader.value = false;
    console.error("Error removing package from cart:", error);
  }
}



// async function add_to_cart(){
//     try{
//         const formData = new FormData();
//         formData.append("package_id", package_id.value);
//         const response = await axios.post(`/home/add_cart_package`, formData , config)
//        if (response.data.status == 'Removed') {
//             showSuccessMessage.value = true;
//             myerrors.value = 'Package removed from cart!';
//             setTimeout(() => { showSuccessMessage.value = false; }, 1000);
//         }
//     }catch (error) {
//         fullpageloader.value = false;
//         console.error("Error adding to cart:", error);
//     }
// }


const bookingdialog = ref(false);
const budget = ref('')
const initial_budget = ref()
const city = ref();
const state = ref();
const country = ref();
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])

const avldate = ref('')
const from_date = ref('')
const to_date = ref('')
const selectedDateBook = ref<string | null>(null);
const selectedTimes = ref<string[]>([]);
const path = window.location.pathname;
const parts = path.split('/');
const vendorSegment = parts[parts.length - 2];




// const action = ref('Single_servicePage')
// const serviceId = path.split('/').pop();
// const inCart = ref(false);
// const bookingData = ref([]);
// import serviceimg1 from "@/assets/images/website/decoration1.jpg";
// const reviewCard = ref([]);
// import user1 from "@/assets/images/profile/user-1.jpg";
// const onetime_price = ref('')
// const subscription_price = ref('')
// const onemonth_price = ref('')
// const onetime_description = ref('')
// const subscription_description = ref('')
// const onemonth_description = ref('')
// const couple_one_month_toggle = ref('')
// const couple_one_time_toggle = ref('')
// const couple_single_toggle = ref('')
// const user_package = ref()
// const user_package_sub = ref()
// const user_package_onemonth = ref()
// const timedcost = ref([])
// const package_paid = ref()
// const vendormainimg = ref('')
// const price_data = ref()
// const deadline_time = ref()
// const category = ref('')
// const business_name = ref('')
// const iratings = ref('')
// const cancel_policy = ref('')
// const remaining_booking = ref('')
// const pckg_intro = ref()
// const weblinks = ref([])
// const atbook = ref('')
// const d_per = ref('')
// import image1 from '@/assets/images/customer/decorator.jpeg';
// const galleryimages = ref([{ image: image1, },]);
// const vendorid = ref()
// const vendorname = ref('')
// const bookavail = ref(false)
// const productImages = ref([]);
// const chat_link = ref('')



// async function service_listing() {

// const formData = new FormData();
// formData.append("Single_servicePage", action);
// formData.append("serviceId", serviceId);
// formData.append("package_role", vendorSegment);
// fullpageloader.value   = true;

// const response = await axios.post(`/home/single_service`, formData, config);
// console.log(response.data, "hi responce")

// if (response.data.status == 'SAVED') {
//     inCart.value = response.data.in_cart;
// }

// if (response.data.status == 'SAVED') {
//     bookingData.value = response.data.similar_pkg.map((elem: any) => ({
//         "serviceservice": elem.category.name,
//         "vendorserviceimg": elem.package_logo === '/media/default.jpg' ? serviceimg1 : BASE_URL + elem.package_logo,
//         "serviceprovidername": elem.name,
//         "vendorserviceprice": '$' + elem.price,
//         "vendorname": `${elem.user.first_name} ${elem.user.last_name}`,
//         "deposit": elem.advance_payment,
//         "iratings": elem.iratings,
//         "location": elem.cities.map((a: any) => (a.city)).join(', '),
//         // "link": elem.vendor ? `/vendor-single/${elem.id ?? ''}` : `/vendor-single_admin/${elem.id ?? ''}`,
//         "open_link": `/vendor-single/${elem.id}`,
//         "full_price":elem.full_price
        

//     }));
//     fullpageloader.value=false;
// }

// if (response.data.status == 'SAVED') {
//     reviewCard.value = response.data.all_reviews.map((elem: any) => {
//         return {
//             "coupleimgphoto": (elem.user.profile_pic) ? BASE_URL + elem.user.profile_pic : user1,
//             "reviewtext": elem.comment,
//             "reviewppostedtime": '$' + elem.created_at,
//             "coupleName": `${elem.user.user.first_name} ${elem.user.user.last_name}`,
//             "rating": elem.rating, // Use this rating for each review item
//             "id": elem.id,
//         };
//     });
//     fullpageloader.value=false;
// }

// if (response.data.cpacks) {
//     onetime_price.value = response.data.cpacks['one_time_price']
//     subscription_price.value = response.data.cpacks['price']
//     onemonth_price.value  = response.data.cpacks['one_month_price']
//     onetime_description.value = response.data.cpacks['description']
//     subscription_description.value = response.data.cpacks['description2']
//     onemonth_description.value   = response.data.cpacks['description3']
//     couple_one_month_toggle.value = response.data.cpacks['couple_one_month_toggle']
//     couple_one_time_toggle.value = response.data.cpacks['couple_one_time_toggle']
//     couple_single_toggle.value = response.data.cpacks['couple_single_toggle']

// }

// if (response.data.couple_package) {
//     console.log('ddddddddddddddttttt---1-',response.data)
//     user_package.value = response.data.couple_package
// }
// if (response.data.couple_subscription) {
//     console.log('ddddddddddddddttttt---2-',response.data)
//     user_package_sub.value = response.data.couple_subscription
// }
// if (response.data.couple_onemonth) {
//     console.log('ddddddddddddddttttt--3--',response.data)
//     user_package_onemonth.value = response.data.couple_onemonth
// }



// if (response.data.data) {
//     const res: any = response.data.data
//     location.value = res.cities.map((a: any) => (a.city)).join(', ')
//     timedcost.value = res.timedcost
//     package_paid.value = res.paid_status
    

//     vendormainimg.value = BASE_URL + res.package_logo
//     price_data.value = res.price
//     deadline_time.value = res.deadline_time

    
//     category.value = res.category.name
//     business_name.value = res.name
//     iratings.value = res.iratings
//     cancel_policy.value = res.terms_and_conditions
//     pckg_intro.value = res.description
//     weblinks.value = res.weblinks.map((a:any)=>(a.url))
//     atbook.value = res.deposit_amount
//     d_per.value = res.advance_payment
//     galleryimages.value = response.data.serialized_albums.image_urls
//     package_id.value = res.id
//     vendorid.value = res.vendor ? res.vendor.id : null
//     vendorname.value = `${res.user.first_name} ${res.user.last_name}`
//     bookavail.value = res.user.is_active
//     remaining_booking.value = res.no_of_booking
//     productImages.value = response.data.serialized_albums
//     countryitem.value = response.data.countries
//     chat_link.value = response.data.march
//     from_date.value = response.data.from_date
//     to_date.value = response.data.to_date
//     budget.value = res.deposit_amount
//     initial_budget.value = res.advance_payment
//     superbookedSlots.value = (res.vendor) ? res.vendor.available : res.admin.available
//     superbookedSlots.value.forEach(function(a:any) {
//         let i = a.ondate.split('-')
//         if ( a.timings.length == 24 ){ attributesBook.value[1].dates.push(new Date(i[0], parseInt(i[1])-1, i[2])); }
//     });

//     fullpageloader.value=false;
// }


// }
// service_listing();












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



const errors = ref([]);
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

import { router } from '@/router';

const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'custom-tiptap-style',
        }
    },
    extensions: [StarterKit],
    content: ``
});

// function getEditorText(html=true) {
//     try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
//     catch (e) { console.log("got error in editor________________________", e); return '' }
// }

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


// async function makebooking() {
//     if (!(ivalidate())){return null}
//     try {
//         console.log(avldate.value,"avldateavldateavldateavldateavldateavldate")
//         const formData = new FormData();
//         formData.append("package_id", package_id.value);
//         formData.append("budget", budget.value);
//         formData.append('startDate', avldate.value[0]);
//         formData.append('endDate', avldate.value[1]);
//         formData.append('seldate', selectedDateBook.value);
//         formData.append('seltime', selectedTimes.value);
//         formData.append('booking_desc', getEditorText());
//         formData.append('country', country.value['value']);
//         formData.append('state', state.value['value']);
//         formData.append('city', city.value['value']);
//         formData.append("package_role", vendorSegment);



//         bookingdialog.value = false
//         fullpageloader.value = true
//         const response = await axios.post(`/home/makebooking`, formData, config);
//         if (response.data.status == 'SAVED') {

//             showSuccessMessage.value = true;
//             myerrors.value = 'Booking request has been send sucessfully!';
//             fullpageloader.value = false;

//             if (vendorSegment == 'vendor-single_admin') { setTimeout(() => { router.push(`/booking-single-admin/${response.data.bid}`) }, 3000); }
//             else { setTimeout(() => { router.push(`/booking-single/${response.data.bid}`) }, 3000); }

//         }
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }




async function makebooking() {
    // if (!ivalidate()) { return null; }

    try {
        console.log(avldate.value, "avldateavldateavldateavldateavldateavldate");

        bookingdialog.value = false;
        fullpageloader.value = true;
        let allResponses = [];

        for (const item of cart_data.value) {
            const formData = new FormData();
            formData.append("package_id", item.package_id);
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

            const response = await axios.post(`/home/makebooking`, formData, config);
            allResponses.push(response.data);
        }

        fullpageloader.value = false;

        // Check if all bookings were successful
        if (allResponses.every(res => res.status === 'SAVED')) {
            showSuccessMessage.value = true;
            myerrors.value = 'All booking requests have been sent successfully!';
            
            setTimeout(() => {
                router.push(vendorSegment === 'vendor-single_admin' 
                    ? `/booking-single-admin/${allResponses[0].bid}` 
                    : `/booking-single/${allResponses[0].bid}`
                );
            }, 3000);
        } else {
            myerrors.value = 'Some bookings may have failed. Please check.';
        }

    } catch (error) {
        console.error("Error while making bookings:", error);
        fullpageloader.value = false;
    }
}









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





const reqrules   = ref([(v: string) => !!v || 'This field is required']);
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




const timeSlotMain = ref(false)
const no_dates = ref('Select any date to see time slots')
const bookedSlots = ref([]);

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

const superbookedSlots = ref([])


interface Day {
    date: string;
}

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


const timeAvailable = (date: string): boolean => {
    console.log("level_timeAvailable")
    // Here you can define the logic to determine if the time slots are available for a given date
    // For simplicity, this example assumes all available dates have available time slots
    return availableDates.value.includes(date);
};

const handleTimeClick = (time: { time: string }) => {
    console.log("level_handleTimeClick")
    // Handle time click if needed
};



let currentDateTimeSlots = ref<string[]>(generateTimeSlots());



const isBooked = (time: string) => {
    // console.log("bookedSlots______________", bookedSlots.value)
    return bookedSlots.value.includes(time);
};

const updateEvent = (time: string) => {
    // Placeholder function to demonstrate where to handle the event logic
    console.log("Selected data: ", selectedDateBook.value, selectedTimes.value);
};




</script>

<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
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
    
    <div class="package-list">
        <h2>Cart Packages</h2>
        <p>Our Add to Cart Packages</p>
        <div v-for="item in cart_data" :key="item.id" class="package-card">

<!-- 
            <h3 v-if="item.lock_status === true && item.payment_status === 'Pending'">
                Package is locked
            </h3> -->


            <!-- <p v-if="item.lock_status == true"> Package is locked</p> -->
            <h3>{{ item.package }}</h3>
            <p><strong>Price:</strong> ${{ item.package_price }}</p>
            <p><strong>Deposit:</strong> ${{ item.deposit }}</p>
            <p><strong>Location:</strong> {{ item.location }}</p>
            <!-- <p><strong>Offered by:</strong> {{ item.vendor }}</p> -->
            <tr>
            <td style="padding: 0; text-wrap-mode: nowrap;">
                <b>Offered by:</b>
            </td>
            <td style="padding: 0;">Engaged
                celebration
            </td>
            </tr>
            <p><strong>Status:</strong> {{ item.cart_status }}</p>
            <p><strong>Created At:</strong> {{ new Date(item.created_at).toLocaleString() }}</p>

            <tr>
                <td style="padding: 0;">
                    <router-link
                        :to="`/vendor-single/${item.package_id}`"
                        style="text-decoration: none;">
                        <v-btn color="primary" variant="flat"
                            class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                            Book Single
                        </v-btn>
                    </router-link>
                </td>

                <td style="padding: 0;">
                    <router-link
                        :to="`/vendor-single/${item.package_id}`"
                        style="text-decoration: none;">
                        <v-btn color="primary" variant="flat"
                            class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                            View Package
                        </v-btn>
                    </router-link>
                </td>
                    <v-btn 
                    color="primary" 
                    variant="flat" 
                    @click="add_to_cart(item.package_id)" 
                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                    Remove from Cart
                    </v-btn>

            </tr>
        </div>


            <div >
                <v-dialog v-model="bookingdialog" persistent class="dialog-mw bookingModalStyle" size="small">
                <template v-slot:activator="{ props }" v-if="iscuouple">
                    <v-btn v-bind="props" color="secondary" variant="flat" size="large" class="mt-3" >
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
                            <!-- <span class="text-error text-body-1 mt-1" v-if="errors.length > 0">
                            {{ errors[errors.length - 1] }}
                            </span> -->
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
        </div>

        
    </div>

   </v-row>
</template>
<style>
.package-list {
  margin: 20px;
}

.package-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  background: #f9f9f9;
}

.package-card h3 {
  margin-bottom: 5px;
  color: #333;
}


</style>