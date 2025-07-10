<script setup lang="ts">
import { ref, onMounted, computed ,watch,nextTick } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import CategoryfilterFAQ from '@/components/landingpage/section/categoryfilterfaq.vue';
import { Carousel, Slide } from "vue3-carousel";
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
const route = useRoute();
const router = useRouter();




import {useRouter, useRoute } from 'vue-router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


// const is_valid = ref(['customer'].includes(localStorage.getItem('role') || '') ? false : true);
const userRole = localStorage.getItem('role') || '';
const is_valid = ref(userRole !== 'customer');


import user1 from "@/assets/images/profile/user-1.jpg";
import user2 from "@/assets/images/profile/user-2.jpg";
import user3 from "@/assets/images/profile/user-3.jpg";
import user4 from "@/assets/images/profile/user-4.jpg";

const showSuccessMessage = ref(false)
const fullpageloader = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')
const searchcat = ref()
const catitems = ref()
const searchloc = ref()
const locitems = ref()
const searchbud = ref('Any')
const buditems = ref(['Any'])
const searchrol = ref('All');
const rolitems = ref(['All', 'Admin', 'Vendor']);
const bookingData = ref([]);
const relatedData = ref([]);
const filteredData = ref([]);



// (async function(){
//     fullpageloader.value = true
//     const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({cat:'', sts:''})}`)
//     console.log("response_____________", response, route.query.cat, route.query.loc, route.query.bud)
//     if (response.data.status == "SENT"){
//         catitems.value = [{'text':'All', 'value':0, 'budget':response.data.allcatbudget}].concat(response.data.cats.map((a:any)=>({'text':a.name, 'value':a.id, 'budget':a.budget})))
//         locitems.value = [{'text':'All', 'value':0}].concat(response.data.states)
//     }
//     searchcat.value   = ['undefined', null, 0, 'null', undefined].includes(route.query.cat) ? null : catitems.value.find((a:any)=>(a.value== route.query.cat)).value
//     set_budget()
//     const empt = ['undefined', null, 0, '0', 'null', undefined]
//     searchloc.value   = empt.includes(route.query.loc) ? null : locitems.value.find((a:any)=>(a.value==route.query.loc))
//     searchbud.value   = empt.includes(route.query.bud) ? 'Any': route.query.bud
//     // searchbud.value   = empt.includes(route.query.bud) ? 'Any': buditems.value.find((a:any)=>(a==route.query.bud))
//     searchrol.value   = empt.includes(route.query.rol) ? 'All': route.query.rol
//     searchpacks()
// })();



