<script setup lang="ts">
import { ref, onMounted ,computed } from 'vue';
import { Carousel, Slide } from "vue3-carousel";
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

const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

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
const bookingData = ref([]);
const menu = ref(false);
const radioStatus = ref('inprogress');

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
const offline_pay = ref(false);


// function getEditorText(html=true) {
//     try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
//     catch (e) { console.log("got error in editor________________________", e); return '' }
// }
const handleFileChange = (event) => {
      files.value = Array.from(event.target.files); // Correctly set files array
      console.log(files.value, "filesssssssssssss2");
    };

const package_name = ref('');
const msglink= ref("/login");
const pacakgeprice = ref('');
const additional_srvcs = ref('');
const advancepayment = ref('')

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
const click_accept = () => {
    dialog.value = true;
    singlebooking()

};

const c_stripe_dialog = ref(false)
const connect_stripe = () => {
    c_stripe_dialog.value = true;
};

if (path.includes('accept')) {
    click_accept();
}


if (path.includes('end_contract')) {
    menu.value = true;
}

if (path.includes('payment_request')) {
    availability.value = true;
}

if (path.includes('offline_payments')) {offline_pay.value = true;}


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
const final_deposit_amt = ref("");
const contract_type = ref()

const deposit_payemt_status= ref("");
const full_pay_status= ref("");
const remianing_status= ref("");
const remaining__amt = ref();


const wellet_dta = ref("");
wellet_dta.value = localStorage.getItem('well_pack');

