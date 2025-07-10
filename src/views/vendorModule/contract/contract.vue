<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
}); 



/*--Booking table data --*/
const contractdat = ref([]);
const searchdate = ref()
const statusvalue = ref('All');
const statusitem = ref(['All', 'Active', 'Pending', 'End']);
const searchbudget = ref();
const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');

const filteredList = computed(() => {
    console.log("contractdat________________", contractdat.value)
    const isearch = search.value.toLowerCase()
    const ilist = contractdat.value.filter((i:any) => (
        i.couplename.toLowerCase().includes(isearch) ||
        i.couplemail.toLowerCase().includes(isearch) ||
        i.packagename.toLowerCase().includes(isearch) ||
        i.cdate.includes(isearch) ||
        String(i.depositamount).includes(isearch) ||
        String(i.totalamount).includes(isearch) ||
        i.statustext.toLowerCase().includes(isearch) ))

    function chdate(a:any, b:any) { 
        const i = new String(a).split("-"); 
        const j = new String(b).split("-"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    console.log("eeee", searchdate.value, ilist)
    return ilist.filter((item:any) =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.statustext.toLowerCase())) &&
            ([undefined, null, 0, ''].includes(searchbudget.value) || String(item.depositamount).includes(String(searchbudget.value)) || String(item.totalamount).includes(String(searchbudget.value))) &&
            ([undefined, null, 0, ''].includes(searchdate.value) || searchdate.value == item.cdate)
        )
    );
});

const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});

const clickFunModal = (item: any) => { item.dialog = true }
const range = ref({ start: new Date(2024, 8, 1), end: new Date(2024, 8, 5) });