(async function(){
    fullpageloader.value = true;

    // let locationText = route.params.searchloc !== 'all' ? route.params.searchloc.replace(/-/g, ' ') : null;
    let locationText = route.params.searchloc && route.params.searchloc !== 'all' 
    ? route.params.searchloc.replace(/-/g, ' ') 
    : null;

    let categoryText = route.params.searchcat ? route.params.searchcat.replace('wedding-', '').replace(/-/g, ' ') : null;
    // let budgetText = route.params.searchbud && route.params.searchbud !== "any" ? route.params.searchbud.replace(/-/g, ' ') : "Any";
    let budgetText = route.params.searchbud && route.params.searchbud !== "any" 
    ? route.params.searchbud.replace(/-/g, ' ') 
    : "Any";

    // Ensure correct budget format
    if (budgetText.match(/^(\d+\$)\s+(\d+\$)$/)) {
        budgetText = budgetText.replace(/\s+/, ' - '); // Ensures proper " - " spacing
    }

    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({cat:'', sts:''})}`);
    console.log("response_____________", response);

    if (response.data.status == "SENT") {
        catitems.value = [{'text':'All', 'value':0, 'budget':response.data.allcatbudget}].concat(
            response.data.cats.map((a) => ({'text': a.name, 'value': a.id, 'budget': a.budget}))
        );
        locitems.value = [{'text':'All', 'value':0}].concat(response.data.states);
        console.log('lociteeeeeeeem--------',locitems.value)
    }

    searchcat.value = categoryText ? catitems.value.find((a) => a.text.toLowerCase() === categoryText)?.value : null;
    set_budget();
    await nextTick();

    const empt = ['undefined', null, 0, '0', 'null', undefined];
    searchcat.value = categoryText
    ? catitems.value.find(
        (a) => a.text.toLowerCase().replace(/\s|-/g, '') === categoryText.toLowerCase().replace(/\s|-/g, '')
      )?.value
    : null;

    searchloc.value = empt.includes(locationText) ? null : locitems.value.find((a) => a.text.toLowerCase() === locationText);
    searchbud.value = empt.includes(budgetText) ? 'Any' : budgetText;
    searchrol.value = empt.includes(route.query.rol) ? 'All' : route.query.rol;

    searchpacks();
})();




const dynamicHeading = computed(() => {
    console.log("searchloc value:", searchloc.value); 
    console.log("locitems list:", locitems.value);

    const category = searchcat.value 
        ? catitems.value.find(item => item.value === searchcat.value)?.text || null
        : null;

    let location = null;

    if (searchloc.value !== undefined && searchloc.value !== null) {
        // If searchloc.value is an object with a 'value' property 
        if (typeof searchloc.value === "object" && "value" in searchloc.value) {
            location = locitems.value.find(item => item.value === searchloc.value.value)?.text || null;
        } 
        // If searchloc.value is a number 
        else if (typeof searchloc.value === "number") {
            location = locitems.value.find(item => item.value === searchloc.value)?.text || null;
        }
        // If searchloc.value is already a string 
        else if (typeof searchloc.value === "string") {
            location = searchloc.value;
        }
    }

    console.log("Found category:", category);
    console.log("Found location:", location);
    if (category && location === 'All') {
        return `Wedding ${category}`;
    }
    else if (category && location) {
        return `Wedding ${category} in ${location}`;
    } else if (category) {
        return `Wedding ${category}`;
    } else if (location === 'All') {
        return `Wedding Packages`;
    }else if (location) {
        return `Wedding Packages in ${location}`;
    }else {
        return ''; 
    }

});




function set_budget(){
    console.log("level_4", searchcat.value, catitems.value, buditems.value)
    searchbud.value = 'Any'
    let icat = catitems.value.find((a: any) => (a.value == searchcat.value))
    let a = (icat) ? icat.budget : []
    buditems.value = ['Any'].concat(a)
    console.log("level_5", buditems.value)
}


// async function searchpacks() {
//     console.log("values_______", searchcat.value, searchloc.value, searchbud.value)
//     fullpageloader.value = true
//     const fd = new FormData();
//     fd.append("cat", (searchcat.value) ? ((searchcat.value['value']) ? searchcat.value['value'] : searchcat.value) : '')
//     fd.append("loc", (searchloc.value) ? ((searchloc.value['value']) ? searchloc.value['value'] : searchloc.value) : '')
//     fd.append("bud", (searchbud.value) ? searchbud.value : '')
//     fd.append("rol", (searchrol.value) ? searchrol.value : '')
//     const response = await axios.post(`/home/searchpacks`, fd, config);
//     console.log("response__________", response.data)
//     if (response.data.status == 'SENT') { 
//         fullpageloader.value        = false; 
//         bookingData.value           = response.data.packs 
//         relatedData.value           = response.data.related
//     }
// }

const all_review_data = ref([]); 


async function fetchPackageReviews() {
    if (!searchcat.value) {
        console.warn("No category selected");
        return;
    }

    try {
        const fd = new FormData();
        fd.append("pack_id", searchcat.value);

        const response = await axios.post('/home/fetch_pack_review', fd);

        if (response.data.status === 'Done') {
            console.log("package_review_____", response.data);

            all_review_data.value = response.data.all_reviews.map((elem) => ({
                coupleimgphoto: elem.user.profile_pic ? BASE_URL + elem.user.profile_pic : user1,
                reviewtext: elem.comment,
                // reviewppostedtime: '$' + elem.created_at,
                reviewppostedtime: formatDate(elem.created_at),
                coupleName: `${elem.user.user.first_name} ${elem.user.user.last_name}`,
                rating: elem.rating,
                package_name: elem.package.name,
                package_id: elem.package.id,
                link: `/cpackage_pub/${elem.package.id}`,
            }));
        }
    } catch (error) {
        console.error("Error fetching reviews", error);
    }
}

// Watch searchcat and fetch reviews when it changes
watch(searchcat, () => {
    fetchPackageReviews();
});



function formatDate(isoString) {
    if (!isoString) return "";  
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
        console.error("Invalid date format:", isoString);
        return "Invalid Date"; 
    }
    return `${date.getDate().toString().padStart(2, '0')}/${
        (date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}



const expandedReviews = ref({}); 

const toggleReview = (index) => {
    expandedReviews.value[index] = !expandedReviews.value[index];
};

const truncateText = (text, wordLimit = 20) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
};



import image1 from '@/assets/images/customer/decorator.jpeg';
const galleryimages = ref([{ image: image1, },]);
const productImages = ref([]);
const album_pack_id = ref('');
const album = ref([{ albumimg: image1, albumtitle: "mumbai", images: [] },]);
const tab4 = ref(null);
const dialog = ref(false);
//Fancybox
const visibleRef = ref(false)
const indexRef = ref(0)
const imgs = ref([]); // Empty array to store dynamic images
const onHide = () => visibleRef.value = false;
const moveDisabled = ref(true);


const all_faq_data = ref([]);


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





const showImg = (index, imageList) => {
    imgs.value = imageList.map(img => BASE_URL + img.image); // Assign images dynamically
    indexRef.value = index;
    visibleRef.value = true;
};



async function searchpacks() {
    console.log("values_______", searchcat.value, searchloc.value, searchbud.value);
    fullpageloader.value = true;
    console.log('searchloc--',searchloc)
    console.log('searchcat--',searchcat)
    console.log('searchbud--',searchbud)

    let locationText = searchloc.value 
        ? locitems.value.find((item) => item.value === searchloc.value)?.text.toLowerCase().replace(/ /g, '-')
        : 'all';

    let categoryText = searchcat.value 
        ? catitems.value.find((item) => item.value === searchcat.value)?.text.toLowerCase().replace(/ /g, '-')
        : 'all';

    let categoryId = searchcat.value 
    ? (searchcat.value.value ? searchcat.value.value : searchcat.value) // Ensure correct ID format
    : '';
    console.log('categoryId-//--',categoryId)


    let budgetText = searchbud.value && searchbud.value !== "Any"
    ? searchbud.value.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-') // Ensures single `-`
    : 'any';


    setTimeout(() => {
        let params = {
            searchloc: locationText,
            searchcat: `wedding-${categoryText}`
        };

        if (budgetText !== "any") {
            params.searchbud = budgetText; // Add searchbud only if it's not "any"
        }

        router.push({
            name: 'AllPackageListingWithParams',
            params
        });
    }, 50);


    // setTimeout(()=>{router.push({
    //     name: 'AllPackageListingWithParams',
    //     params: {
    //         searchloc: locationText,
    //         searchcat: `wedding-${categoryText}`, 
    //         searchbud: budgetText
    //     }
    // });}, 50)

    const fd = new FormData();
    fd.append("cat", searchcat.value ? (searchcat.value['value'] ? searchcat.value['value'] : searchcat.value) : '');
    fd.append("loc", searchloc.value ? (searchloc.value['value'] ? searchloc.value['value'] : searchloc.value) : '');
    // fd.append("bud", searchbud.value ? searchbud.value : '');
    fd.append("bud", searchbud.value ? searchbud.value.replace(/\s+/g, ' ').replace(/(\d+\$)\s+(\d+\$)/, '$1 - $2') : '');

    fd.append("rol", searchrol.value ? searchrol.value : '');

    const response = await axios.post(`/home/searchpacks`, fd);
    console.log("response__rltd_packs________", response.data);

    if (response.data.status == 'SENT') { 
        fullpageloader.value = false; 

        all_faq_data.value = response.data.faq_data;

        const allStates = response.data.all_state_data.map((s) => s.state); // Extract all states
        console.log("All States List:", allStates); // Debug all states
        console.log("All States List:", response.data.all_pack_data); // Debug all states

        // all_random_pack.value = response.data.all_pack_data;
        all_random_pack.value = response.data.all_pack_data.filter(pack => pack.category.id !== categoryId);

        bookingData.value = response.data.packs.map((a) => {
        const packageStates = a.states.map((s) => s.state);
        console.log(`🏷️ Package: ${a.vendorname}, States:`, packageStates);

        const isAllStates = allStates.every(state => packageStates.includes(state));
        
        return {
            ...a,
            states: isAllStates ? ["All States"] : packageStates, // Apply "All States" logic
            country: a.country.country ,
        };
        });

        console.log("Final Booking Data:", bookingData.value); // Debug final structured data

        // bookingData.value = response.data.packs;
        relatedData.value = response.data.related;
        galleryimages.value = response.data.serialized_albums.image_urls;
        productImages.value = response.data.serialized_albums;
        console.log("response.data.serialized_albums--",response.data.serialized_albums)
    }
}

const all_random_pack = ref([]);


async function edirectToLogin(){
            window.location.href = "/login"; 
        }


const currentPage = ref(1);
const itemsPerPage = 15
const paginatedList = computed(() => {
    const filteredData = bookingData.value.filter(item => item.pack_status === true);
    // console.log('filtered data',filteredData)
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return bookingData.value.slice(start, end);
});



const reviewCardnew = ref([
    {
        coupleimgphoto: user1,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Deepak Sajwan"
    },
    {
        coupleimgphoto: user2,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Palvi Sharma"
    },
    {
        coupleimgphoto: user3,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Gurikaran Singh"
    },
    {
        coupleimgphoto: user4,
        reviewtext: "I recently had the pleasure of working with Wedding Planner to organize and execute the wedding of my dreams, and I am beyond thrilled with the results. From the initial consultation to the last dance, Wedding Planner's demonstrated professionalism, creativity, and an unwavering commitment to making our special day absolutely perfect.",
        reviewppostedtime: "1 Year Ago",
        coupleName: "Sahil Thakur"
    },
]);




/*--Booking table data --*/
import serviceimg1 from "@/assets/images/website/decoration1.jpg";

const bookingDataservice = ref([
    {
        includeervice: "",
        vendorserviceimg: serviceimg1,
        serviceprovidername: " ",
        vendorserviceprice: "",
        vendorname: "",
        link: "/",
        states: "",
    },
]);


/*Vendor category Slider*/
const vendorslideSettings = {
    snapAlign: "start",
    itemsToShow: 1,
    slideToShow: 3, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,

};
const vendorslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 3 },
    1800: { itemsToShow: 4 },
    2200: { itemsToShow: 5 },
};
const carouselfirstRef = ref(null);


const nextfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.next();
};

const prevfirstSlide = () => {
    carouselfirstRef.value && carouselfirstRef.value.prev();
};


/*Album category Slider*/
const albumslideSettings = {
    snapAlign: "center",
    itemsToShow: 1,
    slideToShow: 3, // Corrected from slideToShow to slideToShow
    autoplay: false,
    autoplaySpeed: 3000, // Decreased autoplay speed to 3 seconds
    arrows: true,
    infinite: true,
    wrapAround: true,
};
const albumslideBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 1 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1500: { itemsToShow: 5 },
    1800: { itemsToShow: 6 },
    2200: { itemsToShow: 7 },
};

const carouselfirstRefalbum = ref(null);

const nextfirstSlideAlbum = () => {
    carouselfirstRefalbum.value && carouselfirstRefalbum.value.next();
};

const prevfirstSlideAlbum = () => {
    carouselfirstRefalbum.value && carouselfirstRefalbum.value.prev();
};


async function refreshPage() {
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}




// function checkinput() {searchbud.value = (searchbud.value < 1) ? '' : searchbud.value}
const clickFunModalbookin = (item: any) => { item.dialogbooking = true }

const showAll = ref(false);

const name = ref();
const email_id = ref();
const phone_no = ref();
const msg = ref();
const showSuccess = ref(false);
const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const emailRules = ref([(v: string) => { if (!v) { return 'Please enter email'; } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { return true; } else { return 'Enter a Valid Email'; } }]);
function checklength() {
    if (name.value) name.value = (name.value.length > 50) ? name.value.slice(0, 50) : name.value
    if (phone_no.value) phone_no.value = (phone_no.value.length > 10) ? phone_no.value.slice(0, 10).replace(/\D/g, "") : phone_no.value.replace(/\D/g, "");
    if (email_id.value) email_id.value = (email_id.value.length > 100) ? email_id.value.slice(0, 100) : email_id.value
}
async function send_inquiry(action = 'null', user_type = 'null', user_id = "null") {
    try {
        const checkemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id.value)
        if (!(name.value && email_id.value && phone_no.value && msg.value && checkemail && (phone_no.value.length == 10))) {
            showErrorMessage.value = true;
            myerrors.value = 'Please fill all required fields!';
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
            return null
        }
        const formData = new FormData();
        formData.append("action", action);
        formData.append("user_type", user_type);
        formData.append("user_id", user_id);
        formData.append("name", name.value);
        formData.append("email", email_id.value);
        formData.append("phone_no", phone_no.value);
        formData.append("msg", msg.value);
        fullpageloader.value = true;

        const response = await axios.post(`/home/send_inquiry`, formData, config);

        if (response.data.status === 'SAVED') {
            myerrors.value = "Your enquiry sent successfully!"
            showSuccessMessage.value = true;
            setTimeout(() => { showSuccessMessage.value = false; }, 800);

            setTimeout(() => { window.location.reload(); }, 800);
            // window.location.reload();
            name.value = "";
            email_id.value = "";
            phone_no.value = "";
            msg.value = "";

        }

    } catch (error) {
        console.error("Error sending enquiry:", error);
    } finally {
        fullpageloader.value = false;
    }
}



const savedPackages = ref(new Set());

async function fetchSavedPackages() {
    try {
        const response = await axios.get(`/home/save_for_later`);
        if (response.data.status === "Done") {
            savedPackages.value = new Set(response.data.data);  // Store package IDs
        }
    } catch (error) {
        console.error("Error fetching saved packages:", error);
    }
}
onMounted(fetchSavedPackages);


async function save_package(itemId) {
    try {
       
        fullpageloader.value = true;
        const formData = new FormData();
        formData.append("package_id", itemId);

        const response = await axios.post(`/home/save_for_later`, formData);

        if (response.data.status === "Saved") { 
            myerrors.value = 'Package added to wishlist successfully!';
            savedPackages.value.add(itemId);
            showSuccessMessage.value = true;
            setTimeout(() => {  showErrorMessage.value = false;  }, 3000); 
           
        } 
        else if (response.data.status === "Removed") {
            myerrors.value = 'Package successfully removed from wishlist!';
            savedPackages.value.delete(itemId);
            showSuccessMessage.value = true;
            setTimeout(() => {  showErrorMessage.value = false;  }, 3000);
      
        } 
        else { 
            console.error("Failed to save package"); 
        }

        setTimeout(() => { showSuccessMessage.value = false; }, 3000); 
        fullpageloader.value = false;

    } catch (error) {
        console.error("Error saving package:", error);
    } 
}





function cleanHtmlContent(html) {
    return html.replace(/<p>\s*<\/p>/g, '<br><br>');
  }

</script>

