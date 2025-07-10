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
   
   import { useEditor, EditorContent } from '@tiptap/vue-3';
   import StarterKit from '@tiptap/starter-kit';
   import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
   import 'v-calendar/dist/style.css';
   import html2pdf from 'html2pdf.js'; // Import html2pdf
   
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
   const dialog1 = ref(false);
   const radioGroup4 = ref('');
   const package_name = ref('');
   const msglink = ref('/login');
   const category = ref();
   const categoryitem = ref([]);
   const multipleValues = ref([]);
   const multipleItems = ref([]);
   const pacakgeprice = ref('');
   const advancepayment = ref('')
   const bookingavailable = ref('');
   const termconditions = ref('');
   const files = ref([]);
   const offlinefiles = ref([]);
   const path = window.location.pathname;
   const serviceId = path.split('/').pop();
   const category_name = ref('')
   const pkg_img = ref('')
   const pkg_name = ref('')
   const package_id = ref('')
   const cities = ref([])
   const pkg_price = ref('')
   const first_price = ref('')
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
   const c_view_contract = ref(false)
   const v_view_contract = ref(false)
   const c_sign=ref("");
   const v_sign=ref("");
   const c_stripe_dialog = ref(false)
   const connect_stripe = () => {
       c_stripe_dialog.value = true;
   };
   
   
   
   const dialog = ref(false);
   const dialog_role = ref('');
   
   const click_accept = (action='null',role='null',contract_id='null') => {
      dialog.value = true;
      if(role=='vendor') {
       dialog_role.value = 'vendor';
       finalprice.value="";
       advancepayment.value="";
      }
      if(role=='couple') {
       dialog_role.value = 'couple';
       finalprice.value="";
       advancepayment.value="";
      }
   
   };
   if (path.includes('accept')) {
       click_accept();
   }
   
   
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
   
   const avldate = ref()
   const strp_status = ref("");
   const booking_status = ref("");
   const final_deposit_amt = ref("");
   
   const remianing_status= ref("");
   
   
   const deposit_payemt_status= ref("");
   const full_pay_status= ref("");
   const remaining__amt = ref();
   
   const vdeposit_payemt_status= ref("no");
   const vfull_pay_status= ref("no");
   const vremaining__amt = ref();
   
   
   
   
   const fullpageloader = ref(false)
   const myerrors                      = ref('');
   const showSuccessMessage            = ref(false);
   const showErrorMessage              = ref(false);
   const finalprice                    = ref();
   const city                          = ref();
   const state                         = ref();
   const country                       = ref();
   const cityitem                      = ref([])
   const stateitem                     = ref([])
   const countryitem                   = ref([])
   const availability = ref(false);
   const availability_pay = ref(false);
   const offline_pay = ref(false);
   const coffline_pay = ref(false);
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
       
   
   
   const handleFileChangeoffline = (event) => {
       offlinefiles.value = Array.from(event.target.files); // Correctly set files array
       console.log(offlinefiles.value, "filesssssssssssss2");
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
   const v_view_link=ref("");
   const c_final_price = ref('')
   const c_final_deposit = ref('')
   const c_remaining_amt = ref()
   
   async function create_contract() {
     if (!(ivalidate())){return null}
     try {
       const formData = new FormData();
       formData.append("action",'create_contract');
       formData.append("package_id",package_id.value);
       formData.append("contract_id",view_link.value);
       formData.append("v_contract_id",v_view_link.value);
       formData.append("serviceId",serviceId);
   
   
       formData.append("couple",couple_id.value);
       formData.append("assign_vendor",assign_vendor_id.value);
       formData.append("contract_action",dialog_role.value);
   
       formData.append("finalprice",finalprice.value);
       formData.append('country', country.value['value']);   
       formData.append('state', state.value['value']);   
       formData.append('city', city.value['value']);  
       formData.append("advancepayment",advancepayment.value);
       for (let i = 0; i < files.value.length; i++) {formData.append("files[]", files.value[i]);}
       // for (let pair of formData.entries()) {
       //   console.log(pair[0] + ', ' + pair[1]);
       // }
       formData.append("addtional_srvc",getEditorText());
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
           console.log(response.data,"response. FOR CONTRACT...................")
           const contract: any          = response.data.contract_id
           setTimeout(() => { router.push(`/admin-contract-single/${contract}`)}, 3000);
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }
   
   
   const offline_note =ref("");
   const offline_amount =ref("");
   
   const coffline_note =ref("");
   const coffline_amount =ref("");
   
   const updatepack            =   ref(false)
   const clickFunModal     =   (pack: any) => {  pack.dialog = true  }

   async function gettoupdate(){
    updatepack.value        =   true
}




   function checklength(){
    if(coffline_amount.value) coffline_amount.value = (coffline_amount.value.length > 10) ? coffline_amount.value.slice(0,10).replace(/\D/g, "") : coffline_amount.value.replace(/\D/g, "");
    if(offline_amount.value) offline_amount.value = (offline_amount.value.length > 10) ? offline_amount.value.slice(0,10).replace(/\D/g, "") : offline_amount.value.replace(/\D/g, "");

    }


   // const paytype =ref("")
   async function booking_payment(action='null') {
     try {
       const formData = new FormData();
       formData.append("action",action);
       formData.append("request_amt",requestpayment.value);
       formData.append("detailreq",detailreq.value);
       formData.append("booking_id",serviceId);
       formData.append("couple_id",couple_id.value);
       formData.append("admin_id",package_owner_id.value);
       formData.append("requestpaymentradio",requestpaymentradio.value);


       if (action =='request_payment'){
        if (!(requestpayment.value)){
            showErrorMessage.value = true;
            myerrors.value = 'Please fill all required fields!';
            setTimeout(() => {  showErrorMessage.value = false; }, 3000);
            return
        }
    }

   
      if (action =='offline_paymentv'){

            if (!(offline_amount.value)){
                showErrorMessage.value = true;
                myerrors.value = 'Please fill all required fields!';
                setTimeout(() => {  showErrorMessage.value = false; }, 3000);
                return
            }

           formData.append("ovendor_id",assign_vendor_id.value);
           formData.append("offline_amount",offline_amount.value);
           formData.append("offline_note",offline_note.value);
           formData.append("offline_adminvendor",'offline_adminvendor');
   
           for (let i = 0; i < offlinefiles.value.length; i++) {
             formData.append("offlinefiles[]", offlinefiles.value[i]);
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
           formData.append("offline_admincouple",'offline_admincouple');
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
           setTimeout(() => {showSuccessMessage.value=false;}, 3000);
           setTimeout(() => { window.location.reload();}, 1200);
       }
       if (response.data.status == 'offline_done') {
           availability.value = false
           fullpageloader.value=false;
           myerrors.value = 'Offline payment register successfully.';
           showSuccessMessage.value    = true;
           setTimeout(() => {showSuccessMessage.value=false;}, 3000);
           setTimeout(() => { window.location.reload();}, 1200);
       }
       
   
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }
   
   async function adminpay_payment(action='null',amount_pay=null,booking_pay_id=null) {
     try {
       const formData = new FormData();
       formData.append("action",action);
   
       if (action == 'pay_vendor') { // Added condition for clarity
          
           formData.append("admin_pay","admin_pay");
           formData.append("assign_vendor_id", assign_vendor_id.value);
           formData.append("booking_id",serviceId);
           formData.append("admin_id",package_owner_id.value);
           formData.append("requestpaymentradio",requestpaymentradio.value);
           formData.append("amount_tp_pay",requestpayment.value);
        }
   
   
        if (action == 'request_payment') { // Added condition for clarity
           formData.append("request_amt", amount_pay);
           formData.append("booking_pay_id", booking_pay_id);
           formData.append("admin_pay","admin_pay");
           formData.append("assign_vendor_id", assign_vendor_id.value);
        }
        
       formData.append("booking_id",serviceId);
       formData.append("couple_id",couple_id.value);
       formData.append("vendor_id",package_owner_id.value);
   
       const response = await axios.post(`/home/pack_payment`, formData, config);
       if (response.data.status == 'SAVED') {
           console.log(response.data,"response.dataresponse.dataresponse.dataresponse.data")
           window.location.href=response.data.s_url;
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }
   
   
   const couplename = ref('Loreal');
   const finaldeposit = ref();
   
   async function booking_req(action='null',booking_id=null,contract_id=null,end_contract_role='null') {
     try {
       const formData = new FormData();
       formData.append("action",action);
       formData.append("booking_id",booking_id);
       formData.append("contract_id",contract_id);
       formData.append("radioStatus",radioStatus.value);
       formData.append("vradioStatus",vradioStatus.value);
       formData.append("end_contract_role",end_contract_role);
   
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
           window.history.back();
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
   
   function handlePaymentRadioChange() {
       if (requestpaymentradio.value === 'Deposit') {requestpayment.value = c_final_deposit.value;} 
       else if (requestpaymentradio.value === 'remaining') {requestpayment.value = c_remaining_amt.value; }
       else if (requestpaymentradio.value === 'Full_Payment') {
           if(c_final_price.value){requestpayment.value = c_final_price.value;}
           else{requestpayment.value = pkg_price.value;}
       } else {
       requestpayment.value = null; 
       }
   }
    
   
   function  handlePaymentRadioChangev() {
       if (requestpaymentradio.value === 'Deposit') {requestpayment.value = final_deposit_amt.value;} 
       else if (requestpaymentradio.value === 'remaining') {requestpayment.value = remaining__amt.value; }
       else if (requestpaymentradio.value === 'Full_Payment') {
           if(finalprice.value){requestpayment.value = finalprice.value;}
           else{requestpayment.value = pkg_price.value;}
       } else {
       requestpayment.value = null; 
       }
   }
   
   function availability_pay_click(action="null") {
       if (action == 'pay_vendor'){requestpaymentradio.value="Add_On";handlePaymentRadioChangev()}
       else{requestpaymentradio.value="Add_on";handlePaymentRadioChange()}
   }
   
   
   const menu = ref(false);
   const menuv = ref(false);
   const radioStatus = ref('inprogress');
   const vradioStatus = ref('inprogress');
   
   
   /*-- Cards start --ASSIGN VENDORE*/
   const CardsData = ref([
       {
           id:"",
           img: "",
           vendorname: "",
           vendorprofession: "",
           profile: "",
           assign_vendor_id:"",
           
       },
     
   ]);
   
   const assign_vendor_id = ref("");
   
   
   const proposed_deposit =ref();
   const proposed_amount =ref();

   


   const handleRadioChange = (id) => {
         console.log(`Radio button selected with ID: ${id}`);
         assign_vendor_id.value = id;
       };
   
   async function assign_vendors() {
     try {
       const formData = new FormData();
       formData.append("vendor_id",assign_vendor_id.value);
       formData.append("booking_id",serviceId);
       formData.append("proposed_amount",proposed_amount.value);
       formData.append("proposed_deposit",proposed_deposit.value);
   
       
       fullpageloader.value = true
       const response = await axios.post(`/home/assign_vendors`, formData, config);
       if (response.data.status == 'SAVED') {
           myerrors.value="Booking request assign to vendor successfully!"
           showSuccessMessage.value    = true;
           setTimeout(() => {showSuccessMessage.value=false;}, 1200);
           setTimeout(() => {window.location.reload();}, 1200);
           
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }





   const assignedvendor = ref('')
   const assignedvendoremail = ref('')
   const assign_v_status = ref('')
   const offer_amt = ref('')
   const offer_deposit = ref('')
   const offer_deposit_amt = ref()
   
   
   // --------------------------------------------------------------------------------
   
   async function singlebooking() {
     try {
       const formData = new FormData();
       formData.append("user_current_role",'admin');
       formData.append("serviceId",serviceId);
       fullpageloader.value=true
       const response = await axios.post(`/home/single_booking`, formData, config);
       console.log(response.data,"hi responce all booking customer ")
   
       if (response.data.status == 'SAVED') {
           // BOOKING>>>>>>....................................
           const res: any = response.data.booking_data
           category_name.value = res.package.category.name
           pkg_img.value = res.package.package_logo === '/media/default.jpg' ? serviceimg : BASE_URL +  res.package.package_logo 
           pkg_name.value = res.package.name
           msglink.value = `/achats?march=${response.data.march}`
           cities.value = res.package.cities
           pkg_price.value = res.package.price
           first_price.value = res.package.first_price
           pkg_deposit.value = res.package.advance_payment
           pkg_deposit_amt.value = res.deposit_amount
           pkg_rembook.value = res.package.no_of_booking
           pkg_totalbook.value = res.package.no_of_booking
           package_id.value=res.package.id
           srvc_bookingdate.value = res.seldate
           srvc_bookingtime.value = res.seltimes.join(', ');
           booking_status.value = res.status
           assign_v_status.value = res.vendor_status
           console.log(assign_v_status.value,"assign_v_status.value.................")
           offer_deposit.value = res.assign_deposit
           offer_deposit_amt.value = (res.assign_price) * (res.assign_deposit/100)
           offer_amt.value = res.assign_price


           if (res.assign_vendor.length > 0) {
           const vendor = res.assign_vendor[0];
           assign_vendor_id.value = vendor.id;
           assignedvendor.value = `${vendor.userprofile.user.first_name} ${vendor.userprofile.user.last_name}`;
           assignedvendoremail.value = vendor.userprofile.user.email; 
           }

           // if (srvc_bookingdate){
           //     const startDate = formatDate(res.fromdate)
           //     const endDate = formatDate(res.todate)
           //     avldate.value = [startDate, endDate];
           // }



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
   
       
   
       // CONTRACTS>>>>>>>>............................
   
       let contract = [];
       const c_contract: any = response.data.c_contract_data
       const v_contract: any = response.data.v_contract_data
           
       
       if ((c_contract.length == 0)){
           c_view_contract.value = false
           c_final_price.value=pkg_price.value
   
           
       }
       else{
           if(c_contract.couple){
               c_view_contract.value = true
           }
           view_link.value=c_contract.id
           radioStatus.value=c_contract.action_status
           finalprice.value=c_contract.final_budget
           c_final_price.value=c_contract.final_budget
           v_sign.value = c_contract.vendor_sign
           c_sign.value = c_contract.couple_sign
           final_deposit_amt.value = c_contract.deposit_amt
           c_final_deposit.value = c_contract.deposit_amt
   
           // remaining__amt.value = parseInt(c_contract.final_budget) - parseInt(c_contract.deposit_amt)
           c_remaining_amt.value = parseInt(c_final_price.value) - parseInt(c_final_deposit.value)
   
           
           retainer.value = (c_contract.retainer=='undefined') ? '' : c_contract.retainer
           contracted_services.value = (c_contract.contracted=='undefined') ? '' : c_contract.contracted
           expiration.value = (c_contract.expiration=='undefined') ? '' : c_contract.expiration
           documentation.value = (c_contract.documentation=='undefined') ? '' : c_contract.documentation
           hotel_accommodations.value = (c_contract.hotel_accom=='undefined') ? '' : c_contract.hotel_accom
           destination.value = (c_contract.destination=='undefined') ? '' : c_contract.destination
           cancellation_policy.value = (c_contract.cancellation=='undefined') ? '' : c_contract.cancellation
           postponement_policy.value = (c_contract.postponement=='undefined') ? '' : c_contract.postponement
           responsibility.value = (c_contract.responsibility=='undefined') ? '' : c_contract.responsibility
           overtime.value = (c_contract.overtime=='undefined') ? '' : c_contract.overtime
           attire.value = (c_contract.attire=='undefined') ? '' : c_contract.attire
           liability.value = (c_contract.liability=='undefined') ? '' : c_contract.liability
           contracted_vendor_payments.value = (c_contract.contracted_payments=='undefined') ? '' : c_contract.contracted_payments
           damage_loss_accessories.value = (c_contract.damage=='undefined') ? '' : c_contract.damage
           schedule_method.value = (c_contract.schedule=='undefined') ? '' : c_contract.schedule
           attorney.value=(c_contract.attorney=='undefined') ? '' : c_contract.attorney
           appropriate_conduct.value = (c_contract.safe_working=='undefined') ? '' : c_contract.safe_working
           if(c_contract.country){country.value={'text':c_contract.country.country, 'value':c_contract.country.id}}
           if(c_contract.state){state.value= {'text':c_contract.state.state, 'value':c_contract.state.id}}
           if(c_contract.city){city.value={'text':c_contract.city.city, 'value':c_contract.city.id}}
           termconditions.value=(c_contract.termconditions=='undefined') ? '' : c_contract.termconditions
           advancepayment.value=c_contract.deposit_amt
   
           if (c_contract.additional_srvcs != 'undefined ') {
               try {const tiptapElement = document.querySelector('.tiptap');
                   if (tiptapElement) {tiptapElement.innerHTML = c_contract.additional_srvcs;
                   }
               } catch (error) {console.error("Error setting innerHTML:", error);}
           }
   
           let a       = new Date(c_contract.seldate)
           availableDates.value.push( String(new Date(a.getFullYear(), a.getMonth(), a.getDate())) )
           const eli   = document.querySelector(`[aria-label="${  a.toLocaleDateString('en-US',{ weekday:'long',year:'numeric',month:'short',day:'numeric'})  }"]`);
           if (eli) { eli.click() } else { console.log('Element not found'); }
           setTimeout(() => {  selectedTimes.value = c_contract.seltimes;    }, 500);
       }
       if ((v_contract.length == 0)){
           v_view_contract.value = false
          
       }
       else{
          
           if(v_contract.vendor){
               v_view_contract.value = true
           }
           v_view_link.value=v_contract.id
           vradioStatus.value=v_contract.action_status
           finalprice.value=v_contract.final_budget
           v_sign.value = v_contract.vendor_sign
           c_sign.value = v_contract.couple_sign
           final_deposit_amt.value = v_contract.deposit_amt
           remaining__amt.value = parseInt(v_contract.final_budget) - parseInt(v_contract.deposit_amt)
           retainer.value = v_contract.retainer
           contracted_services.value = v_contract.contracted
           expiration.value = v_contract.expiration
           documentation.value = v_contract.documentation
           hotel_accommodations.value = v_contract.hotel_accom
           destination.value = v_contract.destination
           cancellation_policy.value = v_contract.cancellation
           postponement_policy.value = v_contract.postponement
           responsibility.value = v_contract.responsibility
           overtime.value = v_contract.overtime
           attire.value = v_contract.attire
           liability.value = v_contract.liability
           contracted_vendor_payments.value = v_contract.contracted_payments
           damage_loss_accessories.value = v_contract.damage
           schedule_method.value = v_contract.schedule
           attorney.value=v_contract.attorney
           appropriate_conduct.value = v_contract.safe_working
           if(v_contract.country){country.value={'text':v_contract.country.country, 'value':v_contract.country.id}}
           if(v_contract.state){state.value= {'text':v_contract.state.state, 'value':v_contract.state.id}}
           if(v_contract.city){city.value={'text':v_contract.city.city, 'value':v_contract.city.id}}
           advancepayment.value=v_contract.deposit_amt
           termconditions.value=v_contract.termconditions
           if (v_contract.additional_srvcs){try {document.querySelector('.tiptap').innerHTML = v_contract.additional_srvcs} catch (error)
           {console.error("noo:", error);}}
           let a       = new Date(v_contract.seldate)
           availableDates.value.push( String(new Date(a.getFullYear(), a.getMonth(), a.getDate())) )
           const eli   = document.querySelector(`[aria-label="${  a.toLocaleDateString('en-US',{ weekday:'long',year:'numeric',month:'short',day:'numeric'})  }"]`);
           if (eli) { eli.click() } else { console.log('Element not found'); }
           setTimeout(() => {  selectedTimes.value = v_contract.seltimes;    }, 500);
       }
   
       // TRANSATION PAYMENTS>>>>>>>>>>///////////...................
       bookingData.value = response.data.pay_booking_data.map((elem) => ({
           "id": elem.id,
           "service": elem.booking.package.name,
           "bookingdate": formatDate(elem.created_at),
           "bookingpayment":elem.total_amt, 
           "statustext":elem.status,
           "statuscolor": elem.status === "done" ? "success" : "danger",
           "payment_type":elem.payment_type,
           "notes":elem.notes,
           "pay_status":elem.requested_byto,
           "role":elem.couple ? "couple" : "vendor",
           "name":elem.couple ? elem.couple.userprofile.user.first_name + " " + elem.couple.userprofile.user.last_name : elem.vendor.userprofile.user.first_name + " " + elem.vendor.userprofile.user.last_name,
           "email":elem.couple ? elem.couple.userprofile.user.email : elem.vendor.userprofile.user.email,
           "btn_link": `/vendor-invoice/` + elem.id,
           // "img":elem.couple ? BASE_URL + elem.couple.userprofile.profile_pic : BASE_URL + elem.vendor.userprofile.profile_pic 
           "img":elem.couple 
                   ? (elem.couple.userprofile.profile_pic ? BASE_URL + elem.couple.userprofile.profile_pic : user1)
                   : (elem.vendor ? BASE_URL + elem.vendor.userprofile.profile_pic : user1)
       }));
   
       CardsData.value = response.data.close_vendors_list.map((ven) => ({
           "id":ven.id,
           "img"                   :     (ven.userprofile.profile_pic) ? BASE_URL + ven.userprofile.profile_pic : user1,
           "vendorname"            :     ven.userprofile.user.first_name + ' ' + ven.userprofile.user.last_name,
           "vendorprofession"      :     ven.category.name, 
           "profile": `/vendor-profile/` + ven.id,
           "assign_vendor_id":ven.id,
       }));
   
   
       package_name.value               = res.package.name
       pacakgeprice.value               = res.package.price
       countryitem.value                = response.data.countries
   
   
       deposit_payemt_status.value      = response.data.deposit_pay_status
       full_pay_status.value            = response.data.full_pay_status
       remianing_status.value           = response.data.remaining_pay_status
   
       vdeposit_payemt_status.value      = response.data.vdeposit_pay_status
       vfull_pay_status.value            = response.data.vfull_pay_status
      
   
   
       setTimeout(() => { fullpageloader.value = false;}, 2000);
   
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }
   
   onMounted(() => {
         handlePaymentRadioChange(); 
         handlePaymentRadioChangev(); 
         
         singlebooking();
       });
   
   
   const errors = ref([]);
   const b_errors = ref([]);
   // const isButtonDisabled = ref(false);
   const isButtonDisabled = ref<boolean>(true);
   
   const validateAndCorrectAmount = (event:any) => {
   const finalPriceValue = parseInt(finalprice.value);
   const pkgPriceValue = parseInt(pkg_price.value);
   const MAX_BUDGET = finalPriceValue || pkgPriceValue;
   
   
   console.log(MAX_BUDGET,"MAX_BUDGETMAX_BUDGETMAX_BUDGETMAX_BUDGET")
   
   const MIN_BUDGET =1;
   
     const input = event.target as HTMLInputElement;
     let value = Number(input.value);
       console.log("iiyo___________2", value, MAX_BUDGET, MIN_BUDGET, finalprice.value)
     if (value > MAX_BUDGET || value < MIN_BUDGET) {
       isButtonDisabled.value = true;
       } else {
       isButtonDisabled.value = false;
      }
   
     if (isNaN(value)) {
       value = 0;
       errors.value = ['This field is requried.'];
     } else {
       errors.value = []; 
     }
   
     if (value < MIN_BUDGET) {
       value = MIN_BUDGET;
       errors.value.push(`Value cannot be less than ${MIN_BUDGET}.`);
       isButtonDisabled.value = true;
     } else if (value > MAX_BUDGET) {
       value = MAX_BUDGET;
       errors.value.push(`Value cannot be greater than ${MAX_BUDGET}.`);
     }
   
     input.value = value.toString();
   };
   
   
   
   const validateAndCorrectBudget = (event:any) => {  
   const MIN_BUDGET =1;
       
       console.log("final")
       const MAX_BUDGET = 100;
   
       const input = event.target as HTMLInputElement;
       let value = Number(input.value);
       console.log("iiyo___________1", value, MAX_BUDGET, MIN_BUDGET, finalprice.value ,pkg_deposit_amt.value)
       if (value > MAX_BUDGET || value < MIN_BUDGET) {
       isButtonDisabled.value = true;
       } else {
       isButtonDisabled.value = false;
       }
       if (isNaN(value)) {
       value = 0;
       b_errors.value = ['This field is requried.'];
       } else {
       b_errors.value = []; 
       }
       if (value < MIN_BUDGET) {
       value = MIN_BUDGET;
       b_errors.value.push(`Value cannot be less than ${MIN_BUDGET}.`);
       } else if (value > MAX_BUDGET) {
       value = MAX_BUDGET;
       b_errors.value.push(`Value cannot be greater than ${MAX_BUDGET}.`);
       }
       input.value = value.toString();
       isButtonDisabled.value = b_errors.value.length > 0;
    
   };
   
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
   
   
   const createdcontract = ref('contract_0');
   
   const contractlist = ref([
       {
           name: "Wedding Contract"
       },
       {
           name: "Wedding Contract"
       },
       {
           name: "Wedding Contract"
       },
   ]);
   
   const reqrules   = ref([(v: string) => !!v || 'This field is required']);
   const digitRules = ref([(v: string) => {
       if (!v) { return 'Required.'; }
       else { return (parseInt(v) > 0 && parseInt(v) < 101 ) ? true : 'Invalid value'; }
   }]);
   function checkinput() {advancepayment.value = ((parseInt(advancepayment.value) < 1) || (parseInt(advancepayment.value) > 100)) ? '' : advancepayment.value}
   
   function ivalidate(){
       // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
       // return fill_req_error( (isValidfname && isValidlname && isValidEmail && u_phone.value) ? true : false )
   
   
       // const isValidphone = digitRules.value.every((rule) => rule(advancepayment.value) === true);
       const rslt = (country.value && state.value && city.value && finalprice.value && advancepayment.value && selectedDateBook.value && selectedTimes.value)
   
   
   
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
   <div class="loader" v-if="fullpageloader">
      <span class="loader-17"> </span>
      <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
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
   <div class="d-flex justify-start">
      <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
         <ChevronLeftIcon size="13" class="me-1" />
         Back 
      </v-btn>
   </div>
   <v-card elevation="10" class="bg-grey100">
      <v-card-item class="pa-sm-6 pa-3">
         <v-row>
            <v-col cols="12" md="4">
               <v-card v-if="pkg_name" elevation="10" class="vendor-card-hover mb-4">
                  <v-card-item class="pa-4">
                     <div v-if="pkg_img" class="position-relative d-flex overflow-hidden">
                        <img :src="pkg_img" class="rounded vendormainimg imgheight">
                        <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service" size="small" label>
                           {{ category_name }}
                        </v-chip>
                        <div class="viewServiceBtn d-md-flex d-block">
                           <v-btn color="primary" :to="'/admin-edit-package/' + link" variant="flat" class="fff"
                              size="small">
                              <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                              View Package
                           </v-btn>
                        </div>
                     </div>
                     <v-row class="mt-4 mb-2 align-center">
                        <v-col cols="6" class="py-0">
                           <h4 class="text-subtitle-3 text-ellipsis font-weight-semibold textSecondary mb-0">
                              {{ pkg_name }}
                           </h4>
                        </v-col>
                        <v-col cols="6" v-if="pkg_price" class="py-0">
                           <h4   class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1 text-end">
                              ${{ pkg_price }}
                              <v-tooltip activator="parent" location="end">Current Price</v-tooltip>
                           </h4>
                           <p  v-bind="props"  class="text-m1 font-weight-semibold text-Darklight text-body-2 text-end">
                              <strike>${{first_price}}</strike>
                              <v-tooltip activator="parent" location="end">Base Price</v-tooltip>
                           </p>
                        </v-col>
                     </v-row>
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
                        <h6 v-if="pkg_deposit_amt" class="text-body-2 text-13"><span class="font-weight-semibold">Deposit :
                           </span>${{ pkg_deposit_amt }} ({{ pkg_deposit }}% of ${{pkg_price}})
                        </h6>
                     </div>
                  </v-card-item>
               </v-card>
               <v-card v-if="c_view_contract"  elevation="10" class=" border d-flex mb-4">
                  <v-card-text class="pt-3">
                     <div class="text-center mb-3 border-bottom">
                        <p class="mb-2 font-weight-semibold">Customer Contract</p>
                     </div>
                     <v-row v-if="c_final_deposit">
                        <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                           <h6  class="text-h4 mb-1 ">$ {{c_final_price}}</h6>
                           <span class="font-weight-semibold text-body-2">Final Price
                           </span>
                        </v-col>
                        <v-col cols="6" md="6" class="text-center">
                           <h6  class="text-h4 mb-1"> $ {{c_final_deposit}} </h6>
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
               <v-card v-if="v_view_contract" elevation="10" class=" border d-flex mb-4">
                  <v-card-text class="pt-3">
                     <div class="text-center mb-3 border-bottom">
                        <p class="mb-2 font-weight-semibold">Vendor Contract </p>
                     </div>
                     <v-row v-if="final_deposit_amt">
                        <v-col cols="6" md="6" class="text-center border-e-md border-primary">
                           <h6  class="text-h4 mb-1 ">$ {{finalprice}}</h6>
                           <span class="font-weight-semibold text-body-2">Final Price
                           </span>
                        </v-col>
                        <v-col cols="6" md="6" class="text-center">
                           <h6  class="text-h4 mb-1">Assign VendorContract $ {{final_deposit_amt}} </h6>
                           <span class="font-weight-semibold text-body-2">Final Up-front Amount 
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
                           <span class="font-weight-semibold text-body-2">Up-front Amount
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
                           
                              <v-card-text class="pa-4">
                                 <div class="">
                                   
                                    <div class="d-flex gap-2 flex-md-nowrap flex-wrap">

                                        


                                       <div>
                                          <img :src="couple_profile" width="20" class="customerImg"/>
                                       </div>
                                       <div class="">
                                          <h6 class="text-h6 ">{{ couple_name }}</h6>
                                          <span class="text-truncate d-flex align-center gap-2">
                                          <span class="text-truncate font-weight-medium text-Darklight">{{couple_email}}</span>
                                          </span>
                                       </div>
                                    </div>
                                    <div  class="d-flex  align-center mt-2 flex-wrap">
                                       <template v-if="c_view_contract">
                                          <v-btn v-if="c_view_contract" flat size="small" :to="'/admin-contract-single/' + view_link" color="secondary" class="rounded-sm mr-1 mb-1">
                                             <SignatureIcon size="16" class="me-1"/>
                                             View Couple Contract
                                          </v-btn>
                                          <v-btn v-if="assignedvendoremail == ''" flat size="small" color="secondary" class="rounded-sm mr-1 mb-1"
                                             @click="dialog1 = true">Assign Vendor</v-btn>
                                          <v-dialog v-if="v_sign && c_sign" v-model="availability" class="dialog-mw" size="small" :max-width="600">
                                             <template  v-slot:activator="{ props }">



                                                <v-btn v-if="radioStatus == 'complete'"  @click="availability_pay_click('payment_request')" v-bind="props" color="success" :disabled="true" variant="flat" size="small" class="rounded-sm mr-1 mb-1">
                                                   <CashIcon size="16" class="me-1"/>
                                                   Generate Invoice
                                                </v-btn>
                                                <v-btn v-else  @click="availability_pay_click('payment_request')" v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1 mb-1">
                                                   <CashIcon size="16" class="me-1"/>
                                                   Generate Invoice
                                                </v-btn>




                                             </template>
                                             <v-card class="pa-6">
                                                <div class="d-flex justify-space-between border-bottom">
                                                   <h4
                                                      class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                      Generate Invoice
                                                   </h4>
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
                                                                     <label for="Deposit">
                                                                        <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                           <v-card-item class="position-relative pa-3">
                                                                              <p class="text-Darklight font-weight-semibold">
                                                                                 Deposit
                                                                              </p>
                                                                              <p v-if="final_deposit_amt" class="text-Darklight font-weight-medium">
                                                                                 $ {{c_final_deposit}}
                                                                              </p>
                                                                              <p v-else class="text-Darklight font-weight-medium">
                                                                                 $ {{pkg_deposit_amt}}
                                                                              </p>
                                                                              <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                              <v-radio id="Deposit" color="primary" value="Deposit" class="radiofloat"></v-radio >
                                                                           </v-card-item>
                                                                        </v-card>
                                                                     </label>
                                                                  </div>
                                                               </v-col>
                                                               <v-col v-if="deposit_payemt_status === 'yes'" cols="4">
                                                                  <div >
                                                                     <label for="remaining">
                                                                        <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                           <v-card-item class="position-relative pa-3">
                                                                              <p class="text-Darklight font-weight-semibold">
                                                                                 Remaining
                                                                              </p>
                                                                              <p class="text-Darklight font-weight-medium">
                                                                                 $ {{c_remaining_amt}}
                                                                              </p>
                                                                              <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                              <v-radio id="remaining" color="primary" value="remaining" class="radiofloat"></v-radio >
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
                                                                                 $ {{c_final_price}}
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
                                                <v-btn v-if="c_view_contract == false" flat size="small" color="success" @click="click_accept('create','couple','con_id')" class="rounded-sm mr-1 mb-1">
                                                   <FilePencilIcon size="16" class="me-1"/>
                                                   Contract with couple
                                                </v-btn>
                                                <v-btn v-if="assignedvendoremail == ''" flat size="small" color="secondary" class="rounded-sm mr-1 mb-1"
                                                   @click="dialog1 = true">Assign Vendor</v-btn>
                                             </div>
                                             <div v-else>
                                                <v-btn flat size="small" color="success" @click="booking_req('accept',serviceId)" class="rounded-sm mr-1 mb-1">
                                                   <CheckIcon size="16" class="me-1"/>
                                                   Accept
                                                </v-btn>
                                                <v-btn flat size="small" color="error"
                                                   @click="booking_req('reject',serviceId)" class="rounded-sm mr-1 mb-1">
                                                   <XIcon size="16" class="me-1"/>
                                                   Decline
                                                </v-btn>
                                             </div>
                                          </div>
                                          <div v-else >
                                             <div v-if="booking_status == 'accepted'">
                                             </div>
                                             <div v-else>
                                                <v-btn flat size="small" color="success"  @click="connect_stripe()" class="rounded-sm mr-1 mb-1">
                                                   <CheckIcon size="16" class="me-1"/>
                                                   Accept
                                                </v-btn>
                                                <v-btn flat size="small" color="error"
                                                   @click="booking_req('reject',serviceId)" class="rounded-sm mr-1 mb-1">
                                                   <XIcon size="16" class="me-1"/>
                                                   Decline
                                                </v-btn>
                                             </div>
                                          </div>
                                       </div>
                                       <v-dialog v-if="v_sign && c_sign && c_view_contract"  v-model="coffline_pay" class="dialog-mw" size="small" :max-width="600">
                                          <template  v-slot:activator="{ props }">
                                             <v-btn v-if="radioStatus == 'complete'" @click="coffline_pay = true" v-bind="props" color="success" :disabled="true" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                <CashIcon size="16" class="me-1"/>
                                                Offline Payment 
                                             </v-btn>
                                             <v-btn v-else @click="coffline_pay = true" v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                <CashIcon size="16" class="me-1"/>
                                                Offline Payment 
                                             </v-btn>
                                          </template>
                                          <v-card class="pa-6">
                                             <div class="d-flex justify-space-between border-bottom">
                                                <h4
                                                   class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                   Couple Offline Payment 
                                                </h4>
                                                <v-btn icon color="" @click="coffline_pay = false" flat variant="outlined"
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
                                                   <v-btn color="error" variant="flat" class="mt-3 ms-2 rounded-sm" @click="coffline_pay = false">
                                                      Cancel
                                                   </v-btn>
                                                   <v-btn @click="booking_payment('offline_paymentc')" color="success" variant="flat" class="mt-3 ms-2 rounded-sm">
                                                      Save
                                                   </v-btn>
                                                </v-col>
                                             </v-row>
                                          </v-card>
                                       </v-dialog>
                                       <v-btn  flat size="small" color="secondary" class="rounded-sm mr-1 mb-1" :to="msglink">
                                          <MessageIcon size="16" class="me-1"/>
                                          Message 
                                       </v-btn>
                                       <!-- Dont deleet it  -->
                                       <v-menu v-model="menu" :close-on-content-click="false" anchor="top" v-if="c_view_contract && bookingData.length != 0">
                                          <template v-slot:activator="{ props }">
                                             <v-btn  flat size="small"  color="error" v-bind="props" class="rounded-sm mr-1 mb-1">
                                                <PlaystationCircleIcon size="16" class="me-1"/>
                                                End Contract
                                             </v-btn>
                                          </template>
                                          <v-card min-width="200" elevation="10">
                                             <v-card-item class="pa-2">
                                                <div class="d-flex gap-3 align-center flex-column flex-sm-row">
                                                   <v-radio-group  hide-details v-model="radioStatus" column>
                                                      <v-radio label="Pending" color="" value="pending"></v-radio>
                                                      <v-radio label="Inprogress" color="info" value="inprogress"></v-radio>
                                                      <v-radio label="On hold" color="info" value="onhold"></v-radio>
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
                                                   Connect to stripe   
                                                </h4>
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
                                                <v-btn class="bg-secondary rounded-sm" to="/admin-account-setting" text flat >
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
                                                   Create Contract with {{dialog_role}} 
                                                </h4>
                                                <v-btn icon color="" @click="dialog = false" flat variant="outlined" size="x-small"
                                                   class="bg-error">
                                                   <XIcon width="13" />
                                                </v-btn>
                                             </div>
                                             <div class="pa-0  pt-10 ">
                                                <v-row>
                                                   <v-col cols="12">
                                                      <div class="d-flex align-center flex-column flex-sm-row">
                                                         <v-radio-group 
                                                            hide-details 
                                                            v-model="createdcontract" 
                                                            inline 
                                                            class="w-100" 
                                                            @change="handlePaymentRadioChange"
                                                            >
                                                            <v-row >
                                                               <v-col cols="4" v-for="(item, index ) in contractlist">
                                                                  <div>
                                                                     <label :for="'contract_' + index">
                                                                        <!-- Contract Select Template start   
                                                                           <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                                                                                                                                       <v-card-item class="position-relative pa-3">
                                                                                                                                                                                           <p class="text-Darklight font-weight-semibold text-body-2">
                                                                                                                                                                                               Contract Name 
                                                                                                                                                                                           </p>
                                                                                                                                                                                           <p class="font-weight-medium">
                                                                                                                                                                                               {{ item.name }}
                                                                                                                                                                                           </p>
                                                                                                                                                                                           <v-radio :id="'contract_' + index" color="primary" :value="'contract_' + index" class="radiofloat"></v-radio>
                                                                                                                                                                                       </v-card-item>
                                                                                                                                                                                   </v-card> -->
                                                                        <!-- Contract Select Template end   -->
                                                                     </label>
                                                                  </div>
                                                               </v-col>
                                                            </v-row>
                                                         </v-radio-group>
                                                      </div>
                                                   </v-col>
                                                </v-row>
                                                <v-row class="">
                                                   <v-col v-if="dialog_role == 'couple'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Name 
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <VTextField hide-details="auto" disabled v-model="package_name" class="" required
                                                            placeholder="Enter Your Package Name" color="secondary"></VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'couple'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Category <span class="text-error ma-1">*</span></v-label>
                                                         <VTextField hide-details="auto" disabled v-model="category_name" class="" required
                                                            placeholder="Category" color="secondary"></VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'couple'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Name 
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <VTextField hide-details="auto" disabled v-model="couplename" class="" required
                                                            placeholder="" color="secondary"></VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'couple'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Base Price
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <VTextField v-model="pacakgeprice" hide-details="auto" disabled required placeholder="Enter Package Price" color="secondary" type="number">
                                                         </VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'couple'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit Percentage
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <v-text-field  disabled v-model="finaldeposit" variant="outlined" color="secondary" type="number"
                                                            placeholder="Enter Payment" hide-details>
                                                         </v-text-field>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'vendor'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Offer Price
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <VTextField disabled :value="offer_amt" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number">
                                                         </VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col v-if="dialog_role == 'vendor'" cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Up-front Amount
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <v-text-field disabled :value="offer_deposit" variant="outlined" color="secondary" type="number"
                                                            placeholder="Enter Payment" hide-details>
                                                         </v-text-field>
                                                      </div>
                                                   </v-col>
                                                   <v-col cols="12" sm="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Price
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <VTextField v-model="finalprice" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number" :rules="reqrules">
                                                         </VTextField>
                                                      </div>
                                                   </v-col>
                                                   <v-col cols="12" sm="6">
                                                      <div class="">
                                                         <v-label v-if="dialog_role == 'vendor'" class="text-subtitle-1 font-weight-medium pb-2">Up front amount
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <v-label v-else class="text-subtitle-1 font-weight-medium pb-2">Final Deposit Percentage
                                                            <span class="text-error ma-1">*</span>
                                                         </v-label>
                                                         <v-text-field v-model="advancepayment" variant="outlined" color="secondary" type="number" placeholder="Enter Payment" hide-details @keyup="checkinput()">
                                                            <template v-slot:prepend-inner>
                                                               <PercentageIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                                            </template>
                                                         </v-text-field>
                                                      </div>
                                                   </v-col>
                                                   <!-- COUNTRY STATES CITIES -->
                                                   <v-col cols="12" md="6">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                                         <v-select v-model="country" :items="countryitem" item-title="text"
                                                            item-value="value" label="Select Country" single-line variant="outlined"
                                                            hide-details @update:modelValue="getstate()" return-object required  :rules="reqrules">
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
                                                   <!-- COUNTRY STATES CITIES  END -->
                                                   <!-- <v-col cols="12" class="bookingModalStyle ">
                                                      <v-label
                                                          class="font-weight-medium mb-2 ">Event
                                                          Date</v-label><br>
                                                      
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
                                                               </v-row>
                                                               
                                                            </v-col>
                                                            <v-col cols="12" md="5" v-if="timeSlotMain">
                                                               <v-label class="font-weight-medium mb-2 d-block">Time
                                                                  Slots<span class="text-error ma-1">*</span>
                                                               </v-label>
                                                               <v-card elevation="10">
                                                                  <v-card-item class="pa-2">
                                                                     <v-row class="ma-n1 timeSlotScroll">
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
                                                      <v-label
                                                         class="font-weight-medium mb-2 d-block">
                                                         Additional Services
                                                      </v-label>
                                                      <div class="rounded custom-border">
                                                         <div v-if="editor">
                                                            <EditorMenubar :editor="editor" />
                                                         </div>
                                                         <editor-content :editor="editor"  ref="editorContentRef" />
                                                      </div>
                                                   </v-col>
                                                   <v-col cols="12" sm="12">
                                                      <div class="">
                                                         <v-label class="text-subtitle-1 font-weight-medium pb-2">Additional instructions for agreement
                                                         </v-label>
                                                         <v-textarea v-model="termconditions" outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                                            color="secondary"></v-textarea>
                                                      </div>
                                                   </v-col>
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
                                                   <v-col cols="12" sm="12">
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
                                                            multiple
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
                                                <v-btn class="bg-secondary rounded-sm" @click="create_contract()" text flat >
                                                   Send
                                                </v-btn>
                                             </v-card-actions>
                                          </v-card>
                                       </v-dialog>
                                    </div>
                                 </div>
                              </v-card-text>

                              <template v-if="radioStatus == 'complete'">
                                            <v-btn  size="x-small" color="error"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                            Complete Contract
                                             <v-tooltip activator="parent" location="top">Contract status: Completed</v-tooltip>
                                            </v-btn>

                                        </template>
                              <template v-else>


                                <template  v-if="v_sign && c_sign && c_view_contract">
                                        <v-btn  size="x-small" color="success"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                        <p color="success">Active Contract 
                                                <v-tooltip activator="parent" location="top">Contract has been signed by both parties.</v-tooltip>
                                            </p>
                                            </v-btn>
                                </template>
                                <template v-else>

                                        <v-btn v-if="c_view_contract" size="x-small" color="primary"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                    Inprogress
                                        <v-tooltip activator="parent" location="top">Awaiting signature from couple side</v-tooltip>
                                        </v-btn>    
                                </template>
                              </template>

                           </v-card>
                           <div v-if="booking_status == 'accepted'">
                              <v-dialog v-model="dialog1" scrollable class="dialog-mw" :max-width="550">
                                 <v-card class="pa-6">
                                    <div class="d-flex justify-space-between mb-4">
                                       <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                          Assign Vendor Management
                                       </h4>
                                       <v-btn icon color="" @click="dialog1 = false" flat variant="outlined"
                                          size="x-small" class="bg-error">
                                          <XIcon width="13" />
                                       </v-btn>
                                    </div>
                                    <!-- <span >
                                       <v-text-field class="custom-input-style customInput" color="secondary"
                                          v-model="searchValue" append-inner-icon="mdi-magnify"
                                          placeholder="Search" hide-details density="compact"
                                          @click:append-inner="searchit()"></v-text-field>
                                    </span> -->
                                    <v-row class="mt-3">
                                       <v-col cols="12" md="6">
                                          <v-label class="font-weight-medium mb-2 ">Offer Amount<span class="text-error ma-1">*</span></v-label>
                                          <v-text-field
                                             v-model="proposed_amount"
                                             :error-messages="errors"
                                             variant="outlined"
                                             type="number"
                                             placeholder="Enter Deposit"
                                             hide-details
                                             @input="validateAndCorrectAmount"
                                             :rules='reqrules' required
                                             ></v-text-field>
                                          <span class="text-error text-body-1 mt-1" v-if="errors.length > 0">
                                          {{ errors[errors.length - 1] }}
                                          </span>
                                       </v-col>
                                       <v-col cols="12" md="6">
                                          <v-label class="font-weight-medium mb-2 ">Up-front Amount (%)<span class="text-error ma-1">*</span></v-label>
                                          <v-text-field
                                             v-model="proposed_deposit"
                                             :error-messages="errors"
                                             variant="outlined"
                                             type="number"
                                             placeholder="Enter Deposit"
                                             hide-details
                                             @input="validateAndCorrectBudget"
                                             :rules='reqrules' required
                                             ></v-text-field>
                                          <span class="text-error text-body-1 mt-1" v-if="b_errors.length > 0">
                                          {{ b_errors[b_errors.length - 1] }}
                                          </span>
                                       </v-col>
                                    </v-row>
                                    <v-card-body class="pa-0 mt-0 pt-4  height-sets scroll-style pe-4">
                                       <v-radio-group hide-details v-model="radioGroup4" class="w-100">
                                          <v-row>
                                             <v-col cols="12" sm="6" md="6" v-for="(cards, index) in CardsData" :key="cards.id">
                                                <v-card elevation="10">
                                                   <v-card-item class="pa-3 py-5">
                                                      <label :for="cards.id">
                                                         <div class="">
                                                            <div class="d-flex ">
                                                               <v-avatar size="50" class="rounded-sm mt-2">
                                                                  <img :src="cards.img" width="50" />
                                                               </v-avatar>
                                                               <div class="ps-2">
                                                                  <h6 class="text-body-1 font-weight-semibold text-primary text-capitalize">
                                                                     {{ cards.vendorname }}
                                                                  </h6>
                                                                  <p class="text-truncate vendor_m text-Darklight font-weight-medium text-body-2">
                                                                     {{ category_name }}
                                                                  </p>
                                                                  <v-btn :to="cards.profile"  color="primary" class="align-center mt-1 rounded-sm" flat size="x-small">
                                                                     View Profile
                                                                  </v-btn>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </label>
                                                      <v-radio 
                                                         :id="cards.id"
                                                         v-model="assign_vendor_id" 
                                                         class="radio-tick radio_btn contract1" 
                                                         color="secondary" 
                                                         :value="cards.id"
                                                         @change="handleRadioChange(cards.id)"
                                                         ></v-radio>

                                                        
                                                   </v-card-item>
                                                </v-card>
                                             </v-col>
                                          </v-row>
                                       </v-radio-group>
                                    </v-card-body>
                                    <v-card-actions class="px-0 pe-2 d-flex justify-end w-100">
                                       <v-btn class="bg-error" text @click="dialog1 = false" flat size="small">
                                          Close
                                       </v-btn>
                                       <v-btn class="bg-secondary" :disabled="isButtonDisabled" @click="assign_vendors()" text flat size="small">
                                          Assign 
                                       </v-btn>
                                    </v-card-actions>
                                 </v-card>
                              </v-dialog>
                           </div>
                           <v-row  v-if="assignedvendoremail != '' " class="mb-4">
                              <v-col cols="12" md="12" class="pb-0">
                                 <v-card elevation="10" class="border bg-lightprimary border border-primary overflow-hidden">

                                    
                                 

                                    <v-btn v-if="assign_v_status == 'requested'" @click="dialog1 = true"  flat size="small" color="secondary" class="rounded-sm mr-1  mb-1">
                                    <UserIcon size="16" class="me-1"/>
                                                Re-assign Vendor
                                    </v-btn>


                                    <v-btn size="x-small" color="error"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                       <p  color="error" v-if="assign_v_status == 'assign'">Requested</p>
                                       <p v-else>
                                          <template v-if="vradioStatus == 'complete'">
                                            <v-btn  size="medium" color="error"  class="rounded-0 cursor-default"  :ripple="false" elevation="0">
                                            Complete Contract
                                             <v-tooltip activator="parent" location="top">Contract status: Completed</v-tooltip>
                                            </v-btn>
                                          </template>
                                          <template v-else>
                                            <p color="success" v-if="(assign_v_status == 'accepted' && (v_sign || c_sign))">Active Contract
                                                <v-tooltip activator="parent" location="top">Contract has been signed by both parties.</v-tooltip>
                                            </p>
                                            <p color="success" v-else>{{assign_v_status}}
                                              <v-tooltip activator="parent" location="top">Waiting for approval</v-tooltip>
                                            </p>
                                            <template v-if="((assign_v_status == 'accepted') && (v_sign && c_sign))">
                                                <v-btn  size="x-small" color="success"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                Active Contract
                                                <v-tooltip activator="parent" location="top">Contract has been signed by both parties.</v-tooltip>
                                                </v-btn>
                                            </template>
                                            <template v-else>
                                                <template v-if="assign_v_status == 'accepted'">
                                                    <v-btn v-if="v_view_contract" size="x-small" color="primary"  class="rounded-0 cursor-default floatStatus"  :ripple="false" elevation="0">
                                                    Inprogress
                                                    <v-tooltip activator="parent" location="top">Awaiting signature from both parties.</v-tooltip>
                                                    </v-btn>
                                                </template>
                                                <template v-else>
                                                    <v-btn v-if="assign_v_status  == 'accepted'" flat  color="" class=" text-dark rounded-sm text-success float-accept cursor-default" :ripple="false" variant="tonal" >
                                                    <CircleCheckIcon size="16" class="me-1"/>
                                                    Request Accepted
                                                    </v-btn>
                                                </template>
                                            </template>
                                         </template>
                                       </p>  
                                    </v-btn>



                                    <v-card-item class="pa-4">
                                       <v-row class="">
                                          <v-col cols="12" md="auto" class="pe-0 pb-0">
                                             <v-avatar size="50" class="rounded-sm mt-0">
                                                <img :src="user1" width="50" />
                                             </v-avatar>
                                          </v-col>
                                          <v-col cols="12" md="5" class="pb-0">
                                             <div class="">
                                                <h6 class="text-body-1 font-weight-semibold text-primary text-capitalize">
                                                   {{ assignedvendor }}
                                                   <v-chip color="primary" size="x-small" class="font-weight-semibold">
                                                      <ChecksIcon class="me-1" start size="15" />
                                                      Assigned
                                                   </v-chip>
                                                </h6>
                                                <p class="vendor_m text-Darklight font-weight-medium text-body-2 ">
                                                   {{ assignedvendoremail }}
                                                </p>
                                                <!-- .........end_contract ........-->
                                             </div>
                                          </v-col>
                                          <v-col cols="12" md="auto" class="pb-0">
                                             <div class="">
                                                <p class=" text-Darklight font-weight-medium text-body-2">
                                                   Offer price :  <span class="font-weight-semibold text-body-1">$ {{offer_amt}}</span>
                                                </p>
                                                <p class=" text-Darklight font-weight-medium text-body-2">
                                                   Up-front Amount : <span class="font-weight-semibold text-body-1">${{offer_deposit_amt}} ({{offer_deposit}} %)</span>
                                                </p>
                                             </div>
                                          </v-col>

                                          <v-col cols="12" class="pt-2">
                                             <v-btn v-if="(assignedvendoremail != '' && assign_v_status ==='accepted') && v_view_contract == false" flat size="small" color="success" @click="click_accept('create','vendor','con_id')" class="rounded-sm mr-1 mb-1">
                                                <FilePencilIcon size="14" class="me-1"/>
                                                Contract with vendor
                                             </v-btn>
                                             <v-btn v-if="v_view_contract" flat size="small" :to="'/admin-contract-single/' + v_view_link" color="secondary" class="rounded-sm mr-1  mb-1">
                                                <SignatureIcon size="16" class="me-1"/>
                                                View Vendor Contract
                                             </v-btn>
                                             <!-- ........here pay code vendor start ........... -->
                                             <v-dialog v-if="v_sign && c_sign && v_view_contract" v-model="availability_pay" class="dialog-mw" size="small" :max-width="600">
                                                <template  v-slot:activator="{ props }">



                                                   <v-btn v-if="vradioStatus == 'complete'" @click="availability_pay_click('pay_vendor')" v-bind="props" color="success" variant="flat" :disabled="true" size="small" class="rounded-sm mr-1  mb-1">
                                                      <CashIcon size="16" class="me-1"/>
                                                      Pay vendor
                                                   </v-btn>
                                                   <v-btn v-else @click="availability_pay_click('pay_vendor')" v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                      <CashIcon size="16" class="me-1"/>
                                                      Pay vendor
                                                   </v-btn>



                                                </template>
                                                <v-card class="pa-6">
                                                   <div class="d-flex justify-space-between border-bottom">
                                                      <h4
                                                         class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                         Vendor Payment
                                                      </h4>
                                                      <v-btn icon color="" @click="availability_pay = false" flat variant="outlined"
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
                                                               @change="handlePaymentRadioChangev"
                                                               >
                                                               <v-row >
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
                                                                  <v-col cols="4" v-if="vdeposit_payemt_status === 'no' && vfull_pay_status === 'no'" >
                                                                     <div>
                                                                        <label for="Deposit">
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
                                                                                 <v-radio id="Deposit" color="primary" value="Deposit" class="radiofloat"></v-radio >
                                                                              </v-card-item>
                                                                           </v-card>
                                                                        </label>
                                                                     </div>
                                                                  </v-col>
                                                                  <v-col v-if="vdeposit_payemt_status === 'yes'" cols="4">
                                                                     <div >
                                                                        <label for="remaining">
                                                                           <v-card elevation="10" class="border bg-lightprimary border-secondary">
                                                                              <v-card-item class="position-relative pa-3">
                                                                                 <p class="text-Darklight font-weight-semibold">
                                                                                    Remaining
                                                                                 </p>
                                                                                 <p class="text-Darklight font-weight-medium">
                                                                                    ${{remaining__amt}}
                                                                                 </p>
                                                                                 <v-chip size="x-small" color="primary" class="text-body-2 font-weight-medium mt-2">Pending</v-chip>
                                                                                 <v-radio id="remaining" color="primary" value="remaining" class="radiofloat"></v-radio >
                                                                              </v-card-item>
                                                                           </v-card>
                                                                        </label>
                                                                     </div>
                                                                  </v-col>
                                                                  <v-col v-if="vfull_pay_status === 'no' && vdeposit_payemt_status === 'no'" cols="4">
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
                                                               </v-row>
                                                            </v-radio-group>
                                                         </div>
                                                      </v-col>
                                                      <v-col cols="12" sm="12">
                                                         <div>
                                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Amount</v-label>
                                                            <v-text-field 
                                                               v-model="requestpayment" 
                                                               variant="outlined" 
                                                               color="secondary"
                                                               type="number" 
                                                               placeholder="Enter payment amount" 
                                                               hide-details
                                                               :disabled="isRequestPaymentDisabled"
                                                               >
                                                            </v-text-field>
                                                         </div>
                                                      </v-col>
                                                      <v-col cols="12" class="d-flex justify-end">
                                                         <v-btn v-bind="props" color="error" variant="flat" class="mt-3 ms-2 rounded-sm" @click="availability_pay = false">
                                                            Cancel
                                                         </v-btn>
                                                         <v-btn v-bind="props" @click="adminpay_payment('pay_vendor')" color="success" variant="flat" class="mt-3 ms-2 rounded-sm">
                                                            Pay vendor 
                                                         </v-btn>
                                                      </v-col>
                                                   </v-row>
                                                </v-card>
                                             </v-dialog>
                                             <v-dialog v-if="v_sign && c_sign && v_view_contract"  v-model="offline_pay" class="dialog-mw" size="small" :max-width="600">
                                                <template  v-slot:activator="{ props }">
                                                   <v-btn v-if="vradioStatus == 'complete'"  @click="offline_pay = true" v-bind="props" color="success" :disabled="true" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                      <CashIcon size="16" class="me-1"/>
                                                      Offline Payment 
                                                   </v-btn>
                                                   <v-btn v-else  @click="offline_pay = true" v-bind="props" color="success" variant="flat" size="small" class="rounded-sm mr-1  mb-1">
                                                      <CashIcon size="16" class="me-1"/>
                                                      Offline Payment 
                                                   </v-btn>
                                                </template>
                                                <v-card class="pa-6">
                                                   <div class="d-flex justify-space-between border-bottom">
                                                      <h4
                                                         class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                        Vendor Offline Payment
                                                      </h4>
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
                                                               v-model="offline_amount" 
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
                                                            <v-textarea v-model="offline_note"  variant="outlined" placeholder="" rows="3" color="secondary" row-height="25" shapedhide-details></v-textarea>
                                                         </div>
                                                      </v-col>
                                                      <v-col cols="12" sm="12">
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
                                                         <v-btn v-bind="props" color="error" variant="flat" class="mt-3 ms-2 rounded-sm" @click="offline_pay = false">
                                                            Cancel
                                                         </v-btn>
                                                         <v-btn @click="booking_payment('offline_paymentv')" color="success" variant="flat" class="mt-3 ms-2 rounded-sm">
                                                            Save
                                                         </v-btn>
                                                      </v-col>
                                                   </v-row>
                                                </v-card>
                                             </v-dialog>
                                             <v-btn  flat size="small" color="secondary" class="rounded-sm mr-1  mb-1" :to="msglink">
                                                <MessageIcon size="16" class="me-1"/>
                                                Message 
                                             </v-btn>
                                             <v-menu v-model="menuv" :close-on-content-click="false" anchor="top" v-if="v_view_contract && bookingData.length != 0">
                                                <template v-slot:activator="{ props }">
                                                   <v-btn  flat size="small"  color="error" v-bind="props" class="rounded-sm mr-1 mb-1">
                                                      <PlaystationCircleIcon size="16" class="me-1"/>
                                                      End Contract 
                                                   </v-btn>
                                                </template>
                                                <v-card min-width="200" elevation="10">
                                                   <v-card-item class="pa-2">
                                                      <div class="d-flex gap-3 align-center flex-column flex-sm-row">
                                                         <v-radio-group  hide-details v-model="vradioStatus" column>
                                                            <v-radio label="Pending" color="" value="pending"></v-radio>
                                                            <v-radio label="Inprogress" color="info" value="inprogress"></v-radio>
                                                            <v-radio label="On hold" color="info" value="onhold"></v-radio>
                                                            <v-radio label="Completed" color="success" value="complete"></v-radio>
                                                         </v-radio-group>
                                                      </div>
                                                      <div class="d-flex justify-start gap-2 py-3 px-4">
                                                         <v-btn color="error"  size="small" text @click="menu = false" class=" rounded-sm"> cancel </v-btn>
                                                         <v-btn color="success"  size="small" text @click="booking_req('end_contract',serviceId,v_view_link,'vendor')" class="bg-success rounded-sm"> Save </v-btn>
                                                      </div>
                                                   </v-card-item>
                                                </v-card>
                                             </v-menu>
                                          </v-col>
                                       </v-row>
                                    </v-card-item>
                                 </v-card>
                              </v-col>
                           </v-row>
                           <v-card elevation="10" class="mb-0">
                              <v-card-item class="pa-sm-6 pa-3">
                                 <div :class="{ 'setHeightonThis': assignedvendoremail !== '', 'removeHeight': c_view_contract, 'fullHeigthSet': v_view_contract }">
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
                                       <v-col cols="12" sm="6" class=" d-flex text-sm-end order-sm-2 order-1 flex-column">
                                          <h2 class=" mb-0 text-h2 text-secondary font-weight-bold text-capitalize">
                                             $ {{srvc_budget}} 
                                             <!-- (${{ pkg_deposit_amt }}) -->
                                          </h2>
                                          <span
                                             class="v-list-item-title text-body-1 mb-1 font-weight-medium text-capitalize text-secondary">
                                          Deposit Amount 
                                          </span>
                                       </v-col>
                                    </v-row>
                                    <div>
                                       <div class="mb-3">
                                          <h2
                                             class="v-list-item-title text-h6 mb-1 font-weight-medium text-capitalize">
                                             Description
                                          </h2>
                                          <div v-if="(booking_status == 'accepted') || assignedvendoremail != '' " class="body-text-5 border pa-3 rounded content-style  contentHeightnew scroll-style " v-html="srvc_terms">
                                          </div>
                                          <div v-else class="body-text-5 border pa-3 rounded content-style  contentHeightnoteccept scroll-style " v-html="srvc_terms">
                                          </div>
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
         <v-row   class="mt-0">
            <v-col cols="12">
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
                                       Details
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">
                                       Role
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                       Date
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment
                                       Type
                                    </th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Payment
                                       Status
                                    </th>
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
                                             <img :src="item.img" width="40" />
                                          </v-avatar>
                                          <div class="mx-3">
                                             <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">
                                                {{ item.name }}
                                             </h4>
                                             <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                {{item.email}}
                                             </h6>
                                             <v-btn color="grey200" class="mt-1 rounded-sm" size="small" @click="gettoupdate" v-if="item.notes">
                                                Note 
                                                <!-- <QuestionMarkIcon size="15"/>
                                                <v-tooltip activator="parent" location="top">
                                                         {{ item.notes}}
                                                      </v-tooltip> -->
                                             </v-btn>
                                             <v-dialog v-model="updatepack" scrollable class="dialog-mw" :max-width="600">
                                                <v-card class="pa-6">
                                                   <div class="">
                                                      <!-- <p>abcd</p> -->
                                                      {{ item.notes}}
                                                   </div> 
                                                   <v-card-actions class="px-0 pb-0 d-flex justify-end w-100 mt-8">
                                                      <v-btn class="bg-error rounded-sm" text @click="updatepack=!updatepack" flat>
                                                         Close
                                                      </v-btn>
                                                   </v-card-actions>
                                                </v-card>
                                             </v-dialog>
                                          </div>
                                       </div>
                                    </td>
                                    <td>
                                       <h5 class="text-no-wrap text-body-1">
                                          {{ item.role }}
                                       </h5>
                                    </td>
                                    <td>
                                       <h5 class="text-no-wrap text-body-1">
                                          {{ item.service }}
                                       </h5>
                                    </td>
                                    <td>
                                       <h5 class="text-no-wrap text-body-1">
                                          $ {{ item.bookingpayment }}
                                       </h5>
                                    </td>
                                    <td>
                                       <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                          {{ item.bookingdate }}
                                       </h5>
                                       <!-- <p class="text-body-2">{{ item.bookingtime }}</p> -->
                                    </td>
                                    <td>
                                       <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                          {{ item.payment_type }}
                                       </h5>
                                    </td>
                                    <td>
                                       <v-chip rounded="md" class="ma-2 font-weight-semibold"
                                          :color="item.statuscolor" size="small" label>{{
                                          item.statustext }}
                                       </v-chip>
                                    </td>
                                    <td v-if="item.statustext == 'pending' && item.role == 'vendor'">
                                       <h5 class="text-no-wrap text-body-1">
                                          <v-btn color="success"  @click="adminpay_payment('request_payment',item.bookingpayment,item.id)" variant="flat" size="small" class="rounded-sm mr-1">Pay 
                                          </v-btn>
                                       </h5>
                                    </td>
                                    <td v-else>
                                       <h5 class="text-no-wrap text-body-1">
                                          <v-tooltip text="View Invoice">
                                             <template v-slot:activator="{ props }">
                                                <v-btn icon flat v-bind="props" :to="item.btn_link">
                                                   <EyeIcon stroke-width="2" size="20"
                                                      class="text-secondary" />
                                                </v-btn>
                                             </template>
                                          </v-tooltip>
                                          <!-- <v-tooltip text="Download Invoice">
                                             <template v-slot:activator="{ props }">
                                                <v-btn icon flat v-bind="props">
                                                   <DownloadIcon  @click="downloadContract" stroke-width="2" size="20"
                                                      class="text-secondary" />
                                                </v-btn>
                                             </template>
                                          </v-tooltip> -->
                                       </h5>
                                    </td>
                                 </tr>
                              </tbody>
                              <tbody v-else >
                                 <tr  class="month-item">
                                    <td colspan="8">
                                       <p class="text-center center py-2 mt-0 text-error">No data found yet</p>
                                    </td>
                                 </tr>
                              </tbody>
                           </template>
                        </v-table>
                     </div>
                  </v-card-item>
               </v-card>
            </v-col>
         </v-row>
      </v-card-item>
   </v-card>
</template>
<style>
   .contentHeightnew {
   overflow-y: auto;
   height: 60px;
   }
   .contentHeightnoteccept {
   overflow-y: auto;
   height: 60px;
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
   top: -5px;
   right: -4px;
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
   .assignedBtn {
   position: absolute;
   right: 6px;
   top: 8px;
   }
   .floatStatus{
   position: absolute;
   right: 0px;
   top: 0px;
   }
   .height-sets {
   height: 210px;
   overflow-y: auto;
   overflow-x: hidden;
   }
   .setHeightonThis {
   height: 120px;
   overflow-y: auto;
   padding-right: 20px;
   }
   .setHeightonThis .contentHeightnew {
   height: auto !important;
   }
   .setHeightonThis.removeHeight {
   height: auto !important;
   }
   .setHeightonThis.removeHeight .contentHeightnew {
   height: 60px !important;
   }
   .setHeightonThis.removeHeight.fullHeigthSet .contentHeightnew {
   height: 140px !important;
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
   .calendermain-style .calender {
    width: 100% !important;
}
.vc-weekday, .vc-day {
    padding: 12px !important;
}
.vc-day-content[tabindex~="0"] {
  background: rgb(var(--v-theme-secondary)) !important;
  color: #fff !important;
}
.vc-highlight-content-bg-lighterror.vc-day-content[tabindex="0"]{
    background-color: rgb(235 235 235) !important;
    color: rgb(145 141 141) !important;
}
</style>