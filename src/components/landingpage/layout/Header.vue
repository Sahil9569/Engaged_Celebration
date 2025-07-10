<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import Logo from '@/layouts/full/logo/Logo.vue';
import RtlLogo from '@/layouts/full/logo/RtlLogo.vue';
import NotificationDD from '@/layouts/full/vertical-header/NotificationDD.vue';
import { router } from '@/router';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
import Navigations from '@/components/landingpage/layout/Navigation.vue';
/*Mobile Sidebar*/
import MobileSidebar from '@/components/landingpage/layout/MobileSidebar.vue';
/*import tabler icons*/
import { Menu2Icon } from 'vue-tabler-icons';
import axios from '@/stores/axios';

const user          = localStorage.getItem('user')
const appsdrawer    = ref(false);
const customizer    = useCustomizerStore();

const title                    = ref();
const facebook_or_vendors      = ref();
const twitter_or_couples       = ref();
const title1                   = ref();
const title2                   = ref();
const title3                   = ref();
const title4                   = ref();
const title5                   = ref();
const title6                   = ref();

(async function() {
    let hdata = '';
    const response = await axios.get(`/home/handle_wcontent`);

    if( response.data.status == 'SENT' ){
        console.log('dtttttttttta',response.data)
        console.log('header_data:-----', response.data.header_data);
        title.value                 = response.data.header_data['title']
        facebook_or_vendors.value                 = response.data.header_data['facebook_or_vendors']
        twitter_or_couples.value                 = response.data.header_data['twitter_or_couples']
        title1.value                 = response.data.header_data['title1']
        title2.value                 = response.data.header_data['title2']
        title3.value                 = response.data.header_data['title3']
        title4.value                 = response.data.header_data['title4']
        title5.value                 = response.data.header_data['title5']
        title6.value                 = response.data.header_data['title6']
        

    }
})();



</script>
<template>
    <div class="top-bar">
        <v-container class="container-width">
            <v-row class="align-center justify-space-between">
                <!-- <v-col cols="8" class="py-0 d-flex">
                  <span class="d-flex align-center sailFont font_14 font-weight-regular text-white">
                    <img src="@/assets/images/website/write_a_review_new.webp" class="mr-2 mt-1 review_img">
                     Write A Review
                  </span>
                    <v-text-field
                    class="custom-input-style customInput"
                    color = "secondary"
                    v-model="searchValue"
                    append-inner-icon="mdi-magnify"
                    placeholder="Search"
                    hide-details
                    density="compact"
                    @click:append-inner="searchit()"
                ></v-text-field>
                  
                </v-col> -->
                <v-col cols="6" class="text-start py-1" >
                    <p v-if="title" class="text-white text-body-1 inner-top-header">{{ title }}</p>
                    <p v-else class="text-white text-body-1 inner-top-header">Welcome to Engaged Celebration</p>
                </v-col>
                <v-col cols="6" class="py-0 text-end" v-if="user">
                    <v-btn to="/login" class="form-btn bg-dark text-white user-btn"> <UsersIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> Dashboard</v-btn>
                </v-col>
                <!-- <v-col cols="6" class="py-0 text-end" v-else>
                    <v-btn to="/register?as=vendor" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> Become a vendor</v-btn>
                    <v-btn to="/register?as=customer" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> View our vendors & packages</v-btn>
                </v-col> -->
                <v-col cols="6" class="py-0 text-end" v-else>
                    <v-btn v-if="facebook_or_vendors" to="/register?as=vendor" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> {{ facebook_or_vendors }}</v-btn>
                    <v-btn v-else to="/register?as=vendor" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> Become a vendor</v-btn>
                    
                    <v-btn v-if="twitter_or_couples" to="/register?as=customer" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> {{ twitter_or_couples }}</v-btn>
                    <v-btn v-else to="/register?as=customer" class="form-btn bg-dark  text-white user-btn text-subtitle-1"> <UserIcon stroke-width="1.6" size="16" class="mr-1 mt-1 "/> View our vendors & packages</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <div>

        <div>
            <!-- -----------------------------------------------
                    Start Header
                    ----------------------------------------------- -->

            <v-app-bar height="67" class="lp-header header-section-custom position-relative " flat>
                <v-container class="maxWidth py-sm-4 py-0 customStyleCon ">
                    <v-toolbar class="d-flex align-center justify-space-between custom-header">
                        <!-- Logo -->
                        <div class="lo_go">
                          <router-link class="d-inline-block" to="/">
                            <img src="@/assets/images/logos/Logo-a13.png">
                          </router-link>
                        </div>
                        <!-- Desktop view Navigation -->

                        <div class="d-flex">

                            <div class="navigation d-lg-flex d-none align-center">
                                <Navigations />
                                <!-- do not change the '/login' here, it is to redirect to respective dashboard when the user is loggedin-->
                            </div>
                            
                            <v-btn variant="text" class="hidden-lg-and-up ml-auto" icon @click.stop="appsdrawer = !appsdrawer">
                                <Menu2Icon size="22" stroke-width="1.5" />
                            </v-btn>
                            
                            <div class="ml-2" v-if="user">
                                <NotificationDD />
                            </div>

                            <div class="ml-2" v-if="user">
                                <ProfileDD />
                            </div>
                            
                            <div v-else>
                                <v-btn class="custom-hover-primary bg-dark ml-2 text-white head_btn" flat
                                    href="/login"><span class="text-white">Sign In</span>
                                </v-btn>
                            </div>


                        </div>

                    </v-toolbar>

                </v-container>
            </v-app-bar>
            <!-- -----------------------------------------------
                    End Header
                    ----------------------------------------------- -->
                    
        </div>

        <!----sidebar menu drawer start----->
        <v-navigation-drawer class="lp-drawer" v-model="appsdrawer" location="left" temporary>
            <MobileSidebar />
        </v-navigation-drawer>
    </div>
</template>
<style>
.navigation .v-btn.v-btn--active.nav-links {
    color: #d2a957 !important;
}
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
.custom-header>.v-toolbar__content {
    display: flex;
    justify-content: space-between;
}

img.logo-img-setting {
    padding-top: 8px;
}

/* header {
    background-color: transparent;
} */

/* .v-app-bar.v-toolbar.header-section-custom,
.header-section-custom .v-toolbar {
    background-color: transparent !important;
} */

.lo_go img {
    width: 230px;
}

.filterheader {
    box-shadow: 0px 0px 10px #0000002e;
}
.filterheader .border-top {
    border-top: 1px solid #e5e5e5;
}
.inner-top-header {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #ecb447, #dab368, #ffc451);
    background-repeat: no-repeat;
    background-size: 80%;
    animation: animate 3.5s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0;
}
@keyframes animate {
    0% {
    background-position: -400%;
    }

    100% {
        background-position: 400%;
    }
}
</style>