<template>
      <Header />
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <div class="lp-wraper">

        <div class="position-relative mainbanner single-banner">
            <v-container class="container-width">
                <h3 class="ctm_h2 mb-5 text-white sailFont">Packages</h3>
                <v-card class="bg-custom-white" elevation="10">
                    <v-card-item class="pa-4">
                        <v-row class="px-4 py-5 ">
                            <v-col cols="12" md="10">
                                <v-row>
                                    <v-col cols="12" md="3" class="pa-0 pe-1">
                                        <v-autocomplete v-model="searchcat" :items="catitems" color="secondary"
                                            label="Category" variant="outlined" density="comfortable" hide-details
                                            item-title="text" item-value="value" @update:modelValue="set_budget()">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pa-0 pe-1">
                                        <v-autocomplete v-model="searchloc" :items="locitems" color="secondary"
                                            label="Location" variant="outlined" density="comfortable" hide-details
                                            item-title="text" item-value="value">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pa-0 pe-1">
                                        <v-autocomplete v-model="searchrol" :items="rolitems" color="secondary"
                                            label="Type" variant="outlined" density="comfortable" hide-details
                                            item-title="text" item-value="value">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pa-0">
                                        <v-combobox v-model="searchbud" :items="buditems" variant="outlined"
                                            label="Budget" density="comfortable" hide-details></v-combobox>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="2" class="py-0">
                                <v-btn color="secondary" size="large" class="w-100"
                                    @click="searchpacks()">Search</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-item>
                </v-card>
            </v-container>
        </div>
        <v-container class="container-width">
            <v-row class="justify-center my-2">
                <v-col cols="12" v-if="paginatedList.length> 0">
                    <h3>{{ dynamicHeading }}</h3>
                    <!-- <h3>Wedding photographer in New York</h3> -->
                </v-col>
                <v-col cols="12" md="4" v-for="item in paginatedList" :key="item.vendorname" class="position-relative">
                    <div class="custom_section">
                        <div class="orderingStyle">

                            <router-link :to="`/cpackage_pub/${item.id}`"
                                class="w-100 text-decoration-none position-relative">
                                <div class="position-relative d-flex overflow-hidden img-order vendorsc-section">
                                    <img v-if="item.package_logo !== '/media/default.jpg'"
                                        :src="BASE_URL + item.package_logo" class="vendormainimg vendormainimgnew">
                                    <img v-else :src="item.serviceimg1" class="vendormainimg vendormainimgnew">
                                </div>
                            </router-link>
                            <div class="top-ctsection">
                                <div class="mt-2 w-100">
                                <div>
                                <div v-if="!is_valid">
                                    <v-col cols="6">

                                            <!-- Unsave Button (Shown if the package is already saved) -->
                                    <div
                                        v-if="savedPackages.has(item.id)" 
                                        class="ctm-save" 
                                        @click="save_package(item.id)">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="#fff"  class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
                                            
                                    </div>

                                    <!-- Save Button (Shown if the package is NOT saved) -->
                                    <div
                                        v-else 
                                        class="ctm-save " 
                                        @click="save_package(item.id)">
                                        <HeartIcon stroke-width="1.5" size="18" color="#fff" />
                                            
                                    </div>
                                    </v-col>
                                </div>
                                <!-- <v-btn color="secondary" variant="flat" size="small" class="mt-3"
                                    :href="`/login`">
                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Save For Later
                                    </v-btn> -->
                                <div v-else class="ctm-save-later" @click="edirectToLogin" >
                                    <HeartIcon stroke-width="1.5" size="18" color="#fff" />
                                </div>


                                    </div>
                                    <div class="d-flex justify-space-between">
                                        <v-rating half-increments disabled v-model="item.iratings" density="compact"
                                            color="warning" size="small"></v-rating>

                                        <h4
                                            class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                            ${{ item.price }}</h4>

                                    </div>
                                    <h4 class="text-subtitle-3 text-ellipsis font-weight-semibold textSecondary mb-0">
                                        {{
                                        item.name }} </h4>
                                    <h6 class="text-body-2 font-weight-semibold"><span
                                            class="font-weight-medium">Category
                                            :</span> {{ item.category.name }} </h6>

                                    <div>
                                        <h6 v-if="item.states && item.states.length > 0" class="text-body-2 font-weight-semibold">
                                        <span class="font-weight-medium">Location:</span>

                                        <!-- Display country before states -->
                                        <span v-if="item.country" class="font-weight-semibold">
                                            {{ item.country }}:
                                        </span>

                                        <!-- 1st Condition: If "All States" exists, show only "All States" -->
                                        <span v-if="item.states.includes('All States')">
                                            All States
                                        </span>

                                        <!-- 2nd Condition: If 5 or fewer states, display all normally -->
                                        <span v-else-if="item.states.length <= 5">
                                            <span v-for="(state, index) in item.states" :key="index">
                                                {{ state }}<span v-if="index !== item.states.length - 1">, </span>
                                            </span>
                                        </span>

                                        <!-- 3rd Condition: If more than 5 states, display first 5 with "View All" -->
                                        <span v-else>
                                            <span v-for="(state, index) in (item.showAll ? item.states : item.states.slice(0, 3))" :key="index">
                                                {{ state }}<span v-if="index !== (item.showAll ? item.states.length - 1 : 4)">, </span>
                                            </span>

                                            <!-- Toggle Button to Show/Hide All States for Specific Package -->
                                            <span class="text-primary cursor-pointer" @click="item.showAll = !item.showAll">
                                                {{ item.showAll ? '  Hide' : '  View All' }}
                                            </span>
                                        </span>
                                    </h6>
                                        <p v-if="item.advance_payment">
                                        <h6 v-if="item.advance_payment" class="text-body-2 text-13"><span
                                                class="font-weight-semibold">Deposit
                                                :</span>$ {{ parseInt(item.advance_payment / 100 * item.price) }} ({{
                                            item.advance_payment }}% of $ {{ item.price }})

                                        </h6>
                                        </p>
                                        <p v-else="item.full_price">
                                        <h6 v-if="item.full_price" class="text-body-2 text-13"><span
                                                class="font-weight-semibold">Deposit
                                                :</span>$ {{ parseInt(item.full_price) }}
                                            ({{ ((item.full_price / item.price) * 100).toFixed(2) }}% of $ {{ item.price
                                            }})

                                        </h6>
                                        </p>

                                        <h6 v-if="item.vendor" class="text-body-2 font-weight-semibold mb-0 "><span
                                                class="font-weight-medium">Offered by :</span>

                                            {{ item.vendor.userprofile.user.first_name }} {{
                                            item.vendor.userprofile.user.last_name }}

                                        </h6>


                                        <h6 v-else class="text-body-2 font-weight-semibold mb-0 "><span
                                                class="font-weight-medium">Offered by :</span> {{
                                            item.admin.userprofile.user.first_name }} {{
                                            item.admin.userprofile.user.last_name }}</h6>
                                    </div>
                                </div>

                            </div>
                            <v-row class="mt-2">
                                <v-col cols="6">
                                    <v-btn color="secondary" variant="flat" class=" d-block py-1" size="small"
                                        :to="`/cpackage_pub/${item.id}?booknow`">
                                        <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Book now
                                    </v-btn>
                                </v-col>

                                <v-col cols="6">
                                    <v-btn color="secondary" variant="flat" size="small" class="w-100 d-block"
                                        @click="clickFunModalbookin(item)">
                                        <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />
                                        Send Enquiry
                                    </v-btn>
                                </v-col>
                                <v-dialog v-model="item.dialogbooking" persistent class="dialog-mw" size="small">
                                    <v-card class="pa-6">
                                        <div class="d-flex justify-space-between">
                                            <h4
                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold text-dark ">
                                                Send Enquiry For - {{ item.category.name }} </h4>
                                            <v-btn icon color="" @click="item.dialogbooking = false" flat
                                                variant="outlined" size="x-small" class="bg-error">
                                                <XIcon width="20" />
                                            </v-btn>
                                        </div>
                                        <v-row>
                                            <v-col cols="6">
                                                <VTextField type="text" maxlength="50" v-model="name" placeholder="Name"
                                                    hide-details @keyup="checklength()"></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField type="email" maxlength="100" v-model="email_id"
                                                    placeholder="Email" hide-details :rules="emailRules"
                                                    @keyup="checklength()"></VTextField>
                                            </v-col>
                                            <v-col cols="12">
                                                <VTextField type="text" maxlength="10" v-model="phone_no"
                                                    placeholder="Phone No" hide-details :rules="phonenoRules"
                                                    @keyup="checklength()"></VTextField>
                                            </v-col>
                                            <v-col cols="12">
                                                <VTextarea v-model="msg" auto-grow placeholder="Message" rows="5"
                                                    color="primary" row-height="25" shaped hide-details></VTextarea>
                                            </v-col>
                                            <v-col v-if="item.vendor" cols="12" class="text-center">
                                                <v-btn @click="send_inquiry('Package_User', 'vendor', item.vendor.id)"
                                                    flat class="submit_btn bg-dark text-white mb-5">Send An enquiry
                                                </v-btn>
                                            </v-col>
                                            <v-col v-else cols="12" class="text-center">

                                                <v-btn @click="send_inquiry('Package_User', 'admin', item.admin.id)" flat
                                                    class="submit_btn bg-dark text-white mb-5">Send An enquiry </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-dialog>
                            </v-row>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" class="d-flex justify-end" v-if="paginatedList.length != 0">
                    <v-pagination v-model="currentPage" :length="Math.ceil(bookingData.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-col>

                <template v-if="paginatedList.length === 0">
                    <!-- <v-card elevation="0" class="text-center mt-6 border" color="">
                        <v-card-item class="mx-auto">
                            <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                            <h5 class="pt-2 text-error font-weight-semibold">We couldn't find the package you were
                                looking for!<span v-if="relatedData.length"><br> However, we have similar packages that
                                    might interest you.<br> Please check out the suggestions below.</span></h5>
                        </v-card-item>
                    </v-card> -->
                    <v-row class="py-10" v-if="relatedData.length">
                        <v-col cols="12">
                            <h2>Suggested Packages</h2>
                        </v-col>
                        <v-col cols="12" md="4" v-for="item in relatedData" :key="item.vendorname"
                            class="position-relative">
                            <div class="custom_section">
                                <div class="orderingStyle">
                                    <router-link :to="`/cpackage_pub/${item.id}`"
                                        class="w-100 text-decoration-none position-relative">
                                        <div
                                            class="position-relative d-flex overflow-hidden img-order vendorsc-section">
                                            <img v-if="item.package_logo !== '/media/default.jpg'"
                                                :src="BASE_URL + item.package_logo"
                                                class="vendormainimg vendormainimgnew">
                                            <img v-else :src="item.serviceimg1" class="vendormainimg vendormainimgnew">
                                        </div>
                                    </router-link>
                                    <div class="top-ctsection">
                                        <div class="d-flex justify-space-between align-start">
                                            <v-rating half-increments disabled v-model="item.iratings"
                                                density="compact" color="warning" size="small"></v-rating>
                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                    ${{ item.price }}</h4>
                                        </div>
                                        <div class="text-left">
                                               
                                                <h4
                                                    class="text-subtitle-3 mt-2 text-no-wrap font-weight-semibold textSecondary mb-0">
                                                    {{ item.name }} </h4>
                                                <h6 class="text-body-2 font-weight-semibold"><span
                                                        class="font-weight-medium">Category :</span>
                                                    {{ item.category.name }} </h6>

                                                <div>
                                                    <!-- <h6 v-if="item.states && item.states.length > 0"
                                                        class="text-body-2 font-weight-semibold">
                                                        <span v-if="item.states && item.states.length == 1"
                                                            class="font-weight-medium">Location:</span>
                                                        <span v-else class="font-weight-medium">Locations:</span>
                                                        <span v-for="(c, index) in item.states" :key="c.id">
                                                            {{ c.state }}
                                                            <span v-if="index !== item.states.length - 1">,</span>
                                                        </span>
                                                    </h6> -->
                                                    <h6 v-if="item.states && item.states.length > 0"
                                                        class="text-body-2 font-weight-semibold">
                                                        <span v-if="item.country" class="font-weight-medium">{{ item.country.country }}: </span>

                                                         <!-- All States case -->
                                                        <span v-if="item.states.includes('All States')">All States</span>
                                                        
                                                        <span v-else-if="item.states.length <= 5">
                                                        <span v-for="(state, index) in item.states" :key="index">
                                                            {{ state.state }}<span v-if="index !== item.states.length - 1">, </span>
                                                        </span>
                                                        </span>

                                                        <span v-else>
                                                        <span v-for="(state, index) in (item.showAll ? item.states : item.states.slice(0, 3))" :key="index">
                                                            {{ state.state }}<span v-if="index !== (item.showAll ? item.states.length - 1 : 4)">, </span>
                                                        </span>

                                                        <!-- Toggle Button to Show/Hide All States for Specific Package -->
                                                        <span class="text-primary cursor-pointer" @click="item.showAll = !item.showAll">
                                                            {{ item.showAll ? '  Hide' : '  View All' }}
                                                        </span>
                                                    </span>
                                                        
                                                        
                                                    </h6>
                                                    <h6 v-if="item.advance_payment != 0"
                                                        class="text-body-2 font-weight-semibold">
                                                        <span class="font-weight-medium">Deposit :</span>
                                                        ${{ parseInt((parseInt(item.advance_payment) / 100) *
                                                        (parseInt(item.price)))}} <span
                                                            class="ps-1">({{ item.advance_payment }}%)</span>

                                                    </h6>

                                                    <h6 v-if="item.vendor"
                                                        class="text-body-2 font-weight-semibold mb-0 "><span
                                                            class="font-weight-medium">Offered by :</span>

                                                        {{ item.vendor.userprofile.user.first_name }} {{
                                                        item.vendor.userprofile.user.last_name }}

                                                    </h6>


                                                    <h6 v-else class="text-body-2 font-weight-semibold mb-0 "><span
                                                            class="font-weight-medium">Offered by :</span> {{
                                                        item.admin.userprofile.user.first_name }} {{
                                                        item.admin.userprofile.user.last_name }}</h6>
                                                </div>
                                            </div>
                                        <v-row class="mt-2">
                                            <v-col cols="6">
                                                <v-btn color="secondary" variant="flat" class=" d-block py-1"
                                                    size="small" :to="`/cpackage_pub/${item.id}?booknow`">
                                                    <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                                    Book now
                                                </v-btn>
                                            </v-col>

                                            <v-col cols="6">
                                                <v-btn color="secondary" variant="flat" size="small"
                                                    class="w-100 d-block" @click="clickFunModalbookin(item)">
                                                    <CalendarIcon stroke-width="1.5" size="18" class="mr-2" />
                                                    Send Enquiry
                                                </v-btn>
                                            </v-col>
                                            <v-dialog v-model="item.dialogbooking" persistent class="dialog-mw"
                                                size="small">
                                                <v-card class="pa-6">
                                                    <div class="d-flex justify-space-between">
                                                        <h4
                                                            class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold text-dark ">
                                                            Send Enquiry For - {{ item.category.name }} </h4>
                                                        <v-btn icon color="" @click="item.dialogbooking = false" flat
                                                            variant="outlined" size="x-small" class="bg-error">
                                                            <XIcon width="20" />
                                                        </v-btn>
                                                    </div>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <VTextField type="text" maxlength="50" v-model="name"
                                                                placeholder="Name" hide-details @keyup="checklength()">
                                                            </VTextField>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <VTextField type="email" maxlength="100" v-model="email_id"
                                                                placeholder="Email" hide-details :rules="emailRules"
                                                                @keyup="checklength()"></VTextField>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <VTextField type="text" maxlength="10" v-model="phone_no"
                                                                placeholder="Phone No" hide-details
                                                                :rules="phonenoRules" @keyup="checklength()">
                                                            </VTextField>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <VTextarea v-model="msg" auto-grow placeholder="Message"
                                                                rows="5" color="primary" row-height="25" shaped
                                                                hide-details></VTextarea>
                                                        </v-col>
                                                        <v-col v-if="item.vendor" cols="12" class="text-center">
                                                            <v-btn
                                                                @click="send_inquiry('Package_User', 'vendor', item.vendor.id)"
                                                                flat class="submit_btn bg-dark text-white mb-5">Send An
                                                                enquiry </v-btn>
                                                        </v-col>
                                                        <v-col v-else cols="12" class="text-center">

                                                            <v-btn
                                                                @click="send_inquiry('Package_User', 'admin', item.admin.id)"
                                                                flat class="submit_btn bg-dark text-white mb-5">Send An
                                                                enquiry </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card>
                                            </v-dialog>
                                        </v-row>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </template>
            </v-row>

           
            <!-- <v-row class="py-4">
                <p class="pt-4 pb-4 p_text font-weight-regular aos-init aos-animate">Including well-crafted,
                    keyword-rich
                    content on your Services pages e.g wedding photography service page is essential for improving
                    search
                    engine visibility, attracting the right audience, and boosting your website’s overall performance.
                    By
                    strategically using targeted keywords such as "wedding photography packages" or "affordable wedding
                    photographer," you ensure that potential clients who are actively searching for these services can
                    easily find your page. Quality content also enhances the user experience by providing detailed
                    information about your services and packages, building trust and credibility, and ultimately
                    increasing
                    conversion rates. Furthermore, local keywords help improve your page’s ranking in local search
                    results,
                    making it easier for clients in your area to find you. An 800-word service page not only helps you
                    stand
                    out from competitors but also positions your business as an expert in the field, making it a crucial
                    element in attracting and retaining clients.
                </p>
            </v-row> -->
        



            <div class="py-4">

