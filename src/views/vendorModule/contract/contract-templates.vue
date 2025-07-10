<script setup lang="ts">
import { ref, computed } from 'vue';
import BASE_URL from '@/stores/myVar'
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
import { router } from '@/router';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js'; // 

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
});


const dialog = ref(false);
const printdialog = ref(false);

const fullpageloader = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

const fileNames =ref([])
const contract_name = ref("")
const termconditions = ref(); 
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

const iuser                         = JSON.parse(String(localStorage.getItem('user')))
console.log("sdfsffs", iuser, iuser.fullname, iuser.user.email)
const vname                         = ref(iuser.fullname);
const vemail                        = ref(iuser.user.email);
const cname                         = ref();
const cemail                        = ref();
const city                          = ref();
const state                         = ref();
const country                       = ref();
const cityitem                      = ref([])
const stateitem                     = ref([])
const countryitem                   = ref([])
const c_templates = ref([])


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

const contract_id=ref(null);

const createcontractpopup = (action="null",contract=null) => {

    if (action=='create'){
        contract_id.value=contract
        contract_name.value = ""
        retainer.value = ""
        contracted_services.value = ""
        expiration.value = ""
        documentation.value = ""
        hotel_accommodations.value = ""
        destination.value = ""
        cancellation_policy.value = ""
        postponement_policy.value = ""
        responsibility.value = ""
        overtime.value = ""
        attire.value = ""
        liability.value = ""
        contracted_vendor_payments.value = ""
        damage_loss_accessories.value = ""
        schedule_method.value = ""
        attorney.value=""
        appropriate_conduct.value = ""
        termconditions.value=""
        country.value=""
        state.value= ""
        city.value=""
        cname.value=""
        cemail.value=""

        dialog.value = true;

    }
    else{
        contract_id.value=contract
        singlecontract(contract)
        dialog.value = true;
    }
};