async function singlebooking() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'vendor');
    formData.append("serviceId",serviceId);
    const response = await axios.post(`/home/single_booking`, formData, config);
    console.log(response.data,"hi responce all booking customer ")

    if (response.data.status == 'SAVED') {
        const res: any = response.data.booking_data
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
        srvc_bookingdate.value = res.seldate
        srvc_bookingtime.value = res.seltimes.join(', ');
        booking_status.value = res.status
        msglink.value = "/vchats?march=" + response.data.march
        if (res.city){srvc_location.value = res.city.city + ' , ' + res.state.state + ' , ' + res.country.country}
        srvc_terms.value = res.requirement
        advancepayment.value = res.package.advance_payment
        finaldeposit.value = res.package.advance_payment
        srvc_budget.value = res.budget
        link.value = res.package.id
        couple_name.value = res.couple.userprofile.user.first_name + ' ' + res.couple.userprofile.user.last_name
        couplename.value=res.couple.userprofile.user.first_name + ' ' + res.couple.userprofile.user.last_name
        couple_email.value = res.couple.userprofile.user.email
        couple_profile.value = (res.couple.userprofile.profile_pic) ? BASE_URL + res.couple.userprofile.profile_pic : user1
        couple_id.value=res.couple.id
        strp_status.value = (res.package.admin) ? res.package.admin.stripe_status : res.package.vendor.stripe_status
        package_owner_id.value= (res.package.admin) ? res.package.admin.id : res.package.vendor.id
        // wellet_dta.value = localStorage.getItem('well_pack');
    
       



    package_name.value=res.package.name
    pacakgeprice.value =res.package.price

    // BOOKING DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    countryitem.value       = response.data.countries
    const contract: any = response.data.contract_data

    console.log(contract,"contractcontractcontractcontract")


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
        contract_type.value=contract.contract_users


        retainer.value = contract.retainer && (contract.retainer !== 'null' && contract.retainer !== 'undefined') ? contract.retainer : '';


        retainer.value = contract.retainer && (contract.retainer !== 'null' && contract.retainer !== 'undefined') ? contract.retainer : '';

        contracted_services.value = contract.contracted && (contract.contracted !== 'null' && contract.contracted !== 'undefined') ? contract.contracted : '';
        expiration.value = contract.expiration && (contract.expiration !== 'null' && contract.expiration !== 'undefined') ? contract.expiration : '';
        documentation.value = contract.documentation && (contract.documentation !== 'null' && contract.documentation !== 'undefined') ? contract.documentation : '';
        hotel_accommodations.value = contract.hotel_accom && (contract.hotel_accom !== 'null' && contract.hotel_accom !== 'undefined') ? contract.hotel_accom : '';
        destination.value = contract.destination && (contract.destination !== 'null' && contract.destination !== 'undefined') ? contract.destination : '';
        cancellation_policy.value = contract.cancellation && (contract.cancellation !== 'null' && contract.cancellation !== 'undefined') ? contract.cancellation : '';
        postponement_policy.value = contract.postponement && (contract.postponement !== 'null' && contract.postponement !== 'undefined') ? contract.postponement : '';
        responsibility.value = contract.responsibility && (contract.responsibility !== 'null' && contract.responsibility !== 'undefined') ? contract.responsibility : '';
        overtime.value = contract.overtime && (contract.overtime !== 'null' && contract.overtime !== 'undefined') ? contract.overtime : '';
        attire.value = contract.attire && (contract.attire !== 'null' && contract.attire !== 'undefined') ? contract.attire : '';
        liability.value = contract.liability && (contract.liability !== 'null' && contract.liability !== 'undefined') ? contract.liability : '';
        contracted_vendor_payments.value = contract.contracted_payments && (contract.contracted_payments !== 'null' && contract.contracted_payments !== 'undefined') ? contract.contracted_payments : '';
        damage_loss_accessories.value = contract.damage && (contract.damage !== 'null' && contract.damage !== 'undefined') ? contract.damage : '';
        schedule_method.value = contract.schedule && (contract.schedule !== 'null' && contract.schedule !== 'undefined') ? contract.schedule : '';
        attorney.value = contract.attorney && (contract.attorney !== 'null' && contract.attorney !== 'undefined') ? contract.attorney : '';
        appropriate_conduct.value = contract.safe_working && (contract.safe_working !== 'null' && contract.safe_working !== 'undefined') ? contract.safe_working : '';


        contract_type_status.value=contract.contract_type

        let a       = new Date(contract.seldate)

        availableDates.value.push( String(new Date(a.getFullYear(), a.getMonth(), a.getDate())) )
        
        setTimeout(() => { 
            const eli   = document.querySelector(`[aria-label="${a.toLocaleDateString('en-US',{ weekday:'long',year:'numeric',month:'short',day:'numeric'})}"]`);

            if (eli) { eli.click() } else { console.log('Element not found'); }
            setTimeout(() => {  selectedTimes.value = contract.seltimes;    }, 500);

          }, 500);
        console.log(a.toLocaleDateString('en-US',{ weekday:'long',year:'numeric',month:'short',day:'numeric'}),"formattttttttttttttttttt")

        // Monday, Jul 29, 2024

       
        
        

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
        advancepayment.value=contract.deposit_percentage
        termconditions.value = contract.termconditions && contract.termconditions !== 'null' ? contract.termconditions : '';
        additional_srvcs.value = contract.additional_srvcs && contract.additional_srvcs !== 'null' ? contract.additional_srvcs : '';
        

    }

    bookingData.value = response.data.pay_booking_data.map((elem:any) => ({
        "id": elem.id,
        "service": elem.booking.package.name,
        "bookingdate": formatDate(elem.created_at),
        "bookingpayment":'$' + elem.total_amt, 
        "statustext":elem.status,
        "statuscolor": elem.status === "done" ? "success" : "primary",
        "payment_type":elem.payment_type,
        "notes":elem.notes,
        "name":elem.couple.userprofile.user.first_name + " " + elem.couple.userprofile.user.last_name,
        "email":elem.couple.userprofile.user.email,
        "img":elem.couple 
                ? (elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1)
                : (elem.vendor ? BASE_URL + elem.vendor.userprofile.profile_pic : user1),
        "btn_link": `/vendor-invoice/` + elem.id,

    }));

    dataIndexCntrct.value = response.data.contract_template.map((elem:any) => ({
        "id": elem.id,
        "name":elem.name,
    }));

    deposit_payemt_status.value=response.data.deposit_pay_status
    full_pay_status.value=response.data.full_pay_status
    remianing_status.value=response.data.remaining_pay_status
    fullpageloader.value = false
    }
    else{
        fullpageloader.value = false
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


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

const contract_type_status = ref();

const view_link=ref("");
async function create_contract(contract_type='null') {
    if (!(ivalidate())){return null}
    try {
    const formData = new FormData();
    formData.append("action",'create_contract');
    formData.append("contract_type",contract_type);
    formData.append("contract_action","vendor_customer");
    formData.append("package_id",package_id.value);
    formData.append("contract_id",view_link.value);
    formData.append("serviceId",serviceId);
    formData.append("couple",couple_id.value);
    formData.append("finalprice",finalprice.value);
    formData.append("contractname",contractname.value);
    formData.append('country', country.value['value']);   
    formData.append('state', state.value['value']);   
    formData.append('city', city.value['value']);  
    formData.append("advancepayment",advancepayment.value);
    for (let i = 0; i < files.value.length; i++) {
          formData.append("files[]", files.value[i]);
        }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    formData.append("addtional_srvc",additional_srvcs.value);
    formData.append("termconditions",termconditions.value);
    formData.append("retainer", retainer.value);
    formData.append("contracted_services", contracted_services.value);
    formData.append("expiration", expiration.value);
    formData.append("documentation", documentation.value);
    formData.append("hotel_accommodations", hotel_accommodations.value);
    formData.append("destination", destination.value);
    formData.append("attire", attire.value);
    formData.append("liability", liability.value);
    formData.append("cancellation_policy", cancellation_policy.value);
    formData.append("postponement_policy", postponement_policy.value);
    formData.append("responsibility", responsibility.value);
    formData.append("overtime", overtime.value);
    formData.append("contracted_vendor_payments", contracted_vendor_payments.value);
    formData.append("damage_loss_accessories", damage_loss_accessories.value);  
    formData.append("schedule_method", schedule_method.value);  
    formData.append("attorney", attorney.value);  
    formData.append("appropriate_conduct", appropriate_conduct.value);

    formData.append('seldate', selectedDateBook.value);
    formData.append('seltime', selectedTimes.value);

    dialog.value           = false
    fullpageloader.value   = true

    const response = await axios.post(`/home/create_contract`, formData, config);

    if (response.data.status == 'SAVED') {
        console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
        if (response.data.contract_type == 'draft'){
            contract_type_status.value = response.data.contract_type

            myerrors.value = 'Contract draft Updated successfully!';
            setTimeout(() => { showSuccessMessage.value = true;
                               showSuccessMessage.value = true;
                            }, 3000);
            setTimeout(() => { window.location.reload();
                            }, 4000);

        }else
        {
            const contract: any          = response.data.contract_id
            showSuccessMessage.value = true;
            myerrors.value = 'Contract has been successfully sent.';
            setTimeout(() => { router.push(`/vendor-contract-single/${contract}`) }, 3000);
        }
        
       
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    fullpageloader.value = false
  }
}

const offlinefiles = ref([]);
const handleFileChangeoffline = (event) => {
    offlinefiles.value = Array.from(event.target.files); // Correctly set files array
    console.log(offlinefiles.value, "filesssssssssssss2");
};
const coffline_note =ref("");
const coffline_amount =ref("");
// const paytype =ref("")





function checklength(){
    if(coffline_amount.value) coffline_amount.value = (coffline_amount.value.length > 10) ? coffline_amount.value.slice(0,10).replace(/\D/g, "") : coffline_amount.value.replace(/\D/g, "");
}


async function booking_payment(action='null') {
  try {
    const formData = new FormData();
    formData.append("action",action);
    formData.append("request_amt",requestpayment.value);
    formData.append("detailreq",detailreq.value);
    formData.append("booking_id",serviceId);
    formData.append("couple_id",couple_id.value);
    formData.append("vendor_id",package_owner_id.value);
    formData.append("requestpaymentradio",requestpaymentradio.value);

    

    if (action =='request_payment'){
        if (!(requestpayment.value)){
            showErrorMessage.value = true;
            myerrors.value = 'Please fill all required fields!';
            setTimeout(() => {  showErrorMessage.value = false; }, 3000);
            return
        }
    }

    if (action =='offline_paymentc'){
        if (!(coffline_amount.value)){
            showErrorMessage.value = true;
            myerrors.value = 'Please fill all required fields!';
            setTimeout(() => {  showErrorMessage.value = false; }, 3000);
            return
        }
       
        formData.append("ocouple_id",couple_id.value);
        formData.append("offline_amount",coffline_amount.value);
        formData.append("offline_note",coffline_note.value);
        formData.append("offline_vendorcouple",'offline_vendorcouple');
        for (let i = 0; i < offlinefiles.value.length; i++) {
          formData.append("offlinefiles[]", offlinefiles.value[i]);
        }
    }

    
    fullpageloader.value = true
    
    const response = await axios.post(`/home/request_payment`, formData, config);
    if (response.data.status == 'SENT') {
        availability.value = false
        fullpageloader.value=false;
        myerrors.value = 'Payment request sent successfully.';
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 1200);

        if (response.data.invoice_link){
            window.location.href =`/vendor-invoice/`+response.data.invoice_link;

        }else{ window.location.reload();

        }

       
    }
    if (response.data.status == 'offline_done') {
        availability.value = false
        fullpageloader.value=false;
        myerrors.value = 'Offline payment register successfully.';
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 3000);
        window.location.href =`/vendor-invoice/`+response.data.invoice_link;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const couplename = ref('Loreal');
const contractname = ref();
const finaldeposit = ref();


async function booking_req(action='null',booking_id=null,contract_id=null) {
  try {
    const formData = new FormData();
    formData.append("action",action);
    formData.append("booking_id",booking_id);
    formData.append("radioStatus",radioStatus.value);
    formData.append("contract_id",contract_id);

    fullpageloader.value = true
    const response = await axios.post(`/home/booking_action`, formData, config);
    if (response.data.status == 'SENT') {
        myerrors.value="Booking request accepted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        window.location.href=response.data.link_btn;
    }
    if (response.data.status == 'Delete') {
        myerrors.value="Booking request deleted successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 800);
        setTimeout(() => {
        window.location.reload();
    }, 2000); // Wait for 2000 milliseconds before reloading the page
    }
    if (response.data.status == 'Saved_Contract') {
        myerrors.value="Contract status saved successfully!"
        showSuccessMessage.value    = true;
        setTimeout(() => {showSuccessMessage.value=false;}, 1800);
        setTimeout(() => {
        window.location.reload();
    }, 2000); // Wait for 2000 milliseconds before reloading the page
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
 
onMounted(() => {   handlePaymentRadioChange();  singlebooking(); });

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
// No slots available for this date. Please choose another date or check back later.
const selectedDateBook = ref<any | null>(null);
const selectedTimes = ref<string[]>([]); // Array to hold multiple selected times
const superbookedSlots = ref([])
const no_dates = ref('Please select a date to view the available time slots.')

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

const radioSelectContract = ref(1)
const newbookingslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 1, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: false,
};
const newbookingslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 3 },
    2200: { itemsToShow: 3 },
};

const carouselfirstRef = ref(null);
// const nextfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.next(); };
// const prevfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.prev(); };

const nextfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.next(); };
const prevfirstSlide = () => { carouselfirstRef.value && carouselfirstRef.value.prev(); };

const dataIndexCntrct = ref([{id: 1,name: 'First Data',},{id: 2,name: 'First Data',},{id: 3,name: 'First Data',},{id: 4,name: 'First Data',},])



const reqrules   = ref([(v: string) => !!v || 'This field is required']);
const digitRules = ref([(v: string) => {
    if (!v) { return 'Required.'; }
    else { return (parseInt(v) > 0 && parseInt(v) < 101 ) ? true : 'Invalid value'; }
}]);

function ivalidate(){
    // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    // return fill_req_error( (isValidfname && isValidlname && isValidEmail && u_phone.value) ? true : false )


    const isValidphone = digitRules.value.every((rule) => rule(advancepayment.value) === true);
    console.log(isValidphone,"isValidphone")
    console.log(advancepayment.value,"advancepayment")
    const rslt = (country.value && state.value && city.value && finalprice.value && isValidphone && selectedDateBook.value && selectedTimes.value)

    console.log(rslt,"rrrrrrrrrrrr")
    console.log(finalprice.value,"finalprice.value")
    console.log(country.value , state.value , city.value , finalprice.value , isValidphone , selectedDateBook.value , selectedTimes.value,"..............................")



    if (!(rslt)){
        showErrorMessage.value = true;
        myerrors.value = 'Please fill all required fields!';
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
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
    <div class="d-flex justify-start">
        <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
            <ChevronLeftIcon size="13" class="me-1" />Back 
        </v-btn>
    </div>
    <v-card elevation="10" class="bg-grey100">
        <v-card-item class="pa-sm-6 pa-3">
            <v-row>
                <v-col cols="12" md="4">
                    <v-card elevation="10" class="vendor-card-hover mb-4">
                        <v-card-item class="pa-4">

                            <div class="position-relative d-flex overflow-hidden">
                                <img :src="pkg_img" class="rounded vendormainimg imgheight">
                                <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>
                                    {{ category_name }}
                                </v-chip>
                                <div class="viewServiceBtn d-md-flex d-block">

                                    <v-btn color="primary" :to="'/edit-package/' + link" variant="flat" class=" "
                                        size="small">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        View Package
                                    </v-btn>
                                </div>
                            </div>

                            <div class="d-flex justify-space-between align-center mt-4 mb-2">
                                <div>
                                    <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary mb-0">
                                        {{ pkg_name }}
                                    </h4>
                                </div>
                                <div>
                                    <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                        ${{ pkg_price }}
                                    </h4>
                                </div>
                            </div>

                            <div class="mb-5">
                                <h6 class="text-body-2 text-13">
                                    <span >
                                        <h6 v-if="cities && cities.length > 0" class="text-body-2 text-13"><span class="font-weight-semibold">Location
                                    :</span> 
                                    <span v-for="(c, index) in cities" :key="c.id">
                                        {{ c.city }}
                                        <span v-if="index !== cities.length - 1">,</span>
                                    </span>
                                </h6>
                                        
                                    </span>
                                </h6>
                                <!-- <h6  v-if="pkg_totalbook" class="text-body-2 text-13"><span class="font-weight-semibold">Total Bookings
                                        :</span> {{ pkg_totalbook }}</h6>
                                <h6 v-if="pkg_rembook" class="text-body-2 text-13"><span class="font-weight-semibold">Remaining Bookings
                                        :</span> {{pkg_rembook}}</h6> -->
                                <h6 v-if="pkg_deposit_amt" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit :
                                    </span>${{ pkg_deposit_amt }} ({{ pkg_deposit }}% of ${{pkg_price}})</h6>
                            </div>
                            

                        </v-card-item>
                    </v-card>
                    
                    <v-card elevation="10" class=" border d-flex mb-4">
                        <v-card-text class="pt-3">
                           <div class="text-center mb-3 border-bottom">
                                <p class="mb-2 font-weight-semibold">Agreement Price During Contract </p>
                           </div>
                            <v-row v-if="final_deposit_amt">
                                <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                                    <h6  class="text-h4 mb-1 ">$ {{finalprice}}</h6>
                                    <span class="font-weight-semibold text-body-2">Final Price
                                    </span>
                                </v-col>
                                <v-col cols="6" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1"> $ {{final_deposit_amt}} </h6>
                                    <span class="font-weight-semibold text-body-2">Final Deposit 
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                                    <h6  class="text-h4 mb-1 ">${{pkg_price}}</h6>
                                    <span class="font-weight-semibold text-body-2">Base Price
                                    </span>
                                </v-col>
                                <v-col cols="6" md="6" class="text-center">
                                    <h6  class="text-h4 mb-1"> $ {{pkg_deposit_amt}}</h6>
                                    <span class="font-weight-semibold text-body-2">Deposit Amount
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
                                    <v-card elevation="10" class=" border d-flex mb-4">

                                         

                                        <template v-if="radioStatus == 'complete'">
                                            <v-btn  size="x-small" color="error"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                            Complete Contract
                                             <v-tooltip activator="parent" location="top">Contract status: Completed</v-tooltip>
                                            </v-btn>

                                        </template>
                                        <template v-else>

                                            <template v-if="((view_contract) && (v_sign && c_sign))">
                                                <v-btn  size="x-small" color="success"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                Active Contract
                                                <v-tooltip activator="parent" location="top">Contract has been signed by both parties.</v-tooltip>
                                                 </v-btn>
                                            </template>
                                            <template v-else>
                                                <v-btn v-if="view_contract" size="x-small" color="primary"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                Inprogress
                                                <v-tooltip activator="parent" location="top">Awaiting signature from both parties.</v-tooltip>
                                                </v-btn>
                                            </template>

                                        </template>





                                        
                                        <v-card-text class="pa-4">
                                                    <div class="">
                                                <div class="d-flex gap-2 flex-wrap">
                                                    <div>
                                                        <img :src="couple_profile" width="40" class="customerImg sdfasd"/>
                                                    </div>
                                                    <div class="">
                                                        <h6 class="text-h6 ">{{ couple_name }}</h6>
                                                        <span class="text-truncate d-flex align-center gap-2">
                                                            <span class="text-truncate font-weight-medium">{{couple_email}}</span>
                                                        </span> 
                                                    </div>
                                                </div>
                                               
                                                <div class="d-flex  align-center mt-2 flex-wrap">
                                                    <template v-if="view_contract && contract_type_status != 'draft'" >
                                                        <v-btn  flat size="small" :to="'/vendor-contract-single/' + view_link" color="secondary" class="rounded-sm mr-1 mb-1">
                                                            <SignatureIcon size="16" class="me-1"/>
                                                            View Contract </v-btn>

                                                            

                                                        <v-dialog v-if="v_sign && c_sign" v-model="availability" class="dialog-mw" size="small" :max-width="600">

                                                            <template v-if="radioStatus == 'complete'"  v-slot:activator="{ props }">
                                                                <v-btn v-bind="props" color="success" variant="flat" size="small"  :disabled="true" class="rounded-sm  mr-1 mb-1">
                                                                    <CashIcon size="16" class="me-1 mb-1"/>
                                                                    Generate Invoice 
                                                                </v-btn>
                                                            </template>
                                                            <template v-else v-slot:activator="{ props }">
                                                                <v-btn v-bind="props" color="success" variant="flat" size="small" class="rounded-sm  mr-1 mb-1">
                                                                    <CashIcon size="16" class="me-1 mb-1"/>
                                                                    Generate Invoice 
                                                                </v-btn>
                                                            </template>

                                                            <v-card class="pa-6">
                                                                <div class="d-flex justify-space-between border-bottom">
                                                                    <h4
                                                                        class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                        Generate Invoice </h4>
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
                                                                    

                                                                    <v-row >
                                                                       
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
                                                                                            $ {{ remaining__amt }}
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
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Amount </v-label>
                                                                    <span class="text-error ma-1">*</span>
                                                                    <v-text-field 
                                                                        v-model="requestpayment" 
                                                                        variant="outlined" 
                                                                        @keyup="checklength()"
                                                                        :rules="reqrules"
                                                                        color="secondary"
                                                                        type="text" 
                                                                        maxlength="10"
                                                                        requried="true"
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
                                                        <v-dialog v-if="v_sign && c_sign" v-model="offline_pay"  class="dialog-mw" size="small" :max-width="600">

                                                           

                                                            <template v-if="radioStatus == 'complete'" v-slot:activator="{ props }">
                                                            <v-btn
                                                                @click="offline_pay = true"
                                                                v-bind="props"
                                                                color="success"
                                                                variant="flat"
                                                                size="small"
                                                                class="rounded-sm mr-1 mb-1"
                                                                :disabled="true"
                                                            >
                                                                <CashIcon size="16" class="me-1" />
                                                                Offline Payment 5
                                                            </v-btn>
                                                        </template>


                                                            <template v-else  v-slot:activator="{ props }">
                                                                <v-btn @click="offline_pay = true" v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                                    <CashIcon size="16" class="me-1"/>
                                                                    Offline Payment 
                                                                </v-btn>
                                                            </template>





                                                            <v-card class="pa-6">
                                                                <div class="d-flex justify-space-between border-bottom">
                                                                    <h4
                                                                        class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                        Offline Payment </h4>
                                                                    <v-btn icon color="" @click="offline_pay = false" flat variant="outlined"
                                                                        size="x-small" class="bg-error">
                                                                        <XIcon width="20" />
                                                                    </v-btn>
                                                                </div>
                                                                <v-row class="py-5">
                                                                    <v-col cols="12" sm="12">
                                                                        <div>
                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Amount</v-label>
                                                                        <span class="text-error ma-1">*</span>
                                                                        <v-text-field 
                                                                            v-model="coffline_amount" 
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
                                                                            <v-textarea v-model="coffline_note"  variant="outlined" placeholder="" rows="3" color="secondary" row-height="25" shapedhide-details></v-textarea>
                                                                        </div>
                                                                    </v-col>
                                                                    <v-col cols="12" sm="12">
                                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Attach Receipt (Evidence of Offline Payment)</v-label>
                                                                        <v-file-input
                                                                                placeholder="Upload your documents"
                                                                                label="Upload Document"
                                                                                color="primary"
                                                                                variant="outlined"
                                                                                hide-details="auto"
                                                                                prepend-icon="mdi-paperclip"
                                                                                accept="application/pdf"
                                                                                
                                                                                @change="handleFileChangeoffline"
                                                                            >
                                                                                <template v-slot:selection="{ fileNames }">
                                                                                <template v-for="fileName in fileNames" :key="fileName">
                                                                                    <v-chip size="small" label color="primary" class="mr-2">
                                                                                    {{ fileName }}
                                                                                    </v-chip>
                                                                                </template>
                                                                                </template>
                                                                        </v-file-input>
                                                                    </v-col>
                                                            
                                                                    
                                                                    <v-col cols="12" class="d-flex justify-end">
                                                                        <v-btn color="error" variant="flat" class="mt-3 ms-2 rounded-sm" @click="offline_pay = false">
                                                                            Cancel
                                                                        </v-btn>
                                                                        <v-btn @click="booking_payment('offline_paymentc')"  color="success" variant="flat" class="mt-3 ms-2 rounded-sm">
                                                                            Send
                                                                        </v-btn>

                                                                        
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card>
                                                        </v-dialog>

                                                    </template>
                                                    <template v-else >
                                                        

                                                        <div v-if="strp_status == 'verified' ">
                                                            <div v-if="booking_status == 'accepted'">

                                                                <v-btn v-if="contract_type_status == 'draft'" flat size="small" color="success" @click="click_accept()" class="rounded-sm mr-1 mb-1"><FilePencilIcon size="16" class="me-1"/>Edit Contract Draft</v-btn>
                                                                <v-btn v-else flat size="small" color="success" @click="click_accept()" class="rounded-sm mr-1 mb-1"><FilePencilIcon size="16" class="me-1"/>Create Contract  </v-btn>

                                                            </div>
                                                            <div v-else-if="wellet_dta === wallet_type">
                                                                <v-btn flat size="small" color="success"   class="rounded-sm mr-1"  :to="'/vendor-bookings'"><LockIcon stroke-width="2" size="20" class="mr-1" /> Accept</v-btn>
                                                                <v-btn flat size="small"  @click="connect_stripe()" color="error" class="rounded-sm mr-1"><XIcon size="16" class="me-1"/>Decline </v-btn>
                                                            </div>
                                                            <div v-else>
                                                                <v-btn flat size="small" color="success" @click="booking_req('accept',serviceId)" class="rounded-sm mr-1 mb-1"><CheckIcon size="16" class="me-1"/>Accept</v-btn>

                                                                <v-btn flat size="small" color="error"
                                                                @click="booking_req('reject',serviceId)" class="rounded-sm mr-1"><XIcon size="16" class="me-1 mb-1"/>Decline</v-btn>
                                                            </div>

                                                        </div>
                                                        <div v-else >
                                                            <div v-if="booking_status == 'accepted'">
                                                            </div>
                                                            <!-- <div v-else>
                                                                <v-btn flat size="small" color="success"  @click="connect_stripe()" class="rounded-sm mr-1"><CheckIcon size="16" class="me-1"/>Accept</v-btn>
                                                                <v-btn flat size="small"  @click="connect_stripe()" color="error" class="rounded-sm mr-1"><XIcon size="16" class="me-1"/>Decline </v-btn>
                                                            </div> -->
                                                            <div v-else>
                                                                <v-btn flat size="small" color="success"  @click="connect_stripe()" class="rounded-sm mr-1"><LockIcon stroke-width="2" size="20" class="mr-1" /> Accept</v-btn>
                                                                <v-btn flat size="small"  @click="connect_stripe()" color="error" class="rounded-sm mr-1"><XIcon size="16" class="me-1"/>Decline </v-btn>
                                                            </div>
                                                      
                                                        </div>
                                                    </template>


                                                        <v-btn  flat size="small" color="secondary" class="rounded-sm mr-1 mb-1" :to="msglink">
                                                            <MessageIcon size="16" class="me-1"/>Message</v-btn>
                                                        <!-- Dont deleet it  -->
                                                        <v-menu v-model="menu" :close-on-content-click="false" anchor="top" v-if="view_contract && bookingData.length != 0">
                                                            <template v-slot:activator="{ props }">
                                                                <v-btn  flat size="small"  color="error" v-bind="props" class="rounded-sm mr-1"><PlaystationCircleIcon size="16" class="me-1 mb-1"/> End Contract</v-btn>
                                                            </template>

                                                            <v-card min-width="200" elevation="10">
                                                                <v-card-item class="pa-2">
                                                                    <div class="d-flex gap-3 align-center flex-column flex-sm-row">
                                                                    <v-radio-group  hide-details v-model="radioStatus" column>
                                                                        <v-radio label="Pending" color="primary" value="pending"></v-radio>
                                                                        <v-radio label="Inprogress" color="info" value="inprogress"></v-radio>
                                                                        <v-radio label="On hold" color="error" value="onhold"></v-radio>
                                                                        <v-radio label="Completed" color="success" value="complete"></v-radio>
                                                                    </v-radio-group>
                                                                </div>
                                                                <div class="d-flex justify-start gap-2 py-3 px-4">
                                                                    <v-btn color="error"  size="small" text @click="menu = false" class=" rounded-sm"> cancel </v-btn>
                                                                    <v-btn color="success"  size="small" text @click="booking_req('end_contract',serviceId,view_link)" class="bg-success rounded-sm"> Save </v-btn>
                                                                </div>
                                                                </v-card-item>
                                                            </v-card>
                                                            </v-menu>

                                                       
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




                                                            <v-dialog v-model="dialog" scrollable class="dialog-mw" :max-width="800">
                                                                <v-card class="pa-6">
                                                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                                        <h4
                                                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                                         Create  Contract  </h4>
                                                                        <v-btn icon color="" @click="dialog = false" flat variant="outlined" size="x-small"
                                                                            class="bg-error">
                                                                            <XIcon width="13" />
                                                                        </v-btn>
                                                                    </div>
                                                                    <div class="pa-0  pt-10 ">
                                                                        <v-row class="">
                                                                    <!-- <v-col cols="12">
                                                                        <v-card elevation="0" class="bg-lightprimary">
                                                                            <v-card-item class="pa-2">
                                                                                <v-radio-group inline v-model="radioSelectContract">
                                                                                <v-row >
                                                                                    <v-col cols="col">
                                                                                    <h4 class="text-h6 text-no-wrap font-weight-semibold textSecondary text-capitalize">Select Contract</h4>
                                                                                    </v-col>
                                                                                    <v-col cols="auto">
                                                                                    <div class="carousel-arrows  ctm_crousel">
                                                                                        <button @click="prevfirstSlide" class="arrow-button prev">
                                                                                            <span>
                                                                                            <svg
                                                                                                width="28px"
                                                                                                height="28px"
                                                                                                viewBox="0 0 24 24"
                                                                                                fill="none"
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                            >
                                                                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                                                                <g id="SVGRepo_iconCarrier">
                                                                                                <path
                                                                                                    d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                                                                                    fill="#b4801c"
                                                                                                ></path>
                                                                                                </g>
                                                                                            </svg>
                                                                                            </span>
                                                                                        </button>
                                                                                        <button @click="nextfirstSlide" class="arrow-button next">
                                                                                            <span>
                                                                                            <svg
                                                                                                width="28px"
                                                                                                height="28px"
                                                                                                viewBox="0 0 24 24"
                                                                                                fill="none"
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                            >
                                                                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                                                                <g id="SVGRepo_iconCarrier">
                                                                                                <path
                                                                                                    d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                                                                    fill="#b4801c"
                                                                                                ></path>
                                                                                                </g>
                                                                                            </svg>
                                                                                            </span>
                                                                                        </button>
                                                                                    </div>
                                                                                    </v-col>
                                                                                </v-row>
                                                                                        <div class="position-relative overflow-hidden">
                                                                                            <carousel
                                                                                                ref="carouselfirstRef"
                                                                                                :settings="newbookingslideSettings"
                                                                                                :breakpoints="newbookingslideBreakpoints"
                                                                                                class="overflow-hidden slider-reset row"
                                                                                            >
                                                                                                <slide class="mb-1 px-2" v-for="(item, index) in dataIndexCntrct"
                                                                                                :key="index">
                                                                                                    <label style="background-color:#fff;" class="text-start bg-white w-100 d-block pt-2 pb-0 px-3 border rounded-md" :for="'contract' + item.id">
                                                                                                        <v-radio :id="'contract' + item.id" :value="'contract' + item.id" 
                                                                                                        hide-details="auto"
                                                                                                        color="primary" class="label-op-1">
                                                                                                            <template v-slot:label>
                                                                                                                <div class="d-flex align-center w-100">
                                                                                                                    <div>
                                                                                                                        <h6 class="text-subtitle-1 font-weight-medium mb-1">{{item.name}}</h6>
                                                                                                                        
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </template>
                                                                                                        </v-radio>
                                                                                                    </label>
                                                                                                </slide>
                                                                                                
                                                                                        </carousel>
                                                                                    </div>
                                                                                </v-radio-group>
                                                                                <div class="text-end mt-n5">
                                                                                    <v-btn variant="text" class="text-decoration-underline text-primary ms-auto pa-0">Clear Contract</v-btn>
                                                                                </div>
                                                                            </v-card-item>
                                                                        </v-card>
                                                                    </v-col> -->
                                                                            <!-- <v-col cols="12">
                                                                                <h4
                                                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                                            Create Contract  </h4>
                                                                            </v-col> -->
                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Name <span class="text-error ma-1">*</span></v-label>
                                                                                    <VTextField hide-details="auto" disabled v-model="package_name" class="" required placeholder="Enter Your Package Name" color="secondary"></VTextField>
                                                                                </div>
                                                                            </v-col>

                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Category <span class="text-error ma-1">*</span></v-label>
                                                                                    <VTextField hide-details="auto" disabled v-model="category_name" class="" required
                                                                                        placeholder="Category" color="secondary"></VTextField>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Name 
                                                                                    <span class="text-error ma-1">*</span></v-label>
                                                                                    <VTextField hide-details="auto" disabled v-model="couplename" class="" required
                                                                                        placeholder="" color="secondary"></VTextField>
                                                                                </div>
                                                                            </v-col>
                                                                            <!-- 
                                                                             -->

                                                                            <v-col cols="12" md="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                                                    <v-select v-model="country" :items="countryitem" item-title="text"
                                                                                        item-value="value" label="Select Country" single-line variant="outlined"
                                                                                        hide-details @update:modelValue="getstate()" return-object required :rules="reqrules">
                                                                                    </v-select>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">State<span class="text-error ma-1">*</span></v-label>
                                                                                    <v-select v-model="state" :items="stateitem" item-title="text"
                                                                                        item-value="value" label="Select State" single-line variant="outlined"
                                                                                        hide-details @update:modelValue="getcity()" return-object required :rules="reqrules">
                                                                                    </v-select>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">City<span class="text-error ma-1">*</span></v-label>
                                                                                    <v-select v-model="city" :items="cityitem" item-title="text"
                                                                                        item-value="value" label="Select City" single-line variant="outlined"
                                                                                        hide-details return-object required :rules="reqrules">
                                                                                    </v-select>
                                                                                </div>
                                                                            </v-col>

                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Base Price
                                                                                    <span class="text-error ma-1">*</span></v-label>
                                                                                    <VTextField v-model="pacakgeprice" hide-details="auto" disabled required placeholder="Enter Package Price" color="secondary" type="number">
                                                                                    </VTextField>
                                                                                </div>
                                                                            </v-col>

                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit Percentage
                                                                                    <span class="text-error ma-1">*</span></v-label>
                                                                                    <v-text-field  disabled v-model="finaldeposit" variant="outlined" color="secondary" type="number"
                                                                                        placeholder="Enter Payment" hide-details>
                                                                                    </v-text-field>
                                                                                </div>
                                                                            </v-col>
                                                                            
                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Price
                                                                                    <span class="text-error ma-1">*</span></v-label>
                                                                                    <VTextField v-model="finalprice" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number" :rules="reqrules">
                                                                                    </VTextField>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Deposit Percentage
                                                                                    <span class="text-error ma-1">*</span></v-label>
                                                                                    <v-text-field v-model=" advancepayment" variant="outlined" color="secondary" type="number" placeholder="Enter Payment" hide-details  :rules="digitRules">
                                                                                    </v-text-field>
                                                                                </div>
                                                                            </v-col>
                                                                            <!-- <v-col cols="12" sm="6">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">No of Booking Available
                                                                                    </v-label>
                                                                                    <VTextField v-model="bookingavailable" hide-details="auto" required placeholder="No of Booking Available" color="secondary" type="number"></VTextField>
                                                                                </div>
                                                                            </v-col> -->
                                                                            <!-- <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Set Hours
                                                                                    </v-label>
                                                                                    <v-autocomplete
                                                                                        v-model="hours"
                                                                                        :items="hoursitems"
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                        multiple
                                                                                        hide-details
                                                                                        
                                                                                    >
                                                                                        <template v-slot:chip>
                                                                                            <v-chip label color="primary" size="x-small" class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                                                                        </template>
                                                                                    </v-autocomplete>
                                                                                </div>
                                                                            </v-col> -->


                                                                            <!-- <v-col cols="12" class="bookingModalStyle ">
                                                                                <v-label
                                                                                    class="font-weight-medium mb-2 ">Event Date</v-label><br>
                                                                                <VueDatePicker v-model="avldate" range multi-calendars  :enable-time-picker="false" dark  />
                                                                            </v-col> -->


                                                                            <v-col cols="12">
                                                                                <div class="calendermain-style">
                                                                                    <v-row>
                                                                                        <v-col cols="12" md="7" >
                                                                                            <v-row>
                                                                                                <v-col cols="col">
                                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select Date<span class="text-error ma-1">*</span></v-label>
                                                                                                    <VCalendar class="calender" :attributes="attributesBook"
                                                                                            :available-dates="availableDates" @dayclick="handleDayClick"
                                                                                            :time-available="timeAvailable"
                                                                                            @timeclick="handleTimeClick" />
                                                                                                </v-col>
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
                                                                                            </v-row>
                                                                                            
                                                                                        </v-col>
                                                                                        <v-col cols="12" md="5" v-if="timeSlotMain">
                                                                                            <v-label class="font-weight-medium mb-2 d-block">Time
                                                                                                Slots<span class="text-error ma-1">*</span></v-label>
                                                                                            <v-card elevation="10">
                                                                                                <v-card-item class="pa-2">
                                                                                                    <v-row class="ma-n1 timeSlotScroll scroll-style py-4">
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

                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2"> Additional Services
                                                                                    </v-label>
                                                                                    <v-textarea v-model="additional_srvcs" outlined name="additional_srvcs" placeholder="Enter Additional Services" hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>


                                                                            <!-- <v-col cols="12">
                                                                                <v-label
                                                                                    class="font-weight-medium mb-2 d-block">
                                                                                    Additional Services</v-label>
                                                                                    <div class="rounded custom-border">
                                                                                        <div v-if="editor">
                                                                                        <EditorMenubar :editor="editor" />
                                                                                        </div>
                                                                                    <editor-content :editor="editor" class="tiptap" ref="editorContentRef" />
                                                                                        </div>
                                                                            </v-col> -->
                                                                            
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Additional instructions for agreement
                                                                                    </v-label>
                                                                                    <v-textarea v-model="termconditions" outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>

                                                                            <!-- <v-col cols="12">
                                                                                <v-label class="font-weight-medium mb-2 d-block">
                                                                                    Upload Document</v-label>
                                                                                <div>
                                                                                    <v-file-input
                                                                                    v-model="files"
                                                                                    placeholder="Upload your documents"
                                                                                    label="Upload Document"
                                                                                    
                                                                                    color="primary"
                                                                                    variant="outlined"
                                                                                    hide-details="auto"
                                                                                    prepend-icon="mdi-paperclip"
                                                                                    accept="application/pdf"
                                                                                    >
                                                                                    <template v-slot:selection="{ fileNames }">
                                                                                        <template v-for="fileName in fileNames" :key="fileName">
                                                                                        <v-chip size="small" label color="primary" class="mr-2">
                                                                                            {{ fileName }}
                                                                                        </v-chip>
                                                                                        </template>
                                                                                    </template>
                                                                                    </v-file-input>
                                                                                </div>
                                                                            </v-col> -->



                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Retainer
                                                                                    </v-label>
                                                                                    <v-textarea v-model="retainer" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Contracted services
                                                                                    </v-label>
                                                                                    <v-textarea v-model="contracted_services" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Expiration
                                                                                    </v-label>
                                                                                    <v-textarea v-model="expiration" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Provided Documentation
                                                                                    </v-label>
                                                                                    <v-textarea v-model="documentation" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Hotel Accommodations
                                                                                    </v-label>
                                                                                    <v-textarea v-model="hotel_accommodations" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Destination
                                                                                    </v-label>
                                                                                    <v-textarea v-model="destination" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Attire
                                                                                    </v-label>
                                                                                    <v-textarea v-model="attire" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Liability
                                                                                    </v-label>
                                                                                    <v-textarea v-model="liability" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Cancellation Policy
                                                                                    </v-label>
                                                                                    <v-textarea v-model="cancellation_policy" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Postponement Policy
                                                                                    </v-label>
                                                                                    <v-textarea v-model="postponement_policy" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Responsibility
                                                                                    </v-label>
                                                                                    <v-textarea v-model="responsibility" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Overtime
                                                                                    </v-label>
                                                                                    <v-textarea v-model="overtime" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col  cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Contracted Vendor and Payments
                                                                                    </v-label>
                                                                                    <v-textarea v-model="contracted_vendor_payments" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Damage or Loss of Accessories
                                                                                    </v-label>
                                                                                    <v-textarea v-model="damage_loss_accessories" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Schedule and Method
                                                                                    </v-label>
                                                                                    <v-textarea v-model="schedule_method" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Attorney
                                                                                    </v-label>
                                                                                    <v-textarea v-model="attorney" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" sm="12">
                                                                                <div class="">
                                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Appropriate Conduct/ Safe Working Environment:

                                                                                    </v-label>
                                                                                    <v-textarea v-model="appropriate_conduct" outlined  hide-details
                                                                                        color="secondary"></v-textarea>
                                                                                </div>
                                                                            </v-col>
                                                                            


                                                                            <v-col cols="12">
                                                                                <v-label class="font-weight-medium mb-2 d-block">Upload Document</v-label>
                                                                                <div>
                                                                                <v-file-input
                                                                                    placeholder="Upload your documents"
                                                                                    label="Upload Document"
                                                                                    color="primary"
                                                                                    variant="outlined"
                                                                                    hide-details="auto"
                                                                                    prepend-icon="mdi-paperclip"
                                                                                    accept="application/pdf"
                                                                                    
                                                                                    @change="handleFileChange"
                                                                                >
                                                                                    <template v-slot:selection="{ fileNames }">
                                                                                    <template v-for="fileName in fileNames" :key="fileName">
                                                                                        <v-chip size="small" label color="primary" class="mr-2">
                                                                                        {{ fileName }}
                                                                                        </v-chip>
                                                                                    </template>
                                                                                    </template>
                                                                                </v-file-input>
                                                                                </div>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </div>
                                                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                                                        <v-btn class="bg-error rounded-sm" text @click="dialog = false" flat>
                                                                            Close
                                                                        </v-btn>

                                                                        <v-btn class="bg-secondary rounded-sm" @click="create_contract('draft')" text flat >
                                                                            Save as draft
                                                                        </v-btn>

                                                                        <v-btn class="bg-success rounded-sm" @click="create_contract('send')" text flat >
                                                                            Send Contract
                                                                        </v-btn>
                                                                    </v-card-actions>
                                                                </v-card>
                                                            </v-dialog>
                                                        </div>
                                                
                                            </div>
                                        </v-card-text>
                                    
                                    </v-card>
                                    
                                    <v-card elevation="10" class="mb-0">
                                        <v-card-item>
                                            <v-row>
                                                <v-col cols="12" sm="6" class="order-sm-1 order-2">
                                                    <div class="d-flex mb-3">
                                                        <div>
                                                            <p
                                                                class="v-list-item-title text-h6 mb-1 d-flex align-center font-weight-medium ">
                                                                Event Date
                                                            </p>
                                                            <p
                                                                class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium maxwidthSet">
                                                                {{ srvc_bookingdate }}
                                                            </p>
                                                            <p  class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium maxwidthSet">
                                                                {{ srvc_bookingtime }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div >
                                                       
                                                        <div class="mb-3">
                                                            <p
                                                                class="v-list-item-title text-h6 mb-1 d-flex align-center font-weight-medium ">
                                                                Location
                                                            </p>
                                                            <p
                                                                class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium">
                                                                {{srvc_location}}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="6" class=" d-flex text-sm-end text-start order-sm-2 order-1 flex-column">
                                                    <h2 class=" mb-0 text-h2 text-secondary font-weight-bold text-capitalize">
                                                        $ {{srvc_budget}} 
                                                    </h2>
                                                    <span
                                                        class="v-list-item-title text-body-1 mb-1 font-weight-medium text-capitalize text-secondary">
                                                        Deposit Amount 
                                                    </span>
                                                    <!-- <div class="d-flex justify-end">
                                                        <a :href="'mailto:'+ couple_email" >
                                                            <v-btn flat size="small"  color="secondary" class="rounded-sm"> <MailIcon size="16" class="me-1"/>Send Email </v-btn>
                                                        </a>
                                                        
                                                    </div> -->
                                                </v-col>
                                            </v-row>
                                            <div>
                                                <div class="mb-3">
                                                    <h2
                                                        class="v-list-item-title text-h6 mb-1 font-weight-medium text-capitalize">
                                                        Description
                                                    </h2>
                                                    
                                                    <div class="body-text-5 border pa-3 rounded content-style contentHeightnew scroll-style" v-html="srvc_terms">
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-col>
            </v-row>
            <v-row   class="mt-0 pa-3">
                
                    <div class="">
                        <h3 class="text-h5 mb-3">Contract Payments</h3>
                    </div>
                    <v-card elevation="10" class="bg-lightprimary border border-primary">
                        <v-card-item class="pa-2 ">
                            <div ref="transaction_download">
                                <v-table class="month-table ">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                                <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                                    Details</th>

                                                <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name
                                                    </th>

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

                                                <td><h5 class="text-no-wrap text-body-1">{{ index+1 }}</h5></td>
                                                <td>
                                                    <div class="d-flex align-center">
                                                            <v-avatar size="40">
                                                                <img :src="item.img" width="40" /></v-avatar>
                                                            <div class="mx-3">
                                                                <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                                    {{ item.name }}</h4>
                                                                 <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                               {{item.email}}</h6>
                                                               <v-btn v-if="item.notes && item.notes !='undefined'" color="grey200" class="mt-1 rounded-sm" size="small" >
                                                            Note <QuestionMarkIcon size="15"/>
                                                            <v-tooltip activator="parent" location="top">
                                                                {{ item.notes}}
                                                            </v-tooltip>
                                                        </v-btn>
                                                            </div>
                                                    </div>

                                                </td>


                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.service }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 text-capitalize">
                                                        {{ item.bookingpayment }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.bookingdate }}
                                                    </h5>
                                                    <!-- <p class="text-body-2">{{ item.bookingtime }}</p> -->
                                                </td>

                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium text-capitalize">
                                                        {{ item.payment_type }}

                                                    </h5>
                                                </td>

                                                <td>
                                                    <v-chip rounded="md" class="ma-2 font-weight-semibold text-capitalize"
                                                        :color="item.statuscolor" size="small" label>{{
                                                        item.statustext }}</v-chip>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        <v-tooltip text="View">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                                <EyeIcon stroke-width="2" size="20"
                                                                    class="text-secondary" />
                                                            </v-btn>
                                                        </template>
                                                        </v-tooltip>


                                                        <v-tooltip text="Download">
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
.floatStatus{
    position: absolute;
    right: 0px;
    top: 0px;
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
.timeSlotScroll {
    max-height: 410px;
    overflow-y: auto;
}
</style>