<!-- tab section  -->

                <!-- <v-card class="border-top border-bottom stickynavbar" elevation="0">
                    <v-card-item class="pa-0 rounded-0">
                        <v-tabs v-model="tab4" color="primary" class="">
                            <v-tab value="album" color="secondary">
                                <AlbumIcon stroke-width="1.5" width="20" class="v-icon--start" /> Albums
                            </v-tab>
                           
                        </v-tabs>

                    </v-card-item>
                </v-card> -->

                <!-- <v-divider></v-divider> -->
                <v-card-text v-if="productImages.length > 0" class="pa-4 mb-8">
                        <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 text-center">Stunning  
                        <span class="text-secondary">Wedding Moments</span>
                    </h3>
                    <v-row class=" mt-2">
                        <v-col v-if=" !productImages || productImages.length === 0">
                            <v-card elevation="0" class="text-center mt-6 border" color="">
                            <v-card-item class="mx-auto">
                                <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                <h5 class="pt-2 text-error font-weight-semibold">Currently, there are no albums available for this package!</h5>
                            </v-card-item>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <div class="position-relative">
                                <carousel ref="carouselfirstRefalbum" :settings="albumslideSettings"
                                :breakpoints="albumslideBreakpoints" class="overflow-hidden slider-reset  pe-3">
                                    <slide v-for="item in productImages" :key="item.id" class="pt-2 pb-5 px-2">
                                        <v-dialog v-model="dialog" fullscreen :scrim="false"
                                        transition="dialog-bottom-transition">
                                            <template v-slot:activator="{ props }">
                                                <v-card elevation="10" v-bind="props"
                                                    class="album-card-img d-flex align-end"
                                                    :style="{ backgroundImage: `url(${BASE_URL + item.background_image})` }"
                                                    @click='galleryimages = item.image_urls; album_pack_id = item.package_ids[0]'>
                                                    <v-card-item class="position-relative pa-3 w-100">
                                                        <h3
                                                            class="text-subtitle-1  font-weight-semibold text-white text-capitalize">
                                                            {{ item.name }} </h3>
                                                    </v-card-item>
                                                </v-card>
                                            </template>
                                            <v-card>
                                                <div dark
                                                    class="py-4 albumgallerypopupheader d-flex justify-space-between px-8"
                                                    color="">
                                                    <div>
                                                        <v-toolbar-title
                                                            class="v-card-title text-capitalize text-h5 text-secondary ps-0">All
                                                            Images from
                                                            this album</v-toolbar-title>
                                                        <!-- <div> -->
                                                            <v-btn flat size="small" color="primary" :to="`/cpackage_pub/${album_pack_id}`" class="">
                                                            <btn>View package</btn>
                                                            <!-- <h4>{{ album_pack_id }}</h4> -->
                                                        </v-btn>
                                                    <!-- </div> -->
                                                    </div>
                                                    <v-btn icon color="" @click="dialog = false" flat
                                                        variant="outlined" class="bg-error" size="small">
                                                        <XIcon width="20" />
                                                    </v-btn>
                                                    
                                                    

                                                </div>
                                                <v-card-item>
                                                    <v-row class="pa-2">
                                                        <v-col class="pa-2" cols="12" md="4" sm="6"
                                                            v-for="(card, index) in galleryimages" :key="index">
                                                            <v-card elevation="10" class="card-hover overflow-hidden" @click="showImg(index, galleryimages)">

                                                                <!-- <img :src="BASE_URL + card.image" alt="gallery" class="albumsingleimg rounded" /> -->

                                                                <template v-if="/\.(jpeg|jpg|png|gif|webp)$/i.test(card.image.split('?')[0])">
                                                        <img :src="BASE_URL + card.image" alt="gallery" class="albumsingleimg rounded" />
                                                    </template>
                                                    <template v-else-if="/\.(mp4|mov|avi|mkv|webm)$/i.test(card.image.split('?')[0])">
                                                        <video :src="BASE_URL + card.image" controls class="albumsingleimg rounded"></video>
                                                    </template>




                                                            </v-card>
                                                            <vue-easy-lightbox :visible="visibleRef"
                                                                :moveDisabled="moveDisabled" :imgs="imgs"
                                                                :index="indexRef" @hide="onHide" />
                                                        </v-col>
                                                    </v-row>
                                                </v-card-item>
                                            </v-card>
                                        </v-dialog>
                                    </slide>
                                </carousel>
                                <div class="carousel-arrows ctm_crousel">
                                    <button @click="prevfirstSlideAlbum" class="arrow-button prev">
                                        <span>
                                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                                        fill="#b4801c"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                    <button @click="nextfirstSlideAlbum" class="arrow-button next">
                                        <span>
                                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                                        fill="#b4801c"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </v-col>

                        

                    </v-row>
                </v-card-text>
            </div>




            <v-row v-if="all_review_data.length > 0">
                <v-col cols="12">
                    <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 text-center">Reviews & 
                        <span class="text-secondary">Testimonials</span>
                    </h3>
                </v-col>
               <v-col cols="12" md="12" class="d-flex gap-3">
                <!-- <v-card elevation="10" class="mb-4" v-for="(item, index) in all_review_data" :key="index"> -->
                <v-card elevation="10" class="mb-4" 
                    v-for="(item, index) in all_review_data.sort(() => Math.random() - 0.5).slice(0, 3)" 
                    :key="index">
                    <v-card-item class="d-flex pa-4">
                        <router-link :to="item.link" class="text-decoration-none text-dark">
                        <div>
                            <div class="d-flex align-center">
                                <!-- <router-link :to="item.link"> -->
                                <v-avatar size="60" color="primary" variant="flat" rounded="sm">
                                    <img :src="item.coupleimgphoto" :alt="item.img" width="60" />
                                </v-avatar>
                            <!-- </router-link> -->
                                <div class="ms-2">
                                    <h2 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary ms-1">
                                        <strong>{{ item.package_name }}</strong>
                                    </h2>
                                    <h4 class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary ms-1">
                                        {{
                                            item.coupleName }}</h4>
                                    <p class="text-body-2 text-13 ms-1  text-dark text-decoration-none">
                                       Sent on {{item.reviewppostedtime }}
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                    </router-link>
                        <div>
                            <v-rating half-increments v-model="item.rating" density="compact" color="warning"
                                    size="small" class="mt-3" readonly></v-rating>
                            <!-- <p class="text-body-1 mb-6 text-13">
                            {{ expandedReviews[index] ? item.reviewtext : truncateText(item.reviewtext) }}
                            <span class="text-primary cursor-pointer" @click="toggleReview(index)">
                                {{ expandedReviews[index] ? " Show Less" : " Read More" }}
                            </span>
                            </p> -->
                           
                            <p class="text-body-1 mb-6 text-13">
                                {{ truncateText(item.reviewtext) }}
                                <span class="text-primary cursor-pointer" 
                                    @click="$router.push({ path: item.link, state: { tab: 'reviews' } })">
                                    Read More
                                </span>
                            </p>



                        </div>
                    </v-card-item>
                </v-card>
               </v-col>
               
            </v-row>

           
                    <!-- <CategoryfilterFAQ :categoryId="searchcat" /> -->

        <v-container>
         <v-row v-if="all_faq_data.length > 0" class="justify-center align-center mb-15">
            <v-col
                v-for="item in all_faq_data"
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
                <!-- <p class="text-center mt-4 sailFont">
                {{ item.ctitle }}
                </p> -->
                <!-- <div class="text-center mt-4 sailFont" v-html="item.ctitle"></div>
                  -->
                <div class="text-center mt-4 sailFont" v-html="cleanHtmlContent(item.ctitle)"></div>


            </v-col>
            </v-row>

       
        <v-row class="justify-center ctm-faq align-center">
            <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                
                <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold ">
                    Frequently Asked Questions
                </h2>
               
            </v-col>
      
         
        <!-- <v-col cols="12" md="12"> 
                <v-expansion-panels v-if="all_faq_data && all_faq_data.length > 0" elevation="10">
                    <v-expansion-panel v-for="item in all_faq_data" :key="item.id" class="fq_s">
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
        </v-col> -->

        <v-col cols="12" md="12"> 
            <!-- Check if all_faq_data exists and has any faqs -->
            <template v-if="all_faq_data && all_faq_data.some(item => item.faqs && item.faqs.length)">
                <v-expansion-panels elevation="10">
                <v-expansion-panel v-for="item in all_faq_data" :key="item.id" class="fq_s">
                    <v-expansion-panels elevation="10">
                    <v-expansion-panel v-for="faq in item.faqs" :key="faq.id" class="fq_s">
                        <v-expansion-panel-title class="text-h6 py-6">{{ faq.question }}</v-expansion-panel-title>
                        <v-divider></v-divider>
                        <v-expansion-panel-text class="text-subtitle-1 text-10 text-medium-emphasis pt-3 pb-2 tx-fqs">
                        {{ faq.answer }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    </v-expansion-panels>
                </v-expansion-panel>
                </v-expansion-panels>
            </template>

            <!-- Else fallback -->
            <template v-else>
                <v-expansion-panels elevation="10">
                <v-expansion-panel v-for="item in tcontent['faq']?.faqs" :key="item.question" class="fq_s">
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
                   
                    <!-- <CategoryfilterFAQ :categoryId="searchcat?.value ?? searchcat" /> -->


                

            <v-row class="py-4">
                <v-col cols="12">
                    <h3 class="fontheading pb-0 mb-0 font-weight-bold ri-font-size-1 ">Related
                        <span class="text-secondary">Services</span>
                    </h3>
                    <p class="text-13 text-body-1 text-primary">Choosing the Perfect Service for Your
                        Wedding</p>
                </v-col>
                <v-col cols="12" class="position-relative">
                    <carousel ref="carouselfirstRef" :settings="vendorslideSettings"
                        :breakpoints="vendorslideBreakpoints" class="overflow-hidden slider-reset  pe-3">
                        <slide v-for="item in all_random_pack" :key="item.id" class="pt-2 pb-5 px-2">
                            <v-card elevation="0"
                                class="customer-card vendor-card-hover bg-grey100">
                                <v-card-item class="pa-4">
 
                                   <!-- <v-col cols="12" md="4" v-for="(item, index) in all_random_pack.sort(() => Math.random() - 0.5).slice(0,3)" :key="index" class="position-relative"> -->

                                    <router-link :to="`/cpackage_pub/${item.id}`"
                                        class="w-100 text-decoration-none position-relative">
                                        <div class="position-relative d-flex overflow-hidden img-order vendorsc-section">
                                            <img v-if="item.package_logo !== '/media/default.jpg'"
                                                :src="BASE_URL + item.package_logo" class="vendormainimg vendormainimgnew">
                                            <img v-else :src="item.serviceimg1" class="vendormainimg vendormainimgnew">
                                            <v-chip rounded="sm"
                                    class="ma-2 font-weight-semibold bg-secondary badge-service" size="small"
                                    label>{{item.category.name}} </v-chip>
                                        </div>
                                    </router-link>
                                   
                                    <div class="top-ctsection">
                                        <div class="mt-2 w-100">
                                            <div class="d-flex justify-space-between">
                                                <v-rating half-increments disabled v-model="item.iratings" density="compact"
                                                    color="warning" size="small"></v-rating>
                                                <h4
                                                    class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                    ${{ item.price }}
                                                </h4>
                                            </div>
                                            <h4 class="text-subtitle-1  font-weight-semibold textSecondary text-start text-ellipsis">
                                                {{item.name }} 
                                            </h4>
                                        </div>
                                        <div class="text-start">
                                            <p v-if="item.advance_payment">
                                            <h6 v-if="item.advance_payment" class="text-body-2 text-13"><span
                                                    class="font-weight-semibold">Deposit
                                                    :</span>$ {{ parseInt(item.advance_payment / 100 * item.price) }} ({{
                                                item.advance_payment }}% of $ {{ item.price }})
                                            </h6>
                                            </p>
                                            <p v-else="item.full_price">
                                            <h6 v-if="item.full_price" class="text-body-2 text-13"><span
                                                    class="font-weight-semibold">Deposit
                                                    :</span>$ {{ parseInt(item.full_price) }}
                                                ({{ ((item.full_price / item.price) * 100).toFixed(2) }}% of $ {{ item.price
                                                }})
                                            </h6>
                                            </p>

                                            <h6 v-if="item.vendor" class="text-body-2 font-weight-semibold mb-0 "><span
                                                    class="font-weight-medium">Offered by :</span>
                                                {{ item.vendor.userprofile.user.first_name }} {{
                                                item.vendor.userprofile.user.last_name }}
                                            </h6>
                                            <h6 v-else class="text-body-2 font-weight-semibold mb-0 "><span
                                                    class="font-weight-medium">Offered by :</span> {{
                                                item.admin.userprofile.user.first_name }} {{
                                                item.admin.userprofile.user.last_name }}
                                            </h6>
                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>


                        </slide>
                    </carousel>
                    <div class="carousel-arrows ctm_crousel">
                        <button @click="prevfirstSlide" class="arrow-button prev">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                            fill="#b4801c"></path>
                                    </g>
                                </svg>
                            </span>
                        </button>
                        <button @click="nextfirstSlide" class="arrow-button next">
                            <span>
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                                            fill="#b4801c"></path>
                                    </g>
                                </svg>
                            </span>
                        </button>
                    </div>
                </v-col>
            </v-row>


        </v-container>
    </div>
    <Footer />
</template>


<style>
@import "https://kendo.cdn.telerik.com/themes/5.1.1/default/default-main.css";


.review_bt {
    top: -16px;
}
.ctm-save {
    z-index: 2;
    background-color: #bd8f38;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
}
.ctm-save-later {
    z-index: 2;
    background-color: #bd8f38;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
}
.vendormainimgnew {
    width: 100%;
    height: 200px;
    object-fit: cover;
    margin-top: 16px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.vendor-card-background {
    min-height: 150px;
}

.ctm_crousel button.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
}

.packages-sc {
    margin-top: -50px;
}

.ctm_crousel button.arrow-button span {
    display: flex;
    background: #fff;
    width: 30px;
    height: 47px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0px 2px 16.8px 3.2px rgba(0, 38, 66, 0.08);
}

.ctm_crousel button.arrow-button.next {
    right: 12px;
}

.k-calendar .k-nav-today,
.k-calendar .k-calendar-view .k-today,
.k-calendar .k-nav-today:focus {
    color: #002642;
    font-weight: 700;
}

.k-calendar .k-calendar-td.k-selected span.k-link,
.k-calendar .k-calendar-td.k-selected span.k-link:hover {
    background-color: #002642;
    color: #fff;
}

.package {

    position: relative;
    overflow: hidden;
}

.package_s {
    content: "";
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
}

@-webkit-keyframes infiniteScroll {
    0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }

    100% {
        -webkit-transform: translate3d(0, -1692px, 0);
        transform: translate3d(0, -1692px, 0);
    }
}