async function singlecontract(contract=null) {
  try {
    const formData = new FormData();
    formData.append("Single_contract_show",'Single_contract_show');
    formData.append("user_role",'vendor');
    formData.append("contract_id",contract);

    const response = await axios.post(`/home/all_contracts`, formData, config);
    console.log(response.data,"hi responce template  contract")

    if (response.data.status == 'SAVED') {
        countryitem.value       = response.data.countries
        stateitem.value       = response.data.allstates
        cityitem.value       = response.data.cities

        

        
       
        if (response.data.single_contract){
            let contract = response.data.single_contract

            contract_name.value = contract.contract_name
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
            cname.value = contract.cname
            cemail.value = contract.cemail
            termconditions.value=contract.termconditions

            if (contract.contract_file){files.value=contract.contract_file}
            if(contract.country){country.value={'text':contract.country.country, 'value':contract.country.id}}
            if(contract.state){state.value= {'text':contract.state.state, 'value':contract.state.id}}
            if(contract.city){city.value={'text':contract.city.city, 'value':contract.city.id}}
            if (contract.additional_srvcs){
                try {
                document.querySelector('.tiptap').innerHTML = contract.additional_srvcs
                    } catch (error) {
                    console.error("noo:", error);
                }
            }

        }

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


async function showcontracts() {
  try {
    const formData = new FormData();
    formData.append("ViewAllContractstemp",'ViewAllContractstemp');
    formData.append("user_role",'vendor');
    const response = await axios.post(`/home/all_contracts`, formData, config);
    console.log(response.data,"hi responce template  contract")

    if (response.data.status == 'SAVED') {
        countryitem.value       = response.data.countries

        c_templates.value = response.data.contract_data.map((elem) => ({
        "id":elem.id,
        "tempname":elem.contract_name,
        "cdate": elem.created_at.split('T')[0]
        }));
      
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showcontracts()

const files = ref([]);
const handleFileChange = (event) => {
      files.value = Array.from(event.target.files); // Correctly set files array
      console.log(files.value, "filesssssssssssss2");
    };
function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}

const reqrules   = ref([(v: string) => !!v || 'This field is required']);
const reqrulese = ref([
      (v) => !!v || 'This field is required',
      (v) => /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(v) || 'Please enter a valid email'
    ]);
async function create_contract(action="null",contract_id="null") {
    if (!(ivalidate())){return null}
    const formData = new FormData();
    formData.append("action",action);
    formData.append("contract_id",contract_id);
    formData.append("contract_action",'vendor');
    formData.append('country', country.value['value']);   
    formData.append('state', state.value['value']);   
    formData.append('city', city.value['value']);  
    formData.append('cname', cname.value);  
    formData.append('cemail', cemail.value);  
    
    for (let i = 0; i < files.value.length; i++) {formData.append("files[]", files.value[i]);}

    formData.append("contract_name", contract_name.value);
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

    dialog.value           = false
    fullpageloader.value   = true

    const response = await axios.post(`/home/create_tempcontract`, formData, config);
    if (response.data.status == 'SAVED') {
        console.log(response.data,"response.data................")
        countryitem.value       = response.data.countries
        myerrors.value              = 'Contract template saved successfully!';
        showSuccessMessage.value    = true;
        setTimeout(() => { window.location.reload(); }, 3000);
    }
}

const sendmail = ref(false);
const mailcontract = ref('');
function ivalidate(){
    // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    const rslt = (contract_name.value && country.value && state.value && city.value)

    if (!(rslt)){
        showErrorMessage.value = true;
        myerrors.value = 'Please fill all required fields!';
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
}

async function delete_contract(contract_id="null") {
    const formData = new FormData();
    formData.append("Delete_ConTract",'Delete_ConTract');
    formData.append("contract_id",contract_id);
    fullpageloader.value   = true
    const response = await axios.post(`/home/create_tempcontract`, formData, config);
    if (response.data.status == 'Delete') {
        myerrors.value              = 'The contract template has been successfully deleted.';
        showSuccessMessage.value    = true;
        setTimeout(() => { window.location.reload(); }, 2000);
    }
}

async function downloadData(id:any=null, tosent:any=false){
    if (tosent && !reqrulese.value.every((rule) => rule(mailcontract.value) === true)) { return }
    createcontractpopup('edit_contract',id)
    fullpageloader.value = true
    setTimeout(async ()=>{
        dialog.value = false
        printdialog.value = true
        setTimeout(async ()=>{
            const tableWrapper = document.getElementById('itable_temp');
            console.log('i am still running')
            if (!tableWrapper) { console.error('Table wrapper element not found'); return; } //table wrapper exists or not
            
            const options = {
                margin: 1,filename: `ctemplate.pdf`,image: { type: 'jpeg', quality: 0.98 },html2canvas: { scale: 2 },jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }};

            if(tosent){
                const formData = new FormData();
                formData.append('cfile', await html2pdf().from(tableWrapper).set(options).outputPdf('blob'), 'ctemplate.pdf');
                formData.append('imail', mailcontract.value);
                const response = await axios.post(`/home/sendcontract`, formData, config);
                console.log('response________________', response.data)
                if (response.data.status == 'SENT') { sendmail.value = false }
                myerrors.value              = 'Template sent successfully!';
            }else { html2pdf().from(tableWrapper).set(options).save(); myerrors.value  = 'Template download successfull!';}
            setTimeout(()=>{ 
                printdialog.value           = false 
                fullpageloader.value        = false;
                showSuccessMessage.value    = true;
                setTimeout(() => { showSuccessMessage.value = false;}, 3000);
            }, 300)
        }, 1000)
    }, 1000)
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
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8">
                            <v-card-title class="text-h4 ">
                                Contract Templates
                            </v-card-title>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-sm-end justify-start">
                            <v-btn variant="flat" color="primary" class="rounded-sm" @click="createcontractpopup('create','None')"> Create Template</v-btn>
                            <v-dialog v-model="dialog" scrollable class="dialog-mw" :max-width="800">
                                <v-card class="pa-6" >
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Contract template </h4>
                                        <v-btn icon color="" @click="dialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="pa-0  pt-10 ">
                                        <v-row class="">
                                            
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Contract Name 
                                                    </v-label><span class="text-error ma-1">*</span>
                                                    <VTextField hide-details="auto" v-model="contract_name" class="" required placeholder="Enter Your Contract Name" color="secondary" :rules="reqrules"></VTextField>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Country</v-label><span class="text-error ma-1">*</span>
                                                    <v-select v-model="country" :items="countryitem" item-title="text"
                                                        item-value="value" label="Select Country" single-line variant="outlined" hide-details @update:modelValue="getstate()" return-object required :rules="reqrules">
                                                    </v-select>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">State</v-label><span class="text-error ma-1">*</span>
                                                    <v-select v-model="state" :items="stateitem" item-title="text"
                                                        item-value="value" label="Select State" single-line variant="outlined"
                                                        hide-details  @update:modelValue="getcity()" return-object required :rules="reqrules">
                                                    </v-select>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label><span class="text-error ma-1">*</span>
                                                    <v-select v-model="city" :items="cityitem" item-title="text"
                                                        item-value="value" label="Select City" single-line variant="outlined"
                                                        hide-details return-object required :rules="reqrules">
                                                    </v-select>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Vendor Name 
                                                    </v-label>
                                                    <VTextField hide-details="auto" type='text' disabled v-model="vname" class="" required placeholder="Enter Vendor Name"  maxlength="50" color="secondary"></VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Vendor Email </v-label>
                                                    <VTextField hide-details="auto" type="email" disabled v-model="vemail" class="" required placeholder="Enter Vendor Email" maxlength="100" color="secondary"></VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Name 
                                                    </v-label>
                                                    <VTextField hide-details="auto" type='text' v-model="cname" class="" required placeholder="Enter Couple Name"  maxlength="50" color="secondary"></VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Email </v-label>
                                                    <VTextField hide-details="auto" type="email" v-model="cemail" class="" required placeholder="Enter Couple Email" maxlength="100" color="secondary"></VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label
                                                    class="font-weight-medium mb-2 d-block">
                                                    Additional Services</v-label>
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
                                                    <template v-slot:selection="{ fileNames }" v-if="fileNames.length">
                                                    <template  v-for="fileName in fileNames" :key="fileName">
                                                        <v-chip size="small" label color="primary" class="mr-2">
                                                        {{ fileName }} 
                                                        </v-chip>
                                                    </template>
                                                    </template>

                                                </v-file-input>

                                            

                                                <div class="ps-10 mt-3 ">
                                                    <template v-if="files.length != 1">
                                                        <p color="primary" class="font-weight-semibold text-primary text-body-2 ">File Attached :</p>
                                                        <v-chip size="small" color="primary" label  class="border border-primary" variant="tonal">
                                                            {{ files }} 
                                                        </v-chip>
                                                    </template>
    
    
                                                    <template v-else>
                                                        <v-chip size="small" label color="primary" class="mr-2">
                                                        </v-chip>
                                                    </template>
                                                </div>
                                            




                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                        <v-btn class="bg-error rounded-sm" text @click="dialog = false" flat>
                                            Close
                                        </v-btn>

                                        <v-btn v-if="contract_id != 'None'" class="bg-secondary rounded-sm" @click="create_contract('edit_contract',contract_id)" text flat >
                                            Save
                                        </v-btn>
                                        <v-btn v-else class="bg-secondary rounded-sm" @click="create_contract('create_contract')" text flat >
                                            Save
                                        </v-btn>

                                        

                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="printdialog" scrollable class="dialog-mw" :max-width="800">
                                <div id="itable_temp">
                                    <v-card class="pa-6" >
                                        <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                            <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Contract template </h4>
                                            <v-btn icon color="" @click="dialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                                <XIcon width="13" />
                                            </v-btn>
                                        </div>
                                        <div class="pa-0  pt-10 ">
                                            <v-row class="">
                                                
                                                <v-col cols="12" sm="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Contract Name 
                                                        </v-label><span class="text-error ma-1">*</span>
                                                        <VTextField hide-details="auto" v-model="contract_name" class="" required placeholder="Enter Your Contract Name" color="secondary" :rules="reqrules"></VTextField>
                                                    </div>
                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Country</v-label><span class="text-error ma-1">*</span>
                                                        <v-select v-model="country" :items="countryitem" item-title="text"
                                                            item-value="value" label="Select Country" single-line variant="outlined" hide-details @update:modelValue="getstate()" return-object required :rules="reqrules">
                                                        </v-select>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">State</v-label><span class="text-error ma-1">*</span>
                                                        <v-select v-model="state" :items="stateitem" item-title="text"
                                                            item-value="value" label="Select State" single-line variant="outlined"
                                                            hide-details @update:modelValue="getcity()" return-object required :rules="reqrules">
                                                        </v-select>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label><span class="text-error ma-1">*</span>
                                                        <v-select v-model="city" :items="cityitem" item-title="text"
                                                            item-value="value" label="Select City" single-line variant="outlined"
                                                            hide-details return-object required :rules="reqrules">
                                                        </v-select>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Vendor Name 
                                                        </v-label>
                                                        <VTextField hide-details="auto" type='text' disabled v-model="vname" class="" required placeholder="Enter Vendor Name"  maxlength="50" color="secondary"></VTextField>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Vendor Email </v-label>
                                                        <VTextField hide-details="auto" type="email" disabled v-model="vemail" class="" required placeholder="Enter Vendor Email" maxlength="100" color="secondary"></VTextField>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="6" v-if="cname">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Name 
                                                        </v-label>
                                                        <VTextField hide-details="auto" type='text' v-model="cname" class="" required placeholder="Enter Couple Name"  maxlength="50" color="secondary"></VTextField>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="6" v-if="cemail">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Email </v-label>
                                                        <VTextField hide-details="auto" type="email" v-model="cemail" class="" required placeholder="Enter Couple Email" maxlength="100" color="secondary"></VTextField>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-label
                                                        class="font-weight-medium mb-2 d-block">
                                                        Additional Services</v-label>
                                                        <div class="rounded custom-border">
                                                            <div v-if="editor">
                                                            <EditorMenubar :editor="editor" />
                                                            </div>
                                                        <editor-content :editor="editor"  ref="editorContentRef" />
                                                            </div>
                                                </v-col>
                                                
                                                <v-col cols="12" sm="12" v-if="termconditions">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Additional instructions for agreement
                                                        </v-label>
                                                        <v-textarea v-model="termconditions" outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="retainer">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Retainer
                                                        </v-label>
                                                        <v-textarea v-model="retainer" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="contracted_services">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Contracted services
                                                        </v-label>
                                                        <v-textarea v-model="contracted_services" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="expiration">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Expiration
                                                        </v-label>
                                                        <v-textarea v-model="expiration" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="documentation">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Provided Documentation
                                                        </v-label>
                                                        <v-textarea v-model="documentation" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="hotel_accommodations">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Hotel Accommodations
                                                        </v-label>
                                                        <v-textarea v-model="hotel_accommodations" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="destination">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Destination
                                                        </v-label>
                                                        <v-textarea v-model="destination" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="attire">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Attire
                                                        </v-label>
                                                        <v-textarea v-model="attire" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="liability">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Liability
                                                        </v-label>
                                                        <v-textarea v-model="liability" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="cancellation_policy">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Cancellation Policy
                                                        </v-label>
                                                        <v-textarea v-model="cancellation_policy" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="postponement_policy">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Postponement Policy
                                                        </v-label>
                                                        <v-textarea v-model="postponement_policy" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="responsibility">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Responsibility
                                                        </v-label>
                                                        <v-textarea v-model="responsibility" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="overtime">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Overtime
                                                        </v-label>
                                                        <v-textarea v-model="overtime" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="contracted_vendor_payments">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Contracted Vendor and Payments
                                                        </v-label>
                                                        <v-textarea v-model="contracted_vendor_payments" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="damage_loss_accessories">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Damage or Loss of Accessories
                                                        </v-label>
                                                        <v-textarea v-model="damage_loss_accessories" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="schedule_method">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Payment Schedule and Method
                                                        </v-label>
                                                        <v-textarea v-model="schedule_method" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="attorney">
                                                    <div class="">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Attorney
                                                        </v-label>
                                                        <v-textarea v-model="attorney" outlined  hide-details
                                                            color="secondary"></v-textarea>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="12" v-if="appropriate_conduct">
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
                                                        <template v-slot:selection="{ fileNames }" v-if="fileNames.length">
                                                        <template  v-for="fileName in fileNames" :key="fileName">
                                                            <v-chip size="small" label color="primary" class="mr-2">
                                                            {{ fileName }} 
                                                            </v-chip>
                                                        </template>
                                                        </template>

                                                    </v-file-input>

                                                

                                                    <div class="ps-10 mt-3 ">
                                                        <template v-if="files.length != 1">
                                                            <p color="primary" class="font-weight-semibold text-primary text-body-2 ">File Attached :</p>
                                                            <v-chip size="small" color="primary" label  class="border border-primary" variant="tonal">
                                                                {{ files }} 
                                                            </v-chip>
                                                        </template>
        
        
                                                        <template v-else>
                                                            <v-chip size="small" label color="primary" class="mr-2">
                                                            </v-chip>
                                                        </template>
                                                    </div>
                                                




                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-card>
                                </div>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row class="py-4 px-2">
                        <v-col cols="12" md="4" v-for="item in c_templates">
                            <v-card elevation="10" class="border">
                                <v-card-item class="">
                                    <p class="font-weight-semibold text-h5">
                                        {{ item.tempname }}
                                    </p>
                                    <p class="text-Darklight font-weight-semibold text-body-2">
                                        Created : {{ item.cdate }}
                                    </p>
                                    <div class="d-flex mt-2">
                                        <v-btn @click="createcontractpopup('edit_contract',item.id)" variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                            <PencilIcon stroke-width="2" size="18"  />
                                             <v-tooltip activator="parent" location="top">Edit Contract</v-tooltip>
                                        </v-btn>
                                        <v-btn class="rounded-sm me-1" size="small" color="primary" variant="flat" @click="downloadData(item.id)">
                                            <DownloadIcon size="15" class="me-2"/>Download
                                        </v-btn>

                                        
                                        <v-dialog v-model="sendmail" transition="dialog-bottom-transition" class="dialog-mw" :max-width="500">
                                            <template v-slot:activator="{ props }">
                                                <v-btn @click="sendmail = true" class="rounded-sm me-1" size="small" color="success" variant="flat">
                                                <MailIcon size="15" class="me-2" />Send Email</v-btn>
                                            </template>
                                            <template v-slot:default="{ isActive }">
                                                <v-card class="pa-6">
                                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                        <h4
                                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                            Send Contract to Email  </h4>
                                                        <v-btn icon color="" @click="sendmail = false" flat variant="outlined" size="x-small"
                                                            class="bg-error">
                                                            <XIcon width="13" />
                                                        </v-btn>
                                                    </div>
                                                    <div>
                                                        <v-row class="">
                                                            <v-col cols="12" sm="12">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Email</v-label><span class="text-error ma-1">*</span>
                                                                    <VTextField hide-details="auto" v-model="mailcontract" class="" required :rules="reqrulese" placeholder="Enter Your receiver's email" color="secondary"></VTextField>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                    <v-card-actions class="px-0 d-flex justify-end w-100">
                                                        <v-btn class="bg-error rounded-sm" text @click="sendmail = false" flat> Close </v-btn>
                                                        <v-btn  class="bg-secondary rounded-sm" text flat  @click="downloadData(item.id, true)"> Send </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </template>
                                        </v-dialog>

                                        <v-btn class="rounded-sm me-1" size="small" color="error" variant="flat" @click="delete_contract(item.id)">
                                        <v-icon size="15" class="me-2">mdi-delete</v-icon>
                                        Delete
                                        </v-btn>

                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.floatEditBtn {
    position: absolute;
    top: 5px;
    right: 5px;
}
</style>