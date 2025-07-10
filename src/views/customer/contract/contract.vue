<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import axios from '@/stores/axios';
import { useRoute } from 'vue-router'
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
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

const value = ref([]);
const items = ref([
    'All',
    'Completed',
    'Pending',
    'Active',
]);


const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)


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
    console.log("searchdate____", searchdate.value)
    const isearch = search.value.toLowerCase()
    const ilist = contractdat.value.filter((i:any) => (
        i.couplename.toLowerCase().includes(isearch) ||
        i.couplemail.toLowerCase().includes(isearch) ||
        i.packagename.toLowerCase().includes(isearch) ||
        String(i.totalamount).includes(isearch) ))

    function chdate(a:any, b:any) { 
        const i = new String(a).split("-"); 
        const j = new String(b).split("/"); 
        return ((parseInt(i[2]) == parseInt(j[0])) && (parseInt(i[1]) == parseInt(j[1])) && (parseInt(i[0]) == parseInt(j[2])))
    }

    return ilist.filter(item =>
        (   
            (statusvalue.value.length === 0 || statusvalue.value.includes('All') || statusvalue.value.toLowerCase().includes(item.statustext.toLowerCase())) &&
            ([undefined, null, 0, ''].includes(searchbudget.value) || String(item.totalamount).includes(String(searchbudget.value))|| String(item.depositamount).includes(String(searchbudget.value))) && 
            ([undefined, null, 0, ''].includes(searchdate.value) || chdate(searchdate.value, item.contractdate))
        )
    );
});
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});

const clickFunModal = (item: any) => {
    item.dialog = true
}
const range = ref({
    start: new Date(2024, 8, 1),
    end: new Date(2024, 8, 5)
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


async function showcontracts() {
    const formData = new FormData();
    formData.append("ViewAllContracts",'ViewAllContracts');
    formData.append("user_role",'customer');
    const response = await axios.post(`/home/all_contracts`, formData, config);
    console.log(response.data,"hi responce booking vendor")

    if (response.data.status == 'SAVED') {
        contractdat.value = response.data.contract_data.map((elem, index) => ({
        // "img": (elem.couple.profile_pic) ? BASE_URL + elem.couple.profile_pic : user1,
        "sno": index+1,
        "couplename": `${elem.package.user.first_name} ${elem.package.user.last_name}`,
        "couplemail":elem.package.user.email,
        "packagename": elem.package.name,
        "contractdate": formatDate(elem.created_at),
        "totalamount":'$' + elem.final_budget,
        "depositamount": '$' + elem.deposit_amt,
        "v_sign":elem.vendor_sign,
        "c_sign":elem.couple_sign,
        "contractid": elem.id,
        "statuscolor": elem.action_status == 'Complete' ? 'success' : 'primary',
        "statustext": (elem.action_status=='inprogress') ? 'Active' : ((elem.action_status=='complete') ? 'End' : 'Pending'),
        //  "v_link": `/vendor-contract-singleee/${elem.id}`,
         "v_link": "/vendor-contract-single/" + elem.id,

        // "a_link": `/vendor-booking-single-action/accept/${elem.id}`,
        // "r_link": `/vendor-booking-single-action/reject/${elem.id}`,
        }));
        fullpageloader.value = false
    }
  
}
showcontracts()





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
                        <v-col cols="12" md="12"> <v-card-title class="text-h4 ">All Contracts</v-card-title></v-col>
                        
                    </v-row>
                    <v-row class="justify-content-between">
                            <!-- <v-col cols="12" md="12"> 
                                <v-card-title class="text-h4 text-secondary">All
                                    Bookings
                                </v-card-title>
                            </v-col> -->
                            <v-col cols="12" md="12" >
                                <v-card elevation="0" class="border bg-lightsecondary">
                                    <v-card-item class="py-4">
                                        <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                        <v-row class="justify-end py-5">
                                            <v-col cols="12" md="3">
                                                <v-text-field density="compact" color="secondary" v-model="search" label="Search Booking" hide-details variant="outlined" ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="3" class="">
                                                <v-text-field variant="outlined" v-model="searchdate" hide-details type="date" label="Filter By date" density="compact"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-select :items="statusitem" v-model="statusvalue" label="Filter By Status" hide-details class="" density="compact">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-text-field density="compact" color="secondary" v-model="searchbudget" label="Search Amount" hide-details variant="outlined" ></v-text-field>
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
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">ID</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Vendor/Admin Info</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Total Amount</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Deposit Amount</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Date</th>
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
                                            {{ item.contractdate }}
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
                                            

                                            <v-dialog v-model="item.dialog" scrollable class="dialog-mw" :max-width="800">
                                                <v-card class="pa-6">
                                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                                        <h4
                                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                                            Edit Contract  </h4>
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
                                                                    Date111</v-label><br>
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
                                                        <v-btn class="bg-success rounded-sm" text flat to="/contract-single">
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
</style>