<script setup lang="ts">
import { ref, computed  } from 'vue';
import axios from '@/stores/axios'
import BASE_URL from '@/stores/myVar';
import { stubString } from 'lodash';
const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);
// const report_data = ref([]);


// async function report_listing() {
//     // const fullpageloader = ref(true); 

//     try {
//         const response = await axios.post("home/report_package_data");
//         console.log("report_listing", response.data);

//         if (response.data.status == "DONE") {
//             fullpageloader.value = false;

//             report_data.value = response.data.pack_data.map((item,index) => ({
//                 sno:   index + 1,
//                 status: item.status,
//                 report_package: item.report_package,
//                 user: item.user.fullname,
//                 // report_reason: item.report_reason,
//                 report_reason: item.report_reason.length > 40 
//                 ? item.report_reason.substring(0, 40) + '...'
//                 : item.report_reason,
//                 created_at: item.created_at,
//                 show_hide: item.report_package.show_hide,
//                 link : `/report-single/${item.report_package.id}`,
//             })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//         } else {
//             console.error("Error occurred");
//             fullpageloader.value = false;
//         }
//     } catch (error) {
//         console.error("Error in report data", error);
//         fullpageloader.value = false;
//     }
// }

// report_listing()

const report_data = ref([]);

async function report_listing() {
    // const fullpageloader = ref(true); 

    try {
        const response = await axios.post("home/report_package_data");
        console.log("report_listing", response.data);

        if (response.data.status == "DONE") {
            fullpageloader.value = false;

            // Step 1: Map the data
            const mappedData = response.data.pack_data.map((item) => ({
                status: item.status,
                report_package: item.report_package,
                user: item.user.fullname,
                report_reason: item.report_reason.length > 40 
                    ? item.report_reason.substring(0, 40) + '...'
                    : item.report_reason,
                created_at: item.created_at,
                show_hide: item.report_package.show_hide,
                link: `/report-single/${item.report_package.id}`,
            }));

            // Step 2: Sort the data by created_at (latest first)
            const sortedData = mappedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            report_data.value = sortedData.map((item, index) => ({
                sno: index + 1, 
                status: item.status,
                report_package: item.report_package,
                user: item.user,
                report_reason: item.report_reason,
                created_at: item.created_at,
                show_hide: item.show_hide,
                link: item.link,
            }));
        } else {
            console.error("Error occurred");
            fullpageloader.value = false;
        }
    } catch (error) {
        console.error("Error in report data", error);
        fullpageloader.value = false;
    }
}
report_listing()



const itemsPerPage = 5;
const currentPage = ref(1);


const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return report_data.value.slice(start, end);
});




async function pack_status_toggle(pack=null,pack_status=null){
    const formdata = new FormData()
   
    
    formdata.append('pid', pack)
    formdata.append('ppack_status', pack_status)
    formdata.append('update_package_Status', 'update_package_Status')
    const response = await axios.post("home/report_package_data",formdata);
    if (response.data.status == 'UPDATED'){
        showSuccessMessage.value = true;
        myerrors.value = 'Package updated.';
        setTimeout(() => { showSuccessMessage.value = false; fullpageloader.value = false; }, 3000);
    }  else{
        console.log('Error in updataion')
    }
      
}







</script>
<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4"><div>{{ myerrors }}</div>
            <template v-slot:prepend><v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon></template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4"> <div>{{ myerrors }}</div>
            <template v-slot:prepend> <v-icon class="text-24">mdi-alert-circle-outline</v-icon> </template>
        </v-alert>
    </div>
    <div id="itable">
                        <v-table class="month-table mt-6 border rounded">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Couple Name</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Name</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Reason</th>
                                        <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap"> Status</th> -->
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Receving Date</th>
                                        <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Package Status</th> -->
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap text-center">Action</th>
                                        
                                        <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Lock/Unlock</th> -->
                                    </tr>
                                </thead>
                               
                                <tbody>
                                    <tr v-for="(item, index) in paginatedList" :key="item" :currentPage="currentPage" :pageSize="5"
                                        class="month-item">
                                        <td><h5 class="text-no-wrap text-body-1 font-weight-medium">{{ item.sno }}</h5></td>
                                         <td>
                                            <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                <div class="d-flex align-start">
                                                    <!-- <v-avatar size="50" class="rounded-sm">
                                                        <img :src="item.coupleimg" :alt="item.img" width="50"
                                                    /></v-avatar> -->
                                                    <div class="">
                                                        <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.user}}</h4>
                                                        
                                                    </div>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <div class="">
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.report_package.name }}</h6>
                                                </div>
                                            </h5>
                                        </td>
                                        
                                        <td>
                                            <h5 class="text-no-wrap text-body-1">
                                                <div class="">
                                                    <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">{{ item.report_reason }}</h6>
                                                </div>
                                            </h5>
                                        </td>
                                        <td>
                                            <div>
                                                <h6 class="text-subtitle-2 text-no-wrap text-Darklight font-weight-medium mt-1">
                                                {{ item.created_at.split('T')[0].split('-').reverse().join('-') }}
                                                </h6>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex justify-center">
                                                
                                                <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                    <v-tooltip text="View Vendor">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <EyeIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>

                                                    <v-tooltip v-if="item.show_hide" text="Block Package">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <LockIcon stroke-width="2.5" size="18" class="text-error"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>

                                                    <v-tooltip v-else text="Unblock Package">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn icon flat size="small" v-bind="props"  :to="item.link">
                                                                <LockOpenIcon stroke-width="2.5" size="18" class="text-success"/>
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </h5>
                                            </div>
                                        </td>                                                                 
                                    </tr>
                                    <tr>
                                        <td colspan="7">
                                            <v-col cols="12" v-if="report_data.length === 0">
                                                <v-card elevation="0" class=" mt-6 border-0" color="">
                                                    <v-card-item class="text-center">
                                                        <AlertCircleIcon stroke-width="1.5" size="50"
                                                            class="mr-2 text-error" />
                                                        <h5 class="text-h5 pt-3 text-error">Data Not Found!</h5>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                        </div>
    
</template>