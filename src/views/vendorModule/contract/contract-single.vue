<script setup lang="ts">
import { ref ,onMounted,getCurrentInstance } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import vueSignature from "vue-signature";
import html2pdf from 'html2pdf.js'; // Import html2pdf



const fullpageloader = ref(true)
const showSuccessMessage    = ref(false)
const showErrorMessage      = ref(false)
const myerrors              = ref('')



const option = {
    penColor: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(237,243,248)',
};
const option2 = {
    penColor: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(237,243,248)',
};
const disabled = ref(false);
const dataUrl = '';
const cdataUrl = '';
const vendorSignature = ref(null);
const customerSignature = ref(null);
const signature_imge = ref(null);
const c_signature_imge = ref(null);
const contract_users = ref(null);
const admin_signature_imge = ref(null);
const vendor = ref('');
const admin = ref('');
const customer = ref('');


const role = localStorage.getItem("role");
if (role == 'vendor') { vendor.value = role}
if (role == 'customer') { customer.value = role}
if (role == 'admin') { admin.value = role}

// const signatureRef = ref("");
const saveSignaturev = (type) => {
    const signatureRefv = type === 'vendor' ? vendorSignature.value : customerSignature.value;
    if (signatureRefv.isEmpty()) {
        alert('Please provide a signature before saving.');
        return;
    }

    if (signatureRefv) {
        const png = signatureRefv.save();
        const jpeg = signatureRefv.save('image/jpeg');
        const svg = signatureRefv.save('image/svg+xml');
        console.log(`${type} Signature:`);
        console.log(png,"pppp");
        console.log(jpeg,"jjjjjj");
        signature_imge.value= jpeg
        console.log(svg,"sss");
        signatureRefv.value.save("image/jpeg");
       
        
    }
};

const saveSignaturec = (type) => {
    const signatureRefc = type === 'vendor' ? vendorSignature.value : customerSignature.value;

    if (signatureRefc.isEmpty()) {
        alert('Please provide a signature before saving.');
        return;
    }
    
    if (signatureRefc) {
        const png = signatureRefc.save();
        const jpeg = signatureRefc.save('image/jpeg');
        const svg = signatureRefc.save('image/svg+xml');
        console.log(`${type} Signature:`);
        console.log(png,"pppp");
        console.log(jpeg,"c______________jjjjjj");
        c_signature_imge.value= jpeg
        console.log(c_signature_imge.value,"c_signature_imge saveeeeeeeeee111")
        console.log(svg,"sss");
        signatureRefc.value.save("image/jpeg");
        
    }
};

const clearSignaturev = (type) => {
    const signatureRefv = type === 'vendor' ? vendorSignature.value : customerSignature.value;
    if (signatureRefv) {
        signature_imge.value=null
        signatureRefv.clear();
    }
};

const clearSignaturec = (type) => {
    const signatureRefc = type === 'customer' ? customerSignature.value : vendorSignature.value;
    if (signatureRefc) {
        c_signature_imge.value=null
        signatureRefc.clear();
    }
};


const active_status = ref('Pending');




const path = window.location.pathname;
const contractid = path.split('/').pop();
const vendor_name = ref("");
const customer_name = ref("");
const category = ref("");
const start_date = ref("");
const end_date = ref("");
const location = ref("");
const created_at = ref("");
const package_name = ref("");
const final_budget = ref("");
const deposit_budget = ref("");
const deposte_date= ref("");
const termconditions = ref("");
const additional_srvcs = ref("");
const booking_id =ref("");
const attached_files =ref("");
const check_role =ref("");
const contract_role =ref("");

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

const creating_con_user = ref();
const admin_name = ref();


