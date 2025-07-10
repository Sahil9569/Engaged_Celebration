<script setup lang="ts">
import { faqPage } from '@/_mockApis/components/pages/faqData';
</script>
<template>
    <div class="faq">
        <div class="text-center mb-8">
            <v-row class="justify-center">
                    <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                        <div class="d-sm-flex align-center text-center justify-center">
                            <h6 class="text-h6 ml-2 text-primary">FAQ</h6>
                        </div>
                        <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold text-capitalize">
                            Asked by <span class="text-secondary">Vendors</span>
                        </h2>
                        <div class="section-title-img text-center" bis_skin_checked="1">
                            <img src="@/assets/images/website/section-title.png" alt="">
                        </div>
                    </v-col>
            </v-row>
        </div>
        <v-expansion-panels elevation="10">
            <v-expansion-panel elevation="10" v-for="item in faqPage" :key="item.question" class="fq_s">
                <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
                <v-divider></v-divider>
                <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2 tx-fqs">
                    {{ item.answer }}
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    
</template>


<style>

    .fq_s {
        background-color: rgb(255 255 255 / 50%) !important;
    }
    .tx-fqs {
        color: #252525 !important;
        letter-spacing: 0.5px !important;
    }

</style>



