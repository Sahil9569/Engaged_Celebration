import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import '@/scss/customer.scss';
import '@/scss/custom.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { fakeBackend } from '@/utils/helpers/fake-backend';
import 'vue3-carousel/dist/carousel.css';
//Mock Api data
import './_mockApis';

import VCalendar from 'v-calendar';
import VueRecaptcha from 'vue3-recaptcha-v2';
import Maska from 'maska';
// print
// import print from 'vue3-print-nb';
// Table
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
//i18
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';

//ScrollTop
import VueScrollTo from 'vue-scrollto';

//LightBox
import VueEasyLightbox from 'vue-easy-lightbox';

const i18n = createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
});


import {
  createMetaManager,
  defaultConfig,
//   metaResolver
resolveOption,
} from 'vue-meta';
const app = createApp(App);
fakeBackend();



// const decisionMaker5000000 = resolveOption((prevValue:any, context:any) => {
//   const { uid = 0 } = context.vm || {}
//   if (!prevValue || prevValue < uid) {
//     return uid
//   }
// })

// app.use(createMetaManager(defaultConfig, decisionMaker5000000));   // for meta tags //
app.use(createMetaManager(defaultConfig));   // for meta tags //






app.use(router);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(PerfectScrollbar);
app.use(createPinia());
app.use(VCalendar, {});
app.use(VueTablerIcons);
// app.use(print);
app.use(VueRecaptcha, {
    siteKey: '6LdzqbcaAAAAALrGEZWQHIHUhzJZc8O-KSTdTTh_',
    alterDomain: false // default: false
});
app.use(i18n);
app.use(Maska);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');

//ScrollTop Use
// app.use(VueScrollTo);
app.use(VueScrollTo, {
    duration: 1000,
    easing: "ease"
});

//Lightbox
app.use(VueEasyLightbox)

