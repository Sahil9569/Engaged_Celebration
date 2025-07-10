<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { router } from '@/router'



const searchValue = ref('');
async function searchit(){ if(searchValue.value){router.push(`/search?query=${searchValue.value}`)};console.log("sssssssssssssss") }

</script>
<template>
    <div class="top-bar">
        <v-container class="container-width">
            <v-row class="align-center">
                <v-col cols="8" class="py-0 d-flex">
                  <span class="d-flex align-center sailFont font_14 font-weight-regular text-white">
                    <!-- <NotesIcon stroke-width="1.5" size="18" class="mr-1 mt-1 "/> --> 
                    <img src="@/assets/images/website/write_a_review_new.webp" class="mr-2 mt-1 review_img">
                     Write A Review
                  </span>
                    <!-- <v-text-field
                    class="custom-input-style customInput"
                    color = "secondary"
                    v-model="searchValue"
                    append-inner-icon="mdi-magnify"
                    placeholder="Search"
                    hide-details
                    density="compact"
                    @click:append-inner="searchit()"
                ></v-text-field> -->
                  
                </v-col>
                <v-col cols="4" class="py-0 d-flex">
                <v-btn class="form-btn bg-dark w-50 text-white user-btn"> <UserIcon stroke-width="1.5" size="18" class="mr-1 mt-1 "/> Find a Vendor</v-btn>
                <v-btn class="form-btn bg-dark w-50 text-white user-btn text-subtitle-1"> <PackageIcon stroke-width="1.5" size="18" class="mr-1 mt-1 "/> Buy your Packages</v-btn>
                    <!-- <ul class="d-flex social-icon justify-end">    <li class="px-1">   <a href="#" class="text-white">    <BrandFacebookIcon stroke-width="1.5" size="18"/>   </a>   </li>  <li class="px-1"> <a href="#" class="text-white">  <BrandTwitterIcon stroke-width="1.5" size="18"/>  </a>  </li> <li class="px-1">    <a href="#" class="text-white"> <BrandInstagramIcon stroke-width="1.5" size="18"/>   </a>   </li>  <li class="px-1"> <a href="#" class="text-white">  <BrandWhatsappIcon stroke-width="1.5" size="18"/> </a> </li>    </ul> -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
.top-bar .social-icon a {
    padding: 4px;
    background-color: transparent;
}
.top-bar {
    background: rgb(0 0 0);
}
.custom-input-style {
    max-width: 33%;
    margin-left: 17px;
    background: #fff;
    border-radius: 7px;
}
.review_img {
    height: 18px;
    width: 18px;
}
.user-btn:hover {
    box-shadow: none !important;
}
.user-btn {
    background: transparent;
    font-size: 14px !important;
    font-weight:400 !important;
}
</style>