@keyframes infiniteScroll {
    0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }

    100% {
        -webkit-transform: translate3d(0, -1692px, 0);
        transform: translate3d(0, -1692px, 0);
    }
}

.review_section {
    box-shadow: 0 0 10px #0000001f;
    background: #f3f3f3;
    padding: 10px 10px 25px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    min-height: 210px;
}

.wishlist-icon {
    position: absolute;
    left: 19px;
    top: 32px;
    z-index: 1;
}

.viewServiceBtn {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    opacity: 1;
    transition: 0.38s ease-in-out 0s all;
}

.review_section.content-order h6 {
    color: #000 !important;
}

.vendormainimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.top-ctsection {
    background: aliceblue;
    padding: 30px 20px;
    margin-top: -49px;
    z-index: 999;
    margin: -44px 10px 0 10px;
    border-radius: 10px;
    position: relative;
    z-index: 1;
}

.bg-custom-white {
    background: #fff !important;
}

.vendorsc-section {
    z-index: 0 !important;
}

.vendormainimgnew{
    margin-top: 0px;
}
.album-card-img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 150px;
    position: relative;
    overflow: hidden;
}

.album-card-img:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 37%, #000000fc 80%);
    left: 0;
    top: 0;
    opacity: 0.6;
}

.v-card-item {
    z-index: 1;
}
.albumsingleimg {
    width: 100%;
    height: 250px;
    object-fit: cover;
}










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
