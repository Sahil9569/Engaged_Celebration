<script setup lang="ts">
import { ref } from 'vue';
// import imageAbout from '@/assets/images/website/th-img-couple.png'
// const imageUrl = ref(imageAbout)
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
// const showOverlay = ref(true);
// import axios from '@/stores/axios';


import { useMeta } from 'vue-meta';
useMeta({
  title: 'my privaccccccccccy page',
  meta: [
    { name: 'description', content: 'my privaccccccccccy page content' },
    { property: 'og:title', content: 'my privaccccccccccy page MySite' },
    // add other tags as needed
  ]
});

const page = ref({ title: 'Privacy Policy' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/'
    },
    {
        text: 'Privacy Policy',
        disabled: true,
        href: '#'
    }
]);

const fullpageloader = ref(false)
import axios from '@/stores/axios';


const term_content = ref();



function cleanHtml(html) {
    return html.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/g, '<li>$1</li>');
}


async function loadcontent() {
    fullpageloader.value = true;
    try {
        const response = await axios.get(`/home/handle_wcontent`);
        console.log(response.data, "response data >>>>>>>>>>>>>>>>>>>>>>>>>>>");
        
        if (response.data.status === "SENT") { 
            if (response.data.terms_data) {

                term_content.value = cleanHtml(response.data.terms_data['content']);

                // If editor is initialized, set content
                if (editor.value && editor.value.commands) {
                    editor.value.commands.setContent(term_content.value);
                }
            }

           
        }
    } catch (error) {
        console.error("Error loading content:", error);
    } finally {
        fullpageloader.value = false;
    }
}

loadcontent()






</script>

<template>
    <Header />
        <section class="position-relative mainbanner">
            <v-card class="elevation-0 rounded-md mb-8">
                <div class="px-8 py-8 py-lg-0 d-flex justify-center">
                <div class="d-flex justify-space-between">
                    <div class="d-flex py-0 align-center">
                        <div class="">
                            <h1 class="ctm_h2 mb-2 text-white sailFont">{{ page.title }}</h1>
                            <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-medium pa-0 d-flex justify-center">
                            <template v-slot:divider>
                                <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                            </template>
                            <template v-slot:title="{ item }">
                                <h6 class="text-white">{{ item.title }}</h6>
                            </template>
                            </v-breadcrumbs>
                            <div class="sideimg">
                            <img src="@/assets/images/landingpage/background/c2a.png">
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </v-card>
        </section>
        <section class="pb-10 pt-4">


            <div class="v-container">
                <div v-if="term_content" class="contentManageStyle">
                <div v-html="term_content"></div>
            </div>

                <div v-else class="contentManageStyle">
                    <h2>Introduction </h2>
                    <p>Welcome to Engaged Celebration LLC. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at 1-866-346-2155. </p>
                    <h2>Changes to Our Privacy Policy </h2>
                    <p>We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new privacy policy on our website. You are advised to review this privacy policy periodically for any changes. </p>
                    <h2>What Type of Information Do We Collect?</h2>
                    <p>We collect personal information that you provide to us such as:</p>
                    <ul>
                        <li>Name</li>
                        <li>Address</li>
                        <li>Contact information</li>
                        <li>Passwords and security data</li>
                        <li>Name</li>
                        <li>Payment information</li>
                    </ul>
                    <p>We also collect information automatically when you visit our website, such as: </p>
                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Usage data</li>
                    </ul>
                    <h3>How Do We Use the Information That We Collect?</h3>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our services </li>
                        <li>Improve, personalize, and expand our services</li>
                        <li>Understand and analyze how you use our services</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the service, and for marketing and promotional purposes </li>
                        <li>Process your transactions and manage your orders</li>
                        <li>Send you emails</li>
                        <li>Find and prevent fraud</li>
                    </ul>
                    <h3>With Whom Do We Share Information That We Collect? </h3>
                    <p>We may share your information with: </p>
                    <ul>
                        <li>Service providers: Third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. </li>
                        <li>Business transfers: In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. </li>
                        <li>Affiliates: Our affiliates, in which case we will require those affiliates to honor this privacy policy. </li>
                        <li>Business partners: Our business partners to offer you certain products, services, or promotions. </li>
                    </ul>
                    <h3>Cookies and Similar Technology</h3>
                    <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                        How We Manage Your Cookies</p>
                    <p>You can manage your cookie preferences through your browser settings. Each browser provides different mechanisms to manage cookies. Please refer to your browser’s help section for more information. </p>

                    <h3> Who Can You Contact for More Information? </h3>
                    <p>If you have questions or comments about this policy, you may contact our Data Protection Officer (DPO) at 1-866-346-2155.</p>
                </div>
            </div>
        </section>
    <Footer />
</template>

<!-- <style>
.sideimg img {
   width: 37%;
}
.sideimg {
   position: absolute;
   top: -99px;
   right: -463px;
}
.contentManageStyle h2,.contentManageStyle h3,.contentManageStyle h4,.contentManageStyle h5, .contentManageStyle h6 {
    margin-top: 25px;
}

.contentManageStyle ul {
    list-style-position: inside;
    margin-bottom: 15px;
    margin-top: 10px;
}

.contentManageStyle  p {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style> -->



<style>
.sideimg img {
   width: 37%;
}
.sideimg {
   position: absolute;
   top: -99px;
   right: -463px;
}
.contentManageStyle h2, .contentManageStyle h3, .contentManageStyle h4, .contentManageStyle h5, .contentManageStyle h6 {
    margin-top: 25px;
}

.contentManageStyle ul {
    list-style-type: disc; /* Standard bullets */
    list-style-position: inside; /* Positioning the bullets inside */
    padding-left: 1.5em; /* Padding for indentation */
    margin-bottom: 15px;
    margin-top: 10px;
}

.contentManageStyle p {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>