const contract = ref<HTMLElement | null>(null);
async function contract_listing() {
  try {
    const formData = new FormData();
    formData.append("user_current_role",'vendor');
    formData.append("contractid",contractid);
    
    const response = await axios.post(`/home/single_contract`, formData, config);
        if(response.data.contract_data){
            const contract: any          = response.data.contract_data
            console.log(contract,"contract>>>>>>>>>>>>>>>>>>>>>>>")
            vendor_name.value = contract.package.user.first_name + " " + contract.package.user.last_name
            customer_name.value =contract.couple ? contract.couple.userprofile.user.first_name + " " + contract.couple.userprofile.user.last_name : contract.vendor.userprofile.user.first_name + " " + contract.vendor.userprofile.user.last_name
            admin_name.value =contract.package.admin ? contract.package.admin.userprofile.user.first_name + " " + contract.package.admin.userprofile.user.last_name : ""
            contract_role.value=contract.couple ? "couple" : "vendor"
            category.value=contract.package.category.name
            start_date.value = formatDate(contract.startdate)
            end_date.value = formatDate(contract.enddate)
            created_at.value=formatDate(contract.created_at)
            package_name.value=contract.package.name
            final_budget.value= contract.final_budget
            deposit_budget.value= contract.deposit_amt
            deposte_date.value= contract.deposte_date
            termconditions.value= contract.termconditions
            additional_srvcs.value = contract.additional_srvcs
            retainer.value = contract.retainer;
            contracted_services.value = contract.contracted;
            expiration.value = contract.expiration;
            documentation.value = contract.documentation;
            hotel_accommodations.value = contract.hotel_accom;
            destination.value = contract.destination;
            attire.value = contract.attire;
            liability.value = contract.liability;
            cancellation_policy.value = contract.cancellation;
            postponement_policy.value = contract.postponement;
            responsibility.value = contract.responsibility;
            overtime.value = contract.overtime;
            contracted_vendor_payments.value = contract.contracted_payments;
            damage_loss_accessories.value = contract.damage;
            schedule_method.value = contract.schedule;
            attorney.value = contract.attorney;
            appropriate_conduct.value = contract.safe_working;

            if(contract.contract_file){attached_files.value = BASE_URL + contract.contract_file}
            if (contract.city){location.value = contract.city.city  + "," + contract.state.state + "," + contract.country.country}
            
            signature_imge.value = contract.vendor_sign
            c_signature_imge.value = contract.couple_sign
            admin_signature_imge.value = contract.admin_sign
            contract_users.value= contract.contract_users

            booking_id.value = contract.booking.id
            check_role.value=response.data.admin_role

        fullpageloader.value = false
             
        }

        if(signature_imge.value && c_signature_imge.value){
            active_status.value="Active"
        }



  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
contract_listing();

const vendor_sign =ref("");
async function edit_contract() {
  try {
    const formData = new FormData();
    formData.append("action",'edit_contract');
    formData.append("contractid",contractid);
    if (vendor.value || admin.value){
        formData.append("vendor_sign",vendor_sign.value);
        formData.append("v_signature",signature_imge.value);
        formData.append("user_current_role",'vendor');
    }
    else{
        formData.append("c_signature",c_signature_imge.value);
        formData.append("user_current_role",'customer');
    }

    fullpageloader.value = true
    const response = await axios.post(`/home/single_contract`, formData, config);
    if (response.data.status == 'SAVED') {
        console.log(response.data,"response")
        const contract: any          = response.data.contract_id
        window.location.reload();

        // myerrors.value="You have successfully signed the contract."
        // showSuccessMessage.value = true;

        // setTimeout(() => { 
        //     fullpageloader.value = false;
        //      showSuccessMessage.value = false; 
        //      window.location.reload();
        // }, 2000);

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const vendorName = ref('');
const dataUrl1 = ref('');
const dataUrl2 = ref('');
const customerName = ref('');

// const generateSignature = () => {
//     if (!vendorName.value.trim()) {
//         alert('Please enter a valid name.');
//         return;
//     }

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     canvas.width = 400; // Adjust as needed
//     canvas.height = 200; // Adjust as needed

//     // Set the background color to white
//     ctx.fillStyle = '#FFFFFF'; // White background
//     ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas

//     ctx.fillStyle = '#000'; // Signature color
//     // ctx.font = '48px cursive'; // Signature-like font
//     ctx.font = '48px "Great Vibes", cursive';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';

//     ctx.fillText(vendorName.value, canvas.width / 2, canvas.height / 2);

//     dataUrl1.value = canvas.toDataURL('image/png'); // Correctly set the value

//     console.log('check the value of the data url ------------', dataUrl1.value);

//     // Access vueSignature component and set the data
//     if (vendorSignature.value) {
//         // Check if the save method exists
//         if (vendorSignature.value) {
//             signature_imge.value = dataUrl1.value
//             vendorSignature.value.save(dataUrl1.value); // Use the ref value directly
//         } else {
//             console.error('The save method is not defined on vueSignature.');
//         }
//     } else {
//         console.error('vueSignature component not found in refs.');
//     }
// };


const generateSignaturev = () => {
    if (!vendorName.value.trim()) {
        alert('Please enter a valid name.');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 600; 
    canvas.height = 200; 

    ctx.fillStyle = '#FFFFFF'; // Set the background color to white (optional)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the signature color
    ctx.fillStyle = '#000'; // Black color for signature

    // Use a cursive font for a more natural handwritten look
    ctx.font = '50px "Brush Script MT", cursive'; // Customize font size and type

    // Add some text styles for realism (letter spacing, skewing)
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.textBaseline = 'middle'; // Center the text vertically

    // Apply a slight skew to make it look more handwritten
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Set a slight random letter spacing for realism
    const randomLetterSpacing = (Math.random() * 2 - 1); // Random spacing between -1px and 1px
    let startX = canvas.width / 2;

    const totalTextWidth = vendorName.value
        .split('')
        .reduce((width, char) => width + ctx.measureText(char).width, 0);

    // Adjust startX to ensure the text is centered
    startX -= totalTextWidth / 2;
    
    for (let i = 0; i < vendorName.value.length; i++) {
        ctx.fillText(vendorName.value[i], startX, canvas.height / 2);
        startX += ctx.measureText(vendorName.value[i]).width + randomLetterSpacing;
    }

    // Generate base64 data URL from the canvas
    dataUrl1.value = canvas.toDataURL('image/png');

    console.log('check the value of the data url ------------', dataUrl1.value);

    // Access vueSignature component and set the data
    if (vendorSignature.value) {
        // Check if the save method exists
        if (typeof vendorSignature.value.save === 'function') {
            signature_imge.value = dataUrl1.value;
            vendorSignature.value.save(dataUrl1.value); // Use the ref value directly
        } else {
            console.error('The save method is not defined on vueSignature.');
        }
    } else {
        console.error('vueSignature component not found in refs.');
    }
};

const generateSignaturec = () => {
    if (!customerName.value.trim()) {
        alert('Please enter a valid name.');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 600; 
    canvas.height = 200; 

    ctx.fillStyle = '#FFFFFF'; // Set the background color to white (optional)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the signature color
    ctx.fillStyle = '#000'; // Black color for signature

    // Use a cursive font for a more natural handwritten look
    ctx.font = '50px "Brush Script MT", cursive'; // Customize font size and type

    // Add some text styles for realism (letter spacing, skewing)
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.textBaseline = 'middle'; // Center the text vertically

    // Apply a slight skew to make it look more handwritten
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Set a slight random letter spacing for realism
    const randomLetterSpacing = (Math.random() * 2 - 1); // Random spacing between -1px and 1px
    let startX = canvas.width / 2;

    const totalTextWidth = customerName.value
        .split('')
        .reduce((width, char) => width + ctx.measureText(char).width, 0);

    // Adjust startX to ensure the text is centered
    startX -= totalTextWidth / 2;
    
    for (let i = 0; i < customerName.value.length; i++) {
        ctx.fillText(customerName.value[i], startX, canvas.height / 2);
        startX += ctx.measureText(customerName.value[i]).width + randomLetterSpacing;
    }

    // Generate base64 data URL from the canvas
    dataUrl2.value = canvas.toDataURL('image/png');

    console.log('check the value of the data url ------------', dataUrl2.value);

    // Access vueSignature component and set the data
    if (customerSignature.value) {
        // Check if the save method exists
        if (typeof customerSignature.value.save === 'function') {
            c_signature_imge.value = dataUrl2.value;
            customerSignature.value.save(dataUrl2.value); // Use the ref value directly
        } else {
            console.error('The save method is not defined on vueSignature.');
        }
    } else {
        console.error('vueSignature component not found in refs.');
    }
};


const downloadContract = () => {
  if (contract.value) {
    const element = contract.value as HTMLElement; // Ensure the correct type
    const options = {
      margin: [0.5, 0.4, 0.5, 0.4],
      filename: 'contract.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  }
};

const click_view = () => {
    if (vendor.value){
            router.push(`/vendor-booking-single-action/view/${booking_id.value}`)
     }
    else{
        if(admin.value){
            router.push(`/admin-booking-single-action/view/${booking_id.value}`)
        }
        else{
            router.push(`/booking-single/${booking_id.value}`)

        }
       
    }
};
const click_edit = () => {
    if (vendor.value){
            router.push(`/vendor-booking-single-action/accept/${booking_id.value}`)
     }
     else{
        router.push(`/admin-booking-single-action/view/${booking_id.value}`)
     }
};

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
        <v-col cols="12" md="4">
             <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-end">
            <v-btn  color="secondary" variant="outlined" 
                class="rounded-sm mr-2" size="small" @click="click_view()">
                View Booking 
            </v-btn>

            <!-- <div v-if="active_status === 'Completed'">
              
            </div>
            <div v-else> -->
                <!-- <v-btn v-if="vendor" color="secondary" @click="click_edit()" variant="outlined" class="rounded-sm mr-2" size="small">
                Edit Contract
            </v-btn>
            <v-btn v-if="admin" color="secondary" @click="click_edit()" variant="outlined" class="rounded-sm mr-2" size="small">
                Edit Contract
            </v-btn> -->
            <!-- </div> -->

           
            <v-btn color="secondary" variant="outlined" class="rounded-sm" size="small" @click="downloadContract">
                Download Contract
            </v-btn>
        </v-col>

        <v-col cols="12" >
            <v-card elevation="10" rounded="md" class=" border h-100">
                <v-card-item class="py-10">
                    <div  id="download_contract" ref="contract">
                            <div class="contract">
                                <v-row class="border-bottom  mb-5">
                                    <v-col cols="8">
                                        <h2 class="text-h4 mb-1 mt-5">{{category}} Contract</h2>
                                        <div clas>
                                            <h2 class="text-h6  mb-1 text-body-1 font-weight-regular">
                                                <span class="font-weight-semibold">Date:</span> 
                                                {{created_at}}
                                            </h2>
                                            <h2 class="text-h6  mb-1 text-body-1 font-weight-regular">
                                                <span class="font-weight-semibold">Contract Number:</span> 
                                                SGMS24783{{ contractid }}
                                            </h2>
                                            <p class="text-body-1 text-13 font-weight-regular"><span class="font-weight-semibold">Status: </span>
                                               
                                                <strong v-if="active_status === 'Active'" class="text-success">Completed</strong>
                                                <strong v-else-if="active_status === 'Completed'" class="text-success">Completed</strong>
                                                <strong v-else class="text-warning">Pending</strong>
                                            </p>
                                        </div>
                                    </v-col>
                                    <v-col cols="4" class="d-flex justify-end align-center">
                                        <div class="contractImgLogo">
                                            <img src="../../../assets/images/logos/logo-black1.png" >
                                        </div>
                                    </v-col>
                                </v-row>
                                <p class="text-body-1 text-13 font-weight-regular mb-1">This agreement ("Agreement") is made and
                                    entered into
                                    as of <strong><u>{{created_at}}</u></strong>, by and between
                                </p>
                                <p class="text-body-1 text-13 font-weight-regular mb-1"><strong><u>{{ vendor_name }}</u></strong> ("Vendor")
                                    and
                                    <strong><u>{{customer_name}}</u></strong>
                                    ("Customer")
                                    for the provision of <strong><u>{{package_name}}</u></strong> package services as detailed below:
                                </p>
                                <h2 class="text-h6  mb-1 mt-5">Services:</h2>
                                <p class="text-body-1 text-13 font-weight-regular mb-1">a. Vendor shall provide the 
                                    services for <strong><u>{{category}}</u>.</strong>
                                    </p>
                                <p v-if="start_date" class="text-body-1 text-13 font-weight-regular mb-1">b. The services will be provided on <strong><u>{{start_date}}</u></strong> at <strong><u>{{location}}</u></strong>.
                                </p>

                                <div v-if="additional_srvcs">
                                    <h2 class="text-h6  mb-1 mt-5">Additional Services:</h2>
                                    <div class="height-scroll text-body-1 text-13 font-weight-regular" v-html="additional_srvcs"></div>
                                </div>


                                <h2 class="text-h6 mb-1 mt-5"> Payment:</h2>
                                <p class="text-body-1 text-13 font-weight-regular mb-1">a. The total cost for the services
                                    outlined in Section
                                    1 is <strong><u>${{final_budget}}</u></strong> total payment.
                                </p>

                                <p class="text-body-1 text-13 font-weight-regular mb-1">b. Payment Schedule:</p>
                                    <ul class="mb-4">
                                        <li class="text-body-1 text-13 font-weight-regular mb-1"><strong><u> ${{deposit_budget}} </u></strong>deposit amount due upon
                                            signing this Agreement.</li>
                                        <li class="text-body-1 text-13 font-weight-regular mb-1">Final payment of <strong>
                                        <u>${{final_budget}}</u></strong> on  <strong><u>{{deposte_date}}</u></strong> before the event date.</li>
                                    </ul>
                                    <div v-if="retainer">
                                        <h2 v-if="retainer && retainer != 'undefined'" class="text-h6 mb-2">Retainer</h2>
                                        <p v-if="retainer != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ retainer }}
                                        </p>
                                    </div>

                                    <div v-if="contracted_services">
                                        <h2 v-if="contracted_services &&  contracted_services != 'undefined'" class="text-h6 mb-2">Contracted services </h2>
                                        <p v-if="contracted_services != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ contracted_services }}
                                        </p>
                                    </div>
                                    
                                    <div v-if="expiration">
                                        <h2 v-if="expiration && expiration != 'undefined'" class="text-h6 mb-2">Expiration</h2>
                                        <p v-if="expiration != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ expiration }}
                                        </p>
                                    </div>

                                    <div v-if="documentation">
                                        <h2 v-if="documentation && documentation != 'undefined'" class="text-h6 mb-2">Provided Documentation</h2>
                                        <p v-if="documentation != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ documentation }}
                                        </p>
                                    </div>

                                    <div v-if="hotel_accommodations">
                                        <h2 v-if="hotel_accommodations && hotel_accommodations != 'undefined'" class="text-h6 mb-2">Hotel Accommodations</h2>
                                        <p v-if="hotel_accommodations != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ hotel_accommodations }}
                                        </p>
                                    </div>

                                    <div v-if="destination">
                                        <h2 v-if="destination && destination != 'undefined'" class="text-h6 mb-2">Destination</h2>
                                        <p v-if="destination != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ destination }}
                                        </p>
                                    </div>

                                    <div v-if="attire">
                                        <h2 v-if="attire && attire != 'undefined'" class="text-h6 mb-2">Attire</h2>
                                        <p v-if="attire != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ attire }}
                                        </p>
                                    </div>

                                    <div v-if="liability">
                                        <h2 v-if="liability && liability != 'undefined'" class="text-h6 mb-2">Liability</h2>
                                        <p v-if="liability != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ liability }}
                                        </p>
                                    </div>

                                    <div v-if="cancellation_policy">
                                        <h2 v-if="cancellation_policy && cancellation_policy != 'undefined'" class="text-h6 mb-2">Cancellation Policy</h2>
                                        <p v-if="cancellation_policy != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ cancellation_policy }}
                                        </p>
                                    </div>
                                    <div v-if="postponement_policy">
                                        <h2 v-if="postponement_policy && postponement_policy != 'undefined'" class="text-h6 mb-2">Postponement Policy</h2>
                                        <p v-if="postponement_policy != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ postponement_policy }}
                                        </p>
                                    </div>

                                    <div v-if="responsibility">
                                        <h2 v-if="responsibility && responsibility != 'undefined'" class="text-h6 mb-2">Responsibility</h2>
                                        <p v-if="responsibility != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ responsibility }}
                                        </p>
                                    </div>

                                    <div v-if="overtime">
                                        <h2 v-if="overtime && overtime != 'undefined'" class="text-h6 mb-2">Overtime</h2>
                                        <p v-if="overtime != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ overtime }}
                                        </p>
                                    </div>

                                    <div v-if="contracted_vendor_payments">
                                        <h2 v-if="contracted_vendor_payments && contracted_vendor_payments != 'undefined'" class="text-h6 mb-2">Contracted Vendor and Payments</h2>
                                        <p v-if="contracted_vendor_payments != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ contracted_vendor_payments }}
                                        </p>
                                    </div>

                                    <div v-if="damage_loss_accessories">
                                        <h2 v-if="damage_loss_accessories && damage_loss_accessories != 'undefined'" class="text-h6 mb-2">Damage or Loss of Accessories</h2>
                                        <p v-if="damage_loss_accessories != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ damage_loss_accessories }}
                                        </p>
                                    </div>

                                    <div v-if="schedule_method">
                                        <h2 v-if="schedule_method && schedule_method != 'undefined'" class="text-h6 mb-2">Payment Schedule and Method</h2>
                                        <p v-if="schedule_method != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ schedule_method }}
                                        </p>
                                    </div>

                                    <div v-if="attorney">
                                        <h2 v-if="attorney && attorney != 'undefined'" class="text-h6 mb-2">Attorney</h2>
                                        <p v-if="attorney != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ attorney }}
                                        </p>
                                    </div>

                                    <div v-if="appropriate_conduct">
                                        <h2 v-if="appropriate_conduct && appropriate_conduct != 'undefined'" class="text-h6 mb-2">Appropriate Conduct/ Safe Working Environment:</h2>
                                        <p v-if="appropriate_conduct != 'undefined'" class="text-body-1 text-13 font-weight-regular mb-5">
                                            {{ appropriate_conduct }}
                                        </p>
                                    </div>
                                    

                                <h2 v-if="termconditions && termconditions != 'undefined'" class="text-h6 mb-1 mt-5">Additional instructions for agreement:</h2>
                                <div class="height-scroll text-body-1 text-13 font-weight-regular" v-html="termconditions"></div>

                                <h2 v-if="attached_files" class="text-h6 mb-1 mt-5">Attached File:</h2>

                                <a v-if="attached_files" :href="attached_files" target="_blank" class="v-btn v-btn--elevated v-theme--BLUE_THEME bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated mt-2 rounded-sm">View PDF</a>
                            </div>
                            <div class="page-break"></div>
                            <v-row class="mt-5 ">
                                <v-col v-if="customer"  cols="12" class="d-flex gap-4">
                                    <div v-if="c_signature_imge" class="borderall pa-3 rounded w-50">
                                        <div class="border-bottomnew py-3">
                                            <h2 class="text-h6 mb-1 ">Customer Name:</h2>
                                            <p  class="text-body-1 text-13 font-weight-regular">
                                                {{customer_name}}
                                            </p>
                                        </div>
                                        <div class="border-bottomnew py-3">
                                            <div class="text-h6 mb-3">Customer Signature:</div>
                                            <img v-if="c_signature_imge" :src="c_signature_imge" class="customer sameSizeSign w-100">
                                        </div>
                                        <!-- <div class="py-3">
                                            <h2 class="text-h6 mb-1">Date:</h2>
                                            <p  class="text-body-1 text-13 font-weight-regular ">
                                                19/7/2024
                                            </p>
                                        </div> -->
                                    </div>

                                    <div v-else class="borderall pa-3 rounded w-50">
                                        <div>
                                            <div class="border-bottomnew py-3">
                                                <h2 class="text-h6 mb-1">Customer Name:</h2>
                                                <p  class="text-body-1 text-13 font-weight-regular">
                                                    {{customer_name}}
                                                </p>
                                            </div>
                                            <div class="border-bottomnew py-3 d-flex align-center">
                                                <v-text-field
                                                    v-model="customerName"
                                                    variant="outlined"
                                                    placeholder="Enter your name"
                                                    color="primary"
                                                    hide-details
                                                ></v-text-field>
                                                <v-btn color="secondary" size="large" variant="flat" class="rounded-sm ml-3" @click="generateSignaturec">Convert</v-btn> 
                                            </div>
                                            <div class="border-bottomnew py-3">
                                                <div class="text-h6  mb-3"> Customer Signature:</div>
                                                    <vueSignature ref="customerSignature"
                                                    :sigOption="option"
                                                    :w="''" 
                                                    :h="'200px'" 
                                                    :disabled="disabled"
                                                    :defaultUrl="dataUrl" 
                                                    class="border rounded overflow-hidden">
                                                    </vueSignature>
                                                    <div class="mt-3">
                                                        <v-btn color="secondary" variant="flat" @click="saveSignaturec('customer')"
                                                            size="small" class="rounded-sm me-2">Save</v-btn>
                                                        <v-btn color="primary" variant="flat" @click="clearSignaturec('customer')" size="small"
                                                        class="rounded-sm">Clear</v-btn>
                                                </div>
                                            </div>
                                            <!-- <div class="py-3">
                                                <h2 class="text-h6 mb-1">Date:</h2>
                                                <p  class="text-body-1 text-13 font-weight-regular">
                                                    19/7/2024
                                                </p>
                                            </div> -->
                                        </div>
                                    </div>

                                    <div v-if="signature_imge" class="borderall pa-3 rounded w-50">
                                        <div>
                                            <div class="border-bottomnew py-3">
                                                <h2 class="text-h6 mb-1">Vendor Name: </h2>
                                                <p  class="text-body-1 text-13 font-weight-regular">
                                                {{ vendor_name }} 
                                                </p>
                                            </div>
                                            <div class="border-bottomnew py-3">
                                                <div class="text-h6 mb-3">Vendor Signature:</div>
                                                <img :src="signature_imge" class="vendor sameSizeSign w-100">
                                            </div>
                                            <!-- <div class="py-3">
                                                <h2 class="text-h6 mb-1">Date:</h2>
                                                <p  class="text-body-1 text-13 font-weight-regular">
                                                    19/7/2024
                                                </p>
                                            </div> -->
                                        </div>
                                    </div>
                                </v-col>

                                <v-col v-else cols="12" class="d-flex gap-4">

                                    <div v-if="signature_imge" class="w-50  borderall pa-3 rounded">
                                        <div>
                                            <div class="border-bottomnew py-3">
                                                <h2  class="text-h6 mb-1">Vendor Name: </h2>
                                                <p class="text-body-1 text-13 font-weight-regular">{{ vendor_name }}</p>
                                            </div>
                                            <div class="border-bottomnew py-3">
                                                <div class="text-h6 mb-3">Vendor Signature: </div>
                                                <img :src="signature_imge" class="vendor sameSizeSign w-100">
                                            </div>
                                            <!-- <div class="py-3">
                                                <h2 class="text-h6 mb-1 ">Date:</h2>
                                                <p class="text-body-1 text-13 font-weight-regular">
                                                    19/7/2024
                                                </p>
                                            </div> -->
                                        </div>
                                    </div>

                                    <div v-else class="w-50 borderall pa-3 rounded">
                                            <div class="border-bottomnew py-3">
                                                <h2 class="text-h6 mb-1 ">Vendor  Name: <span class="text-body-1 text-13 font-weight-regular">{{ vendor_name }} </span></h2>
                                                  
                                            </div>
                                            <div class="border-bottomnew py-3 d-flex align-center">
                                                <v-text-field
                                                    v-model="vendorName"
                                                    variant="outlined"
                                                    placeholder="Enter your name"
                                                    color="primary"
                                                    hide-details
                                                ></v-text-field>
                                                <v-btn color="secondary" size="large" variant="flat" class="rounded-sm ml-3" @click="generateSignaturev">Convert</v-btn> 
                                            </div>
                                            <div class="border-bottomnew py-3">
                                                <div class="text-h6 mb-3">Vendor Signature: </div>
                                                <vueSignature ref="vendorSignature"
                                                :sigOption="option"
                                                :w="''" 
                                                :h="'200px'" 
                                                :disabled="disabled"
                                                :defaultUrl="dataUrl" 
                                                class="border rounded overflow-hidden">
                                                </vueSignature>
                                                <div class="mt-3 ">
                                                    <v-btn color="secondary" variant="flat" @click="saveSignaturev('vendor')"
                                                        size="small" class="rounded-sm me-2">Save</v-btn>
                                                    <v-btn color="primary" variant="flat" @click="clearSignaturev('vendor')" size="small"
                                                        class="rounded-sm">Clear</v-btn>
                                                </div>
                                            </div>
                                            
                                            <!-- <div class="py-3">
                                                <h2 class="text-h6 mb-1">Date:</h2>
                                                <p class="text-body-1 text-13 font-weight-regular">19/7/2024</p>
                                            </div> -->
                                    </div>

                                    <div v-if="c_signature_imge" class="w-50 borderall pa-3 rounded">
                                        <div>
                                            <div class="border-bottomnew py-3">
                                                <h2 v-if="(contract_role =='vendor' || contract_role =='vendor') && (role == 'admin' || role == 'vendor')" class="text-h6 mb-1 ">Admin Name: </h2>
                                                <h2 v-else class="text-h6 mb-1 ">Customer Name: </h2>
                                                <p v-if="(contract_role =='vendor' || contract_role =='vendor') && (role == 'admin' || role == 'vendor')" class="text-body-1 text-13 font-weight-regular">
                                                    {{admin_name}}
                                                </p>
                                                <p v-else class="text-body-1 text-13 font-weight-regular ">
                                                    {{customer_name}}
                                                </p>
                                            </div>

                                            <div class="border-bottomnew py-3">
                                                <div v-if="(contract_role =='vendor' || contract_role =='vendor') && (role == 'admin' || role == 'vendor')" class="text-h6 mb-3">Admin Signature:</div>
                                                <div v-else class="text-h6 mb-3">Customer Signature:</div>
                                                <img :src="c_signature_imge" class="vendor sameSizeSign w-100">
                                            </div>
                                            
                                            <!-- <div class="py-3">
                                                <h2 class="text-h6 mb-1">Date:</h2>
                                                <p  class="text-body-1 text-13 font-weight-regular">
                                                    19/7/2024
                                                </p>
                                            </div> -->
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                    </div>

                    <div class="d-flex justify-space-between"> 
                        <div class="mt-4">
                                <v-btn  color="grey200" variant="flat" @click="goBack" class="rounded-sm">
                                    <ChevronLeftIcon size="13" class="me-1" />
                                    Back
                                </v-btn>
                            </div>
                            <div class="mt-4">
                               
                                <v-btn  color="secondary" variant="flat" @click="edit_contract()" class="rounded-sm">
                                    Save Contract
                                </v-btn>
                            </div>
                           
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>

.contract strong {
    font-weight: 600;
}
/* .sameSizeSign {
    width: 380px;
} */
.contract ul{
    margin-left: 20px;
}
.borderall {
    border: 1px solid #ccc;
}

.border-bottomnew {
    border-bottom: 1px solid #ccc;
}
.page-break {
    page-break-after: always;
}
</style>