async function showcontracts() {
  try {
    const formData = new FormData();
    formData.append("ViewAllContracts",'ViewAllContracts');
    formData.append("user_role",'vendor');
    const response = await axios.post(`/home/all_contracts`, formData, config);
    console.log(response.data,"hi responce booking vendor")

    if (response.data.status == 'SAVED') {

        contractdat.value = response.data.contract_data.map((elem, index) => ({
        "couplename": `${elem.couple.userprofile.user.first_name} ${elem.couple.userprofile.user.last_name}`,
        "couplemail":elem.couple.userprofile.user.email,
         "packagename": elem.package.name,
        "totalamount":'$' + elem.final_budget,
        "depositamount": '$' + elem.deposit_amt,
        "contractid":elem.id,
        "v_sign":elem.vendor_sign,
        "c_sign":elem.couple_sign,
        "statuscolor": elem.status == 'accepted' ? 'success' : 'primary',
        "statustext": (elem.action_status=='inprogress') ? 'Active' : ((elem.action_status=='complete') ? 'End' : 'Pending'),
        "v_link": "/vendor-contract-single/" + elem.id,
        "cdate": elem.created_at.split('T')[0],
        "sno": index+1
        }));
    fullpageloader.value = false
    }
    else{ fullpageloader.value = false}


  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
showcontracts()

const package_name = ref('');
const finalprice                    = ref();
const city                          = ref();
const state                         = ref();
const country                       = ref();
const cityitem                      = ref([])
const stateitem                     = ref([])
const countryitem                   = ref([])
const pacakgeprice = ref('');
const advancepayment = ref('');
const termconditions = ref('');

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
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8"> <v-card-title class="text-h4 ">All Contracts</v-card-title></v-col>

                        <!-- <v-col cols="12" md="4" class="d-flex justify-end">
                            <v-btn variant="flat" color="primary" class="rounded-sm" @click="dialog = true"> Create Contract</v-btn>
                            <v-dialog v-model="dialog" scrollable class="dialog-mw" :max-width="800">
                                <v-card class="pa-6">
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4
                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                            Create Contract  </h4>
                                        <v-btn icon color="" @click="dialog = false" flat variant="outlined" size="x-small"
                                            class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="pa-0  pt-10 ">
                                        <v-row class="">
                                            
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Contract Name 
                                                    </v-label>
                                                    <VTextField hide-details="auto" disabled v-model="package_name" class="" required
                                                        placeholder="Enter Your Contract Name" color="secondary"></VTextField>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Category </v-label>
                                                    <VTextField hide-details="auto" disabled v-model="category_name" class="" required
                                                        placeholder="Category" color="secondary"></VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Couple Name 
                                                    </v-label>
                                                    <VTextField hide-details="auto" disabled v-model="couplename" class="" required
                                                        placeholder="" color="secondary"></VTextField>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Country</v-label>
                                                    <v-select v-model="country" :items="countryitem" item-title="text"
                                                        item-value="value" label="Select Country" single-line variant="outlined"
                                                        hide-details @update:modelValue="getstate()" return-object required>
                                                    </v-select>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">State</v-label>
                                                    <v-select v-model="state" :items="stateitem" item-title="text"
                                                        item-value="value" label="Select State" single-line variant="outlined"
                                                        hide-details @update:modelValue="getcity()" return-object required>
                                                    </v-select>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label>
                                                    <v-select v-model="city" :items="cityitem" item-title="text"
                                                        item-value="value" label="Select City" single-line variant="outlined"
                                                        hide-details return-object required>
                                                    </v-select>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Base Price
                                                    </v-label>
                                                    <VTextField v-model="pacakgeprice" hide-details="auto" disabled required placeholder="Enter Package Price" color="secondary" type="number">
                                                    </VTextField>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit Percentage
                                                    </v-label>
                                                    <v-text-field  disabled v-model="finaldeposit" variant="outlined" color="secondary" type="number"
                                                        placeholder="Enter Payment" hide-details>
                                                        <template v-slot:prepend-inner>
                                                            <PercentageIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                                        </template>
                                                    </v-text-field>
                                                </div>
                                            </v-col>
                                            
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Price
                                                    </v-label>
                                                    <VTextField v-model="finalprice" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number">
                                                    </VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Deposit Percentage
                                                    </v-label>
                                                    <v-text-field v-model=" advancepayment" variant="outlined" color="secondary" type="number"
                                                        placeholder="Enter Payment" hide-details>
                                                        <template v-slot:prepend-inner>
                                                            <PercentageIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                                        </template>
                                                    </v-text-field>
                                                </div>
                                            </v-col>
                                          
                                            <v-col cols="12" class="bookingModalStyle ">
                                                <v-label
                                                    class="font-weight-medium mb-2 ">Event
                                                    Date</v-label><br>
                                             
                                                <VueDatePicker v-model="avldate" range multi-calendars  :enable-time-picker="false" dark  />
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
                            
                        </v-col> -->
                    </v-row>
                    <v-row class="justify-content-between pt-3">
                        <!-- <v-col cols="12" md="12"> 
                            <v-card-title class="text-h4 text-secondary">All
                                Bookings
                            </v-card-title>
                        </v-col> -->
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightsecondary">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" class="">
                                            <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status"
                                                hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search Price" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        
                                    </v-row>
                                    
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-table class="month-table mt-6 border rounded">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Couple Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Total Amount</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Deposit Amount</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Dated</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sign By</th>
                                    <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Payment Status</th> -->
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="index" :currentPage="currentPage" :pageSize="5"
                                    class="month-item">
                                    <td>
                                        <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            {{ item.sno }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            {{ item.contractid }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                            {{ item.couplename }}
                                        </h5>
                                        <h6 class="text-subtitle-2 text-no-wrap textSecondary mt-1">{{ item.couplemail 
                                            }}
                                        </h6>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.packagename }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.totalamount }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.depositamount }}
                                        </h5>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.cdate }}
                                        </h5>
                                    </td>


                                    <td>
                                        <div class="d-flex flex-column align-start ">

                                          


                                            <v-chip v-if="item.v_sign" size="small" color="success" class="font-weight-semibold mb-2">
                                                Vendor
                                                <CircleCheckIcon class="ml-2" start size="20" />
                                            </v-chip>
                                            <v-chip v-else size="small" color="error" class="font-weight-semibold mb-2">
                                                Vendor
                                                <AlertCircleIcon class="ml-2" start size="20" />
                                            </v-chip>




                                            <v-chip v-if="item.c_sign" size="small" color="success" class="font-weight-semibold">
                                                Customer
                                                <CircleCheckIcon class="ml-2" start size="20" />
                                            </v-chip>
                                            <v-chip v-else size="small" color="error" class="font-weight-semibold">
                                                Customer
                                                <AlertCircleIcon class="ml-2" start size="20" />
                                            </v-chip>
                                        </div>
                                    </td>




                                    <!-- <td>
                                        <v-chip rounded="md" class="ma-2 font-weight-semibold" :color="item.statuscolor"
                                            size="small" label>{{ item.statustext }}</v-chip>
                                    </td> -->
                                    <td>
                                        <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                            <v-tooltip text="View Contract">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props"  :to="item.v_link">
                                                        <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                            <!-- <v-tooltip text="Edit Contract">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small"  v-bind="props" @click="clickFunModal(item)"
                                                        ><PencilIcon stroke-width="2.5" size="18" class="text-info" 
                                                    /></v-btn>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip text="Delete Contract">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat size="small" v-bind="props"
                                                        ><TrashIcon stroke-width="2.5" size="18" class="text-error"
                                                    /></v-btn>
                                                </template>
                                            </v-tooltip> -->

                                            <v-dialog v-model="item.dialog" scrollable class="dialog-mw" :max-width="800">
                                                <v-card class="pa-6">
                                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                        <!-- <h4
                                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                            Edit Contract  </h4> -->
                                                        <v-btn icon color="" @click="item.dialog = false" flat variant="outlined" size="x-small"
                                                            class="bg-error">
                                                            <XIcon width="13" />
                                                        </v-btn>
                                                    </div>
                                                    <div class="pa-0  pt-10 ">
                                                        <v-row class="">
                                                            <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Name 
                                                                    </v-label>
                                                                    <VTextField hide-details="auto" disabled v-model="package_name" class="" required
                                                                        placeholder="Enter Your Package Name" color="secondary"></VTextField>
                                                                </div>
                                                            </v-col>

                                                            <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Category </v-label>
                                                                    <v-select v-model="category" :items="categoryitem" disabled item-title="text"
                                                                        item-value="value" label="Select Category" single-line
                                                                        variant="outlined" hide-details return-object required color="secondary">
                                                                    </v-select>
                                                                </div>
                                                            </v-col>

                                                            <v-col cols="12" md="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Country</v-label>
                                                                    <v-select v-model="country" :items="countryitem" item-title="text"
                                                                        item-value="value" label="Select Country" single-line variant="outlined"
                                                                        hide-details @update:modelValue="getstate()" return-object required>
                                                                    </v-select>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">State</v-label>
                                                                    <v-select v-model="state" :items="stateitem" item-title="text"
                                                                        item-value="value" label="Select State" single-line variant="outlined"
                                                                        hide-details @update:modelValue="getcity()" return-object required>
                                                                    </v-select>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">City</v-label>
                                                                    <v-select v-model="city" :items="cityitem" item-title="text"
                                                                        item-value="value" label="Select City" single-line variant="outlined"
                                                                        hide-details return-object required>
                                                                    </v-select>
                                                                </div>
                                                            </v-col>

                                                            <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Base Price
                                                                    </v-label>
                                                                    <VTextField v-model="pacakgeprice" hide-details="auto" disabled required placeholder="Enter Package Price" color="secondary" type="number">
                                                                    </VTextField>
                                                                </div>
                                                            </v-col>

                                                            <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Advance for
                                                                        Booking
                                                                    </v-label>
                                                                    <v-text-field v-model="advancepayment" variant="outlined" color="secondary" type="number"
                                                                        placeholder="Enter Payment" hide-details>
                                                                        <template v-slot:prepend-inner>
                                                                            <PercentageIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                                                        </template>
                                                                    </v-text-field>
                                                                </div>
                                                            </v-col>
                                                            
                                                            <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Final Price
                                                                    </v-label>
                                                                    <VTextField v-model="finalprice" hide-details="auto" required placeholder="Enter Package Price" color="secondary" type="number">
                                                                    </VTextField>
                                                                </div>
                                                            </v-col>
                                                            <!-- <v-col cols="12" sm="6">
                                                                <div class="">
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">No of Booking Available
                                                                    </v-label>
                                                                    <VTextField v-model="bookingavailable" hide-details="auto" required placeholder="No of Booking Available" color="secondary" type="number"></VTextField>
                                                                </div>
                                                            </v-col> -->
                                                            <v-col cols="12" sm="12">
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
                                                            </v-col>
                                                            <v-col cols="12" class="bookingModalStyle ">
                                                                <v-label
                                                                    class="font-weight-medium mb-2 ">Select
                                                                    Date</v-label><br>
                                                                <v-date-picker v-model="range" is-range class="w-100" />
                                                            
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
                                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Terms &
                                                                        Conditions
                                                                    </v-label>
                                                                    <v-textarea v-model="termconditions" outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                                                        color="secondary"></v-textarea>
                                                                </div>
                                                            </v-col>
                                                           
                                                        </v-row>
                                                    </div>
                                                    <v-card-actions class="px-0  d-flex justify-end w-100 mt-4">
                                                        <v-btn class="bg-error rounded-sm" text @click="item.dialog = false" flat>
                                                            Close
                                                        </v-btn>
                                                        <v-btn class="bg-success rounded-sm" text flat to="/vendor-contract-single">
                                                            Send
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="8">
                                        <v-col cols="12" v-if="filteredList.length === 0">
                                            <v-card elevation="0" class=" mt-6 border-0" color="">
                                                <v-card-item class="text-center">
                                                    <AlertCircleIcon stroke-width="1.5" size="50"
                                                        class="mr-2 text-error" />
                                                    <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                    <!-- <h6 class="text-subtitle-1 text-13 my-4 text-error">
                                                        Search again with another Contract<br> temporary error.
                                                    </h6> -->
                                                </v-card-item>
                                            </v-card>
                                        </v-col>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                    <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
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

/* datepicker code end here */
</style>