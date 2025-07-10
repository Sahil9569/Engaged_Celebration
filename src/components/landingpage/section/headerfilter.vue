<script setup lang="ts">
import { ref } from 'vue';


import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { router } from '@/router';


const searchcat = ref()
const catitems:any  = ref([])
const searchloc = ref()
const locitems:any  = ref([])
const searchbud = ref()
const buditems  = ref(['Any'])



// function searchit(){
//     router.push(`/allpackagelisting?cat=${searchcat.value}&loc=${searchloc.value}&bud=${searchbud.value}`)
// }


function searchit() {
    setTimeout(() => {
        let locationText = searchloc.value
            ? (locitems.value.find((item) => item.value === searchloc.value)?.text || 'all')
                .toLowerCase()
                .replace(/ /g, '-')
            : 'all';

        // let locationText = locitems.value.find(item => item.value === searchloc.value)?.text?.toLowerCase().replace(/ /g, '-') || 'all';

        let categoryName = searchcat.value
            ? (catitems.value.find((item) => item.value === searchcat.value)?.text || 'all')
                .toLowerCase()
                .replace(/ /g, '-')
            : 'all';

        let categoryText = categoryName !== 'all' ? `wedding-${categoryName}` : 'all';


        let budgetText = searchbud.value && searchbud.value !== "Any"
        ? searchbud.value.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-') // Replace spaces with "-"
        : 'any';

      
        console.log("Navigating with:", { searchloc: locationText, searchcat: categoryText, searchbud: budgetText });


        let params = {
            searchloc: locationText,
            searchcat: categoryText
        };

        if (budgetText !== "any") {
            params.searchbud = budgetText; // Add searchbud only if it's not "any"
        }

        console.log("Navigating with:", params);

        router.push({
            name: 'AllPackageListingWithParams',
            params
        }).catch(err => console.warn("Navigation error:", err));
    }, 100);


        // ✅ Use named route instead of `path`
    //     router.push({
    //         name: 'AllPackageListingWithParams',
    //         params: {
    //             searchloc: locationText,
    //             searchcat: categoryText,
    //             searchbud: budgetText
    //         }
    //     }).catch(err => console.warn("Navigation error:", err));
    // }, 100);
}





(async function(){
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({cat:'', sts:''})}`)
    if (response.data.status == "SENT"){
        catitems.value = [{'text':'All', 'value':0, 'budget':response.data.allcatbudget}].concat(response.data.cats.map((a:any)=>({'text':a.name, 'value':a.id, 'budget':a.budget})))
        locitems.value = [{'text':'All', 'value':0}].concat(response.data.states)
    }
})();

function set_budget(){
    searchbud.value = 'Any'
    let a:any = catitems.value.find((a:any)=>(a.value == searchcat.value)).budget
    buditems.value = ['Any'].concat( a )
}

</script>
<template>
    
    <div class="filterheader">
        <v-container class="maxWidth border-top px-6">
                <v-row class="py-4 justify-center gap-2">
                    <v-col cols="12" md="3" class="pa-0">
                        <v-autocomplete v-model="searchcat" :items="catitems" item-title="text" item-value="value" color="secondary" label="Category" attach variant="outlined" density="comfortable" hide-details @update:modelValue="set_budget()">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="3" class="pa-0">
                        <v-autocomplete v-model="searchloc" :items="locitems" color="secondary"  item-title="text" item-value="value" label="Location" variant="outlined" density="comfortable" hide-details>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="3" class="pa-0">
                        <v-combobox v-model="searchbud" :items="buditems" variant="outlined" label="Budget" density="comfortable" hide-details></v-combobox>
                        <!-- <v-autocomplete v-model="searchbud" :items="buditems" color="secondary"  item-title="text" item-value="value" label="Budget" variant="outlined" density="comfortable" hide-details></v-autocomplete> -->
                    </v-col>
                    <!-- <v-col cols="12" md="3" class="pa-0">
                        <VTextField v-model="searchbud" label="Enter Budget" hide-details="auto" class="mb-3"></VTextField>
                    </v-col> -->
                    <v-col cols="12" md="2" class="pa-0 ">
                        <v-btn color="secondary" class="w-100" size="large" @click="searchit()">Get Started</v-btn>
                    </v-col>
                </v-row>
        </v-container>
    </div>
</template>
<style>
</style>