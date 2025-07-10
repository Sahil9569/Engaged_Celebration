<script setup lang="ts">
import { ref, computed } from 'vue';
import { Carousel, Slide, } from "vue3-carousel";
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import default_logoimg from "@/assets/images/logos/logo-black1.png";


const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const fullpageloader = ref(true)


const vendorcategory = ref([]);
const search = ref('');
const filteredList = computed(() => { 
    return vendorcategory.value.filter((i:any) => (i.title.toLowerCase().includes(search.value.toLowerCase())));
});

async function init_dashboard(){
    const response = await axios.post('/home/vendor_dashboard', {}, {headers:{"Content-Type":"application/json"}, withCredentials:true})
    console.log("response___________________", response)
    if (response.data.status == 'SENT'){
        vendorcategory.value = response.data.cats.map( (cat:any) => ({
            img : cat.pic === '/media/default.jpg' ? default_logoimg : BASE_URL + cat.pic,
            title: cat.name,
            vendors: cat.vendor_count,id:cat.id 
        }))
        fullpageloader.value = false
    }
}
init_dashboard()


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
    <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
        <v-card-item class="pa-sm-6 pa-3">
            <v-row class="justify-content-between pt-3">
                <v-col cols="12" sm="6"> <v-card-title class="text-h4 "> Vendor Category  </v-card-title> </v-col>
                <v-col cols="12" sm="6"> <v-text-field density="compact" color="secondary" v-model="search" label="Search Category" hide-details variant="outlined" ></v-text-field> </v-col>
            </v-row>


            <v-row class="position-relative">
                <template v-for="card in filteredList" :key="card.id" >
                    <v-col cols="12" md="3" sm="4" v-if="card.vendors != 0">
                        <router-link  :to="'/single_service/' + card.id" class="text-decoration-none w-100 d-block">
                            <div elevation="10" class="rounded vendor-card-background new-height d-flex align-end"
                                :style="{ backgroundImage: `url(${card.img})` }">
                                <div class="pa-6 text-left text-white position-relative">
                                    <h3 class="text-subtitle-1 text-no-wrap font-weight-semibold text-white">
                                        {{ card.title }}
                                    </h3>
                                    <p class="text-subtitle-2 text-no-wrap font-weight-semibold text-white">
                                        ({{ card.vendors }})
                                    </p>
                                </div>
                            </div>
                        </router-link>
                    </v-col>
                </template>
            </v-row>



        </v-card-item>
    </v-card>

</template>
<style>
.vendor-card-background.new-height {
    min-height: 140px;
}
</style>