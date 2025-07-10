<script setup lang="ts">
import { ref, onMounted,defineProps,computed} from 'vue';
import axios from '@/stores/axios';
import {useRouter, useRoute } from 'vue-router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


const tcontent     = ref({});


(async function(){
   let apple = 'faq'
   const response = await axios.get(`/home/handle_wcontent?${new URLSearchParams({reference:apple, page:'homepage'})}`)
   if (response.data.status=="SENT"){
      apple.split(',').forEach((i:any)=>{
         var data = response.data.data.find((a:any)=>(a.section.section == i))
        if (data) { tcontent.value[i] = {title:data.title, content:data.content, ctitle:data.ctitle, faqs:data.faqs}}
      })
   }
})();

const props = defineProps({
    categoryId: {
        type: [String, Number],
        required: false
    }
});


const all_data = ref([]);



const fetchFaqs = async () => {
  try {
    const response = await axios.get(`/home/get_FaqQ`);
    if (response.data.status === "Done") {
      console.log("Fetched Data:", response.data.data);
      all_data.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
};


onMounted(fetchFaqs);




const filteredList = computed(() => {
  return all_data.value.filter(item => 
    item.category && item.category.id === props.categoryId
  );
});


const filteredList_heading = computed(() => {
  return all_data.value.filter(item => 
    item.category &&
    item.category.id === props.categoryId &&
    item.title &&
    item.ctitle
  );
});



</script>
<template>
    <v-container>
         <v-row v-if="filteredList_heading.length > 0" class="justify-center align-center mb-15">
            <v-col
                v-for="item in filteredList_heading"
                :key="item.id"
                cols="12"
                lg="12"
                sm="12"
                data-aos="fade-up"
                data-aos-duration="500"
            >
                <h3 class="text-center mt-4 sailFont font-weight-bold">
                {{ item.title }}
                </h3>
                <p class="text-center mt-4 sailFont">
                {{ item.ctitle }}
                </p>
            </v-col>
            </v-row>

       
        <v-row class="justify-center ctm-faq align-center">
            <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                
                <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold ">
                    Frequently Asked Questions
                </h2>
               
            </v-col>
        <!--Questions-->
         
        <v-col cols="12" md="12"> 
            <!-- <FaqQuestion/> -->
           

                <v-expansion-panels v-if="filteredList && filteredList.length > 0" elevation="10">
                    <v-expansion-panel v-for="item in filteredList" :key="item.id" class="fq_s">
                        <v-expansion-panels elevation="10">
                        <v-expansion-panel v-for="faq in item.faqs" :key="faq.id" class="fq_s">
                            <v-expansion-panel-title class="text-h6 py-6">
                            {{ faq.question }}
                            </v-expansion-panel-title>

                            <v-divider></v-divider>

                            <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2 tx-fqs">
                            {{ faq.answer }}
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        </v-expansion-panels>
                    </v-expansion-panel>
                </v-expansion-panels>


                <template v-else>
                    <v-expansion-panels  elevation="10">
                        <v-expansion-panel elevation="10" v-for="item in tcontent['faq']?.faqs" :key="item.question" class="fq_s">
                            
                            <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
                            <v-divider></v-divider>
                            <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2 tx-fqs">
                                {{ item.answer }}
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>

           
        </v-col>
      
    </v-row>
    </v-container>
  </template>
 <style lang="scss" scoped>

.faq-mock img{
     width:80%;
}
 .ctm-faq .text-center.mb-8{
    display:none;
 }
.ctm-faq {
    background: linear-gradient(45deg, #6573ff, #f9a7e2d1, #6a79e6, #b9a9fa, #6775e0, #707ce2);
    background-size: 600% 100%;
    padding: 30px;
    border-radius: 45px;
    position:relative;
}
 .background-videos::before {
    top: 0;
    left: 0;
    width: 102%;
    height: 99%;
}
.ctm-faq:after {
    content: "";
    display: block;
    background: rgba(255, 255, 255, 0);
    border: 2px solid rgba(253, 248, 255, 0.431372549);
    border-radius: 45px;
    top: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    position: absolute;
}

.background-videos video {
    width: 100vw;
    left: 50%;
    right: 50%;
    height: 540px;
    object-fit: cover;
    margin-left: -50vw;
    margin-right: -50vw;
    position: relative;
}
.background-videos {
    width: 100vw;
    left: 50%;
    z-index: -1;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    position: relative;
  }
  .faq_section{
    padding: 20px 0;
    position:relative;
    padding-right: 30px;
  }

    .faq{
        padding-top: 35px;
    }
 </style>
 